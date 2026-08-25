import React, { useState } from 'react';
import { ShieldCheck, Server, Database, Eye, Cpu, Activity, ChevronUp, CheckCircle2 } from 'lucide-react';

export const SystemStatus = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const services = [
    { name: "AI Anomaly Engine", status: "Operational", latency: "14ms", icon: Cpu },
    { name: "FastAPI Gateway", status: "Operational", latency: "8ms", icon: Server },
    { name: "Encrypted DB Cluster", status: "Operational", latency: "4ms", icon: Database },
    { name: "Cyber Defence Shield", status: "Protected", latency: "Active", icon: ShieldCheck },
    { name: "Tesseract OCR Engine", status: "Operational", latency: "42ms", icon: Eye },
    { name: "Scapy Network Monitor", status: "Active", latency: "Real-time", icon: Activity }
  ];

  return (
    <footer className="bmg-header-glass border-t border-bmg-border px-4 py-2 text-xs font-mono text-slate-400 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left Side: Summary Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>PLATFORM OPERATIONAL</span>
          </div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-300">
            BharatMedGuard AI v2.4 • ISO 27001 & ABDM Compliant
          </span>
        </div>

        {/* Right Side: Expandable Service Nodes */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4">
            {services.slice(0, 4).map((s, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="text-slate-300">{s.name}:</span>
                <span className="text-emerald-400 font-semibold">{s.status}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] text-bmg-cyan hover:underline ml-2"
          >
            <span>{isExpanded ? 'Hide Health' : 'All 6 Services'}</span>
            <ChevronUp className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanded Health Drawer */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-bmg-border grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {services.map((svc, index) => {
            const Icon = svc.icon;
            return (
              <div
                key={index}
                className="p-2.5 rounded-lg bg-bmg-midnight border border-bmg-border flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <Icon className="w-3.5 h-3.5 text-bmg-cyan" />
                  <span className="text-[10px] text-slate-400">{svc.latency}</span>
                </div>
                <span className="text-[11px] font-semibold text-white truncate">{svc.name}</span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {svc.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </footer>
  );
};

export default SystemStatus;
