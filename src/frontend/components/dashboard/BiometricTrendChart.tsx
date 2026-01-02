
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type MetricType = 'weight' | 'steps' | 'calories' | 'adherence';

interface Props {
  data: any[];
}

const BiometricTrendChart: React.FC<Props> = ({ data }) => {
  const [activeMetric, setActiveMetric] = useState<MetricType>('weight');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="glass p-8 rounded-[2.5rem] border-slate-800/60 shadow-inner min-w-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Tendencia Biométrica</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Historial Cronológico (Mín. 8 Días Calibrados)</p>
        </div>
        <div className="flex flex-wrap bg-slate-900/50 p-1 rounded-xl border border-slate-800 gap-1">
          {['weight', 'steps', 'calories', 'adherence'].map((m) => (
            <button 
              key={m}
              onClick={() => setActiveMetric(m as MetricType)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-widest ${activeMetric === m ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-500 hover:text-white border border-transparent'}`}
            >
              {m === 'weight' ? 'Peso' : m === 'steps' ? 'Pasos' : m === 'calories' ? 'Energía' : 'Disciplina'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-[350px] min-h-[350px] w-full relative">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false} 
                fontWeight="black"
                interval={Math.ceil(data.length / 8)} // Asegura que las etiquetas no se amontonen
              />
              <YAxis 
                hide 
                domain={activeMetric === 'weight' ? ['dataMin - 0.2', 'dataMax + 0.2'] : ['auto', 'auto']} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                cursor={{ stroke: '#1e293b', strokeWidth: 1 }}
              />
              <Line 
                type="monotone" 
                dataKey={activeMetric} 
                stroke={activeMetric === 'weight' ? '#22d3ee' : activeMetric === 'steps' ? '#10b981' : activeMetric === 'calories' ? '#f59e0b' : '#3b82f6'} 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#020617', strokeWidth: 2, stroke: activeMetric === 'weight' ? '#22d3ee' : '#10b981' }} 
                activeDot={{ r: 6, fill: '#fff' }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default BiometricTrendChart;
