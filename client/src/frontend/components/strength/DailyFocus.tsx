
import React from 'react';
import { ExerciseTemplate } from '../../types';

interface Props {
  exercises: ExerciseTemplate[];
}

const DailyFocus: React.FC<Props> = ({ exercises }) => {
  if (exercises.length === 0) {
    return (
      <div className="py-24 text-center space-y-6">
        <div className="text-8xl opacity-10 grayscale">🔋</div>
        <p className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">Protocolo de Descarga Activa</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      <div className="px-1 space-y-1">
        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Foco de Ejecución</h3>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Guía visual para optimización mecánica</p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {exercises.map((ex, idx) => (
          <div key={idx} className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-[3.5rem] opacity-0 group-hover:opacity-10 transition-all duration-700 blur-xl"></div>
            
            <div className="glass p-8 rounded-[3.5rem] border-slate-800 relative overflow-hidden flex flex-col md:flex-row gap-10 shadow-2xl">
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto h-80 rounded-[2.5rem] overflow-hidden border border-slate-800/50 shadow-inner shrink-0">
                <img 
                  src={ex.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" 
                  alt={ex.name} 
                />
              </div>

              <div className="flex-1 flex flex-col justify-between py-2">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">{ex.muscleGroup}</span>
                      <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">{ex.name}</h4>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-slate-400 text-lg">
                      0{idx + 1}
                    </div>
                  </div>

                  <div className="p-6 bg-slate-950/50 rounded-[2rem] border border-slate-800/50 italic text-slate-400 text-sm leading-relaxed border-l-4 border-l-blue-500/50">
                    "{ex.instruction}"
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="glass p-6 rounded-3xl border-slate-800/60 text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Series</p>
                    <p className="text-4xl font-black text-white">{ex.sets}</p>
                  </div>
                  <div className="glass p-6 rounded-3xl border-slate-800/60 text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Repeticiones</p>
                    <p className="text-4xl font-black text-blue-400">{ex.reps}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-blue-500/10 rounded-[2.5rem] border border-blue-500/20 text-center">
        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Prioriza la técnica sobre la carga para garantizar hipertrofia real.</p>
      </div>
    </div>
  );
};

export default DailyFocus;
