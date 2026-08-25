import React, { useState } from 'react';
import { PATIENTS_IDENTITY_DATA } from '../../services/mockData';
import Badge from '../common/Badge';
import { 
  UserCheck, 
  MapPin, 
  Clock, 
  Building, 
  AlertOctagon, 
  Zap, 
  ShieldAlert, 
  Fingerprint, 
  Activity, 
  Compass
} from 'lucide-react';

export const IdentityNetworkGraph = () => {
  const [selectedPatient, setSelectedPatient] = useState(PATIENTS_IDENTITY_DATA[0]); // Patient P-102
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div className="space-y-6">
      {/* Top Grid: Interactive SVG Graph on Left (7 cols), Entity Velocity Telemetry on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Interactive SVG Graph */}
        <div className="lg:col-span-7 bmg-card p-6 border-bmg-border flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-bmg-border/60">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Biometric Entity & Geolocation Graph
                </h3>
              </div>
              <Badge severity={selectedPatient.severity} text={selectedPatient.anomalyType} />
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Visualizing cross-hospital concurrent admissions and impossible velocity travel vectors for ABHA ID: <span className="text-bmg-cyan font-mono">{selectedPatient.abhaId}</span>
            </p>

            {/* Interactive SVG Node Diagram */}
            <div className="my-4 relative bg-bmg-navy/90 rounded-xl border border-bmg-border p-4 h-80 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 500 300">
                <defs>
                  {/* Glowing line gradient */}
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Background Grid Lines */}
                <circle cx="250" cy="80" r="140" fill="none" stroke="#1A3F70" strokeDasharray="4 4" opacity="0.4" />
                <circle cx="250" cy="80" r="80" fill="none" stroke="#1A3F70" strokeDasharray="2 2" opacity="0.3" />

                {/* Connecting Threat Velocity Vectors */}
                {/* Center to Hospital A (Delhi) */}
                <line x1="250" y1="80" x2="100" y2="220" stroke="url(#lineGrad)" strokeWidth="2.5" strokeDasharray="6 3" className="animate-pulse" />
                {/* Center to Hospital B (Bengaluru) */}
                <line x1="250" y1="80" x2="250" y2="240" stroke="url(#lineGrad)" strokeWidth="3" />
                {/* Center to Hospital C (Mumbai) */}
                <line x1="250" y1="80" x2="400" y2="220" stroke="url(#lineGrad)" strokeWidth="2.5" strokeDasharray="6 3" className="animate-pulse" />

                {/* Vector Labels */}
                <text x="140" y="145" fill="#F97316" fontSize="9" fontFamily="monospace" fontWeight="bold">1,740 km (135m)</text>
                <text x="255" y="170" fill="#EF4444" fontSize="9" fontFamily="monospace" fontWeight="bold">773 km/h ⚠️</text>
                <text x="325" y="145" fill="#F97316" fontSize="9" fontFamily="monospace" fontWeight="bold">Concurrent ER</text>

                {/* Central Patient Node */}
                <g 
                  transform="translate(250, 80)"
                  onClick={() => setSelectedNode('patient')}
                  className="cursor-pointer group"
                >
                  <circle r="32" fill="#0B2347" stroke="#22D3EE" strokeWidth="2.5" className="filter drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                  <circle r="26" fill="#1261A0" opacity="0.4" />
                  <text y="-5" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">P-102</text>
                  <text y="10" textAnchor="middle" fill="#22D3EE" fontSize="8" fontFamily="monospace">Aarav S.</text>
                </g>

                {/* Hospital A Node (New Delhi) */}
                <g 
                  transform="translate(100, 220)"
                  onClick={() => setSelectedNode('hospA')}
                  className="cursor-pointer group"
                >
                  <circle r="24" fill="#0B2347" stroke="#FF9933" strokeWidth="2" />
                  <text y="-3" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">Hosp A</text>
                  <text y="9" textAnchor="middle" fill="#94A3B8" fontSize="7" fontFamily="monospace">Delhi 10:15</text>
                </g>

                {/* Hospital B Node (Bengaluru) */}
                <g 
                  transform="translate(250, 240)"
                  onClick={() => setSelectedNode('hospB')}
                  className="cursor-pointer group"
                >
                  <circle r="24" fill="#0B2347" stroke="#EF4444" strokeWidth="2.5" className="filter drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
                  <text y="-3" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">Hosp B</text>
                  <text y="9" textAnchor="middle" fill="#EF4444" fontSize="7" fontFamily="monospace">BLR 12:30</text>
                </g>

                {/* Hospital C Node (Mumbai) */}
                <g 
                  transform="translate(400, 220)"
                  onClick={() => setSelectedNode('hospC')}
                  className="cursor-pointer group"
                >
                  <circle r="24" fill="#0B2347" stroke="#FF9933" strokeWidth="2" />
                  <text y="-3" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">Hosp C</text>
                  <text y="9" textAnchor="middle" fill="#94A3B8" fontSize="7" fontFamily="monospace">MUM 14:00</text>
                </g>
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2 border-t border-bmg-border/50">
            <span>● Click node for telemetry</span>
            <span className="text-orange-400 font-bold">3 Hospital Nodes Connected</span>
          </div>
        </div>

        {/* Right 5 Cols: Velocity Vector & Geolocation Analysis */}
        <div className="lg:col-span-5 bmg-card p-6 border-bmg-border flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-bmg-border/60">
              <Compass className="w-5 h-5 text-bmg-cyan" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Velocity & Entropy Telemetry
              </h3>
            </div>

            {/* Metrics */}
            <div className="space-y-3 mt-4">
              <div className="p-3 rounded-lg bg-bmg-navy border border-bmg-border">
                <span className="text-[10px] text-slate-400 font-mono block">GEO-DISTANCE DELTA</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-base font-bold text-white font-mono">1,740 km</span>
                  <span className="text-xs text-slate-300 font-mono">Delhi ⇄ Bengaluru</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-bmg-navy border border-bmg-border">
                <span className="text-[10px] text-slate-400 font-mono block">TIME ELAPSED</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-base font-bold text-white font-mono">135 Minutes</span>
                  <span className="text-xs text-orange-400 font-mono">2h 15m Window</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40">
                <span className="text-[10px] text-red-300 font-mono block uppercase font-bold">REQUIRED VELOCITY</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xl font-extrabold text-red-400 font-mono">773.3 km/h</span>
                  <Badge severity="critical" text="IMPOSSIBLE TRAVEL" size="xs" />
                </div>
              </div>
            </div>

            {/* Anomaly Heuristic Findings */}
            <div className="mt-4 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-300 font-mono block uppercase">
                Identity Anomaly Heuristics
              </span>
              {selectedPatient.flags.map((flag, idx) => (
                <div key={idx} className="p-2 rounded bg-bmg-midnight/80 border border-bmg-border text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-orange-400 font-bold font-mono">⚠</span>
                  <span>{flag}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded bg-bmg-navy border border-bmg-border text-[11px] font-mono text-slate-400">
            Biometric Hash: <span className="text-slate-300 truncate block">{selectedPatient.aadhaarHash.slice(0, 32)}...</span>
          </div>
        </div>
      </div>

      {/* Bottom: Patient Profiles Table */}
      <div className="bmg-card p-5 border-bmg-border">
        <div className="flex items-center justify-between pb-3 border-b border-bmg-border/60">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Identity Anomaly Registry ({PATIENTS_IDENTITY_DATA.length} Flagged Entities)
          </h3>
          <span className="text-xs text-slate-400 font-mono">ABDM Entity Matching Engine</span>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-bmg-border text-slate-400 text-[10px] uppercase">
                <th className="pb-2">Patient ID</th>
                <th className="pb-2">Name</th>
                <th className="pb-2">ABHA ID</th>
                <th className="pb-2">Primary City</th>
                <th className="pb-2">Anomaly Pattern</th>
                <th className="pb-2">Risk</th>
                <th className="pb-2">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bmg-border/40 text-slate-200">
              {PATIENTS_IDENTITY_DATA.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  className={`hover:bg-bmg-card transition cursor-pointer ${
                    selectedPatient.id === p.id ? 'bg-bmg-royal/20 border-l-2 border-bmg-cyan' : ''
                  }`}
                >
                  <td className="py-3 font-bold text-white">{p.id}</td>
                  <td className="py-3 text-slate-200 font-sans font-semibold">{p.name}</td>
                  <td className="py-3 text-bmg-cyan">{p.abhaId}</td>
                  <td className="py-3 text-slate-400">{p.primaryLocation}</td>
                  <td className="py-3 text-orange-300 max-w-[200px] truncate">{p.anomalyType}</td>
                  <td className="py-3 font-extrabold text-orange-400">{p.riskScore}/100</td>
                  <td className="py-3">
                    <Badge severity={p.severity} text={p.severity} size="xs" />
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

export default IdentityNetworkGraph;
