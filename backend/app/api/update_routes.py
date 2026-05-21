from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.update import CompetitorUpdate
from app.models.competitor import Competitor
from app.schemas.update_schema import (
    CompetitorUpdateCreate,
    CompetitorUpdateResponse
)

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

    return new_update


@router.get("/", response_model=list[CompetitorUpdateResponse])
def get_all_updates(db: Session = Depends(get_db)):
    updates = db.query(CompetitorUpdate).all()
    return updates


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

    return update


@router.get("/competitor/{competitor_id}", response_model=list[CompetitorUpdateResponse])
def get_updates_by_competitor(competitor_id: int, db: Session = Depends(get_db)):
    updates = db.query(CompetitorUpdate).filter(
        CompetitorUpdate.competitor_id == competitor_id
    ).all()

    return updates