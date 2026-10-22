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
from models.farm import Farm
from utils.image_compression import compress_image
from utils.image_converter import convert_to_jpeg
from utils.image_cropper import crop_chicken_image
from utils.gemini_client import get_disease_insights_batch, GeminiInsightsError
from utils.gemini_disease_classifier import (
    classify_diseases_batch_with_gemini,
    DiseaseClassificationError,
)
from utils.openrouter_vision import (
    classify_diseases_batch_openrouter,
    get_disease_insights_batch_openrouter,
    OpenRouterVisionError,
)
from utils.openai_recommendation import get_disease_recommendation, RecommendationError

from services.scan_summary_service import ScanSummaryService
from services.notification_service import NotificationService
from schemas.notification_schema import CreateNotificationSchema
from models.scan_session import ScanSession, ScanStatus

MAX_FILE_SIZE_MB = 10
UPLOAD_DIR = os.path.join("static", "uploads", "chicken_images")

os.makedirs(UPLOAD_DIR, exist_ok=True)


class AIPredictionService:

    @staticmethod
    def _display_status(disease_name: str) -> str:
        """
        UNKNOWN (classification failed) is treated as Not Healthy so a
        failed scan never gets shown to the user as a clean bill of health.
        """
        return "Healthy" if disease_name == "HEALTHY" else "Not Healthy"

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
        compressed_bytes, extension = compress_image(image_bytes)
        filename = f"{uuid.uuid4().hex}.{extension}"
        filepath = os.path.join(UPLOAD_DIR, filename)

        with open(filepath, "wb") as f:
            f.write(compressed_bytes)

        return f"/static/uploads/chicken_images/{filename}"

    @staticmethod
    def _classify_diseases_with_fallback(crops: list[bytes], chicken_count: int) -> list[dict]:
        """
        Tries Gemini's batch disease classification first. If every free
        Gemini model fails (quota/rate-limit exhaustion), falls back to
        OpenRouter's batch classification. If that also fails, returns
        UNKNOWN placeholders so the scan can still complete.
        """
        try:
            return classify_diseases_batch_with_gemini(crops)
        except DiseaseClassificationError as e:
            print(f"[PREDICTION WARNING] Gemini batch classification failed: {e}. Falling back to OpenRouter...")

        try:
            return classify_diseases_batch_openrouter(crops)
        except OpenRouterVisionError as e:
            print(f"[PREDICTION WARNING] OpenRouter batch classification also failed: {e}")

        return [{
            "disease_name": "UNKNOWN",
            "confidence_score": 0.0,
            "reasoning": "AI classification temporarily unavailable (rate limit).",
            "model_used": "n/a",
        } for _ in range(chicken_count)]

    @staticmethod
    def _get_insights_with_fallback(insight_items: list[dict]) -> list[dict]:
        """
        Tries Gemini's batch weight/oil/tips insights first. If every
        free Gemini model fails, falls back to OpenRouter's batch
        insights. If that also fails, returns zeroed-out defaults so the
        scan can still complete.
        """
        try:
            return get_disease_insights_batch(insight_items)
        except GeminiInsightsError as e:
            print(f"[PREDICTION WARNING] Gemini batch insights failed: {e}. Falling back to OpenRouter...")

        try:
            return get_disease_insights_batch_openrouter(insight_items)
        except OpenRouterVisionError as e:
            print(f"[PREDICTION WARNING] OpenRouter batch insights also failed: {e}")

        return [{
            "tips": "Unable to generate care tips at this time. Please consult a veterinarian.",
            "estimated_weight": 0.0,
            "estimated_oil_ml": 0.0,
            "market_ready": False
        } for _ in insight_items]

    @staticmethod
    def _finalize_single_chicken(
        db: Session,
        detected_chicken: DetectedChicken,
        crop_bytes: bytes,
        classification: dict,
        insights: dict,
        image_type: str,
        start_time: float,
    ) -> dict:
        image_url = AIPredictionService._save_image_to_disk(crop_bytes)
        chicken_image = ChickenImage(
            detected_chicken_id=detected_chicken.id,
            image_type=image_type,
            image_url=image_url
        )
        db.add(chicken_image)
        db.commit()
        db.refresh(chicken_image)

        disease_name = classification["disease_name"]
        confidence_score = classification["confidence_score"]
        reasoning = classification.get("reasoning", "")

        try:
            groq_data = get_disease_recommendation(disease_name, confidence_score)
        except RecommendationError as e:
            print(f"[RECOMMENDATION WARNING] {e}")
            groq_data = {
                "breed": "Unknown",
                "recommendation": None,
                "prevention_tips": None,
                "severity": "UNKNOWN",
            }

        processing_time_ms = int((time.time() - start_time) * 1000)

        # NOTE: the actual disease name is still stored in the DB (still
        # used above to generate the recommendation/prevention tips) —
        # only the API response is simplified to Healthy/Not Healthy.
        ai_prediction = AIPrediction(
            detected_chicken_id=detected_chicken.id,
            disease=disease_name,
            disease_confidence=confidence_score,
            estimated_weight=insights["estimated_weight"],
            estimated_oil_ml=insights["estimated_oil_ml"],
            market_ready=insights["market_ready"],
            care_tips=insights["tips"],
            breed=groq_data["breed"],
            recommendation=groq_data["recommendation"],
            prevention_tips=groq_data["prevention_tips"],
            severity=groq_data["severity"],
            model_name="gemini_disease_classifier",
            model_version=classification.get("model_used", "unknown"),
            processing_time_ms=processing_time_ms
        )

        db.add(ai_prediction)
        db.commit()
        db.refresh(ai_prediction)

        return {
            "detected_chicken_id": detected_chicken.id,
            "tracking_id": detected_chicken.tracking_id,
            "chicken_image_id": chicken_image.id,
            "image_url": image_url,
            "ai_prediction_id": ai_prediction.id,
            "disease": AIPredictionService._display_status(disease_name),
            "confidence": confidence_score,
            "healthy": disease_name == "HEALTHY",
            "reasoning": reasoning,
            "estimated_weight": float(ai_prediction.estimated_weight),
            "estimated_oil_ml": float(ai_prediction.estimated_oil_ml),
            "market_ready": ai_prediction.market_ready,
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
    def predict(db: Session, scan_session_id: int, image_type: str, file: UploadFile):
        start_time = time.time()

        contents = file.file.read()
        AIPredictionService._validate_file(file, contents)

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

        # Crop every chicken up front — no Gemini/OpenRouter calls yet.
        crops = [
            crop_chicken_image(
                contents,
                c.bounding_box_x, c.bounding_box_y,
                c.bounding_box_width, c.bounding_box_height,
            )
            for c in detected_chickens
        ]

        # ONE call classifies ALL chickens' disease status — Gemini first,
        # OpenRouter fallback if every free Gemini model is exhausted.
        classifications = AIPredictionService._classify_diseases_with_fallback(
            crops, len(detected_chickens)
        )

        # ONE call estimates weight/oil/tips for ALL chickens — same
        # Gemini-first, OpenRouter-fallback pattern.
        insight_items = [
            {
                "disease": classification["disease_name"],
                "confidence": classification["confidence_score"],
                "image_bytes": crop_bytes,
            }
            for classification, crop_bytes in zip(classifications, crops)
        ]
        insights_list = AIPredictionService._get_insights_with_fallback(insight_items)

        # Everything past this point is DB writes + Groq (not Gemini/
        # OpenRouter) — no additional vision-API quota is used no matter
        # how many chickens.
        chickens_result = []
        for chicken, crop_bytes, classification, insights in zip(
            detected_chickens, crops, classifications, insights_list
        ):
            chickens_result.append(
                AIPredictionService._finalize_single_chicken(
                    db, chicken, crop_bytes, classification, insights, image_type, start_time
                )
            )

        total_weight = round(sum(c["estimated_weight"] for c in chickens_result), 2)
        total_oil_ml = round(sum(c["estimated_oil_ml"] for c in chickens_result), 2)
        market_ready_count = sum(1 for c in chickens_result if c["market_ready"])

        session = db.query(ScanSession).filter(ScanSession.id == scan_session_id).first()
        if session:
            session.status = ScanStatus.COMPLETED
            session.finished_at = func.now()
            db.commit()

            farm = db.query(Farm).filter(Farm.id == session.farm_id).first()
            if farm:
                diseased = [c for c in chickens_result if not c["healthy"]]

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
            results.append({
                "detected_chicken_id": chicken.id,
                "tracking_id": chicken.tracking_id,
                "chicken_image_id": image.id if image else None,
                "image_url": image.image_url if image else None,
                "ai_prediction_id": prediction.id,
                "disease": AIPredictionService._display_status(prediction.disease),
                "confidence": float(prediction.disease_confidence) if prediction.disease_confidence is not None else None,
                "healthy": prediction.disease == "HEALTHY",
                "reasoning": None,
                "estimated_weight": float(prediction.estimated_weight) if prediction.estimated_weight is not None else None,
                "estimated_oil_ml": float(prediction.estimated_oil_ml) if prediction.estimated_oil_ml is not None else None,
                "market_ready": prediction.market_ready,
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