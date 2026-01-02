
import React from 'react';
import { ExerciseTemplate } from '../../types';

interface Props {
  exercises: ExerciseTemplate[];
  themeColor: string;
}

const RoutineDisplay: React.FC<Props> = ({ exercises, themeColor }) => {
  return (
    <div className="space-y-6">
      {exercises.map((ex, i) => (
        <div key={i} className={`glass rounded-[2.5rem] border-slate-800 flex flex-col md:flex-row p-6 gap-6 group hover:border-${themeColor}-500/40 transition-all shadow-lg`}>
          <div className="md:w-32 h-32 rounded-3xl overflow-hidden shrink-0 border border-slate-800/50">
            <img src={ex.image} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={ex.name} />
          </div>
          <div className="flex-1 space-y-3">
             <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">{ex.name}</h4>
             <div className="flex flex-wrap gap-3 text-[10px] font-black uppercase tracking-widest text-blue-400">
               <span className="px-3 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20">{ex.sets} Series</span>
               <span className="px-3 py-1 bg-cyan-500/10 rounded-lg border border-cyan-500/20">{ex.reps} Reps</span>
               <span className="px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">RIR {ex.rir}</span>
             </div>
             <p className="text-xs text-slate-500 font-medium italic border-l-2 border-slate-800 pl-4">"{ex.instruction}"</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoutineDisplay;
