import React from 'react';
import { ShieldAlert, AlertTriangle, ArrowUpRight, CheckCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CentralRiskScore = ({ score = 72, maxScore = 100, status = "HIGH RISK", pillars = [] }) => {
  const navigate = useNavigate();

  // SVG Radial Gauge Calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / maxScore) * circumference;

  const defaultPillars = [
    { name: "Claims & Billing", score: 82, weight: "30%", color: "bg-red-500", border: "border-red-500", link: "/pipelines/claims", status: "Critical Anomaly Rate" },
    { name: "Patient & Identity", score: 68, weight: "25%", color: "bg-orange-500", border: "border-orange-500", link: "/pipelines/identity", status: "High Velocity Flags" },
    { name: "Medical Documents", score: 74, weight: "20%", color: "bg-orange-500", border: "border-orange-500", link: "/pipelines/documents", status: "OCR Mismatches Elevated" },
    { name: "Clinical Data", score: 52, weight: "15%", color: "bg-amber-500", border: "border-amber-500", link: "/pipelines/clinical", status: "Potential Outliers" },
    { name: "Network Security", score: 38, weight: "10%", color: "bg-emerald-500", border: "border-emerald-500", link: "/security/network", status: "Active Defence Active" },
  ];

  const activePillars = pillars.length > 0 ? pillars : defaultPillars;

  return (
    <div className="bmg-card p-6 border-bmg-border relative overflow-hidden">
      {/* Background cyber pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-bmg-cyan/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-bmg-border/60">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              BharatMedGuard Risk Intelligence
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Multi-domain isolation forest and biometric entropy heuristic aggregation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Confidence:</span>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            99.4%
          </span>
        </div>
      </div>

      {/* Main Grid: Radial Gauge on Left, 5-Pillar Breakdown on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
        {/* Radial Risk Score Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-bmg-midnight/80 rounded-xl border border-bmg-border relative">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG Circle Gauge */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Animated Progress Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-orange-500 transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))'
                }}
              />
            </svg>

            {/* Inner Center Text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
                {score}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">OUT OF {maxScore}</span>
              <span className="mt-1 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-orange-950/90 text-orange-400 border border-orange-500/40">
                {status}
              </span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <p className="text-xs text-slate-300 font-medium">Composite Threat Index</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Flagged across 4 Anomaly Pipelines & Network Layer
            </p>
          </div>
        </div>

        {/* 5 Pillar Enterprise Breakdown Bars */}
        <div className="lg:col-span-8 space-y-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-1 border-b border-bmg-border/40">
            <span>ANOMALY / DEFENCE DOMAIN</span>
            <span>DOMAIN SCORE & STATUS</span>
          </div>

          {activePillars.map((p, idx) => {
            return (
              <div
                key={idx}
                onClick={() => p.link && navigate(p.link)}
                className="group p-2.5 rounded-lg bg-bmg-midnight/50 hover:bg-bmg-card border border-bmg-border hover:border-bmg-cyan/50 transition cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 group-hover:text-bmg-cyan transition">
                      {p.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-bmg-navy px-1.5 py-0.2 rounded border border-bmg-border">
                      Weight {p.weight}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                      {p.status}
                    </span>
                    <span className="font-mono font-bold text-xs text-white">
                      {p.score} / 100
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-bmg-cyan transition" />
                  </div>
                </div>

                {/* Progress Bar with Enterprise Matrix Styling */}
                <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      p.score > 80
                        ? 'bg-red-500 shadow-sm shadow-red-500/50'
                        : p.score > 60
                        ? 'bg-orange-500'
                        : p.score > 40
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${p.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CentralRiskScore;
