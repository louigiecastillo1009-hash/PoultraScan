import pytest
from pydantic import ValidationError
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from database.base import Base
from models.user import User
from models.farm import Farm
from models.scan_session import ScanSession, ScanType
from models.detected_chicken import DetectedChicken
from schemas.ai_prediction_schema import MeasurementSchema
from services.ai_prediction_service import AIPredictionService


@pytest.mark.parametrize("value", [0, -1, float("nan"), float("inf"), 100000])
def test_invalid_measurement_rejected(value):
    with pytest.raises(ValidationError):
        MeasurementSchema(measured_weight_kg=value)
    with pytest.raises(ValidationError):
        MeasurementSchema(measured_height_cm=value)


def test_measurement_roundtrip_ownership_and_partial_update():
    engine = create_engine("sqlite://")
    Base.metadata.create_all(engine)
    with Session(engine) as db:
        db.add(Farm(id=1, user_id=1, farm_name="Test", location="Test", capacity=10))
        db.add(ScanSession(id=1, farm_id=1, scan_type=ScanType.UPLOAD))
        db.add(DetectedChicken(id=1, scan_session_id=1, tracking_id=1))
        db.commit()
        with pytest.raises(HTTPException) as error:
            AIPredictionService.save_measurements(db, 1, 2, MeasurementSchema(measured_weight_kg=2))
        assert error.value.status_code == 404
        assert db.get(DetectedChicken, 1).measured_weight_kg is None
        result = AIPredictionService.save_measurements(
            db, 1, 1, MeasurementSchema(measured_weight_kg=2.125, measured_height_cm=42.5))
        assert float(result["measured_weight_kg"]) == 2.125
        result = AIPredictionService.save_measurements(
            db, 1, 1, MeasurementSchema(measured_height_cm=None))
        assert float(result["measured_weight_kg"]) == 2.125
        assert result["measured_height_cm"] is None


def test_provider_failure_is_distinct_from_photo_retake():
    assert AIPredictionService.assessment_status("UNKNOWN", "n/a") == "UNAVAILABLE"
    assert AIPredictionService.assessment_status("CANNOT_ASSESS", "gemini") == "RETAKE"
    assert AIPredictionService.assessment_status("HEALTHY", "gemini") == "ASSESSED"
    assert AIPredictionService._is_healthy("COCCIDIOSIS", 1) is None
    assert AIPredictionService._display_status("COCCIDIOSIS", 1) == "Assessment inconclusive"
