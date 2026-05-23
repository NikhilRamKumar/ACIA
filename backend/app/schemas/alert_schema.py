from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AlertCreate(BaseModel):
    update_id: int
    alert_type: str
    severity: str
    title: str
    message: Optional[str] = None


class AlertResponse(BaseModel):
    id: int
    update_id: int
    alert_type: str
    severity: str
    title: str
    message: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
