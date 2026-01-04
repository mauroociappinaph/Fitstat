
import React from 'react';
import { ExerciseTemplate } from '@/shared/types';

interface Props {
  exercises: ExerciseTemplate[];
  isCompleted: (name: string) => boolean;
  expandedEx: string | null;
  setExpandedEx: (name: string | null) => void;
  activeReps: Record<string, number[]>;
  onRepChange: (exName: string, setIndex: number, value: string) => void;
  onSync: (ex: ExerciseTemplate) => void;
}

const ExerciseTracker: React.FC<Props> = ({ 
  exercises, isCompleted, expandedEx, setExpandedEx, activeReps, onRepChange, onSync 
}) => {
  if (exercises.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
         <div className="text-6xl opacity-20">🔋</div>
         <p className="text-sm font-black text-slate-500 uppercase tracking-widest italic">Protocolo de Descarga Activa para hoy.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {exercises.map((ex, idx) => {
        const expanded = expandedEx === ex.name;
        const completed = isCompleted(ex.name);
        const repsData = activeReps[ex.name] || Array(ex.sets).fill(parseInt(ex.reps) || 0);

        return (
          <div 
            key={idx} 
            className={`glass rounded-[2.5rem] border-slate-800 overflow-hidden transition-all duration-500 ${completed ? 'opacity-50 border-emerald-500/20' : expanded ? 'border-blue-500/40 shadow-2xl scale-[1.01]' : 'hover:border-slate-700'}`}
          >
            <div 
              className="p-6 cursor-pointer flex items-center justify-between"
              onClick={() => !completed && setExpandedEx(expanded ? null : ex.name)}
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-slate-800">
                  <img src={ex.image} className="w-full h-full object-cover" alt={ex.name} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">{ex.name}</h4>
                    {completed && <span className="text-emerald-400 text-xs font-black">✓ SYNC</span>}
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{ex.sets} SERIES x {ex.reps} REPS</p>
                </div>
              </div>
              {!completed && (
                <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center transition-transform duration-300 ${expanded ? 'rotate-180 text-blue-400 border-blue-500/30' : 'text-slate-500'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                </div>
              )}
            </div>

            {expanded && !completed && (
              <div className="px-8 pb-8 space-y-8 animate-in slide-in-from-top-4 duration-300">
                <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent"></div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ajuste de Repeticiones por Serie</p>
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Volumen: {repsData.reduce((a,b)=>a+b,0)} reps</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    {repsData.map((repValue, sIdx) => (
                      <div key={sIdx} className="space-y-2 text-center">
                        <label className="text-[9px] font-black text-slate-600 uppercase">Serie {sIdx + 1}</label>
                        <input 
                          type="number"
                          value={repValue}
                          onChange={(e) => onRepChange(ex.name, sIdx, e.target.value)}
                          className="w-14 h-14 bg-slate-950 border-2 border-slate-800 rounded-2xl text-center font-black text-xl text-white focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all shadow-inner"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-1">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">RIR Objetivo</p>
                      <p className="text-sm font-black text-white">{ex.rir}</p>
                   </div>
                   <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-1">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Tempo Sugerido</p>
                      <p className="text-sm font-black text-cyan-400">{ex.tempo || 'Controlado'}</p>
                   </div>
                </div>

                <button 
                  onClick={() => onSync(ex)}
                  className="w-full py-5 bg-white text-slate-950 font-black rounded-3xl text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:bg-cyan-400 active:scale-95 transition-all"
                >
                  Finalizar y Sincronizar Atlas
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ExerciseTracker;
