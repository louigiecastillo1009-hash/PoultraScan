import os
import time
import uuid
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status, UploadFile
from PIL import UnidentifiedImageError

from models.detected_chicken import DetectedChicken
from models.chicken_image import ChickenImage
from models.ai_prediction import AIPrediction
from models.scan_summary import ScanSummary
from models.farm import Farm
from models.scan_photo import ScanPhoto
from utils.image_compression import compress_image
from utils.image_converter import convert_to_jpeg
from utils.image_cropper import crop_chicken_image
from utils.image_storage import save_compressed_image, UPLOAD_DIR
from utils.gemini_client import get_disease_insights_batch, GeminiInsightsError
from utils.gemini_disease_classifier import (
    classify_diseases_batch_with_gemini,
    DiseaseClassificationError,
    CANNOT_ASSESS_USER_MESSAGE,
)
from utils.openrouter_vision import (
    classify_diseases_batch_openrouter,
    get_disease_insights_batch_openrouter,
    OpenRouterVisionError,
)
from utils.market_readiness import assess_market_readiness

from services.scan_summary_service import ScanSummaryService
from services.notification_service import NotificationService
from schemas.notification_schema import CreateNotificationSchema
from models.scan_session import ScanSession, ScanStatus

MAX_FILE_SIZE_MB = 10
UPLOAD_DIR = os.path.join("static", "uploads", "chicken_images")

os.makedirs(UPLOAD_DIR, exist_ok=True)


class AIPredictionService:
    @staticmethod
    def assessment_status(disease, model):
        # Only a retake (bad framing / truly unusable photo) is not
        # assessable. A usable photo with no specific condition (UNKNOWN)
        # is still an assessed observation: "no clear signs detected".
        if disease == "CANNOT_ASSESS":
            return "RETAKE"
        if model == "n/a":
            return "UNAVAILABLE"
        return "ASSESSED"

    @staticmethod
    def _effective_values(chicken, prediction=None):
        """User correction wins; the original AI estimate stays intact."""
        measured_weight = chicken.measured_weight_kg
        measured_oil = chicken.measured_oil_ml
        estimated_weight = prediction.estimated_weight if prediction is not None else None
        estimated_oil = prediction.estimated_oil_ml if prediction is not None else None

        weight = measured_weight if measured_weight is not None else estimated_weight
        oil = measured_oil if measured_oil is not None else estimated_oil
        return {
            "effective_weight": float(weight) if weight is not None else None,
            "effective_oil_ml": float(oil) if oil is not None else None,
            "weight_source": "user" if measured_weight is not None else ("ai" if estimated_weight is not None else None),
            "oil_source": "user" if measured_oil is not None else ("ai" if estimated_oil is not None else None),
        }

    @staticmethod
    def _measurement_response(db, chicken):
        prediction = (
            db.query(AIPrediction)
            .filter(AIPrediction.detected_chicken_id == chicken.id)
            .order_by(AIPrediction.id.desc())
            .first()
        )
        session = db.query(ScanSession).filter(ScanSession.id == chicken.scan_session_id).first()
        effective = AIPredictionService._effective_values(chicken, prediction)
        healthy = (
            AIPredictionService._is_healthy(prediction.disease, prediction.disease_confidence)
            if prediction is not None else None
        )
        readiness = assess_market_readiness(effective["effective_weight"], healthy)
        return {
            "detected_chicken_id": chicken.id,
            "measured_weight_kg": float(chicken.measured_weight_kg) if chicken.measured_weight_kg is not None else None,
            "measured_height_cm": float(chicken.measured_height_cm) if chicken.measured_height_cm is not None else None,
            "measured_oil_ml": float(chicken.measured_oil_ml) if chicken.measured_oil_ml is not None else None,
            **effective,
            **readiness,
        }

    @staticmethod
    def save_measurements(db, chicken_id, user_id, measurements):
        chicken = db.query(DetectedChicken).filter(DetectedChicken.id == chicken_id).first()
        if chicken is None:
            raise HTTPException(404, "Chicken observation not found")
        AIPredictionService.require_owned_session(db, chicken.scan_session_id, user_id)
        for field, value in measurements.model_dump(exclude_unset=True).items():
            setattr(chicken, field, value)
        db.commit()
        db.refresh(chicken)

        response = AIPredictionService._measurement_response(db, chicken)
        prediction = (
            db.query(AIPrediction)
            .filter(AIPrediction.detected_chicken_id == chicken.id)
            .order_by(AIPrediction.id.desc())
            .first()
        )
        if prediction is not None:
            prediction.market_ready = response["market_ready"]
            db.commit()
            # Keep the session summary in step with the user's correction.
            try:
                ScanSummaryService.recalculate_for_session(db, chicken.scan_session_id)
            except Exception as error:
                print(f"[SUMMARY WARNING] Could not recalculate summary: {error}")

        return response

    @staticmethod
    def require_owned_session(db: Session, session_id: int, user_id: int):
        session = db.query(ScanSession).join(Farm, Farm.id == ScanSession.farm_id).filter(
            ScanSession.id == session_id, Farm.user_id == user_id
        ).first()
        if session is None:
            raise HTTPException(404, "Scan session not found")
        return session

    # A chicken is only shown as "Not Healthy" when a SPECIFIC condition was
    # identified AND the model is reasonably confident. Anything uncertain
    # (UNKNOWN, low confidence, failed classification, bad camera framing)
    # is shown neutrally — never as a confirmed illness. Set at 80 so a
    # single ambiguous visual cue cannot make a clean bird look sick.
    MIN_FLAG_CONFIDENCE = 80.0

    # Label stored/returned when the camera framing (too close / too far /
    # unclear) makes an honest size + health assessment impossible.
    CANNOT_ASSESS = "CANNOT_ASSESS"

    QUOTA_EXHAUSTED_MESSAGE = (
        "Some AI analysis is temporarily unavailable. Free limits may have "
        "been reached, or a provider may be unavailable. Available results "
        "are saved. Try again later; the reset time is not known."
    )

    @staticmethod
    def _is_healthy(disease_name: str, confidence_score) -> bool | None:
        """
        Healthy/not-healthy tri-state: True for healthy, False only when
        there is a specific non-healthy finding at sufficient confidence,
        and None when the photo could not be assessed (UNKNOWN /
        CANNOT_ASSESS). None must never be counted or displayed as healthy.
        """
        if disease_name == "HEALTHY":
            return True
        if disease_name in ("UNKNOWN", AIPredictionService.CANNOT_ASSESS):
            return None
        if confidence_score is None:
            return None
        if float(confidence_score) < AIPredictionService.MIN_FLAG_CONFIDENCE:
            return None
        return False

    @staticmethod
    def _display_status(disease_name: str, confidence_score) -> str:
        """
        The API response says "Healthy", "Not Healthy", or one of the
        neutral states. "No clear signs detected" is used when no specific,
        sufficiently confident condition was found — it is not an illness
        label and must not be styled as one.
        """
        if disease_name == AIPredictionService.CANNOT_ASSESS:
            return AIPredictionService.CANNOT_ASSESS
        if disease_name == "UNKNOWN":
            return "No clear signs detected"
        status = AIPredictionService._is_healthy(disease_name, confidence_score)
        if status is None:
            return "No clear signs detected"
        if status:
            return "Healthy"
        return "Not Healthy"

    @staticmethod
    def _validate_file(file: UploadFile, contents: bytes):
        if not file or not file.filename:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "No image file was provided.")

        if not contents:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Uploaded image file is empty.")

        size_mb = len(contents) / (1024 * 1024)
        if size_mb > MAX_FILE_SIZE_MB:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                f"File too large ({size_mb:.2f} MB). Max allowed is {MAX_FILE_SIZE_MB} MB"
            )

        try:
            convert_to_jpeg(contents)
        except UnidentifiedImageError:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Unsupported or corrupted image file.")
        except Exception as e:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Failed to process image: {str(e)}")

    @staticmethod
    def _save_image_to_disk(image_bytes: bytes) -> str:
        return save_compressed_image(image_bytes)

    @staticmethod
    def _classify_diseases_with_fallback(crops: list[bytes], chicken_count: int) -> tuple[list[dict], bool]:
        """
        Tries Gemini's batch disease classification first. If every free
        Gemini model fails (quota/rate-limit exhaustion), falls back to
        OpenRouter's batch classification. If that also fails, returns
        UNKNOWN placeholders so the scan can still complete.

        Returns (classifications, quota_exhausted) — quota_exhausted is
        True only when BOTH providers failed, so the frontend can show
        the "try again later" modal.
        """
        if len(crops) > 4:
            results, unavailable = [], False
            for offset in range(0, len(crops), 4):
                chunk = crops[offset:offset + 4]
                items, failed = AIPredictionService._classify_diseases_with_fallback(chunk, len(chunk))
                results.extend(items)
                unavailable |= failed
            return results, unavailable
        try:
            return classify_diseases_batch_with_gemini(crops), False
        except DiseaseClassificationError as e:
            print(f"[PREDICTION WARNING] Gemini batch classification failed: {e}. Falling back to OpenRouter...")

        try:
            return classify_diseases_batch_openrouter(crops), False
        except OpenRouterVisionError as e:
            print(f"[PREDICTION WARNING] OpenRouter batch classification also failed: {e}")

        return [{
            "disease_name": "UNKNOWN",
            "confidence_score": 0.0,
            "reasoning": "AI classification was temporarily unavailable (rate limit), so this chicken could not be assessed.",
            "framing": "OK",
            "model_used": "n/a",
        } for _ in range(chicken_count)], True

    @staticmethod
    def _get_insights_with_fallback(insight_items: list[dict]) -> tuple[list[dict], bool]:
        """
        Tries Gemini's batch weight/oil/tips insights first. If every
        free Gemini model fails, falls back to OpenRouter's batch
        insights. If that also fails, returns zeroed-out defaults so the
        scan can still complete.

        Returns (insights, quota_exhausted) — quota_exhausted is True
        only when BOTH providers failed.
        """
        if len(insight_items) > 4:
            results, unavailable = [], False
            for offset in range(0, len(insight_items), 4):
                items, failed = AIPredictionService._get_insights_with_fallback(insight_items[offset:offset + 4])
                results.extend(items)
                unavailable |= failed
            return results, unavailable
        try:
            return get_disease_insights_batch(insight_items), False
        except GeminiInsightsError as e:
            print(f"[PREDICTION WARNING] Gemini batch insights failed: {e}. Falling back to OpenRouter...")

        try:
            return get_disease_insights_batch_openrouter(insight_items), False
        except OpenRouterVisionError as e:
            print(f"[PREDICTION WARNING] OpenRouter batch insights also failed: {e}")

        return [{
            "tips": "No condition observation was generated for this photo.",
            "estimated_weight": 0.0,
            "weight_confidence": 0.0,
            "estimated_oil_ml": 0.0,
            "market_ready": False
        } for _ in insight_items], True

    @staticmethod
    def _finalize_single_chicken(
        db: Session,
        detected_chicken: DetectedChicken,
        crop_bytes: bytes,
        classification: dict,
        insights: dict,
        angle: str,
        start_time: float,
    ) -> dict:
        disease_name = classification["disease_name"]
        confidence_score = classification["confidence_score"]
        reasoning = classification.get("reasoning", "")
        model_used = classification.get("model_used", "unknown")
        unavailable = model_used == "n/a"
        cannot_assess = disease_name == AIPredictionService.CANNOT_ASSESS or unavailable

        image_url = AIPredictionService._save_image_to_disk(crop_bytes)
        chicken_image = ChickenImage(
            detected_chicken_id=detected_chicken.id,
            image_type=angle,
            image_url=image_url
        )
        db.add(chicken_image)
        db.commit()
        db.refresh(chicken_image)

        if cannot_assess:
            # Bad framing or unavailable provider — never fabricate weight
            # or a health conclusion. The card asks for a retake or retry.
            insights_final = {
                "tips": reasoning or CANNOT_ASSESS_USER_MESSAGE,
                "estimated_weight": 0.0,
                "weight_confidence": 0.0,
                "estimated_oil_ml": 0.0,
            }
        else:
            insights_final = insights or {
                "tips": "No condition observation was generated for this photo.",
                "estimated_weight": 0.0,
                "weight_confidence": 0.0,
                "estimated_oil_ml": 0.0,
            }

        healthy = AIPredictionService._is_healthy(disease_name, confidence_score)
        severity = "UNKNOWN" if cannot_assess else ("MEDIUM" if healthy is False else "NONE")

        estimated_weight = insights_final.get("estimated_weight") or None
        estimated_oil = insights_final.get("estimated_oil_ml") or None
        measured_weight = detected_chicken.measured_weight_kg
        measured_oil = detected_chicken.measured_oil_ml
        effective_weight = (
            float(measured_weight) if measured_weight is not None
            else (float(estimated_weight) if estimated_weight is not None else None)
        )
        effective_oil = (
            float(measured_oil) if measured_oil is not None
            else (float(estimated_oil) if estimated_oil is not None else None)
        )
        readiness = assess_market_readiness(effective_weight, healthy)

        processing_time_ms = int((time.time() - start_time) * 1000)

        # The raw disease label is still stored for the record. No treatment
        # or medicine advice is generated or returned — this app only
        # reports visible condition, count, weight and oil estimates.
        ai_prediction = AIPrediction(
            detected_chicken_id=detected_chicken.id,
            disease=disease_name,
            disease_confidence=confidence_score,
            estimated_weight=estimated_weight,
            estimated_oil_ml=estimated_oil,
            weight_confidence=insights_final.get("weight_confidence") if estimated_weight else None,
            market_ready=readiness["market_ready"],
            care_tips=insights_final.get("tips"),
            breed=None,
            recommendation=None,
            prevention_tips=None,
            severity=severity,
            model_name="gemini_disease_classifier",
            model_version=model_used,
            processing_time_ms=processing_time_ms
        )

        db.add(ai_prediction)
        db.commit()
        db.refresh(ai_prediction)

        return {
            "detected_chicken_id": detected_chicken.id,
            "measured_weight_kg": float(measured_weight) if measured_weight is not None else None,
            "measured_height_cm": float(detected_chicken.measured_height_cm) if detected_chicken.measured_height_cm is not None else None,
            "measured_oil_ml": float(measured_oil) if measured_oil is not None else None,
            "assessment_status": AIPredictionService.assessment_status(disease_name, model_used),
            "tracking_id": detected_chicken.tracking_id,
            "chicken_image_id": chicken_image.id,
            "image_url": image_url,
            "ai_prediction_id": ai_prediction.id,
            "disease": AIPredictionService._display_status(disease_name, confidence_score),
            "confidence": confidence_score,
            "healthy": healthy,
            "assessable": not cannot_assess,
            "cannot_assess_reason": (reasoning or CANNOT_ASSESS_USER_MESSAGE) if cannot_assess else None,
            "reasoning": reasoning,
            "angle": angle,
            "estimated_weight": float(estimated_weight) if estimated_weight is not None else None,
            "weight_confidence": float(ai_prediction.weight_confidence) if ai_prediction.weight_confidence is not None else None,
            "estimated_oil_ml": float(estimated_oil) if estimated_oil is not None else None,
            "effective_weight": effective_weight,
            "effective_oil_ml": effective_oil,
            "weight_source": "user" if measured_weight is not None else ("ai" if estimated_weight is not None else None),
            "oil_source": "user" if measured_oil is not None else ("ai" if estimated_oil is not None else None),
            "market_target_kg": readiness["market_target_kg"],
            "market_ready": readiness["market_ready"],
            "market_ready_label": readiness["market_ready_label"],
            "market_ready_note": readiness["market_ready_note"],
            "care_tips": ai_prediction.care_tips,
            "breed": ai_prediction.breed,
            "recommendation": ai_prediction.recommendation,
            "prevention_tips": ai_prediction.prevention_tips,
            "severity": ai_prediction.severity,
            "model_name": ai_prediction.model_name,
            "model_version": ai_prediction.model_version,
            "processing_time_ms": processing_time_ms,
            "created_at": ai_prediction.created_at,
        }

    @staticmethod
    def predict(db: Session, scan_session_id: int, image_type: str, file: UploadFile = None):
        start_time = time.time()

        photos = (
            db.query(ScanPhoto)
            .filter(ScanPhoto.scan_session_id == scan_session_id)
            .all()
        )

        detected_chickens = (
            db.query(DetectedChicken)
            .filter(
                DetectedChicken.scan_session_id == scan_session_id,
                DetectedChicken.bounding_box_x.isnot(None),
                DetectedChicken.bounding_box_y.isnot(None),
                DetectedChicken.bounding_box_width.isnot(None),
                DetectedChicken.bounding_box_height.isnot(None),
            )
            .order_by(DetectedChicken.tracking_id)
            .all()
        )

        if not detected_chickens:
            raise HTTPException(
                status.HTTP_400_BAD_REQUEST,
                "No valid detected chickens found for this scan session. Run detection first."
            )

        # A repeated submission with complete, assessable saved results should
        # return them instead of charging the provider or duplicating rows.
        existing = AIPredictionService.get_predictions_for_session(db, scan_session_id)
        if existing and len(existing) == len(detected_chickens) and all(
            chicken["assessable"] for chicken in existing
        ):
            return {"chickens": existing, "total_chickens": len(existing),
                    "total_weight": round(sum(c["effective_weight"] or 0 for c in existing), 2),
                    "total_oil_ml": round(sum(c["effective_oil_ml"] or 0 for c in existing), 2),
                    "market_ready_count": sum(bool(c["market_ready"]) for c in existing)}

        if existing:
            # Retry after a partial/quota failure: replace this session's prior
            # predictions, crops and summary so a retry cannot duplicate rows
            # or leave stale counts in history.
            chicken_ids = [chicken.id for chicken in detected_chickens]
            db.query(AIPrediction).filter(
                AIPrediction.detected_chicken_id.in_(chicken_ids)
            ).delete(synchronize_session=False)
            db.query(ChickenImage).filter(
                ChickenImage.detected_chicken_id.in_(chicken_ids)
            ).delete(synchronize_session=False)
            db.query(ScanSummary).filter(
                ScanSummary.scan_session_id == scan_session_id
            ).delete(synchronize_session=False)
            db.commit()

        if photos:
            # Multi-angle / saved-photo path: every detection is linked to
            # the ScanPhoto it came from, so each chicken is cropped from
            # the correct image. The frontend does NOT need to re-upload.
            photo_by_id = {photo.id: photo for photo in photos}
            crops = []
            angles = []
            for chicken in detected_chickens:
                photo = photo_by_id.get(chicken.scan_photo_id)
                if photo is None:
                    raise HTTPException(
                        status.HTTP_400_BAD_REQUEST,
                        "Scan photo is missing for a detected chicken. Please run detection again."
                    )
                photo_path = os.path.join(UPLOAD_DIR, os.path.basename(photo.image_url))
                if not os.path.exists(photo_path):
                    # Render free-tier restarts can wipe the uploads disk —
                    # without the source photo we cannot crop honestly.
                    raise HTTPException(
                        status.HTTP_400_BAD_REQUEST,
                        "Saved scan photos are no longer available on the server. Please run the scan again."
                    )
                with open(photo_path, "rb") as f:
                    photo_bytes = f.read()
                crops.append(
                    crop_chicken_image(
                        photo_bytes,
                        chicken.bounding_box_x, chicken.bounding_box_y,
                        chicken.bounding_box_width, chicken.bounding_box_height,
                    )
                )
                angles.append(photo.angle)
        else:
            # Legacy single-photo path: crop from the uploaded file
            # (sessions detected before ScanPhoto existed).
            if not file:
                raise HTTPException(
                    status.HTTP_400_BAD_REQUEST,
                    "No image file was provided and this scan session has no saved photos."
                )

            contents = file.file.read()
            AIPredictionService._validate_file(file, contents)

            crops = [
                crop_chicken_image(
                    contents,
                    c.bounding_box_x, c.bounding_box_y,
                    c.bounding_box_width, c.bounding_box_height,
                )
                for c in detected_chickens
            ]
            angles = [image_type] * len(detected_chickens)

        # ONE call classifies ALL chickens' disease status — Gemini first,
        # OpenRouter fallback if every free Gemini model is exhausted.
        classifications, classification_exhausted = AIPredictionService._classify_diseases_with_fallback(
            crops, len(detected_chickens)
        )

        # ONE call estimates weight/oil/observation for every usable crop.
        # Only a retake (CANNOT_ASSESS) or an unavailable provider is
        # skipped. UNKNOWN means "no specific condition found", so the
        # bird is still usable for a weight estimate.
        assessable_indices = [
            i for i, classification in enumerate(classifications)
            if classification.get("disease_name") != AIPredictionService.CANNOT_ASSESS
            and classification.get("model_used") != "n/a"
        ]
        insight_items = [
            {
                "disease": classifications[i]["disease_name"],
                "confidence": classifications[i]["confidence_score"],
                "image_bytes": crops[i],
            }
            for i in assessable_indices
        ]
        insights_assessable, insights_exhausted = (
            AIPredictionService._get_insights_with_fallback(insight_items)
            if insight_items else ([], False)
        )
        insights_list = [None] * len(classifications)
        for idx, insights in zip(assessable_indices, insights_assessable):
            insights_list[idx] = insights

        quota_exhausted = classification_exhausted or insights_exhausted

        session = db.query(ScanSession).filter(ScanSession.id == scan_session_id).first()

        # Everything past this point is DB writes — no additional vision
        # quota is used no matter how many chickens.
        chickens_result = []
        for chicken, crop_bytes, classification, insights, angle in zip(
            detected_chickens, crops, classifications, insights_list, angles
        ):
            chickens_result.append(
                AIPredictionService._finalize_single_chicken(
                    db, chicken, crop_bytes, classification, insights, angle, start_time
                )
            )

        total_weight = round(sum(c["effective_weight"] or 0 for c in chickens_result), 2)
        total_oil_ml = round(sum(c["effective_oil_ml"] or 0 for c in chickens_result), 2)
        market_ready_count = sum(1 for c in chickens_result if c["market_ready"])

        if session:
            session.status = ScanStatus.FAILED if quota_exhausted else ScanStatus.COMPLETED
            session.finished_at = func.now()
            db.commit()

            farm = db.query(Farm).filter(Farm.id == session.farm_id).first()
            if farm:
                diseased = [c for c in chickens_result if c["healthy"] is False]

                NotificationService.create(
                    db,
                    CreateNotificationSchema(
                        user_id=farm.user_id,
                        title="Scan completed",
                        message=f"{farm.farm_name}: {len(chickens_result)} chickens analyzed, {len(diseased)} flagged.",
                    ),
                )

                if diseased:
                    NotificationService.create(
                        db,
                        CreateNotificationSchema(
                            user_id=farm.user_id,
                            title="Disease alert",
                            message=f"{farm.farm_name}: {len(diseased)} chicken(s) flagged as not healthy.",
                        ),
                    )

        try:
            ScanSummaryService.generate_for_session(db, scan_session_id)
        except HTTPException as e:
            print(f"[SUMMARY WARNING] Could not generate scan summary: {e.detail}")
        except Exception as e:
            # Predictions are already persisted — a summary/db hiccup must
            # never turn a successful scan into a 500 for the user.
            print(f"[SUMMARY WARNING] Could not generate scan summary: {e}")

        return {
            "chickens": chickens_result,
            "quota_exhausted": quota_exhausted,
            "quota_message": AIPredictionService.QUOTA_EXHAUSTED_MESSAGE if quota_exhausted else None,
            "total_chickens": len(chickens_result),
            "total_weight": total_weight,
            "total_oil_ml": total_oil_ml,
            "market_ready_count": market_ready_count,
        }

    @staticmethod
    def get_predictions_for_session(db: Session, scan_session_id: int) -> list[dict]:
        """
        Fetches every chicken detected in this scan session along with its
        latest AI prediction (disease, confidence, breed, recommendation,
        prevention tips, severity, care tips) and its saved crop image —
        joined from DetectedChicken -> AIPrediction -> ChickenImage.
        """
        rows = (
            db.query(DetectedChicken, AIPrediction, ChickenImage)
            .join(AIPrediction, AIPrediction.detected_chicken_id == DetectedChicken.id)
            .outerjoin(ChickenImage, ChickenImage.detected_chicken_id == DetectedChicken.id)
            .filter(DetectedChicken.scan_session_id == scan_session_id)
            .order_by(DetectedChicken.tracking_id)
            .all()
        )

        results = []
        for chicken, prediction, image in rows:
            confidence = float(prediction.disease_confidence) if prediction.disease_confidence is not None else None
            effective = AIPredictionService._effective_values(chicken, prediction)
            healthy = AIPredictionService._is_healthy(prediction.disease, confidence)
            readiness = assess_market_readiness(effective["effective_weight"], healthy)
            results.append({
                "detected_chicken_id": chicken.id,
                "measured_weight_kg": float(chicken.measured_weight_kg) if chicken.measured_weight_kg is not None else None,
                "measured_height_cm": float(chicken.measured_height_cm) if chicken.measured_height_cm is not None else None,
                "measured_oil_ml": float(chicken.measured_oil_ml) if chicken.measured_oil_ml is not None else None,
                "assessment_status": AIPredictionService.assessment_status(prediction.disease, prediction.model_version),
                "tracking_id": chicken.tracking_id,
                "chicken_image_id": image.id if image else None,
                "image_url": image.image_url if image else None,
                "ai_prediction_id": prediction.id,
                "disease": AIPredictionService._display_status(prediction.disease, confidence),
                "confidence": confidence,
                "healthy": healthy,
                "reasoning": None,
                "angle": image.image_type if image else None,
                "assessable": AIPredictionService.assessment_status(prediction.disease, prediction.model_version) == "ASSESSED",
                "cannot_assess_reason": prediction.care_tips if prediction.disease in ("UNKNOWN", "CANNOT_ASSESS") else None,
                "weight_confidence": float(prediction.weight_confidence) if prediction.weight_confidence is not None else None,
                "estimated_weight": float(prediction.estimated_weight) if prediction.estimated_weight is not None else None,
                "estimated_oil_ml": float(prediction.estimated_oil_ml) if prediction.estimated_oil_ml is not None else None,
                **effective,
                "market_target_kg": readiness["market_target_kg"],
                "market_ready": readiness["market_ready"],
                "market_ready_label": readiness["market_ready_label"],
                "market_ready_note": readiness["market_ready_note"],
                "care_tips": prediction.care_tips,
                "breed": prediction.breed,
                "recommendation": prediction.recommendation,
                "prevention_tips": prediction.prevention_tips,
                "severity": prediction.severity,
                "model_name": prediction.model_name,
                "model_version": prediction.model_version,
                "processing_time_ms": prediction.processing_time_ms,
                "created_at": prediction.created_at,
            })

        return results
