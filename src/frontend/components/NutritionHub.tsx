
import React, { useState } from 'react';
import NutritionView from './NutritionView';
import MealLogView from './MealLogView';

const NutritionHub: React.FC = () => {
  const [subTab, setSubTab] = useState<'lab' | 'meals'>('lab');

  return (
    <div className="space-y-6">
      <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 w-full shadow-xl mb-6 overflow-x-auto scrollbar-hide gap-1">
        <button 
          onClick={() => setSubTab('lab')}
          className={`flex-1 shrink-0 px-4 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${subTab === 'lab' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-500 hover:text-white'}`}
        >
          Análisis Lab
        </button>
        <button 
          onClick={() => setSubTab('meals')}
          className={`flex-1 shrink-0 px-4 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${subTab === 'meals' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-500 hover:text-white'}`}
        >
          Matriz de Comidas
        </button>
      </div>

      <div className="animate-in fade-in duration-500">
        {subTab === 'lab' ? <NutritionView /> : <MealLogView />}
      </div>
    </div>
  );
};

export default NutritionHub;
