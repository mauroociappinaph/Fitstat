
import { useState, useMemo } from 'react';
import { useAppStore } from '@/frontend/stores/useAppStore';
import { MASTER_PLAN } from '@/shared/constants/masterPlan';
import { ROUTINES } from '@/shared/constants/routines';
import { ExerciseTemplate } from '@/shared/types';

export const useProtocolData = () => {
  const { profile } = useAppStore();
  const [activePhaseTab, setActivePhaseTab] = useState(0);
  const [selectedRoutine, setSelectedRoutine] = useState<{ day: string, title: string, exercises: ExerciseTemplate[] } | null>(null);

  const currentPhaseIdx = useMemo(() => {
    const startDate = new Date(profile.startDate);
    const now = new Date();
    const diffMonths = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
    
    return MASTER_PLAN.phases.findIndex(p => diffMonths >= p.rangeMonths[0] && diffMonths < p.rangeMonths[1]);
  }, [profile.startDate]);

  const selectedPhase = MASTER_PLAN.phases[activePhaseTab];
  const isCurrentPhase = activePhaseTab === currentPhaseIdx || (currentPhaseIdx === -1 && activePhaseTab === 0);

  const handleRoutineClick = (day: string, routineTitle: string) => {
    const exercises = ROUTINES[routineTitle] || [];
    setSelectedRoutine({ day, title: routineTitle, exercises });
  };

  const closeRoutineDrawer = () => setSelectedRoutine(null);

  return {
    activePhaseTab,
    setActivePhaseTab,
    selectedPhase,
    isCurrentPhase,
    selectedRoutine,
    handleRoutineClick,
    closeRoutineDrawer,
    phases: MASTER_PLAN.phases,
    rules: MASTER_PLAN.rules,
    targetWeight: MASTER_PLAN.targetWeight
  };
};
