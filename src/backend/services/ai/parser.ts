
import { ai } from './client';
import { Type } from "@google/genai";
import { DailyLog } from "../../types";

export const parseNaturalLanguageLog = async (text: string, referenceDate: string): Promise<Partial<DailyLog> | null> => {
  const prompt = `Extrae datos de salud de este texto: "${text}". 
  Fecha de referencia (HOY): ${referenceDate}.
  
  Instrucciones:
  1. Identifica métricas (peso, pasos, agua, proteína).
  2. Determina la fecha del registro. Si el usuario usa términos relativos como "ayer", "anteayer", "el lunes" o fechas específicas, calcula la fecha ISO (YYYY-MM-DD) basándote en la fecha de referencia.
  3. Si no se menciona tiempo, usa la fecha de referencia.
  4. Devuelve el resultado en el esquema JSON solicitado.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Eres un motor de procesamiento de lenguaje natural especializado en biométricos y cronología de salud. Tu objetivo es mapear el lenguaje natural a un esquema estructurado, calculando fechas relativas con precisión quirúrgica.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            date: { 
              type: Type.STRING, 
              description: "La fecha calculada del registro en formato YYYY-MM-DD" 
            },
            weight: { type: Type.NUMBER },
            steps: { type: Type.NUMBER },
            waterMl: { type: Type.NUMBER },
            proteinG: { type: Type.NUMBER },
            trainingType: { type: Type.STRING },
            trainingDone: { type: Type.BOOLEAN },
            walkDistanceKm: { type: Type.NUMBER }
          },
          required: ["date"]
        }
      },
    });
    
    return JSON.parse(response.text || "{}");
  } catch (e) { 
    console.error("Error parsing natural language log:", e);
    return null; 
  }
};
