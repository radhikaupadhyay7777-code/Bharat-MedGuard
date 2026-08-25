import React from 'react';
import NetworkTopologyGraph from '../components/security/NetworkTopologyGraph';
import ScapyPacketStream from '../components/security/ScapyPacketStream';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Network, 
  Activity, 
  Lock, 
  KeyRound, 
  Globe, 
  Server,
  Zap
} from 'lucide-react';
import KpiCard from '../components/dashboard/KpiCard';

export const SecurityCenterPage = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono">
              Healthcare Cyber Defence
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Enterprise SOC telemetry: active encryption sessions, suspicious network traffic, and real-time packet threat isolation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            FIREWALL ACTIVE
          </span>
        </div>
      </div>

      {/* Cyber SOC Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Sessions"
          value="142"
          change="+6"
          changeType="increase"
          description="EHR, PACS & Doctor portal users"
          icon={Activity}
        />
        <KpiCard
          title="Threats Blocked"
          value="149"
          change="+18"
          changeType="increase"
          description="Rogue payloads & token replays"
          icon={ShieldAlert}
          severity="critical"
        />
        <KpiCard
          title="Failed Auths (24h)"
          value="38"
          change="-12%"
          changeType="decrease"
          description="Brute force attempts contained"
          icon={KeyRound}
          severity="medium"
        />
        <KpiCard
          title="Ecosystem Nodes"
          value="5 Hubs"
          change="100%"
          changeType="decrease"
          description="All endpoints TLS 1.3 verified"
          icon={Server}
          severity="low"
        />
      </div>

      {/* Interactive Topology Graph */}
      <NetworkTopologyGraph />

      {/* Scapy-Inspired Deep Packet Telemetry Stream */}
      <ScapyPacketStream />
    </div>
  );
};

export default SecurityCenterPage;
