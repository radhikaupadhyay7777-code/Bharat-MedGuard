from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone

class SecurityEventInDB(BaseModel):
    id: str = Field(..., alias="_id")
    event_id: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).strftime("%H:%M:%S.%f")[:-3])
    source_ip: str
    destination_ip: str
    protocol: str
    length: int = 0
    event_type: str = "TELEMETRY"
    severity: str = "LOW"
    description: str
    status: str = "CLEAN"
    flags: str = "ACK"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat() + "Z")

    model_config = ConfigDict(populate_by_name=True)
