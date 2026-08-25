import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_demo_1_claims_pipeline_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Submit suspicious high-value claim (3.4x tariff deviation)
        resp_anom = await ac.post("/api/v1/claims", json={
            "patient_id": "P-TEST-01",
            "patient_name": "Test Anomaly Patient",
            "abha_id": "91-0000-1111-2222",
            "hospital_id": "HOSP-MUM-03",
            "hospital_name": "CityCare Apex Multi-Speciality",
            "procedure": "Coronary Angioplasty + 2 Stents",
            "claimed_amount": 340000.0,
            "benchmark_amount": 100000.0
        })
        assert resp_anom.status_code == 200
        anom_data = resp_anom.json()
        assert anom_data["risk_score"] > 60
        assert anom_data["severity"] in ["HIGH", "CRITICAL"]
        assert len(anom_data["anomaly_flags"]) > 0
        assert "evidence" in anom_data

        # 2. General Analyze endpoint on the fly
        resp_analyze = await ac.post("/api/v1/claims/analyze", json={
            "procedure": "Coronary Angioplasty + 2 Stents",
            "claimed_amount": 340000.0,
            "benchmark_amount": 100000.0
        })
        assert resp_analyze.status_code == 200
        analyze_data = resp_analyze.json()
        assert analyze_data["anomaly_detected"] is True
        assert analyze_data["risk_score"] > 60

@pytest.mark.asyncio
async def test_demo_2_identity_velocity_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Patient with impossible geolocation travel (Delhi to Bengaluru in 135 mins)
        resp = await ac.post("/api/v1/patients/analyze", json={
            "patient_id": "P-102",
            "name": "Aarav Sharma",
            "abha_id": "91-8842-1920-5512",
            "connected_hospitals": [
                {"hospital_id": "HOSP-DEL-01", "city": "New Delhi", "timestamp": "2026-08-25 10:15 IST", "action": "Admission"},
                {"hospital_id": "HOSP-BLR-02", "city": "Bengaluru", "timestamp": "2026-08-25 12:30 IST", "action": "Admission"}
            ]
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["anomaly_detected"] is True
        assert data["velocity_analysis"]["feasibility"] == "IMPOSSIBLE_TRAVEL"
        assert data["velocity_analysis"]["requiredSpeedKmh"] > 450.0

@pytest.mark.asyncio
async def test_demo_3_document_ocr_forensics_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.get("/api/v1/documents/DOC-901")
        assert resp.status_code == 200
        doc = resp.json()
        assert doc["document_id"] == "DOC-901"
        assert doc["status"] == "CRITICAL_MISMATCH"
        assert doc["extracted_fields"]["diagnosis"]["match"] is False
        assert doc["extracted_fields"]["billedAmount"]["match"] is False

@pytest.mark.asyncio
async def test_demo_4_clinical_intelligence_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        resp = await ac.post("/api/v1/clinical/analyze", json={
            "patient_id": "P-102",
            "clinical_finding": "Serum Potassium jumped from 4.1 mmol/L to 8.9 mmol/L within 90 minutes."
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["anomaly_detected"] is True
        assert data["risk_score"] >= 80
        assert "BharatMedGuard AI does not perform medical diagnosis" in data["ethical_disclaimer"]

@pytest.mark.asyncio
async def test_demo_5_cybersecurity_and_audit_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Get live packet events and alerts
        resp_sec = await ac.get("/api/v1/security/events")
        assert resp_sec.status_code == 200
        sec_data = resp_sec.json()
        assert len(sec_data["packets"]) > 0
        assert len(sec_data["alerts"]) > 0

        # Triage alert
        resp_triage = await ac.post("/api/v1/security/alerts/ALT-2026-091/triage?action=CONTAIN")
        assert resp_triage.status_code == 200
        triage_data = resp_triage.json()
        assert triage_data["status"] == "CONTAINED_BLOCKED"

        # Check immutable audit logs
        resp_audit = await ac.get("/api/v1/audit-logs")
        assert resp_audit.status_code == 200
        logs = resp_audit.json()
        assert len(logs) > 0

@pytest.mark.asyncio
async def test_investigation_case_workflow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # List cases
        resp_list = await ac.get("/api/v1/investigations")
        assert resp_list.status_code == 200
        cases = resp_list.json()
        assert len(cases) >= 5

        # Get case BM-2026-0142
        resp_case = await ac.get("/api/v1/investigations/BM-2026-0142")
        assert resp_case.status_code == 200
        case = resp_case.json()
        assert case["case_id"] == "BM-2026-0142"
        assert case["status"] == "OPEN"
        assert len(case["timeline"]) >= 5
