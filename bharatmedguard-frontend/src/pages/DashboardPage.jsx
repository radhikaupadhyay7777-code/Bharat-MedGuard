import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KpiCard from '../components/dashboard/KpiCard';
import CentralRiskScore from '../components/dashboard/CentralRiskScore';
import AnomalyStream from '../components/dashboard/AnomalyStream';
import { SYSTEM_METRICS, RISK_PILLARS, HOSPITALS } from '../services/mockData';
import { 
  Database, 
  ShieldAlert, 
  ReceiptText, 
  UserCheck, 
  FileCheck2, 
  ActivitySquare, 
  TrendingUp, 
  ArrowUpRight, 
  FileSearch, 
  PlusCircle, 
  Cpu, 
  Sparkles,
  Building2
} from 'lucide-react';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [metrics] = useState(SYSTEM_METRICS);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Healthcare Security Intelligence
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-sans">
            Real-time anomaly detection across India's healthcare ecosystem
          </p>
        </div>

        {/* Quick launch actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/investigations')}
            className="px-3.5 py-2 rounded-lg bg-bmg-royal hover:bg-bmg-royal/80 border border-bmg-cyan/40 text-white font-bold text-xs font-mono flex items-center gap-1.5 shadow-cyan-glow transition"
          >
            <FileSearch className="w-3.5 h-3.5 text-bmg-cyan" />
            Investigation Center
          </button>
          <button
            onClick={() => navigate('/ai/isolation-forest')}
            className="px-3.5 py-2 rounded-lg bg-bmg-midnight hover:bg-bmg-card border border-bmg-border text-slate-200 hover:text-white font-bold text-xs font-mono flex items-center gap-1.5 transition"
          >
            <Cpu className="w-3.5 h-3.5 text-bmg-cyan" />
            AI Anomaly Engine
          </button>
        </div>
      </div>

      {/* Six KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Total Records"
          value="12,482"
          change="+14.2%"
          changeType="increase"
          description="Analyzed across 5 hospital hubs"
          icon={Database}
          onClick={() => navigate('/audit-logs')}
        />
        <KpiCard
          title="High-Risk Cases"
          value="82"
          change="+8.5%"
          changeType="increase"
          description="Immediate triage required"
          icon={ShieldAlert}
          severity="critical"
          onClick={() => navigate('/investigations')}
        />
        <KpiCard
          title="Claims Anomalies"
          value="34"
          change="+12.0%"
          changeType="increase"
          description="Duplicates & tariff spikes"
          icon={ReceiptText}
          severity="high"
          onClick={() => navigate('/pipelines/claims')}
        />
        <KpiCard
          title="Identity Anomalies"
          value="21"
          change="-3.2%"
          changeType="decrease"
          description="Impossible travel & collisions"
          icon={UserCheck}
          severity="high"
          onClick={() => navigate('/pipelines/identity')}
        />
        <KpiCard
          title="Doc Anomalies"
          value="17"
          change="+5.1%"
          changeType="increase"
          description="OCR text vs claim mismatches"
          icon={FileCheck2}
          severity="medium"
          onClick={() => navigate('/pipelines/documents')}
        />
        <KpiCard
          title="Clinical Anomalies"
          value="10"
          change="0.0%"
          changeType="decrease"
          description="Unphysiological outliers"
          icon={ActivitySquare}
          severity="medium"
          onClick={() => navigate('/pipelines/clinical')}
        />
      </div>

      {/* Central Risk Intelligence Overview */}
      <CentralRiskScore
        score={metrics.overallRiskScore}
        status={metrics.riskStatus}
        pillars={RISK_PILLARS}
      />

      {/* Middle Grid: Anomaly Stream (8 cols) & Monitored Hospital Hubs (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <AnomalyStream />
        </div>

        {/* Hospital Hubs Trust & Anomaly Index */}
        <div className="lg:col-span-4 bmg-card p-5 border-bmg-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-bmg-border/60">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Building2 className="w-4 h-4 text-bmg-cyan" />
                Hospital Node Risk Index
              </h3>
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Real-time anomaly rate computed per healthcare facility
            </p>

            <div className="space-y-3 mt-4">
              {HOSPITALS.map((h) => (
                <div
                  key={h.id}
                  className="p-3 rounded-lg bg-bmg-midnight/80 border border-bmg-border hover:border-bmg-cyan/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[160px]">{h.name}</span>
                    <span className="text-xs font-mono font-bold text-orange-400">{h.anomalyRate}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>{h.city} • {h.totalClaims} Claims</span>
                    <span className="text-emerald-400">Trust: {h.trustScore}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-bmg-border/50 text-center">
            <button
              onClick={() => navigate('/reports')}
              className="text-xs font-bold text-bmg-cyan hover:underline font-mono"
            >
              View Full Hospital Benchmark Report →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
