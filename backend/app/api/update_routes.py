from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.update import CompetitorUpdate
from app.models.competitor import Competitor
from app.schemas.update_schema import (
    CompetitorUpdateCreate,
    CompetitorUpdateResponse
)
from app.services.threat_service import get_threat_level, generate_risk_explanation


def build_update_response(update: CompetitorUpdate) -> dict:
    """
    Build a complete update response including competitor info and threat level.
    
    Args:
        update: CompetitorUpdate ORM object
    
    Returns:
        Dictionary with all response fields
    """
    competitor_name = "Unknown Competitor"
    competitor_domain = None
    
    if update.competitor:
        competitor_name = update.competitor.name
        competitor_domain = update.competitor.domain
    
    threat_level = get_threat_level(update.threat_score)
    risk_explanation = generate_risk_explanation(
        update.threat_score,
        update.category,
        f"{update.title} {update.content or ''}"
    )
    
    return {
        "id": update.id,
        "competitor_id": update.competitor_id,
        "competitor_name": competitor_name,
        "competitor_domain": competitor_domain,
        "title": update.title,
        "url": update.url,
        "content": update.content,
        "source_type": update.source_type,
        "published_date": update.published_date,
        "scraped_at": update.scraped_at,
        "summary": update.summary,
        "category": update.category,
        "threat_score": update.threat_score,
        "threat_level": threat_level,
        "risk_explanation": risk_explanation,
        "threat_reason": update.threat_reason,
        "prediction": update.prediction,
        "confidence_level": update.confidence_level,
        "recommended_response": update.recommended_response,
    }


router = APIRouter(
    prefix="/updates",
    tags=["Competitor Updates"]
)


@router.post("/", response_model=CompetitorUpdateResponse)
def create_update(update: CompetitorUpdateCreate, db: Session = Depends(get_db)):
    competitor = db.query(Competitor).filter(
        Competitor.id == update.competitor_id
    ).first()

    if not competitor:
        raise HTTPException(
            status_code=404,
            detail="Competitor not found"
        )

    existing_update = db.query(CompetitorUpdate).filter(
        CompetitorUpdate.url == update.url
    ).first()

    if existing_update:
        raise HTTPException(
            status_code=400,
            detail="Update already exists"
        )

    new_update = CompetitorUpdate(**update.model_dump())

    db.add(new_update)
    db.commit()
    db.refresh(new_update)

    return build_update_response(new_update)


@router.get("/", response_model=list[CompetitorUpdateResponse])
def get_all_updates(domain: str = Query(None), db: Session = Depends(get_db)):
    query = db.query(CompetitorUpdate)
    
    if domain:
        # Join with Competitor table to filter by domain
        query = query.join(Competitor).filter(Competitor.domain == domain)
    
    updates = query.order_by(
        CompetitorUpdate.scraped_at.desc()
    ).all()

    return [build_update_response(update) for update in updates]


@router.get("/{update_id}", response_model=CompetitorUpdateResponse)
def get_update(update_id: int, db: Session = Depends(get_db)):
    update = db.query(CompetitorUpdate).filter(
        CompetitorUpdate.id == update_id
    ).first()

    if not update:
        raise HTTPException(
            status_code=404,
            detail="Update not found"
        )

    return build_update_response(update)


@router.get("/competitor/{competitor_id}", response_model=list[CompetitorUpdateResponse])
def get_updates_by_competitor(competitor_id: int, db: Session = Depends(get_db)):
    competitor = db.query(Competitor).filter(
        Competitor.id == competitor_id
    ).first()

    if not competitor:
        raise HTTPException(
            status_code=404,
            detail="Competitor not found"
        )

    updates = db.query(CompetitorUpdate).filter(
        CompetitorUpdate.competitor_id == competitor_id
    ).order_by(
        CompetitorUpdate.scraped_at.desc()
    ).all()

    return [build_update_response(update) for update in updates]


@router.delete("/{update_id}")
def delete_update(update_id: int, db: Session = Depends(get_db)):
    update = db.query(CompetitorUpdate).filter(
        CompetitorUpdate.id == update_id
    ).first()

    if not update:
        raise HTTPException(
            status_code=404,
            detail="Update not found"
        )

    db.delete(update)
    db.commit()

    return {
        "message": "Update deleted successfully"
    }