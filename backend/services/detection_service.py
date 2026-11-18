"""
Business logic for chicken detection. Talks to the Gemini counting util
for inference, persists DetectedChicken records, and shapes the final
result. Controllers should never touch Gemini or the DB directly — only
this service does.

Multi-angle support: each detection run is tied to a ScanPhoto (the
saved source photo + its angle: FRONT / BACK / LEFT / RIGHT). Re-running
detection for the SAME angle replaces that angle's photo and detections;
other angles are untouched — so one scan session can hold several angles
analyzed independently.
"""

from sqlalchemy.orm import Session
from sqlalchemy import func

from utils.gemini_image_counter import count_chickens_with_gemini, GeminiCountingError
from utils.image_storage import save_compressed_image
from models.detected_chicken import DetectedChicken
from models.chicken_image import ChickenImage
from models.ai_prediction import AIPrediction
from models.scan_photo import ScanPhoto


class DetectionService:

    @staticmethod
    def detect_and_count(db: Session, scan_session_id: int, image_bytes: bytes, angle: str = "FRONT") -> dict:
        """
        Runs Gemini vision inference on the given image to detect and count
        chickens, persists one DetectedChicken row per detection (with real
        bounding box + confidence from Gemini), saves the source photo as a
        ScanPhoto (so /api/ai/predict can crop from the correct photo later),
        and returns a summary dict.

        Clears out any previously stored detections for the SAME angle only
        (and their child ChickenImage/AIPrediction rows plus the old
        ScanPhoto row), so retaking one angle never disturbs the others.

        Raises:
            GeminiCountingError: propagated from the util, handled by the controller.
        """
        gemini_result = count_chickens_with_gemini(image_bytes)

        total_chickens = gemini_result["total_chickens"]
        confidence_note = gemini_result["confidence_note"]

        print(f"[DETECTION DEBUG] Gemini counted: {total_chickens} chickens ({confidence_note}) angle={angle}")

        # Clear previous detections (and their child rows) for THIS ANGLE
        # only, so retaking FRONT doesn't wipe BACK/LEFT/RIGHT and old test
        # scans don't pile up and get reprocessed later.
        old_photo = (
            db.query(ScanPhoto)
            .filter(
                ScanPhoto.scan_session_id == scan_session_id,
                ScanPhoto.angle == angle,
            )
            .first()
        )
        if old_photo:
            old_chickens = db.query(DetectedChicken).filter(
                DetectedChicken.scan_photo_id == old_photo.id
            ).all()
        else:
            # Legacy fallback: sessions scanned before ScanPhoto existed
            # kept detections linked only by scan_session_id.
            old_chickens = db.query(DetectedChicken).filter(
                DetectedChicken.scan_session_id == scan_session_id,
                DetectedChicken.scan_photo_id.is_(None),
            ).all()

        for old in old_chickens:
            db.query(ChickenImage).filter(ChickenImage.detected_chicken_id == old.id).delete()
            db.query(AIPrediction).filter(AIPrediction.detected_chicken_id == old.id).delete()
            db.delete(old)
        if old_photo:
            db.delete(old_photo)
        db.commit()

        # Save the compressed source photo so predict() can crop each
        # chicken from THIS image without the frontend re-uploading it.
        # Keep original dimensions: boxes and the frontend preview use these pixels.
        image_url = save_compressed_image(image_bytes, preserve_pixels=True)
        scan_photo = ScanPhoto(
            scan_session_id=scan_session_id,
            angle=angle,
            image_url=image_url,
        )
        db.add(scan_photo)
        db.flush()  # get scan_photo.id before inserting detections

        detections = []

        # Continue the tracking-ID sequence across angles so every chicken
        # in the session keeps a unique ID (FRONT birds 1-3, BACK birds 4-6…).
        max_existing_tracking_id = (
            db.query(func.max(DetectedChicken.tracking_id))
            .filter(DetectedChicken.scan_session_id == scan_session_id)
            .scalar()
        ) or 0

        for offset, detection in enumerate(gemini_result["detections"], start=1):
            detected_chicken = DetectedChicken(
                scan_session_id=scan_session_id,
                scan_photo_id=scan_photo.id,
                tracking_id=max_existing_tracking_id + offset,
                confidence=detection["confidence"],
                bounding_box_x=detection["x"],
                bounding_box_y=detection["y"],
                bounding_box_width=detection["width"],
                bounding_box_height=detection["height"]
            )
            db.add(detected_chicken)

            detections.append({
                "tracking_id": max_existing_tracking_id + offset,
                "confidence": detection["confidence"],
                "angle": angle,
                "bounding_box": {
                    "x": detection["x"],
                    "y": detection["y"],
                    "width": detection["width"],
                    "height": detection["height"]
                }
            })

        db.commit()

        return {
            "success": True,
            "total_chickens": total_chickens,
            "confidence_note": confidence_note,
            "angle": angle,
            "scan_photo_id": scan_photo.id,
            "detections": detections,
            "raw_response": gemini_result["raw_response"]
        }
