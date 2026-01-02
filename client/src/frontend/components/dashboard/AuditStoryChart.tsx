
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  meals: any[];
  hourlyBurn: number; // Basal / 24
}

const AuditStoryChart: React.FC<Props> = ({ meals, hourlyBurn }) => {
  const data = [];
  let cumulativeIn = 0;
  let cumulativeOut = 0;

  // Generamos 24 horas de datos
  for (let h = 0; h <= 24; h++) {
    cumulativeOut += hourlyBurn;
    
    // Si hay comidas en esta hora (simulado o real si tenemos timestamp)
    const hourMeals = meals.filter(m => {
      if (!m.timestamp) return false;
      return parseInt(m.timestamp.split(':')[0]) === h;
    });

    if (hourMeals.length > 0) {
      cumulativeIn += hourMeals.reduce((acc, m) => acc + m.calories, 0);
    } else if (h === 8 && meals.some(m => m.type === 'Desayuno')) cumulativeIn += meals.find(m => m.type === 'Desayuno').calories;
    else if (h === 13 && meals.some(m => m.type === 'Almuerzo')) cumulativeIn += meals.find(m => m.type === 'Almuerzo').calories;
    else if (h === 17 && meals.some(m => m.type === 'Merienda')) cumulativeIn += meals.find(m => m.type === 'Merienda').calories;
    else if (h === 21 && meals.some(m => m.type === 'Cena')) cumulativeIn += meals.find(m => m.type === 'Cena').calories;

    data.push({
      hour: `${h}:00`,
      ingesta: cumulativeIn,
      gasto: Math.round(cumulativeOut)
    });
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="hour" stroke="#64748b" fontSize={9} tickLine={false} axisLine={false} />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px' }}
            itemStyle={{ fontSize: '10px' }}
          />
          <Area type="monotone" dataKey="ingesta" stroke="#22d3ee" fillOpacity={1} fill="url(#colorIn)" strokeWidth={3} />
          <Area type="monotone" dataKey="gasto" stroke="#10b981" fillOpacity={1} fill="url(#colorOut)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AuditStoryChart;
