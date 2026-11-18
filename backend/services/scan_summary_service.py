from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status

from models.scan_summary import ScanSummary
from models.detected_chicken import DetectedChicken
from models.ai_prediction import AIPrediction
from models.scan_session import ScanSession
from models.farm import Farm
from models.chicken_image import ChickenImage
from schemas.scan_summary_schema import CreateScanSummarySchema, UpdateScanSummarySchema


class ScanSummaryService:

    @staticmethod
    def create(db: Session, data: CreateScanSummarySchema) -> ScanSummary:
        new_summary = ScanSummary(**data.model_dump())
        db.add(new_summary)
        db.commit()
        db.refresh(new_summary)
        return new_summary

    @staticmethod
    def find_by_id(db: Session, summary_id: int) -> ScanSummary:
        summary = db.query(ScanSummary).filter(ScanSummary.id == summary_id).first()
        if not summary:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scan summary not found")
        return summary

    @staticmethod
    def find_by_scan_session_id(db: Session, scan_session_id: int) -> ScanSummary:
        summary = db.query(ScanSummary).filter(ScanSummary.scan_session_id == scan_session_id).first()
        if not summary:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scan summary not found for this session")
        return summary

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[ScanSummary]:
        return db.query(ScanSummary).offset(skip).limit(limit).all()

    @staticmethod
    def update(db: Session, summary_id: int, data: UpdateScanSummarySchema) -> ScanSummary:
        summary = ScanSummaryService.find_by_id(db, summary_id)

        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(summary, key, value)

        db.commit()
        db.refresh(summary)
        return summary

    @staticmethod
    def delete(db: Session, summary_id: int) -> None:
        summary = ScanSummaryService.find_by_id(db, summary_id)
        db.delete(summary)
        db.commit()

    @staticmethod
    def generate_for_session(db: Session, scan_session_id: int) -> ScanSummary:
        """
        Builds a ScanSummary row by aggregating real data — no hardcoded
        values. Joins DetectedChicken (one row per detected bird in this
        session) with AIPrediction (disease/weight/oil/market_ready per
        bird) and computes counts/averages/sums from actual DB rows.

        Raises:
            404: if no detected chickens exist for this session at all.
            409: if a summary already exists for this session (prevents
                 accidental duplicates — use update() to modify instead).
        """
        existing = db.query(ScanSummary).filter(
            ScanSummary.scan_session_id == scan_session_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"A scan summary already exists for scan_session_id={scan_session_id}. "
                       f"Use PUT /api/scan-summaries/{existing.id} to update it instead."
            )

        total_detected = db.query(func.count(DetectedChicken.id)).filter(
            DetectedChicken.scan_session_id == scan_session_id
        ).scalar()

        if not total_detected:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No detected chickens found for scan_session_id={scan_session_id}. "
                       f"Cannot generate a summary for an empty/nonexistent session."
            )

        prediction_query = db.query(AIPrediction).join(
            DetectedChicken, AIPrediction.detected_chicken_id == DetectedChicken.id
        ).filter(
            DetectedChicken.scan_session_id == scan_session_id
        )

        healthy_count = prediction_query.filter(
            AIPrediction.disease == "HEALTHY"
        ).count()

        diseased_count = prediction_query.filter(
            AIPrediction.disease.notin_(["HEALTHY", "UNKNOWN", "CANNOT_ASSESS"])
        ).count()

        market_ready_count = prediction_query.filter(
            AIPrediction.market_ready.is_(True)
        ).count()

        average_weight = db.query(func.avg(AIPrediction.estimated_weight)).join(
            DetectedChicken, AIPrediction.detected_chicken_id == DetectedChicken.id
        ).filter(
            DetectedChicken.scan_session_id == scan_session_id
        ).scalar()

        estimated_total_oil_ml = db.query(func.sum(AIPrediction.estimated_oil_ml)).join(
            DetectedChicken, AIPrediction.detected_chicken_id == DetectedChicken.id
        ).filter(
            DetectedChicken.scan_session_id == scan_session_id
        ).scalar()

        new_summary = ScanSummary(
            scan_session_id=scan_session_id,
            total_detected=total_detected,
            healthy_count=healthy_count,
            diseased_count=diseased_count,
            market_ready_count=market_ready_count,
            average_weight=round(average_weight, 2) if average_weight is not None else None,
            estimated_total_oil_ml=round(estimated_total_oil_ml, 2) if estimated_total_oil_ml is not None else None,
            remarks="Counts are image observations; the same bird can appear in multiple angles. Unknown assessments are excluded from healthy/diseased counts."
        )

        db.add(new_summary)
        db.commit()
        db.refresh(new_summary)

        return new_summary

    @staticmethod
    def get_history_for_user(
        db: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        search: str | None = None,
        farm_id: int | None = None,
        date_from: str | None = None,
        date_to: str | None = None,
    ) -> list[dict]:
        """
        Joins ScanSummary -> ScanSession -> Farm (filtered to the current
        user's farms) so the frontend gets farm name, location, date, and
        status alongside the aggregated summary numbers in one call.
        Also attaches the farm's own image as the thumbnail.
        Supports optional filtering by farm name search, specific farm,
        and a scan start-date range.
        """
        query = (
            db.query(ScanSummary, ScanSession, Farm)
            .join(ScanSession, ScanSummary.scan_session_id == ScanSession.id)
            .join(Farm, ScanSession.farm_id == Farm.id)
            .filter(Farm.user_id == user_id)
        )

        if search:
            query = query.filter(Farm.farm_name.ilike(f"%{search}%"))

        if farm_id:
            query = query.filter(Farm.id == farm_id)

        if date_from:
            query = query.filter(ScanSession.started_at >= date_from)

        if date_to:
            query = query.filter(ScanSession.started_at <= f"{date_to} 23:59:59")

        results = (
            query
            .order_by(ScanSession.started_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
        history = []
        for summary, session, farm in results:
            history.append({
                "summary_id": summary.id,
                "farm_id": farm.id,
                "scan_session_id": session.id,
                "farm_name": farm.farm_name,
                "location": farm.location,
                "scan_type": session.scan_type.value,
                "status": session.status.value,
                "started_at": session.started_at,
                "finished_at": session.finished_at,
                "total_detected": summary.total_detected,
                "healthy_count": summary.healthy_count,
                "diseased_count": summary.diseased_count,
                "market_ready_count": summary.market_ready_count,
                "average_weight": summary.average_weight,
                "estimated_total_oil_ml": summary.estimated_total_oil_ml,
                "remarks": summary.remarks,
                "thumbnail_url": farm.image_url,
            })

        return history

    @staticmethod
    def get_dashboard_stats_for_user(db: Session, user_id: int) -> dict:
        """
        Aggregates real numbers across every farm/scan belonging to this
        user — no fabricated trend percentages, no hardcoded stats.
        """
        base_scope = (
            db.query(ScanSummary)
            .join(ScanSession, ScanSummary.scan_session_id == ScanSession.id)
            .join(Farm, ScanSession.farm_id == Farm.id)
            .filter(Farm.user_id == user_id)
        )
        total_scans = base_scope.count()

        total_farms = (
            db.query(func.count(Farm.id))
            .filter(Farm.user_id == user_id)
            .scalar()
        )

        totals = (
            db.query(
                func.coalesce(func.sum(ScanSummary.total_detected), 0),
                func.coalesce(func.sum(ScanSummary.healthy_count), 0),
                func.coalesce(func.sum(ScanSummary.diseased_count), 0),
            )
            .join(ScanSession, ScanSummary.scan_session_id == ScanSession.id)
            .join(Farm, ScanSession.farm_id == Farm.id)
            .filter(Farm.user_id == user_id)
            .first()
        )
        total_birds_detected, total_healthy, total_diseased = totals

        healthy_percentage = (
            round((total_healthy / total_birds_detected) * 100, 1)
            if total_birds_detected else 0.0
        )

        disease_rows = (
            db.query(AIPrediction.disease, func.count(AIPrediction.id))
            .join(DetectedChicken, AIPrediction.detected_chicken_id == DetectedChicken.id)
            .join(ScanSession, DetectedChicken.scan_session_id == ScanSession.id)
            .join(Farm, ScanSession.farm_id == Farm.id)
            .filter(Farm.user_id == user_id, AIPrediction.disease != "HEALTHY")
            .group_by(AIPrediction.disease)
            .order_by(func.count(AIPrediction.id).desc())
            .all()
        )
        disease_breakdown = [{"disease": d, "count": c} for d, c in disease_rows]

        farm_rows = (
            db.query(
                Farm.id,
                Farm.farm_name,
                func.coalesce(func.sum(ScanSummary.healthy_count), 0),
                func.coalesce(func.sum(ScanSummary.total_detected), 0),
            )
            .join(ScanSession, ScanSession.farm_id == Farm.id)
            .join(ScanSummary, ScanSummary.scan_session_id == ScanSession.id)
            .filter(Farm.user_id == user_id)
            .group_by(Farm.id, Farm.farm_name)
            .all()
        )
        farm_health_index = []
        for farm_id, farm_name, healthy_sum, detected_sum in farm_rows:
            pct = round((healthy_sum / detected_sum) * 100, 1) if detected_sum else 0.0
            farm_health_index.append({
                "farm_id": farm_id,
                "farm_name": farm_name,
                "health_percentage": pct,
                "total_detected": detected_sum,
            })

        recent_scans = ScanSummaryService.get_history_for_user(db, user_id, skip=0, limit=5)

        recent_rows = (
            db.query(ScanSummary, ScanSession, Farm)
            .join(ScanSession, ScanSummary.scan_session_id == ScanSession.id)
            .join(Farm, ScanSession.farm_id == Farm.id)
            .filter(Farm.user_id == user_id)
            .order_by(ScanSummary.created_at.desc())
            .limit(5)
            .all()
        )
        recent_events = []
        for summary, session, farm in recent_rows:
            if summary.diseased_count and summary.diseased_count > 0:
                count = summary.diseased_count
                recent_events.append({
                    "type": "anomaly",
                    "title": f"{count} anomal{'y' if count == 1 else 'ies'} detected",
                    "farm_name": farm.farm_name,
                    "created_at": summary.created_at,
                })
            else:
                recent_events.append({
                    "type": "completed",
                    "title": "Scan batch completed",
                    "farm_name": farm.farm_name,
                    "created_at": summary.created_at,
                })

        return {
            "total_scans": total_scans,
            "total_farms": total_farms,
            "total_birds_detected": total_birds_detected,
            "healthy_percentage": healthy_percentage,
            "anomalies_detected": total_diseased,
            "disease_breakdown": disease_breakdown,
            "farm_health_index": farm_health_index,
            "recent_scans": recent_scans,
            "recent_events": recent_events,
        }
