import React, { useState } from 'react';
import { SECURITY_ALERTS } from '../services/mockData';
import Badge from '../components/common/Badge';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Filter, 
  Search, 
  Lock, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const SecurityAlertsPage = () => {
  const [alerts, setAlerts] = useState(SECURITY_ALERTS);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [actionDone, setActionDone] = useState(null);

  const handleTriage = (id, actionName) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: actionName === 'CONTAIN' ? 'CONTAINED_BLOCKED' : 'RESOLVED_ACKNOWLEDGED' };
      }
      return a;
    }));
    setActionDone(`Alert ${id} triaged: Action ${actionName} applied.`);
    setTimeout(() => setActionDone(null), 4000);
  };

  const filteredAlerts = filterSeverity === 'ALL'
    ? alerts
    : alerts.filter(a => a.severity.toLowerCase() === filterSeverity.toLowerCase());

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-orange-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono">
              Security Alerts Center
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Prioritized cybersecurity event queue across API gateways, PACS storage, and OAuth authentication endpoints
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-bmg-midnight p-1 rounded-lg border border-bmg-border text-xs font-mono">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterSeverity(tab)}
              className={`px-3 py-1 rounded transition font-bold ${
                filterSeverity === tab
                  ? 'bg-bmg-royal text-white shadow-cyan-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'CRITICAL' ? '🔴 Critical' : tab === 'HIGH' ? '🟠 High' : tab === 'MEDIUM' ? '🟡 Med' : tab === 'LOW' ? '🟢 Low' : 'All Alerts'}
            </button>
          ))}
        </div>
      </div>

      {actionDone && (
        <div className="p-3.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between animate-fadeIn">
          <span>{actionDone}</span>
          <button onClick={() => setActionDone(null)}>✕</button>
        </div>
      )}

      {/* Alert Cards List */}
      <div className="space-y-4">
        {filteredAlerts.map((alt) => (
          <div
            key={alt.id}
            className="bmg-card p-6 border-bmg-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-bmg-cyan/50 transition"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-white">{alt.id}</span>
                <Badge severity={alt.severity} text={alt.severity} size="xs" />
                <span className="text-[10px] font-mono text-slate-400">• {alt.timestamp}</span>
                <span className="text-[10px] font-mono text-slate-400">• Source: <strong className="text-slate-300">{alt.source}</strong></span>
              </div>

              <h3 className="text-base font-bold text-white">{alt.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{alt.details}</p>

              <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                <span className="text-slate-400">Current Status:</span>
                <span className="text-bmg-cyan font-bold bg-bmg-navy px-2 py-0.5 rounded border border-bmg-border">
                  {alt.status}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-bmg-border/50">
              <button
                onClick={() => handleTriage(alt.id, 'CONTAIN')}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-mono transition"
              >
                Contain & Quarantine IP
              </button>
              <button
                onClick={() => handleTriage(alt.id, 'RESOLVE')}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-bmg-card hover:bg-bmg-midnight border border-bmg-border text-slate-200 hover:text-white font-bold text-xs font-mono transition"
              >
                Acknowledge & Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityAlertsPage;
