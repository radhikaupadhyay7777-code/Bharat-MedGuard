import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/common/Logo';
import { 
  Lock, 
  Mail, 
  KeyRound, 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  User, 
  FileText, 
  Receipt,
  Server
} from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('radhika.upadhyay@bharatmedguard.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email, password);
      setIsLoading(false);
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-bmg-navy text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-bmg-royal/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-bmg-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Split Grid Card */}
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-bmg-midnight/90 border border-bmg-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl z-10">
        {/* Left Side: Brand Visual & Subtle Healthcare-Cyber Network (6 Cols) */}
        <div className="lg:col-span-6 p-8 sm:p-12 bg-gradient-to-br from-bmg-navy to-bmg-midnight border-b lg:border-b-0 lg:border-r border-bmg-border flex flex-col justify-between relative overflow-hidden">
          {/* Faint network SVG background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 400 400">
              <line x1="100" y1="100" x2="200" y2="200" stroke="#22D3EE" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="300" y1="100" x2="200" y2="200" stroke="#22D3EE" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="100" y1="300" x2="200" y2="200" stroke="#22D3EE" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="300" y1="300" x2="200" y2="200" stroke="#22D3EE" strokeWidth="1" strokeDasharray="3 3" />
              
              <circle cx="200" cy="200" r="40" fill="none" stroke="#22D3EE" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="15" fill="#1261A0" />
              <circle cx="300" cy="100" r="15" fill="#1261A0" />
              <circle cx="100" cy="300" r="15" fill="#1261A0" />
              <circle cx="300" cy="300" r="15" fill="#1261A0" />
            </svg>
          </div>

          <div className="space-y-6 relative z-10">
            <Logo size="lg" showSubtitle={true} showTricolor={true} />

            <div className="space-y-2 pt-4">
              <h2 className="text-2xl font-extrabold text-white leading-tight">
                AI-Powered Healthcare Cyber Defence
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                National cybersecurity intelligence system protecting healthcare claims, patient identities, medical records, and hospital networks across India.
              </p>
            </div>
          </div>

          {/* Network Connection Pillars */}
          <div className="grid grid-cols-2 gap-3 pt-6 relative z-10">
            <div className="p-2.5 rounded-lg bg-bmg-navy/70 border border-bmg-border text-[11px] text-slate-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-bmg-cyan" />
              <span>Hospitals & Clinics</span>
            </div>
            <div className="p-2.5 rounded-lg bg-bmg-navy/70 border border-bmg-border text-[11px] text-slate-300 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-400" />
              <span>ABDM Identities</span>
            </div>
            <div className="p-2.5 rounded-lg bg-bmg-navy/70 border border-bmg-border text-[11px] text-slate-300 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-red-400" />
              <span>Claims & Billing</span>
            </div>
            <div className="p-2.5 rounded-lg bg-bmg-navy/70 border border-bmg-border text-[11px] text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Verified Documents</span>
            </div>
          </div>
        </div>

        {/* Right Side: Secure Login Card (6 Cols) */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between space-y-8">
          <div>
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-white">Investigator Sign In</h3>
              <p className="text-xs text-slate-400 font-mono">
                Authorized Personnel & Security Investigators Only
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-bmg-navy border border-bmg-border rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-bmg-cyan font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-300 block mb-1">
                  Access Key / Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-bmg-navy border border-bmg-border rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-bmg-cyan font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-bmg-navy border-bmg-border accent-bmg-cyan"
                  />
                  <span>Remember session</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Please contact the BharatMedGuard KMS Security Administrator to reset MFA keys."); }} className="text-bmg-cyan hover:underline text-[11px]">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-bmg-royal hover:bg-bmg-royal/80 border border-bmg-cyan/40 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-cyan-glow transition"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Authenticating Credentials...
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-bmg-cyan" />
                    Secure Login
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Security Badges */}
          <div className="pt-4 border-t border-bmg-border/60 text-center space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Protected by BharatMedGuard Security</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              OAuth 2.0 • RBAC • Multi-Factor Cryptographic Authentication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
