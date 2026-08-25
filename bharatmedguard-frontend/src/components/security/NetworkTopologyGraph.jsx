import React, { useState } from 'react';
import { 
  Network, 
  ShieldCheck, 
  Building2, 
  User, 
  Smartphone, 
  CreditCard, 
  ShieldAlert, 
  Zap, 
  Server,
  Activity
} from 'lucide-react';
import Badge from '../common/Badge';

export const NetworkTopologyGraph = () => {
  const [selectedNode, setSelectedNode] = useState(null);

  const nodes = [
    { id: 'core', name: 'BharatMedGuard Core', type: 'core', ip: '10.220.0.1', status: 'PROTECTED', latency: '2ms', load: '14%' },
    { id: 'hosp', name: 'Hospital EHR Hub (BharatCare)', type: 'hospital', ip: '10.14.22.8', status: 'ACTIVE', latency: '12ms', load: '62%' },
    { id: 'doc', name: 'Doctor Portal / E-Prescription', type: 'doctor', ip: '10.14.22.45', status: 'ACTIVE', latency: '18ms', load: '34%' },
    { id: 'pat', name: 'Patient ABDM Mobile App', type: 'patient', ip: '172.16.8.90', status: 'ACTIVE', latency: '45ms', load: '78%' },
    { id: 'ins', name: 'Insurance TPA Gateway', type: 'insurance', ip: '103.21.244.12', status: 'FLAGGED', latency: '85ms', load: '91%' }
  ];

  return (
    <div className="bmg-card p-6 border-bmg-border space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-bmg-border/60">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-bmg-cyan" />
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Healthcare Cyber Ecosystem Topology
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Hub-and-Spoke Encryption Architecture with Active Anomaly Filtering
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Threat Mitigation:</span>
          <Badge severity="verified" text="149 BLOCKED" size="xs" />
        </div>
      </div>

      {/* SVG Interactive Topology Diagram */}
      <div className="my-3 relative bg-bmg-navy/95 rounded-xl border border-bmg-border p-4 h-96 flex items-center justify-center overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 540 340">
          <defs>
            <linearGradient id="cyberLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1261A0" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="threatLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>

          {/* Connected Network Lines from Hospital to Other Nodes */}
          {/* Hospital to Core */}
          <line x1="270" y1="160" x2="270" y2="40" stroke="url(#cyberLine)" strokeWidth="3" className="animate-pulse" />
          {/* Hospital to Doctor */}
          <line x1="270" y1="160" x2="100" y2="160" stroke="url(#cyberLine)" strokeWidth="2" />
          {/* Hospital to Patient */}
          <line x1="270" y1="160" x2="440" y2="160" stroke="url(#cyberLine)" strokeWidth="2" />
          {/* Hospital to Insurance */}
          <line x1="270" y1="160" x2="270" y2="280" stroke="url(#threatLine)" strokeWidth="2.5" strokeDasharray="5 3" className="animate-pulse" />

          {/* Node: BharatMedGuard Cyber Core (Top) */}
          <g transform="translate(270, 40)" onClick={() => setSelectedNode(nodes[0])} className="cursor-pointer group">
            <circle r="28" fill="#0B2347" stroke="#22D3EE" strokeWidth="2.5" className="filter drop-shadow-[0_0_10px_rgba(34,211,238,0.6)] group-hover:scale-110 transition-transform" />
            <text y="-3" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">BharatMedGuard</text>
            <text y="9" textAnchor="middle" fill="#22D3EE" fontSize="7" fontFamily="monospace">Cyber Core</text>
          </g>

          {/* Node: Hospital EHR Hub (Center) */}
          <g transform="translate(270, 160)" onClick={() => setSelectedNode(nodes[1])} className="cursor-pointer group">
            <circle r="34" fill="#0B2347" stroke="#38BDF8" strokeWidth="2.5" className="filter drop-shadow-[0_0_8px_rgba(56,189,248,0.5)] group-hover:scale-110 transition-transform" />
            <text y="-5" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">Hospital</text>
            <text y="8" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="monospace">EHR Hub</text>
          </g>

          {/* Node: Doctor Portal (Left) */}
          <g transform="translate(100, 160)" onClick={() => setSelectedNode(nodes[2])} className="cursor-pointer group">
            <circle r="26" fill="#0B2347" stroke="#FF9933" strokeWidth="2" className="group-hover:scale-110 transition-transform" />
            <text y="-3" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">Doctor</text>
            <text y="9" textAnchor="middle" fill="#94A3B8" fontSize="7" fontFamily="monospace">Portal</text>
          </g>

          {/* Node: Patient App (Right) */}
          <g transform="translate(440, 160)" onClick={() => setSelectedNode(nodes[3])} className="cursor-pointer group">
            <circle r="26" fill="#0B2347" stroke="#22D3EE" strokeWidth="2" className="group-hover:scale-110 transition-transform" />
            <text y="-3" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">Patient</text>
            <text y="9" textAnchor="middle" fill="#94A3B8" fontSize="7" fontFamily="monospace">App / ABDM</text>
          </g>

          {/* Node: Insurance TPA Gateway (Bottom) */}
          <g transform="translate(270, 280)" onClick={() => setSelectedNode(nodes[4])} className="cursor-pointer group">
            <circle r="28" fill="#0B2347" stroke="#EF4444" strokeWidth="2.5" className="filter drop-shadow-[0_0_10px_rgba(239,68,68,0.6)] group-hover:scale-110 transition-transform" />
            <text y="-3" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">Insurance</text>
            <text y="9" textAnchor="middle" fill="#EF4444" fontSize="7" fontFamily="monospace">TPA Gateway ⚠️</text>
          </g>
        </svg>
      </div>

      {/* Selected Node Details Box */}
      {selectedNode ? (
        <div className="p-4 rounded-xl bg-bmg-navy border border-bmg-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs animate-fadeIn">
          <div>
            <span className="font-bold text-white text-sm">{selectedNode.name}</span>
            <p className="text-slate-400 text-[11px]">IP: {selectedNode.ip} • Status: {selectedNode.status}</p>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] text-slate-400 block">LATENCY</span>
              <span className="text-emerald-400 font-bold">{selectedNode.latency}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">SYSTEM LOAD</span>
              <span className="text-white font-bold">{selectedNode.load}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-xs font-mono text-slate-400 py-1">
          Click any topology node to inspect encryption tunnel latency and load metrics.
        </div>
      )}
    </div>
  );
};

export default NetworkTopologyGraph;
