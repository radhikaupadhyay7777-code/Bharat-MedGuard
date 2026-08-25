from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException
from app.core.database import get_anomalies_col
from app.schemas.anomaly import AnomalyResponse
from app.services.anomaly_service import anomaly_service

router = APIRouter(prefix="/anomalies", tags=["Unified Anomaly Engine"])

@router.get("", response_model=List[AnomalyResponse])
async def list_anomalies(
    source_type: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    min_risk_score: Optional[int] = Query(None),
    limit: int = Query(50, le=100)
):
    items = await anomaly_service.get_anomalies(
        source_type=source_type,
        severity=severity,
        min_risk_score=min_risk_score,
        limit=limit
    )
    return [
        AnomalyResponse(
            id=item.id,
            anomaly_id=item.anomaly_id,
            source_type=item.source_type,
            source_id=item.source_id,
            patient_id=item.patient_id,
            hospital_id=item.hospital_id,
            anomaly_type=item.anomaly_type,
            risk_score=item.risk_score,
            severity=item.severity,
            reasons=item.reasons,
            evidence=item.evidence,
            detected_at=item.detected_at,
            status=item.status,
            requires_investigation=item.requires_investigation
        )
        for item in items
    ]

@router.get("/{anomaly_id}", response_model=AnomalyResponse)
async def get_anomaly(anomaly_id: str):
    anomalies_col = get_anomalies_col()
    item = await anomalies_col.find_one({"$or": [{"anomaly_id": anomaly_id}, {"source_id": anomaly_id}]})
    if not item:
        raise HTTPException(status_code=404, detail=f"Anomaly record '{anomaly_id}' not found")
        
    return AnomalyResponse(
        id=item["_id"],
        anomaly_id=item["anomaly_id"],
        source_type=item["source_type"],
        source_id=item["source_id"],
        patient_id=item.get("patient_id"),
        hospital_id=item.get("hospital_id"),
        anomaly_type=item["anomaly_type"],
        risk_score=item["risk_score"],
        severity=item["severity"],
        reasons=item.get("reasons", []),
        evidence=item.get("evidence", {}),
        detected_at=item["detected_at"],
        status=item["status"],
        requires_investigation=item["requires_investigation"]
    )
