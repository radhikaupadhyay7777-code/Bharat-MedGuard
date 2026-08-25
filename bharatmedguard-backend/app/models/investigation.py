from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone

class InvestigationStatus(str, Enum):
    OPEN = "OPEN"
    UNDER_REVIEW = "UNDER_REVIEW"
    ESCALATED = "ESCALATED"
    RESOLVED = "RESOLVED"
    DISMISSED = "DISMISSED"

class InvestigationNote(BaseModel):
    note_id: str
    author: str
    role: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M IST"))
    content: str

class InvestigationInDB(BaseModel):
    id: str = Field(..., alias="_id")
    case_id: str
    claim_id: Optional[str] = None
    patient_id: Optional[str] = None
    patient_name: str
    hospital_name: str
    category: str
    claimed_amount: Optional[float] = None
    risk_score: int
    severity: str
    status: InvestigationStatus = InvestigationStatus.OPEN
    investigator_id: Optional[str] = None
    investigator_name: str = "Unassigned"
    detected_anomalies: List[str] = []
    timeline: List[Dict[str, str]] = []
    ai_explanation: str = ""
    notes: List[InvestigationNote] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat() + "Z")
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat() + "Z")

    model_config = ConfigDict(populate_by_name=True)
