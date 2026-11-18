"""Offline regression checks: no provider calls and no application database."""
import io

import pytest
from fastapi import HTTPException
from PIL import Image

from utils.image_cropper import crop_chicken_image
from utils.image_storage import save_compressed_image
from utils.scan_capacity import scan_capacity
from utils.scan_result_validation import ordered_image_results


def photo(width=2400, height=1200):
    image = Image.new("RGB", (width, height), "red")
    image.paste("blue", (width // 2, 0, width, height))
    output = io.BytesIO()
    image.save(output, "JPEG")
    return output.getvalue()


def test_source_storage_preserves_detection_coordinates(tmp_path, monkeypatch):
    monkeypatch.setattr("utils.image_storage.UPLOAD_DIR", str(tmp_path))
    url = save_compressed_image(photo(), preserve_pixels=True)
    saved = (tmp_path / url.rsplit("/", 1)[-1]).read_bytes()
    assert Image.open(io.BytesIO(saved)).size == (2400, 1200)
    crop = crop_chicken_image(saved, 1900, 600, 400, 400)
    image = Image.open(io.BytesIO(crop))
    red, _, blue = image.getpixel((image.width // 2, image.height // 2))
    assert blue > 200 and red < 30


def test_crop_cap_preserves_aspect_ratio(monkeypatch):
    monkeypatch.setattr("utils.image_cropper.CROP_MAX_PIXELS", 768)
    crop = Image.open(io.BytesIO(crop_chicken_image(photo(), 1200, 600, 2400, 1200)))
    assert crop.size == (768, 384)


def test_invalid_box_never_substitutes_whole_flock():
    with pytest.raises(ValueError):
        crop_chicken_image(photo(), 9000, 9000, 10, 10)


def test_out_of_order_response_stays_attached_to_correct_image():
    results = ordered_image_results([
        {"image_id": "image_2", "disease": "HEALTHY"},
        {"image_id": "image_1", "disease": "UNKNOWN"},
    ], 2)
    assert [result["disease"] for result in results] == ["UNKNOWN", "HEALTHY"]


@pytest.mark.parametrize("data", [
    [], [{"image_id": "image_1"}],
    [{"image_id": "image_1"}, {"image_id": "image_1"}],
    [{"image_id": "image_1"}, {"image_id": "other"}],
    [{"image_id": "image_1"}, None],
])
def test_partial_or_malformed_batch_is_rejected(data):
    with pytest.raises(ValueError):
        ordered_image_results(data, 2)


def test_capacity_rejects_parallel_request_and_releases_after_failure():
    with pytest.raises(RuntimeError):
        with scan_capacity():
            with pytest.raises(HTTPException) as error:
                with scan_capacity():
                    pytest.fail("Concurrent scan was admitted")
            assert error.value.status_code == 429
            assert error.value.headers["Retry-After"] == "15"
            raise RuntimeError("provider failed")
    with scan_capacity():
        pass


def test_multi_angle_persistence_history_and_duplicate_submission(tmp_path, monkeypatch):
    from sqlalchemy import create_engine
    from sqlalchemy.orm import Session
    from database.base import Base
    from models.user import User  # register FK targets without connecting to app DB
    from models.scan_session import ScanSession, ScanType
    from models.ai_prediction import AIPrediction
    from services.detection_service import DetectionService
    from services.ai_prediction_service import AIPredictionService
    from schemas.ai_prediction_schema import BatchPredictionResponseSchema

    monkeypatch.setattr("utils.image_storage.UPLOAD_DIR", str(tmp_path))
    monkeypatch.setattr("services.ai_prediction_service.UPLOAD_DIR", str(tmp_path))
    monkeypatch.setattr("services.detection_service.count_chickens_with_gemini", lambda _: {
        "total_chickens": 1, "confidence_note": "test", "raw_response": {},
        "detections": [{"x": 1900, "y": 600, "width": 400, "height": 400, "confidence": 80}],
    })
    calls = []

    def classify(crops):
        calls.append(len(crops))
        return [{"disease_name": "HEALTHY", "confidence_score": 65,
                 "reasoning": "test", "model_used": "mock"} for _ in crops]

    monkeypatch.setattr("services.ai_prediction_service.classify_diseases_batch_with_gemini", classify)
    monkeypatch.setattr("services.ai_prediction_service.get_disease_insights_batch", lambda items: [
        {"estimated_weight": 0, "estimated_oil_ml": 0, "weight_confidence": 0,
         "market_ready": False, "tips": "Weight unknown"} for _ in items
    ])
    monkeypatch.setattr("services.ai_prediction_service.get_disease_recommendation", lambda *args: {
        "breed": "Unknown", "recommendation": None, "prevention_tips": None, "severity": "NONE",
    })
    engine = create_engine("sqlite://")
    Base.metadata.create_all(engine)
    with Session(engine) as db:
        db.add(ScanSession(id=1, farm_id=1, scan_type=ScanType.UPLOAD))
        db.commit()
        DetectionService.detect_and_count(db, 1, photo(), "FRONT")
        DetectionService.detect_and_count(db, 1, photo(), "BACK")
        result = AIPredictionService.predict(db, 1, "FRONT")
        validated = BatchPredictionResponseSchema.model_validate(result)
        assert [c.angle for c in validated.chickens] == ["FRONT", "BACK"]
        assert [c.tracking_id for c in validated.chickens] == [1, 2]
        assert all(c.estimated_weight is None for c in validated.chickens)
        assert all(c.weight_confidence is None for c in validated.chickens)
        repeat = AIPredictionService.predict(db, 1, "FRONT")
        assert repeat["total_chickens"] == 2
        assert db.query(AIPrediction).count() == 2
        assert calls == [2]
        assert [c["angle"].value for c in AIPredictionService.get_predictions_for_session(db, 1)] == ["FRONT", "BACK"]


def test_unavailable_classification_is_unknown_not_healthy(monkeypatch):
    from services.ai_prediction_service import AIPredictionService
    from utils.gemini_disease_classifier import DiseaseClassificationError
    from utils.openrouter_vision import OpenRouterVisionError

    def fail_gemini(_):
        raise DiseaseClassificationError("offline mock")

    def fail_router(_):
        raise OpenRouterVisionError("offline mock")

    monkeypatch.setattr("services.ai_prediction_service.classify_diseases_batch_with_gemini", fail_gemini)
    monkeypatch.setattr("services.ai_prediction_service.classify_diseases_batch_openrouter", fail_router)
    results, unavailable = AIPredictionService._classify_diseases_with_fallback([b"one", b"two"], 2)
    assert unavailable and len(results) == 2
    assert all(AIPredictionService._display_status(r["disease_name"], r["confidence_score"]) == "UNKNOWN" for r in results)
    assert all(AIPredictionService._is_healthy(r["disease_name"], r["confidence_score"]) is None for r in results)


def test_quota_retry_replaces_previous_rows(tmp_path, monkeypatch):
    from sqlalchemy import create_engine
    from sqlalchemy.orm import Session
    from database.base import Base
    from models.scan_session import ScanSession, ScanType, ScanStatus
    from models.ai_prediction import AIPrediction
    from models.chicken_image import ChickenImage
    from models.scan_summary import ScanSummary
    from services.detection_service import DetectionService
    from services.ai_prediction_service import AIPredictionService
    from utils.gemini_disease_classifier import DiseaseClassificationError
    from utils.openrouter_vision import OpenRouterVisionError

    monkeypatch.setattr("utils.image_storage.UPLOAD_DIR", str(tmp_path))
    monkeypatch.setattr("services.ai_prediction_service.UPLOAD_DIR", str(tmp_path))
    monkeypatch.setattr("services.detection_service.count_chickens_with_gemini", lambda _: {
        "total_chickens": 1, "confidence_note": "test", "raw_response": {},
        "detections": [{"x": 1900, "y": 600, "width": 400, "height": 400, "confidence": 80}],
    })

    def fail_gemini(_):
        raise DiseaseClassificationError("quota")

    def fail_router(_):
        raise OpenRouterVisionError("quota")

    monkeypatch.setattr("services.ai_prediction_service.classify_diseases_batch_with_gemini", fail_gemini)
    monkeypatch.setattr("services.ai_prediction_service.classify_diseases_batch_openrouter", fail_router)
    engine = create_engine("sqlite://")
    Base.metadata.create_all(engine)
    with Session(engine) as db:
        db.add(ScanSession(id=1, farm_id=1, scan_type=ScanType.UPLOAD))
        db.commit()
        DetectionService.detect_and_count(db, 1, photo(), "FRONT")

        first = AIPredictionService.predict(db, 1, "FRONT")
        assert first["quota_exhausted"] is True
        assert first["chickens"][0]["assessable"] is False
        assert db.query(AIPrediction).count() == 1
        assert db.query(ScanSummary).count() == 1
        assert db.get(ScanSession, 1).status == ScanStatus.FAILED

        # Free quota restored: retry must replace, not append.
        monkeypatch.setattr(
            "services.ai_prediction_service.classify_diseases_batch_with_gemini",
            lambda crops: [{"disease_name": "HEALTHY", "confidence_score": 70,
                            "reasoning": "clear", "model_used": "mock"} for _ in crops],
        )
        monkeypatch.setattr(
            "services.ai_prediction_service.get_disease_insights_batch",
            lambda items: [{"estimated_weight": 2.0, "estimated_oil_ml": 300.0,
                            "weight_confidence": 60.0, "market_ready": True, "tips": "ok"} for _ in items],
        )
        monkeypatch.setattr(
            "services.ai_prediction_service.get_disease_recommendation",
            lambda *args: {"breed": "Broiler", "recommendation": "ok",
                           "prevention_tips": None, "severity": "NONE"},
        )

        second = AIPredictionService.predict(db, 1, "FRONT")
        assert second["chickens"][0]["disease"] == "Healthy"
        assert second["chickens"][0]["estimated_weight"] == 2.0
        assert second["chickens"][0]["weight_confidence"] == 60.0
        assert db.query(AIPrediction).count() == 1
        assert db.query(ChickenImage).count() == 1
        assert db.query(ScanSummary).count() == 1
        assert db.query(ScanSummary).first().healthy_count == 1
        assert db.get(ScanSession, 1).status == ScanStatus.COMPLETED
