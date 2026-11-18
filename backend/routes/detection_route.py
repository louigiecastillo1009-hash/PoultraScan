"""
Route definitions for the chicken detection feature.
Only wires up the endpoint and dependency injection — no logic here.
"""

from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session

from controllers.detection_controller import DetectionController
from database.database import get_db
from schemas.ai_prediction_schema import ImageTypeSchema
from schemas.detection_schema import DetectionResponse
from middleware.auth_middleware import get_current_user_id
from services.ai_prediction_service import AIPredictionService
from utils.scan_capacity import scan_capacity

router = APIRouter(prefix="/api/detection", tags=["Detection"])


@router.post("/count", response_model=DetectionResponse)
def count_chickens(
    scan_session_id: int = Form(...),
    image: UploadFile = File(...),
    angle: ImageTypeSchema = Form(ImageTypeSchema.FRONT),
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """
    Accepts a multipart/form-data image upload, runs Gemini chicken
    detection, persists one DetectedChicken row per detection tied to a
    saved ScanPhoto (angle: FRONT / BACK / LEFT / RIGHT / WEBCAM / UPLOAD),
    and returns the total count + individual detections.

    Re-detecting the SAME angle replaces that angle's photo + detections;
    other angles already in the session are untouched.
    """
    AIPredictionService.require_owned_session(db, scan_session_id, current_user_id)
    with scan_capacity():
        return DetectionController.count_chickens(
            db=db, scan_session_id=scan_session_id, file=image, angle=angle.value,
        )
