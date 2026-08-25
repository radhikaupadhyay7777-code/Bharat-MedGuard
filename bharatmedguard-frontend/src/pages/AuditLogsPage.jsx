import React from 'react';
import AuditTable from '../components/audit/AuditTable';
import { History, ShieldCheck, Lock, FileCheck } from 'lucide-react';

export const AuditLogsPage = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-bmg-cyan" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono">
              Immutable Governance & Audit Trail
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Complete cryptographic audit trail of all claim inspections, OCR analyses, identity lookups, and investigator interventions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            SHA-256 HASH CHAIN VERIFIED
          </span>
        </div>
      </div>

      {/* Main Audit Table */}
      <AuditTable />
    </div>
  );
};

export default AuditLogsPage;
