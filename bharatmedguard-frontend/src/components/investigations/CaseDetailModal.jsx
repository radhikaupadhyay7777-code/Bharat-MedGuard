import React, { useState } from 'react';
import Badge from '../common/Badge';
import { 
  X, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Building, 
  User, 
  DollarSign, 
  HelpCircle,
  Share2,
  FileCheck
} from 'lucide-react';

export const CaseDetailModal = ({ caseData, isOpen, onClose, onAction }) => {
  const [actionNotes, setActionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionDoneMessage, setActionDoneMessage] = useState(null);

  if (!isOpen || !caseData) return null;

  const handleActionClick = (actionType) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setActionDoneMessage(`Case ${caseData.id} updated: ${actionType} recorded in immutable audit log.`);
      if (onAction) onAction(caseData.id, actionType);
    }, 500);
  };

  const defaultTimeline = [
    { time: "09:32:10", title: "Claim Submitted", desc: "Claim received via ABDM FHIR gateway from CityCare Apex (Mumbai)." },
    { time: "09:33:04", title: "Duplicate Hash Detected", desc: "Identical diagnostic bill hash collision flagged against historic claim #CLM-2026-880211." },
    { time: "09:34:18", title: "Identity Anomaly Flagged", desc: "Patient P-102 recorded concurrent ER admission in Bengaluru at 12:30." },
    { time: "09:35:00", title: "Document Mismatch Detected", desc: "Tesseract OCR engine extracted diagnosis of Gastritis vs billed Angioplasty." },
    { time: "09:36:12", title: "Risk Score Calculated", desc: "Isolation Forest model output composite score: 91/100 (CRITICAL)." }
  ];

  const timeline = caseData.evidence?.timeline?.map(t => ({
    time: t.time,
    title: t.event.split(' ')[0] + ' ' + (t.event.split(' ')[1] || ''),
    desc: t.event
  })) || defaultTimeline;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bmg-navy/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-bmg-midnight border border-bmg-border rounded-2xl shadow-2xl overflow-hidden my-8 animate-fadeIn">
        {/* Modal Header */}
        <div className="p-6 bg-bmg-navy/90 border-b border-bmg-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white font-mono">
                  Case {caseData.id || "BM-2026-0142"}
                </h3>
                <Badge severity={caseData.severity || "critical"} text={caseData.severity || "CRITICAL"} />
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Investigator: Radhika Upadhyay (Security Investigator) • Assigned: Today 09:36 IST
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-mono block">COMPOSITE RISK</span>
              <span className="text-2xl font-black font-mono text-red-400">
                {caseData.riskScore || 91}<span className="text-xs text-slate-500">/100</span>
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-bmg-card transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {actionDoneMessage && (
            <div className="p-3.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center justify-between">
              <span>{actionDoneMessage}</span>
              <button onClick={() => setActionDoneMessage(null)} className="text-emerald-400 hover:text-white">✕</button>
            </div>
          )}

          {/* Key Entity Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-bmg-navy border border-bmg-border">
              <span className="text-[10px] text-slate-400 font-mono block">PATIENT</span>
              <span className="text-xs font-bold text-white font-mono">{caseData.patientName || "Aarav Sharma"}</span>
              <span className="text-[10px] text-bmg-cyan block font-mono">ID: {caseData.patientId || "P-102"}</span>
            </div>

            <div className="p-3 rounded-lg bg-bmg-navy border border-bmg-border">
              <span className="text-[10px] text-slate-400 font-mono block">HOSPITAL</span>
              <span className="text-xs font-bold text-white font-mono truncate block">{caseData.hospitalName || "CityCare Apex"}</span>
              <span className="text-[10px] text-slate-400 block font-mono">Mumbai</span>
            </div>

            <div className="p-3 rounded-lg bg-bmg-navy border border-bmg-border">
              <span className="text-[10px] text-slate-400 font-mono block">CLAIMED AMOUNT</span>
              <span className="text-xs font-bold text-white font-mono">₹ {(caseData.claimedAmount || 340000).toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-red-400 block font-mono font-bold">3.4x Baseline</span>
            </div>

            <div className="p-3 rounded-lg bg-bmg-navy border border-bmg-border">
              <span className="text-[10px] text-slate-400 font-mono block">STATUS</span>
              <span className="text-xs font-bold text-orange-400 font-mono uppercase">{caseData.status || "OPEN INVESTIGATION"}</span>
            </div>
          </div>

          {/* Detected Anomalies Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              Detected Anomalies Checklist
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "Duplicate claim hash detected in gateway",
                "Abnormal claim amount (3.4x hospital baseline)",
                "Patient identity concurrent velocity collision",
                "Document OCR mismatch: Gastritis vs Angioplasty"
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/30 text-xs text-red-200 flex items-center gap-2">
                  <span className="text-red-400 font-bold font-mono text-xs">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-bmg-cyan" />
              Evidence Timeline
            </h4>
            <div className="relative pl-6 border-l-2 border-bmg-border space-y-4 font-mono">
              {timeline.map((event, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-bmg-cyan border-2 border-bmg-midnight ring-2 ring-bmg-royal"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-bmg-cyan">{event.time}</span>
                    <span className="text-xs text-white font-semibold">{event.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 font-sans leading-relaxed">{event.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence-Based AI Explanation (Compliant phrasing) */}
          <div className="p-4 rounded-xl bg-bmg-navy/90 border border-bmg-border space-y-1.5">
            <h4 className="text-xs font-bold text-bmg-cyan uppercase tracking-wider font-mono flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              AI Explanation & Rationalization
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              "The system identified multiple indicators requiring investigation. The submitted claim invoice payload matches a previously registered transaction, while the extracted OCR text from the attached medical discharge summary describes non-invasive conservative treatment rather than the claimed invasive cardiac catheterization procedure."
            </p>
          </div>
        </div>

        {/* Modal Footer / Investigator Action Bar */}
        <div className="p-4 bg-bmg-navy/90 border-t border-bmg-border flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-mono text-slate-400">
            Action will be recorded under <span className="text-bmg-cyan">Radhika Upadhyay (Investigator)</span>
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleActionClick("ESCALATE_SIU")}
              disabled={isSubmitting}
              className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono flex items-center gap-1.5 transition shadow-sm"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Escalate to SIU
            </button>

            <button
              onClick={() => handleActionClick("REQUEST_AUDIT")}
              disabled={isSubmitting}
              className="px-3.5 py-2 rounded-lg bg-bmg-royal hover:bg-bmg-royal/80 border border-bmg-cyan/40 text-white font-bold text-xs font-mono transition"
            >
              Request Hospital Audit
            </button>

            <button
              onClick={() => handleActionClick("APPROVE_OVERRIDE")}
              disabled={isSubmitting}
              className="px-3.5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs font-mono transition"
            >
              Approve with Override
            </button>

            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-bmg-card hover:bg-bmg-midnight text-slate-300 hover:text-white text-xs font-mono border border-bmg-border transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailModal;
