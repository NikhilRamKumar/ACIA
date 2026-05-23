from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.feedback import Feedback
from app.models.update import CompetitorUpdate
from app.schemas.feedback_schema import FeedbackCreate, FeedbackResponse


router = APIRouter(
    prefix="/feedback",
    tags=["Feedback"]
)


@router.post("/", response_model=FeedbackResponse)
def create_feedback(feedback: FeedbackCreate, db: Session = Depends(get_db)):
    update = db.query(CompetitorUpdate).filter(
        CompetitorUpdate.id == feedback.update_id
    ).first()

    if not update:
        raise HTTPException(
            status_code=404,
            detail="Update not found"
        )

    new_feedback = Feedback(
        update_id=feedback.update_id,
        feedback_type=feedback.feedback_type,
        rating=feedback.rating,
        comment=feedback.comment
    )

    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)

    return new_feedback


@router.get("/", response_model=list[FeedbackResponse])
def get_all_feedback(db: Session = Depends(get_db)):
    feedback_list = db.query(Feedback).order_by(
        Feedback.created_at.desc()
    ).all()

    return feedback_list


@router.get("/update/{update_id}", response_model=list[FeedbackResponse])
def get_feedback_by_update(update_id: int, db: Session = Depends(get_db)):
    update = db.query(CompetitorUpdate).filter(
        CompetitorUpdate.id == update_id
    ).first()

    if not update:
        raise HTTPException(
            status_code=404,
            detail="Update not found"
        )

    feedback_list = db.query(Feedback).filter(
        Feedback.update_id == update_id
    ).order_by(
        Feedback.created_at.desc()
    ).all()

    return feedback_list