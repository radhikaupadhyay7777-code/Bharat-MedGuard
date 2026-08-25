from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, Query
from app.core.database import get_claims_col, get_anomalies_col
from app.schemas.claim import ClaimCreate, ClaimResponse, ClaimAnalysisResponse
from app.schemas.anomaly import AnomalyResponse
from app.services.claim_service import claim_service
from app.core.dependencies import get_current_user, get_optional_current_user, require_roles
from app.models.user import UserInDB, UserRole
from app.utils.audit_helper import log_audit_action

class GeneralClaimAnalyzeRequest(BaseModel):
    claim_id: Optional[str] = None
    procedure: str = "Coronary Angioplasty + 2 Stents"
    claimed_amount: float = Field(..., gt=0)
    benchmark_amount: Optional[float] = 100000.0
    patient_id: Optional[str] = "P-102"
    patient_name: Optional[str] = "Aarav Sharma"
    abha_id: Optional[str] = "91-8842-1920-5512"
    hospital_id: Optional[str] = "HOSP-MUM-03"
    hospital_name: Optional[str] = "CityCare Apex Multi-Speciality"

router = APIRouter(prefix="/claims", tags=["Claims Intelligence"])

@router.get("", response_model=List[ClaimResponse])
async def list_claims(
    severity: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50, le=100)
):
    claims_col = get_claims_col()
    query = {}
    if severity:
        query["severity"] = severity.upper()
    if search:
        query["$or"] = [
            {"claim_id": {"$regex": search, "$options": "i"}},
            {"claim_number": {"$regex": search, "$options": "i"}},
            {"patient_name": {"$regex": search, "$options": "i"}},
            {"procedure": {"$regex": search, "$options": "i"}}
        ]
    cursor = claims_col.find(query).sort("risk_score", -1).limit(limit)
    items = await cursor.to_list(limit)
    return [
        ClaimResponse(
            id=item["_id"],
            claim_id=item["claim_id"],
            claim_number=item.get("claim_number", item["claim_id"]),
            patient_id=item["patient_id"],
            patient_name=item["patient_name"],
            abha_id=item["abha_id"],
            hospital_id=item["hospital_id"],
            hospital_name=item["hospital_name"],
            procedure=item["procedure"],
            claimed_amount=item["claimed_amount"],
            benchmark_amount=item.get("benchmark_amount", item["claimed_amount"]),
            deviation_ratio=item.get("deviation_ratio", "1.0x"),
            submission_date=item.get("submission_date", "2026-08-25 09:32 IST"),
            risk_score=item.get("risk_score", 0),
            severity=item.get("severity", "LOW"),
            status=item.get("status", "PENDING"),
            anomaly_flags=item.get("anomaly_flags", []),
            evidence=item.get("evidence")
        )
        for item in items
    ]

@router.post("", response_model=ClaimResponse)
async def submit_claim(
    claim_in: ClaimCreate,
    current_user: Optional[UserInDB] = Depends(get_optional_current_user)
):
    claim_doc = await claim_service.create_and_analyze_claim(claim_in.model_dump())
    
    if current_user:
        await log_audit_action(
            user_id=current_user.email,
            role=current_user.role.value,
            action="SUBMIT_CLAIM",
            resource_type="CLAIM",
            resource_id=claim_doc["claim_id"],
            status="SUCCESS"
        )

    return ClaimResponse(
        id=claim_doc["_id"],
        claim_id=claim_doc["claim_id"],
        claim_number=claim_doc["claim_number"],
        patient_id=claim_doc["patient_id"],
        patient_name=claim_doc["patient_name"],
        abha_id=claim_doc["abha_id"],
        hospital_id=claim_doc["hospital_id"],
        hospital_name=claim_doc["hospital_name"],
        procedure=claim_doc["procedure"],
        claimed_amount=claim_doc["claimed_amount"],
        benchmark_amount=claim_doc["benchmark_amount"],
        deviation_ratio=claim_doc["deviation_ratio"],
        submission_date=claim_doc["submission_date"],
        risk_score=claim_doc["risk_score"],
        severity=claim_doc["severity"],
        status=claim_doc["status"],
        anomaly_flags=claim_doc["anomaly_flags"],
        evidence=claim_doc.get("evidence")
    )

@router.post("/analyze", response_model=ClaimAnalysisResponse)
async def analyze_claim_payload(
    payload: GeneralClaimAnalyzeRequest,
    current_user: Optional[UserInDB] = Depends(get_optional_current_user)
):
    analyzed = await claim_service.create_and_analyze_claim(payload.model_dump())
    
    if current_user:
        await log_audit_action(
            user_id=current_user.email,
            role=current_user.role.value,
            action="ANALYZE_CLAIM",
            resource_type="CLAIM",
            resource_id=analyzed["claim_id"],
            status="SUCCESS"
        )

    return ClaimAnalysisResponse(
        claim_id=analyzed["claim_id"],
        risk_score=analyzed["risk_score"],
        severity=analyzed["severity"],
        anomaly_detected=analyzed["risk_score"] > 30,
        isolation_forest_score=round(analyzed["risk_score"] / 100.0, 3),
        reasons=analyzed["anomaly_flags"],
        evidence=analyzed.get("evidence", {}),
        requires_investigation=analyzed["risk_score"] > 60
    )

@router.get("/{claim_id}", response_model=ClaimResponse)
async def get_claim(claim_id: str):
    claims_col = get_claims_col()
    item = await claims_col.find_one({"$or": [{"claim_id": claim_id}, {"claim_number": claim_id}]})
    if not item:
        raise HTTPException(status_code=404, detail=f"Claim '{claim_id}' not found")
    
    return ClaimResponse(
        id=item["_id"],
        claim_id=item["claim_id"],
        claim_number=item.get("claim_number", item["claim_id"]),
        patient_id=item["patient_id"],
        patient_name=item["patient_name"],
        abha_id=item["abha_id"],
        hospital_id=item["hospital_id"],
        hospital_name=item["hospital_name"],
        procedure=item["procedure"],
        claimed_amount=item["claimed_amount"],
        benchmark_amount=item.get("benchmark_amount", item["claimed_amount"]),
        deviation_ratio=item.get("deviation_ratio", "1.0x"),
        submission_date=item.get("submission_date", "2026-08-25 09:32 IST"),
        risk_score=item.get("risk_score", 0),
        severity=item.get("severity", "LOW"),
        status=item.get("status", "PENDING"),
        anomaly_flags=item.get("anomaly_flags", []),
        evidence=item.get("evidence")
    )

@router.post("/{claim_id}/analyze", response_model=ClaimAnalysisResponse)
async def analyze_claim_by_id(claim_id: str):
    claims_col = get_claims_col()
    claim = await claims_col.find_one({"$or": [{"claim_id": claim_id}, {"claim_number": claim_id}]})
    if not claim:
        raise HTTPException(status_code=404, detail=f"Claim '{claim_id}' not found")

    analyzed = await claim_service.create_and_analyze_claim(claim)
    
    return ClaimAnalysisResponse(
        claim_id=analyzed["claim_id"],
        risk_score=analyzed["risk_score"],
        severity=analyzed["severity"],
        anomaly_detected=analyzed["risk_score"] > 30,
        isolation_forest_score=round(analyzed["risk_score"] / 100.0, 3),
        reasons=analyzed["anomaly_flags"],
        evidence=analyzed.get("evidence", {}),
        requires_investigation=analyzed["risk_score"] > 60
    )

@router.get("/{claim_id}/anomalies", response_model=List[AnomalyResponse])
async def get_claim_anomalies(claim_id: str):
    anomalies_col = get_anomalies_col()
    cursor = anomalies_col.find({"source_id": claim_id})
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
