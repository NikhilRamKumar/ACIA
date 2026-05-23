from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.models.update import CompetitorUpdate
from app.services.pricing_service import detect_pricing_change_for_update, detect_pricing_changes_for_all


router = APIRouter(prefix="/pricing", tags=["pricing"])


@router.post("/detect/{update_id}")
def detect_pricing_for_update(update_id: int, db: Session = Depends(get_db)):
    """Detect pricing change for a specific update."""
    try:
        update = db.query(CompetitorUpdate).filter(CompetitorUpdate.id == update_id).first()
        
        if not update:
            raise HTTPException(status_code=404, detail="Update not found")
        
        is_pricing = detect_pricing_change_for_update(update, db)
        
        return {
            "message": "Pricing detection complete",
            "update_id": update_id,
            "is_pricing": is_pricing,
            "category": update.category,
            "threat_score": update.threat_score
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"[PRICING] Error detecting pricing for update {update_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error detecting pricing: {str(e)}")


@router.post("/detect-all")
def detect_pricing_for_all(db: Session = Depends(get_db)):
    """Detect pricing changes for all updates."""
    try:
        checked_count, detected_count, updated_count = detect_pricing_changes_for_all(db)
        
        return {
            "message": "Pricing detection complete for all updates",
            "checked": checked_count,
            "detected": detected_count,
            "updated": updated_count
        }
    except Exception as e:
        print(f"[PRICING] Error detecting pricing for all updates: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error detecting pricing: {str(e)}")
