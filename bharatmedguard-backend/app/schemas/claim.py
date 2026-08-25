from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ClaimCreate(BaseModel):
    patient_id: str
    patient_name: str
    abha_id: str
    hospital_id: str
    hospital_name: str
    procedure: str
    claimed_amount: float = Field(..., gt=0)
    benchmark_amount: Optional[float] = None
    supporting_doc_id: Optional[str] = None

class ClaimResponse(BaseModel):
    id: str
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
    deviation_ratio: str
    submission_date: str
    risk_score: int
    severity: str
    status: str
    anomaly_flags: List[str] = []
    evidence: Optional[Dict[str, Any]] = None

class ClaimAnalysisResponse(BaseModel):
    claim_id: str
    risk_score: int
    severity: str
    anomaly_detected: bool
    isolation_forest_score: float
    reasons: List[str] = []
    evidence: Dict[str, Any] = {}
    requires_investigation: bool
