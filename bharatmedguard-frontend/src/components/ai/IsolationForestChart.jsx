import React, { useState } from 'react';
import { ISOLATION_FOREST_POINTS } from '../../services/mockData';
import Badge from '../common/Badge';
import { 
  Cpu, 
  Sliders, 
  Zap, 
  HelpCircle, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  Play, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const IsolationForestChart = () => {
  const [contamination, setContamination] = useState(0.05);
  const [nEstimators, setNEstimators] = useState(100);
  const [selectedPoint, setSelectedPoint] = useState(ISOLATION_FOREST_POINTS.find(p => p.isAnomaly));
  const [showPartitions, setShowPartitions] = useState(true);
  const [isIterating, setIsIterating] = useState(false);

  const anomalies = ISOLATION_FOREST_POINTS.filter(p => p.isAnomaly);
  const normalPoints = ISOLATION_FOREST_POINTS.filter(p => !p.isAnomaly);

  const runReclustering = () => {
    setIsIterating(true);
    setTimeout(() => {
      setIsIterating(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Explanation Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Interactive 2D Scatter Isolation Visualization */}
        <div className="lg:col-span-8 bmg-card p-6 border-bmg-border flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-bmg-border/60">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-bmg-cyan" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    2D Multi-Feature Latent Space Partitioning
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Features: Normalized Financial Deviation vs Biometric Velocity
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPartitions(!showPartitions)}
                  className={`px-2.5 py-1 rounded text-xs font-mono border transition ${
                    showPartitions 
                      ? 'bg-bmg-royal text-white border-bmg-cyan/50' 
                      : 'bg-bmg-navy text-slate-400 border-bmg-border'
                  }`}
                >
                  {showPartitions ? 'Hide Tree Splits' : 'Show Tree Splits'}
                </button>
              </div>
            </div>

            {/* 2D Interactive Scatter SVG */}
            <div className="my-4 relative bg-bmg-navy/95 rounded-xl border border-bmg-border p-4 h-96 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 500 360">
                {/* Background Grid */}
                <defs>
                  <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1A3F70" strokeWidth="0.5" opacity="0.4" />
                  </pattern>
                </defs>
                <rect width="500" height="360" fill="url(#gridPattern)" />

                {/* Normal Cluster Background Density Halo */}
                <ellipse cx="180" cy="200" rx="110" ry="85" fill="#1261A0" opacity="0.12" />
                <ellipse cx="180" cy="200" rx="70" ry="50" fill="#22D3EE" opacity="0.1" />

                {/* Simulated iTree Partition Split Lines */}
                {showPartitions && (
                  <g className="transition-opacity duration-300">
                    <line x1="0" y1="120" x2="500" y2="120" stroke="#22D3EE" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                    <line x1="340" y1="0" x2="340" y2="360" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
                    <line x1="0" y1="260" x2="500" y2="260" stroke="#22D3EE" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                    <line x1="380" y1="0" x2="380" y2="360" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
                    <text x="345" y="25" fill="#EF4444" fontSize="9" fontFamily="monospace">Split 1: x &gt; 0.68</text>
                    <text x="385" y="45" fill="#EF4444" fontSize="9" fontFamily="monospace">Split 2: y &gt; 0.76 (ISOLATED!)</text>
                  </g>
                )}

                {/* Normal Data Points (Cyan/Blue Cluster) */}
                {normalPoints.map((p, i) => {
                  const cx = 50 + p.x * 320;
                  const cy = 60 + p.y * 240;
                  return (
                    <circle
                      key={p.id}
                      cx={cx}
                      cy={cy}
                      r="4"
                      fill="#2F80ED"
                      stroke="#22D3EE"
                      strokeWidth="0.8"
                      opacity="0.75"
                      className="cursor-pointer hover:r-6 hover:opacity-100 transition-all"
                      onClick={() => setSelectedPoint(p)}
                    />
                  );
                })}

                {/* Anomaly Data Points (Red Glowing Outliers) */}
                {anomalies.map((p, i) => {
                  const cx = 50 + p.x * 400;
                  const cy = 40 + p.y * 280;
                  const isSel = selectedPoint?.id === p.id;
                  return (
                    <g key={p.id} onClick={() => setSelectedPoint(p)} className="cursor-pointer group">
                      {/* Pulse Ring */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSel ? "16" : "12"}
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="1.5"
                        className="animate-ping opacity-40"
                      />
                      {/* Main Outlier Dot */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isSel ? "9" : "7"}
                        fill="#EF4444"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="filter drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] transition-all group-hover:scale-125"
                      />
                      <text
                        x={cx + 12}
                        y={cy + 4}
                        fill="#FCA5A5"
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {p.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Legend & Summary */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-2 border-t border-bmg-border/50 text-slate-300">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-bmg-cyan/80"></span>
                <span>Normal Cluster ({normalPoints.length} records, Path Length &gt; 10)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-red-400 font-bold">Isolated Anomalies ({anomalies.length} outliers, Path Length &lt; 4)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Hyperparameter Tuning & Point Inspector */}
        <div className="lg:col-span-4 bmg-card p-6 border-bmg-border flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-bmg-border/60">
              <Sliders className="w-5 h-5 text-bmg-cyan" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Model Hyperparameters
              </h3>
            </div>

            {/* Slider Controls */}
            <div className="space-y-4 mt-4">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>Contamination Rate (\gamma):</span>
                  <span className="text-bmg-cyan font-bold">{contamination}</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.15"
                  step="0.01"
                  value={contamination}
                  onChange={(e) => setContamination(Number(e.target.value))}
                  className="w-full accent-bmg-cyan cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>Number of Estimators (Trees):</span>
                  <span className="text-bmg-cyan font-bold">{nEstimators}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="25"
                  value={nEstimators}
                  onChange={(e) => setNEstimators(Number(e.target.value))}
                  className="w-full accent-bmg-cyan cursor-pointer"
                />
              </div>

              <button
                onClick={runReclustering}
                disabled={isIterating}
                className="w-full py-2 px-3 rounded-lg bg-bmg-royal/60 hover:bg-bmg-royal border border-bmg-cyan/40 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 transition"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isIterating ? 'animate-spin' : ''}`} />
                {isIterating ? 'Re-fitting Trees...' : 'Re-fit Isolation Trees'}
              </button>
            </div>

            {/* Selected Point Telemetry Box */}
            {selectedPoint && (
              <div className="mt-5 p-3.5 rounded-lg bg-bmg-navy border border-bmg-border space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{selectedPoint.label}</span>
                  <Badge 
                    severity={selectedPoint.isAnomaly ? 'critical' : 'verified'} 
                    text={selectedPoint.isAnomaly ? 'ANOMALY' : 'NORMAL'} 
                    size="xs" 
                  />
                </div>

                <div className="text-xs font-mono space-y-1 text-slate-300 pt-2 border-t border-bmg-border/50">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Claim/Record Value:</span>
                    <span className="text-white font-bold">{selectedPoint.claimAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Average Path Length:</span>
                    <span className={selectedPoint.isAnomaly ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                      {selectedPoint.isolationDepth} splits {selectedPoint.isAnomaly ? '(Few)' : '(Deep)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Isolation Score (s):</span>
                    <span className="text-orange-400 font-bold">{selectedPoint.anomalyScore}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 p-2.5 rounded bg-bmg-midnight border border-bmg-border text-[10px] text-slate-400 leading-relaxed font-sans">
            <strong>Algorithmic Principle:</strong> Anomalies have shorter path lengths $h(x)$ because their rare values require fewer random hyperplanes to isolate.
          </div>
        </div>
      </div>

      {/* Concept Comparison Cards: Normal Pattern vs Potential Anomaly */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-bmg-midnight border border-bmg-border space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase font-mono">
            <CheckCircle2 className="w-4 h-4" />
            Normal Pattern (Inlier Density)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Standard medical claims and records cluster tightly in feature space. In isolation trees, standard observations require deep recursive partitioning (10 to 18 splits) before being separated.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-bmg-midnight border border-red-500/40 space-y-1">
          <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase font-mono">
            <ShieldAlert className="w-4 h-4" />
            Potential Anomaly (Rapid Isolation)
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Anomalous cases—such as duplicate claim submissions, impossible location velocities, and contradictory OCR bills—sit far from dense clusters and are isolated in very few partition splits (2 to 4).
          </p>
        </div>
      </div>
    </div>
  );
};

export default IsolationForestChart;
