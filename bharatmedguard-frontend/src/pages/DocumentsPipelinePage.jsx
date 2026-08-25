import React from 'react';
import PipelineVisualizer from '../components/pipelines/PipelineVisualizer';
import DocumentOcrViewer from '../components/pipelines/DocumentOcrViewer';
import { 
  Upload, 
  CheckCircle2, 
  Eye, 
  FileSearch, 
  FileCheck2, 
  GitCompare, 
  Activity,
  Scan
} from 'lucide-react';

export const DocumentsPipelinePage = () => {
  const pipelineStages = [
    { name: "Upload", icon: Upload, time: "12ms", confidence: "100%", status: "UPLOADED", description: "Discharge summary & itemized hospital bills received as multi-page PDF." },
    { name: "Validation", icon: CheckCircle2, time: "8ms", confidence: "99.8%", status: "PASSED", description: "PDF digital signature and anti-forgery metadata hash integrity verified." },
    { name: "OCR Tesseract", icon: Scan, time: "85ms", confidence: "98.4%", status: "TEXT EXTRACTED", description: "Tesseract OCR v5.3 + Custom BMG Med-NLP extracted text lines with bounding boxes." },
    { name: "Data Extraction", icon: FileSearch, time: "42ms", confidence: "99.1%", status: "ENTITIES EXTRACTED", description: "Structured entities mapped: Patient Name, Diagnosis, Surgical Codes, Pharmacy Lines, Final Bill." },
    { name: "Doc Verification", icon: FileCheck2, time: "28ms", confidence: "98.7%", status: "VERIFIED", description: "Hospital registration credentials validated against National Medical Registry." },
    { name: "Claim Compare", icon: GitCompare, time: "18ms", confidence: "99.9%", status: "MISMATCH IDENTIFIED", description: "Diagnosis (Gastritis vs Angioplasty) and Amount (₹28.5k vs ₹3.4L) show severe discrepancy." },
    { name: "Anomaly Score", icon: Activity, time: "10ms", confidence: "99.5%", status: "ANOMALY SCORE: 89", description: "High risk of document tampering or procedural substitution flagged." }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-bmg-cyan" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono">
              Pipeline 3: Medical Document Intelligence
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Tesseract OCR & NLP cross-verification of medical records, discharge summaries, and hospital billing line items
          </p>
        </div>
      </div>

      {/* 7-Stage Connected Visual Pipeline */}
      <PipelineVisualizer
        title="Document Intelligence Pipeline"
        subtitle="UPLOAD → FILE VALIDATION → OCR (TESSERACT) → DATA EXTRACTION → DOCUMENT VERIFICATION → CLAIM COMPARISON → ANOMALY SCORE"
        stages={pipelineStages}
        currentStageIndex={6}
        activeCaseId="Document DOC-901"
      />

      {/* Document OCR & Comparison Viewer */}
      <DocumentOcrViewer />
    </div>
  );
};

export default DocumentsPipelinePage;
