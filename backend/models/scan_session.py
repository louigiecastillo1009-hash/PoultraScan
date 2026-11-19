from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.sql import func
from database.base import Base
import enum


class ScanType(enum.Enum):
    WEBCAM = "WEBCAM"
    UPLOAD = "UPLOAD"


class ScanStatus(enum.Enum):
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class ScanSession(Base):
    __tablename__ = "scan_sessions"

    id = Column(Integer, primary_key=True, index=True)

    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False)

    scan_type = Column(Enum(ScanType), nullable=False)

    # BROILER or NATIVE. Selects the market-weight target used for the
    # readiness label. Older rows default to broiler.
    chicken_type = Column(String(20), nullable=False, server_default="BROILER")

    status = Column(
        Enum(ScanStatus),
        default=ScanStatus.PROCESSING,
        nullable=False
    )

    started_at = Column(DateTime(timezone=True), server_default=func.now())

    finished_at = Column(DateTime(timezone=True), nullable=True)