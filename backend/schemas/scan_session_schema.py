from pydantic import BaseModel, ConfigDict, field_validator
from datetime import datetime
from typing import Optional
from enum import Enum


class ScanTypeSchema(str, Enum):
    WEBCAM = "WEBCAM"
    UPLOAD = "UPLOAD"


class ScanStatusSchema(str, Enum):
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class CreateScanSessionSchema(BaseModel):
    farm_id: int
    scan_type: ScanTypeSchema


class UpdateScanSessionStatusSchema(BaseModel):
    status: ScanStatusSchema


class ScanSessionResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    farm_id: int
    scan_type: str
    status: str
    started_at: datetime
    finished_at: Optional[datetime]

    @field_validator("scan_type", "status", mode="before")
    @classmethod
    def enum_to_value(cls, v):
        return v.value if hasattr(v, "value") else v