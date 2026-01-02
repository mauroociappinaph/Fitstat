
import React, { useMemo } from 'react';
import { PredictionData, UserProfile } from '../../types';

interface Milestone {
  id: string;
  label: string;
  subLabel: string;
  date: Date;
  icon: string;
  color: string;
  completed: boolean;
}

interface Props {
  predictions: PredictionData | null;
  profile: UserProfile;
  currentWeight: number;
}

const MilestoneTimeline: React.FC<Props> = ({ predictions, profile, currentWeight }) => {
  const milestones = useMemo(() => {
    const list: Milestone[] = [];
    const now = new Date();

    list.push({
      id: 'start',
      label: 'Inicio Protocolo',
      subLabel: `${profile.initialWeight}kg`,
      date: new Date(profile.startDate),
      icon: '🚀',
      color: 'bg-slate-500',
      completed: true
    });

    list.push({
      id: 'current',
      label: 'Estado Actual',
      subLabel: `${currentWeight}kg`,
      date: now,
      icon: '📍',
      color: 'bg-cyan-500',
      completed: true
    });

    if (predictions) {
      const d30 = new Date();
      d30.setDate(now.getDate() + 30);
      list.push({
        id: '30d',
        label: 'Meta Volante',
        subLabel: `${predictions.weight30d.value.toFixed(1)}kg`,
        date: d30,
        icon: '📈',
        color: 'bg-purple-500',
        completed: false
      });

      if (predictions.daysTo4Abs.value > 0) {
        const d4Abs = new Date();
        d4Abs.setDate(now.getDate() + predictions.daysTo4Abs.value);
        list.push({
          id: '4abs',
          label: 'Visibilidad 4-Abs',
          subLabel: 'Definición Media',
          date: d4Abs,
          icon: '🔥',
          color: 'bg-orange-500',
          completed: false
        });
      }

      if (predictions.daysToSixPack.value > 0) {
        const dSix = new Date();
        dSix.setDate(now.getDate() + predictions.daysToSixPack.value);
        list.push({
          id: 'sixpack',
          label: 'Six-Pack Alpha',
          subLabel: 'Peak Condition',
          date: dSix,
          icon: '💎',
          color: 'bg-blue-500',
          completed: false
        });
      }
    }

    const remainingKg = currentWeight - profile.targetWeight;
    const estimatedDays = (remainingKg / 0.5) * 7;
    const finalDate = new Date();
    finalDate.setDate(now.getDate() + estimatedDays);

    list.push({
      id: 'target',
      label: 'Objetivo Final',
      subLabel: `${profile.targetWeight}kg`,
      date: finalDate,
      icon: '🏁',
      color: 'bg-emerald-500',
      completed: false
    });

    return list.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [predictions, profile, currentWeight]);

  return (
    <div className="relative">
      <div className="flex overflow-x-auto pb-8 pt-4 gap-6 scrollbar-hide px-2">
        {milestones.map((ms, idx) => {
          const isLast = idx === milestones.length - 1;
          const isPast = ms.date < new Date();
          
          return (
            <div key={ms.id} className="relative flex-none w-48 group">
              {!isLast && (
                <div className="absolute top-8 left-1/2 w-full h-[2px] bg-slate-800 z-0">
                  <div className={`h-full transition-all duration-1000 ${ms.completed || isPast ? 'bg-cyan-500 w-full' : 'bg-slate-800 w-0'}`}></div>
                </div>
              )}

              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-2xl shadow-xl transition-all duration-500 border-2 ${ms.completed ? 'bg-slate-900 border-cyan-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-600 group-hover:border-slate-700'}`}>
                  {ms.icon}
                  {ms.completed && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full border-2 border-[#020617] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </div>

                <div className="space-y-1 px-2">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${ms.completed ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {ms.label}
                  </p>
                  <p className="text-sm font-black text-white uppercase italic tracking-tighter">
                    {ms.subLabel}
                  </p>
                  <p className="text-[9px] font-bold text-slate-600 uppercase">
                    {ms.date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-20 bg-gradient-to-l from-[#020617] to-transparent pointer-events-none md:hidden"></div>
    </div>
  );
};

export default MilestoneTimeline;
