// ============================================================
// BharatMedGuard Central API Service Layer
// Connects to FastAPI Backend with Automatic Mock Fallbacks
// ============================================================

import {
  SYSTEM_METRICS,
  RISK_PILLARS,
  HOSPITALS,
  CLAIMS_DATA,
  PATIENTS_IDENTITY_DATA,
  MEDICAL_DOCUMENTS_DATA,
  CLINICAL_ANOMALIES_DATA,
  ISOLATION_FOREST_POINTS,
  NETWORK_PACKETS,
  SECURITY_ALERTS,
  AUDIT_LOGS,
  CURRENT_USER
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Helper for simulated latency in mock mode
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  constructor() {
    this.isBackendLive = false;
    this.checkBackendHealth();
  }

  async checkBackendHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET', signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        this.isBackendLive = true;
        console.log('[BharatMedGuard API] Connected to live FastAPI backend at:', API_BASE_URL);
      }
    } catch {
      this.isBackendLive = false;
      console.log('[BharatMedGuard API] Running in enterprise offline mock mode');
    }
  }

  // --- Auth Endpoints ---
  async login(email, password) {
    if (this.isBackendLive) {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error('Authentication failed');
      return await res.json();
    }
    await delay(400);
    return {
      token: 'jwt_bmg_secure_session_token_' + Date.now(),
      user: CURRENT_USER,
      status: 'authenticated'
    };
  }

  // --- Dashboard Summary ---
  async getDashboardSummary() {
    if (this.isBackendLive) {
      const res = await fetch(`${API_BASE_URL}/dashboard/summary`);
      return await res.json();
    }
    await delay(200);
    return {
      metrics: SYSTEM_METRICS,
      riskPillars: RISK_PILLARS,
      hospitals: HOSPITALS,
      recentAlerts: SECURITY_ALERTS.slice(0, 3)
    };
  }

  // --- Claims Endpoints ---
  async getClaims(filters = {}) {
    if (this.isBackendLive) {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE_URL}/claims?${query}`);
      return await res.json();
    }
    await delay(250);
    let results = [...CLAIMS_DATA];
    if (filters.severity) {
      results = results.filter(c => c.severity === filters.severity);
    }
    if (filters.search) {
      const term = filters.search.toLowerCase();
      results = results.filter(c => 
        c.claimNumber.toLowerCase().includes(term) || 
        c.patientName.toLowerCase().includes(term) ||
        c.procedure.toLowerCase().includes(term)
      );
    }
    return results;
  }

  async getClaimById(id) {
    if (this.isBackendLive) {
      const res = await fetch(`${API_BASE_URL}/claims/${id}`);
      return await res.json();
    }
    await delay(150);
    return CLAIMS_DATA.find(c => c.id === id || c.claimNumber === id) || CLAIMS_DATA[0];
  }

  async analyzeClaim(claimPayload) {
    if (this.isBackendLive) {
      const res = await fetch(`${API_BASE_URL}/claims/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimPayload)
      });
      return await res.json();
    }
    await delay(600);
    const amount = Number(claimPayload.amount) || 150000;
    const isAnomaly = amount > 250000;
    return {
      claimId: 'BM-' + Math.floor(1000 + Math.random() * 9000),
      riskScore: isAnomaly ? 88 : 22,
      severity: isAnomaly ? 'CRITICAL' : 'LOW',
      isolationForestScore: isAnomaly ? 0.914 : 0.210,
      anomaliesDetected: isAnomaly ? [
        'Billing amount deviates +180% from standard tariff ceiling',
        'Duplicate diagnostic billing code detected'
      ] : [],
      status: isAnomaly ? 'INVESTIGATION_REQUIRED' : 'AUTO_APPROVED'
    };
  }

  // --- Patient & Identity Endpoints ---
  async getPatients(filters = {}) {
    if (this.isBackendLive) {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE_URL}/patients?${query}`);
      return await res.json();
    }
    await delay(200);
    return PATIENTS_IDENTITY_DATA;
  }

  async getPatientById(id) {
    if (this.isBackendLive) {
      const res = await fetch(`${API_BASE_URL}/patients/${id}`);
      return await res.json();
    }
    await delay(150);
    return PATIENTS_IDENTITY_DATA.find(p => p.id === id) || PATIENTS_IDENTITY_DATA[0];
  }

  async analyzePatientIdentity(payload) {
    if (this.isBackendLive) {
      const res = await fetch(`${API_BASE_URL}/patients/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    }
    await delay(500);
    return {
      riskScore: 84,
      severity: 'HIGH',
      velocityFlag: 'Impossible Geolocation Travel (1200km in 45min)',
      matchingEntities: 3
    };
  }

  // --- Document Intelligence & OCR Endpoints ---
  async getDocuments() {
    if (this.isBackendLive) {
      const res = await fetch(`${API_BASE_URL}/documents`);
      return await res.json();
    }
    await delay(200);
    return MEDICAL_DOCUMENTS_DATA;
  }

  async getDocumentById(id) {
    if (this.isBackendLive) {
      const res = await fetch(`${API_BASE_URL}/documents/${id}`);
      return await res.json();
    }
    await delay(150);
    return MEDICAL_DOCUMENTS_DATA.find(d => d.id === id) || MEDICAL_DOCUMENTS_DATA[0];
  }

  async uploadAndAnalyzeDocument(formData) {
    if (this.isBackendLive) {
      const res = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: 'POST',
        body: formData
      });
      return await res.json();
    }
    await delay(800);
    return {
      docId: 'DOC-' + Math.floor(1000 + Math.random() * 9000),
      ocrConfidence: '97.8%',
      extractedText: "BHARATCARE DISCHARGE SUMMARY\nPATIENT: RAJESH VERMA\nDIAGNOSIS: ACUTE BRONCHITIS\nPROCEDURE: MEDICAL NEBULIZATION\nBILL AMOUNT: RS. 14,200",
      mismatchesFound: [
        { field: "Treatment", claim: "Coronary Bypass", ocr: "Medical Nebulization", match: false },
        { field: "Amount", claim: "Rs. 2,80,000", ocr: "Rs. 14,200", match: false }
      ],
      anomalyScore: 92,
      recommendation: "Document contains severe procedural mismatch with submitted claim."
    };
  }

  // --- Clinical Data Endpoints ---
  async getClinicalAnomalies() {
    if (this.isBackendLive) {
      const res = await fetch(`${API_BASE_URL}/clinical`);
      return await res.json();
    }
    await delay(200);
    return CLINICAL_ANOMALIES_DATA;
  }

  // --- AI Isolation Forest Endpoints ---
  async getIsolationForestData(contamination = 0.05, estimators = 100) {
    if (this.isBackendLive) {
      const res = await fetch(`${API_BASE_URL}/ai/isolation-forest?contamination=${contamination}&estimators=${estimators}`);
      return await res.json();
    }
    await delay(200);
    return {
      points: ISOLATION_FOREST_POINTS,
      totalSamples: ISOLATION_FOREST_POINTS.length,
      anomaliesIsolated: ISOLATION_FOREST_POINTS.filter(p => p.isAnomaly).length,
      averagePathLength: 6.4,
      contaminationRate: contamination,
      nEstimators: estimators
    };
  }

  // --- Security & Network Telemetry ---
  async getSecurityEvents() {
    if (this.isBackendLive) {
      const res = await fetch(`${API_BASE_URL}/security/events`);
      return await res.json();
    }
    await delay(150);
    return {
      packets: NETWORK_PACKETS,
      alerts: SECURITY_ALERTS,
      activeSessions: 142,
      threatsBlocked: 149
    };
  }

  async getSecurityAlerts() {
    if (this.isBackendLive) {
      const res = await fetch(`${API_BASE_URL}/security/alerts`);
      return await res.json();
    }
    await delay(150);
    return SECURITY_ALERTS;
  }

  // --- Audit Logs ---
  async getAuditLogs(filters = {}) {
    if (this.isBackendLive) {
      const res = await fetch(`${API_BASE_URL}/audit-logs`);
      return await res.json();
    }
    await delay(200);
    let logs = [...AUDIT_LOGS];
    if (filters.action) {
      logs = logs.filter(l => l.action.toLowerCase().includes(filters.action.toLowerCase()));
    }
    if (filters.user) {
      logs = logs.filter(l => l.user.toLowerCase().includes(filters.user.toLowerCase()));
    }
    return logs;
  }
}

export const api = new ApiService();
export default api;
