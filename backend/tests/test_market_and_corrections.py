"""Market-readiness rules and user correction behaviour."""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from database.base import Base
from models.user import User
from models.farm import Farm
from models.scan_session import ScanSession, ScanType
from models.detected_chicken import DetectedChicken
from models.ai_prediction import AIPrediction
from models.scan_summary import ScanSummary
from schemas.ai_prediction_schema import MeasurementSchema
from services.ai_prediction_service import AIPredictionService
from services.scan_summary_service import ScanSummaryService
from utils.market_readiness import assess_market_readiness


def test_market_target_is_generic():
    ready = assess_market_readiness(2.0, True)
    assert ready["market_ready"] is True
    assert ready["market_ready_label"] == "Market ready"
    assert ready["market_target_kg"] == 1.5

    assert assess_market_readiness(1.5, True)["market_ready"] is True
    assert assess_market_readiness(1.2, True)["market_ready"] is False
    assert assess_market_readiness(2.5, False)["market_ready"] is False
    assert assess_market_readiness(None, True)["market_ready_label"] == "Check weight"
    assert assess_market_readiness(2.0, None)["market_ready"] is True


def test_illness_is_only_flagged_at_80_percent_confidence():
    assert AIPredictionService._is_healthy("COCCIDIOSIS", 79) is None
    assert AIPredictionService._display_status("COCCIDIOSIS", 79) == "No clear signs detected"
    assert AIPredictionService._is_healthy("COCCIDIOSIS", 80) is False
    assert AIPredictionService._display_status("COCCIDIOSIS", 80) == "Not Healthy"
    # A usable photo with no named condition is still assessed.
    assert AIPredictionService._display_status("UNKNOWN", 0) == "No clear signs detected"
    assert AIPredictionService.assessment_status("UNKNOWN", "mock-model") == "ASSESSED"


def test_named_disease_requires_confirmed_visible_signs():
    from utils.gemini_disease_classifier import _confirmed_visible_signs

    assert _confirmed_visible_signs({"visible_signs": True}) is True
    assert _confirmed_visible_signs({"visible_signs": "yes"}) is True
    assert _confirmed_visible_signs({"visible_signs": False}) is False
    # Missing or ambiguous evidence must not be treated as a visible sign.
    assert _confirmed_visible_signs({}) is False
    assert _confirmed_visible_signs({"visible_signs": "maybe"}) is False


def test_summary_does_not_count_low_confidence_findings_as_disease():
    engine = create_engine("sqlite://")
    Base.metadata.create_all(engine)
    with Session(engine) as db:
        db.add(User(id=1, fullname="A", username="a", email="a@a.a", password="x"))
        db.add(Farm(id=1, user_id=1, farm_name="Farm", location="Test", capacity=10))
        db.add(ScanSession(id=1, farm_id=1, scan_type=ScanType.UPLOAD))
        db.add(DetectedChicken(id=1, scan_session_id=1, tracking_id=1))
        db.add(DetectedChicken(id=2, scan_session_id=1, tracking_id=2))
        db.add(AIPrediction(
            detected_chicken_id=1, disease="COCCIDIOSIS", disease_confidence=55,
            estimated_weight=2.0, estimated_oil_ml=178, market_ready=True,
        ))
        db.add(AIPrediction(
            detected_chicken_id=2, disease="HEALTHY", disease_confidence=90,
            estimated_weight=2.1, estimated_oil_ml=186, market_ready=True,
        ))
        db.commit()

        summary = ScanSummaryService.generate_for_session(db, 1)
        assert summary.total_detected == 2
        assert summary.healthy_count == 1
        assert summary.diseased_count == 0
        assert summary.market_ready_count == 2


def test_user_correction_replaces_display_and_totals_but_keeps_ai_estimate():
    engine = create_engine("sqlite://")
    Base.metadata.create_all(engine)
    with Session(engine) as db:
        db.add(User(id=1, fullname="A", username="a", email="a@a.a", password="x"))
        db.add(Farm(id=1, user_id=1, farm_name="Farm", location="Test", capacity=10))
        db.add(ScanSession(id=1, farm_id=1, scan_type=ScanType.UPLOAD))
        db.add(DetectedChicken(id=1, scan_session_id=1, tracking_id=1))
        db.add(AIPrediction(
            detected_chicken_id=1, disease="HEALTHY", disease_confidence=90,
            estimated_weight=2.0, estimated_oil_ml=178, market_ready=True,
        ))
        db.add(ScanSummary(
            scan_session_id=1, total_detected=1, healthy_count=1, diseased_count=0,
            market_ready_count=1, average_weight=2.0, estimated_total_oil_ml=178,
        ))
        db.commit()

        saved = AIPredictionService.save_measurements(
            db, 1, 1,
            MeasurementSchema(measured_weight_kg=2.6, measured_oil_ml=320),
        )
        assert saved["effective_weight"] == pytest.approx(2.6)
        assert saved["effective_oil_ml"] == pytest.approx(320)
        assert saved["weight_source"] == "user"
        assert saved["oil_source"] == "user"
        assert saved["market_ready"] is True

        prediction = db.query(AIPrediction).first()
        assert float(prediction.estimated_weight) == pytest.approx(2.0)
        assert float(prediction.estimated_oil_ml) == pytest.approx(178)

        summary = db.query(ScanSummary).first()
        db.refresh(summary)
        assert float(summary.average_weight) == pytest.approx(2.6)
        assert float(summary.estimated_total_oil_ml) == pytest.approx(320)

        # Clearing the correction falls back to the untouched AI estimate.
        cleared = AIPredictionService.save_measurements(
            db, 1, 1,
            MeasurementSchema(measured_weight_kg=None, measured_oil_ml=None),
        )
        assert cleared["effective_weight"] == pytest.approx(2.0)
        assert cleared["effective_oil_ml"] == pytest.approx(178)
        assert cleared["weight_source"] == "ai"
        assert cleared["oil_source"] == "ai"
