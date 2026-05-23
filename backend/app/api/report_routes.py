from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.services.report_service import generate_competitor_report


router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/generate")
def generate_report(
    domain: str = Query(None),
    days: int = Query(30),
    db: Session = Depends(get_db)
):
    """Generate a comprehensive competitive intelligence report."""
    try:
        report = generate_competitor_report(db, domain, days)
        return report
    except Exception as e:
        print(f"[REPORTS] Error generating report: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating report: {str(e)}")
