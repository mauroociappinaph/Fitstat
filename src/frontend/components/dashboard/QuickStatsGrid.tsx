
import React from 'react';

interface Props {
  weight: number;
  progressPercent: number;
  steps: number;
  waterL: number;
  isToday: boolean;
}

const QuickStatsGrid: React.FC<Props> = ({ weight, progressPercent, steps, waterL, isToday }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="glass p-6 rounded-[2rem] border-slate-800/60 shadow-xl">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Peso {isToday ? 'Hoy' : 'Selected'}</p>
        <h3 className="text-3xl font-black text-white mt-2">{weight}<span className="text-lg ml-1 text-slate-500 font-bold">kg</span></h3>
      </div>
      <div className="glass p-6 rounded-[2rem] border-emerald-500/20 bg-emerald-500/5 shadow-xl">
        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Progreso Meta</p>
        <h3 className="text-3xl font-black text-white mt-2">{progressPercent.toFixed(1)}<span className="text-lg ml-1 text-slate-500 font-bold">%</span></h3>
      </div>
      <div className="glass p-6 rounded-[2rem] border-slate-800/60 shadow-xl">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Pasos {isToday ? 'Hoy' : ''}</p>
        <h3 className="text-3xl font-black text-white mt-2">{steps.toLocaleString()}</h3>
      </div>
      <div className="glass p-6 rounded-[2rem] border-blue-500/20 bg-blue-500/5 shadow-xl">
        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Agua {isToday ? 'Hoy' : ''}</p>
        <h3 className="text-3xl font-black text-white mt-2">{waterL}<span className="text-lg ml-1 text-slate-500 font-bold">L</span></h3>
      </div>
    </div>
  );
};

export default QuickStatsGrid;
