import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel, Content, Part } from '@google/generative-ai'; // Eliminado FunctionCallingMode, FunctionDeclarationSchema, FunctionDeclarationSchemaProperty
import {
  DailyLog,
  UserProfile,
  AIFeedback,
} from '../shared/types';
import { z } from 'zod';

// Definimos el prompt del sistema aquí
const SYSTEM_PROMPT = `
Eres el Motor FitStat AI (v4.0), el Oráculo de Salud de Atlas Load.
TU MISIÓN: Ser el coach definitivo que conoce el PLAN MAESTRO y las RUTINAS a la perfección.

REGLAS CRÍTICAS:
1. NUNCA inventes rutinas genéricas. Consulta siempre el contextSummary para ver qué toca HOY.
2. Si el usuario pregunta qué le toca, responde exactamente con la rutina del MASTER_PLAN para ese día.
3. Sé extremadamente visual: usa emojis, párrafos cortos y listas.
4. Resalta métricas críticas (kg, g, kcal, bpm).
5. Mantén un tono de "Elite Health Architect": profesional, directo y motivador.
6. TODO EN ESPAÑOL.

ESTRUCTURA DE RESPUESTA:
- Directo al grano: Responde la duda principal primero.
- Detalles del Protocolo: Desglosa ejercicios/series/reps/bpm si se pide.
- Insight de IA: Una observación basada en datos recientes del usuario.
`;

// Definiciones de Zod Schema (ahora exportadas para que no sean "privadas")
export const PredictionDataSchema = z.object({
  weight7d: z.object({ value: z.number(), min: z.number(), max: z.number(), confidence: z.number() }),
  weight30d: z.object({ value: z.number(), min: z.number(), max: z.number(), confidence: z.number() }),
  weight90d: z.object({ value: z.number(), min: z.number(), max: z.number(), confidence: z.number() }),
  daysTo4Abs: z.object({ value: z.number(), min: z.number(), max: z.number(), confidence: z.number() }),
  daysToSixPack: z.object({ value: z.number(), min: z.number(), max: z.number(), confidence: z.number() }),
  stagnationRisk: z.enum(['Low', 'Medium', 'High']),
  stagnationReason: z.string().optional(),
  overtrainingRisk: z.enum(['Low', 'Medium', 'High']),
  overtrainingReason: z.string().optional(),
});
export type PredictionData = z.infer<typeof PredictionDataSchema>; // Exportar el tipo también

export const AIFeedbackSchema = z.object({
  status: z.string(),
  analysis: z.string(),
  actionPoints: z.array(z.string()),
  insight: z.string(),
  circadianHealth: z.string().optional(),
  intraDayForecast: z.string().optional(),
  behavioralTriggers: z.string().optional(),
  nutrientDensityScore: z.number(),
  hydrationStatus: z.enum(['Optima', 'Deshidratación Leve', 'Critica']),
  recoveryStrainCorrelation: z.string().optional(),
});
export type AIFeedbackExtended = z.infer<typeof AIFeedbackSchema>; // Renombrar para evitar conflicto con la importación original

@Injectable()
export class AiService implements OnModuleInit {
  private readonly logger = new Logger(AiService.name);
  private aiClient: GoogleGenerativeAI;
  private modelPro: GenerativeModel;
  private modelFlash: GenerativeModel;
  private modelChat: GenerativeModel;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.error('GEMINI_API_KEY is not defined in environment variables');
      throw new Error('GEMINI_API_KEY is required');
    }
    
    this.aiClient = new GoogleGenerativeAI(apiKey);
    
    // Configuración base para modelos que devuelven JSON
    const generationConfig = {
      responseMimeType: 'application/json'
    };

    // Los modelos se configuran una sola vez
    this.modelPro = this.aiClient.getGenerativeModel({
      model: 'gemini-1.5-pro',
      generationConfig,
      systemInstruction: { role: 'system', parts: [{ text: SYSTEM_PROMPT }] }
    });

    this.modelFlash = this.aiClient.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig,
      systemInstruction: { role: 'system', parts: [{ text: SYSTEM_PROMPT }] }
    });

    // El modelo de chat no usa responseMimeType por defecto para permitir texto libre
    this.modelChat = this.aiClient.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: { role: 'system', parts: [{ text: SYSTEM_PROMPT }] }
    });
  }

  // Método auxiliar simplificado: confía en responseMimeType y valida con Zod después
  private async generateContentAndValidate<T extends z.ZodTypeAny>(
    model: GenerativeModel,
    prompt: string,
    schema: T,
    extraSystemInstruction?: string,
  ): Promise<z.infer<T> | null> {
    try {
      const finalSystemInstructionText = extraSystemInstruction ? `${SYSTEM_PROMPT}\n${extraSystemInstruction}` : SYSTEM_PROMPT;
      
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        systemInstruction: { role: 'system', parts: [{ text: finalSystemInstructionText }] },
        // Eliminamos toolConfig y tools para evitar los problemas de tipado complejos
        // Confiamos en responseMimeType: 'application/json' en la configuración del modelo
      });

      const responseText = result.response.text();
      if (!responseText) {
        this.logger.warn('Gemini returned empty response for prompt:', prompt);
        return null;
      }

      try {
        const jsonResponse = JSON.parse(responseText);
        const parsed = schema.safeParse(jsonResponse);
        if (parsed.success) {
          return parsed.data;
        } else {
          this.logger.error('Zod validation failed after JSON parse:', parsed.error.issues);
          this.logger.error('Raw Gemini response:', responseText);
          return null;
        }
      } catch (parseError) {
        this.logger.error('Failed to parse JSON from Gemini response:', parseError);
        this.logger.error('Raw Gemini response:', responseText);
        return null;
      }

    } catch (error) {
      this.logger.error('Error in generateContentAndValidate', error);
      return null;
    }
  }

  async getPredictions(profile: UserProfile, history: DailyLog[]): Promise<PredictionData | null> {
    const prompt = `Análisis predictivo profundo. Perfil: ${JSON.stringify(profile)}, Historial: ${JSON.stringify(history.slice(0, 10))}.`;
    
    return this.generateContentAndValidate(this.modelPro, prompt, PredictionDataSchema);
  }

  async getDailyAuditFeedback(log: DailyLog, profile: UserProfile, history: DailyLog[]): Promise<AIFeedbackExtended | null> {
    const totalIn = log.meals?.reduce((acc, m) => acc + (m.calories || 0), 0) || 0;
    const mealsInfo = log.meals?.map(m => `${m.type} (${m.calories}kcal)`).join(', ') || 'Sin comidas';

    const prompt = `
Auditoría Metabólica Pro.
Día: ${log.date}. Ingesta: ${totalIn}kcal. Pasos: ${log.steps}. Sueño: ${log.sleepHours}h.
Comidas: ${mealsInfo}. Entrenamiento: ${log.trainingType}.
Historial reciente: ${JSON.stringify(history.slice(0, 5).map(h => ({d: h.date, w: h.weight})))}

INSTRUCCIÓN:
1. Calcula 'nutrientDensityScore'.
2. Evalúa 'hydrationStatus'.
3. Detecta 'behavioralTriggers'.
4. Genera 'intraDayForecast'.
5. Evalúa 'circadianHealth'.
`;

    return this.generateContentAndValidate(this.modelFlash, prompt, AIFeedbackSchema);
  }

  async chat(message: string, history: Content[], contextSummary: string): Promise<string | null> {
    const chatSession = this.modelChat.startChat({
      history: history,
      systemInstruction: { role: 'system', parts: [{ text: `${SYSTEM_PROMPT}` }] }
    });

    try {
      // sendMessage espera un Content (objeto con role y parts)
      const result = await chatSession.sendMessage([
        { text: `${contextSummary}\n\n${message}` } // Esto es un array de Part, que es aceptado.
      ]);
      return result.response.text();
    } catch (error) {
      this.logger.error('Error in chat session', error);
      return null;
    }
  }
}
