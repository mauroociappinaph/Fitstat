
import { useState, useMemo } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { ROUTINES } from '../constants/routines';
import { StrengthSet, ExerciseTemplate } from '../types';

export const useStrengthData = () => {
  const { strengthLogs, addStrengthLog, selectedDate } = useAppStore();
  const [expandedEx, setExpandedEx] = useState<string | null>(null);
  const [activeReps, setActiveReps] = useState<Record<string, number[]>>({});

  const todayRoutine = useMemo(() => {
    const dateObj = new Date(selectedDate + 'T00:00:00');
    const day = dateObj.getDay();
    let title = 'Protocolo de Salud';
    let exercises: ExerciseTemplate[] = [];
    let isRecovery = true;

    switch(day) {
      case 1: title = 'Piernas A (Sentadilla focus) + Core'; isRecovery = false; break;
      case 2: title = 'Superior A (Empuje/Tirón horizontal) + Cardio 20\''; isRecovery = false; break;
      case 3: title = 'Recuperación Activa (Movilidad/Paseo)'; isRecovery = true; break;
      case 4: title = 'Piernas B (Bisagra de cadera) + Core'; isRecovery = false; break;
      case 5: title = 'Superior B (Hombro/Vertical) + Cardio 20\''; isRecovery = false; break;
      case 6: title = 'Full Body Metabólico (Circuito)'; isRecovery = false; break;
      case 0: title = 'Descanso Total'; isRecovery = true; break;
    }
    exercises = ROUTINES[title] || [];
    return { title, exercises, isRecovery };
  }, [selectedDate]);

  // Agregación de volumen total por día (sets x reps)
  const volumeHistory = useMemo(() => {
    const history: Record<string, number> = {};
    strengthLogs.forEach(log => {
      if (!history[log.date]) history[log.date] = 0;
      const totalReps = log.actualReps 
        ? log.actualReps.reduce((a, b) => a + b, 0) 
        : (log.sets * (log.reps || 0));
      history[log.date] += totalReps;
    });

    return Object.entries(history)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, vol]) => ({ 
        date: date.split('-').slice(1).reverse().join('/'), 
        fullDate: date,
        volume: vol 
      }));
  }, [strengthLogs]);

  // Cálculo de tendencia comparativa
  const volumeTrend = useMemo(() => {
    if (volumeHistory.length < 2) return null;
    const last = volumeHistory[volumeHistory.length - 1].volume;
    const prev = volumeHistory[volumeHistory.length - 2].volume;
    const diff = last - prev;
    const percent = ((diff / (prev || 1)) * 100).toFixed(1);
    return { diff, percent, isUp: diff >= 0 };
  }, [volumeHistory]);

  const handleRepChange = (exName: string, setIndex: number, value: string) => {
    const val = parseInt(value) || 0;
    setActiveReps(prev => {
      const exTemplate = todayRoutine.exercises.find(e => e.name === exName);
      const current = prev[exName] || Array(exTemplate?.sets || 3).fill(parseInt(exTemplate?.reps || '0') || 0);
      const next = [...current];
      next[setIndex] = val;
      return { ...prev, [exName]: next };
    });
  };

  const syncExercise = (ex: ExerciseTemplate) => {
    const repsReal = activeReps[ex.name] || Array(ex.sets).fill(parseInt(ex.reps) || 0);
    const newLog: StrengthSet = {
      id: crypto.randomUUID(),
      date: selectedDate,
      muscleGroup: ex.muscleGroup,
      exercise: ex.name,
      sets: ex.sets,
      reps: parseInt(ex.reps) || 0,
      actualReps: repsReal,
      rir: ex.rir === 'N/A' ? undefined : parseInt(ex.rir),
      tempo: ex.tempo,
      avgHR: 110,
      estimatedCalories: 45
    };
    addStrengthLog(newLog);
    setExpandedEx(null);
  };

  const isCompleted = (exName: string) => {
    return strengthLogs.some(log => log.exercise === exName && log.date === selectedDate);
  };

  return {
    todayRoutine,
    volumeHistory,
    volumeTrend,
    expandedEx,
    setExpandedEx,
    activeReps,
    handleRepChange,
    syncExercise,
    isCompleted,
    strengthLogs,
    selectedDate
  };
};
