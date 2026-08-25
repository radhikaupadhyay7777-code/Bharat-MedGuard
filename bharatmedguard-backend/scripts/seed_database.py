import asyncio
from datetime import datetime, timezone
from app.core.database import (
    get_users_col,
    get_patients_col,
    get_claims_col,
    get_documents_col,
    get_clinical_col,
    get_anomalies_col,
    get_investigations_col,
    get_security_events_col,
    get_audit_logs_col,
    db_manager
)
from app.core.security import get_password_hash
from app.models.user import UserRole
from app.core.logging_config import app_logger

async def seed_initial_records(force_refresh: bool = False):
    users_col = get_users_col()
    patients_col = get_patients_col()
    claims_col = get_claims_col()
    docs_col = get_documents_col()
    clinical_col = get_clinical_col()
    anomalies_col = get_anomalies_col()
    inv_col = get_investigations_col()
    sec_col = get_security_events_col()
    audit_col = get_audit_logs_col()

    # 1. Seed Demo Users
    count_users = await users_col.count_documents({})
    if count_users == 0 or force_refresh:
        default_pwd_hash = get_password_hash("demo_password_2026")
        demo_users = [
            {
                "email": "investigator@bharatmedguard.demo",
                "name": "Radhika Upadhyay",
                "password_hash": default_pwd_hash,
                "role": UserRole.INVESTIGATOR.value,
                "badge_id": "BMG-SEC-230068",
                "department": "National Healthcare Cyber Intelligence Cell",
                "is_active": True,
                "created_at": "2026-08-25T08:00:00Z"
            },
            {
                "email": "radhika.upadhyay@bharatmedguard.gov.in",
                "name": "Radhika Upadhyay",
                "password_hash": default_pwd_hash,
                "role": UserRole.INVESTIGATOR.value,
                "badge_id": "BMG-SEC-230068",
                "department": "National Healthcare Cyber Intelligence Cell",
                "is_active": True,
                "created_at": "2026-08-25T08:00:00Z"
            },
            {
                "email": "admin@bharatmedguard.demo",
                "name": "Vikramaditya Roy",
                "password_hash": default_pwd_hash,
                "role": UserRole.ADMIN.value,
                "badge_id": "BMG-ADM-10001",
                "department": "Platform Engineering & Kernel Security",
                "is_active": True,
                "created_at": "2026-08-25T08:00:00Z"
            },
            {
                "email": "doctor@bharatmedguard.demo",
                "name": "Dr. Kavita Verma",
                "password_hash": default_pwd_hash,
                "role": UserRole.DOCTOR.value,
                "badge_id": "BMG-DOC-44912",
                "department": "Clinical Governance Cell",
                "is_active": True,
                "created_at": "2026-08-25T08:00:00Z"
            },
            {
                "email": "hospital@bharatmedguard.demo",
                "name": "BharatCare Admin Node",
                "password_hash": default_pwd_hash,
                "role": UserRole.HOSPITAL.value,
                "badge_id": "BMG-HOSP-01",
                "department": "EHR Gateway Administration",
                "is_active": True,
                "created_at": "2026-08-25T08:00:00Z"
            },
            {
                "email": "insurer@bharatmedguard.demo",
                "name": "National Health Insurer TPA",
                "password_hash": default_pwd_hash,
                "role": UserRole.INSURER.value,
                "badge_id": "BMG-INS-99",
                "department": "Insurance TPA Claims Gateway",
                "is_active": True,
                "created_at": "2026-08-25T08:00:00Z"
            }
        ]
        await users_col.insert_many(demo_users)
        app_logger.info(f"Seeded {len(demo_users)} demo users.")

    # 2. Seed Claims Dataset (Normal & Anomalous)
    count_claims = await claims_col.count_documents({})
    if count_claims == 0 or force_refresh:
        demo_claims = [
            {
                "claim_id": "BM-1024",
                "claim_number": "CLM-2026-991204",
                "patient_id": "P-102",
                "patient_name": "Aarav Sharma",
                "abha_id": "91-8842-1920-5512",
                "hospital_id": "HOSP-MUM-03",
                "hospital_name": "CityCare Apex Multi-Speciality",
                "procedure": "Coronary Angioplasty + 2 Stents",
                "claimed_amount": 340000.0,
                "benchmark_amount": 100000.0,
                "deviation_ratio": "3.4x",
                "submission_date": "2026-08-25 09:32 IST",
                "risk_score": 91,
                "severity": "CRITICAL",
                "status": "INVESTIGATION_REQUIRED",
                "anomaly_flags": [
                    "Duplicate Claim ID detected in Insurance Gateway",
                    "Claim amount 3.4x hospital regional baseline (+240%)",
                    "Supporting discharge summary specifies Conservative Medical Management without stent implants",
                    "Isolation Forest path length h(x)=3.0 (Outlier)"
                ],
                "evidence": {
                    "timeline": [
                        {"time": "09:32:10", "event": "Claim submitted via Ayushman Bharat API gateway"},
                        {"time": "09:33:04", "event": "Exact duplicate invoice payload hash flagged across 2 TPAs"},
                        {"time": "09:34:18", "event": "Isolation Forest model ranked claim in 99.4th percentile outlier"},
                        {"time": "09:35:00", "event": "OCR cross-check revealed diagnosis-to-bill mismatch"},
                        {"time": "09:36:12", "event": "Calculated composite risk score: 91/100 (CRITICAL)"}
                    ],
                    "ai_explanation": "The system flagged multiple high-confidence anomalies: invoice hash collision with previous claim #CLM-2026-880211, extreme financial deviation exceeding 3.4x of peer baseline, and contradictory OCR surgical documentation."
                },
                "created_at": "2026-08-25T09:32:00Z"
            },
            {
                "claim_id": "BM-1025",
                "claim_number": "CLM-2026-991205",
                "patient_id": "P-103",
                "patient_name": "Sunita Patel",
                "abha_id": "91-3142-9901-4411",
                "hospital_id": "HOSP-DEL-01",
                "hospital_name": "BharatCare Super Speciality",
                "procedure": "Diagnostic Knee Arthroscopy",
                "claimed_amount": 85000.0,
                "benchmark_amount": 80000.0,
                "deviation_ratio": "1.06x",
                "submission_date": "2026-08-25 09:45 IST",
                "risk_score": 24,
                "severity": "LOW",
                "status": "VERIFIED",
                "anomaly_flags": [],
                "evidence": {
                    "timeline": [
                        {"time": "09:45:00", "event": "Claim submitted"},
                        {"time": "09:45:20", "event": "Automated tariff check passed"},
                        {"time": "09:45:45", "event": "OCR document integrity verified (100% match)"}
                    ],
                    "ai_explanation": "All extracted parameters conform to standard clinical tariffs with valid supporting documentation."
                },
                "created_at": "2026-08-25T09:45:00Z"
            },
            {
                "claim_id": "BM-1026",
                "claim_number": "CLM-2026-991206",
                "patient_id": "P-104",
                "patient_name": "Vikram Malhotra",
                "abha_id": "91-7721-6604-8832",
                "hospital_id": "HOSP-VAR-05",
                "hospital_name": "Purvanchal Advanced Medical Wing",
                "procedure": "Multiple Laparoscopic Cholecystectomy",
                "claimed_amount": 520000.0,
                "benchmark_amount": 140000.0,
                "deviation_ratio": "3.7x",
                "submission_date": "2026-08-25 10:14 IST",
                "risk_score": 84,
                "severity": "HIGH",
                "status": "INVESTIGATION_REQUIRED",
                "anomaly_flags": [
                    "Excessive claim frequency: 4th major surgical claim under same ABHA in 14 days",
                    "Biological organ redundancy: Cholecystectomy claimed twice for same patient in 6 months"
                ],
                "evidence": {
                    "timeline": [
                        {"time": "10:14:02", "event": "Claim submitted"},
                        {"time": "10:15:10", "event": "Clinical history engine detected biological impossibility"}
                    ],
                    "ai_explanation": "Patient medical history indicates gallbladder removal previously recorded in March 2026. Billed procedure is clinically contradictory without anatomical explanation."
                },
                "created_at": "2026-08-25T10:14:00Z"
            },
            {
                "claim_id": "BM-1027",
                "claim_number": "CLM-2026-991207",
                "patient_id": "P-102",
                "patient_name": "Rajesh Verma",
                "abha_id": "91-4412-8800-1122",
                "hospital_id": "HOSP-DEL-01",
                "hospital_name": "BharatCare Super Speciality",
                "procedure": "Medical Nebulization & Observation",
                "claimed_amount": 14200.0,
                "benchmark_amount": 15000.0,
                "deviation_ratio": "0.95x",
                "submission_date": "2026-08-25 11:00 IST",
                "risk_score": 18,
                "severity": "LOW",
                "status": "VERIFIED",
                "anomaly_flags": [],
                "evidence": {
                    "timeline": [
                        {"time": "11:00:00", "event": "Claim processed and verified"}
                    ],
                    "ai_explanation": "Standard minor outpatient care."
                },
                "created_at": "2026-08-25T11:00:00Z"
            },
            {
                "claim_id": "BM-1028",
                "claim_number": "CLM-2026-991208",
                "patient_id": "P-106",
                "patient_name": "Rajeshwar Singh",
                "abha_id": "91-9923-4410-6621",
                "hospital_id": "HOSP-MUM-03",
                "hospital_name": "CityCare Apex Multi-Speciality",
                "procedure": "Craniotomy Biopsy & Complex Neuro-Navigation",
                "claimed_amount": 780000.0,
                "benchmark_amount": 190000.0,
                "deviation_ratio": "4.1x",
                "submission_date": "2026-08-25 11:30 IST",
                "risk_score": 94,
                "severity": "CRITICAL",
                "status": "INVESTIGATION_REQUIRED",
                "anomaly_flags": [
                    "Billed lead surgeon documented on approved international sabbatical leave",
                    "Document font glyph raster distortion & date overwrite detected in pathology record",
                    "Billing 4.1x above regional neurosurgery ceiling"
                ],
                "evidence": {
                    "timeline": [
                        {"time": "11:30:00", "event": "Claim received"},
                        {"time": "11:31:15", "event": "Doctor registry flagged sabbatical status"},
                        {"time": "11:32:00", "event": "OCR detected digital watermark mismatch"}
                    ],
                    "ai_explanation": "Critical mismatch detected: lead surgeon Dr. A. K. Sen was on official sabbatical during claimed surgery date; OCR forensic analysis revealed date overwriting on submitted pathology invoice."
                },
                "created_at": "2026-08-25T11:30:00Z"
            }
        ]
        await claims_col.insert_many(demo_claims)
        app_logger.info(f"Seeded {len(demo_claims)} claims records.")

    # 3. Seed Patients & Identity Records
    count_patients = await patients_col.count_documents({})
    if count_patients == 0 or force_refresh:
        demo_patients = [
            {
                "patient_id": "P-102",
                "name": "Aarav Sharma",
                "abha_id": "91-8842-1920-5512",
                "aadhaar_hash": "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
                "age": 44,
                "gender": "Male",
                "primary_location": "Mumbai, Maharashtra",
                "primary_city": "Mumbai",
                "risk_score": 88,
                "severity": "HIGH",
                "anomaly_type": "Impossible Location Velocity & Collision",
                "connected_hospitals": [
                    {"hospital_id": "HOSP-DEL-01", "hospital_name": "BharatCare Super Speciality (New Delhi)", "city": "New Delhi", "timestamp": "2026-08-25 10:15 IST", "action": "Inpatient Admission"},
                    {"hospital_id": "HOSP-BLR-02", "hospital_name": "National Medical Institute (Bengaluru)", "city": "Bengaluru", "timestamp": "2026-08-25 12:30 IST", "action": "Emergency Ward Registration"},
                    {"hospital_id": "HOSP-MUM-03", "hospital_name": "CityCare Apex (Mumbai)", "city": "Mumbai", "timestamp": "2026-08-25 14:00 IST", "action": "Surgery Pre-Auth Request"}
                ],
                "flags": [
                    "Physical travel impossible: New Delhi to Bengaluru (1,740 km) within 135 minutes (Required Speed: 773.3 km/h)",
                    "Simultaneous active admissions in two separate states",
                    "3 high-value insurance claims initiated within 4 hours"
                ],
                "created_at": "2026-08-25T08:00:00Z"
            },
            {
                "patient_id": "P-103",
                "name": "Sunita Patel",
                "abha_id": "91-3142-9901-4411",
                "aadhaar_hash": "SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                "age": 52,
                "gender": "Female",
                "primary_location": "New Delhi, Delhi",
                "primary_city": "New Delhi",
                "risk_score": 20,
                "severity": "LOW",
                "anomaly_type": "Standard Identity",
                "connected_hospitals": [
                    {"hospital_id": "HOSP-DEL-01", "hospital_name": "BharatCare Super Speciality", "city": "New Delhi", "timestamp": "2026-08-25 09:30 IST", "action": "Routine Day Care Admission"}
                ],
                "flags": [],
                "created_at": "2026-08-25T08:00:00Z"
            },
            {
                "patient_id": "P-104",
                "name": "Vikram Malhotra",
                "abha_id": "91-7721-6604-8832",
                "aadhaar_hash": "SHA256:9f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9061",
                "age": 39,
                "gender": "Male",
                "primary_location": "Varanasi, Uttar Pradesh",
                "primary_city": "Varanasi",
                "risk_score": 84,
                "severity": "HIGH",
                "anomaly_type": "Biometric Entity Collision",
                "connected_hospitals": [
                    {"hospital_id": "HOSP-VAR-05", "hospital_name": "Purvanchal Advanced Medical Wing", "city": "Varanasi", "timestamp": "2026-08-25 10:14 IST", "action": "Inpatient Admission"},
                    {"hospital_id": "HOSP-PAT-04", "hospital_name": "Magadh Heart Centre (Patna)", "city": "Patna", "timestamp": "2026-08-25 10:50 IST", "action": "Concurrent Identity Registration"}
                ],
                "flags": [
                    "Biometric Collision: Same Aadhaar hash registered under alias 'Vijay Malhotra' in Patna",
                    "Simultaneous active registrations across 2 state nodes"
                ],
                "created_at": "2026-08-25T08:00:00Z"
            }
        ]
        await patients_col.insert_many(demo_patients)
        app_logger.info(f"Seeded {len(demo_patients)} patient identity records.")

    # 4. Seed Medical Documents
    count_docs = await docs_col.count_documents({})
    if count_docs == 0 or force_refresh:
        demo_docs = [
            {
                "document_id": "DOC-901",
                "document_name": "Discharge_Summary_AaravSharma_BM1024.pdf",
                "claim_id": "BM-1024",
                "patient_id": "P-102",
                "hospital_name": "CityCare Apex Multi-Speciality",
                "upload_date": "2026-08-25 09:32 IST",
                "document_type": "Discharge Summary & Operation Record",
                "ocr_engine": "Tesseract v5.3 + Custom BMG Med-NLP",
                "ocr_confidence": "98.4%",
                "anomaly_score": 89,
                "status": "CRITICAL_MISMATCH",
                "extracted_fields": {
                    "patientName": {"value": "Aarav Sharma", "claimValue": "Aarav Sharma", "match": True},
                    "patientId": {"value": "P-102", "claimValue": "P-102", "match": True},
                    "diagnosis": {"value": "Acute Gastritis & Acid Peptic Disease", "claimValue": "Coronary Angioplasty + 2 Stents", "match": False},
                    "billedAmount": {"value": "₹ 28,500", "claimValue": "₹ 3,40,000", "match": False}
                },
                "ocr_text_snippet": "DISCHARGE SUMMARY\nPATIENT: AARAV SHARMA | AGE: 44 | GENDER: M\nFINAL DIAGNOSIS: ACUTE GASTRITIS WITH EPIGASTRIC PAIN\nTREATMENT: CONSERVATIVE MEDICAL MANAGEMENT. NO STENT IMPLANTS PERFORMED.\nTOTAL BILL: RS. 28,500/-",
                "verification_summary": "Critical discrepancies detected: Discharge summary specifies conservative medical treatment for gastritis (₹28,500), while submitted claim requests ₹3,40,000 for coronary angioplasty with dual stents.",
                "created_at": "2026-08-25T09:32:00Z"
            },
            {
                "document_id": "DOC-902",
                "document_name": "Final_Invoice_SunitaPatel_BM1025.pdf",
                "claim_id": "BM-1025",
                "patient_id": "P-103",
                "hospital_name": "BharatCare Super Speciality",
                "upload_date": "2026-08-25 09:45 IST",
                "document_type": "Discharge Summary & Invoice",
                "ocr_engine": "Tesseract v5.3 + Custom BMG Med-NLP",
                "ocr_confidence": "99.1%",
                "anomaly_score": 12,
                "status": "VERIFIED",
                "extracted_fields": {
                    "patientName": {"value": "Sunita Patel", "claimValue": "Sunita Patel", "match": True},
                    "patientId": {"value": "P-103", "claimValue": "P-103", "match": True},
                    "diagnosis": {"value": "Meniscal Tear (Right Knee)", "claimValue": "Diagnostic Knee Arthroscopy", "match": True},
                    "billedAmount": {"value": "₹ 85,000", "claimValue": "₹ 85,000", "match": True}
                },
                "ocr_text_snippet": "BHARATCARE SUPER SPECIALITY\nPATIENT: SUNITA PATEL | ID: P-103\nPROCEDURE: DIAGNOSTIC & ARTHROSCOPIC MENISCECTOMY\nTOTAL AMOUNT PAYABLE: RS. 85,000/-",
                "verification_summary": "All document OCR fields match the submitted insurance claim.",
                "created_at": "2026-08-25T09:45:00Z"
            },
            {
                "document_id": "DOC-903",
                "document_name": "Neuropathology_Report_RajeshwarSingh_BM1028.pdf",
                "claim_id": "BM-1028",
                "patient_id": "P-106",
                "hospital_name": "CityCare Apex Multi-Speciality",
                "upload_date": "2026-08-25 11:30 IST",
                "document_type": "Pathology Biopsy Report",
                "ocr_engine": "Tesseract v5.3 + Custom BMG Med-NLP",
                "ocr_confidence": "92.6%",
                "anomaly_score": 94,
                "status": "TAMPERING_DETECTED",
                "extracted_fields": {
                    "patientName": {"value": "Rajeshwar Singh", "claimValue": "Rajeshwar Singh", "match": True},
                    "patientId": {"value": "P-106", "claimValue": "P-106", "match": True},
                    "diagnosis": {"value": "Glioblastoma Multiforme Grade IV", "claimValue": "Craniotomy Biopsy", "match": True},
                    "billedAmount": {"value": "₹ 7,80,000", "claimValue": "₹ 7,80,000", "match": True}
                },
                "ocr_text_snippet": "NEUROPATHOLOGY LAB REPORT\nPATIENT: RAJESHWAR SINGH | ID: P-106\n[ALERT: FONT GLYPH DISTORTION ON LINE 7 & 12]\nCOLLECTION DATE: 20-08-2026 (OVERWRITTEN FROM 20-05-2025)\nBILLED AMOUNT: RS. 7,80,000/- (INCONSISTENT FONT RASTER)",
                "verification_summary": "Critical tamper indicators detected: Digital watermark hash mismatch and font raster inconsistency on collection date stamp.",
                "created_at": "2026-08-25T11:30:00Z"
            }
        ]
        await docs_col.insert_many(demo_docs)
        app_logger.info(f"Seeded {len(demo_docs)} document records.")

    # 5. Seed Clinical Records
    count_clin = await clinical_col.count_documents({})
    if count_clin == 0 or force_refresh:
        demo_clin = [
            {
                "record_id": "CLN-401",
                "patient_id": "P-102",
                "patient_name": "Aarav Sharma",
                "hospital_name": "BharatCare Super Speciality",
                "timestamp": "2026-08-25 10:40 IST",
                "category": "Unphysiological Lab Value Spike",
                "severity": "HIGH",
                "risk_score": 82,
                "clinical_finding": "Serum Potassium jumped from 4.1 mmol/L to 8.9 mmol/L within 90 minutes without hyperkalemic ECG signs or emergency stabilization orders.",
                "possible_causes": "Sample hemolysis in EDTA contamination, laboratory transcription typo, or synthetic test record generation.",
                "recommendation": "Flagged as Potential Clinical Anomaly. Professional review and repeat serum electrolyte redraw required before authorizing intensive care claim codes.",
                "ethical_disclaimer": "BharatMedGuard AI does not perform medical diagnosis. This finding flags data divergence requiring clinical professional review.",
                "status": "REVIEW_REQUIRED",
                "created_at": "2026-08-25T10:40:00Z"
            },
            {
                "record_id": "CLN-402",
                "patient_id": "P-108",
                "patient_name": "Ramesh Gupta",
                "hospital_name": "CityCare Apex Multi-Speciality",
                "timestamp": "2026-08-25 11:15 IST",
                "category": "Severe Drug-Drug Contraindication",
                "severity": "CRITICAL",
                "risk_score": 91,
                "clinical_finding": "Concurrent co-prescription of IV Nitroglycerin infusion alongside high-dose Sildenafil (PDE-5 inhibitor) within acute care admission window.",
                "possible_causes": "Electronic health record order entry without drug interaction checking, or pharmacy unbundling anomaly.",
                "recommendation": "Flagged as Potential Clinical Anomaly. Immediate clinical pharmacy review required due to profound refractory hypotension risk.",
                "ethical_disclaimer": "BharatMedGuard AI does not perform medical diagnosis. This finding flags data divergence requiring clinical professional review.",
                "status": "REVIEW_REQUIRED",
                "created_at": "2026-08-25T11:15:00Z"
            },
            {
                "record_id": "CLN-403",
                "patient_id": "P-103",
                "patient_name": "Sunita Patel",
                "hospital_name": "BharatCare Super Speciality",
                "timestamp": "2026-08-25 11:45 IST",
                "category": "Routine Post-Operative Panel",
                "severity": "LOW",
                "risk_score": 14,
                "clinical_finding": "Complete blood count, basic metabolic profile, and coagulation parameters within standard post-operative limits.",
                "possible_causes": "Normal physiological response.",
                "recommendation": "Clinical parameters verified normal.",
                "ethical_disclaimer": "BharatMedGuard AI does not perform medical diagnosis. This finding flags data divergence requiring clinical professional review.",
                "status": "VERIFIED",
                "created_at": "2026-08-25T11:45:00Z"
            }
        ]
        await clinical_col.insert_many(demo_clin)
        app_logger.info(f"Seeded {len(demo_clin)} clinical records.")

    # 6. Seed Investigation Cases
    count_inv = await inv_col.count_documents({})
    if count_inv == 0 or force_refresh:
        demo_inv = [
            {
                "case_id": "BM-2026-0142",
                "claim_id": "BM-1024",
                "patient_id": "P-102",
                "patient_name": "Aarav Sharma",
                "hospital_name": "CityCare Apex Multi-Speciality",
                "category": "Billing & Document Discrepancy",
                "claimed_amount": 340000.0,
                "risk_score": 91,
                "severity": "CRITICAL",
                "status": "OPEN",
                "investigator_id": "radhika.upadhyay@bharatmedguard.gov.in",
                "investigator_name": "Radhika Upadhyay",
                "detected_anomalies": [
                    "Duplicate claim hash detected in gateway",
                    "Abnormal claim amount (3.4x hospital baseline)",
                    "Patient identity concurrent velocity collision",
                    "Document OCR mismatch: Gastritis vs Angioplasty"
                ],
                "timeline": [
                    {"time": "09:32:10", "event": "Claim submitted via ABDM FHIR gateway from CityCare Apex (Mumbai)."},
                    {"time": "09:33:04", "event": "Duplicate invoice payload hash flagged across 2 TPAs."},
                    {"time": "09:34:18", "event": "Patient P-102 concurrent admission detected in Bengaluru at 12:30."},
                    {"time": "09:35:00", "event": "Tesseract OCR engine extracted diagnosis of Gastritis vs billed Angioplasty."},
                    {"time": "09:36:12", "event": "Isolation Forest model output composite score: 91/100 (CRITICAL)."}
                ],
                "ai_explanation": "The system identified multiple indicators requiring investigation. The submitted claim invoice payload matches a previously registered transaction, while the extracted OCR text from the attached medical discharge summary describes non-invasive conservative treatment rather than the claimed invasive cardiac catheterization procedure.",
                "notes": [],
                "created_at": "2026-08-25T09:36:00Z",
                "updated_at": "2026-08-25T09:36:00Z"
            },
            {
                "case_id": "BM-2026-0143",
                "claim_id": "BM-1028",
                "patient_id": "P-106",
                "patient_name": "Rajeshwar Singh",
                "hospital_name": "CityCare Apex Multi-Speciality",
                "category": "Provider Sabbatical & Document Tampering",
                "claimed_amount": 780000.0,
                "risk_score": 94,
                "severity": "CRITICAL",
                "status": "UNDER_REVIEW",
                "investigator_id": "radhika.upadhyay@bharatmedguard.gov.in",
                "investigator_name": "Radhika Upadhyay",
                "detected_anomalies": [
                    "Billed surgeon on approved international sabbatical leave",
                    "OCR font raster distortion on collection date stamp"
                ],
                "timeline": [
                    {"time": "11:30:00", "event": "Case initiated on neurosurgery billing alert"}
                ],
                "ai_explanation": "Surgeon active registry cross-check failed with international sabbatical record.",
                "notes": [],
                "created_at": "2026-08-25T11:35:00Z",
                "updated_at": "2026-08-25T11:35:00Z"
            },
            {
                "case_id": "BM-2026-0144",
                "claim_id": None,
                "patient_id": "P-108",
                "patient_name": "Ramesh Gupta",
                "hospital_name": "CityCare Apex Multi-Speciality",
                "category": "Severe Drug-Drug Contraindication",
                "claimed_amount": 195000.0,
                "risk_score": 91,
                "severity": "CRITICAL",
                "status": "ESCALATED",
                "investigator_id": "radhika.upadhyay@bharatmedguard.gov.in",
                "investigator_name": "Radhika Upadhyay",
                "detected_anomalies": [
                    "Simultaneous order of IV Nitroglycerin + Sildenafil"
                ],
                "timeline": [
                    {"time": "11:15:00", "event": "EHR medication order divergence flagged by clinical engine"}
                ],
                "ai_explanation": "Profound cardiovascular interaction flagged for immediate clinical pharmacy review.",
                "notes": [],
                "created_at": "2026-08-25T11:20:00Z",
                "updated_at": "2026-08-25T11:20:00Z"
            },
            {
                "case_id": "BM-2026-0145",
                "claim_id": "BM-1025",
                "patient_id": "P-103",
                "patient_name": "Sunita Patel",
                "hospital_name": "BharatCare Super Speciality",
                "category": "Routine Tariff Verification",
                "claimed_amount": 85000.0,
                "risk_score": 24,
                "severity": "LOW",
                "status": "RESOLVED",
                "investigator_id": "radhika.upadhyay@bharatmedguard.gov.in",
                "investigator_name": "Radhika Upadhyay",
                "detected_anomalies": [],
                "timeline": [
                    {"time": "09:45:00", "event": "Routine claim check passed and auto-cleared"}
                ],
                "ai_explanation": "Tariffs, OCR documents, and patient history fully validated without divergence.",
                "notes": [],
                "created_at": "2026-08-25T09:46:00Z",
                "updated_at": "2026-08-25T09:46:00Z"
            },
            {
                "case_id": "BM-2026-0146",
                "claim_id": "BM-1027",
                "patient_id": "P-102",
                "patient_name": "Rajesh Verma",
                "hospital_name": "BharatCare Super Speciality",
                "category": "Minor Inpatient Observation",
                "claimed_amount": 14200.0,
                "risk_score": 18,
                "severity": "LOW",
                "status": "DISMISSED",
                "investigator_id": "radhika.upadhyay@bharatmedguard.gov.in",
                "investigator_name": "Radhika Upadhyay",
                "detected_anomalies": [],
                "timeline": [
                    {"time": "11:00:00", "event": "Flagged for minor tariff drift, dismissed upon secondary invoice review."}
                ],
                "ai_explanation": "Legitimate aerosol medication tariff confirmed by hospital billing desk.",
                "notes": [],
                "created_at": "2026-08-25T11:05:00Z",
                "updated_at": "2026-08-25T11:05:00Z"
            }
        ]
        await inv_col.insert_many(demo_inv)
        app_logger.info(f"Seeded {len(demo_inv)} investigation records across all statuses.")

    # 7. Seed Security Events
    count_sec = await sec_col.count_documents({})
    if count_sec == 0 or force_refresh:
        demo_sec = [
            {
                "event_id": "ALT-2026-091",
                "timestamp": "10 minutes ago",
                "source_ip": "192.168.4.19 (Varanasi Node)",
                "destination_ip": "10.14.22.8:8080",
                "protocol": "HTTP / REST API",
                "length": 4890,
                "event_type": "EXFILTRATION_PROBE",
                "severity": "CRITICAL",
                "description": "Potential Bulk Health Record Exfiltration Attempt (450 queries/min)",
                "status": "ACTIVE_INVESTIGATION",
                "flags": "SYN, PSH",
                "created_at": "2026-08-25T13:40:00Z"
            },
            {
                "event_id": "ALT-2026-092",
                "timestamp": "24 minutes ago",
                "source_ip": "45.133.1.88 (External Proxy)",
                "destination_ip": "172.16.1.4:5000",
                "protocol": "TCP / OAuth 2.0",
                "length": 320,
                "event_type": "TOKEN_REPLAY",
                "severity": "HIGH",
                "description": "Abnormal Authentication Velocity & Token Replay Detected",
                "status": "MITIGATED",
                "flags": "RST, ACK",
                "created_at": "2026-08-25T13:26:00Z"
            }
        ]
        await sec_col.insert_many(demo_sec)

    # 8. Seed Audit Logs
    count_audit = await audit_col.count_documents({})
    if count_audit == 0 or force_refresh:
        demo_audits = [
            {
                "id": "AUD-9901",
                "log_id": "AUD-9901",
                "timestamp": "2026-08-25 13:43:10",
                "user": "radhika.upadhyay@bharatmedguard.gov.in",
                "role": "INVESTIGATOR",
                "action": "VIEW_CLAIM_RECORD",
                "resource": "CLAIM BM-1024",
                "resource_type": "CLAIM",
                "resource_id": "BM-1024",
                "ip": "10.220.14.88",
                "status": "SUCCESS",
                "created_at": "2026-08-25T13:43:10Z"
            },
            {
                "id": "AUD-9902",
                "log_id": "AUD-9902",
                "timestamp": "2026-08-25 13:41:02",
                "user": "radhika.upadhyay@bharatmedguard.gov.in",
                "role": "INVESTIGATOR",
                "action": "TRIGGER_OCR_ANALYSIS",
                "resource": "DOCUMENT DOC-901",
                "resource_type": "DOCUMENT",
                "resource_id": "DOC-901",
                "ip": "10.220.14.88",
                "status": "SUCCESS",
                "created_at": "2026-08-25T13:41:02Z"
            },
            {
                "id": "AUD-9903",
                "log_id": "AUD-9903",
                "timestamp": "2026-08-25 13:40:00",
                "user": "system.sentinel@bharatmedguard.gov.in",
                "role": "SECURITY_DAEMON",
                "action": "FLAG_SUSPICIOUS_VELOCITY",
                "resource": "PATIENT P-102",
                "resource_type": "PATIENT",
                "resource_id": "P-102",
                "ip": "10.14.22.8",
                "status": "SUCCESS",
                "created_at": "2026-08-25T13:40:00Z"
            }
        ]
        await audit_col.insert_many(demo_audits)

if __name__ == "__main__":
    asyncio.run(seed_initial_records(force_refresh=True))
