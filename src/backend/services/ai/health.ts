
import { ai, SYSTEM_PROMPT } from './client';
import { Type } from "@google/genai";
import { DailyLog, UserProfile, PredictionData, MetabolicPattern, AIFeedback, StrengthSet, SleepCorrelation } from "../../../shared/types";

export const getPredictions = async (profile: UserProfile, history: DailyLog[], _strengthLogs: StrengthSet[]): Promise<PredictionData | null> => {
  const prompt = `Análisis predictivo profundo. Perfil: ${JSON.stringify(profile)}, Historial: ${JSON.stringify(history.slice(0,10))}.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weight7d: { type: Type.OBJECT, properties: { value: { type: Type.NUMBER }, min: { type: Type.NUMBER }, max: { type: Type.NUMBER }, confidence: { type: Type.NUMBER } }, required: ["value", "min", "max", "confidence"] },
            weight30d: { type: Type.OBJECT, properties: { value: { type: Type.NUMBER }, min: { type: Type.NUMBER }, max: { type: Type.NUMBER }, confidence: { type: Type.NUMBER } }, required: ["value", "min", "max", "confidence"] },
            weight90d: { type: Type.OBJECT, properties: { value: { type: Type.NUMBER }, min: { type: Type.NUMBER }, max: { type: Type.NUMBER }, confidence: { type: Type.NUMBER } }, required: ["value", "min", "max", "confidence"] },
            daysTo4Abs: { type: Type.OBJECT, properties: { value: { type: Type.NUMBER }, min: { type: Type.NUMBER }, max: { type: Type.NUMBER }, confidence: { type: Type.NUMBER } }, required: ["value", "min", "max", "confidence"] },
            daysToSixPack: { type: Type.OBJECT, properties: { value: { type: Type.NUMBER }, min: { type: Type.NUMBER }, max: { type: Type.NUMBER }, confidence: { type: Type.NUMBER } }, required: ["value", "min", "max", "confidence"] },
            stagnationRisk: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            stagnationReason: { type: Type.STRING },
            overtrainingRisk: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            overtrainingReason: { type: Type.STRING }
          },
          required: ["weight7d", "weight30d", "weight90d", "daysTo4Abs", "daysToSixPack", "stagnationRisk", "overtrainingRisk"]
        }
      },
    });
    return JSON.parse(response.text || "{}") as PredictionData;
  } catch (error) {
    console.error("AI Prediction Error:", error);
    throw new Error("Failed to generate predictions");
  }
};

export const getMetabolicPatterns = async (history: DailyLog[]): Promise<MetabolicPattern[]> => {
  const prompt = `Identifica 3 patrones metabólicos clave en: ${JSON.stringify(history.slice(0,20))}.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              correlation: { type: Type.STRING },
              insight: { type: Type.STRING },
              strength: { type: Type.STRING, enum: ['Emerging', 'Established', 'Dominant'] }
            },
            required: ["id", "title", "correlation", "insight", "strength"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
     console.error("AI Pattern Error:", error);
     throw new Error("Failed to generate metabolic patterns");
  }
};

export const getSleepCorrelationAnalysis = async (history: DailyLog[]): Promise<SleepCorrelation | null> => {
  const prompt = `Analiza correlación Sueño vs Pasos/Entrenamiento en: ${JSON.stringify(history.slice(0, 15))}.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Especialista en medicina del sueño. Devuelve JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correlationScore: { type: Type.NUMBER },
            impactOnTraining: { type: Type.STRING },
            impactOnNEAT: { type: Type.STRING },
            optimalSleepThreshold: { type: Type.NUMBER },
            predictedPerformanceBoost: { type: Type.STRING }
          },
          required: ["correlationScore", "impactOnTraining", "impactOnNEAT", "optimalSleepThreshold", "predictedPerformanceBoost"]
        }
      }
    });
    return JSON.parse(response.text || "{}") as SleepCorrelation;
  } catch (error) {
    console.error("AI Sleep Analysis Error:", error);
    throw new Error("Failed to analyze sleep correlation");
  }
};

export const getDailyAuditFeedback = async (log: DailyLog, profile: UserProfile, history: DailyLog[]): Promise<AIFeedback | null> => {
  const totalIn = log.meals?.reduce((acc, m) => acc + (m.calories || 0), 0) || 0;
  const mealsInfo = log.meals?.map(m => `${m.type} (${m.calories}kcal) a las ${m.timestamp || 'N/A'}`).join(', ') || 'Sin comidas registradas';

  const prompt = `
Auditoría Metabólica Pro.
Día: ${log.date}. Ingesta: ${totalIn}kcal. Pasos: ${log.steps}. Sueño: ${log.sleepHours}h. Agua: ${log.waterMl}ml.
Comidas: ${mealsInfo}. Entrenamiento: ${log.trainingType}.
Peso: ${log.weight}kg. Historial: ${JSON.stringify(history.slice(0, 7).map(h => ({d: h.date, w: h.weight, s: h.steps})))}

INSTRUCCIÓN:
1. Calcula 'nutrientDensityScore' (calidad vs procesados).
2. Evalúa 'hydrationStatus' basándote en agua vs actividad.
3. Detecta 'behavioralTriggers' (ej. ¿Comes más carbohidratos si duermes menos?).
4. Genera 'intraDayForecast' para corrección de rumbo.
5. Evalúa 'circadianHealth' (ventana de alimentación).
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            analysis: { type: Type.STRING },
            actionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            insight: { type: Type.STRING },
            circadianHealth: { type: Type.STRING },
            intraDayForecast: { type: Type.STRING },
            behavioralTriggers: { type: Type.STRING },
            nutrientDensityScore: { type: Type.NUMBER },
            hydrationStatus: { type: Type.STRING, enum: ['Optima', 'Deshidratación Leve', 'Critica'] },
            recoveryStrainCorrelation: { type: Type.STRING }
          },
          required: ["status", "analysis", "actionPoints", "insight", "nutrientDensityScore", "hydrationStatus"]
        }
      },
    });
    return JSON.parse(response.text || "{}") as AIFeedback;
  } catch (error) {
    console.error("AI Audit Error:", error);
    throw new Error("Failed to generate daily audit");
  }
};

export const getNutritionFeedback = async (current: { p: number, c: number, f: number }, targets: { p: number, c: number, f: number }, phase: string, train: string): Promise<AIFeedback | null> => {
  const prompt = `Coach Nutricional. Fase: ${phase}. Entreno: ${train}. Ingesta: P:${current.p}, C:${current.c}, F:${current.f}.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            analysis: { type: Type.STRING },
            actionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            insight: { type: Type.STRING }
          },
          required: ["status", "analysis", "actionPoints", "insight"]
        }
      },
    });
    return JSON.parse(response.text || "{}") as AIFeedback;
  } catch (error) {
     console.error("AI Nutrition Feedback Error:", error);
     throw new Error("Failed to generate nutrition feedback");
  }
};
