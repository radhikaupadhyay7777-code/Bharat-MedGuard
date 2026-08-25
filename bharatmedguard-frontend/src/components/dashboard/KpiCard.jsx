import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export const KpiCard = ({ title, value, change, changeType = 'increase', description, icon: Icon, severity, onClick }) => {
  const getSeverityStyles = () => {
    switch (severity) {
      case 'critical':
        return {
          border: 'border-red-500/40 hover:border-red-400',
          glow: 'hover:shadow-red-glow',
          iconBg: 'bg-red-500/10 text-red-400 border border-red-500/30',
          valColor: 'text-red-400'
        };
      case 'high':
        return {
          border: 'border-orange-500/40 hover:border-orange-400',
          glow: 'hover:shadow-amber-glow',
          iconBg: 'bg-orange-500/10 text-orange-400 border border-orange-500/30',
          valColor: 'text-orange-400'
        };
      case 'medium':
        return {
          border: 'border-amber-500/40 hover:border-amber-400',
          glow: 'hover:shadow-amber-glow',
          iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
          valColor: 'text-amber-400'
        };
      case 'low':
        return {
          border: 'border-emerald-500/40 hover:border-emerald-400',
          glow: 'hover:shadow-green-glow',
          iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
          valColor: 'text-emerald-400'
        };
      default:
        return {
          border: 'border-bmg-border hover:border-bmg-cyan',
          glow: 'hover:shadow-cyan-glow',
          iconBg: 'bg-bmg-royal/20 text-bmg-cyan border border-bmg-cyan/30',
          valColor: 'text-white'
        };
    }
  };

  const styles = getSeverityStyles();

  return (
    <div
      onClick={onClick}
      className={`bmg-card p-4 transition-all duration-200 cursor-pointer ${styles.border} ${styles.glow} flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-300 tracking-wide uppercase font-mono">
            {title}
          </p>
          <h3 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${styles.valColor}`}>
            {value}
          </h3>
        </div>

        <div className={`p-2.5 rounded-xl ${styles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-bmg-border/50 flex items-center justify-between text-xs">
        <span className="text-slate-400 truncate max-w-[160px]">{description}</span>
        {change && (
          <span
            className={`flex items-center gap-0.5 font-semibold font-mono text-[11px] ${
              changeType === 'increase' ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {changeType === 'increase' ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {change}
          </span>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
