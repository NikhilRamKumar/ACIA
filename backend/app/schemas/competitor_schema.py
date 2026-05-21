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


class CompetitorUpdateSchema(BaseModel):
    name: Optional[str] = None
    website_url: Optional[str] = None
    blog_url: Optional[str] = None
    pricing_url: Optional[str] = None
    docs_url: Optional[str] = None
    github_url: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None


class CompetitorResponse(BaseModel):
    id: int
    name: str
    website_url: Optional[str]
    blog_url: Optional[str]
    pricing_url: Optional[str]
    docs_url: Optional[str]
    github_url: Optional[str]
    industry: Optional[str]
    description: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True