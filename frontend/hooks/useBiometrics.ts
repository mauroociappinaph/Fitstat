
import { useMemo } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { calculateReadiness, getMacroTargets } from '../../backend/services/healthMath';
import { DailyLog } from '../types';

export const useBiometrics = () => {
  const { dailyLogs, profile, selectedDate } = useAppStore();

  const currentLog = useMemo((): DailyLog => {
    const existing = dailyLogs.find(l => l.date === selectedDate);
    if (existing) return existing;

    return { 
      date: selectedDate,
      weight: dailyLogs[0]?.weight || profile.initialWeight,
      steps: 0,
      waterMl: 0,
      proteinG: 0,
      sleepHours: 8,
      trainingDone: false,
      trainingType: 'Descanso',
      trainingCalories: 0,
      trainingAvgHR: 0,
      walkActivity: false,
      walkDistanceKm: 0,
      walkDurationMin: 0,
      walkAvgHR: 0,
      walkCalories: 0,
      meals: []
    };
  }, [dailyLogs, selectedDate, profile.initialWeight]);

  const targets = useMemo(() => 
    getMacroTargets(currentLog.weight, currentLog.trainingType || '', currentLog.trainingDone || false),
    [currentLog.weight, currentLog.trainingType, currentLog.trainingDone]
  );

  const readiness = useMemo(() => 
    calculateReadiness(dailyLogs, profile),
    [dailyLogs, profile]
  );

  const nutritionTotals = useMemo(() => {
    if (!currentLog.meals) return { p: currentLog.proteinG || 0, c: 0, f: 0, kcal: 0 };
    return currentLog.meals.reduce((acc, m) => ({
      p: acc.p + (m.protein || 0),
      c: acc.c + (m.carbs || 0),
      f: acc.f + (m.fats || 0),
      kcal: acc.kcal + (m.calories || 0)
    }), { p: 0, c: 0, f: 0, kcal: 0 });
  }, [currentLog]);

  return {
    currentLog,
    targets,
    readiness,
    nutritionTotals,
    profile,
    selectedDate
  };
};
