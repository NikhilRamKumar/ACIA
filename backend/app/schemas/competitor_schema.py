from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CompetitorCreate(BaseModel):
    name: str
    website_url: Optional[str] = None
    blog_url: Optional[str] = None
    pricing_url: Optional[str] = None
    docs_url: Optional[str] = None
    github_url: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    domain: Optional[str] = None


class CompetitorUpdateSchema(BaseModel):
    name: Optional[str] = None
    website_url: Optional[str] = None
    blog_url: Optional[str] = None
    pricing_url: Optional[str] = None
    docs_url: Optional[str] = None
    github_url: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    domain: Optional[str] = None


class CompetitorResponse(BaseModel):
    id: int
    name: str
    website_url: Optional[str] = None
    blog_url: Optional[str] = None
    pricing_url: Optional[str] = None
    docs_url: Optional[str] = None
    github_url: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    domain: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True