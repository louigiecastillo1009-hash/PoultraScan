from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from database.base import Base


class ScanPhoto(Base):
    """
    One source photo uploaded for a scan session. A session may now hold
    MULTIPLE photos (multi-angle scan: FRONT / BACK / LEFT / RIGHT), each
    analyzed independently — per-chicken results stay tagged with the
    photo (angle) they came from so results can never be mixed.

    The compressed photo is saved to disk at detection time so the later
    /api/ai/predict call can crop each detected chicken from the correct
    photo without the frontend re-uploading anything.
    """
    __tablename__ = "scan_photos"

    id = Column(Integer, primary_key=True, index=True)

    scan_session_id = Column(
        Integer,
        ForeignKey("scan_sessions.id", ondelete="CASCADE"),
        nullable=False
    )

    angle = Column(String(10), nullable=False, default="FRONT")

    image_url = Column(String(255), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
