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
    competitor_name: Optional[str] = None
    competitor_domain: Optional[str] = None
    
    title: str
    url: str
    content: Optional[str] = None
    source_type: Optional[str] = None
    published_date: Optional[datetime] = None
    scraped_at: datetime

    summary: Optional[str] = None
    category: Optional[str] = None
    threat_score: Optional[int] = None
    threat_level: Optional[str] = None
    risk_explanation: Optional[str] = None
    threat_reason: Optional[str] = None

    prediction: Optional[str] = None
    confidence_level: Optional[str] = None
    recommended_response: Optional[str] = None

    class Config:
        from_attributes = True