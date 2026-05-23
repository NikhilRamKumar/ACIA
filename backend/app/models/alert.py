from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.db import Base


class Alert(Base):
    __tablename__ = "competitor_alerts"

    id = Column(Integer, primary_key=True, index=True)
    
    update_id = Column(Integer, ForeignKey("competitor_updates.id"), nullable=False, index=True)
    
    alert_type = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=True)
    
    is_read = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    update = relationship(
        "CompetitorUpdate",
        backref="alerts"
    )
