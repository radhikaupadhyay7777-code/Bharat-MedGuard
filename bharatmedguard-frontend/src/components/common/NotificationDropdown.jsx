import React, { useRef, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { ShieldAlert, AlertTriangle, Info, CheckCircle, Bell, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationDropdown = ({ isOpen, onClose }) => {
  const { notifications, markAllAsRead, markAsRead } = useNotification();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = (sev) => {
    switch (sev) {
      case 'critical':
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'medium':
        return <Info className="w-4 h-4 text-amber-400" />;
      default:
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    }
  };

  const handleItemClick = (n) => {
    markAsRead(n.id);
    onClose();
    if (n.category?.includes('Claims')) navigate('/pipelines/claims');
    else if (n.category?.includes('Identity')) navigate('/pipelines/identity');
    else if (n.category?.includes('Document')) navigate('/pipelines/documents');
    else if (n.category?.includes('Network')) navigate('/security/network');
    else navigate('/investigations');
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-12 w-80 sm:w-96 bg-bmg-midnight/95 border border-bmg-border rounded-xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden"
    >
      <div className="p-3.5 bg-bmg-navy/90 border-b border-bmg-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-bmg-cyan" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Security & Anomaly Alerts
          </h3>
        </div>
        <button
          onClick={markAllAsRead}
          className="text-[11px] text-bmg-cyan hover:underline font-medium"
        >
          Mark all as read
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-bmg-border/50">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No active alerts at this time.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleItemClick(n)}
              className={`p-3.5 hover:bg-bmg-card/70 transition cursor-pointer flex gap-3 items-start ${
                !n.read ? 'bg-bmg-card/40' : ''
              }`}
            >
              <div className="mt-0.5">{getIcon(n.severity)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs font-bold text-slate-100 truncate">{n.title}</p>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">{n.description}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] uppercase font-mono text-bmg-cyan bg-bmg-navy/60 px-1.5 py-0.5 rounded border border-bmg-border">
                    {n.category}
                  </span>
                  <span className="text-[10px] text-bmg-soft flex items-center gap-0.5 hover:text-white">
                    Investigate <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-2.5 bg-bmg-navy/90 border-t border-bmg-border text-center">
        <button
          onClick={() => {
            onClose();
            navigate('/security/alerts');
          }}
          className="text-xs font-semibold text-bmg-cyan hover:text-white transition"
        >
          View All Security Alerts →
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
