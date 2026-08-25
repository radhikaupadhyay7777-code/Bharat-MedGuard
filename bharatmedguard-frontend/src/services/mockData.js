// ==========================================
// BharatMedGuard Enterprise Mock Data Service
// Realistic Fictional Indian Healthcare Data
// ==========================================

export const SYSTEM_METRICS = {
  totalRecordsAnalyzed: 12482,
  highRiskCases: 82,
  claimsAnomalies: 34,
  identityAnomalies: 21,
  documentAnomalies: 17,
  clinicalAnomalies: 10,
  networkThreatsBlocked: 149,
  overallRiskScore: 72,
  riskStatus: "HIGH RISK",
  lastUpdated: new Date().toISOString(),
  systemHealth: {
    aiEngine: "Operational",
    apiGateway: "Operational",
    database: "Operational",
    cyberSecurity: "Protected",
    ocrEngine: "Operational",
    networkMonitor: "Active"
  }
};

export const RISK_PILLARS = [
  { name: "Claims & Billing", score: 82, weight: "30%", color: "#EF4444", status: "Critical Anomaly Rate" },
  { name: "Patient & Identity", score: 68, weight: "25%", color: "#F97316", status: "High Velocity Detected" },
  { name: "Medical Documents", score: 74, weight: "20%", color: "#F97316", status: "OCR Mismatches Elevated" },
  { name: "Clinical Data", score: 52, weight: "15%", color: "#F59E0B", status: "Potential Outliers" },
  { name: "Network Security", score: 38, weight: "10%", color: "#22C55E", status: "Active Defence Active" },
];

export const HOSPITALS = [
  { id: "HOSP-DEL-01", name: "BharatCare Super Speciality", city: "New Delhi", region: "North", trustScore: 94, totalClaims: 4820, anomalyRate: "1.8%" },
  { id: "HOSP-BLR-02", name: "National Medical Research Institute", city: "Bengaluru", region: "South", trustScore: 98, totalClaims: 3410, anomalyRate: "0.9%" },
  { id: "HOSP-MUM-03", name: "CityCare Apex Multi-Speciality", city: "Mumbai", region: "West", trustScore: 76, totalClaims: 2950, anomalyRate: "4.2%" },
  { id: "HOSP-CHN-04", name: "Kaveri Healthcare Trust", city: "Chennai", region: "South", trustScore: 91, totalClaims: 1890, anomalyRate: "1.4%" },
  { id: "HOSP-VAR-05", name: "Purvanchal Advanced Medical Wing", city: "Varanasi", region: "North", trustScore: 82, totalClaims: 1412, anomalyRate: "2.7%" },
];

export const CLAIMS_DATA = [
  {
    id: "BM-1024",
    claimNumber: "CLM-2026-991204",
    patientId: "P-102",
    patientName: "Aarav Sharma",
    abhaId: "91-8842-1920-5512",
    hospitalId: "HOSP-MUM-03",
    hospitalName: "CityCare Apex Multi-Speciality",
    category: "Billing & Claims",
    procedure: "Coronary Angioplasty + 2 Stents",
    claimedAmount: 340000,
    benchmarkAmount: 100000,
    deviationRatio: "3.4x",
    submissionDate: "2026-08-25 09:32 IST",
    riskScore: 91,
    severity: "CRITICAL",
    status: "INVESTIGATION_REQUIRED",
    anomalyFlags: [
      "Duplicate Claim ID detected in Insurance Gateway",
      "Claim amount 3.4x hospital regional baseline",
      "Supporting discharge summary specifies Conservative Medical Management without stent implants",
      "Billing deviation exceeds threshold (+240%)"
    ],
    evidence: {
      timeline: [
        { time: "09:32:10", event: "Claim submitted via Ayushman Bharat API gateway" },
        { time: "09:33:04", event: "Exact duplicate invoice payload hash flagged across 2 TPAs" },
        { time: "09:34:18", event: "Isolation Forest model ranked claim in 99.4th percentile outlier" },
        { time: "09:35:00", event: "OCR cross-check revealed diagnosis-to-bill mismatch" },
        { time: "09:36:12", event: "Calculated composite risk score: 91/100 (CRITICAL)" }
      ],
      aiExplanation: "The system flagged multiple high-confidence anomalies: invoice hash collision with previous claim #CLM-2026-880211, extreme financial deviation exceeding 3.4x of peer baseline, and contradictory OCR surgical documentation."
    }
  },
  {
    id: "BM-1025",
    claimNumber: "CLM-2026-991205",
    patientId: "P-103",
    patientName: "Sunita Patel",
    abhaId: "91-3142-9901-4411",
    hospitalId: "HOSP-DEL-01",
    hospitalName: "BharatCare Super Speciality",
    category: "Billing & Claims",
    procedure: "Diagnostic Knee Arthroscopy",
    claimedAmount: 85000,
    benchmarkAmount: 80000,
    deviationRatio: "1.06x",
    submissionDate: "2026-08-25 09:45 IST",
    riskScore: 24,
    severity: "LOW",
    status: "VERIFIED",
    anomalyFlags: [],
    evidence: {
      timeline: [
        { time: "09:45:00", event: "Claim submitted" },
        { time: "09:45:20", event: "Automated tariff check passed" },
        { time: "09:45:45", event: "OCR document integrity verified (100% match)" }
      ],
      aiExplanation: "All extracted parameters conform to standard clinical tariffs with valid supporting documentation."
    }
  },
  {
    id: "BM-1026",
    claimNumber: "CLM-2026-991206",
    patientId: "P-104",
    patientName: "Vikram Malhotra",
    abhaId: "91-7721-6604-8832",
    hospitalId: "HOSP-VAR-05",
    hospitalName: "Purvanchal Advanced Medical Wing",
    category: "Billing & Claims",
    procedure: "Multiple Laparoscopic Cholecystectomy",
    claimedAmount: 520000,
    benchmarkAmount: 140000,
    deviationRatio: "3.7x",
    submissionDate: "2026-08-25 10:14 IST",
    riskScore: 84,
    severity: "HIGH",
    status: "INVESTIGATION_REQUIRED",
    anomalyFlags: [
      "Excessive claim frequency: 4th major surgical claim under same ABHA in 14 days",
      "Biological organ redundancy: Cholecystectomy claimed twice for same patient in 6 months",
      "Document metadata timestamp inconsistent with admission records"
    ],
    evidence: {
      timeline: [
        { time: "10:14:02", event: "Claim submitted" },
        { time: "10:15:10", event: "Clinical history engine detected biological impossibility" },
        { time: "10:16:30", event: "Multi-hospital registry search flagged 3 concurrent active claims" }
      ],
      aiExplanation: "Patient medical history indicates gallbladder removal previously recorded in March 2026. Billed procedure is clinically contradictory without anatomical explanation."
    }
  },
  {
    id: "BM-1027",
    claimNumber: "CLM-2026-991207",
    patientId: "P-105",
    patientName: "Meera Deshmukh",
    abhaId: "91-5510-3329-1109",
    hospitalId: "HOSP-BLR-02",
    hospitalName: "National Medical Research Institute",
    category: "Billing & Claims",
    procedure: "Dialysis & Renal Management Cycle",
    claimedAmount: 112000,
    benchmarkAmount: 78000,
    deviationRatio: "1.43x",
    submissionDate: "2026-08-25 10:48 IST",
    riskScore: 68,
    severity: "MEDIUM",
    status: "AUDIT_QUEUED",
    anomalyFlags: [
      "Hospital billing deviation (+45% above regional package price)",
      "Unbundled consumable charges not adhering to standard CGHS package"
    ],
    evidence: {
      timeline: [
        { time: "10:48:00", event: "Claim submitted" },
        { time: "10:48:40", event: "Unbundled consumable charge spike detected" }
      ],
      aiExplanation: "Package rate deviations identified. Requires manual insurance adjuster review for non-standard consumables."
    }
  },
  {
    id: "BM-1028",
    claimNumber: "CLM-2026-991208",
    patientId: "P-106",
    patientName: "Rajeshwar Singh",
    abhaId: "91-9920-1120-7744",
    hospitalId: "HOSP-MUM-03",
    hospitalName: "CityCare Apex Multi-Speciality",
    category: "Billing & Claims",
    procedure: "Complex Neurosurgical Craniotomy",
    claimedAmount: 780000,
    benchmarkAmount: 250000,
    deviationRatio: "3.12x",
    submissionDate: "2026-08-25 11:20 IST",
    riskScore: 94,
    severity: "CRITICAL",
    status: "SUSPENDED",
    anomalyFlags: [
      "Attending Surgeon ID DOC-IND-4091 recorded on international sabbatical",
      "Digital signature certificate validation failed against National Medical Commission registry",
      "Claim amount 3.12x benchmark"
    ],
    evidence: {
      timeline: [
        { time: "11:20:00", event: "Claim received" },
        { time: "11:20:30", event: "Doctor credential cross-reference failed" },
        { time: "11:21:15", event: "Claim transaction auto-suspended for credential fraud audit" }
      ],
      aiExplanation: "Credential authentication failure: The designated lead neurosurgeon had an active leave status verified by hospital HR and international conference attendance records."
    }
  }
];

export const PATIENTS_IDENTITY_DATA = [
  {
    id: "P-102",
    name: "Aarav Sharma",
    abhaId: "91-8842-1920-5512",
    aadhaarHash: "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    age: 44,
    gender: "Male",
    primaryLocation: "Mumbai, Maharashtra",
    riskScore: 88,
    severity: "HIGH",
    anomalyType: "Impossible Location Velocity & Collision",
    connectedHospitals: [
      { id: "HOSP-DEL-01", name: "BharatCare Super Speciality (New Delhi)", timestamp: "2026-08-25 10:15 IST", action: "Inpatient Admission" },
      { id: "HOSP-BLR-02", name: "National Medical Institute (Bengaluru)", timestamp: "2026-08-25 12:30 IST", action: "Emergency Ward Registration" },
      { id: "HOSP-MUM-03", name: "CityCare Apex (Mumbai)", timestamp: "2026-08-25 14:00 IST", action: "Surgery Pre-Auth Request" }
    ],
    flags: [
      "Physical travel impossible: New Delhi to Bengaluru within 135 minutes without flight manifest",
      "Simultaneous active admissions in two separate states",
      "3 high-value insurance claims initiated within 4 hours"
    ],
    velocityAnalysis: {
      distanceKm: 1740,
      timeDeltaMinutes: 135,
      requiredSpeedKmh: 773.3,
      feasibility: "IMPOSSIBLE_TRAVEL"
    }
  },
  {
    id: "P-104",
    name: "Vikram Malhotra / Alias Amit Verma",
    abhaId: "91-7721-6604-8832",
    aadhaarHash: "SHA256:3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1",
    age: 38,
    gender: "Male",
    primaryLocation: "Varanasi, UP",
    riskScore: 93,
    severity: "CRITICAL",
    anomalyType: "Ghost Identity & Entity Collision",
    connectedHospitals: [
      { id: "HOSP-VAR-05", name: "Purvanchal Advanced Wing", timestamp: "2026-08-24 18:20 IST", action: "Claim ₹5.2L" },
      { id: "HOSP-LKO-08", name: "Avadh Specialty Clinic", timestamp: "2026-08-22 11:00 IST", action: "Claim ₹4.1L" },
      { id: "HOSP-PAT-09", name: "Magadh Health Center", timestamp: "2026-08-19 14:30 IST", action: "Claim ₹5.5L" }
    ],
    flags: [
      "Same Aadhaar biometric hash tied to 3 different full names across 3 states",
      "Cumulative claim velocity: ₹14.8L within 7 days across distinct regional registries",
      "Synthetic identity creation pattern detected"
    ],
    velocityAnalysis: {
      distanceKm: 420,
      timeDeltaMinutes: 2880,
      requiredSpeedKmh: 8.75,
      feasibility: "SUSPICIOUS_IDENTITY_COLLISION"
    }
  },
  {
    id: "P-105",
    name: "Meera Deshmukh",
    abhaId: "91-5510-3329-1109",
    aadhaarHash: "SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    age: 52,
    gender: "Female",
    primaryLocation: "Bengaluru, Karnataka",
    riskScore: 71,
    severity: "HIGH",
    anomalyType: "Abnormal Clinic Hopping & Prescription Velocity",
    connectedHospitals: [
      { id: "HOSP-BLR-02", name: "National Medical Research Institute", timestamp: "2026-08-25 09:00 IST", action: "Consultation" },
      { id: "CLINIC-BLR-12", name: "Indiranagar Care Point", timestamp: "2026-08-24 16:30 IST", action: "Opioid Dispensation" },
      { id: "CLINIC-BLR-14", name: "Koramangala Health Hub", timestamp: "2026-08-23 11:15 IST", action: "Sedative Refill" }
    ],
    flags: [
      "18 clinic visits in 21 days across Bangalore urban cluster",
      "Schedule H1 controlled drug refilled at 5 different dispensaries concurrently",
      "Doctor shopping pattern identified"
    ],
    velocityAnalysis: {
      distanceKm: 18,
      timeDeltaMinutes: 1440,
      requiredSpeedKmh: 0.75,
      feasibility: "EXCESSIVE_VISIT_FREQUENCY"
    }
  }
];

export const MEDICAL_DOCUMENTS_DATA = [
  {
    id: "DOC-901",
    documentName: "Discharge_Summary_AaravSharma_BM1024.pdf",
    claimId: "BM-1024",
    hospitalName: "CityCare Apex Multi-Speciality",
    uploadDate: "2026-08-25 09:32 IST",
    documentType: "Discharge Summary & Operation Record",
    ocrEngine: "Tesseract v5.3 + Custom BMG Med-NLP",
    ocrConfidence: "98.4%",
    anomalyScore: 89,
    status: "CRITICAL_MISMATCH",
    extractedFields: {
      patientName: { value: "Aarav Sharma", claimValue: "Aarav Sharma", match: true },
      patientId: { value: "P-102", claimValue: "P-102", match: true },
      admissionDate: { value: "2026-08-22", claimValue: "2026-08-22", match: true },
      dischargeDate: { value: "2026-08-24", claimValue: "2026-08-24", match: true },
      diagnosis: { value: "Acute Gastritis & Acid Peptic Disease", claimValue: "Acute Coronary Syndrome (NSTEMI)", match: false },
      treatmentGiven: { value: "IV Proton Pump Inhibitors, Antacids, Observation", claimValue: "Coronary Angioplasty with 2 DES Stents", match: false },
      billedAmount: { value: "₹ 28,500", claimValue: "₹ 3,40,000", match: false },
      hospitalRegNumber: { value: "CC-MUM-88910", claimValue: "CC-MUM-88910", match: true }
    },
    ocrTextSnippet: "DISCHARGE SUMMARY\nPATIENT: AARAV SHARMA | AGE: 44 | GENDER: M\nADMISSION: 22-08-2026 | DISCHARGE: 24-08-2026\nFINAL DIAGNOSIS: ACUTE GASTRITIS WITH EPIGASTRIC PAIN\nTREATMENT: IV PANTOPRAZOLE 40MG BD, ORAL SUCRALFATE SUSPENSION, CONSERVATIVE MEDICAL MANAGEMENT.\nNO SURGICAL OR INTERVENTIONAL PROCEDURE PERFORMED.\nTOTAL IN-HOSPITAL PHARMACY & BED CHARGES: RS. 28,500/-",
    verificationSummary: "Critical discrepancies detected: The uploaded discharge summary explicitly records conservative medical treatment for gastritis with ₹28,500 bill, while the submitted insurance claim requests ₹3,40,000 for coronary angioplasty with dual stents."
  },
  {
    id: "DOC-902",
    documentName: "Surgical_Invoice_SunitaPatel_BM1025.pdf",
    claimId: "BM-1025",
    hospitalName: "BharatCare Super Speciality",
    uploadDate: "2026-08-25 09:45 IST",
    documentType: "Itemized Hospital Bill",
    ocrEngine: "Tesseract v5.3 + Custom BMG Med-NLP",
    ocrConfidence: "99.1%",
    anomalyScore: 12,
    status: "VERIFIED_MATCH",
    extractedFields: {
      patientName: { value: "Sunita Patel", claimValue: "Sunita Patel", match: true },
      patientId: { value: "P-103", claimValue: "P-103", match: true },
      admissionDate: { value: "2026-08-23", claimValue: "2026-08-23", match: true },
      dischargeDate: { value: "2026-08-24", claimValue: "2026-08-24", match: true },
      diagnosis: { value: "Meniscal Tear (Right Knee)", claimValue: "Meniscal Tear (Right Knee)", match: true },
      treatmentGiven: { value: "Arthroscopic Partial Meniscectomy", claimValue: "Arthroscopic Partial Meniscectomy", match: true },
      billedAmount: { value: "₹ 85,000", claimValue: "₹ 85,000", match: true },
      hospitalRegNumber: { value: "BC-DEL-4019", claimValue: "BC-DEL-4019", match: true }
    },
    ocrTextSnippet: "BHARATCARE SUPER SPECIALITY HOSPITAL\nFINAL INVOICE & DISCHARGE SUMMARY\nPATIENT: SUNITA PATEL | ABHA: 91-3142-9901-4411\nPROCEDURE: DIAGNOSTIC & ARTHROSCOPIC MENISCECTOMY (RT KNEE)\nOT CHARGES: RS 35,000 | SURGEON: RS 25,000 | IMPLANT: NIL | BED/NURSING: RS 25,000\nTOTAL AMOUNT PAYABLE: RS. 85,000/- (MATCHES CGHS TARIFF)",
    verificationSummary: "All document OCR fields match the submitted insurance claim with 100% concordance against hospital standard package schedules."
  },
  {
    id: "DOC-903",
    documentName: "Pathology_Lab_Report_DOC4091.pdf",
    claimId: "BM-1028",
    hospitalName: "CityCare Apex Multi-Speciality",
    uploadDate: "2026-08-25 11:20 IST",
    documentType: "Histopathology & Biopsy Report",
    ocrEngine: "Tesseract v5.3 + Digital Forensics",
    ocrConfidence: "92.6%",
    anomalyScore: 92,
    status: "TAMPERING_DETECTED",
    extractedFields: {
      patientName: { value: "Rajeshwar Singh", claimValue: "Rajeshwar Singh", match: true },
      patientId: { value: "P-106", claimValue: "P-106", match: true },
      admissionDate: { value: "2026-08-20 (MODIFIED)", claimValue: "2026-08-20", match: false },
      dischargeDate: { value: "2026-08-24", claimValue: "2026-08-24", match: true },
      diagnosis: { value: "Glioblastoma Multiforme Grade IV", claimValue: "Glioblastoma Grade IV", match: true },
      treatmentGiven: { value: "Craniotomy Biopsy", claimValue: "Craniotomy Biopsy", match: true },
      billedAmount: { value: "₹ 7,80,000 (INCONSISTENT FONT)", claimValue: "₹ 7,80,000", match: false },
      hospitalRegNumber: { value: "CC-MUM-88910", claimValue: "CC-MUM-88910", match: true }
    },
    ocrTextSnippet: "NEUROPATHOLOGY LAB REPORT\nPATIENT NAME: RAJESHWAR SINGH | REF: DOC-IND-4091\n[ALERT: FONT GLYPH DISTORTION DETECTED ON LINE 7 & 12]\nCOLLECTION DATE: [20-08-2026 - OVERWRITTEN FROM 20-05-2025]\nREPORT STATUS: DIGITAL WATERMARK HASH MISMATCH",
    verificationSummary: "Digital forensic OCR flagged font inconsistency, raster alignment deviation, and date metadata manipulation indicative of PDF digital forgery."
  }
];

export const CLINICAL_ANOMALIES_DATA = [
  {
    id: "CLN-401",
    patientId: "P-102",
    patientName: "Aarav Sharma",
    hospitalName: "BharatCare Super Speciality",
    timestamp: "2026-08-25 10:40 IST",
    category: "Unphysiological Lab Value Spike",
    severity: "HIGH",
    riskScore: 82,
    clinicalFinding: "Serum Potassium jumped from 4.1 mmol/L to 8.9 mmol/L within 90 minutes without hyperkalemic ECG signs (no peaked T-waves or QRS widening) or emergency dialysis intervention recorded.",
    possibleCauses: "Sample hemolysis in EDTA contamination, laboratory transcription typo, or synthetic test record generation.",
    recommendation: "Flagged as Potential Clinical Anomaly. Professional review and repeat serum electrolyte redraw required before authorizing intensive care claim codes.",
    ethicalDisclaimer: "BharatMedGuard AI does not perform medical diagnosis. This finding flags data divergence requiring clinical professional review."
  },
  {
    id: "CLN-402",
    patientId: "P-108",
    patientName: "Gopal Krishna Rao",
    hospitalName: "National Medical Research Institute",
    timestamp: "2026-08-25 11:15 IST",
    category: "Severe Drug Interaction & Billing Discordance",
    severity: "CRITICAL",
    riskScore: 91,
    clinicalFinding: "Simultaneous administration and billing of IV Nitroglycerin infusion alongside high-dose Oral Phosphodiesterase-5 Inhibitor (Sildenafil 100mg) within same 30-minute critical care window.",
    possibleCauses: "Severe clinical contraindication (extreme life-threatening hypotension risk) or ghost billing of unadministered pharmacy lines.",
    recommendation: "Urgent Pharmacovigilance & Hospital Chief Medical Officer audit required.",
    ethicalDisclaimer: "BharatMedGuard AI does not perform medical diagnosis. This finding flags data divergence requiring clinical professional review."
  },
  {
    id: "CLN-403",
    patientId: "P-112",
    patientName: "Kavita Sundaram",
    hospitalName: "Kaveri Healthcare Trust",
    timestamp: "2026-08-25 12:05 IST",
    category: "Diagnosis vs Treatment Code Discordance",
    severity: "MEDIUM",
    riskScore: 65,
    clinicalFinding: "Primary ICD-10 admission code recorded as J18.9 (Unspecified Bacterial Pneumonia), but procedural coding includes CPT 27130 (Total Hip Arthroplasty) with no secondary orthopedic trauma coded.",
    possibleCauses: "Coder transposition error or cross-patient chart bundling.",
    recommendation: "Clinical documentation improvement (CDI) specialist review recommended.",
    ethicalDisclaimer: "BharatMedGuard AI does not perform medical diagnosis. This finding flags data divergence requiring clinical professional review."
  }
];

export const ISOLATION_FOREST_POINTS = [
  // Dense normal cluster (100 points around center)
  ...Array.from({ length: 90 }, (_, i) => ({
    id: `norm-${i}`,
    x: +(0.25 + (Math.sin(i * 1.7) * 0.18) + (Math.cos(i * 3.1) * 0.08)).toFixed(3),
    y: +(0.32 + (Math.cos(i * 2.3) * 0.16) + (Math.sin(i * 0.9) * 0.07)).toFixed(3),
    isAnomaly: false,
    label: `Normal Claim record #${1000 + i}`,
    claimAmount: `₹ ${Math.round(45000 + Math.random() * 60000).toLocaleString('en-IN')}`,
    anomalyScore: +(0.15 + (Math.random() * 0.2)).toFixed(3),
    isolationDepth: Math.floor(10 + Math.random() * 6)
  })),
  // Isolated Outlier Anomalies
  { id: "anom-1", x: 0.92, y: 0.88, isAnomaly: true, label: "Claim BM-1024 (Duplicate & 3.4x)", claimAmount: "₹ 3,40,000", anomalyScore: 0.912, isolationDepth: 3 },
  { id: "anom-2", x: 0.88, y: 0.22, isAnomaly: true, label: "Patient P-102 (Impossible Velocity)", claimAmount: "₹ 5,20,000", anomalyScore: 0.884, isolationDepth: 2 },
  { id: "anom-3", x: 0.15, y: 0.91, isAnomaly: true, label: "Doc DOC-903 (Tampered Pathology)", claimAmount: "₹ 7,80,000", anomalyScore: 0.941, isolationDepth: 2 },
  { id: "anom-4", x: 0.95, y: 0.54, isAnomaly: true, label: "Claim BM-1028 (Sabbatical Surgeon)", claimAmount: "₹ 7,80,000", anomalyScore: 0.938, isolationDepth: 3 },
  { id: "anom-5", x: 0.78, y: 0.85, isAnomaly: true, label: "Clinical CLN-402 (Fatal Interaction)", claimAmount: "₹ 1,95,000", anomalyScore: 0.865, isolationDepth: 4 },
  { id: "anom-6", x: 0.82, y: 0.12, isAnomaly: true, label: "Patient P-104 (Aadhaar Collision)", claimAmount: "₹ 14,80,000", anomalyScore: 0.929, isolationDepth: 2 },
  { id: "anom-7", x: 0.08, y: 0.78, isAnomaly: true, label: "Claim BM-1026 (Biologic Redundancy)", claimAmount: "₹ 5,20,000", anomalyScore: 0.842, isolationDepth: 3 },
];

export const NETWORK_PACKETS = [
  { id: "PKT-8801", timestamp: "14:02:11.412", src: "10.14.22.8 (BharatCare Gateway)", dst: "172.16.0.10:443", proto: "TLS 1.3 / HTTPS", length: 1420, info: "FHIR R4 Patient Bundle Sync - Normal", status: "CLEAN", flags: "ACK, PSH" },
  { id: "PKT-8802", timestamp: "14:02:12.190", src: "192.168.4.19 (Unrecognized Subnet)", dst: "10.14.22.8:8080", proto: "HTTP / REST API", length: 4890, info: "Abnormal Claim Payload Batch Injection - Rate Limit Exceeded", status: "SUSPICIOUS", flags: "SYN, PSH" },
  { id: "PKT-8803", timestamp: "14:02:12.802", src: "45.133.1.88 (External WAN Proxy)", dst: "172.16.1.4:5000", proto: "TCP / Fast-API", length: 320, info: "Brute-force OAuth Bearer Token Replay Detected", status: "THREAT_BLOCKED", flags: "RST" },
  { id: "PKT-8804", timestamp: "14:02:13.015", src: "10.18.90.4 (CityCare PACS)", dst: "172.16.0.22:11112", proto: "DICOM C-STORE", length: 18400, info: "CT Angiogram Study Transmission - Validated", status: "CLEAN", flags: "ACK" },
  { id: "PKT-8805", timestamp: "14:02:13.670", src: "103.21.244.0 (Cloudflare Edge)", dst: "172.16.0.1:443", proto: "HTTPS / API", length: 890, info: "TPA Claim Pre-Auth Response Token Verified", status: "CLEAN", flags: "ACK" }
];

export const SECURITY_ALERTS = [
  { id: "ALT-2026-091", title: "Potential Bulk Health Record Exfiltration Attempt", severity: "CRITICAL", source: "192.168.4.19 (Varanasi Node)", timestamp: "10 minutes ago", status: "ACTIVE_INVESTIGATION", details: "Unusually high number of ABHA query calls (450 requests/min) from an unverified hospital subnet." },
  { id: "ALT-2026-092", title: "Abnormal Authentication Velocity & Token Replay", severity: "HIGH", source: "Auth Gateway / OAuth 2.0", timestamp: "24 minutes ago", status: "MITIGATED", details: "Investigator token 'investigator_102' refreshed from two geographic locations within 12 seconds." },
  { id: "ALT-2026-093", title: "DICOM PACS Port Scanning Detected", severity: "MEDIUM", source: "10.14.99.120 (Internal LAN)", timestamp: "1 hour ago", status: "ACKNOWLEDGED", details: "Port probe on 11112 and 8080 targeting radiology storage server." },
  { id: "ALT-2026-094", title: "Scheduled Daily Key Rotation & Certificate Validation", severity: "LOW", source: "KMS Cryptographic Vault", timestamp: "3 hours ago", status: "RESOLVED", details: "RSA-4096 and ECDSA signing keys successfully refreshed." }
];

export const AUDIT_LOGS = [
  { id: "AUD-9901", timestamp: "2026-08-25 13:43:10", user: "radhika.upadhyay@bharatmedguard.gov.in", role: "Security Investigator", action: "VIEW_CLAIM_RECORD", resource: "Claim BM-1024", ip: "10.220.14.88", status: "SUCCESS" },
  { id: "AUD-9902", timestamp: "2026-08-25 13:41:02", user: "radhika.upadhyay@bharatmedguard.gov.in", role: "Security Investigator", action: "TRIGGER_OCR_ANALYSIS", resource: "DOC-901", ip: "10.220.14.88", status: "SUCCESS" },
  { id: "AUD-9903", timestamp: "2026-08-25 13:30:19", user: "system_isolation_forest_daemon", role: "AI Pipeline Engine", action: "ANOMALY_SCORE_CALCULATED", resource: "Claim BM-1028", ip: "127.0.0.1", status: "SUCCESS" },
  { id: "AUD-9904", timestamp: "2026-08-25 13:12:44", user: "amit.verma@citycare.org", role: "External Hospital TPA", action: "MODIFY_CLAIM_ATTACHMENT", resource: "Claim BM-1024", ip: "103.44.112.5", status: "DENIED" },
  { id: "AUD-9905", timestamp: "2026-08-25 12:55:00", user: "admin_root@bharatmedguard.gov.in", role: "System Administrator", action: "UPDATE_THRESHOLD_CONFIG", resource: "IsolationForest_Contamination", ip: "10.220.1.1", status: "SUCCESS" },
  { id: "AUD-9906", timestamp: "2026-08-25 12:20:11", user: "dr.kavita.auditor@cghs.gov.in", role: "Clinical Auditor", action: "SUBMIT_CLINICAL_OPINION", resource: "CLN-401", ip: "14.139.60.10", status: "SUCCESS" },
];

export const CURRENT_USER = {
  name: "Radhika Upadhyay",
  email: "radhika.upadhyay@bharatmedguard.gov.in",
  role: "Security Investigator",
  badgeId: "BMG-SEC-230068",
  department: "National Healthcare Cyber Intelligence Cell",
  permissions: [
    { name: "View Claims & Billing", granted: true },
    { name: "Investigate Anomaly Alerts", granted: true },
    { name: "Execute OCR Forensic Verification", granted: true },
    { name: "Inspect Patient Identity Graph", granted: true },
    { name: "View Immutable Audit Logs", granted: true },
    { name: "Modify System Kernel / Core Settings", granted: false }
  ]
};
