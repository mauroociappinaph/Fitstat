
import { DailyLog, UserProfile, MealEntry } from '@/shared/types';

export const validateBiometrics = (data: Partial<DailyLog>) => {
  const errors: string[] = [];
  
  if (data.weight !== undefined && (data.weight < 30 || data.weight > 500)) {
    errors.push("El peso debe estar entre 30kg y 500kg.");
  }
  if (data.steps !== undefined && (data.steps < 0 || data.steps > 150000)) {
    errors.push("Los pasos deben ser un valor positivo razonable.");
  }
  if (data.waterMl !== undefined && (data.waterMl < 0 || data.waterMl > 20000)) {
    errors.push("El registro de agua parece incorrecto (0-20L).");
  }
  if (data.sleepHours !== undefined && (data.sleepHours < 0 || data.sleepHours > 24)) {
    errors.push("Las horas de sueño deben estar entre 0 y 24.");
  }
  if (data.proteinG !== undefined && data.proteinG < 0) {
    errors.push("La proteína no puede ser negativa.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateProfile = (profile: UserProfile) => {
  const errors: string[] = [];

  if (!profile.name.trim()) errors.push("El nombre es obligatorio.");
  if (profile.age < 12 || profile.age > 110) errors.push("Edad fuera de rango (12-110).");
  if (profile.height < 50 || profile.height > 270) errors.push("Altura fuera de rango (50-270cm).");
  if (profile.targetWeight < 30 || profile.targetWeight > 500) errors.push("Peso objetivo inválido.");
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateMeal = (meal: MealEntry) => {
  return (meal.protein >= 0 && meal.carbs >= 0 && meal.fats >= 0);
};
