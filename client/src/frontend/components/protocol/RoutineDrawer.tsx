
import React from 'react';
import { ExerciseTemplate } from '@/shared/types';

interface Props {
  selectedRoutine: { day: string, title: string, exercises: ExerciseTemplate[] } | null;
  onClose: () => void;
}

const RoutineDrawer: React.FC<Props> = ({ selectedRoutine, onClose }) => {
  if (!selectedRoutine) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative glass w-full max-w-2xl max-h-[85vh] md:max-h-[80vh] rounded-[3rem] border-slate-800 overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
        <div className="p-8 border-b border-slate-800 flex justify-between items-center shrink-0 bg-slate-900/50">
           <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">{selectedRoutine.day}</p>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{selectedRoutine.title}</h3>
           </div>
           <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
          {selectedRoutine.exercises.length > 0 ? (
            selectedRoutine.exercises.map((ex, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-6 p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-blue-500/20 transition-all group">
                <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                  <img src={ex.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={ex.name} />
                </div>
                <div className="flex-1 space-y-3">
                   <div className="flex justify-between items-start">
                      <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">{ex.name}</h4>
                      <span className="text-[8px] font-black px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded uppercase">{ex.muscleGroup}</span>
                   </div>
                   <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-slate-800 pl-4">"{ex.instruction}"</p>
                   <div className="flex gap-4 pt-2">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-slate-600 uppercase">Series x Reps</span>
                        <span className="text-sm font-black text-white">{ex.sets} x {ex.reps}</span>
                      </div>
                      <div className="flex flex-col border-l border-slate-800 pl-4">
                        <span className="text-[8px] font-black text-slate-600 uppercase">RIR / Esfuerzo</span>
                        <span className="text-sm font-black text-emerald-400">{ex.rir}</span>
                      </div>
                      {ex.tempo && (
                        <div className="flex flex-col border-l border-slate-800 pl-4">
                          <span className="text-[8px] font-black text-slate-600 uppercase">Tempo</span>
                          <span className="text-sm font-black text-cyan-400">{ex.tempo}</span>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center space-y-4">
               <div className="text-6xl opacity-20">🔋</div>
               <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Protocolo de Carga Cero / Descanso</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-900/50 border-t border-slate-800 shrink-0 text-center">
           <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Protocolo FitStat AI v4.0 - Basado en Evidencia</p>
        </div>
      </div>
    </div>
  );
};

export default RoutineDrawer;
