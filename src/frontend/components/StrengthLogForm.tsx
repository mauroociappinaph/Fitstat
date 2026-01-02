
import React, { useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { StrengthSet } from '../types';

const StrengthLogForm: React.FC = () => {
  const { addStrengthLog } = useAppStore();
  const [exercise, setExercise] = useState({
    muscleGroup: 'Chest',
    name: '',
    sets: 3,
    reps: 10,
    hr: 120,
    cal: 50
  });

  const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

  const handleAdd = () => {
    if (!exercise.name) return;
    const newLog: StrengthSet = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
      muscleGroup: exercise.muscleGroup,
      exercise: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      avgHR: exercise.hr,
      estimatedCalories: exercise.cal
    };
    addStrengthLog(newLog);
    setExercise({ ...exercise, name: '' });
    alert("Exercise stored in Strength Atlas.");
  };

  return (
    <div className="glass p-5 rounded-3xl border-slate-800 space-y-4">
      <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest">Strength Atlas</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">Muscle Group</label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {muscleGroups.map(m => (
              <button 
                key={m}
                onClick={() => setExercise({...exercise, muscleGroup: m})}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                  exercise.muscleGroup === m ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <input 
            type="text" 
            placeholder="Exercise Name (e.g. Push Ups)"
            value={exercise.name}
            onChange={(e) => setExercise({...exercise, name: e.target.value})}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">Sets x Reps</label>
          <div className="flex items-center gap-2">
            <input type="number" value={exercise.sets} onChange={(e) => setExercise({...exercise, sets: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-center text-sm" />
            <span className="text-slate-600">x</span>
            <input type="number" value={exercise.reps} onChange={(e) => setExercise({...exercise, reps: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-center text-sm" />
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">Estimated Cal</label>
          <input type="number" value={exercise.cal} onChange={(e) => setExercise({...exercise, cal: parseInt(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-center text-sm" />
        </div>
      </div>

      <button 
        onClick={handleAdd}
        className="w-full py-3 bg-slate-100 text-slate-900 font-black rounded-xl text-xs hover:bg-white transition-all active:scale-95"
      >
        ADD TO TODAY'S WORKOUT
      </button>
    </div>
  );
};

export default StrengthLogForm;
