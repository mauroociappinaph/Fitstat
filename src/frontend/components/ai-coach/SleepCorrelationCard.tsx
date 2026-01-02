
import React from 'react';
import { SleepCorrelation } from '@/shared/types';

interface Props {
  data: SleepCorrelation | null;
  isLoading: boolean;
}

const SleepCorrelationCard: React.FC<Props> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass p-8 rounded-[3rem] border-slate-800 animate-pulse space-y-4">
        <div className="h-4 w-1/3 bg-slate-800 rounded"></div>
        <div className="h-10 w-full bg-slate-800 rounded"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 bg-slate-800 rounded-2xl"></div>
          <div className="h-20 bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="glass p-8 rounded-[3rem] border-purple-500/20 bg-purple-500/5 space-y-8 relative overflow-hidden shadow-2xl animate-in fade-in duration-700">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌙</span>
            <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Análisis de Sueño & Rendimiento</p>
          </div>
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Correlación Biovital</h3>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sleep Impact</p>
          <p className="text-3xl font-black text-purple-400">{data.correlationScore}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-5 bg-slate-900/50 rounded-3xl border border-slate-800 space-y-2">
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Impacto en Fuerza</p>
             <p className="text-xs text-slate-300 font-medium leading-relaxed italic">"{data.impactOnTraining}"</p>
          </div>
          <div className="p-5 bg-slate-900/50 rounded-3xl border border-slate-800 space-y-2">
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Impacto en Movimiento (NEAT)</p>
             <p className="text-xs text-slate-300 font-medium leading-relaxed italic">"{data.impactOnNEAT}"</p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center p-8 bg-purple-500/10 rounded-[2.5rem] border border-purple-500/20 text-center space-y-4">
           <div>
              <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Tu Umbral Óptimo</p>
              <h4 className="text-5xl font-black text-white tracking-tighter">{data.optimalSleepThreshold}<span className="text-lg text-slate-500 ml-1">h</span></h4>
           </div>
           <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Potencial de Mejora</p>
              <p className="text-xs font-black text-emerald-400 uppercase tracking-tighter italic">{data.predictedPerformanceBoost}</p>
           </div>
        </div>
      </div>

      <div className="p-4 bg-purple-900/20 rounded-2xl border border-purple-500/10 text-center">
        <p className="text-[8px] font-black text-purple-300 uppercase tracking-[0.2em]">El descanso no es negociable para la recomposición corporal.</p>
      </div>
    </div>
  );
};

export default SleepCorrelationCard;
