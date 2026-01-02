
import React from 'react';

interface Props {
  routines: Record<string, string>;
  onRoutineClick: (day: string, routine: string) => void;
}

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const WeeklySchedule: React.FC<Props> = ({ routines, onRoutineClick }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end px-1">
        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Cronograma de Entrenamiento</h3>
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Haz clic para ver detalles</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DAYS.map((day) => {
          const routine = (routines as any)[day];
          const isRest = routine.toLowerCase().includes('descanso') || routine.toLowerCase().includes('recuperación');
          
          return (
            <button 
              key={day} 
              onClick={() => onRoutineClick(day, routine)}
              className={`glass p-6 rounded-[2rem] border-slate-800 transition-all text-left group hover:scale-[1.02] active:scale-95 ${isRest ? 'opacity-60 grayscale' : 'hover:border-blue-500/30'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{day}</p>
                {!isRest && <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs">👁️ Ver</span>}
              </div>
              <div className="space-y-2">
                <h4 className={`text-lg font-black uppercase italic tracking-tighter leading-tight ${isRest ? 'text-slate-400' : 'text-white'}`}>
                  {routine}
                </h4>
                <div className={`h-1 w-12 rounded-full ${isRest ? 'bg-slate-800' : 'bg-blue-600'}`}></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklySchedule;
