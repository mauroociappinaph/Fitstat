
import React from 'react';

interface Props {
  label: string;
  type?: 'info' | 'success' | 'warning' | 'danger';
  className?: string;
}

const StatusBadge: React.FC<Props> = ({ label, type = 'info', className = '' }) => {
  const styles = {
    info: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    danger: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[type]} ${className}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
