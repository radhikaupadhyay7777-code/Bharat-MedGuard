from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone

class ClinicalRecordInDB(BaseModel):
    id: str = Field(..., alias="_id")
    record_id: str
    patient_id: str
    patient_name: str
    hospital_name: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M IST"))
    category: str
    severity: str = "LOW"
    risk_score: int = 0
    clinical_finding: str
    possible_causes: str
    recommendation: str
    ethical_disclaimer: str = "BharatMedGuard AI does not perform medical diagnosis. This finding flags data divergence requiring clinical professional review."
    status: str = "REVIEW_REQUIRED"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat() + "Z")

    model_config = ConfigDict(populate_by_name=True)
