
export interface MealEntry {
  id: string;
  type: 'Desayuno' | 'Almuerzo' | 'Merienda' | 'Cena' | 'Extra';
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  note?: string;
  timestamp?: string; // Para análisis circadiano
}

export interface AIFeedback {
  status: string;
  analysis: string;
  actionPoints: string[];
  insight: string;
  // Auditoría Pro
  circadianHealth?: string;
  intraDayForecast?: string;
  behavioralTriggers?: string;
  // Métricas de Precisión para el Front
  nutrientDensityScore?: number; // 0-100
  hydrationStatus?: 'Optima' | 'Deshidratación Leve' | 'Critica';
  recoveryStrainCorrelation?: string;
}

export interface AdaptiveMetabolism {
  theoreticalTDEE: number;
  actualTDEE: number;
  metabolicEfficiency: number; // 0-100
  deltaReason: string;
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
  walkAvgSpeed?: number;
  walkHRZones?: string;
  walkCadenceAvg?: number;
  walkCadenceMax?: number;
  walkStrideAvg?: number;
  walkStrideMax?: number;
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
  rir?: number;
  tempo?: string;
  avgHR: number;
  estimatedCalories: number;
  notes?: string;
}

export interface ExerciseTemplate {
  name: string;
  muscleGroup: string;
  sets: number;
  reps: string;
  rir: string;
  tempo?: string;
  image: string;
  instruction: string;
  lumbarSafe: boolean;
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
  stagnationReason?: string;
  overtrainingRisk: 'Low' | 'Medium' | 'High';
  overtrainingReason?: string;
}

export interface MetabolicPattern {
  id: string;
  title: string;
  correlation: string;
  insight: string;
  strength: 'Emerging' | 'Established' | 'Dominant';
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
  bodyFatEstimate?: number;
}

export interface PlanPhase {
  id: number;
  name: string;
  rangeMonths: [number, number];
  focus: string;
  nutrition: string;
  routines: Record<string, string>;
}
