from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Query
from app.core.database import get_clinical_col, get_anomalies_col
from app.schemas.clinical import ClinicalRecordCreate, ClinicalRecordResponse, ClinicalAnalysisResponse
from app.schemas.anomaly import AnomalyResponse
from app.services.clinical_service import clinical_service
from app.core.dependencies import get_optional_current_user
from app.models.user import UserInDB
from app.utils.audit_helper import log_audit_action

class GeneralClinicalAnalyzeRequest(BaseModel):
    record_id: Optional[str] = "CLN-401"
    patient_id: Optional[str] = "P-102"
    patient_name: Optional[str] = "Aarav Sharma"
    hospital_name: Optional[str] = "BharatCare Super Speciality"
    category: Optional[str] = "Unphysiological Lab Value Spike"
    clinical_finding: str = "Serum Potassium jumped from 4.1 mmol/L to 8.9 mmol/L within 90 minutes."
    possible_causes: Optional[str] = "Sample hemolysis, transcription typo, or synthetic test record generation."
    recommendation: Optional[str] = "Flagged as Potential Clinical Anomaly. Professional review required."

router = APIRouter(prefix="/clinical", tags=["Clinical Intelligence"])

@router.get("", response_model=List[ClinicalRecordResponse])
async def list_clinical_records(limit: int = Query(50, le=100)):
    clinical_col = get_clinical_col()
    cursor = clinical_col.find({}).sort("risk_score", -1).limit(limit)
    items = await cursor.to_list(limit)
    return [
        ClinicalRecordResponse(
            id=item["_id"],
            record_id=item["record_id"],
            patient_id=item["patient_id"],
            patient_name=item["patient_name"],
            hospital_name=item["hospital_name"],
            timestamp=item.get("timestamp", "2026-08-25 10:40 IST"),
            category=item["category"],
            severity=item.get("severity", "LOW"),
            risk_score=item.get("risk_score", 0),
            clinical_finding=item["clinical_finding"],
            possible_causes=item.get("possible_causes", ""),
            recommendation=item.get("recommendation", ""),
            ethical_disclaimer=item.get("ethical_disclaimer", "BharatMedGuard AI does not perform medical diagnosis."),
            status=item.get("status", "REVIEW_REQUIRED")
        )
        for item in items
    ]

@router.post("", response_model=ClinicalRecordResponse)
async def submit_clinical_record(record_in: ClinicalRecordCreate, current_user: Optional[UserInDB] = Depends(get_optional_current_user)):
    analyzed = await clinical_service.analyze_clinical_record(record_in.model_dump())
    
    if current_user:
        await log_audit_action(
            user_id=current_user.email,
            role=current_user.role.value,
            action="SUBMIT_CLINICAL_RECORD",
            resource_type="CLINICAL_RECORD",
            resource_id=analyzed["record_id"],
            status="SUCCESS"
        )
        
    return ClinicalRecordResponse(
        id=analyzed["_id"],
        record_id=analyzed["record_id"],
        patient_id=analyzed["patient_id"],
        patient_name=analyzed["patient_name"],
        hospital_name=analyzed["hospital_name"],
        timestamp=analyzed["timestamp"],
        category=analyzed["category"],
        severity=analyzed["severity"],
        risk_score=analyzed["risk_score"],
        clinical_finding=analyzed["clinical_finding"],
        possible_causes=analyzed["possible_causes"],
        recommendation=analyzed["recommendation"],
        ethical_disclaimer=analyzed["ethical_disclaimer"],
        status=analyzed["status"]
    )

@router.post("/analyze", response_model=ClinicalAnalysisResponse)
async def analyze_clinical_payload(
    payload: GeneralClinicalAnalyzeRequest,
    current_user: Optional[UserInDB] = Depends(get_optional_current_user)
):
    analyzed = await clinical_service.analyze_clinical_record(payload.model_dump())
    
    if current_user:
        await log_audit_action(
            user_id=current_user.email,
            role=current_user.role.value,
            action="ANALYZE_CLINICAL_RECORD",
            resource_type="CLINICAL_RECORD",
            resource_id=analyzed["record_id"],
            status="SUCCESS"
        )

    return ClinicalAnalysisResponse(
        record_id=analyzed["record_id"],
        risk_score=analyzed["risk_score"],
        severity=analyzed["severity"],
        anomaly_detected=analyzed["risk_score"] > 30,
        category=analyzed["category"],
        clinical_finding=analyzed["clinical_finding"],
        recommendation=analyzed["recommendation"],
        ethical_disclaimer=analyzed["ethical_disclaimer"],
        requires_investigation=analyzed["risk_score"] > 60
    )

@router.get("/{patient_id}", response_model=List[ClinicalRecordResponse])
async def get_patient_clinical_records(patient_id: str):
    clinical_col = get_clinical_col()
    cursor = clinical_col.find({"patient_id": patient_id})
    items = await cursor.to_list(20)
    return [
        ClinicalRecordResponse(
            id=item["_id"],
            record_id=item["record_id"],
            patient_id=item["patient_id"],
            patient_name=item["patient_name"],
            hospital_name=item["hospital_name"],
            timestamp=item.get("timestamp", "2026-08-25 10:40 IST"),
            category=item["category"],
            severity=item.get("severity", "LOW"),
            risk_score=item.get("risk_score", 0),
            clinical_finding=item["clinical_finding"],
            possible_causes=item.get("possible_causes", ""),
            recommendation=item.get("recommendation", ""),
            ethical_disclaimer=item.get("ethical_disclaimer", "BharatMedGuard AI does not perform medical diagnosis."),
            status=item.get("status", "REVIEW_REQUIRED")
        )
        for item in items
    ]

@router.post("/{record_id}/analyze", response_model=ClinicalAnalysisResponse)
async def analyze_clinical_by_id(record_id: str):
    clinical_col = get_clinical_col()
    record = await clinical_col.find_one({"record_id": record_id})
    if not record:
        raise HTTPException(status_code=404, detail=f"Clinical record '{record_id}' not found")

    analyzed = await clinical_service.analyze_clinical_record(record)
    return ClinicalAnalysisResponse(
        record_id=analyzed["record_id"],
        risk_score=analyzed["risk_score"],
        severity=analyzed["severity"],
        anomaly_detected=analyzed["risk_score"] > 30,
        category=analyzed["category"],
        clinical_finding=analyzed["clinical_finding"],
        recommendation=analyzed["recommendation"],
        ethical_disclaimer=analyzed["ethical_disclaimer"],
        requires_investigation=analyzed["risk_score"] > 60
    )

@router.get("/{record_id}/anomalies", response_model=List[AnomalyResponse])
async def get_clinical_anomalies(record_id: str):
    anomalies_col = get_anomalies_col()
    cursor = anomalies_col.find({"source_id": record_id})
    items = await cursor.to_list(10)
    return [AnomalyResponse(
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
    ) for item in items]
