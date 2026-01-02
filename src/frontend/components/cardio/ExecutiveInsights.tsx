
import React from 'react';
import { AdvancedCardioInsight } from '../../types';

interface Props {
  insights: AdvancedCardioInsight | null;
  isLoading: boolean;
}

const ExecutiveInsights: React.FC<Props> = ({ insights, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-12 glass rounded-[3rem] border-slate-800 flex flex-col items-center justify-center gap-4 animate-pulse">
        <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Generando Análisis de Ingeniería...</p>
      </div>
    );
  }

  if (!insights) return null;

  const items = [
    { title: 'Eficiencia Pico', icon: '🏆', text: insights.efficiencyPeak, color: 'border-cyan-500/20 bg-cyan-500/5' },
    { title: 'Carga Aeróbica', icon: '🔋', text: insights.aerobicLoad, color: 'border-emerald-500/20 bg-emerald-500/5' },
    { title: 'Proyección 30 Días', icon: '📈', text: insights.projection30d, color: 'border-purple-500/20 bg-purple-500/5' },
    { title: 'Sugerencia Biomecánica', icon: '🧬', text: insights.biomechanicalSuggestion, color: 'border-amber-500/20 bg-amber-500/5' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item, i) => (
        <div key={i} className={`glass p-6 rounded-[2rem] ${item.color} space-y-3 shadow-xl`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{item.icon}</span>
            <h4 className="text-[11px] font-black text-white uppercase tracking-widest">{item.title}</h4>
          </div>
          <p className="text-xs text-slate-300 font-medium leading-relaxed italic">"{item.text}"</p>
        </div>
      ))}
    </div>
  );
};

export default ExecutiveInsights;
