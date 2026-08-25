from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class SystemHealth(BaseModel):
    ai_engine: str = "Operational"
    api_gateway: str = "Operational"
    database: str = "Operational"
    cyber_security: str = "Protected"
    ocr_engine: str = "Operational"
    network_monitor: str = "Active"

class DashboardSummaryResponse(BaseModel):
    total_records: int
    total_claims: int
    total_patients: int
    total_anomalies: int
    high_risk_cases: int
    critical_cases: int
    claim_anomalies: int
    identity_anomalies: int
    document_anomalies: int
    clinical_anomalies: int
    network_threats_blocked: int
    overall_risk_score: int
    risk_status: str
    system_health: SystemHealth
    last_updated: str

class HealthResponse(BaseModel):
    status: str = "healthy"
    api: str = "operational"
    database: str = "connected"
    ml_engine: str = "ready"
    ocr_engine: str = "available"
    network_monitor: str = "active"
    version: str = "2.4.0"
