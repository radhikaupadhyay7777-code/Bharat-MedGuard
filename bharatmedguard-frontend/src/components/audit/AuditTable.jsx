import React, { useState } from 'react';
import { AUDIT_LOGS } from '../../services/mockData';
import Badge from '../common/Badge';
import { 
  History, 
  Search, 
  Download, 
  Filter, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

export const AuditTable = () => {
  const [logs, setLogs] = useState(AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredLogs = logs.filter((l) => {
    const matchesSearch = 
      l.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.ip.includes(searchTerm);

    const matchesAction = actionFilter === 'ALL' || l.action.toLowerCase().includes(actionFilter.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || l.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesAction && matchesStatus;
  });

  const exportCSV = () => {
    const headers = "ID,Timestamp,User,Role,Action,Resource,IP,Status\n";
    const rows = filteredLogs.map(l => `"${l.id}","${l.timestamp}","${l.user}","${l.role}","${l.action}","${l.resource}","${l.ip}","${l.status}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `BharatMedGuard_Audit_Logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bmg-card p-6 border-bmg-border space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-bmg-border/60">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-bmg-cyan" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              Immutable Governance Audit Trail
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographically timestamped record of all clinical inspections, AI runs, and overrides
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-3.5 py-1.5 rounded-lg bg-bmg-navy hover:bg-bmg-midnight border border-bmg-border text-xs font-mono text-slate-200 hover:text-white flex items-center gap-2 transition"
        >
          <Download className="w-4 h-4 text-bmg-cyan" />
          Export CSV Audit
        </button>
      </div>

      {/* Multi-Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by user, resource, IP..."
            className="w-full bg-bmg-navy border border-bmg-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-bmg-cyan font-mono"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="bg-bmg-navy border border-bmg-border rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-bmg-cyan"
        >
          <option value="ALL">All Action Types</option>
          <option value="VIEW">View Record Actions</option>
          <option value="OCR">OCR Analyses</option>
          <option value="ANOMALY">AI Scans</option>
          <option value="UPDATE">Config Changes</option>
          <option value="MODIFY">Modifications</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-bmg-navy border border-bmg-border rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-bmg-cyan"
        >
          <option value="ALL">All Statuses</option>
          <option value="SUCCESS">Success Only</option>
          <option value="DENIED">Denied / Flagged Only</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-bmg-border text-slate-400 text-[10px] uppercase">
              <th className="pb-2">Timestamp (IST)</th>
              <th className="pb-2">User / Identity</th>
              <th className="pb-2">Role</th>
              <th className="pb-2">Action</th>
              <th className="pb-2">Resource</th>
              <th className="pb-2">IP Address</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bmg-border/40 text-slate-200">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-bmg-card transition">
                <td className="py-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                <td className="py-3 font-semibold text-white truncate max-w-[180px]">{log.user}</td>
                <td className="py-3 text-slate-300">{log.role}</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded bg-bmg-navy border border-bmg-border text-[11px] font-bold text-bmg-cyan">
                    {log.action}
                  </span>
                </td>
                <td className="py-3 text-white font-medium truncate max-w-[140px]">{log.resource}</td>
                <td className="py-3 text-slate-400">{log.ip}</td>
                <td className="py-3">
                  {log.status === 'SUCCESS' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> SUCCESS
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-400 font-bold bg-red-950/50 px-2 py-0.5 rounded border border-red-500/40">
                      <XCircle className="w-3.5 h-3.5" /> DENIED
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditTable;
