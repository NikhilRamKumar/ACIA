from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.services.trend_service import (
    get_recent_updates, count_categories, count_threat_levels,
    identify_top_competitors, generate_trend_summary, generate_strategic_insight
)


router = APIRouter(prefix="/trends", tags=["trends"])


@router.get("/summary")
def get_trend_summary(
    domain: str = Query(None),
    days: int = Query(30),
    db: Session = Depends(get_db)
):
    """Get market trend summary for recent updates."""
    try:
        # Get recent updates
        updates = get_recent_updates(db, domain, days)
        
        if not updates:
            return {
                "domain": domain,
                "total_updates": 0,
                "days": days,
                "top_categories": [],
                "threat_distribution": {"low": 0, "medium": 0, "high": 0},
                "top_competitors": [],
                "trend_summary": "Not enough update data to generate trend summary.",
                "strategic_insight": "Continue monitoring the market for emerging trends."
            }
        
        # Analyze data
        categories = count_categories(updates)
        threat_distribution = count_threat_levels(updates)
        top_competitors = identify_top_competitors(updates)
        trend_summary = generate_trend_summary(updates, domain or "market")
        strategic_insight = generate_strategic_insight(updates, domain or "market")
        
        return {
            "domain": domain,
            "total_updates": len(updates),
            "days": days,
            "top_categories": categories,
            "threat_distribution": threat_distribution,
            "top_competitors": top_competitors,
            "trend_summary": trend_summary,
            "strategic_insight": strategic_insight
        }
    except Exception as e:
        print(f"[TRENDS] Error generating trend summary: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating trend summary: {str(e)}")
