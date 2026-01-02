
import React from 'react';

interface Props {
  efficiency: number;
  baseline: number;
  delta: number;
  diagnostic: { label: string; color: string; bio: string };
}

const EfficiencyHero: React.FC<Props> = ({ efficiency, baseline, delta, diagnostic }) => {
  const colorConfig = {
    emerald: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', badge: 'bg-emerald-400 text-slate-950', text: 'text-emerald-400' },
    rose: { border: 'border-rose-500/20', bg: 'bg-rose-500/5', badge: 'bg-rose-400 text-white', text: 'text-rose-400' },
    cyan: { border: 'border-cyan-500/20', bg: 'bg-cyan-500/5', badge: 'bg-cyan-400 text-slate-950', text: 'text-cyan-400' }
  }[diagnostic.color as 'emerald' | 'rose' | 'cyan'];

  return (
    <div className={`glass p-10 rounded-[3rem] ${colorConfig.border} ${colorConfig.bg} relative overflow-hidden shadow-2xl`}>
      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-start">
          <span className={`text-[10px] font-black ${colorConfig.text} uppercase tracking-widest`}>Efficiency Index (Meters/Latido)</span>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Baseline Inicial</p>
            <p className="text-xl font-black text-white">{baseline.toFixed(1)} <span className="text-[10px] text-slate-600">pts</span></p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <h3 className="text-9xl font-black text-white tracking-tighter leading-none">{efficiency.toFixed(1)}</h3>
          <div className="pb-3 flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest ${colorConfig.badge}`}>{diagnostic.label}</span>
              <span className={`text-[10px] font-black ${delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {delta >= 0 ? '+' : ''}{delta.toFixed(1)}% vs Baseline
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Última Sesión</span>
          </div>
        </div>
        <p className="text-slate-400 text-sm font-bold leading-relaxed italic max-w-xl border-l-2 border-slate-800 pl-4">"{diagnostic.bio}"</p>
      </div>
    </div>
  );
};

export default EfficiencyHero;
