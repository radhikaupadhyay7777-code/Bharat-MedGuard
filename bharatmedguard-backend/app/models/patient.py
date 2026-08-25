from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone

class HospitalAdmissionRecord(BaseModel):
    hospital_id: str
    hospital_name: str
    city: str
    timestamp: str
    action: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class PatientInDB(BaseModel):
    id: str = Field(..., alias="_id")
    patient_id: str
    name: str
    abha_id: str
    aadhaar_hash: str
    age: int
    gender: str
    primary_location: str
    primary_city: str
    risk_score: int = 0
    severity: str = "LOW"
    anomaly_type: Optional[str] = None
    connected_hospitals: List[HospitalAdmissionRecord] = []
    flags: List[str] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat() + "Z")

    model_config = ConfigDict(populate_by_name=True)
