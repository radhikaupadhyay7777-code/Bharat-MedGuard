from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class SecurityEventResponse(BaseModel):
    id: str
    event_id: str
    timestamp: str
    source_ip: str
    destination_ip: str
    protocol: str
    length: int
    event_type: str
    severity: str
    description: str
    status: str
    flags: str

class SecurityAlertResponse(BaseModel):
    id: str
    alert_id: str
    title: str
    severity: str
    source: str
    timestamp: str
    status: str
    details: str
