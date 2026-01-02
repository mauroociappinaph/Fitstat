
import React from 'react';

type SubTab = 'ejercicio_dia' | 'daily_focus' | 'rutina' | 'atlas' | 'progreso';

interface Props {
  activeTab: SubTab;
  setActiveTab: (tab: SubTab) => void;
  themeClass: string;
}

const StrengthTabs: React.FC<Props> = ({ activeTab, setActiveTab, themeClass }) => {
  const tabs = [
    { id: 'daily_focus', label: 'Ejercicio del Día' },
    { id: 'ejercicio_dia', label: 'Registro' },
    { id: 'rutina', label: 'Rutina' },
    { id: 'atlas', label: 'Atlas' },
    { id: 'progreso', label: 'Progreso' }
  ] as const;

  return (
    <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800 w-full md:w-auto shadow-xl overflow-x-auto scrollbar-hide gap-1">
      {tabs.map(tab => (
        <button 
          key={tab.id} 
          onClick={() => setActiveTab(tab.id)} 
          className={`shrink-0 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? `bg-${themeClass}-600 text-white shadow-lg shadow-${themeClass}-600/20` : 'text-slate-500 hover:text-white'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default StrengthTabs;
