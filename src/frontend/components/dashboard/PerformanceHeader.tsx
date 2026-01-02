
import React from 'react';

interface Props {
  readiness: number;
  proteinStatus: {
    progress: number;
    target: number;
    current: number;
    isAlert: boolean;
  };
}

const PerformanceHeader: React.FC<Props> = ({ readiness, proteinStatus }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 glass p-8 rounded-[3rem] border-slate-800 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 ${readiness > 80 ? 'bg-emerald-500' : readiness > 60 ? 'bg-cyan-500' : 'bg-rose-500'}`}></div>
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90">
            <circle cx="72" cy="72" r="66" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-900" />
            <circle cx="72" cy="72" r="66" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={414} strokeDashoffset={414 - (414 * readiness) / 100} strokeLinecap="round" className={`${readiness > 80 ? 'text-emerald-500' : readiness > 60 ? 'text-cyan-500' : 'text-rose-500'} transition-all duration-1000`} />
          </svg>
          <div className="absolute text-center">
            <span className="text-4xl font-black text-white">{readiness}%</span>
            <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Readiness</p>
          </div>
        </div>
        <div className="space-y-3 text-center md:text-left relative z-10">
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
            {readiness > 80 ? 'Estado: Máximo Output' : readiness > 60 ? 'Carga Moderada' : 'Priorizar Recu'}
          </h3>
          <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xs">
            {readiness < 55 
              ? "⚠️ FATIGA CRÍTICA: Se recomienda descarga de volumen (Deload) por indicadores comprometidos." 
              : `Estado neuronal óptimo para tu fase de entrenamiento actual.`}
          </p>
        </div>
      </div>

      <div className={`glass p-8 rounded-[3rem] border-slate-800 space-y-6 flex flex-col justify-center transition-all ${proteinStatus.isAlert ? 'border-rose-500/30' : ''}`}>
        <div className="flex justify-between items-end">
          <div>
            <p className={`text-[10px] font-black uppercase tracking-widest ${proteinStatus.isAlert ? 'text-rose-400' : 'text-emerald-400'}`}>Ancla Proteica</p>
            <p className="text-2xl font-black text-white">{proteinStatus.current}g <span className="text-[10px] text-slate-600">/ {proteinStatus.target}g</span></p>
          </div>
        </div>
        <div className="h-3 w-full bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
          <div className={`h-full transition-all duration-1000 ${proteinStatus.isAlert ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'}`} style={{ width: `${Math.min(proteinStatus.progress, 100)}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceHeader;
