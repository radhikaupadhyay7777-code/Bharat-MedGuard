import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import { 
  Bell, 
  Search, 
  ShieldCheck, 
  UserCheck, 
  ChevronDown, 
  Activity, 
  Lock, 
  Menu, 
  Sparkles,
  Server
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, switchRole, logout } = useAuth();
  const { unreadCount } = useNotification();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/investigations?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="h-16 bmg-header-glass border-b border-bmg-border px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left Section: Mobile toggle & Status indicators */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-bmg-card lg:hidden"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Operational Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold tracking-wider">PLATFORM OPERATIONAL</span>
        </div>

        {/* Ecosystem Nodes Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-bmg-midnight/80 border border-bmg-border text-xs text-slate-300 font-mono">
          <Server className="w-3.5 h-3.5 text-bmg-cyan" />
          <span>5 Hospital Hubs</span>
          <span className="text-slate-500">•</span>
          <span className="text-bmg-cyan">12.4k Records Protected</span>
        </div>
      </div>

      {/* Center Section: Global Search */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <form onSubmit={handleSearch} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search claims, patient ABHA, document IDs or anomaly signals..."
            className="w-full bg-bmg-navy/80 border border-bmg-border rounded-lg pl-10 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-bmg-cyan focus:ring-1 focus:ring-bmg-cyan transition"
          />
        </form>
      </div>

      {/* Right Section: Notifications & User RBAC Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-lg bg-bmg-midnight/80 border border-bmg-border text-slate-300 hover:text-white hover:border-bmg-cyan transition"
            title="System Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
          <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        {/* User RBAC Profile Card & Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 pl-2 rounded-lg bg-bmg-midnight/90 border border-bmg-border hover:border-bmg-cyan transition text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bmg-royal to-bmg-cyan/80 flex items-center justify-center font-bold text-white text-xs border border-white/20 shadow-inner">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-xs font-bold text-slate-100 leading-tight flex items-center gap-1">
                {user.name}
              </span>
              <span className="text-[10px] font-medium text-bmg-cyan flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {user.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 hidden sm:block" />
          </button>

          {/* User Menu & Role Switcher */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-12 w-72 bg-bmg-midnight border border-bmg-border rounded-xl shadow-2xl backdrop-blur-xl z-50 p-3">
              <div className="pb-2.5 border-b border-bmg-border">
                <p className="text-xs font-bold text-white">{user.name}</p>
                <p className="text-[11px] text-slate-400 font-mono truncate">{user.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-bmg-navy border border-bmg-cyan/40 text-[10px] text-bmg-cyan font-mono">
                  <span>Badge: {user.badgeId}</span>
                </div>
              </div>

              {/* Demo Role Switcher */}
              <div className="py-2.5 border-b border-bmg-border">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-bmg-cyan" /> Switch RBAC Role (Demo)
                </p>
                <div className="grid grid-cols-1 gap-1">
                  <button
                    onClick={() => { switchRole('investigator'); setIsUserMenuOpen(false); }}
                    className={`text-left text-xs px-2.5 py-1.5 rounded transition ${user.role === 'Security Investigator' ? 'bg-bmg-royal/40 text-bmg-cyan font-bold' : 'text-slate-300 hover:bg-bmg-card'}`}
                  >
                    🛡️ Security Investigator
                  </button>
                  <button
                    onClick={() => { switchRole('admin'); setIsUserMenuOpen(false); }}
                    className={`text-left text-xs px-2.5 py-1.5 rounded transition ${user.role === 'System Administrator' ? 'bg-bmg-royal/40 text-bmg-cyan font-bold' : 'text-slate-300 hover:bg-bmg-card'}`}
                  >
                    ⚙️ System Administrator
                  </button>
                  <button
                    onClick={() => { switchRole('auditor'); setIsUserMenuOpen(false); }}
                    className={`text-left text-xs px-2.5 py-1.5 rounded transition ${user.role === 'Clinical Auditor' ? 'bg-bmg-royal/40 text-bmg-cyan font-bold' : 'text-slate-300 hover:bg-bmg-card'}`}
                  >
                    🩺 Clinical Auditor
                  </button>
                </div>
              </div>

              {/* Permissions list */}
              <div className="py-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Active Permissions
                </p>
                <div className="space-y-1">
                  {user.permissions.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">{p.name}</span>
                      <span className={p.granted ? "text-emerald-400 font-bold" : "text-red-400"}>
                        {p.granted ? "✓" : "✕"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-bmg-border flex gap-2">
                <button
                  onClick={() => { setIsUserMenuOpen(false); navigate('/settings'); }}
                  className="flex-1 text-center py-1 rounded bg-bmg-card text-xs text-slate-200 hover:text-white"
                >
                  Settings
                </button>
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="flex-1 text-center py-1 rounded bg-red-950/60 border border-red-500/40 text-xs text-red-300 hover:bg-red-900/60"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
