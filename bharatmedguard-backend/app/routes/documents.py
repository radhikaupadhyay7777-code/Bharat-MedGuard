import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from app.core.database import get_documents_col
from app.schemas.document import DocumentResponse, DocumentAnalysisResponse
from app.services.document_service import document_service
from app.core.config import settings
from app.core.dependencies import get_optional_current_user
from app.models.user import UserInDB
from app.utils.audit_helper import log_audit_action

router = APIRouter(prefix="/documents", tags=["Medical Document Intelligence"])

@router.get("", response_model=List[DocumentResponse])
async def list_documents(limit: int = Query(50, le=100)):
    docs_col = get_documents_col()
    cursor = docs_col.find({}).sort("anomaly_score", -1).limit(limit)
    items = await cursor.to_list(limit)
    return [
        DocumentResponse(
            id=item["_id"],
            document_id=item["document_id"],
            document_name=item["document_name"],
            claim_id=item["claim_id"],
            patient_id=item.get("patient_id"),
            hospital_name=item["hospital_name"],
            upload_date=item.get("upload_date", "2026-08-25 09:32 IST"),
            document_type=item.get("document_type", "Discharge Summary"),
            ocr_engine=item.get("ocr_engine", "Tesseract v5.3"),
            ocr_confidence=item.get("ocr_confidence", "98.4%"),
            anomaly_score=item.get("anomaly_score", 0),
            status=item.get("status", "VERIFIED"),
            extracted_fields=item.get("extracted_fields", {}),
            ocr_text_snippet=item.get("ocr_text_snippet", ""),
            verification_summary=item.get("verification_summary", "")
        )
        for item in items
    ]

@router.post("/upload", response_model=DocumentAnalysisResponse)
async def upload_document(
    file: UploadFile = File(...),
    claim_id: str = Form("BM-1024"),
    hospital_name: str = Form("CityCare Apex Multi-Speciality"),
    current_user: Optional[UserInDB] = Depends(get_optional_current_user)
):
    # Validate file extension
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file extension '.{ext}'. Allowed types: {settings.ALLOWED_EXTENSIONS}"
        )

    # Save uploaded file
    safe_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, safe_filename)
    
    contents = await file.read()
    if len(contents) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File exceeds maximum allowed size")

    with open(file_path, "wb") as f:
        f.write(contents)

    analyzed = await document_service.process_and_analyze_document(
        filename=file.filename,
        claim_id=claim_id,
        file_path=file_path,
        hospital_name=hospital_name
    )

    if current_user:
        await log_audit_action(
            user_id=current_user.email,
            role=current_user.role.value,
            action="UPLOAD_OCR_DOCUMENT",
            resource_type="DOCUMENT",
            resource_id=analyzed["document_id"],
            status="SUCCESS"
        )

    return DocumentAnalysisResponse(
        document_id=analyzed["document_id"],
        claim_id=analyzed["claim_id"],
        ocr_confidence=analyzed["ocr_confidence"],
        anomaly_score=analyzed["anomaly_score"],
        status=analyzed["status"],
        mismatches=[
            {"field": k, "extracted": v.get("value"), "claim": v.get("claimValue")}
            for k, v in analyzed["extracted_fields"].items() if not v.get("match")
        ],
        extracted_fields=analyzed["extracted_fields"],
        verification_summary=analyzed["verification_summary"],
        requires_investigation=analyzed["anomaly_score"] > 60
    )

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str):
    docs_col = get_documents_col()
    item = await docs_col.find_one({"document_id": document_id})
    if not item:
        raise HTTPException(status_code=404, detail=f"Document '{document_id}' not found")
        
    return DocumentResponse(
        id=item["_id"],
        document_id=item["document_id"],
        document_name=item["document_name"],
        claim_id=item["claim_id"],
        patient_id=item.get("patient_id"),
        hospital_name=item["hospital_name"],
        upload_date=item.get("upload_date", "2026-08-25 09:32 IST"),
        document_type=item.get("document_type", "Discharge Summary"),
        ocr_engine=item.get("ocr_engine", "Tesseract v5.3"),
        ocr_confidence=item.get("ocr_confidence", "98.4%"),
        anomaly_score=item.get("anomaly_score", 0),
        status=item.get("status", "VERIFIED"),
        extracted_fields=item.get("extracted_fields", {}),
        ocr_text_snippet=item.get("ocr_text_snippet", ""),
        verification_summary=item.get("verification_summary", "")
    )

@router.get("/{document_id}/extracted-data")
async def get_extracted_data(document_id: str):
    docs_col = get_documents_col()
    item = await docs_col.find_one({"document_id": document_id})
    if not item:
        raise HTTPException(status_code=404, detail=f"Document '{document_id}' not found")
    return {
        "document_id": item["document_id"],
        "ocr_confidence": item.get("ocr_confidence"),
        "ocr_text_snippet": item.get("ocr_text_snippet"),
        "extracted_fields": item.get("extracted_fields")
    }
