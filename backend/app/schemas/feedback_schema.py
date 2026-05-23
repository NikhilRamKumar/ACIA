from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FeedbackCreate(BaseModel):
    update_id: int
    feedback_type: str
    rating: Optional[int] = None
    comment: Optional[str] = None


class FeedbackResponse(BaseModel):
    id: int
    update_id: int
    feedback_type: str
    rating: Optional[int] = None
    comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True