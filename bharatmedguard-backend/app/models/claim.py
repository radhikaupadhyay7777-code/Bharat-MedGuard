from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone

class TimelineEvent(BaseModel):
    time: str
    event: str

class ClaimEvidence(BaseModel):
    timeline: List[TimelineEvent] = []
    ai_explanation: str = ""

class ClaimInDB(BaseModel):
    id: str = Field(..., alias="_id")
    claim_id: str
    claim_number: str
    patient_id: str
    patient_name: str
    abha_id: str
    hospital_id: str
    hospital_name: str
    procedure: str
    claimed_amount: float
    benchmark_amount: float
    deviation_ratio: str = "1.0x"
    submission_date: str = Field(default_factory=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M IST"))
    risk_score: int = 0
    severity: str = "LOW"
    status: str = "PENDING_REVIEW"
    anomaly_flags: List[str] = []
    evidence: Optional[ClaimEvidence] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat() + "Z")

    model_config = ConfigDict(populate_by_name=True)
