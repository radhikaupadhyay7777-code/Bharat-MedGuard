import React, { useState } from 'react';
import { 
  ReceiptText, 
  UserCheck, 
  FileCheck2, 
  ActivitySquare, 
  ShieldAlert, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';

export const AnomalyStream = ({ recentClaims = [], recentPatients = [], recentDocs = [], recentClinical = [] }) => {
  const [activeTab, setActiveTab] = useState('ALL');
  const navigate = useNavigate();

  // Combine items into unified event stream
  const events = [
    {
      id: "EVT-101",
      category: "Claims & Billing",
      title: "Duplicate & Abnormal Claim BM-1024",
      entity: "CityCare Apex (Mumbai) • ₹3,40,000",
      riskScore: 91,
      severity: "CRITICAL",
      time: "09:32 IST",
      description: "Claim amount is 3.4x regional baseline with identical hash collision across 2 TPAs.",
      type: "claims",
      link: "/pipelines/claims"
    },
    {
      id: "EVT-102",
      category: "Patient & Identity",
      title: "Impossible Travel Velocity: Patient P-102",
      entity: "ABHA: 91-8842-1920-5512",
      riskScore: 88,
      severity: "HIGH",
      time: "10:15 IST",
      description: "Delhi admission followed by Bengaluru emergency registration in 135 minutes.",
      type: "identity",
      link: "/pipelines/identity"
    },
    {
      id: "EVT-103",
      category: "Medical Documents",
      title: "OCR Verification Mismatch: DOC-901",
      entity: "Discharge Summary vs Claim BM-1024",
      riskScore: 89,
      severity: "HIGH",
      time: "10:45 IST",
      description: "Discharge summary records Gastritis treatment (₹28.5k); claim billed for Angioplasty (₹3.4L).",
      type: "documents",
      link: "/pipelines/documents"
    },
    {
      id: "EVT-104",
      category: "Clinical Data",
      title: "Unphysiological Serum Potassium Spike",
      entity: "Patient P-102 • BharatCare Hospital",
      riskScore: 82,
      severity: "HIGH",
      time: "11:00 IST",
      description: "K+ jumped 4.1 to 8.9 mmol/L in 90 mins without ECG signs. Professional Review Required.",
      type: "clinical",
      link: "/pipelines/clinical"
    },
    {
      id: "EVT-105",
      category: "Claims & Billing",
      title: "Phantom Billing / Surgeon on Sabbatical: BM-1028",
      entity: "Surgeon DOC-IND-4091 • ₹7,80,000",
      riskScore: 94,
      severity: "CRITICAL",
      time: "11:20 IST",
      description: "Lead operating surgeon was on recorded overseas sabbatical during surgery timestamp.",
      type: "claims",
      link: "/pipelines/claims"
    }
  ];

  const filteredEvents = activeTab === 'ALL' 
    ? events 
    : events.filter(e => e.type.toLowerCase() === activeTab.toLowerCase());

  const getCategoryIcon = (type) => {
    switch (type) {
      case 'claims': return <ReceiptText className="w-4 h-4 text-red-400" />;
      case 'identity': return <UserCheck className="w-4 h-4 text-orange-400" />;
      case 'documents': return <FileCheck2 className="w-4 h-4 text-cyan-400" />;
      case 'clinical': return <ActivitySquare className="w-4 h-4 text-amber-400" />;
      default: return <ShieldAlert className="w-4 h-4 text-bmg-cyan" />;
    }
  };

  return (
    <div className="bmg-card p-5 border-bmg-border flex flex-col h-full">
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-bmg-border/60">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping"></span>
            Real-Time Anomaly Stream
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Live incoming signals flagged by AI Isolation Engines</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-bmg-navy/80 p-1 rounded-lg border border-bmg-border text-[11px] font-medium overflow-x-auto">
          {['ALL', 'CLAIMS', 'IDENTITY', 'DOCUMENTS', 'CLINICAL'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 rounded transition ${
                activeTab === tab
                  ? 'bg-bmg-royal text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Stream Items List */}
      <div className="mt-3 space-y-2.5 flex-1 overflow-y-auto max-h-[380px] pr-1">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            onClick={() => navigate(evt.link)}
            className="p-3 rounded-lg bg-bmg-midnight/70 hover:bg-bmg-card border border-bmg-border hover:border-bmg-cyan/50 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-bmg-navy border border-bmg-border shrink-0 mt-0.5">
                {getCategoryIcon(evt.type)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-bold text-white group-hover:text-bmg-cyan transition">
                    {evt.title}
                  </h4>
                  <Badge severity={evt.severity} text={evt.severity} size="xs" />
                  <span className="text-[10px] font-mono text-slate-400">{evt.time}</span>
                </div>
                <p className="text-[11px] text-slate-300 font-mono mt-0.5">{evt.entity}</p>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{evt.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-bmg-border/40">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">RISK SCORE</span>
                <span className="text-sm font-extrabold font-mono text-orange-400">
                  {evt.riskScore}<span className="text-[10px] text-slate-500">/100</span>
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-bmg-cyan group-hover:translate-x-1 transition" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnomalyStream;
