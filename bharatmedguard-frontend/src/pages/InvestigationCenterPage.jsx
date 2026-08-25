import React, { useState } from 'react';
import { CLAIMS_DATA } from '../services/mockData';
import Badge from '../components/common/Badge';
import CaseDetailModal from '../components/investigations/CaseDetailModal';
import { 
  FileSearch, 
  Search, 
  Filter, 
  ShieldAlert, 
  FolderPlus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const InvestigationCenterPage = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Transform claims into investigation cases
  const [cases, setCases] = useState([
    {
      id: "BM-2026-0142",
      claimRef: "BM-1024",
      patientName: "Aarav Sharma",
      patientId: "P-102",
      hospitalName: "CityCare Apex Multi-Speciality",
      category: "Billing & Document Discrepancy",
      claimedAmount: 340000,
      riskScore: 91,
      severity: "CRITICAL",
      date: "2026-08-25 09:36 IST",
      status: "OPEN_INVESTIGATION",
      investigator: "Radhika Upadhyay",
      evidence: CLAIMS_DATA[0].evidence
    },
    {
      id: "BM-2026-0143",
      claimRef: "BM-1026",
      patientName: "Vikram Malhotra",
      patientId: "P-104",
      hospitalName: "Purvanchal Advanced Wing",
      category: "Excessive Frequency & Biological Redundancy",
      claimedAmount: 520000,
      riskScore: 84,
      severity: "HIGH",
      date: "2026-08-25 10:16 IST",
      status: "IN_REVIEW",
      investigator: "Radhika Upadhyay",
      evidence: CLAIMS_DATA[2].evidence
    },
    {
      id: "BM-2026-0144",
      claimRef: "BM-1028",
      patientName: "Rajeshwar Singh",
      patientId: "P-106",
      hospitalName: "CityCare Apex Multi-Speciality",
      category: "Physician Credential & Digital Forgery",
      claimedAmount: 780000,
      riskScore: 94,
      severity: "CRITICAL",
      date: "2026-08-25 11:21 IST",
      status: "SUSPENDED",
      investigator: "Radhika Upadhyay",
      evidence: CLAIMS_DATA[4].evidence
    },
    {
      id: "BM-2026-0145",
      claimRef: "BM-1027",
      patientName: "Meera Deshmukh",
      patientId: "P-105",
      hospitalName: "National Medical Research Institute",
      category: "Tariff Deviation & Consumable Unbundling",
      claimedAmount: 112000,
      riskScore: 68,
      severity: "MEDIUM",
      date: "2026-08-25 10:48 IST",
      status: "AUDIT_QUEUED",
      investigator: "Radhika Upadhyay",
      evidence: CLAIMS_DATA[3].evidence
    }
  ]);

  const handleOpenCase = (c) => {
    setSelectedCase(c);
    setIsModalOpen(true);
  };

  const handleCaseAction = (caseId, actionType) => {
    setCases(prev => prev.map(item => {
      if (item.id === caseId) {
        return {
          ...item,
          status: actionType === 'ESCALATE_SIU' ? 'ESCALATED_SIU' : actionType === 'APPROVE_OVERRIDE' ? 'RESOLVED_OVERRIDE' : 'AUDIT_REQUESTED'
        };
      }
      return item;
    }));
  };

  const filteredCases = cases.filter(c => {
    const matchesSev = filterSeverity === 'ALL' || c.severity === filterSeverity;
    const matchesSearch = 
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSev && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <FileSearch className="w-6 h-6 text-bmg-cyan" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono">
              Investigation Center
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Enterprise case management workspace for healthcare fraud, identity anomalies, and cyber threats
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-bmg-midnight border border-bmg-border text-xs font-mono text-slate-300">
            Active Investigator: <strong className="text-bmg-cyan">Radhika Upadhyay</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bmg-card p-4 border-bmg-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by case ID, patient name, hospital, anomaly category..."
            className="w-full bg-bmg-navy border border-bmg-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-bmg-cyan font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-bmg-navy border border-bmg-border rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-bmg-cyan"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">🔴 Critical Only</option>
            <option value="HIGH">🟠 High Only</option>
            <option value="MEDIUM">🟡 Medium Only</option>
          </select>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bmg-card p-6 border-bmg-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-bmg-border text-slate-400 text-[10px] uppercase">
                <th className="pb-3">Case ID</th>
                <th className="pb-3">Patient</th>
                <th className="pb-3">Hospital</th>
                <th className="pb-3">Anomaly Category</th>
                <th className="pb-3">Claimed Amt</th>
                <th className="pb-3">Risk Score</th>
                <th className="pb-3">Severity</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bmg-border/40 text-slate-200">
              {filteredCases.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => handleOpenCase(c)}
                  className="hover:bg-bmg-card transition cursor-pointer group"
                >
                  <td className="py-3.5 font-bold text-white group-hover:text-bmg-cyan transition">
                    {c.id}
                  </td>
                  <td className="py-3.5 text-slate-200 font-sans font-semibold">
                    {c.patientName}
                    <span className="text-[10px] text-slate-400 block font-mono">ID: {c.patientId}</span>
                  </td>
                  <td className="py-3.5 text-slate-300 truncate max-w-[150px]">{c.hospitalName}</td>
                  <td className="py-3.5 text-orange-300 truncate max-w-[200px]">{c.category}</td>
                  <td className="py-3.5 text-white font-bold">₹ {c.claimedAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5">
                    <span className="font-extrabold text-red-400">{c.riskScore}/100</span>
                  </td>
                  <td className="py-3.5">
                    <Badge severity={c.severity} text={c.severity} size="xs" />
                  </td>
                  <td className="py-3.5">
                    <span className="text-[10px] uppercase font-bold text-slate-300 bg-bmg-navy px-2 py-0.5 rounded border border-bmg-border">
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <span className="text-xs text-bmg-cyan group-hover:translate-x-1 inline-flex items-center gap-1 font-bold transition">
                      Investigate <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Case Modal */}
      <CaseDetailModal
        caseData={selectedCase}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAction={handleCaseAction}
      />
    </div>
  );
};

export default InvestigationCenterPage;
