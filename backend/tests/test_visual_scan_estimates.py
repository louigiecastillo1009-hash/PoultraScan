import json
from types import SimpleNamespace
import pytest

from utils import gemini_client, openrouter_vision
from utils.scan_estimation import supported_market_ready


@pytest.mark.parametrize("provider", ["gemini", "openrouter"])
def test_scan_estimates_keep_image_mapping_and_calculate_oil(monkeypatch, provider):
    payload = [
        {"image_id": "image_2", "estimated_weight": 1.2, "weight_confidence": 40, "market_ready": True},
        {"image_id": "image_1", "estimated_weight": 2.4, "weight_confidence": 60, "market_ready": True},
    ]
    items = [{"disease": "HEALTHY", "confidence": 90, "image_bytes": b"image"}] * 2
    if provider == "gemini":
        def generate(**kwargs):
            prompt = kwargs["contents"][-1]
            assert "A reference scale is not required" in prompt
            assert "target chicken" in prompt
            return SimpleNamespace(text=json.dumps(payload))
        monkeypatch.setattr(gemini_client, "client", SimpleNamespace(models=SimpleNamespace(generate_content=generate)))
        result = gemini_client.get_disease_insights_batch(items)
    else:
        def generate(**kwargs):
            assert "A reference scale is not required" in kwargs["messages"][0]["content"][0]["text"]
            return SimpleNamespace(usage=None, choices=[SimpleNamespace(message=SimpleNamespace(content=json.dumps(payload)))])
        monkeypatch.setattr(openrouter_vision, "client", SimpleNamespace(chat=SimpleNamespace(completions=SimpleNamespace(create=generate))))
        result = openrouter_vision.get_disease_insights_batch_openrouter(items)
    assert [r["estimated_weight"] for r in result] == [2.4, 1.2]
    assert [r["estimated_oil_ml"] for r in result] == [213, 107]
    assert all(r["market_ready"] is False for r in result)


def test_no_fabricated_weight_or_oil_when_provider_cannot_estimate():
    assert gemini_client._sanitize_weight(None) == 0
    assert gemini_client._compute_oil_ml(0) == 0
    assert supported_market_ready(True, 2.4, "HEALTHY") is False


def test_manual_journal_log_is_owned_and_separate_from_estimates():
    from fastapi import HTTPException
    from sqlalchemy import create_engine
    from sqlalchemy.orm import Session
    from database.base import Base
    from models.user import User
    from models.farm import Farm
    from models.scan_session import ScanSession, ScanType
    from models.journal_entry import JournalEntry
    from schemas.journal_entry_schema import CreateJournalEntrySchema
    from services.journal_entry_service import JournalEntryService

    engine = create_engine("sqlite://")
    Base.metadata.create_all(engine)
    with Session(engine) as db:
        db.add(Farm(id=1, user_id=1, farm_name="Farm", location="Test", capacity=10))
        db.add(ScanSession(id=1, farm_id=1, scan_type=ScanType.UPLOAD))
        db.commit()
        payload = CreateJournalEntrySchema(
            farm_id=1, scan_session_id=1, title="Manual notes",
            content="Chicken 1, actual scale weight: 2.3 kg")
        with pytest.raises(HTTPException) as error:
            JournalEntryService.create(db, 2, payload)
        assert error.value.status_code == 404
        assert db.query(JournalEntry).count() == 0
        entry = JournalEntryService.create(db, 1, payload)
        assert entry.content == payload.content
        assert entry.scan_session_id == 1
        assert entry.user_id == 1
