from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.competitor import Competitor
from app.schemas.competitor_schema import (
    CompetitorCreate,
    CompetitorUpdateSchema,
    CompetitorResponse
)

router = APIRouter(
    prefix="/competitors",
    tags=["Competitors"]
)


@router.post("/", response_model=CompetitorResponse)
def create_competitor(competitor: CompetitorCreate, db: Session = Depends(get_db)):
    existing_competitor = db.query(Competitor).filter(
        Competitor.name == competitor.name
    ).first()

    if existing_competitor:
        raise HTTPException(
            status_code=400,
            detail="Competitor already exists"
        )

    new_competitor = Competitor(**competitor.model_dump())

    db.add(new_competitor)
    db.commit()
    db.refresh(new_competitor)

    return new_competitor


@router.get("/", response_model=list[CompetitorResponse])
def get_all_competitors(domain: str = Query(None), db: Session = Depends(get_db)):
    query = db.query(Competitor)
    
    if domain:
        query = query.filter(Competitor.domain == domain)
    
    competitors = query.all()
    return competitors


@router.get("/{competitor_id}", response_model=CompetitorResponse)
def get_competitor(competitor_id: int, db: Session = Depends(get_db)):
    competitor = db.query(Competitor).filter(
        Competitor.id == competitor_id
    ).first()

    if not competitor:
        raise HTTPException(
            status_code=404,
            detail="Competitor not found"
        )

    return competitor


@router.put("/{competitor_id}", response_model=CompetitorResponse)
def update_competitor(
    competitor_id: int,
    updated_data: CompetitorUpdateSchema,
    db: Session = Depends(get_db)
):
    competitor = db.query(Competitor).filter(
        Competitor.id == competitor_id
    ).first()

    if not competitor:
        raise HTTPException(
            status_code=404,
            detail="Competitor not found"
        )

    update_fields = updated_data.model_dump(exclude_unset=True)

    for key, value in update_fields.items():
        setattr(competitor, key, value)

    db.commit()
    db.refresh(competitor)

    return competitor


@router.delete("/{competitor_id}")
def delete_competitor(competitor_id: int, db: Session = Depends(get_db)):
    competitor = db.query(Competitor).filter(
        Competitor.id == competitor_id
    ).first()

    if not competitor:
        raise HTTPException(
            status_code=404,
            detail="Competitor not found"
        )

    db.delete(competitor)
    db.commit()

    return {
        "message": "Competitor deleted successfully"
    }