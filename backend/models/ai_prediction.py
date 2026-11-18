from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, DECIMAL, ForeignKey
from sqlalchemy.sql import func
from database.base import Base


class AIPrediction(Base):
    __tablename__ = "ai_predictions"

    id = Column(Integer, primary_key=True, index=True)

    detected_chicken_id = Column(
        Integer,
        ForeignKey("detected_chickens.id"),
        nullable=False
    )

    disease = Column(String(100), nullable=False)

    disease_confidence = Column(DECIMAL(5,2))

    estimated_weight = Column(DECIMAL(5,2))

    estimated_oil_ml = Column(DECIMAL(6,2))

    market_ready = Column(Boolean)

    care_tips = Column(Text)  # Gemini-generated advice text

    breed = Column(String(100))  # NEW — OpenAI-guessed chicken breed

    recommendation = Column(Text)  # NEW — OpenAI treatment/next-step recommendation

    prevention_tips = Column(Text)  # NEW — OpenAI prevention advice

    severity = Column(String(20))  # NEW — OpenAI severity rating: LOW / MEDIUM / HIGH

    # How confident the vision AI is in its own weight ESTIMATE (0-100).
    # Weight is estimated from a photo — never a measured value — so the
    # confidence is shown next to the weight on result cards. Nullable:
    # older rows simply have no weight confidence.
    weight_confidence = Column(DECIMAL(5,2))

    model_name = Column(String(100))

    model_version = Column(String(50))

    processing_time_ms = Column(Integer)

    created_at = Column(DateTime(timezone=True), server_default=func.now())