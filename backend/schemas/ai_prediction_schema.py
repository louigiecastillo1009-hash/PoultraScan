from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum


class ImageTypeSchema(str, Enum):
    WEBCAM = "WEBCAM"
    FRONT = "FRONT"
    BACK = "BACK"
    LEFT = "LEFT"
    RIGHT = "RIGHT"


class ChickenPredictionSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    detected_chicken_id: int
    tracking_id: Optional[int] = None
    measured_weight_kg: Optional[float] = None
    measured_height_cm: Optional[float] = None
    assessment_status: str = "ASSESSED"
    chicken_image_id: int
    image_url: str
    ai_prediction_id: int
    disease: str
    confidence: float
    healthy: Optional[bool]
    # False when the photo framing (camera too close/too far) makes an
    # honest size/health assessment impossible — the card then shows the
    # reposition-camera message from cannot_assess_reason.
    assessable: bool = True
    cannot_assess_reason: Optional[str] = None
    # Which source photo/angle this chicken came from (multi-angle scans).
    angle: Optional[str] = None
    reasoning: Optional[str] = None
    estimated_weight: Optional[float]
    # The vision model's confidence in its own weight ESTIMATE (0-100).
    weight_confidence: Optional[float] = None
    estimated_oil_ml: Optional[float]
    # User-entered corrections. When present they replace the AI values in
    # the UI and in totals; the original AI estimate is still returned.
    measured_weight_kg: Optional[float] = None
    measured_oil_ml: Optional[float] = None
    effective_weight: Optional[float] = None
    effective_oil_ml: Optional[float] = None
    weight_source: Optional[str] = None
    oil_source: Optional[str] = None
    chicken_type: str = "BROILER"
    market_target_kg: Optional[float] = None
    market_ready_label: Optional[str] = None
    market_ready_note: Optional[str] = None
    market_ready: bool
    care_tips: str
    breed: Optional[str] = None
    recommendation: Optional[str] = None
    prevention_tips: Optional[str] = None
    severity: Optional[str] = None
    model_name: str
    model_version: str
    processing_time_ms: int
    created_at: datetime


class BatchPredictionResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    chickens: List[ChickenPredictionSchema]
    total_chickens: int
    total_weight: float
    total_oil_ml: float
    market_ready_count: int
    # True when every free AI provider (Gemini + OpenRouter fallbacks) was
    # rate-limited/quota-exhausted, so part of this scan could not be
    # analyzed and the frontend should show the "try again later" modal.
    quota_exhausted: bool = False
    quota_message: Optional[str] = None


class MeasurementSchema(BaseModel):
    model_config = ConfigDict(extra="forbid", from_attributes=True)
    measured_weight_kg: Optional[float] = Field(default=None, ge=0.001, le=99999, allow_inf_nan=False)
    measured_height_cm: Optional[float] = Field(default=None, ge=0.01, le=99999, allow_inf_nan=False)
    measured_oil_ml: Optional[float] = Field(default=None, ge=0.001, le=999999, allow_inf_nan=False)


class MeasurementResponseSchema(MeasurementSchema):
    detected_chicken_id: int
    effective_weight: Optional[float] = None
    effective_oil_ml: Optional[float] = None
    weight_source: Optional[str] = None
    oil_source: Optional[str] = None
    chicken_type: str = "BROILER"
    market_target_kg: Optional[float] = None
    market_ready: bool = False
    market_ready_label: Optional[str] = None
    market_ready_note: Optional[str] = None
