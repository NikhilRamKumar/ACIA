from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.alert import Alert
from app.schemas.alert_schema import AlertResponse
from app.services.alert_service import generate_alerts_for_all_updates


router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.post("/generate")
def generate_alerts(db: Session = Depends(get_db)):
    """Generate alerts for all existing updates that meet alert criteria."""
    try:
        created_count, skipped_count = generate_alerts_for_all_updates(db)
        return {
            "message": "Alerts generated successfully",
            "created": created_count,
            "skipped": skipped_count
        }
    except Exception as e:
        print(f"[ALERTS] Error generating alerts: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating alerts: {str(e)}")


@router.get("/", response_model=list[AlertResponse])
def get_all_alerts(
    domain: str = Query(None),
    db: Session = Depends(get_db)
):
    """Get all alerts ordered by created_at descending."""
    try:
        query = db.query(Alert)
        
        # Filter by domain if provided
        if domain:
            from app.models.update import CompetitorUpdate
            from app.models.competitor import Competitor
            query = query.join(CompetitorUpdate).join(Competitor).filter(
                Competitor.domain == domain
            )
        
        alerts = query.order_by(Alert.created_at.desc()).all()
        return alerts
    except Exception as e:
        print(f"[ALERTS] Error fetching alerts: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching alerts: {str(e)}")


@router.get("/unread", response_model=list[AlertResponse])
def get_unread_alerts(
    domain: str = Query(None),
    db: Session = Depends(get_db)
):
    """Get all unread alerts (is_read == False) ordered by created_at descending."""
    try:
        query = db.query(Alert).filter(Alert.is_read == False)
        
        # Filter by domain if provided
        if domain:
            from app.models.update import CompetitorUpdate
            from app.models.competitor import Competitor
            query = query.join(CompetitorUpdate).join(Competitor).filter(
                Competitor.domain == domain
            )
        
        alerts = query.order_by(Alert.created_at.desc()).all()
        return alerts
    except Exception as e:
        print(f"[ALERTS] Error fetching unread alerts: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching unread alerts: {str(e)}")


@router.put("/{alert_id}/read", response_model=AlertResponse)
def mark_alert_as_read(alert_id: int, db: Session = Depends(get_db)):
    """Mark a specific alert as read."""
    try:
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        alert.is_read = True
        db.commit()
        db.refresh(alert)
        
        print(f"[ALERTS] Alert {alert_id} marked as read")
        
        return alert
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ALERTS] Error marking alert as read: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error marking alert as read: {str(e)}")
