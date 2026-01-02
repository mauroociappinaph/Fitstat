
import React from 'react';
import { StrengthSet } from '@/shared/types';

interface Props {
  logs: StrengthSet[];
  selectedDate: string;
}

const AtlasHistory: React.FC<Props> = ({ logs, selectedDate }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end px-2">
        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Atlas de Cargas</h3>
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Resumen Histórico</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {[...logs].reverse().slice(0, 15).map((log) => (
          <div key={log.id} className="glass p-5 rounded-[1.5rem] border-slate-800 flex justify-between items-center group hover:bg-white/5 transition-all shadow-md">
            <div className="flex items-center gap-4">
              <div className={`w-1.5 h-10 rounded-full ${log.date === selectedDate ? 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-slate-800'}`}></div>
              <div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{log.date.split('-').reverse().join('/')}</p>
                <p className="text-sm font-black text-white uppercase italic tracking-tight">{log.exercise}</p>
              </div>
            </div>
            <div className="text-right">
               <p className="text-xs font-black text-cyan-400">{log.sets} x {log.reps}</p>
               <p className="text-[8px] font-black text-slate-500 uppercase">
                V-REAL: {log.actualReps ? log.actualReps.reduce((a,b)=>a+b,0) : (log.sets * log.reps)} REPS
               </p>
            </div>
          </div>
        ))}
        {logs.length === 0 && (
           <div className="py-20 text-center opacity-30 italic text-sm">No hay registros en el Atlas aún.</div>
        )}
      </div>
    </div>
  );
};

export default AtlasHistory;
