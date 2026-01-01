
import React from 'react';
import { DailyLog } from '../../types';

interface Props {
  session: DailyLog;
}

const LabMetricsGrid: React.FC<Props> = ({ session }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass p-8 rounded-[2.5rem] border-slate-800 space-y-4 shadow-xl md:col-span-1">
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Intensidad Cardíaca</h4>
          <span className="text-rose-400 font-bold text-xs">Pico: {session.walkMaxHR} bpm</span>
        </div>
        <div className="h-1.5 w-full bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
          <div className="h-full bg-cyan-500 w-[70%] shadow-[0_0_10px_rgba(34,211,238,0.4)]"></div>
        </div>
        <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed">
          Zonas: {session.walkHRZones || 'Calibrando zonas de entrenamiento...'}
        </p>
      </div>

      <div className="glass p-8 rounded-[2.5rem] border-slate-800 space-y-4 shadow-xl md:col-span-1 text-center">
         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Biomecánica de Zancada</p>
         <div className="flex justify-around items-end h-full pb-2">
            <div>
              <p className="text-3xl font-black text-white">{session.walkStrideAvg || '0'}</p>
              <p className="text-[8px] font-black text-blue-400 uppercase">Avg (cm)</p>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div>
              <p className="text-3xl font-black text-white">{session.walkStrideMax || '0'}</p>
              <p className="text-[8px] font-black text-cyan-400 uppercase">Max (cm)</p>
            </div>
         </div>
      </div>

      <div className="glass p-8 rounded-[2.5rem] border-slate-800 space-y-4 shadow-xl md:col-span-1 text-center">
         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Dinámica de Cadencia</p>
         <div className="flex justify-around items-end h-full pb-2">
            <div>
              <p className="text-3xl font-black text-white">{session.walkCadenceAvg || '0'}</p>
              <p className="text-[8px] font-black text-emerald-400 uppercase">Avg (ppm)</p>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div>
              <p className="text-3xl font-black text-white">{session.walkCadenceMax || '0'}</p>
              <p className="text-[8px] font-black text-emerald-500 uppercase">Max (ppm)</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LabMetricsGrid;
