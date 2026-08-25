from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from app.models.investigation import InvestigationStatus

class NoteCreate(BaseModel):
    content: str

class InvestigationCreate(BaseModel):
    case_id: Optional[str] = None
    claim_id: Optional[str] = None
    patient_id: Optional[str] = None
    patient_name: str
    hospital_name: str
    category: str
    claimed_amount: Optional[float] = None
    risk_score: int
    severity: str
    detected_anomalies: List[str] = []
    ai_explanation: Optional[str] = None

class InvestigationUpdate(BaseModel):
    status: Optional[InvestigationStatus] = None
    investigator_id: Optional[str] = None
    investigator_name: Optional[str] = None

class InvestigationResponse(BaseModel):
    id: str
    case_id: str
    claim_id: Optional[str] = None
    patient_id: Optional[str] = None
    patient_name: str
    hospital_name: str
    category: str
    claimed_amount: Optional[float] = None
    risk_score: int
    severity: str
    status: InvestigationStatus
    investigator_id: Optional[str] = None
    investigator_name: str
    detected_anomalies: List[str] = []
    timeline: List[Dict[str, str]] = []
    ai_explanation: str
    notes: List[Dict[str, Any]] = []
    created_at: str
    updated_at: str
