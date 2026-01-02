
import React, { useMemo } from 'react';
import { useAppStore } from '@/frontend/stores/useAppStore';
import { MealEntry } from '@/shared/types';
import { GlassCard } from './common';
import DateNavigator from './common/DateNavigator';

const MEAL_TYPES = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena', 'Extra'] as const;

const MealLogView: React.FC = () => {
  const { dailyLogs, updateMeals, selectedDate } = useAppStore();

  const currentMeals = useMemo(() => {
    const currentDayLog = dailyLogs.find(l => l.date === selectedDate);
    return MEAL_TYPES.map(type => {
      const existing = currentDayLog?.meals?.find(m => m.type === type);
      return existing || {
        id: crypto.randomUUID(),
        type: type as any,
        protein: 0,
        carbs: 0,
        fats: 0,
        calories: 0,
        note: '',
        timestamp: type === 'Desayuno' ? '08:00' : type === 'Almuerzo' ? '13:00' : type === 'Merienda' ? '17:00' : '21:00'
      };
    });
  }, [selectedDate, dailyLogs]);

  const handleMealChange = (index: number, field: keyof MealEntry, value: string) => {
    const updatedMeals = [...currentMeals];
    if (field === 'note' || field === 'timestamp') {
      updatedMeals[index] = { ...updatedMeals[index], [field]: value };
    } else {
      const numValue = Math.max(0, value === '' ? 0 : parseFloat(value));
      updatedMeals[index] = { ...updatedMeals[index], [field]: numValue };
      const { protein, carbs, fats } = updatedMeals[index];
      updatedMeals[index].calories = Math.round((protein * 4) + (carbs * 4) + (fats * 9));
    }
    updateMeals(selectedDate, updatedMeals);
  };

  const totals = useMemo(() => currentMeals.reduce((acc, m) => ({
    p: acc.p + (m.protein || 0),
    c: acc.c + (m.carbs || 0),
    f: acc.f + (m.fats || 0),
    kcal: acc.kcal + (m.calories || 0)
  }), { p: 0, c: 0, f: 0, kcal: 0 }), [currentMeals]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-1">
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">MATRIZ DE INGESTA</h2>
        <DateNavigator />
      </div>

      <GlassCard className="overflow-hidden">
        <div className="p-6 space-y-6">
          {currentMeals.map((meal, idx) => (
            <div key={meal.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center group">
              <div className="md:col-span-3 flex items-center gap-3">
                <input 
                  type="time" 
                  value={meal.timestamp} 
                  onChange={(e) => handleMealChange(idx, 'timestamp', e.target.value)} 
                  className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-[10px] text-slate-500 font-bold outline-none focus:border-cyan-500/30" 
                />
                <span className="text-xs font-black text-white uppercase group-hover:text-cyan-400 transition-colors">{meal.type}</span>
              </div>
              <div className="grid grid-cols-3 md:col-span-6 gap-2">
                <div className="relative">
                  <input type="number" placeholder="P" value={meal.protein || ''} onChange={(e) => handleMealChange(idx, 'protein', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-center text-xs font-bold text-white focus:border-emerald-500 outline-none" />
                  <span className="absolute -top-2 left-2 text-[7px] font-black text-emerald-500 bg-slate-950 px-1">PROT</span>
                </div>
                <div className="relative">
                  <input type="number" placeholder="C" value={meal.carbs || ''} onChange={(e) => handleMealChange(idx, 'carbs', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-center text-xs font-bold text-white focus:border-cyan-500 outline-none" />
                  <span className="absolute -top-2 left-2 text-[7px] font-black text-cyan-500 bg-slate-950 px-1">CARB</span>
                </div>
                <div className="relative">
                  <input type="number" placeholder="G" value={meal.fats || ''} onChange={(e) => handleMealChange(idx, 'fats', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-center text-xs font-bold text-white focus:border-amber-500 outline-none" />
                  <span className="absolute -top-2 left-2 text-[7px] font-black text-amber-500 bg-slate-950 px-1">FAT</span>
                </div>
              </div>
              <div className="md:col-span-3 text-right">
                <p className="text-sm font-black text-white">{meal.calories} <span className="text-[10px] text-slate-500 uppercase">kcal</span></p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-slate-900/80 p-8 border-t border-slate-800 grid grid-cols-4 gap-4">
           {[
             {v: totals.p, l: 'PROTEÍNA', c: 'text-emerald-400', u: 'g'}, 
             {v: totals.c, l: 'CARBOS', c: 'text-cyan-400', u: 'g'}, 
             {v: totals.f, l: 'GRASAS', c: 'text-amber-400', u: 'g'}, 
             {v: totals.kcal, l: 'TOTAL KCAL', c: 'text-white', u: ''}
           ].map((t, i) => (
             <div key={i} className="text-center group">
               <p className={`text-[8px] font-black ${t.c} uppercase tracking-widest mb-1`}>{t.l}</p>
               <p className="text-xl font-black text-white group-hover:scale-110 transition-transform">{t.v}<span className="text-[9px] text-slate-600 ml-0.5">{t.u}</span></p>
             </div>
           ))}
        </div>
      </GlassCard>

      <div className="p-6 bg-slate-900/40 rounded-[2rem] border border-slate-800/50 text-center">
         <p className="text-[10px] font-bold text-slate-400 italic">"La precisión en el registro es el 80% del éxito metabólico."</p>
      </div>
    </div>
  );
};

export default MealLogView;
