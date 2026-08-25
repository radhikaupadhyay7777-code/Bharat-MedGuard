from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from app.core.database import get_investigations_col
from app.schemas.investigation import (
    InvestigationCreate,
    InvestigationUpdate,
    InvestigationResponse,
    NoteCreate
)
from app.models.investigation import InvestigationStatus, InvestigationInDB
from app.services.investigation_service import investigation_service
from app.core.dependencies import get_current_user
from app.models.user import UserInDB

router = APIRouter(prefix="/investigations", tags=["Investigation Center"])

@router.get("", response_model=List[InvestigationResponse])
async def list_investigations(
    status: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    limit: int = Query(50, le=100)
):
    inv_col = get_investigations_col()
    query = {}
    if status:
        query["status"] = status.upper()
    if severity:
        query["severity"] = severity.upper()

    cursor = inv_col.find(query).sort("risk_score", -1).limit(limit)
    items = await cursor.to_list(limit)
    return [
        InvestigationResponse(
            id=item["_id"],
            case_id=item["case_id"],
            claim_id=item.get("claim_id"),
            patient_id=item.get("patient_id"),
            patient_name=item["patient_name"],
            hospital_name=item["hospital_name"],
            category=item["category"],
            claimed_amount=item.get("claimed_amount"),
            risk_score=item["risk_score"],
            severity=item["severity"],
            status=item["status"],
            investigator_id=item.get("investigator_id"),
            investigator_name=item.get("investigator_name", "Radhika Upadhyay"),
            detected_anomalies=item.get("detected_anomalies", []),
            timeline=item.get("timeline", []),
            ai_explanation=item.get("ai_explanation", ""),
            notes=item.get("notes", []),
            created_at=item.get("created_at", "2026-08-25T09:36:00Z"),
            updated_at=item.get("updated_at", "2026-08-25T09:36:00Z")
        )
        for item in items
    ]

@router.post("", response_model=InvestigationResponse)
async def create_investigation_endpoint(
    inv_in: InvestigationCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    doc = await investigation_service.create_investigation(
        inv_in.model_dump(),
        user_id=current_user.email,
        user_role=current_user.role.value
    )
    return InvestigationResponse(**doc)

@router.get("/{case_id}", response_model=InvestigationResponse)
async def get_investigation(case_id: str):
    inv_col = get_investigations_col()
    item = await inv_col.find_one({"$or": [{"case_id": case_id}, {"_id": case_id}]})
    if not item:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found")
        
    return InvestigationResponse(
        id=item["_id"],
        case_id=item["case_id"],
        claim_id=item.get("claim_id"),
        patient_id=item.get("patient_id"),
        patient_name=item["patient_name"],
        hospital_name=item["hospital_name"],
        category=item["category"],
        claimed_amount=item.get("claimed_amount"),
        risk_score=item["risk_score"],
        severity=item["severity"],
        status=item["status"],
        investigator_id=item.get("investigator_id"),
        investigator_name=item.get("investigator_name", "Radhika Upadhyay"),
        detected_anomalies=item.get("detected_anomalies", []),
        timeline=item.get("timeline", []),
        ai_explanation=item.get("ai_explanation", ""),
        notes=item.get("notes", []),
        created_at=item.get("created_at", "2026-08-25T09:36:00Z"),
        updated_at=item.get("updated_at", "2026-08-25T09:36:00Z")
    )

@router.patch("/{case_id}", response_model=InvestigationResponse)
async def update_investigation_status_endpoint(
    case_id: str,
    update_in: InvestigationUpdate,
    current_user: UserInDB = Depends(get_current_user)
):
    if not update_in.status:
        raise HTTPException(status_code=400, detail="New status must be provided")

    updated = await investigation_service.update_status(
        case_id=case_id,
        new_status=update_in.status,
        user_id=current_user.email,
        user_role=current_user.role.value
    )
    if not updated:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found")
    return InvestigationResponse(**updated)

@router.post("/{case_id}/notes")
async def add_investigation_note_endpoint(
    case_id: str,
    note_in: NoteCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    note = await investigation_service.add_note(
        case_id=case_id,
        content=note_in.content,
        author_name=current_user.name,
        author_role=current_user.role.value,
        user_id=current_user.email
    )
    if not note:
        raise HTTPException(status_code=404, detail=f"Case '{case_id}' not found")
    return note
