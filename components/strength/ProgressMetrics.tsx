
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface Props {
  volumeHistory: any[];
  volumeTrend: any;
  selectedDate: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-black text-white">{payload[0].value} <span className="text-xs text-cyan-400">REPS</span></p>
      </div>
    );
  }
  return null;
};

const ProgressMetrics: React.FC<Props> = ({ volumeHistory, volumeTrend, selectedDate }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const todayVolume = volumeHistory.find(h => h.fullDate === selectedDate)?.volume || 0;
  const avgVolume = volumeHistory.reduce((acc, h) => acc + h.volume, 0) / (volumeHistory.length || 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-[2.5rem] border-slate-800 flex flex-col justify-center items-center text-center space-y-2 shadow-xl hover:border-cyan-500/20 transition-all group">
           <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-2 group-hover:scale-110 transition-transform">📊</div>
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Volumen Hoy</p>
           <h3 className="text-5xl font-black text-white tracking-tighter">{todayVolume}</h3>
           <p className="text-[9px] font-black text-slate-600 uppercase">REPETICIONES TOTALES</p>
        </div>
        
        <div className={`glass p-8 rounded-[2.5rem] border-slate-800 flex flex-col justify-center items-center text-center space-y-2 shadow-xl transition-all ${volumeTrend?.isUp ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20'}`}>
           <div className={`w-10 h-10 rounded-xl ${volumeTrend?.isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'} flex items-center justify-center mb-2`}>
             {volumeTrend?.isUp ? '📈' : '📉'}
           </div>
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tendencia Carga</p>
           <h3 className={`text-5xl font-black tracking-tighter ${volumeTrend?.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
            {volumeTrend ? `${volumeTrend.isUp ? '+' : ''}${volumeTrend.percent}%` : '---'}
           </h3>
           <p className="text-[9px] font-black text-slate-600 uppercase">VS SESIÓN ANTERIOR</p>
        </div>

        <div className="glass p-8 rounded-[2.5rem] border-slate-800 flex flex-col justify-center items-center text-center space-y-2 shadow-xl hover:border-blue-500/20 transition-all group">
           <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-2 group-hover:scale-110 transition-transform">📅</div>
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Consistencia</p>
           <h3 className="text-5xl font-black text-blue-400 tracking-tighter">{volumeHistory.length}</h3>
           <p className="text-[9px] font-black text-slate-600 uppercase">SESIONES EN ATLAS</p>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="glass p-10 rounded-[3rem] border-slate-800 shadow-2xl space-y-8 overflow-hidden">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end px-1 gap-4">
            <div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Sobrecarga Progresiva Real</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Historial de Volumen Acumulado (Sets x Reps)</p>
            </div>
            <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800">
               <div className="flex items-center gap-2 px-3 py-1">
                 <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                 <span className="text-[8px] font-black text-slate-300 uppercase">Selección</span>
               </div>
               <div className="flex items-center gap-2 px-3 py-1">
                 <div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-700"></div>
                 <span className="text-[8px] font-black text-slate-300 uppercase">Historial</span>
               </div>
            </div>
         </div>
         
         <div className="h-[350px] w-full relative">
            {mounted && volumeHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeHistory} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#64748b" 
                    fontSize={10} 
                    fontWeight="black" 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10} 
                    interval={Math.ceil(volumeHistory.length / 10)}
                  />
                  <YAxis hide domain={[0, 'dataMax + 20']} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.03)'}} 
                    content={<CustomTooltip />}
                  />
                  <Bar dataKey="volume" radius={[12, 12, 0, 0]} barSize={volumeHistory.length > 20 ? 15 : 40} animationDuration={1500}>
                    {volumeHistory.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.fullDate === selectedDate ? '#22d3ee' : '#1e293b'} 
                        stroke={entry.fullDate === selectedDate ? '#22d3ee' : '#334155'}
                        strokeWidth={entry.fullDate === selectedDate ? 2 : 1}
                        className="transition-all duration-300"
                      />
                    ))}
                  </Bar>
                  <ReferenceLine 
                    y={avgVolume} 
                    stroke="#64748b" 
                    strokeDasharray="5 5" 
                    label={{ position: 'right', value: 'AVG', fill: '#64748b', fontSize: 9, fontWeight: 'black' }} 
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30">
                <div className="text-6xl mb-4">🔬</div>
                <p className="text-sm font-black uppercase italic tracking-widest text-slate-500">Esperando datos de entrenamiento para calibrar...</p>
              </div>
            )}
         </div>
         
         {/* Adaptive Coaching Card */}
         <div className="p-8 bg-blue-500/10 rounded-[2.5rem] border border-blue-500/20 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
            <p className="text-xs text-slate-300 font-bold italic leading-relaxed px-4">
              {volumeTrend && volumeTrend.isUp 
                ? `🚀 PROTOCOLO ÓPTIMO: Has incrementado tu volumen un ${volumeTrend.percent}% respecto a la última sesión. La adaptación hipertrófica está en pico máximo.` 
                : volumeTrend 
                ? `⚖️ CONTROL DE CARGA: El volumen ha variado un ${volumeTrend.percent}%. Este comportamiento es normal si hoy es un día de técnica o recuperación activa.`
                : "⚡ Registra al menos dos sesiones en el Atlas para activar el motor de tendencias de sobrecarga progresiva."}
            </p>
         </div>
      </div>
    </div>
  );
};

export default ProgressMetrics;
