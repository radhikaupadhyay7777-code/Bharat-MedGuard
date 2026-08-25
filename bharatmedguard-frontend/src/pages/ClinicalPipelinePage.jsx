import React from 'react';
import PipelineVisualizer from '../components/pipelines/PipelineVisualizer';
import ClinicalRiskMatrix from '../components/pipelines/ClinicalRiskMatrix';
import { 
  FileText, 
  CheckCircle2, 
  Cpu, 
  Activity, 
  Zap, 
  HeartPulse, 
  ActivitySquare,
  Stethoscope
} from 'lucide-react';

export const ClinicalPipelinePage = () => {
  const pipelineStages = [
    { name: "Clinical Records", icon: FileText, time: "4ms", confidence: "100%", status: "INGESTED", description: "Inpatient EHR lab telemetry, clinical vitals, and physician notes ingested." },
    { name: "Data Validation", icon: CheckCircle2, time: "8ms", confidence: "99.8%", status: "VALIDATED", description: "Units of measurement normalized (mmol/L, mg/dL, mmHg) and timestamped." },
    { name: "Feature Eng.", icon: Cpu, time: "16ms", confidence: "99.2%", status: "COMPLETED", description: "Computed: Lab Delta Velocity, Multi-Drug Interaction Graph, Diagnostic Concordance." },
    { name: "Pattern Analysis", icon: ActivitySquare, time: "22ms", confidence: "98.9%", status: "PATTERN FLAGGED", description: "Unphysiological potassium jump (4.1 → 8.9 mmol/L) without corresponding ECG evidence." },
    { name: "Anomaly Detect", icon: Zap, time: "18ms", confidence: "99.4%", status: "OUTLIER ISOLATED", description: "Statistical z-score outlier (> 4.2 standard deviations from physiological bounds)." },
    { name: "Clinical Risk", icon: HeartPulse, time: "12ms", confidence: "99.5%", status: "RISK INDEX: 82", description: "Classified as Potential Clinical Anomaly requiring human-in-the-loop review." },
    { name: "Review Required", icon: Stethoscope, time: "5ms", confidence: "100%", status: "AUDIT QUEUED", description: "Dispatched to Clinical Governance and Chief Medical Officer for certified audit." }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono">
              Pipeline 4: Clinical Data Intelligence
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Analyzing clinical discordances, unphysiological lab value spikes, and medication contraindications for professional audit
          </p>
        </div>
      </div>

      {/* 7-Stage Connected Visual Pipeline */}
      <PipelineVisualizer
        title="Clinical Intelligence Pipeline"
        subtitle="CLINICAL RECORDS → DATA VALIDATION → FEATURE ENGINEERING → PATTERN ANALYSIS → ANOMALY DETECTION → CLINICAL RISK → REVIEW REQUIRED"
        stages={pipelineStages}
        currentStageIndex={6}
        activeCaseId="Record CLN-401"
      />

      {/* Clinical Risk Matrix Deep Dive */}
      <ClinicalRiskMatrix />
    </div>
  );
};

export default ClinicalPipelinePage;
