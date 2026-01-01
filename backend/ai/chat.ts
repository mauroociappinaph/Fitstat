
import { ai, SYSTEM_PROMPT } from './client';
import { UserProfile, DailyLog, StrengthSet } from '../../frontend/types';

export const streamChatResponse = async (
  message: string, 
  history: any[], 
  profile: UserProfile, 
  logs: DailyLog[], 
  strength: StrengthSet[],
  selectedDate: string
) => {
  const contextSummary = `
FECHA: ${selectedDate}
USUARIO: ${profile.name} (${profile.age} años)
PESO ACTUAL: ${logs[0]?.weight}kg
PROTEÍNA HOY: ${logs.find(l => l.date === selectedDate)?.proteinG || 0}g
OBJETIVO: ${profile.targetWeight}kg
  `;

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `${SYSTEM_PROMPT}\n\nCONTEXTO:\n${contextSummary}`,
    },
    history: history
  });

  return await chat.sendMessageStream({ message });
};
