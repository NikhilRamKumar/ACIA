from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.db import Base


class Competitor(Base):
    __tablename__ = "competitors"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, unique=True, nullable=False, index=True)
    website_url = Column(String, nullable=True)
    blog_url = Column(String, nullable=True)
    pricing_url = Column(String, nullable=True)
    docs_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)

    industry = Column(String, nullable=True)
    description = Column(String, nullable=True)
    
    domain = Column(String, nullable=True, index=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    updates = relationship(
        "CompetitorUpdate",
        back_populates="competitor",
        cascade="all, delete-orphan"
    )