
import React from 'react';
import { useAppStore } from '@/frontend/stores/useAppStore';

const DateNavigator: React.FC = () => {
  const { selectedDate, setSelectedDate } = useAppStore();

  const adjustDate = (days: number) => {
    const current = new Date(selectedDate + 'T00:00:00');
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  return (
    <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
      <button
        onClick={() => adjustDate(-1)}
        className="w-10 h-10 flex items-center justify-center bg-slate-950 rounded-xl text-cyan-400 hover:bg-slate-800 transition-all border border-slate-800 active:scale-90"
      >
        ◀
      </button>
      <div className="relative">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-[10px] font-black text-cyan-400 outline-none w-36 text-center uppercase tracking-widest appearance-none"
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none opacity-20">
          📅
        </div>
      </div>
      <button
        onClick={() => adjustDate(1)}
        className="w-10 h-10 flex items-center justify-center bg-slate-950 rounded-xl text-cyan-400 hover:bg-slate-800 transition-all border border-slate-800 active:scale-90"
      >
        ▶
      </button>
    </div>
  );
};

export default DateNavigator;
