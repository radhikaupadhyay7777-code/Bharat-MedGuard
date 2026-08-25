import React from 'react';
import logoImg from '../../assets/bharatmedguard-logo.jpeg';

export const Logo = ({ size = 'md', showSubtitle = true, showTricolor = false, className = '' }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20'
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-3">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-bmg-cyan/40 to-bmg-royal/30 rounded-xl blur-sm group-hover:blur-md transition-all duration-300 opacity-70"></div>
          <div className="relative bg-white/95 rounded-lg p-1.5 shadow-md flex items-center justify-center border border-bmg-cyan/30">
            <img
              src={logoImg}
              alt="BharatMedGuard Official Logo"
              className={`${sizeClasses[size]} w-auto object-contain rounded`}
            />
          </div>
        </div>

        {showSubtitle && (
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-white flex items-center gap-1.5 text-base sm:text-lg leading-tight">
              BharatMed<span className="text-bmg-cyan">Guard</span>
            </span>
            <span className="text-[10px] font-medium tracking-wider text-slate-300 uppercase">
              AI Healthcare Cyber Defence
            </span>
          </div>
        )}
      </div>

      {showTricolor && (
        <div className="w-full mt-2 h-0.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] rounded-full opacity-80" />
      )}
    </div>
  );
};

export default Logo;
