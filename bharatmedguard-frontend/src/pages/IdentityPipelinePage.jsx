import React from 'react';
import PipelineVisualizer from '../components/pipelines/PipelineVisualizer';
import IdentityNetworkGraph from '../components/pipelines/IdentityNetworkGraph';
import { 
  User, 
  CheckCircle2, 
  Fingerprint, 
  Zap, 
  Activity, 
  ShieldAlert, 
  Compass
} from 'lucide-react';

export const IdentityPipelinePage = () => {
  const pipelineStages = [
    { name: "Patient Data", icon: User, time: "3ms", confidence: "100%", status: "INGESTED", description: "ABDM Ayushman Bharat Health Account (ABHA) registration packet received." },
    { name: "Normalization", icon: CheckCircle2, time: "6ms", confidence: "99.9%", status: "COMPLETED", description: "Standardized phonetic name hash and demographic token generation." },
    { name: "Entity Matching", icon: Fingerprint, time: "18ms", confidence: "98.5%", status: "COLLISION DETECTED", description: "Same Aadhaar biometric hash tied to multiple active state registry records." },
    { name: "Pattern Analysis", icon: Compass, time: "24ms", confidence: "99.1%", status: "ANOMALY FLAGGED", description: "Impossible travel velocity calculated: Delhi to Bengaluru in 135 minutes (773 km/h)." },
    { name: "Anomaly Detect", icon: Zap, time: "16ms", confidence: "99.4%", status: "ISOLATED", description: "Simultaneous inpatient admissions active across two distinct geographical hubs." },
    { name: "Identity Risk", icon: Activity, time: "10ms", confidence: "99.6%", status: "CALCULATED", description: "Biometric identity risk index calculated at 88/100 (HIGH RISK)." },
    { name: "Alert Queue", icon: ShieldAlert, time: "4ms", confidence: "100%", status: "DISPATCHED", description: "High-priority identity fraud alert pushed to national ABDM monitoring desk." }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <Fingerprint className="w-6 h-6 text-orange-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono">
              Pipeline 2: Patient & Identity Intelligence
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Detecting entity collisions, impossible geographic travel velocity, synthetic patient identities, and ghost credentials
          </p>
        </div>
      </div>

      {/* 7-Stage Connected Visual Pipeline */}
      <PipelineVisualizer
        title="Identity Intelligence Pipeline"
        subtitle="PATIENT DATA → IDENTITY NORMALIZATION → ENTITY MATCHING → PATTERN ANALYSIS → ANOMALY DETECTION → IDENTITY RISK SCORE → ALERT"
        stages={pipelineStages}
        currentStageIndex={6}
        activeCaseId="Patient P-102"
      />

      {/* Identity Network Graph & Analysis */}
      <IdentityNetworkGraph />
    </div>
  );
};

export default IdentityPipelinePage;
