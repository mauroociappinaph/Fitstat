
import { DailyLog, UserProfile, StrengthSet } from '../types';
import { AICache } from './types';

export const getLocalDateString = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0];
};

export const INITIAL_AICACHE: AICache = {
  predictions: null,
  patterns: [],
  cardioProjections: [],
  advancedCardioInsights: null,
  nutritionAdvice: null,
  dailyAudits: {},
  sleepAnalysis: null
};

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Usuario Elite',
  gender: 'male',
  initialWeight: 95.1,
  targetWeight: 75,
  height: 178,
  age: 34,
  activityLevel: 'moderate',
  startDate: '2025-12-24',
};

export const MASTER_STRENGTH_DATASET: StrengthSet[] = [
  { id: 's7', date: '2026-01-01', muscleGroup: 'Piernas', exercise: 'Peso Muerto', sets: 2, reps: 12, actualReps: [12, 12], avgHR: 92, estimatedCalories: 148 },
  { id: 's8', date: '2026-01-01', muscleGroup: 'Piernas', exercise: 'Abducción de Cadera Derecha', sets: 2, reps: 12, actualReps: [12, 12], avgHR: 92, estimatedCalories: 148 },
  { id: 's9', date: '2026-01-01', muscleGroup: 'Core', exercise: 'Side Plank', sets: 1, reps: 20, actualReps: [20], avgHR: 92, estimatedCalories: 148 },
  { id: 's10', date: '2026-01-01', muscleGroup: 'Piernas', exercise: 'Abducción de Cadera Izquierda', sets: 2, reps: 12, actualReps: [12, 12], avgHR: 92, estimatedCalories: 148 },
  { id: 's11', date: '2026-01-01', muscleGroup: 'Core', exercise: 'Dead Bug', sets: 2, reps: 16, actualReps: [16, 16], avgHR: 92, estimatedCalories: 148 }
];

export const MASTER_DATASET: DailyLog[] = [
  {
    date: '2026-01-01',
    weight: 93.8, waterMl: 1500, steps: 3430, sleepHours: 5.66,
    trainingDone: true, trainingType: 'Peso Muerto / Core', trainingCalories: 148, trainingAvgHR: 92,
    walkActivity: true, walkDistanceKm: 2.40, walkDurationMin: 28.5, walkAvgHR: 112, walkMaxHR: 125, walkCalories: 185,
    proteinG: 67, // Actualizado: 45 original + 22 nueva entrada
    meals: [
      { id: 'm1', type: 'Extra', protein: 22, carbs: 39, fats: 9, calories: 325, timestamp: '10:30', note: 'Actualización Manual' }
    ]
  },
  {
    date: '2025-12-31',
    weight: 93.6, waterMl: 3250, steps: 6918, sleepHours: 6.97,
    trainingDone: false, trainingType: 'Descanso', trainingCalories: 0, trainingAvgHR: 0,
    walkActivity: true, walkDistanceKm: 2.89, walkDurationMin: 31.08, walkAvgHR: 117, walkMaxHR: 133, walkCalories: 264,
    proteinG: 260
  }
];
