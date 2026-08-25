from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, Query
from app.core.database import get_patients_col, get_anomalies_col
from app.schemas.patient import PatientCreate, PatientResponse, IdentityAnalysisResponse
from app.schemas.anomaly import AnomalyResponse
from app.services.identity_service import identity_service
from app.core.dependencies import get_optional_current_user
from app.models.user import UserInDB
from app.utils.audit_helper import log_audit_action

class GeneralPatientAnalyzeRequest(BaseModel):
    patient_id: Optional[str] = "P-102"
    name: Optional[str] = "Aarav Sharma"
    abha_id: Optional[str] = "91-8842-1920-5512"
    aadhaar_hash: Optional[str] = None
    age: Optional[int] = 44
    gender: Optional[str] = "Male"
    primary_location: Optional[str] = "Mumbai, Maharashtra"
    primary_city: Optional[str] = "Mumbai"
    connected_hospitals: Optional[List[Dict[str, Any]]] = [
        {"hospital_id": "HOSP-DEL-01", "hospital_name": "BharatCare Super Speciality (New Delhi)", "city": "New Delhi", "timestamp": "2026-08-25 10:15 IST", "action": "Inpatient Admission"},
        {"hospital_id": "HOSP-BLR-02", "hospital_name": "National Medical Institute (Bengaluru)", "city": "Bengaluru", "timestamp": "2026-08-25 12:30 IST", "action": "Emergency Ward Registration"}
    ]

router = APIRouter(prefix="/patients", tags=["Patient & Identity Intelligence"])

@router.get("", response_model=List[PatientResponse])
async def list_patients(limit: int = Query(50, le=100)):
    patients_col = get_patients_col()
    cursor = patients_col.find({}).sort("risk_score", -1).limit(limit)
    items = await cursor.to_list(limit)
    return [
        PatientResponse(
            id=item["_id"],
            patient_id=item["patient_id"],
            name=item["name"],
            abha_id=item["abha_id"],
            aadhaar_hash=item.get("aadhaar_hash", "SHA256:..."),
            age=item.get("age", 40),
            gender=item.get("gender", "Male"),
            primary_location=item.get("primary_location", "Mumbai"),
            primary_city=item.get("primary_city", "Mumbai"),
            risk_score=item.get("risk_score", 0),
            severity=item.get("severity", "LOW"),
            anomaly_type=item.get("anomaly_type"),
            connected_hospitals=item.get("connected_hospitals", []),
            flags=item.get("flags", [])
        )
        for item in items
    ]

@router.post("", response_model=PatientResponse)
async def register_patient(patient_in: PatientCreate, current_user: Optional[UserInDB] = Depends(get_optional_current_user)):
    analyzed = await identity_service.analyze_patient_identity(patient_in.model_dump())
    
    if current_user:
        await log_audit_action(
            user_id=current_user.email,
            role=current_user.role.value,
            action="REGISTER_PATIENT_ABHA",
            resource_type="PATIENT",
            resource_id=analyzed["patient_id"],
            status="SUCCESS"
        )
        
    return PatientResponse(
        id=analyzed["_id"],
        patient_id=analyzed["patient_id"],
        name=analyzed["name"],
        abha_id=analyzed["abha_id"],
        aadhaar_hash=analyzed["aadhaar_hash"],
        age=analyzed["age"],
        gender=analyzed["gender"],
        primary_location=analyzed["primary_location"],
        primary_city=analyzed["primary_city"],
        risk_score=analyzed["risk_score"],
        severity=analyzed["severity"],
        anomaly_type=analyzed.get("anomaly_type"),
        connected_hospitals=analyzed.get("connected_hospitals", []),
        flags=analyzed.get("flags", [])
    )

@router.post("/analyze", response_model=IdentityAnalysisResponse)
async def analyze_patient_payload(
    payload: GeneralPatientAnalyzeRequest,
    current_user: Optional[UserInDB] = Depends(get_optional_current_user)
):
    analyzed = await identity_service.analyze_patient_identity(payload.model_dump())
    
    if current_user:
        await log_audit_action(
            user_id=current_user.email,
            role=current_user.role.value,
            action="ANALYZE_PATIENT_IDENTITY",
            resource_type="PATIENT",
            resource_id=analyzed["patient_id"],
            status="SUCCESS"
        )

    return IdentityAnalysisResponse(
        patient_id=analyzed["patient_id"],
        risk_score=analyzed["risk_score"],
        severity=analyzed["severity"],
        anomaly_detected=analyzed["risk_score"] > 30,
        anomaly_type=analyzed.get("anomaly_type", "Standard"),
        velocity_analysis=analyzed.get("velocity_analysis", {}),
        reasons=analyzed.get("flags", []),
        requires_investigation=analyzed["risk_score"] > 60
    )

@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(patient_id: str):
    patients_col = get_patients_col()
    item = await patients_col.find_one({"$or": [{"patient_id": patient_id}, {"abha_id": patient_id}]})
    if not item:
        raise HTTPException(status_code=404, detail=f"Patient '{patient_id}' not found")
        
    return PatientResponse(
        id=item["_id"],
        patient_id=item["patient_id"],
        name=item["name"],
        abha_id=item["abha_id"],
        aadhaar_hash=item.get("aadhaar_hash", "SHA256:..."),
        age=item.get("age", 40),
        gender=item.get("gender", "Male"),
        primary_location=item.get("primary_location", "Mumbai"),
        primary_city=item.get("primary_city", "Mumbai"),
        risk_score=item.get("risk_score", 0),
        severity=item.get("severity", "LOW"),
        anomaly_type=item.get("anomaly_type"),
        connected_hospitals=item.get("connected_hospitals", []),
        flags=item.get("flags", [])
    )

@router.post("/{patient_id}/analyze", response_model=IdentityAnalysisResponse)
async def analyze_patient_by_id(patient_id: str):
    patients_col = get_patients_col()
    patient = await patients_col.find_one({"$or": [{"patient_id": patient_id}, {"abha_id": patient_id}]})
    if not patient:
        raise HTTPException(status_code=404, detail=f"Patient '{patient_id}' not found")

    analyzed = await identity_service.analyze_patient_identity(patient)
    return IdentityAnalysisResponse(
        patient_id=analyzed["patient_id"],
        risk_score=analyzed["risk_score"],
        severity=analyzed["severity"],
        anomaly_detected=analyzed["risk_score"] > 30,
        anomaly_type=analyzed.get("anomaly_type", "Standard"),
        velocity_analysis=analyzed.get("velocity_analysis", {}),
        reasons=analyzed.get("flags", []),
        requires_investigation=analyzed["risk_score"] > 60
    )

@router.get("/{patient_id}/anomalies", response_model=List[AnomalyResponse])
async def get_patient_anomalies(patient_id: str):
    anomalies_col = get_anomalies_col()
    cursor = anomalies_col.find({"$or": [{"source_id": patient_id}, {"patient_id": patient_id}]})
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
