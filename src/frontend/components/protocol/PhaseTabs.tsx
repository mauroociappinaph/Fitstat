
import React from 'react';

interface Props {
  phases: any[];
  activePhaseTab: number;
  setActivePhaseTab: (idx: number) => void;
}

const PhaseTabs: React.FC<Props> = ({ phases, activePhaseTab, setActivePhaseTab }) => {
  return (
    <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800 w-full md:w-auto shadow-xl overflow-x-auto scrollbar-hide gap-1">
      {phases.map((phase, idx) => (
        <button 
          key={idx}
          onClick={() => setActivePhaseTab(idx)}
          className={`shrink-0 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activePhaseTab === idx ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-500 hover:text-white'}`}
        >
          Mes {phase.rangeMonths[0] === 0 ? '1' : phase.rangeMonths[0]}-{phase.rangeMonths[1]}
        </button>
      ))}
    </div>
  );
};

export default PhaseTabs;
