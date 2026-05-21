from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CompetitorUpdateCreate(BaseModel):
    competitor_id: int
    title: str
    url: str
    content: Optional[str] = None
    source_type: Optional[str] = "blog"


class CompetitorUpdateResponse(BaseModel):
    id: int
    competitor_id: int
    title: str
    url: str
    content: Optional[str]
    source_type: Optional[str]
    published_date: Optional[datetime]
    scraped_at: datetime
    summary: Optional[str]
    category: Optional[str]
    threat_score: Optional[int]
    threat_reason: Optional[str]
    prediction: Optional[str]
    confidence_level: Optional[str]
    recommended_response: Optional[str]

    class Config:
        from_attributes = True