
import React from 'react';

interface Props {
  phase: any;
  isCurrentPhase: boolean;
  targetWeight: number;
}

const PhaseHeroCard: React.FC<Props> = ({ phase, isCurrentPhase, targetWeight }) => {
  return (
    <div className={`glass p-10 rounded-[3.5rem] border-slate-800 relative overflow-hidden transition-all duration-500 ${isCurrentPhase ? 'border-blue-500/30 ring-1 ring-blue-500/20' : ''}`}>
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none text-blue-400">
        <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
      </div>

      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-4">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${isCurrentPhase ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
            {isCurrentPhase ? 'FASE ACTIVA' : 'PLANIFICACIÓN FUTURA'}
          </span>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Target: {targetWeight}kg</span>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-tight">{phase.name}</h3>
          <p className="text-xl font-bold text-slate-400 italic leading-relaxed max-w-2xl border-l-4 border-slate-800 pl-6">
            "{phase.focus}"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-900/40 rounded-3xl border border-slate-800/50 space-y-3">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Estrategia Nutricional</p>
            <p className="text-sm font-medium text-slate-300 leading-relaxed italic">{phase.nutrition}</p>
          </div>
          <div className="p-6 bg-slate-900/40 rounded-3xl border border-slate-800/50 space-y-3">
            <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Enfoque Biomecánico</p>
            <p className="text-sm font-medium text-slate-300 leading-relaxed italic">Prioridad en {phase.focus.split('.')[0]}.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseHeroCard;
