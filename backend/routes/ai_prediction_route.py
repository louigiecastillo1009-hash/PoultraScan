from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from controllers.ai_prediction_controller import AIPredictionController
from schemas.ai_prediction_schema import ImageTypeSchema, MeasurementSchema, MeasurementResponseSchema
from middleware.auth_middleware import get_current_user_id
from services.ai_prediction_service import AIPredictionService
from utils.scan_capacity import scan_capacity
from models.detected_chicken import DetectedChicken

router = APIRouter(
    prefix="/api/ai",
    tags=["AI Prediction"]
)


@router.patch("/chicken/{chicken_id}/measurements", response_model=MeasurementResponseSchema)
def save_measurements(
    chicken_id: int,
    measurements: MeasurementSchema,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    return AIPredictionService.save_measurements(db, chicken_id, current_user_id, measurements)


@router.get("/chicken/{chicken_id}/measurements", response_model=MeasurementResponseSchema)
def get_measurements(
    chicken_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id),
):
    chicken = db.query(DetectedChicken).filter(DetectedChicken.id == chicken_id).first()
    if chicken is None:
        raise HTTPException(404, "Chicken observation not found")
    AIPredictionService.require_owned_session(db, chicken.scan_session_id, current_user_id)
    return AIPredictionService._measurement_response(db, chicken)


@router.post("/predict")
def predict_disease(
    scan_session_id: int = Form(...),
    image_type: ImageTypeSchema = Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    AIPredictionService.require_owned_session(db, scan_session_id, current_user_id)
    with scan_capacity():
        return AIPredictionController.predict(scan_session_id, image_type.value, file, db)


@router.get("/session/{scan_session_id}")
def get_predictions_by_session(
    scan_session_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    AIPredictionService.require_owned_session(db, scan_session_id, current_user_id)
    return AIPredictionController.get_by_session(scan_session_id, db)
