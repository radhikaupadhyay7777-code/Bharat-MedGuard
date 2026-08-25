import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.core.database import get_clinical_col
from app.models.clinical import ClinicalRecordInDB
from app.models.anomaly import AnomalySourceType, AnomalySeverity
from app.services.anomaly_service import anomaly_service

class ClinicalService:
    @staticmethod
    async def analyze_clinical_record(record_data: Dict[str, Any]) -> Dict[str, Any]:
        clinical_col = get_clinical_col()
        
        record_id = record_data.get("record_id") or f"CLN-{str(uuid.uuid4())[:3].upper()}"
        finding = record_data.get("clinical_finding", "")
        
        # Determine risk score and severity based on clinical heuristics
        risk_score = 65
        severity = AnomalySeverity.MEDIUM
        status = "REVIEW_REQUIRED"
        
        if "potassium" in finding.lower() or "8.9" in finding:
            risk_score = 82
            severity = AnomalySeverity.HIGH
        elif "sildenafil" in finding.lower() or "nitroglycerin" in finding.lower() or "interaction" in finding.lower():
            risk_score = 91
            severity = AnomalySeverity.CRITICAL

        doc = {
            "record_id": record_id,
            "patient_id": record_data.get("patient_id", "P-102"),
            "patient_name": record_data.get("patient_name", "Aarav Sharma"),
            "hospital_name": record_data.get("hospital_name", "BharatCare Super Speciality"),
            "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M IST"),
            "category": record_data.get("category", "Unphysiological Lab Value Spike"),
            "severity": severity.value,
            "risk_score": risk_score,
            "clinical_finding": finding,
            "possible_causes": record_data.get("possible_causes", "Sample hemolysis, transcription typo, or synthetic record creation."),
            "recommendation": record_data.get("recommendation", "Flagged as Potential Clinical Anomaly. Professional review required."),
            "ethical_disclaimer": "BharatMedGuard AI does not perform medical diagnosis. This finding flags data divergence requiring clinical professional review.",
            "status": status,
            "created_at": datetime.now(timezone.utc).isoformat() + "Z"
        }

        existing = await clinical_col.find_one({"record_id": record_id})
        if existing:
            await clinical_col.update_one({"record_id": record_id}, {"$set": doc})
            doc["_id"] = existing["_id"]
        else:
            res = await clinical_col.insert_one(doc)
            doc["_id"] = str(res.inserted_id)

        # Record in unified anomaly engine
        if risk_score > 30:
            await anomaly_service.record_anomaly(
                source_type=AnomalySourceType.CLINICAL,
                source_id=record_id,
                anomaly_type="Clinical Data Divergence",
                risk_score=risk_score,
                severity=severity,
                reasons=[finding],
                evidence={"recommendation": doc["recommendation"], "causes": doc["possible_causes"]},
                patient_id=doc["patient_id"]
            )

        return doc

clinical_service = ClinicalService()
