
import { useMemo } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { calculateAdaptiveTDEE, getMacroTargets, calculateReadiness } from '../utils/healthMath';
import { DailyLog } from '../types';

export const useBiometrics = () => {
  const { dailyLogs, profile, selectedDate } = useAppStore();

  // Fix: Provide a full implementation of DailyLog in the fallback case to ensure correct typing across the app.
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

  const metabolism = useMemo(() => 
    calculateAdaptiveTDEE(dailyLogs, profile, selectedDate),
    [dailyLogs, profile, selectedDate]
  );

  // Fix: Explicitly type the accumulator in the reduce function to correctly calculate nutrient totals and avoid MealEntry inference errors.
  const nutritionTotals = useMemo(() => {
    if (!currentLog.meals) return { p: 0, c: 0, f: 0, kcal: 0 };
    return currentLog.meals.reduce((acc, m) => ({
      p: acc.p + (m.protein || 0),
      c: acc.c + (m.carbs || 0),
      f: acc.f + (m.fats || 0),
      kcal: acc.kcal + (m.calories || 0)
    }), { p: 0, c: 0, f: 0, kcal: 0 } as { p: number; c: number; f: number; kcal: number });
  }, [currentLog.meals]);

  return {
    currentLog,
    targets,
    readiness,
    metabolism,
    nutritionTotals,
    profile,
    selectedDate
  };
};
