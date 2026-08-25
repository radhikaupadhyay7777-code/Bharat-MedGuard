import React from 'react';

export const Badge = ({ severity, text, size = 'sm', pulse = false }) => {
  const getStyles = () => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-red-950/80 text-red-300 border-red-500/50 shadow-sm shadow-red-900/30';
      case 'high':
        return 'bg-orange-950/80 text-orange-300 border-orange-500/50 shadow-sm shadow-orange-900/30';
      case 'medium':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-900/30';
      case 'low':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-900/30';
      case 'operational':
      case 'verified':
      case 'success':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40';
      case 'threat_blocked':
      case 'suspended':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/50';
      case 'cyan':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50';
      default:
        return 'bg-slate-800/80 text-slate-300 border-slate-700';
    }
  };

  const getDotColor = () => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-400';
      case 'high': return 'bg-orange-400';
      case 'medium': return 'bg-amber-400';
      case 'low':
      case 'operational':
      case 'verified':
      case 'success': return 'bg-emerald-400';
      case 'threat_blocked': return 'bg-purple-400';
      default: return 'bg-cyan-400';
    }
  };

  const sizeClasses = size === 'xs' 
    ? 'text-[10px] px-2 py-0.5' 
    : size === 'lg' 
    ? 'text-sm px-3.5 py-1.5' 
    : 'text-xs px-2.5 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border font-mono uppercase tracking-wider ${sizeClasses} ${getStyles()}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()} ${pulse ? 'animate-ping' : ''}`} />
      {text || severity}
    </span>
  );
};

export default Badge;
