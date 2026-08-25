from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class PatientCreate(BaseModel):
    name: str
    abha_id: str
    aadhaar_hash: Optional[str] = None
    age: int = Field(..., ge=0, le=130)
    gender: str
    primary_location: str
    primary_city: str

class PatientResponse(BaseModel):
    id: str
    patient_id: str
    name: str
    abha_id: str
    aadhaar_hash: str
    age: int
    gender: str
    primary_location: str
    primary_city: str
    risk_score: int
    severity: str
    anomaly_type: Optional[str] = None
    connected_hospitals: List[Dict[str, Any]] = []
    flags: List[str] = []

class IdentityAnalysisResponse(BaseModel):
    patient_id: str
    risk_score: int
    severity: str
    anomaly_detected: bool
    anomaly_type: str
    velocity_analysis: Dict[str, Any] = {}
    reasons: List[str] = []
    requires_investigation: bool
