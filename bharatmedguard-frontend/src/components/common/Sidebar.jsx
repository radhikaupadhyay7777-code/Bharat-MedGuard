import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { 
  LayoutDashboard, 
  ReceiptText, 
  UserCheck, 
  FileCheck2, 
  ActivitySquare, 
  Cpu, 
  ShieldAlert, 
  Network, 
  History, 
  FileSearch, 
  BarChart3, 
  Settings, 
  ExternalLink,
  ChevronLeft,
  Lock
} from 'lucide-react';

export const Sidebar = ({ isCollapsed, onToggleCollapse, isOpenMobile, onCloseMobile }) => {
  const navigate = useNavigate();

  const navSections = [
    {
      group: "OVERVIEW",
      items: [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard }
      ]
    },
    {
      group: "ANOMALY INTELLIGENCE",
      items: [
        { name: "Claims & Billing", path: "/pipelines/claims", icon: ReceiptText, badge: "34" },
        { name: "Patient & Identity", path: "/pipelines/identity", icon: UserCheck, badge: "21" },
        { name: "Medical Documents", path: "/pipelines/documents", icon: FileCheck2, badge: "17" },
        { name: "Clinical Data", path: "/pipelines/clinical", icon: ActivitySquare, badge: "10" }
      ]
    },
    {
      group: "AI ENGINE",
      items: [
        { name: "Isolation Forest", path: "/ai/isolation-forest", icon: Cpu }
      ]
    },
    {
      group: "CYBER DEFENCE",
      items: [
        { name: "Network Security", path: "/security/network", icon: Network },
        { name: "Security Alerts", path: "/security/alerts", icon: ShieldAlert, alert: true },
        { name: "Audit Logs", path: "/audit-logs", icon: History }
      ]
    },
    {
      group: "MANAGEMENT",
      items: [
        { name: "Investigations", path: "/investigations", icon: FileSearch },
        { name: "Risk Reports", path: "/reports", icon: BarChart3 },
        { name: "Settings", path: "/settings", icon: Settings }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-bmg-navy/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bmg-sidebar-glass border-r border-bmg-border z-40 transition-all duration-300 flex flex-col ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header with Official Brand Logo */}
        <div className="p-4 border-b border-bmg-border flex items-center justify-between">
          <div 
            onClick={() => navigate('/')} 
            className="cursor-pointer overflow-hidden transition"
          >
            {isCollapsed ? (
              <Logo size="sm" showSubtitle={false} />
            ) : (
              <Logo size="sm" showSubtitle={true} showTricolor={true} />
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-bmg-card transition ml-auto"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-1.5 font-mono">
                  {section.group}
                </p>
              )}
              {section.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all group ${
                        isActive
                          ? 'bg-bmg-royal/40 text-bmg-cyan border border-bmg-cyan/40 shadow-cyan-glow'
                          : 'text-slate-300 hover:bg-bmg-midnight/80 hover:text-white border border-transparent'
                      } ${isCollapsed ? 'justify-center px-2' : ''}`
                    }
                    title={isCollapsed ? item.name : undefined}
                  >
                    <IconComponent className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                    
                    {!isCollapsed && (
                      <span className="flex-1 truncate">{item.name}</span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bmg-navy/90 border border-bmg-border text-slate-300 group-hover:border-bmg-cyan">
                        {item.badge}
                      </span>
                    )}

                    {!isCollapsed && item.alert && (
                      <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-bmg-border bg-bmg-navy/60">
          {!isCollapsed ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-bmg-cyan" /> Gov Sec Grade
                </span>
                <span className="text-emerald-400 font-bold">256-Bit TLS</span>
              </div>
              <p className="text-[9px] text-slate-500 truncate">
                Govt. of India • National Cyber Shield
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <Lock className="w-4 h-4 text-bmg-cyan" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
