import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import { 
  ReceiptText, 
  UserCheck, 
  FileCheck2, 
  ActivitySquare, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Cpu, 
  Network, 
  CheckCircle2,
  Server
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Claims Intelligence",
      description: "Detect suspicious billing, duplicate submissions, and procedural cost deviations exceeding hospital regional baselines.",
      icon: ReceiptText,
      color: "border-red-500/40 text-red-400 bg-red-950/20",
      link: "/pipelines/claims",
      stats: "34 Flags Active"
    },
    {
      title: "Identity Intelligence",
      description: "Uncover impossible travel velocities, concurrent multi-state admissions, and duplicate biometric ABHA entity collisions.",
      icon: UserCheck,
      color: "border-orange-500/40 text-orange-400 bg-orange-950/20",
      link: "/pipelines/identity",
      stats: "21 Entities Tracked"
    },
    {
      title: "Document Intelligence",
      description: "Tesseract OCR cross-verifies discharge summaries and invoices against claim submissions to highlight tampering and mismatches.",
      icon: FileCheck2,
      color: "border-bmg-cyan/40 text-bmg-cyan bg-cyan-950/20",
      link: "/pipelines/documents",
      stats: "98.4% OCR Precision"
    },
    {
      title: "Clinical Data Intelligence",
      description: "Identifies unphysiological lab value jumps, medication contraindications, and code discordances for mandatory clinical review.",
      icon: ActivitySquare,
      color: "border-amber-500/40 text-amber-400 bg-amber-950/20",
      link: "/pipelines/clinical",
      stats: "Governance Compliant"
    }
  ];

  return (
    <div className="min-h-screen bg-bmg-navy text-slate-100 antialiased selection:bg-bmg-cyan selection:text-bmg-navy flex flex-col justify-between">
      {/* Top Public Header */}
      <header className="h-20 bmg-header-glass border-b border-bmg-border px-6 lg:px-12 flex items-center justify-between sticky top-0 z-50">
        <Logo size="md" showSubtitle={true} showTricolor={true} />

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-lg bg-bmg-royal hover:bg-bmg-royal/80 border border-bmg-cyan/40 text-white font-bold text-xs font-mono flex items-center gap-2 shadow-cyan-glow transition"
          >
            <Lock className="w-3.5 h-3.5 text-bmg-cyan" />
            Sign In to Platform
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 flex-1 flex flex-col justify-center space-y-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bmg-midnight border border-bmg-cyan/40 text-bmg-cyan text-xs font-mono shadow-cyan-glow">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>National Healthcare Cyber Defence Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Protecting Trust in Healthcare with <span className="text-bmg-cyan">AI</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            BharatMedGuard detects suspicious patterns across claims, identities, medical documents and clinical data—while strengthening national healthcare cybersecurity.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-xl bg-bmg-royal hover:bg-bmg-royal/80 border border-bmg-cyan/40 text-white font-bold text-sm flex items-center gap-2 shadow-cyan-glow transition"
            >
              Explore SOC Dashboard
              <ArrowRight className="w-4 h-4 text-bmg-cyan" />
            </button>

            <button
              onClick={() => navigate('/security/network')}
              className="px-6 py-3 rounded-xl bg-bmg-midnight hover:bg-bmg-card border border-bmg-border text-slate-200 hover:text-white font-bold text-sm flex items-center gap-2 transition"
            >
              <Network className="w-4 h-4 text-bmg-cyan" />
              View Cyber Defence
            </button>
          </div>
        </div>

        {/* Four Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(f.link)}
                className={`bmg-card p-6 border transition-all duration-300 hover:-translate-y-1.5 cursor-pointer ${f.color} flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-bmg-navy border border-bmg-border w-fit">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-white">{f.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{f.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-bmg-border/50 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">{f.stats}</span>
                  <span className="text-bmg-cyan flex items-center gap-1 font-bold group-hover:translate-x-1 transition">
                    Launch →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Trust Indicators Banner */}
        <div className="p-6 rounded-2xl bg-bmg-midnight/80 border border-bmg-border flex flex-wrap items-center justify-around gap-6 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>ISO 27001 Certified Security Controls</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-bmg-cyan" />
            <span>AES-256 GCM & ABDM Gateway Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-orange-400" />
            <span>Isolation Forest Anomaly Inference</span>
          </div>
        </div>
      </main>

      {/* Public Footer */}
      <footer className="bmg-header-glass border-t border-bmg-border py-4 px-6 text-center text-xs text-slate-400 font-mono">
        BharatMedGuard • AI-Powered Healthcare Cyber Defence Platform • Govt. of India Initiative
      </footer>
    </div>
  );
};

export default LandingPage;
