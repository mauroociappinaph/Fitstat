
export interface MealEntry {
  id: string;
  type: 'Desayuno' | 'Almuerzo' | 'Merienda' | 'Cena' | 'Extra';
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  note?: string;
  timestamp?: string;
}

export interface AIFeedback {
  status: string;
  analysis: string;
  actionPoints: string[];
  insight: string;
}

export interface AdaptiveMetabolism {
  theoreticalTDEE: number;
  actualTDEE: number;
  metabolicEfficiency: number;
  deltaReason: string;
}

export interface DailyLog {
  date: string;
  weight: number;
  waterMl: number;
  steps: number;
  sleepHours: number;
  trainingDone: boolean;
  trainingType: string;
  trainingCalories: number;
  trainingAvgHR: number;
  walkActivity: boolean;
  walkDistanceKm: number;
  walkDurationMin: number;
  walkAvgHR: number;
  walkMaxHR?: number;
  walkCalories: number;
  proteinG: number;
  meals?: MealEntry[];
}

export interface StrengthSet {
  id: string;
  date: string;
  muscleGroup: string;
  exercise: string;
  sets: number;
  reps: number;
  actualReps?: number[]; 
  avgHR: number;
  estimatedCalories: number;
}

export interface UserProfile {
  name: string;
  gender: 'male' | 'female';
  initialWeight: number;
  targetWeight: number;
  height: number;
  age: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  startDate: string;
}

export interface PredictionValue {
  value: number;
  min: number;
  max: number;
  confidence: number;
}

export interface PredictionData {
  weight7d: PredictionValue;
  weight30d: PredictionValue;
  weight90d: PredictionValue;
  daysTo4Abs: PredictionValue;
  daysToSixPack: PredictionValue;
  stagnationRisk: 'Low' | 'Medium' | 'High';
  overtrainingRisk: 'Low' | 'Medium' | 'High';
}

export interface MetabolicPattern {
  id: string;
  title: string;
  correlation: string;
  insight: string;
  strength: 'Emerging' | 'Established' | 'Dominant';
}

export interface SleepCorrelation {
  correlationScore: number;
  impactOnTraining: string;
  impactOnNEAT: string;
  optimalSleepThreshold: number;
  predictedPerformanceBoost: string;
}

export interface AdvancedCardioInsight {
  efficiencyPeak: string;
  aerobicLoad: string;
  projection30d: string;
  biomechanicalSuggestion: string;
}
