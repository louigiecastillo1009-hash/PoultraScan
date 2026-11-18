from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey
from sqlalchemy.sql import func
from database.base import Base
import enum


class ImageType(enum.Enum):
    WEBCAM = "WEBCAM"
    FRONT = "FRONT"
    BACK = "BACK"
    LEFT = "LEFT"
    RIGHT = "RIGHT"


class ChickenImage(Base):
    __tablename__ = "chicken_images"

    id = Column(Integer, primary_key=True, index=True)

    detected_chicken_id = Column(
        Integer,
        ForeignKey("detected_chickens.id"),
        nullable=False
    )

    image_type = Column(Enum(ImageType), nullable=False)

    image_url = Column(String(255), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
