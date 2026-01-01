
import React from 'react';
import { useProtocolData } from '../hooks/useProtocolData';
import {
  PhaseTabs,
  PhaseHeroCard,
  WeeklySchedule,
  RoutineDrawer,
  ProtocolRules
} from './protocol';

const ProtocolView: React.FC = () => {
  const {
    activePhaseTab,
    setActivePhaseTab,
    selectedPhase,
    isCurrentPhase,
    selectedRoutine,
    handleRoutineClick,
    closeRoutineDrawer,
    phases,
    rules,
    targetWeight
  } = useProtocolData();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-24 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">PLAN MAESTRO</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Hoja de Ruta de Ingeniería de Salud</p>
        </div>
        <PhaseTabs 
          phases={phases} 
          activePhaseTab={activePhaseTab} 
          setActivePhaseTab={setActivePhaseTab} 
        />
      </div>

      <PhaseHeroCard 
        phase={selectedPhase} 
        isCurrentPhase={isCurrentPhase} 
        targetWeight={targetWeight} 
      />

      <WeeklySchedule 
        routines={selectedPhase.routines} 
        onRoutineClick={handleRoutineClick} 
      />

      <RoutineDrawer 
        selectedRoutine={selectedRoutine} 
        onClose={closeRoutineDrawer} 
      />

      <ProtocolRules rules={rules} />
    </div>
  );
};

export default ProtocolView;
