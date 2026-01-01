
import { UserProfile, DailyLog, AdaptiveMetabolism } from '../../frontend/types';

export const calculateBMR = (profile: UserProfile, weight: number): number => {
  return profile.gender === 'male'
    ? (10 * weight) + (6.25 * profile.height) - (5 * profile.age) + 5
    : (10 * weight) + (6.25 * profile.height) - (5 * profile.age) - 161;
};

export const getMacroTargets = (weight: number, trainType: string, isTraining: boolean) => {
  const p = Math.round(weight * 2.2);
  const f = Math.round(weight * 0.8);
  const c = Math.round(weight * (isTraining ? 2.0 : 1.5));
  const kcal = (p * 4) + (c * 4) + (f * 9);
  return { p, c, f, kcal };
};

export const calculateReadiness = (logs: DailyLog[], profile: UserProfile): number => {
  if (!logs || logs.length === 0) return 0;
  const recent = logs.slice(0, 3);
  let score = 0;
  const avgSleep = recent.reduce((acc, l) => acc + (l.sleepHours || 8), 0) / recent.length;
  score += (Math.min(avgSleep, 8) / 8) * 100;
  return Math.round(score);
};
