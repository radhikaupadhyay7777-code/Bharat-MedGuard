import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { HOSPITALS } from '../services/mockData';
import { 
  BarChart3, 
  Download, 
  FileText, 
  TrendingUp, 
  Building2, 
  CheckCircle2, 
  Calendar, 
  PieChart, 
  Layers,
  Sparkles
} from 'lucide-react';
import Badge from '../components/common/Badge';

export const ReportsPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('AUG_2026');

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setReportReady(false);
    setTimeout(() => {
      setIsGenerating(false);
      setReportReady(true);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }, 1500);
  };

  const categoryBreakdown = [
    { category: "Claims & Billing", count: 34, percentage: 41.5, color: "bg-red-500", border: "border-red-500" },
    { category: "Patient & Identity", count: 21, percentage: 25.6, color: "bg-orange-500", border: "border-orange-500" },
    { category: "Medical Documents", count: 17, percentage: 20.7, color: "bg-cyan-500", border: "border-cyan-500" },
    { category: "Clinical Data", count: 10, percentage: 12.2, color: "bg-amber-500", border: "border-amber-500" }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title & Generate Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-bmg-cyan" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono">
              Healthcare Risk & Threat Intelligence Reports
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Aggregated analytical insights across claims volume, entity velocity, OCR fidelity, and hospital compliance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-bmg-midnight border border-bmg-border rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-bmg-cyan"
          >
            <option value="AUG_2026">August 2026 (Current Cycle)</option>
            <option value="JUL_2026">July 2026</option>
            <option value="Q2_2026">Q2 2026 Comprehensive</option>
          </select>

          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="px-4 py-2 rounded-lg bg-bmg-royal hover:bg-bmg-royal/80 border border-bmg-cyan/40 text-white font-bold text-xs font-mono flex items-center gap-2 shadow-cyan-glow transition"
          >
            {isGenerating ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Compiling Report Metrics...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-bmg-cyan" />
                Generate Comprehensive Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Report Success Card */}
      {reportReady && (
        <div className="p-5 rounded-xl bg-bmg-midnight border border-emerald-500/50 shadow-green-glow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-white font-mono">
                BharatMedGuard Intelligence Report (August 2026 Cycle) Ready
              </h4>
            </div>
            <p className="text-xs text-slate-300">
              Analysis completed for 12,482 records across 5 hospital hubs. 82 high-risk anomalies synthesized with full provenance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert("Report downloaded as encrypted JSON/PDF format.")}
              className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs font-mono flex items-center gap-2 transition"
            >
              <Download className="w-3.5 h-3.5" /> Download Executive PDF
            </button>
          </div>
        </div>
      )}

      {/* Category Breakdown & Trend Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Anomalies by Category */}
        <div className="lg:col-span-6 bmg-card p-6 border-bmg-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-bmg-border/60">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <PieChart className="w-4 h-4 text-bmg-cyan" />
              Anomalies by Category (82 Total Flags)
            </h3>
          </div>

          <div className="space-y-4 my-2">
            {categoryBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">{item.category}</span>
                  <span className="text-white font-bold">{item.count} cases ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-bmg-border/50 text-[11px] text-slate-400 font-mono">
            Claims & Billing represents largest financial risk surface (₹1.48 Cr cumulative flag value).
          </div>
        </div>

        {/* Right 6 Cols: Hospital Compliance & Risk Benchmarks */}
        <div className="lg:col-span-6 bmg-card p-6 border-bmg-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-bmg-border/60">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Building2 className="w-4 h-4 text-orange-400" />
              Hospital Network Anomaly Benchmarks
            </h3>
          </div>

          <div className="space-y-3">
            {HOSPITALS.map((h) => (
              <div key={h.id} className="p-2.5 rounded-lg bg-bmg-navy border border-bmg-border flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="font-bold text-white block">{h.name}</span>
                  <span className="text-[10px] text-slate-400">{h.city} • {h.totalClaims} Claims Ingested</span>
                </div>
                <div className="text-right">
                  <span className="text-orange-400 font-extrabold block">{h.anomalyRate}</span>
                  <span className="text-[10px] text-emerald-400">Trust: {h.trustScore}/100</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-bmg-border/50 text-[11px] text-slate-400 font-mono">
            Regional threshold trigger: &gt; 3.0% anomaly rate automatically initiates clinical sample audit.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
