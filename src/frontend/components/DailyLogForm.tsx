
import React, { useState } from 'react';
import { useAppStore } from '@/frontend/stores/useAppStore';
import { DailyLog } from '@/shared/types';
import StrengthLogForm from './StrengthLogForm';
import QuickAILogger from './QuickAILogger';
import { validateBiometrics } from '@/shared/utils/validation';
import { GlassCard, MetricInput } from './common';
import DateNavigator from './common/DateNavigator';

const DailyLogForm: React.FC = () => {
  const { addDailyLog, strengthLogs, dailyLogs, selectedDate, profile } = useAppStore();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInitialFormData = (): Partial<DailyLog> => {
    const existingLog = dailyLogs.find(l => l.date === selectedDate);
    if (existingLog) {
      return { ...existingLog };
    }
    return {
      date: selectedDate,
      weight: dailyLogs[0]?.weight || profile.initialWeight,
      waterMl: 0,
      steps: 0,
      sleepHours: 8,
      trainingDone: false,
      trainingType: 'Strength',
      trainingCalories: 0,
      trainingAvgHR: 0,
      walkActivity: false,
      walkDistanceKm: 0,
      walkDurationMin: 0,
      walkAvgHR: 0,
      walkCalories: 0,
      proteinG: 0,
    };
  };

  const [formData, setFormData] = useState<Partial<DailyLog>>(getInitialFormData);
  const [prevSelectedDate, setPrevSelectedDate] = useState(selectedDate);

  // Update formData when selectedDate changes
  if (selectedDate !== prevSelectedDate) {
    setPrevSelectedDate(selectedDate);
    setFormData(getInitialFormData());
    setError(null);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateBiometrics(formData);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }
    setIsSaving(true);
    setError(null);
    setTimeout(() => {
      addDailyLog(formData as DailyLog);
      setIsSaving(false);
      alert(`✅ Protocolo sincronizado para ${formData.date}`);
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Math.max(0, parseFloat(value) || 0) : val
    }));
  };

  const todayExercises = strengthLogs.filter(s => s.date === formData.date);

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">REGISTRO MANUAL</h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sincronización Biocronométrica</p>
        </div>
        <DateNavigator />
      </div>

      <QuickAILogger />

      <GlassCard className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
            <p className="text-xs font-black text-rose-400 uppercase tracking-widest text-center">⚠️ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <MetricInput label="Peso (kg)" name="weight" step="0.1" value={formData.weight || 0} onChange={handleInputChange} unit="kg" />
            <MetricInput label="Proteína (g)" name="proteinG" value={formData.proteinG || 0} onChange={handleInputChange} unit="g" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <MetricInput label="Pasos" name="steps" value={formData.steps || 0} onChange={handleInputChange} unit="👣" />
            <MetricInput label="Agua" name="waterMl" value={formData.waterMl || 0} onChange={handleInputChange} unit="ml" />
            <MetricInput label="Sueño" name="sleepHours" value={formData.sleepHours || 0} onChange={handleInputChange} unit="h" />
          </div>

          <div className="p-6 bg-slate-900/50 rounded-[2.5rem] border border-slate-800 space-y-6">
             <div className="flex items-center justify-between">
                <div>
                   <span className="text-sm font-black uppercase text-white">Sesión de Fuerza</span>
                   <p className="text-[10px] text-slate-500 italic">Integración con Strength Atlas</p>
                </div>
                <div className="relative inline-block w-12 h-6">
                  <input type="checkbox" name="trainingDone" checked={formData.trainingDone} onChange={handleInputChange} className="sr-only peer" id="train-toggle" />
                  <label htmlFor="train-toggle" className="absolute inset-0 bg-slate-800 rounded-full cursor-pointer peer-checked:bg-cyan-600 transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-all peer-checked:after:translate-x-6"></label>
                </div>
             </div>

             {formData.trainingDone && (
               <div className="animate-in slide-in-from-top-2 duration-300 space-y-6 pt-2">
                 <StrengthLogForm />
                 {todayExercises.length > 0 && (
                   <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-2">Ejercicios Sincronizados</p>
                      <div className="grid grid-cols-1 gap-2">
                        {todayExercises.map(ex => (
                          <div key={ex.id} className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800/50">
                             <span className="text-xs font-black text-white uppercase italic">{ex.exercise}</span>
                             <span className="text-[10px] font-bold text-slate-500">{ex.sets}x{ex.reps} • {ex.avgHR}bpm</span>
                          </div>
                        ))}
                      </div>
                   </div>
                 )}
               </div>
             )}
          </div>

          <button type="submit" disabled={isSaving} className={`w-full py-6 bg-white text-slate-950 font-black rounded-[2rem] transition-all shadow-xl active:scale-95 text-xs tracking-[0.2em] uppercase ${isSaving ? 'opacity-50' : 'hover:bg-cyan-400'}`}>
            {isSaving ? 'Sincronizando...' : 'Confirmar Protocolo'}
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default DailyLogForm;
