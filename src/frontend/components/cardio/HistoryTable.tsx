
import React from 'react';

interface Props {
  data: any[];
  baseline: number;
}

const HistoryTable: React.FC<Props> = ({ data, baseline }) => {
  return (
    <div className="glass rounded-[2.5rem] border-slate-800 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left min-w-[1300px]">
          <thead className="bg-slate-900/80 border-b border-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
            <tr>
              <th className="p-6">Fecha</th>
              <th className="p-6 text-center">Distancia (KM)</th>
              <th className="p-6 text-center">Velocidad (km/h)</th>
              <th className="p-6 text-center">FC (Med/Max)</th>
              <th className="p-6 text-center">Cadencia (Med/Max)</th>
              <th className="p-6 text-center">Zancada (Med/Max)</th>
              <th className="p-6 text-center">Zonas de FC</th>
              <th className="p-6 text-center">Eficiencia</th>
            </tr>
          </thead>
          <tbody>
            {data.slice().reverse().map((s, i) => (
              <tr key={i} className={`border-b border-slate-800/30 hover:bg-white/5 transition-all group ${!s.walkActivity ? 'opacity-30' : ''}`}>
                <td className="p-6 text-[11px] font-black text-white uppercase tracking-tighter">
                  {s.date.split('-').reverse().join('/')}
                </td>
                <td className="p-6 text-center text-xs font-bold text-slate-300">
                  {s.walkDistanceKm > 0 ? s.walkDistanceKm.toFixed(2) : '---'}
                </td>
                <td className="p-6 text-center text-xs font-black text-cyan-400">
                  {s.walkAvgSpeed ? s.walkAvgSpeed.toFixed(2) : '---'}
                </td>
                <td className="p-6 text-center text-xs font-bold text-white">
                  {s.walkAvgHR || '---'} <span className="text-[9px] text-slate-600">/ {s.walkMaxHR || '---'}</span>
                </td>
                <td className="p-6 text-center text-xs font-bold text-emerald-400">
                  {s.walkCadenceAvg || '---'} <span className="text-[9px] text-slate-600">/ {s.walkCadenceMax || '---'}</span>
                </td>
                <td className="p-6 text-center text-xs font-bold text-blue-400">
                  {s.walkStrideAvg || '---'} <span className="text-[9px] text-slate-600">/ {s.walkStrideMax || '---'}</span>
                </td>
                <td className="p-6 text-center">
                   <span className="text-[8px] font-black text-slate-500 uppercase truncate max-w-[180px] block">
                     {s.walkHRZones || '---'}
                   </span>
                </td>
                <td className="p-6 text-center">
                   <span className={`text-[10px] font-black ${s.efficiency >= baseline ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {s.efficiency > 0 ? `${s.efficiency.toFixed(1)} pts` : '---'}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-slate-900/50 text-center">
        <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Desliza horizontalmente para ver todas las métricas biométricas</p>
      </div>
    </div>
  );
};

export default HistoryTable;
