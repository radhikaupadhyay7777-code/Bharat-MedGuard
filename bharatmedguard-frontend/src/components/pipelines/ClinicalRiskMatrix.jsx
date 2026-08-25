import React, { useState } from 'react';
import { CLINICAL_ANOMALIES_DATA } from '../../services/mockData';
import Badge from '../common/Badge';
import { 
  ActivitySquare, 
  Stethoscope, 
  AlertCircle, 
  CheckCircle2, 
  HeartPulse, 
  Pill, 
  FlaskConical, 
  HelpCircle,
  FileBadge
} from 'lucide-react';

export const ClinicalRiskMatrix = () => {
  const [selectedItem, setSelectedItem] = useState(CLINICAL_ANOMALIES_DATA[0]); // CLN-401

  return (
    <div className="space-y-6">
      {/* Top Ethical Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-bmg-midnight border-l-4 border-amber-400 border border-bmg-border flex items-start gap-3 shadow-md">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
            Medical AI Governance & Ethical Standard
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            BharatMedGuard AI analyzes billing and record concordance for <strong className="text-white">Potential Clinical Anomalies</strong>. The platform does <strong className="text-white">not</strong> generate clinical diagnoses or prescribe patient care. All flagged discrepancies require <strong className="text-amber-300">Professional Review Required</strong> by certified medical auditors and clinicians.
          </p>
        </div>
      </div>

      {/* Top Grid: Selected Clinical Case Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Clinical Finding Details */}
        <div className="lg:col-span-7 bmg-card p-6 border-bmg-border flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-bmg-border/60">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Clinical Data Discrepancy #{selectedItem.id}
                </h3>
              </div>
              <Badge severity="high" text="POTENTIAL CLINICAL ANOMALY" />
            </div>

            <div className="mt-4 space-y-4">
              <div className="p-3 rounded-lg bg-bmg-navy border border-bmg-border">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">PATIENT & FACILITY</span>
                <p className="text-xs font-bold text-white mt-0.5">
                  {selectedItem.patientName} (ID: {selectedItem.patientId}) • {selectedItem.hospitalName}
                </p>
                <span className="text-[10px] text-slate-400 font-mono">{selectedItem.timestamp}</span>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-300 font-mono uppercase flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-bmg-cyan" /> Anomaly Finding
                </span>
                <p className="text-xs text-slate-200 leading-relaxed p-3 rounded-lg bg-red-950/30 border border-red-500/30 font-sans">
                  {selectedItem.clinicalFinding}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-300 font-mono uppercase">
                  Differential / Possible Root Causes
                </span>
                <p className="text-xs text-slate-300 p-2.5 rounded-lg bg-bmg-midnight border border-bmg-border font-sans">
                  {selectedItem.possibleCauses}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-xs">
            <span className="font-bold text-amber-300 uppercase tracking-wider font-mono block text-[10px]">
              Recommendation
            </span>
            <p className="text-amber-100 text-[11px] mt-0.5">
              {selectedItem.recommendation}
            </p>
          </div>
        </div>

        {/* Right 5 Cols: Clinical Verification Checklist & Audit Actions */}
        <div className="lg:col-span-5 bmg-card p-6 border-bmg-border flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-bmg-border/60">
              <Stethoscope className="w-5 h-5 text-bmg-cyan" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Audit Checklist
              </h3>
            </div>

            <div className="space-y-3 mt-4">
              <div className="p-3 rounded-lg bg-bmg-navy border border-bmg-border">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Lab Value Feasibility</span>
                  <span className="text-red-400 font-bold">OUTLIER (Z &gt; 4.0)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div className="bg-red-500 h-1.5 rounded-full w-[88%]"></div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-bmg-navy border border-bmg-border">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Medication Contraindication</span>
                  <span className="text-amber-400 font-bold">AUDIT QUEUED</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div className="bg-amber-500 h-1.5 rounded-full w-[65%]"></div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-bmg-navy border border-bmg-border">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">ICD-10 vs CPT Concordance</span>
                  <span className="text-red-400 font-bold">DISCORDANT</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div className="bg-red-500 h-1.5 rounded-full w-[92%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-bmg-border flex gap-2">
            <button className="flex-1 py-2 rounded-lg bg-bmg-royal hover:bg-bmg-royal/80 border border-bmg-cyan/40 text-xs font-bold text-white transition">
              Assign to Clinical CMO
            </button>
            <button className="px-3 py-2 rounded-lg bg-bmg-card hover:bg-bmg-navy border border-bmg-border text-xs font-bold text-slate-300 hover:text-white transition">
              Request Redraw
            </button>
          </div>
        </div>
      </div>

      {/* Bottom: Clinical Anomalies List */}
      <div className="bmg-card p-5 border-bmg-border">
        <div className="flex items-center justify-between pb-3 border-b border-bmg-border/60">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Flagged Clinical Patterns ({CLINICAL_ANOMALIES_DATA.length} Pending Review)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Clinical Safety Cell</span>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-bmg-border text-slate-400 text-[10px] uppercase">
                <th className="pb-2">Case ID</th>
                <th className="pb-2">Patient</th>
                <th className="pb-2">Hospital</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Risk</th>
                <th className="pb-2">Governance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bmg-border/40 text-slate-200">
              {CLINICAL_ANOMALIES_DATA.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedItem(c)}
                  className={`hover:bg-bmg-card transition cursor-pointer ${
                    selectedItem.id === c.id ? 'bg-bmg-royal/20 border-l-2 border-bmg-cyan' : ''
                  }`}
                >
                  <td className="py-3 font-bold text-white">{c.id}</td>
                  <td className="py-3 text-slate-200 font-semibold">{c.patientName}</td>
                  <td className="py-3 text-slate-400 truncate max-w-[160px]">{c.hospitalName}</td>
                  <td className="py-3 text-amber-300 truncate max-w-[220px]">{c.category}</td>
                  <td className="py-3 font-extrabold text-orange-400">{c.riskScore}/100</td>
                  <td className="py-3">
                    <Badge severity="medium" text="REVIEW REQUIRED" size="xs" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClinicalRiskMatrix;
