import React from 'react';
import PipelineVisualizer from '../components/pipelines/PipelineVisualizer';
import ClaimsInspector from '../components/pipelines/ClaimsInspector';
import { 
  FileText, 
  CheckCircle2, 
  Cpu, 
  Activity, 
  Zap, 
  ShieldAlert, 
  ReceiptText,
  Sliders
} from 'lucide-react';

export const ClaimsPipelinePage = () => {
  const pipelineStages = [
    { name: "Claim Data", icon: FileText, time: "4ms", confidence: "100%", status: "RECEIVED", description: "Standard FHIR R4 claim payload parsed from hospital TPA gateway." },
    { name: "Validation", icon: CheckCircle2, time: "8ms", confidence: "99.8%", status: "PASSED", description: "Cryptographic digital certificate check and schema compliance validated." },
    { name: "Feature Extract", icon: Sliders, time: "14ms", confidence: "99.4%", status: "COMPLETED", description: "Extracted: Procedure Tariff Index, Historical Patient Velocity, Length of Stay." },
    { name: "Anomaly Detect", icon: Zap, time: "22ms", confidence: "98.9%", status: "FLAGGED", description: "Heuristics triggered: Duplicate Invoice ID match and 3.4x tariff baseline deviation." },
    { name: "Isolation Forest", icon: Cpu, time: "35ms", confidence: "99.2%", status: "ANOMALY ISOLATED", description: "Tree path length h(x)=3.0 (99.4th percentile outlier in 100 estimators)." },
    { name: "Risk Scoring", icon: Activity, time: "12ms", confidence: "99.5%", status: "CALCULATED", description: "Composite multidimensional threat score evaluated at 91/100 (CRITICAL)." },
    { name: "Investigate Alert", icon: ShieldAlert, time: "6ms", confidence: "100%", status: "ALERT DISPATCHED", description: "Case BM-2026-0142 generated and routed to Security Investigator Radhika Upadhyay." },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <ReceiptText className="w-6 h-6 text-red-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono">
              Pipeline 1: Claims & Billing Intelligence
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Real-time automated inference pipeline for medical insurance claims, phantom billing, and tariff deviation
          </p>
        </div>
      </div>

      {/* 7-Stage Connected Visual Pipeline */}
      <PipelineVisualizer
        title="Claims Intelligence Pipeline"
        subtitle="CLAIM DATA → DATA VALIDATION → FEATURE EXTRACTION → ANOMALY DETECTION → ISOLATION FOREST → RISK SCORING → INVESTIGATION ALERT"
        stages={pipelineStages}
        currentStageIndex={6}
        activeCaseId="Claim BM-1024"
      />

      {/* Claims Inspector Deep Dive */}
      <ClaimsInspector />
    </div>
  );
};

export default ClaimsPipelinePage;
