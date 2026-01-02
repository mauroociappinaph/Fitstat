
import { useMemo } from 'react';
import { useAppStore } from '@/frontend/stores/useAppStore';
import { calculateReadiness, getMacroTargets } from '@/shared/utils/healthMath';

export const useDashboardData = () => {
  const { dailyLogs, profile, selectedDate } = useAppStore();

  const latestLog = useMemo(() => {
    return dailyLogs.find(l => l.date === selectedDate) || dailyLogs[0] || { 
      weight: profile.initialWeight, 
      steps: 0, 
      trainingCalories: 0, 
      walkCalories: 0, 
      date: selectedDate, 
      waterMl: 0, 
      proteinG: 0,
      trainingDone: false,
      trainingType: 'Descanso',
      sleepHours: 8
    };
  }, [dailyLogs, selectedDate, profile.initialWeight]);

  const readinessScore = useMemo(() => calculateReadiness(dailyLogs, profile), [dailyLogs, profile]);

  const proteinStatus = useMemo(() => {
    const target = Math.round(latestLog.weight * 2.2);
    const progress = ((latestLog.proteinG || 0) / (target || 1)) * 100;
    return { 
      progress, 
      target, 
      current: latestLog.proteinG || 0, 
      isAlert: (latestLog.proteinG || 0) < (target * 0.7)
    };
  }, [latestLog]);

  // FIX: Calculate progress percentage towards target weight
  const progressPercent = useMemo(() => {
    const totalToLose = profile.initialWeight - profile.targetWeight;
    const lostSoFar = profile.initialWeight - latestLog.weight;
    if (totalToLose <= 0) return 100;
    return Math.max(0, Math.min(100, (lostSoFar / totalToLose) * 100));
  }, [profile.initialWeight, profile.targetWeight, latestLog.weight]);

  // FIX: Format daily logs for the biometric trend chart
  const timelineData = useMemo(() => {
    return [...dailyLogs]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(log => {
        const kcalIn = log.meals?.reduce((acc, m) => acc + (m.calories || 0), 0) || 0;
        const pTarget = log.weight * 2.2;
        const adherence = Math.min(100, ((log.proteinG || 0) / (pTarget || 1)) * 100);
        
        return {
          date: log.date.split('-').slice(1).reverse().join('/'),
          weight: log.weight,
          steps: log.steps,
          calories: kcalIn,
          adherence: adherence
        };
      });
  }, [dailyLogs]);

  const metabolicAdjustment = useMemo(() => {
    const targets = getMacroTargets(latestLog.weight, latestLog.trainingType || '', latestLog.trainingDone);
    const trainType = (latestLog.trainingType || '').toLowerCase();
    
    let mode = '⚡ MODERATE OUTPUT';
    let modeColor = 'text-cyan-400';
    let modeBg = 'bg-cyan-500/10';
    let description = 'Entrenamiento estándar. Glucógeno estable.';

    if (trainType.includes('pierna')) {
      mode = '🔥 HIGH OUTPUT (PIERNAS)';
      modeColor = 'text-rose-400';
      modeBg = 'bg-rose-500/10';
      description = 'Día de pierna detectado. Superávit estratégico de carbohidratos.';
    } else if (trainType.includes('descanso') || !latestLog.trainingDone) {
      mode = '💤 RECOVERY DAY';
      modeColor = 'text-emerald-400';
      modeBg = 'bg-emerald-500/10';
      description = 'Recuperación activa. Carbohidratos bajos para máxima oxidación de grasa.';
    }
    
    return { 
      proteinTarget: targets.p, 
      carbTarget: targets.c, 
      kcalTarget: targets.kcal, 
      mode, modeColor, modeBg, description 
    };
  }, [latestLog]);

  return {
    latestLog,
    readinessScore,
    proteinStatus,
    metabolicAdjustment,
    profile,
    progressPercent,
    timelineData
  };
};
