
import React, { useState } from 'react';
import { useStrengthData } from '../hooks/useStrengthData';
import {
  StrengthTabs,
  ExerciseTracker,
  RoutineDisplay,
  AtlasHistory,
  ProgressMetrics,
  DailyFocus
} from './strength/index';

type SubTab = 'ejercicio_dia' | 'daily_focus' | 'rutina' | 'atlas' | 'progreso';

const StrengthView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('daily_focus');
  const data = useStrengthData();
  
  const themeClass = data.todayRoutine.isRecovery ? 'emerald' : 'blue';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-20 min-w-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
            {data.todayRoutine.isRecovery ? 'RECU-SYSTEM' : 'ATLAS-LOAD'}
          </h2>
          <p className={`text-${themeClass}-500 text-xs font-black uppercase tracking-[0.3em]`}>
            {data.todayRoutine.title}
          </p>
        </div>
        <StrengthTabs 
          activeTab={activeSubTab} 
          setActiveTab={setActiveSubTab} 
          themeClass={themeClass} 
        />
      </div>

      <div className="animate-in fade-in duration-500">
        {activeSubTab === 'daily_focus' && (
          <DailyFocus exercises={data.todayRoutine.exercises} />
        )}

        {activeSubTab === 'ejercicio_dia' && (
          <ExerciseTracker 
            exercises={data.todayRoutine.exercises}
            isCompleted={data.isCompleted}
            expandedEx={data.expandedEx}
            setExpandedEx={data.setExpandedEx}
            activeReps={data.activeReps}
            onRepChange={data.handleRepChange}
            onSync={data.syncExercise}
          />
        )}

        {activeSubTab === 'rutina' && (
          <RoutineDisplay 
            exercises={data.todayRoutine.exercises} 
            themeColor={themeClass} 
          />
        )}

        {activeSubTab === 'atlas' && (
          <AtlasHistory 
            logs={data.strengthLogs} 
            selectedDate={data.selectedDate} 
          />
        )}

        {activeSubTab === 'progreso' && (
          <ProgressMetrics 
            volumeHistory={data.volumeHistory}
            volumeTrend={data.volumeTrend}
            selectedDate={data.selectedDate}
          />
        )}
      </div>
    </div>
  );
};

export default StrengthView;
