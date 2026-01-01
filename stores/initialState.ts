
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
  // --- SEMANA 1 (HISTÓRICA) ---
  { id: 'h1', date: '2025-12-24', muscleGroup: 'Superior', exercise: 'Flexiones pared', sets: 3, reps: 10, actualReps: [10, 10, 10], avgHR: 95, estimatedCalories: 40 },
  { id: 'h2', date: '2025-12-26', muscleGroup: 'Inferior', exercise: 'Sentadilla Silla', sets: 3, reps: 12, actualReps: [12, 12, 12], avgHR: 102, estimatedCalories: 55 },
  { id: 'h3', date: '2025-12-28', muscleGroup: 'Core', exercise: 'Plancha', sets: 3, reps: 30, actualReps: [30, 30, 30], avgHR: 88, estimatedCalories: 30 },

  // --- DATOS REALES PROPORCIONADOS ---
  // 29/12/25: PIERNAS
  { id: 's1', date: '2025-12-29', muscleGroup: 'Piernas', exercise: 'Sentadillas al aire', sets: 3, reps: 15, actualReps: [15, 15, 15], avgHR: 97, estimatedCalories: 67 },
  { id: 's2', date: '2025-12-29', muscleGroup: 'Piernas', exercise: 'Zancadas alternadas (lunges)', sets: 3, reps: 15, actualReps: [15, 15, 15], avgHR: 97, estimatedCalories: 67 },
  { id: 's3', date: '2025-12-29', muscleGroup: 'Piernas', exercise: 'Puente de glúteos', sets: 3, reps: 15, actualReps: [15, 15, 15], avgHR: 97, estimatedCalories: 67 },
  
  // 30/12/25: PECHO/ESPALDA
  { id: 's4', date: '2025-12-30', muscleGroup: 'Pecho', exercise: 'Flexiones en la pared', sets: 3, reps: 15, actualReps: [15, 15, 15], avgHR: 99, estimatedCalories: 51 },
  { id: 's5', date: '2025-12-30', muscleGroup: 'Espalda', exercise: 'Retracción escapular de pie', sets: 3, reps: 15, actualReps: [15, 15, 15], avgHR: 99, estimatedCalories: 51 },
  { id: 's6', date: '2025-12-30', muscleGroup: 'Full Body', exercise: 'Jumping Jacks', sets: 3, reps: 15, actualReps: [15, 15, 15], avgHR: 99, estimatedCalories: 51 },
  
  // 01/01/26: FUERZA / CORE
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
    proteinG: 45
  },
  {
    date: '2025-12-31',
    weight: 93.6, waterMl: 3250, steps: 6918, sleepHours: 6.97,
    trainingDone: false, trainingType: 'Descanso', trainingCalories: 0, trainingAvgHR: 0,
    walkActivity: true, walkDistanceKm: 2.89, walkDurationMin: 31.08, walkAvgHR: 117, walkMaxHR: 133, walkCalories: 264,
    proteinG: 260
  },
  {
    date: '2025-12-30',
    weight: 93.7, waterMl: 5000, steps: 11882, sleepHours: 6.48,
    trainingDone: true, trainingType: 'Pecho y Espalda', trainingCalories: 51, trainingAvgHR: 99,
    walkActivity: true, walkDistanceKm: 5.69, walkDurationMin: 57.06, walkAvgHR: 130, walkMaxHR: 149, walkCalories: 577,
    proteinG: 122
  },
  {
    date: '2025-12-29',
    weight: 93.6, waterMl: 5000, steps: 7391, sleepHours: 7.6,
    trainingDone: true, trainingType: 'Piernas', trainingCalories: 67, trainingAvgHR: 97,
    walkActivity: true, walkDistanceKm: 4.37, walkDurationMin: 47.75, walkAvgHR: 129, walkMaxHR: 153, walkCalories: 479,
    proteinG: 217
  },
  // --- DATOS ADICIONALES PARA COMPLETAR +8 DÍAS ---
  {
    date: '2025-12-28',
    weight: 94.0, waterMl: 4200, steps: 8500, sleepHours: 7.2,
    trainingDone: false, trainingType: 'Descanso', trainingCalories: 0, trainingAvgHR: 0,
    walkActivity: true, walkDistanceKm: 3.5, walkDurationMin: 35, walkAvgHR: 115, walkMaxHR: 130, walkCalories: 320,
    proteinG: 180
  },
  {
    date: '2025-12-27',
    weight: 94.2, waterMl: 3500, steps: 10200, sleepHours: 6.8,
    trainingDone: true, trainingType: 'Cuerpo Completo', trainingCalories: 45, trainingAvgHR: 105,
    walkActivity: true, walkDistanceKm: 4.0, walkDurationMin: 40, walkAvgHR: 120, walkMaxHR: 140, walkCalories: 400,
    proteinG: 195
  },
  {
    date: '2025-12-26',
    weight: 94.5, waterMl: 3000, steps: 7800, sleepHours: 7.5,
    trainingDone: true, trainingType: 'Piernas Suave', trainingCalories: 55, trainingAvgHR: 102,
    walkActivity: true, walkDistanceKm: 2.5, walkDurationMin: 25, walkAvgHR: 110, walkMaxHR: 125, walkCalories: 250,
    proteinG: 170
  },
  {
    date: '2025-12-25',
    weight: 94.8, waterMl: 2500, steps: 5400, sleepHours: 6.5,
    trainingDone: false, trainingType: 'Descanso', trainingCalories: 0, trainingAvgHR: 0,
    walkActivity: false, walkDistanceKm: 0, walkDurationMin: 0, walkAvgHR: 0, walkMaxHR: 0, walkCalories: 0,
    proteinG: 150
  },
  {
    date: '2025-12-24',
    weight: 95.1, waterMl: 2000, steps: 4300, sleepHours: 7.0,
    trainingDone: true, trainingType: 'Evaluación Inicial', trainingCalories: 40, trainingAvgHR: 95,
    walkActivity: false, walkDistanceKm: 0, walkDurationMin: 0, walkAvgHR: 0, walkMaxHR: 0, walkCalories: 0,
    proteinG: 100
  }
];
