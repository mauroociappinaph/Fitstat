import api from '../../../services/api';
import { DailyLog, UserProfile, PredictionData, MetabolicPattern, AIFeedback, StrengthSet, SleepCorrelation } from "../../../shared/types";

export const getPredictions = async (profile: UserProfile, history: DailyLog[], strengthLogs: StrengthSet[]): Promise<PredictionData | null> => {
  try {
    const response = await api.post('/ai/predict', {
      profile,
      history,
      strengthLogs
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return null;
  }
};

export const getDailyAuditFeedback = async (log: DailyLog, profile: UserProfile, history: DailyLog[]): Promise<AIFeedback | null> => {
  try {
    const response = await api.post('/ai/audit', {
      log,
      profile,
      history
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching daily audit:', error);
    return null;
  }
};

// TODO: Implementar estos endpoints en el backend
export const getMetabolicPatterns = async (history: DailyLog[]): Promise<MetabolicPattern[]> => {
  console.warn('getMetabolicPatterns: Endpoint not implemented yet');
  return [];
};

export const getSleepCorrelationAnalysis = async (history: DailyLog[]): Promise<SleepCorrelation | null> => {
  console.warn('getSleepCorrelationAnalysis: Endpoint not implemented yet');
  return null;
};

export const getNutritionFeedback = async (current: { p: number, c: number, f: number }, targets: { p: number, c: number, f: number }, phase: string, train: string): Promise<AIFeedback | null> => {
  console.warn('getNutritionFeedback: Endpoint not implemented yet');
  return null;
};