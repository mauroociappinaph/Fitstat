
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const GlassCard: React.FC<Props> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`glass rounded-[2.5rem] border-slate-800 shadow-2xl transition-all ${onClick ? 'cursor-pointer hover:border-slate-700 active:scale-[0.98]' : ''} ${className}`}
  >
    {children}
  </div>
);

export default GlassCard;
