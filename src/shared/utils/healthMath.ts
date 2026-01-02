
import { UserProfile, DailyLog, AdaptiveMetabolism } from '@/shared/types';

export const calculateBMR = (profile: UserProfile, weight: number): number => {
  if (profile.bodyFatEstimate) {
    const leanMass = weight * (1 - profile.bodyFatEstimate / 100);
    return 370 + (21.6 * leanMass);
  }
  return profile.gender === 'male'
    ? (10 * weight) + (6.25 * profile.height) - (5 * profile.age) + 5
    : (10 * weight) + (6.25 * profile.height) - (5 * profile.age) - 161;
};

export const getMacroTargets = (weight: number, trainType: string, isTraining: boolean) => {
  const p = Math.round(weight * 2.2);
  const f = Math.round(weight * 0.8);
  let carbMultiplier = 1.5;
  const type = (trainType || '').toLowerCase();
  
  if (isTraining) {
    carbMultiplier = type.includes('pierna') ? 2.5 : 2.0;
  }
  
  const c = Math.round(weight * carbMultiplier);
  const kcal = (p * 4) + (c * 4) + (f * 9);
  
  return { p, c, f, kcal, carbMultiplier };
};

export const calculateReadiness = (logs: DailyLog[], profile: UserProfile): number => {
  if (!logs || logs.length === 0) return 0;
  const recent = [...logs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  
  let score = 0;
  const avgSleep = recent.reduce((acc, l) => acc + (l.sleepHours || 8), 0) / recent.length;
  score += (Math.min(avgSleep, 8) / 8) * 30;
  
  const avgWater = recent.reduce((acc, l) => acc + (l.waterMl || 2000), 0) / recent.length;
  score += (Math.min(avgWater, 3500) / 3500) * 20;
  
  const avgSteps = recent.reduce((acc, l) => acc + (l.steps || 5000), 0) / recent.length;
  score += (Math.min(avgSteps, 10000) / 10000) * 30;

  const currentWeight = recent[0]?.weight || profile.initialWeight;
  const targets = getMacroTargets(currentWeight, '', false);
  const avgProt = recent.reduce((acc, l) => acc + (l.proteinG || 0), 0) / recent.length;
  score += (Math.min(avgProt, targets.p) / (targets.p || 1)) * 20;

  return Math.round(score);
};

export const calculateAdaptiveTDEE = (logs: DailyLog[], profile: UserProfile, targetDate: string): AdaptiveMetabolism => {
  const log = logs.find(l => l.date === targetDate) || logs[0];
  const currentWeight = log?.weight || profile.initialWeight;
  const bmr = calculateBMR(profile, currentWeight);
  
  const neat = (log?.steps || 0) * 0.04;
  const exercise = (log?.trainingCalories || 0) + (log?.walkCalories || 0);
  const theoreticalTDEE = bmr + neat + exercise;

  if (logs.length < 7) {
    return { theoreticalTDEE, actualTDEE: theoreticalTDEE, metabolicEfficiency: 100, deltaReason: 'Calibrando Baseline...' };
  }

  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  const weightDelta = sortedLogs[0].weight - sortedLogs[sortedLogs.length - 1].weight;
  const avgIntake = sortedLogs.reduce((acc, l) => {
    const dailyKcal = l.meals?.reduce((mAcc, m) => mAcc + m.calories, 0) || 0;
    return acc + dailyKcal;
  }, 0) / sortedLogs.length;

  const actualTDEE = avgIntake - ((weightDelta * 7700) / sortedLogs.length);
  const efficiency = (actualTDEE / theoreticalTDEE) * 100;

  return { 
    theoreticalTDEE, 
    actualTDEE, 
    metabolicEfficiency: efficiency, 
    deltaReason: efficiency < 95 ? "Metabolismo Lento / Adaptación" : "Metabolismo Eficiente" 
  };
};
