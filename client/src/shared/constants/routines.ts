
import { ExerciseTemplate } from '@/shared/types';

export const ROUTINES: Record<string, ExerciseTemplate[]> = {
  'Piernas A (Sentadilla focus) + Core': [
    { name: 'Sentadilla (Silla o Libre)', muscleGroup: 'Piernas', sets: 3, reps: '10-20', rir: '1-3', tempo: '4s bajada', image: 'https://images.unsplash.com/photo-1574673848896-4f8453757222?q=80&w=800&auto=format&fit=crop', instruction: 'Baja controlado. Si hay dolor lumbar, hazla a silla con torso erguido.', lumbarSafe: true },
    { name: 'Zancada Atrás', muscleGroup: 'Piernas', sets: 3, reps: '8-15', rir: '2', tempo: 'Controlado', image: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=800&auto=format&fit=crop', instruction: 'Paso largo atrás, rodilla casi toca el suelo.', lumbarSafe: true },
    { name: 'Hip Thrust / Puente Glúteo', muscleGroup: 'Glúteos', sets: 3, reps: '12-25', rir: '1', tempo: 'Pausa 2s arriba', image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=800&auto=format&fit=crop', instruction: 'Aprieta glúteos fuerte arriba. Espalda apoyada en silla o suelo.', lumbarSafe: true },
    { name: 'Bird Dog', muscleGroup: 'Core/Lumbar', sets: 3, reps: '6-10 por lado', rir: 'N/A', tempo: 'Lento', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop', instruction: 'Extiende brazo y pierna contraria sin arquear lumbar.', lumbarSafe: true }
  ],
  'Superior A (Empuje/Tirón horizontal) + Cardio 20\'': [
    { name: 'Flexiones (Pared/Mesa)', muscleGroup: 'Pecho', sets: 3, reps: '6-15', rir: '1-3', tempo: '3s bajada', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&auto=format&fit=crop', instruction: 'Manos a altura de hombros. Cuerpo en tabla.', lumbarSafe: true },
    { name: 'Remo con Botellas (1 Brazo)', muscleGroup: 'Espalda', sets: 3, reps: '12-25', rir: '2', tempo: 'Pausa 2s arriba', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop', instruction: 'Apoyo en silla. Tira del peso hacia la cadera.', lumbarSafe: true },
    { name: 'Press Hombro (Botellas)', muscleGroup: 'Hombros', sets: 3, reps: '8-15', rir: '2', tempo: 'Controlado', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop', instruction: 'Sentado en silla para proteger lumbar.', lumbarSafe: true },
    { name: 'Extensión Tríceps (Botella)', muscleGroup: 'Tríceps', sets: 3, reps: '10-20', rir: '2', tempo: 'Lento', image: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?q=80&w=800&auto=format&fit=crop', instruction: 'Sobre la cabeza. Codos cerrados.', lumbarSafe: true }
  ],
  'Recuperación Activa (Movilidad/Paseo)': [
    { name: 'Gato-Camello', muscleGroup: 'Espalda/Core', sets: 1, reps: '12', rir: 'N/A', tempo: 'Fluido', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop', instruction: 'Moviliza vértebra a vértebra. Sin dolor ni tensión.', lumbarSafe: true },
    { name: 'Apertura de Cadera 90-90', muscleGroup: 'Caderas', sets: 1, reps: '10 por lado', rir: 'N/A', tempo: 'Lento', image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=800&auto=format&fit=crop', instruction: 'Sentado en el suelo, rota caderas controladamente para liberar tensión.', lumbarSafe: true }
  ],
  'Piernas B (Bisagra de cadera) + Core': [
    { name: 'Rumano Técnico (Sin Peso)', muscleGroup: 'Isquios', sets: 3, reps: '10-15', rir: '3', tempo: '4s bajada', image: 'https://images.unsplash.com/photo-1598971639058-fab3c023bf36?q=80&w=800&auto=format&fit=crop', instruction: 'Cola atrás, espalda neutra. Siente el estiramiento.', lumbarSafe: true },
    { name: 'Abducción de Cadera', muscleGroup: 'Glúteo Medio', sets: 3, reps: '12-25', rir: '1', tempo: 'Controlado', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop', instruction: 'Tumbado de lado. Sube pierna sin rotar cadera.', lumbarSafe: true },
    { name: 'Side Plank', muscleGroup: 'Core', sets: 3, reps: '20-45 seg', rir: 'N/A', tempo: 'Estático', image: 'https://images.unsplash.com/photo-1566241134883-13eb2393a3cc?q=80&w=800&auto=format&fit=crop', instruction: 'Apoyo en antebrazo. Cadera alta.', lumbarSafe: true },
    { name: 'Dead Bug', muscleGroup: 'Core', sets: 3, reps: '8-12 por lado', rir: 'N/A', tempo: 'Muy Lento', image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=800&auto=format&fit=crop', instruction: 'Presiona lumbar contra suelo. Alterna brazo/pierna.', lumbarSafe: true }
  ],
  'Superior B (Hombro/Vertical) + Cardio 20\'': [
    { name: 'Remo Botellas (Pausa arriba)', muscleGroup: 'Espalda', sets: 3, reps: '12-25', rir: '2', tempo: '2-0-2-2', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop', instruction: 'Máxima contracción de escápulas.', lumbarSafe: true },
    { name: 'Y-T-W (Suelo)', muscleGroup: 'Postura', sets: 2, reps: '10-15', rir: 'N/A', tempo: 'Lento', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop', instruction: 'Boca abajo. Levanta brazos formando letras.', lumbarSafe: true },
    { name: 'Elevaciones Laterales (Botellas)', muscleGroup: 'Hombros', sets: 3, reps: '12-25', rir: '1', tempo: 'Controlado', image: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?q=80&w=800&auto=format&fit=crop', instruction: 'Brazos casi rectos. No pases altura de hombros.', lumbarSafe: true }
  ],
  'Full Body Metabólico (Circuito)': [
    { name: 'Circuito: Sentadillas + Punches + Remo + Puente + Marcha', muscleGroup: 'Cuerpo Completo', sets: 3, reps: '20-25 min', rir: 'RPE 8', tempo: 'Fluido', image: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=800&auto=format&fit=crop', instruction: 'Descansa 1 min entre rondas. Prioriza técnica sobre velocidad.', lumbarSafe: true }
  ],
  'Descanso Total': [
    { name: 'Estiramiento Psoas', muscleGroup: 'Cadera', sets: 1, reps: '45 seg por lado', rir: 'N/A', tempo: 'Estático', image: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=800&auto=format&fit=crop', instruction: 'Rodilla en suelo, empuja cadera adelante suavemente.', lumbarSafe: true },
    { name: 'Respiración Diafragmática', muscleGroup: 'SNC', sets: 1, reps: '5 min', rir: 'N/A', tempo: 'Lento', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop', instruction: 'Tumbado, infla abdomen al inhalar. Reduce cortisol.', lumbarSafe: true }
  ]
};
