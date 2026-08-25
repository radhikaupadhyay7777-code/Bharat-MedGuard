import React, { useState, useEffect } from 'react';
import { NETWORK_PACKETS } from '../../services/mockData';
import Badge from '../common/Badge';
import { 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  Play, 
  Pause, 
  Terminal, 
  Filter, 
  Wifi, 
  Lock
} from 'lucide-react';

export const ScapyPacketStream = () => {
  const [packets, setPackets] = useState(NETWORK_PACKETS);
  const [isLive, setIsLive] = useState(true);
  const [selectedPacket, setSelectedPacket] = useState(NETWORK_PACKETS[1]);
  const [protocolFilter, setProtocolFilter] = useState('ALL');

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const protoList = ['TLS 1.3 / HTTPS', 'DICOM PACS / C-STORE', 'HTTP / REST API', 'FHIR R4 / JSON', 'TCP / OAuth 2.0'];
      const randomProto = protoList[Math.floor(Math.random() * protoList.length)];
      const isThreat = Math.random() < 0.2;
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${Math.floor(100 + Math.random() * 900)}`;

      const newPacket = {
        id: `PKT-${Math.floor(8800 + Math.random() * 1200)}`,
        timestamp: timeStr,
        src: isThreat ? '45.133.1.88 (External Proxy)' : '10.14.22.8 (BharatCare Gateway)',
        dst: '172.16.0.10:443',
        proto: randomProto,
        length: Math.floor(400 + Math.random() * 14000),
        info: isThreat ? 'Unusual Header Entropy / Suspected Token Replay' : 'Routine FHIR Health Record Sync',
        status: isThreat ? 'THREAT_BLOCKED' : 'CLEAN',
        flags: isThreat ? 'RST, ACK' : 'ACK'
      };

      setPackets(prev => [newPacket, ...prev.slice(0, 19)]);
    }, 2500);

    return () => clearInterval(interval);
  }, [isLive]);

  const filteredPackets = protocolFilter === 'ALL'
    ? packets
    : packets.filter(p => p.proto.toLowerCase().includes(protocolFilter.toLowerCase()));

  return (
    <div className="bmg-card p-6 border-bmg-border space-y-4">
      {/* Stream Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-bmg-border/60">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-5 h-5 text-bmg-cyan" />
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Scapy-Inspired Deep Packet Telemetry Stream
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Active Ingestion: EHR/FHIR Gateway & DICOM PACS Traffic
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Pause / Resume Button */}
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border transition ${
              isLive 
                ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 shadow-sm' 
                : 'bg-bmg-navy text-slate-400 border-bmg-border'
            }`}
          >
            {isLive ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <Pause className="w-3 h-3 ml-1" /> Live Stream
              </>
            ) : (
              <>
                <Play className="w-3 h-3" /> Stream Paused
              </>
            )}
          </button>
        </div>
      </div>

      {/* Packet Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-bmg-border text-slate-400 text-[10px] uppercase">
              <th className="pb-2">Packet ID</th>
              <th className="pb-2">Timestamp</th>
              <th className="pb-2">Source IP & Node</th>
              <th className="pb-2">Destination</th>
              <th className="pb-2">Protocol</th>
              <th className="pb-2">Length</th>
              <th className="pb-2">Security Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bmg-border/40 text-slate-200">
            {filteredPackets.map((pkt) => (
              <tr
                key={pkt.id}
                onClick={() => setSelectedPacket(pkt)}
                className={`hover:bg-bmg-card transition cursor-pointer ${
                  selectedPacket?.id === pkt.id ? 'bg-bmg-royal/20 border-l-2 border-bmg-cyan' : ''
                } ${pkt.status === 'THREAT_BLOCKED' ? 'bg-red-950/20' : ''}`}
              >
                <td className="py-2.5 font-bold text-white">{pkt.id}</td>
                <td className="py-2.5 text-slate-400">{pkt.timestamp}</td>
                <td className="py-2.5 text-slate-300 truncate max-w-[170px]">{pkt.src}</td>
                <td className="py-2.5 text-slate-400">{pkt.dst}</td>
                <td className="py-2.5 text-bmg-cyan">{pkt.proto}</td>
                <td className="py-2.5 text-slate-300">{pkt.length} B</td>
                <td className="py-2.5">
                  <Badge 
                    severity={pkt.status === 'THREAT_BLOCKED' ? 'critical' : pkt.status === 'SUSPICIOUS' ? 'high' : 'verified'} 
                    text={pkt.status} 
                    size="xs" 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Packet Detailed Inspector */}
      {selectedPacket && (
        <div className="p-4 rounded-xl bg-bmg-navy/95 border border-bmg-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs animate-fadeIn">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">{selectedPacket.id} Packet Details:</span>
              <span className="text-bmg-cyan">{selectedPacket.info}</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Flags: <span className="text-white font-bold">{selectedPacket.flags}</span> • Source: {selectedPacket.src} → Destination: {selectedPacket.dst}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-bmg-midnight border border-bmg-border text-[11px] text-slate-300">
              Payload: {selectedPacket.length} bytes
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScapyPacketStream;
