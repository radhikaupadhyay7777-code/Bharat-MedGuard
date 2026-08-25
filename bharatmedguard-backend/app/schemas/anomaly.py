from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from app.models.anomaly import AnomalySourceType, AnomalySeverity

class AnomalyResponse(BaseModel):
    id: str
    anomaly_id: str
    source_type: AnomalySourceType
    source_id: str
    patient_id: Optional[str] = None
    hospital_id: Optional[str] = None
    anomaly_type: str
    risk_score: int
    severity: AnomalySeverity
    reasons: List[str] = []
    evidence: Dict[str, Any] = {}
    detected_at: str
    status: str
    requires_investigation: bool

class AnomalyFilterParams(BaseModel):
    source_type: Optional[AnomalySourceType] = None
    severity: Optional[AnomalySeverity] = None
    min_risk_score: Optional[int] = None
    patient_id: Optional[str] = None
