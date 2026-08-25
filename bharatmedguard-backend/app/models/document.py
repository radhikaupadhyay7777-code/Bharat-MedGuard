from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone

class FieldMatchDetail(BaseModel):
    value: str
    claim_value: Optional[str] = None
    match: bool = True

class DocumentInDB(BaseModel):
    id: str = Field(..., alias="_id")
    document_id: str
    document_name: str
    claim_id: str
    patient_id: Optional[str] = None
    hospital_name: str
    upload_date: str = Field(default_factory=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M IST"))
    document_type: str = "Discharge Summary"
    file_path: Optional[str] = None
    ocr_engine: str = "Tesseract v5.3 + Custom BMG Med-NLP"
    ocr_confidence: str = "98.4%"
    anomaly_score: int = 0
    status: str = "VERIFIED"
    extracted_fields: Dict[str, FieldMatchDetail] = {}
    ocr_text_snippet: str = ""
    verification_summary: str = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat() + "Z")

    model_config = ConfigDict(populate_by_name=True)
