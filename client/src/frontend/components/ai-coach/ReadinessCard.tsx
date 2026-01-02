
import React from 'react';

interface ReadinessCardProps {
  score: number;
}

const ReadinessCard: React.FC<ReadinessCardProps> = ({ score }) => {
  return (
    <div className="md:col-span-2 glass p-10 rounded-[3rem] border-slate-800 relative overflow-hidden shadow-2xl">
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Readiness Score (Sistema Nervioso + Metabólico)</p>
          <h2 className="text-9xl font-black text-white tracking-tighter leading-none">{score}<span className="text-2xl text-slate-600">%</span></h2>
          <p className="text-sm font-bold text-slate-400 mt-4 uppercase tracking-tighter italic">
            {score > 80 ? "Luz Verde: Rendimiento Máximo Sugerido" : score > 50 ? "Luz Amarilla: Carga Moderada" : "Luz Roja: Priorizar Recuperación"}
          </p>
        </div>
        <div className="w-48 h-48 relative flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-900" />
            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={502} strokeDashoffset={502 - (502 * score) / 100} strokeLinecap="round" className={`${score > 80 ? 'text-emerald-500' : score > 50 ? 'text-cyan-500' : 'text-rose-500'} transition-all duration-1000`} />
          </svg>
          <span className="absolute text-4xl">{score > 80 ? '🔥' : score > 50 ? '⚡' : '💤'}</span>
        </div>
      </div>
    </div>
  );
};

export default ReadinessCard;
