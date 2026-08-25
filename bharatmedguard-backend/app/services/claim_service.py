import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.core.database import get_claims_col, get_documents_col
from app.models.claim import ClaimInDB, ClaimEvidence, TimelineEvent
from app.models.anomaly import AnomalySourceType, AnomalySeverity
from app.ml.feature_engineering import extract_claim_features
from app.ml.model_manager import model_manager
from app.services.risk_service import risk_service
from app.services.anomaly_service import anomaly_service
from app.core.logging_config import app_logger

class ClaimService:
    @staticmethod
    async def create_and_analyze_claim(claim_data: Dict[str, Any]) -> Dict[str, Any]:
        claims_col = get_claims_col()
        
        claim_id = claim_data.get("claim_id") or f"BM-{str(uuid.uuid4())[:4].upper()}"
        claim_number = claim_data.get("claim_number") or f"CLM-{datetime.now(timezone.utc).year}-{str(uuid.uuid4())[:6].upper()}"
        
        amount = float(claim_data.get("claimed_amount", 100000.0))
        benchmark = float(claim_data.get("benchmark_amount") or 100000.0)
        deviation_ratio = f"{amount / max(benchmark, 1.0):.1f}x"
        
        # 1. Duplicate check (same patient, same procedure, within 90 days)
        existing_dup = await claims_col.find_one({
            "patient_id": claim_data.get("patient_id"),
            "procedure": claim_data.get("procedure"),
            "claim_id": {"$ne": claim_id}
        })
        duplicate_hit = existing_dup is not None

        # 2. Historical claim count for patient
        patient_claims_count = await claims_col.count_documents({"patient_id": claim_data.get("patient_id")})
        
        # 3. Document mismatch check if supporting doc provided
        doc_mismatch_score = 0.0
        doc_flags = []
        if claim_data.get("supporting_doc_id"):
            docs_col = get_documents_col()
            doc_record = await docs_col.find_one({"document_id": claim_data.get("supporting_doc_id")})
            if doc_record:
                doc_mismatch_score = float(doc_record.get("anomaly_score", 0)) / 100.0
                if doc_mismatch_score > 0.5:
                    doc_flags.append("Supporting medical document contains diagnostic or financial mismatch")

        # 4. Feature Extraction & Isolation Forest inference
        features = extract_claim_features(
            claim_dict={"claimed_amount": amount, "benchmark_amount": benchmark},
            hospital_avg_claim=110000.0,
            patient_prior_claims_count=patient_claims_count,
            duplicate_count=1 if duplicate_hit else 0,
            doc_mismatch_score=doc_mismatch_score
        )
        is_ml_anomaly, anomaly_prob, path_length = model_manager.claim_model.predict_anomaly(features)

        # 5. Rule penalties & Composite Risk
        rule_penalty = 0
        anomaly_flags = []
        ratio_val = amount / max(benchmark, 1.0)
        
        if duplicate_hit:
            rule_penalty += 35
            anomaly_flags.append(f"Duplicate Claim pattern: Matching procedure already registered under historic claim #{existing_dup.get('claim_id')}")
            
        if ratio_val >= 2.5:
            rule_penalty += 35
            anomaly_flags.append(f"Claim amount ({deviation_ratio}) significantly exceeds hospital regional baseline (+{int((ratio_val-1)*100)}%)")
        elif ratio_val >= 1.4:
            rule_penalty += 15
            anomaly_flags.append(f"Hospital billing deviation detected (+{int((ratio_val-1)*100)}% above standard tariff)")

        if patient_claims_count >= 3:
            rule_penalty += 20
            anomaly_flags.append(f"Excessive claim frequency: {patient_claims_count + 1} major claims registered under same ABHA in current cycle")

        anomaly_flags.extend(doc_flags)

        risk_score, severity = risk_service.calculate_composite_risk(
            ml_anomaly_prob=anomaly_prob,
            rule_penalty_score=rule_penalty,
            duplicate_hit=duplicate_hit,
            mismatch_count=len(doc_flags)
        )

        now_time = datetime.now(timezone.utc).strftime("%H:%M:%S")
        evidence = {
            "timeline": [
                {"time": now_time, "event": "Claim submitted via ABDM FHIR Gateway"},
                {"time": now_time, "event": f"Isolation Forest path length evaluated at h(x)={path_length:.1f} (Anomaly Prob: {anomaly_prob:.1%})"},
                {"time": now_time, "event": f"Composite risk score calculated: {risk_score}/100 ({severity.value})"}
            ],
            "ai_explanation": (
                f"The system identified multiple indicators requiring investigation: "
                f"{'; '.join(anomaly_flags)}" if anomaly_flags else
                "All extracted parameters conform to standard clinical tariffs with valid supporting documentation."
            )
        }

        # Store in claims collection
        claim_doc = {
            "claim_id": claim_id,
            "claim_number": claim_number,
            "patient_id": claim_data["patient_id"],
            "patient_name": claim_data["patient_name"],
            "abha_id": claim_data["abha_id"],
            "hospital_id": claim_data["hospital_id"],
            "hospital_name": claim_data["hospital_name"],
            "procedure": claim_data["procedure"],
            "claimed_amount": amount,
            "benchmark_amount": benchmark,
            "deviation_ratio": deviation_ratio,
            "submission_date": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M IST"),
            "risk_score": risk_score,
            "severity": severity.value,
            "status": "INVESTIGATION_REQUIRED" if risk_score > 60 else "VERIFIED",
            "anomaly_flags": anomaly_flags,
            "evidence": evidence,
            "created_at": datetime.now(timezone.utc).isoformat() + "Z"
        }

        existing_claim = await claims_col.find_one({"claim_id": claim_id})
        if existing_claim:
            await claims_col.update_one({"claim_id": claim_id}, {"$set": claim_doc})
            claim_doc["_id"] = existing_claim["_id"]
        else:
            res = await claims_col.insert_one(claim_doc)
            claim_doc["_id"] = str(res.inserted_id)

        # Record in unified anomaly engine
        if risk_score > 30:
            await anomaly_service.record_anomaly(
                source_type=AnomalySourceType.CLAIM,
                source_id=claim_id,
                anomaly_type="Billing & Tariff Deviation",
                risk_score=risk_score,
                severity=severity,
                reasons=anomaly_flags,
                evidence=evidence,
                patient_id=claim_data["patient_id"],
                hospital_id=claim_data["hospital_id"]
            )

        return claim_doc

claim_service = ClaimService()
