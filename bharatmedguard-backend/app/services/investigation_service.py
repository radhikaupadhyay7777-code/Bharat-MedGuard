import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.core.database import get_investigations_col, get_claims_col
from app.models.investigation import InvestigationInDB, InvestigationStatus
from app.utils.audit_helper import log_audit_action

class InvestigationService:
    @staticmethod
    async def create_investigation(case_data: Dict[str, Any], user_id: str, user_role: str) -> Dict[str, Any]:
        inv_col = get_investigations_col()
        case_id = case_data.get("case_id") or f"BM-{datetime.now(timezone.utc).year}-{str(uuid.uuid4())[:4].upper()}"

        timeline = [
            {"time": "09:32:10", "event": "Claim submitted via ABDM FHIR gateway from CityCare Apex (Mumbai)."},
            {"time": "09:33:04", "event": "Duplicate invoice payload hash flagged across 2 TPAs."},
            {"time": "09:34:18", "event": "Patient P-102 concurrent admission detected in Bengaluru at 12:30."},
            {"time": "09:35:00", "event": "Tesseract OCR engine extracted diagnosis of Gastritis vs billed Angioplasty."},
            {"time": "09:36:12", "event": "Isolation Forest model output composite score: 91/100 (CRITICAL)."}
        ]

        doc = {
            "case_id": case_id,
            "claim_id": case_data.get("claim_id"),
            "patient_id": case_data.get("patient_id", "P-102"),
            "patient_name": case_data.get("patient_name", "Aarav Sharma"),
            "hospital_name": case_data.get("hospital_name", "CityCare Apex Multi-Speciality"),
            "category": case_data.get("category", "Billing & Document Discrepancy"),
            "claimed_amount": case_data.get("claimed_amount", 340000.0),
            "risk_score": case_data.get("risk_score", 91),
            "severity": case_data.get("severity", "CRITICAL"),
            "status": InvestigationStatus.OPEN.value,
            "investigator_id": user_id,
            "investigator_name": "Radhika Upadhyay",
            "detected_anomalies": case_data.get("detected_anomalies", [
                "Duplicate claim hash detected in gateway",
                "Abnormal claim amount (3.4x hospital baseline)",
                "Patient identity concurrent velocity collision",
                "Document OCR mismatch: Gastritis vs Angioplasty"
            ]),
            "timeline": timeline,
            "ai_explanation": case_data.get("ai_explanation") or (
                "The system identified multiple indicators requiring investigation. The submitted claim invoice payload matches a previously registered transaction, while the extracted OCR text from the attached medical discharge summary describes non-invasive conservative treatment rather than the claimed invasive cardiac catheterization procedure."
            ),
            "notes": [],
            "created_at": datetime.now(timezone.utc).isoformat() + "Z",
            "updated_at": datetime.now(timezone.utc).isoformat() + "Z"
        }

        res = await inv_col.insert_one(doc)
        doc["_id"] = str(res.inserted_id)

        await log_audit_action(
            user_id=user_id,
            role=user_role,
            action="CREATE_INVESTIGATION",
            resource_type="INVESTIGATION",
            resource_id=case_id,
            status="SUCCESS"
        )
        return doc

    @staticmethod
    async def update_status(case_id: str, new_status: InvestigationStatus, user_id: str, user_role: str) -> Optional[Dict[str, Any]]:
        inv_col = get_investigations_col()
        existing = await inv_col.find_one({"case_id": case_id})
        if not existing:
            return None

        update_fields = {
            "status": new_status.value,
            "updated_at": datetime.now(timezone.utc).isoformat() + "Z"
        }
        await inv_col.update_one({"case_id": case_id}, {"$set": update_fields})
        existing.update(update_fields)

        await log_audit_action(
            user_id=user_id,
            role=user_role,
            action="UPDATE_INVESTIGATION_STATUS",
            resource_type="INVESTIGATION",
            resource_id=case_id,
            status="SUCCESS"
        )
        return existing

    @staticmethod
    async def add_note(case_id: str, content: str, author_name: str, author_role: str, user_id: str) -> Optional[Dict[str, Any]]:
        inv_col = get_investigations_col()
        note = {
            "note_id": f"NOTE-{str(uuid.uuid4())[:6].upper()}",
            "author": author_name,
            "role": author_role,
            "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M IST"),
            "content": content
        }
        await inv_col.update_one({"case_id": case_id}, {"$push": {"notes": note}, "$set": {"updated_at": datetime.now(timezone.utc).isoformat() + "Z"}})
        
        await log_audit_action(
            user_id=user_id,
            role=author_role,
            action="ADD_INVESTIGATION_NOTE",
            resource_type="INVESTIGATION",
            resource_id=case_id,
            status="SUCCESS"
        )
        return note

investigation_service = InvestigationService()
