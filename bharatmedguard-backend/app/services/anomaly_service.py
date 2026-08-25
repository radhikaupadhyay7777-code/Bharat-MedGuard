import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.core.database import get_anomalies_col
from app.models.anomaly import UnifiedAnomalyRecord, AnomalySourceType, AnomalySeverity
from app.core.logging_config import app_logger

class AnomalyService:
    @staticmethod
    async def record_anomaly(
        source_type: AnomalySourceType,
        source_id: str,
        anomaly_type: str,
        risk_score: int,
        severity: AnomalySeverity,
        reasons: List[str],
        evidence: Dict[str, Any],
        patient_id: Optional[str] = None,
        hospital_id: Optional[str] = None
    ) -> UnifiedAnomalyRecord:
        anomalies_col = get_anomalies_col()
        
        # Check if already exists for this source_id
        existing = await anomalies_col.find_one({"source_id": source_id})
        anomaly_id = existing.get("anomaly_id") if existing else f"ANOM-{datetime.now(timezone.utc).year}-{str(uuid.uuid4())[:6].upper()}"
        
        doc = {
            "anomaly_id": anomaly_id,
            "source_type": source_type.value,
            "source_id": source_id,
            "patient_id": patient_id,
            "hospital_id": hospital_id,
            "anomaly_type": anomaly_type,
            "risk_score": risk_score,
            "severity": severity.value,
            "reasons": reasons,
            "evidence": evidence,
            "model_used": "IsolationForest_v2.4",
            "detected_at": datetime.now(timezone.utc).isoformat() + "Z",
            "status": "FLAGGED" if risk_score > 30 else "CLEARED",
            "requires_investigation": risk_score > 60
        }

        if existing:
            await anomalies_col.update_one({"source_id": source_id}, {"$set": doc})
            doc["_id"] = existing["_id"]
        else:
            res = await anomalies_col.insert_one(doc)
            doc["_id"] = str(res.inserted_id)

        app_logger.info(f"Recorded anomaly {anomaly_id} for {source_type.value}:{source_id} [Risk: {risk_score}/100]")
        return UnifiedAnomalyRecord(**doc)

    @staticmethod
    async def get_anomalies(
        source_type: Optional[str] = None,
        severity: Optional[str] = None,
        min_risk_score: Optional[int] = None,
        limit: int = 50
    ) -> List[UnifiedAnomalyRecord]:
        anomalies_col = get_anomalies_col()
        query = {}
        if source_type:
            query["source_type"] = source_type.upper()
        if severity:
            query["severity"] = severity.upper()
        if min_risk_score is not None:
            query["risk_score"] = {"$gte": min_risk_score}

        cursor = anomalies_col.find(query).sort("risk_score", -1).limit(limit)
        items = await cursor.to_list(limit)
        return [UnifiedAnomalyRecord(**item) for item in items]

anomaly_service = AnomalyService()
