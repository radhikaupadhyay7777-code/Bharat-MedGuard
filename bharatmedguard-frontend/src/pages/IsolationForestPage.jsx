import React from 'react';
import IsolationForestChart from '../components/ai/IsolationForestChart';
import { Cpu, Sparkles, BookOpen, Layers, ShieldCheck } from 'lucide-react';

export const IsolationForestPage = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-bmg-cyan" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono">
              AI Anomaly Detection Engine
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Unsupervised Isolation Forest architecture for multidimensional healthcare fraud & cyber threat detection
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-bmg-midnight px-3 py-1.5 rounded-lg border border-bmg-border">
          <span className="text-emerald-400 font-bold">100 Trees</span>
          <span>•</span>
          <span className="text-bmg-cyan">Subsample: 256</span>
          <span>•</span>
          <span className="text-orange-400">Contamination: 0.05</span>
        </div>
      </div>

      {/* Main Isolation Forest Visualizer */}
      <IsolationForestChart />

      {/* Mathematical & Algorithmic Notes */}
      <div className="bmg-card p-6 border-bmg-border space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-bmg-border/60">
          <BookOpen className="w-5 h-5 text-bmg-cyan" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            How BharatMedGuard Isolation Forest Works
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-lg bg-bmg-midnight border border-bmg-border space-y-1.5">
            <span className="font-bold text-white font-mono flex items-center gap-1.5">
              <span className="text-bmg-cyan">01.</span> Recursive Random Splits
            </span>
            <p className="leading-relaxed">
              The algorithm recursively selects random feature dimensions and random split values between the minimum and maximum of the dataset.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-bmg-midnight border border-bmg-border space-y-1.5">
            <span className="font-bold text-white font-mono flex items-center gap-1.5">
              <span className="text-bmg-cyan">02.</span> Path Length Isolation
            </span>
            <p className="leading-relaxed">
              Because anomalies have extreme values (e.g. 3.4x tariff or 770 km/h velocity), they are isolated near the root of the tree with very small path length $h(x)$.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-bmg-midnight border border-bmg-border space-y-1.5">
            <span className="font-bold text-white font-mono flex items-center gap-1.5">
              <span className="text-bmg-cyan">03.</span> Composite Risk Index
            </span>
            <p className="leading-relaxed">
              Path lengths are normalized across an ensemble of 100+ isolation trees to yield an anomaly score $s(x, n) \in [0, 1]$, translated to our 0–100 risk score.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IsolationForestPage;
