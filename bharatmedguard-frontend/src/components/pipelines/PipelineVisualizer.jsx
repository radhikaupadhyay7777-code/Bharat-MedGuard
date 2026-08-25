import React, { useState } from 'react';
import { ChevronRight, CheckCircle2, AlertTriangle, ArrowRight, Zap, Info } from 'lucide-react';

export const PipelineVisualizer = ({ 
  title, 
  stages = [], 
  currentStageIndex = 6, 
  activeCaseId = "BM-1024",
  onSelectStage,
  subtitle = "End-to-end automated inference pipeline"
}) => {
  const [selectedStage, setSelectedStage] = useState(stages[currentStageIndex] || stages[0]);

  const handleStageClick = (stage, index) => {
    setSelectedStage(stage);
    if (onSelectStage) onSelectStage(stage, index);
  };

  return (
    <div className="bmg-card p-5 border-bmg-border relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-bmg-cyan to-transparent opacity-60"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-bmg-border/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-bmg-cyan animate-ping"></span>
            <h3 className="text-base font-bold text-white tracking-wide">{title}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Processing Target:</span>
          <span className="px-2 py-0.5 rounded bg-bmg-navy border border-bmg-cyan/40 text-bmg-cyan font-bold">
            {activeCaseId}
          </span>
        </div>
      </div>

      {/* Connected Nodes Pipeline Layout */}
      <div className="my-6 overflow-x-auto pb-2">
        <div className="flex items-center min-w-[760px] justify-between relative px-2">
          {/* Animated Connecting Line */}
          <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-slate-800 -translate-y-1/2 z-0">
            <div className="h-full bg-gradient-to-r from-bmg-royal via-bmg-cyan to-orange-500 w-full animate-pulse opacity-70"></div>
          </div>

          {stages.map((stage, idx) => {
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isSelected = selectedStage?.name === stage.name;
            const Icon = stage.icon || CheckCircle2;

            return (
              <div
                key={idx}
                onClick={() => handleStageClick(stage, idx)}
                className="relative z-10 flex flex-col items-center group cursor-pointer"
              >
                {/* Node Circle */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 transform ${
                    isSelected
                      ? 'bg-bmg-cyan text-bmg-navy shadow-cyan-glow scale-110 ring-2 ring-white ring-offset-2 ring-offset-bmg-navy'
                      : isCurrent
                      ? 'bg-bmg-card text-bmg-cyan border-2 border-bmg-cyan shadow-cyan-glow animate-pulse'
                      : isCompleted
                      ? 'bg-bmg-midnight text-emerald-400 border border-emerald-500/50 hover:border-bmg-cyan hover:scale-105'
                      : 'bg-bmg-navy text-slate-500 border border-bmg-border'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Node Label */}
                <div className="mt-2.5 text-center max-w-[95px]">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block font-mono ${
                    isSelected ? 'text-bmg-cyan' : isCompleted ? 'text-slate-200' : 'text-slate-500'
                  }`}>
                    {stage.name}
                  </span>
                  <span className="text-[9px] text-slate-400 block truncate">
                    {stage.latency || `Stage 0${idx + 1}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Telemetry Detail Panel */}
      {selectedStage && (
        <div className="mt-4 p-4 rounded-xl bg-bmg-midnight/90 border border-bmg-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-bmg-cyan" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                {selectedStage.name} — Execution Details
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                {selectedStage.status || 'PASS'}
              </span>
            </div>
            <p className="text-xs text-slate-300">{selectedStage.description}</p>
            {selectedStage.telemetry && (
              <p className="text-[11px] font-mono text-bmg-cyan">
                {selectedStage.telemetry}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 bg-bmg-navy/80 p-2.5 rounded-lg border border-bmg-border shrink-0 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block">EXECUTION TIME</span>
              <span className="text-white font-bold">{selectedStage.time || '18ms'}</span>
            </div>
            <div className="h-6 w-px bg-bmg-border"></div>
            <div>
              <span className="text-[10px] text-slate-400 block">CONFIDENCE</span>
              <span className="text-emerald-400 font-bold">{selectedStage.confidence || '99.2%'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PipelineVisualizer;
