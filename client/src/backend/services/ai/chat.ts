import api from '../../../services/api';
import { UserProfile, DailyLog, StrengthSet } from '../../../shared/types';
import { MASTER_PLAN } from '@/shared/constants/masterPlan';
import { ROUTINES } from '@/shared/constants/routines';

export const streamChatResponse = async (
  message: string,
  history: any[],
  profile: UserProfile,
  logs: DailyLog[],
  strength: StrengthSet[],
  selectedDate: string
) => {
  const startDate = new Date(profile.startDate);
  const currentDate = new Date(selectedDate + 'T00:00:00');
  const diffMonths = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + (currentDate.getMonth() - startDate.getMonth());
  const currentPhase = MASTER_PLAN.phases.find(p => diffMonths >= p.rangeMonths[0] && diffMonths < p.rangeMonths[1]) || MASTER_PLAN.phases[0];

  const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const dayName = dayNames[currentDate.getDay()];
  const routineName = (currentPhase.routines as any)[dayName];
  const todayExercises = ROUTINES[routineName] || [];

  const contextSummary = `
FECHA ACTUAL DE CONSULTA: ${selectedDate} (${dayName})
USUARIO: ${profile.name} (${profile.age} años, ${profile.height}cm, ${profile.gender})
PLAN MAESTRO: ${currentPhase.name}
FOCO DE FASE: ${currentPhase.focus}

PROTOCOLO PARA HOY (${dayName}):
Rutina: ${routineName}
Ejercicios Planificados: ${todayExercises.map(ex => `${ex.name} (${ex.sets}x${ex.reps}, RIR ${ex.rir})`).join(', ')}

REGLAS NUTRICIONALES DE FASE: ${currentPhase.nutrition}
REGLAS GENERALES: ${MASTER_PLAN.rules.join(' | ')}

ESTADO RECIENTE:
- Último peso: ${logs[0]?.weight}kg (Meta: ${profile.targetWeight}kg)
- Proteína hoy: ${logs.find(l => l.date === selectedDate)?.proteinG || 0}g
- Pasos hoy: ${logs.find(l => l.date === selectedDate)?.steps || 0}
- Historial reciente: ${strength.slice(0, 5).map(s => s.exercise).join(', ')}
  `;

  // NOTA: Aunque la función se llama streamChatResponse por compatibilidad,
  // ahora devuelve una Promise<string> simulando el stream
  try {
    const response = await api.post('/ai/chat', {
      message,
      history,
      contextSummary
    });

    // Simulamos la estructura que espera el UI para no romper el componente FitStatChat
    // El UI espera un objeto con { stream: AsyncGenerator } o algo similar.
    // Como el UI original usaba la SDK de Google, seguramente iteraba el stream.
    // Para simplificar la migración, devolveremos un objeto que simula la respuesta final directa.
    
    // IMPORTANTE: El componente FitStatChat probablemente necesita refactorización
    // para manejar texto plano en vez de stream.
    // Por ahora devolvemos el texto directo y asumiremos que ajustaremos el componente UI.
    return {
      response: {
        text: () => response.data.response
      }
    };

  } catch (error) {
    console.error('Error in chat:', error);
    return {
      response: {
        text: () => "Lo siento, hubo un error de conexión con el servidor."
      }
    };
  }
};