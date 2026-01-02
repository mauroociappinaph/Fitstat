
import React from 'react';
import { AIFeedback } from '@/shared/types';

interface Props {
  data: AIFeedback | null;
  isLoading: boolean;
  type?: 'nutrition' | 'audit';
}

const AIFeedbackDisplay: React.FC<Props> = ({ data, isLoading, type = 'nutrition' }) => {
  if (isLoading) {
    return (
      <div className="p-8 glass rounded-[3rem] border-slate-800 flex items-center gap-6 animate-pulse">
        <div className="w-14 h-14 rounded-2xl bg-slate-800"></div>
        <div className="flex-1 space-y-2">
           <div className="h-3 w-20 bg-slate-800 rounded"></div>
           <div className="h-4 w-full bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const icon = type === 'nutrition' ? '🧪' : '⚖️';
  const colorClass = type === 'nutrition' ? 'emerald' : 'cyan';

  return (
    <div className={`glass p-8 rounded-[3rem] border-${colorClass}-500/20 bg-${colorClass}-500/5 space-y-6 relative overflow-hidden animate-in fade-in duration-700`}>
      <div className="flex gap-6 items-start">
        <div className={`w-14 h-14 rounded-2xl bg-${colorClass}-500/20 flex items-center justify-center text-3xl shadow-lg shrink-0`}>
          {icon}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <span className={`text-[10px] font-black text-${colorClass}-400 uppercase tracking-[0.2em]`}>Informe de IA Coach</span>
             <span className={`px-2 py-0.5 rounded bg-${colorClass}-500 text-slate-950 text-[9px] font-black uppercase tracking-widest`}>{data.status}</span>
          </div>
          <p className="text-base font-bold text-white leading-tight mt-2">{data.analysis}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Acciones sugeridas</p>
           <ul className="space-y-2">
              {data.actionPoints.map((point, i) => (
                <li key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                   <div className={`w-1.5 h-1.5 rounded-full bg-${colorClass}-400`}></div>
                   <span className="text-xs font-bold text-slate-300">{point}</span>
                </li>
              ))}
           </ul>
        </div>
        <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 flex flex-col justify-center italic relative">
           <span className="absolute -top-3 left-6 text-3xl opacity-20 text-white">"</span>
           <p className="text-sm font-bold text-slate-400 leading-relaxed text-center px-2">{data.insight}</p>
        </div>
      </div>
    </div>
  );
};

export default AIFeedbackDisplay;
