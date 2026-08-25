from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone

class AnomalySourceType(str, Enum):
    CLAIM = "CLAIM"
    IDENTITY = "IDENTITY"
    DOCUMENT = "DOCUMENT"
    CLINICAL = "CLINICAL"

class AnomalySeverity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class UnifiedAnomalyRecord(BaseModel):
    id: str = Field(..., alias="_id")
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
    model_used: str = "IsolationForest_v2.4"
    detected_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat() + "Z")
    status: str = "FLAGGED"
    requires_investigation: bool = True

    model_config = ConfigDict(populate_by_name=True)
