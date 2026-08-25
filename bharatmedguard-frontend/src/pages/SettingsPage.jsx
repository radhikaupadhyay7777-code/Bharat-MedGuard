import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Settings, 
  User, 
  ShieldCheck, 
  Key, 
  Sliders, 
  Server, 
  CheckCircle2, 
  Lock,
  Sparkles,
  Save
} from 'lucide-react';
import Badge from '../components/common/Badge';

export const SettingsPage = () => {
  const { user, switchRole } = useAuth();
  const [contaminationRate, setContaminationRate] = useState(0.05);
  const [tariffThreshold, setTariffThreshold] = useState(1.8);
  const [geoVelocityMax, setGeoVelocityMax] = useState(450);
  const [apiUrl, setApiUrl] = useState('http://localhost:8000/api/v1');
  const [savedMessage, setSavedMessage] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage('Configuration updated successfully in KMS security vault.');
    setTimeout(() => setSavedMessage(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-bmg-cyan" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono">
              System Settings & RBAC Profile
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Manage investigator identity, role permissions, Isolation Forest hyperparameters, and FastAPI endpoints
          </p>
        </div>
      </div>

      {savedMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between animate-fadeIn">
          <span>{savedMessage}</span>
          <button onClick={() => setSavedMessage(null)}>✕</button>
        </div>
      )}

      {/* Grid: User Profile on Left, RBAC Matrix on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* User Profile Card (5 Cols) */}
        <div className="md:col-span-5 bmg-card p-6 border-bmg-border space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-bmg-royal to-bmg-cyan flex items-center justify-center text-white font-extrabold text-lg border border-white/20 shadow-cyan-glow">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">{user.name}</h3>
              <p className="text-xs text-bmg-cyan font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {user.role}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">Badge: {user.badgeId}</span>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-bmg-border/50 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block">OFFICIAL EMAIL</span>
              <span className="text-slate-200">{user.email}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">DEPARTMENT</span>
              <span className="text-slate-200">{user.department}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">SECURITY CLEARANCE</span>
              <span className="text-emerald-400 font-bold">LEVEL-4 (NATIONAL SHIELD)</span>
            </div>
          </div>

          {/* Quick Role Switcher for Demo */}
          <div className="pt-3 border-t border-bmg-border/50">
            <label className="text-[10px] font-mono text-slate-400 block uppercase mb-1.5 font-bold">
              Switch Active Demo Role:
            </label>
            <div className="grid grid-cols-1 gap-1.5 font-mono text-xs">
              <button
                onClick={() => switchRole('investigator')}
                className={`py-1.5 px-2.5 rounded text-left transition ${
                  user.role === 'Security Investigator' ? 'bg-bmg-royal text-white font-bold' : 'bg-bmg-navy text-slate-300 hover:bg-bmg-card'
                }`}
              >
                🛡️ Security Investigator (Default)
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`py-1.5 px-2.5 rounded text-left transition ${
                  user.role === 'System Administrator' ? 'bg-bmg-royal text-white font-bold' : 'bg-bmg-navy text-slate-300 hover:bg-bmg-card'
                }`}
              >
                ⚙️ System Administrator
              </button>
              <button
                onClick={() => switchRole('auditor')}
                className={`py-1.5 px-2.5 rounded text-left transition ${
                  user.role === 'Clinical Auditor' ? 'bg-bmg-royal text-white font-bold' : 'bg-bmg-navy text-slate-300 hover:bg-bmg-card'
                }`}
              >
                🩺 Clinical Auditor
              </button>
            </div>
          </div>
        </div>

        {/* RBAC Permission Matrix (7 Cols) */}
        <div className="md:col-span-7 bmg-card p-6 border-bmg-border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-bmg-border/60">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Lock className="w-4 h-4 text-bmg-cyan" />
              Role-Based Access Control (RBAC) Matrix
            </h3>
          </div>

          <p className="text-xs text-slate-300 font-sans">
            Explicit access control privileges enforced by BharatMedGuard API middleware and UI route guards.
          </p>

          <div className="space-y-2 mt-2 font-mono text-xs">
            {user.permissions.map((p, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-bmg-navy border border-bmg-border flex items-center justify-between"
              >
                <span className="text-slate-200">{p.name}</span>
                {p.granted ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                    ✓ GRANTED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-red-400 font-bold">
                    ✕ RESTRICTED
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Anomaly Sensitivity Thresholds */}
      <div className="bmg-card p-6 border-bmg-border space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-bmg-border/60">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Sliders className="w-4 h-4 text-orange-400" />
            Detection Sensitivity & Threshold Parameters
          </h3>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          <div>
            <label className="text-slate-300 block mb-1">
              Tariff Anomaly Trigger Multiplier: <strong className="text-bmg-cyan">{tariffThreshold}x</strong>
            </label>
            <input
              type="number"
              step="0.1"
              value={tariffThreshold}
              onChange={(e) => setTariffThreshold(Number(e.target.value))}
              className="w-full bg-bmg-navy border border-bmg-border rounded-lg p-2 text-white focus:outline-none focus:border-bmg-cyan"
            />
          </div>

          <div>
            <label className="text-slate-300 block mb-1">
              Max Impossible Geolocation Velocity: <strong className="text-bmg-cyan">{geoVelocityMax} km/h</strong>
            </label>
            <input
              type="number"
              value={geoVelocityMax}
              onChange={(e) => setGeoVelocityMax(Number(e.target.value))}
              className="w-full bg-bmg-navy border border-bmg-border rounded-lg p-2 text-white focus:outline-none focus:border-bmg-cyan"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-slate-300 block mb-1">
              FastAPI Endpoint Base URL (Backend Target):
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full bg-bmg-navy border border-bmg-border rounded-lg p-2 text-white focus:outline-none focus:border-bmg-cyan"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-bmg-royal hover:bg-bmg-royal/80 border border-bmg-cyan/40 text-white font-bold text-xs font-mono flex items-center gap-2 shadow-cyan-glow transition"
            >
              <Save className="w-4 h-4 text-bmg-cyan" /> Save Configuration Parameters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
