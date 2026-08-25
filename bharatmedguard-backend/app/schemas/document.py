from typing import Optional, Dict, Any, List
from pydantic import BaseModel

class DocumentResponse(BaseModel):
    id: str
    document_id: str
    document_name: str
    claim_id: str
    patient_id: Optional[str] = None
    hospital_name: str
    upload_date: str
    document_type: str
    ocr_engine: str
    ocr_confidence: str
    anomaly_score: int
    status: str
    extracted_fields: Dict[str, Any] = {}
    ocr_text_snippet: str
    verification_summary: str

class DocumentAnalysisResponse(BaseModel):
    document_id: str
    claim_id: str
    ocr_confidence: str
    anomaly_score: int
    status: str
    mismatches: List[Dict[str, Any]] = []
    extracted_fields: Dict[str, Any] = {}
    verification_summary: str
    requires_investigation: bool
