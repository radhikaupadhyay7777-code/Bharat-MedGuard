import React, { useState } from 'react';
import { CLAIMS_DATA } from '../../services/mockData';
import Badge from '../common/Badge';
import { 
  ShieldAlert, 
  Receipt, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Building2, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  PlayCircle,
  HelpCircle
} from 'lucide-react';

export const ClaimsInspector = ({ onOpenCaseDetail }) => {
  const [selectedClaim, setSelectedClaim] = useState(CLAIMS_DATA[0]); // Claim BM-1024
  const [simulatedAmount, setSimulatedAmount] = useState('340000');
  const [simulatedProcedure, setSimulatedProcedure] = useState('Coronary Angioplasty + 2 Stents');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);

  const handleSimulate = (e) => {
    e.preventDefault();
    setIsSimulating(true);
    setTimeout(() => {
      const amount = Number(simulatedAmount) || 100000;
      const baseline = 100000;
      const ratio = (amount / baseline).toFixed(1);
      const isOutlier = amount > 250000;

      setSimResult({
        claimId: 'BM-SIM-' + Math.floor(100 + Math.random() * 900),
        amount,
        ratio: `${ratio}x`,
        riskScore: isOutlier ? 89 : 24,
        severity: isOutlier ? 'CRITICAL' : 'LOW',
        flags: isOutlier ? [
          `Claim amount exceeds baseline by ${((ratio - 1) * 100).toFixed(0)}%`,
          'Isolation Forest flagged extreme multi-dimensional distance (z-score > 3.2)'
        ] : ['Claim pricing falls within normal 95% confidence interval for selected procedure.']
      });
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Section: Active Flagged Claim Deep Dive (BM-1024) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Claim Details & Anomaly Signals */}
        <div className="lg:col-span-7 bmg-card p-6 border-bmg-border flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-bmg-border/60">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-white">
                      Claim {selectedClaim.id}
                    </h3>
                    <Badge severity={selectedClaim.severity} text={selectedClaim.severity} />
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Ref: {selectedClaim.claimNumber} • {selectedClaim.submissionDate}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">RISK SCORE</span>
                <span className="text-2xl font-black font-mono text-red-400">
                  {selectedClaim.riskScore} <span className="text-xs text-slate-500">/ 100</span>
                </span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              <div className="p-2.5 rounded-lg bg-bmg-midnight border border-bmg-border">
                <span className="text-[10px] text-slate-400 block font-mono">CLAIMED AMT</span>
                <span className="text-sm font-bold text-white font-mono">
                  ₹ {selectedClaim.claimedAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-bmg-midnight border border-bmg-border">
                <span className="text-[10px] text-slate-400 block font-mono">BENCHMARK</span>
                <span className="text-sm font-bold text-slate-300 font-mono">
                  ₹ {selectedClaim.benchmarkAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-bmg-midnight border border-bmg-border">
                <span className="text-[10px] text-slate-400 block font-mono">DEVIATION</span>
                <span className="text-sm font-extrabold text-red-400 font-mono">
                  {selectedClaim.deviationRatio}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-bmg-midnight border border-bmg-border">
                <span className="text-[10px] text-slate-400 block font-mono">HOSPITAL</span>
                <span className="text-xs font-bold text-white truncate block">
                  {selectedClaim.hospitalName.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Detected Anomaly Signals */}
            <div className="space-y-2 mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                Detected Anomaly Signals (5 Flag Heuristics)
              </h4>
              
              <div className="space-y-1.5">
                {selectedClaim.anomalyFlags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex items-start gap-2"
                  >
                    <span className="text-red-400 font-bold font-mono text-[11px] mt-0.5">✕</span>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Explanation Callout */}
          <div className="mt-4 p-3 rounded-lg bg-bmg-navy/80 border border-bmg-border text-xs">
            <p className="font-bold text-bmg-cyan mb-1 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> AI Evidence Summary
            </p>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {selectedClaim.evidence.aiExplanation}
            </p>
          </div>
        </div>

        {/* Right 5 Cols: Interactive Claim Anomaly Simulator Sandbox */}
        <div className="lg:col-span-5 bmg-card p-6 border-bmg-border flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-bmg-border/60">
              <PlayCircle className="w-5 h-5 text-bmg-cyan" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Claims Isolation Simulator
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Test how new or modified claim parameters trigger automated Isolation Forest anomaly detection.
            </p>

            <form onSubmit={handleSimulate} className="space-y-3 mt-4">
              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">
                  Procedure / Medical Package
                </label>
                <select
                  value={simulatedProcedure}
                  onChange={(e) => setSimulatedProcedure(e.target.value)}
                  className="w-full bg-bmg-navy border border-bmg-border rounded-lg p-2 text-xs text-white focus:outline-none focus:border-bmg-cyan"
                >
                  <option>Coronary Angioplasty + 2 Stents (Tariff: ₹1,00,000)</option>
                  <option>Knee Arthroscopy (Tariff: ₹80,000)</option>
                  <option>Cholecystectomy Laparoscopic (Tariff: ₹1,40,000)</option>
                  <option>Complex Craniotomy (Tariff: ₹2,50,000)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">
                  Submitted Claim Amount (₹ INR)
                </label>
                <input
                  type="number"
                  value={simulatedAmount}
                  onChange={(e) => setSimulatedAmount(e.target.value)}
                  className="w-full bg-bmg-navy border border-bmg-border rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-bmg-cyan"
                  placeholder="e.g. 340000"
                />
              </div>

              <button
                type="submit"
                disabled={isSimulating}
                className="w-full py-2 px-4 rounded-lg bg-bmg-royal hover:bg-bmg-royal/80 border border-bmg-cyan/40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-cyan-glow transition"
              >
                {isSimulating ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Running Isolation Forest...
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4 text-bmg-cyan" />
                    Run Real-time Claim Inference
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Simulation Output Card */}
          {simResult && (
            <div className="mt-4 p-3.5 rounded-lg bg-bmg-navy border border-bmg-border animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono">{simResult.claimId}</span>
                <Badge severity={simResult.severity} text={simResult.severity} size="xs" />
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-bmg-border/50 text-xs font-mono">
                <span className="text-slate-400">Calculated Deviation: {simResult.ratio}</span>
                <span className="font-bold text-orange-400">Risk: {simResult.riskScore}/100</span>
              </div>
              <div className="mt-2 space-y-1">
                {simResult.flags.map((f, i) => (
                  <p key={i} className="text-[11px] text-slate-300">• {f}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: All Monitored Claims Queue Table */}
      <div className="bmg-card p-5 border-bmg-border">
        <div className="flex items-center justify-between pb-3 border-b border-bmg-border/60">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Monitored Claims Queue ({CLAIMS_DATA.length} Active Records)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Real-time Stream</span>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-bmg-border text-slate-400 text-[10px] uppercase">
                <th className="pb-2">Claim ID</th>
                <th className="pb-2">Patient</th>
                <th className="pb-2">Hospital</th>
                <th className="pb-2">Procedure</th>
                <th className="pb-2">Claimed</th>
                <th className="pb-2">Deviation</th>
                <th className="pb-2">Risk</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bmg-border/40 text-slate-200">
              {CLAIMS_DATA.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedClaim(c)}
                  className={`hover:bg-bmg-card transition cursor-pointer ${
                    selectedClaim.id === c.id ? 'bg-bmg-royal/20 border-l-2 border-bmg-cyan' : ''
                  }`}
                >
                  <td className="py-3 font-bold text-white flex items-center gap-1.5">
                    {c.id}
                  </td>
                  <td className="py-3 text-slate-300">{c.patientName}</td>
                  <td className="py-3 text-slate-400 truncate max-w-[140px]">{c.hospitalName}</td>
                  <td className="py-3 text-slate-300 truncate max-w-[180px]">{c.procedure}</td>
                  <td className="py-3 text-white font-bold">₹ {c.claimedAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3 font-bold text-orange-400">{c.deviationRatio}</td>
                  <td className="py-3">
                    <span className="font-extrabold text-red-400">{c.riskScore}/100</span>
                  </td>
                  <td className="py-3">
                    <Badge severity={c.severity} text={c.severity} size="xs" />
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

export default ClaimsInspector;
