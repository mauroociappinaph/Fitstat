
import React, { useState } from 'react';
import StrengthView from './StrengthView';
import CardioLab from './CardioLab';

const TrainingHub: React.FC = () => {
  const [subTab, setSubTab] = useState<'strength' | 'cardio'>('strength');

  return (
    <div className="space-y-6">
      <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 w-full shadow-xl mb-6 overflow-x-auto scrollbar-hide gap-1">
        <button 
          onClick={() => setSubTab('strength')}
          className={`flex-1 shrink-0 px-4 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${subTab === 'strength' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-500 hover:text-white'}`}
        >
          Fuerza Atlas
        </button>
        <button 
          onClick={() => setSubTab('cardio')}
          className={`flex-1 shrink-0 px-4 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${subTab === 'cardio' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30' : 'text-slate-500 hover:text-white'}`}
        >
          Cardio Lab
        </button>
      </div>

      <div className="animate-in fade-in duration-500">
        {subTab === 'strength' ? <StrengthView /> : <CardioLab />}
      </div>
    </div>
  );
};

export default TrainingHub;
