
import { ai } from './client';
import { Type } from "@google/genai";
import { DailyLog, AdvancedCardioInsight } from "../../../shared/types";

export const getCardioProjections = async (history: DailyLog[]): Promise<{ date: string, efficiency: number }[]> => {
  const walkHistory = history
    .filter(log => log.walkActivity && log.walkAvgHR > 0)
    .map(log => ({
      date: log.date,
      efficiency: (log.walkDistanceKm / log.walkAvgHR) * 1000,
    }))
    .slice(-10);

  const prompt = `Analiza eficiencia cardiovascular (Metros/Latido) historial: ${JSON.stringify(walkHistory)}. Predice 30 días. JSON array objetos {date, efficiency}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Eres un analista de datos biomecánicos. Predice tendencias realistas. Solo devuelve JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING },
              efficiency: { type: Type.NUMBER }
            },
            required: ["date", "efficiency"]
          }
        }
      },
    });
    return JSON.parse(response.text || "[]");
  } catch { return []; }
};

export const getAdvancedCardioInsights = async (history: DailyLog[]): Promise<AdvancedCardioInsight | null> => {
  const walkHistory = history
    .filter(log => log.walkActivity && log.walkAvgHR > 0)
    .map(log => ({
      date: log.date,
      km: log.walkDistanceKm,
      hr: log.walkAvgHR,
      speed: log.walkAvgSpeed,
      stride: log.walkStrideAvg
    }));

  const prompt = `Basado en el historial de cardio: ${JSON.stringify(walkHistory)}. Genera análisis ejecutivo (Eficiencia Pico, Carga Aeróbica, Proyección 30d, Sugerencia Biomecánica). Devuelve JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Eres un analista senior de biomecánica. Solo devuelve JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            efficiencyPeak: { type: Type.STRING },
            aerobicLoad: { type: Type.STRING },
            projection30d: { type: Type.STRING },
            biomechanicalSuggestion: { type: Type.STRING }
          },
          required: ["efficiencyPeak", "aerobicLoad", "projection30d", "biomechanicalSuggestion"]
        }
      }
    });
    return JSON.parse(response.text || "{}") as AdvancedCardioInsight;
  } catch { return null; }
};
