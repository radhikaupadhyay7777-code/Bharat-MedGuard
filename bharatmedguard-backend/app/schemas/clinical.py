from typing import Optional, Dict, Any, List
from pydantic import BaseModel

class ClinicalRecordCreate(BaseModel):
    patient_id: str
    patient_name: str
    hospital_name: str
    category: str
    clinical_finding: str
    possible_causes: str
    recommendation: str

class ClinicalRecordResponse(BaseModel):
    id: str
    record_id: str
    patient_id: str
    patient_name: str
    hospital_name: str
    timestamp: str
    category: str
    severity: str
    risk_score: int
    clinical_finding: str
    possible_causes: str
    recommendation: str
    ethical_disclaimer: str
    status: str

class ClinicalAnalysisResponse(BaseModel):
    record_id: str
    risk_score: int
    severity: str
    anomaly_detected: bool
    category: str
    clinical_finding: str
    recommendation: str
    ethical_disclaimer: str = "BharatMedGuard AI does not perform medical diagnosis. This finding flags data divergence requiring clinical professional review."
    requires_investigation: bool = True
