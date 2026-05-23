from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.services.comparison_service import build_competitor_feature_comparison


router = APIRouter(prefix="/comparison", tags=["comparison"])


@router.get("/features")
def get_feature_comparison(domain: str = Query(None), db: Session = Depends(get_db)):
    """Get feature comparison for all competitors, optionally filtered by domain."""
    try:
        comparison_data = build_competitor_feature_comparison(db, domain)
        
        return {
            "domain": domain,
            "total_competitors": len(comparison_data),
            "comparison": comparison_data
        }
    except Exception as e:
        print(f"[COMPARISON] Error generating comparison: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating comparison: {str(e)}")
