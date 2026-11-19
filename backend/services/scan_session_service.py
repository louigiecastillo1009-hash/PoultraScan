from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timezone

from models.scan_session import ScanSession, ScanStatus
from models.farm import Farm
from schemas.scan_session_schema import CreateScanSessionSchema, UpdateScanSessionStatusSchema
from schemas.notification_schema import CreateNotificationSchema
from services.notification_service import NotificationService


class ScanSessionService:

    @staticmethod
    def create(db: Session, data: CreateScanSessionSchema) -> ScanSession:
        farm = db.query(Farm).filter(Farm.id == data.farm_id).first()
        if not farm:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Farm not found. Please select or create a farm before scanning."
            )

        new_session = ScanSession(
            farm_id=data.farm_id,
            scan_type=data.scan_type.value
        )
        db.add(new_session)
        db.commit()
        db.refresh(new_session)

        NotificationService.create(
            db,
            CreateNotificationSchema(
                user_id=farm.user_id,
                title="Scan started",
                message=f"Scanning started for {farm.farm_name}.",
            ),
        )

        return new_session

    @staticmethod
    def find_by_id(db: Session, session_id: int) -> ScanSession:
        session = db.query(ScanSession).filter(ScanSession.id == session_id).first()
        if not session:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scan session not found")
        return session

    @staticmethod
    def find_by_farm_id(db: Session, farm_id: int) -> list[ScanSession]:
        return db.query(ScanSession).filter(ScanSession.farm_id == farm_id).all()

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[ScanSession]:
        return db.query(ScanSession).offset(skip).limit(limit).all()

    @staticmethod
    def update_status(db: Session, session_id: int, data: UpdateScanSessionStatusSchema) -> ScanSession:
        session = ScanSessionService.find_by_id(db, session_id)

        session.status = data.status.value

        if data.status in (ScanStatus.COMPLETED, ScanStatus.FAILED):
            session.finished_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def delete(db: Session, session_id: int) -> None:
        session = ScanSessionService.find_by_id(db, session_id)
        db.delete(session)
        db.commit()