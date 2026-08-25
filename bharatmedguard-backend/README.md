# BharatMedGuard — AI-Powered Healthcare Cyber Defence Backend

> **National Healthcare Anomaly Detection, OCR Forensics, Cyber Telemetry & Multi-Pipeline Intelligence Engine**

---

## 1. Overview & Architecture

BharatMedGuard is an enterprise-grade cyber defence and healthcare fraud detection platform designed for the Indian healthcare ecosystem (ABHA, ABDM, PMJAY, and FHIR R4).

The platform centralizes anomaly detection across **Four Core Healthcare Pipelines**:
1. **Billing & Insurance Claim Anomalies** (`/api/v1/claims`): Duplicate claims detection, 3.4x tariff deviations, regional baseline comparisons, Isolation Forest tree isolation scoring.
2. **Patient & Identity Anomalies** (`/api/v1/patients`): Haversine geolocation velocity (`IMPOSSIBLE_TRAVEL`), concurrent multi-hospital admissions across states, Aadhaar SHA-256 biometric hash collisions.
3. **Medical Document Anomalies** (`/api/v1/documents`): Tesseract v5.3 OCR + Med-NLP entity parsing, cross-verification against claims, invoice price tampering detection.
4. **Clinical Data Anomalies** (`/api/v1/clinical`): Unphysiological laboratory value spikes (e.g. Potassium $4.1 \rightarrow 8.9$ mmol/L), severe drug-drug contraindications (Nitroglycerin + Sildenafil), and strict ethical medical governance disclaimers.

---

## 2. Technology Stack

- **Framework**: Python 3.14 + FastAPI (Async REST APIs, OpenAPI `/docs`)
- **Database**: Motor (Async MongoDB) + Embedded High-Performance In-Memory Async Document Store Fallback
- **AI & Machine Learning**: Scikit-Learn `IsolationForest`, NumPy, Pandas, Scipy, Joblib
- **OCR Forensics**: Tesseract v5.3 + Pytesseract + Pillow + BMG Med-NLP
- **Network Telemetry**: Scapy Packet Sniffer & Defensive Network Stream Simulator
- **Security & RBAC**: OAuth 2.0 Password Bearer, JWT (HS256), bcrypt password hashing, 5 RBAC roles
- **Rate Limiting**: Token-bucket in-memory middleware (120 req/min global, 15 req/min auth)
- **Testing**: Pytest + Pytest-Asyncio + HTTPX

---

## 3. RBAC Roles & Demo Credentials

| Role | Email | Password | Badge ID | Department |
| :--- | :--- | :--- | :--- | :--- |
| **INVESTIGATOR** | `investigator@bharatmedguard.demo` | `demo_password_2026` | `BMG-SEC-230068` | Cyber Intelligence Cell |
| **ADMIN** | `admin@bharatmedguard.demo` | `demo_password_2026` | `BMG-ADM-10001` | Platform Engineering |
| **DOCTOR** | `doctor@bharatmedguard.demo` | `demo_password_2026` | `BMG-DOC-44912` | Clinical Governance Cell |
| **HOSPITAL** | `hospital@bharatmedguard.demo` | `demo_password_2026` | `BMG-HOSP-01` | EHR Gateway Admin |
| **INSURER** | `insurer@bharatmedguard.demo` | `demo_password_2026` | `BMG-INS-99` | TPA Claims Gateway |

---

## 4. API Endpoints

### 🔐 Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/login`: Authenticate and obtain JWT bearer token.
- `POST /api/v1/auth/register`: Register new system operator.
- `GET /api/v1/auth/me`: Get active authenticated user profile & permissions.

### 📊 Dashboard & System (`/api/v1/dashboard`, `/health`)
- `GET /api/v1/dashboard/summary`: Aggregated system metrics, 72/100 risk score, category breakdown.
- `GET /health` & `GET /api/v1/health`: Real-time health status of API, ML, OCR, DB, and Network monitor.

### 💰 Pipeline 1 — Claims Intelligence (`/api/v1/claims`)
- `GET /api/v1/claims`: List claims with severity & search filters.
- `POST /api/v1/claims`: Submit new claim for automatic tariff benchmark & duplicate check.
- `GET /api/v1/claims/{claim_id}`: Retrieve single claim record and evidence timeline.
- `POST /api/v1/claims/{claim_id}/analyze`: Run live Isolation Forest inference on claim.
- `GET /api/v1/claims/{claim_id}/anomalies`: Get all anomaly flags tied to claim.

### 🆔 Pipeline 2 — Patient Identity Intelligence (`/api/v1/patients`)
- `GET /api/v1/patients`: List all registered patients.
- `POST /api/v1/patients`: Register patient ABHA entity.
- `GET /api/v1/patients/{patient_id}`: Get patient profile and connected hospital nodes.
- `POST /api/v1/patients/{patient_id}/analyze`: Calculate Haversine travel velocity & entity collisions.

### 📄 Pipeline 3 — Medical Document OCR (`/api/v1/documents`)
- `GET /api/v1/documents`: List uploaded medical documents.
- `POST /api/v1/documents/upload`: Multipart upload with Tesseract OCR & claim cross-verification.
- `GET /api/v1/documents/{document_id}`: View document verification matrix and match summary.
- `GET /api/v1/documents/{document_id}/extracted-data`: View raw OCR text snippet and entities.

### 🩺 Pipeline 4 — Clinical Intelligence (`/api/v1/clinical`)
- `GET /api/v1/clinical`: List clinical data records.
- `POST /api/v1/clinical`: Submit lab or clinical observation.
- `GET /api/v1/clinical/{patient_id}`: Get patient clinical observations.
- `POST /api/v1/clinical/{record_id}/analyze`: Run clinical contraindication and lab spike detection.

### 🤖 AI Isolation Forest Engine (`/api/v1/ai`)
- `GET /api/v1/ai/isolation-forest`: 2D latent scatter plot coordinates for normal clusters vs outliers.

### 🔍 Investigation Center (`/api/v1/investigations`)
- `GET /api/v1/investigations`: List investigation cases (`OPEN`, `UNDER_REVIEW`, `ESCALATED`, `RESOLVED`, `DISMISSED`).
- `GET /api/v1/investigations/{case_id}`: Retrieve full case file, timeline (09:32–09:36), and AI rationale.
- `PATCH /api/v1/investigations/{case_id}`: Update case lifecycle status.
- `POST /api/v1/investigations/{case_id}/notes`: Append investigator notes.

### 🛡️ Cyber Security & Network (`/api/v1/security`)
- `GET /api/v1/security/events`: Live Scapy packet stream (TLS 1.3, DICOM PACS, FHIR R4) and alerts.
- `POST /api/v1/security/alerts/{alert_id}/triage`: Contain/block malicious IP or dismiss alert.

### 📜 Immutable Audit Logs (`/api/v1/audit-logs`)
- `GET /api/v1/audit-logs`: Query immutable regulatory governance trail.

---

## 5. Running the Backend & Tests

### Setup & Run
```bash
# 1. Activate virtual environment
.\venv\Scripts\activate

# 2. Run Database Seeding
python scripts/seed_database.py

# 3. Start FastAPI Server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Run Test Suite
```bash
pytest
```

### Postman Collection
Import `postman_collection.json` into Postman to test all endpoints with predefined sample payloads.
