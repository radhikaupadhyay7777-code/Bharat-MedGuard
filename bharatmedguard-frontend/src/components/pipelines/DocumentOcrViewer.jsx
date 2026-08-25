import React, { useState } from 'react';
import { MEDICAL_DOCUMENTS_DATA } from '../../services/mockData';
import Badge from '../common/Badge';
import { 
  FileText, 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  Upload, 
  Eye, 
  Scan, 
  AlertTriangle, 
  ShieldAlert, 
  FileWarning,
  Sparkles
} from 'lucide-react';

export const DocumentOcrViewer = () => {
  const [selectedDoc, setSelectedDoc] = useState(MEDICAL_DOCUMENTS_DATA[0]); // DOC-901
  const [isScanning, setIsScanning] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleUploadSim = (e) => {
    e.preventDefault();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setUploadStatus("Document uploaded and processed via Tesseract OCR engine with 98.2% character confidence.");
    }, 1000);
  };

  const fields = selectedDoc.extractedFields;

  return (
    <div className="space-y-6">
      {/* Top Grid: Document Preview on Left, OCR Extracted Fields & Comparison on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Medical Document Preview with Laser Scan Effect */}
        <div className="lg:col-span-6 bmg-card p-6 border-bmg-border flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-bmg-border/60">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-bmg-cyan" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Medical Document Preview
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {selectedDoc.documentType}
              </span>
            </div>

            {/* Document Realistic Visual Box with Scanning Laser */}
            <div className="my-4 relative bg-slate-900 rounded-xl border border-bmg-border p-4 font-mono text-xs text-slate-300 min-h-[340px] flex flex-col justify-between shadow-inner overflow-hidden">
              {/* Animated Scan Line */}
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-bmg-cyan to-transparent shadow-[0_0_10px_#22D3EE] animate-scan-line pointer-events-none opacity-80" />

              {/* Watermark / Header */}
              <div className="border-b border-slate-800 pb-2 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-bold text-white uppercase">{selectedDoc.hospitalName}</span>
                <span>DOC ID: {selectedDoc.id}</span>
              </div>

              {/* Raw OCR Text Snippet */}
              <pre className="my-3 text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap font-mono select-none">
                {selectedDoc.ocrTextSnippet}
              </pre>

              {/* OCR Confidence Footer */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Scan className="w-3 h-3 text-bmg-cyan" /> OCR Engine: {selectedDoc.ocrEngine}
                </span>
                <span className="text-emerald-400 font-bold">Confidence: {selectedDoc.ocrConfidence}</span>
              </div>
            </div>
          </div>

          {/* Quick upload simulator */}
          <div className="pt-2 border-t border-bmg-border/50 flex items-center justify-between">
            <button
              onClick={handleUploadSim}
              disabled={isScanning}
              className="px-3 py-1.5 rounded-lg bg-bmg-royal/40 hover:bg-bmg-royal border border-bmg-cyan/30 text-xs font-bold text-bmg-cyan hover:text-white transition flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              {isScanning ? 'Analyzing OCR...' : 'Upload & Analyze Document'}
            </button>
            <span className="text-[11px] font-mono text-slate-400">PDF / TIFF / JPEG</span>
          </div>
        </div>

        {/* Right 6 Cols: Extracted Fields vs Claim Values (Match / Mismatch Table) */}
        <div className="lg:col-span-6 bmg-card p-6 border-bmg-border flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-bmg-border/60">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  OCR vs Claim Cross-Verification
                </h3>
              </div>
              <Badge severity={selectedDoc.status.includes('MISMATCH') ? 'critical' : 'verified'} text={selectedDoc.status} />
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Cross-verifying extracted medical record fields against submitted claim <span className="text-bmg-cyan font-mono">{selectedDoc.claimId}</span>
            </p>

            {/* Field Comparison Table */}
            <div className="my-4 overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-bmg-border text-slate-400 text-[10px] uppercase">
                    <th className="pb-2">Field</th>
                    <th className="pb-2">OCR Extracted</th>
                    <th className="pb-2">Claim Record</th>
                    <th className="pb-2 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bmg-border/40 text-slate-200">
                  {Object.entries(fields).map(([key, field]) => {
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    return (
                      <tr key={key} className={!field.match ? 'bg-red-950/30' : ''}>
                        <td className="py-2.5 text-slate-300 font-medium">{label}</td>
                        <td className="py-2.5 text-slate-200 truncate max-w-[130px]">{field.value}</td>
                        <td className="py-2.5 text-slate-400 truncate max-w-[130px]">{field.claimValue}</td>
                        <td className="py-2.5 text-right font-bold">
                          {field.match ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" /> MATCH
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/40">
                              <XCircle className="w-3.5 h-3.5" /> MISMATCH
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verification Summary */}
          <div className="p-3 rounded-lg bg-bmg-navy/90 border border-bmg-border text-xs">
            <p className="font-bold text-red-400 flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Anomaly Finding
            </p>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {selectedDoc.verificationSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom: Monitored Documents Table */}
      <div className="bmg-card p-5 border-bmg-border">
        <div className="flex items-center justify-between pb-3 border-b border-bmg-border/60">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Medical Documents Repository ({MEDICAL_DOCUMENTS_DATA.length} Verified Files)
          </h3>
          <span className="text-xs text-slate-400 font-mono">OCR Forensic Pipeline</span>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-bmg-border text-slate-400 text-[10px] uppercase">
                <th className="pb-2">Doc ID</th>
                <th className="pb-2">Filename</th>
                <th className="pb-2">Claim ID</th>
                <th className="pb-2">Hospital</th>
                <th className="pb-2">OCR Engine</th>
                <th className="pb-2">Score</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bmg-border/40 text-slate-200">
              {MEDICAL_DOCUMENTS_DATA.map((d) => (
                <tr
                  key={d.id}
                  onClick={() => setSelectedDoc(d)}
                  className={`hover:bg-bmg-card transition cursor-pointer ${
                    selectedDoc.id === d.id ? 'bg-bmg-royal/20 border-l-2 border-bmg-cyan' : ''
                  }`}
                >
                  <td className="py-3 font-bold text-white">{d.id}</td>
                  <td className="py-3 text-slate-200 font-sans font-semibold truncate max-w-[200px]">{d.documentName}</td>
                  <td className="py-3 text-bmg-cyan">{d.claimId}</td>
                  <td className="py-3 text-slate-400 truncate max-w-[150px]">{d.hospitalName}</td>
                  <td className="py-3 text-slate-400">{d.ocrEngine.split('+')[0]}</td>
                  <td className="py-3 font-bold text-orange-400">{d.anomalyScore}/100</td>
                  <td className="py-3">
                    <Badge severity={d.status.includes('MISMATCH') || d.status.includes('TAMPERING') ? 'critical' : 'verified'} text={d.status} size="xs" />
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

export default DocumentOcrViewer;
