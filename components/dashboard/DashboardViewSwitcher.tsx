
import React from 'react';

interface Props {
  activeView: 'overview' | 'audit';
  setActiveView: (view: 'overview' | 'audit') => void;
}

const DashboardViewSwitcher: React.FC<Props> = ({ activeView, setActiveView }) => {
  return (
    <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800/60 w-full shadow-lg">
      {(['overview', 'audit'] as const).map((v) => (
        <button 
          key={v}
          onClick={() => setActiveView(v)}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === v ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-500 hover:text-white'}`}
        >
          {v === 'overview' ? 'Performance Hub' : 'Auditoría Diaria'}
        </button>
      ))}
    </div>
  );
};

export default DashboardViewSwitcher;
