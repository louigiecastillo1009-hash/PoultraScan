from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.journal_entry import JournalEntry
from models.farm import Farm
from models.scan_session import ScanSession
from schemas.journal_entry_schema import CreateJournalEntrySchema, UpdateJournalEntrySchema


class JournalEntryService:

    @staticmethod
    def create(db: Session, user_id: int, data: CreateJournalEntrySchema) -> JournalEntry:
        if data.farm_id is not None:
            farm = db.query(Farm).filter(Farm.id == data.farm_id, Farm.user_id == user_id).first()
            if farm is None:
                raise HTTPException(404, "Farm not found")
        if data.scan_session_id is not None:
            scan = db.query(ScanSession).join(Farm, Farm.id == ScanSession.farm_id).filter(
                ScanSession.id == data.scan_session_id, Farm.user_id == user_id
            ).first()
            if scan is None:
                raise HTTPException(404, "Scan not found")
            if data.farm_id is not None and scan.farm_id != data.farm_id:
                raise HTTPException(400, "Scan does not belong to this farm")
        new_entry = JournalEntry(user_id=user_id, **data.model_dump())
        db.add(new_entry)
        db.commit()
        db.refresh(new_entry)
        return new_entry

    @staticmethod
    def find_by_id(db: Session, user_id: int, entry_id: int) -> JournalEntry:
        entry = db.query(JournalEntry).filter(
            JournalEntry.id == entry_id,
            JournalEntry.user_id == user_id
        ).first()
        if not entry:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Journal entry not found")
        return entry

    @staticmethod
    def get_all_for_user(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> list[JournalEntry]:
        return (
            db.query(JournalEntry)
            .filter(JournalEntry.user_id == user_id)
            .order_by(JournalEntry.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_farm(db: Session, user_id: int, farm_id: int, skip: int = 0, limit: int = 100) -> list[JournalEntry]:
        return (
            db.query(JournalEntry)
            .filter(JournalEntry.user_id == user_id, JournalEntry.farm_id == farm_id)
            .order_by(JournalEntry.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def update(db: Session, user_id: int, entry_id: int, data: UpdateJournalEntrySchema) -> JournalEntry:
        entry = JournalEntryService.find_by_id(db, user_id, entry_id)

        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(entry, key, value)

        db.commit()
        db.refresh(entry)
        return entry

    @staticmethod
    def delete(db: Session, user_id: int, entry_id: int) -> None:
        entry = JournalEntryService.find_by_id(db, user_id, entry_id)
        db.delete(entry)
        db.commit()
