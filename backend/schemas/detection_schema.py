"""
Pydantic schemas for the chicken detection endpoint's request/response bodies.
"""

from pydantic import BaseModel
from typing import List, Optional, Any


class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float


class ChickenDetection(BaseModel):
    angle: Optional[str] = None
    tracking_id: int
    confidence: float
    bounding_box: BoundingBox


class DetectionResponse(BaseModel):
    angle: Optional[str] = None
    scan_photo_id: Optional[int] = None
    success: bool
    total_chickens: int
    detections: List[ChickenDetection]
    raw_response: Optional[Any] = None
