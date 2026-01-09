
import React, { useState } from 'react';
import { useAppStore } from '@/frontend/stores/useAppStore';
import { DailyAudit } from './dashboard/index';
import ReadinessCard from './ai-coach/ReadinessCard';
import CoachAlertsPanel from './ai-coach/CoachAlertsPanel';
import PredictionCard from './ai-coach/PredictionCard';
import OptimizationStrategy from './ai-coach/OptimizationStrategy';
import SleepCorrelationCard from './ai-coach/SleepCorrelationCard';
import { useAICoachData } from '@/frontend/hooks/useAICoachData';

const AICoach: React.FC = () => {
  const { dailyLogs, isLoading } = useAppStore();
  const [activeView, setActiveView] = useState<'predictions' | 'audit' | 'coach'>('coach');

  const hasEnoughData = dailyLogs.length >= 3;
  const { readinessScore, coachAlerts, predictions, patterns, sleepAnalysis } = useAICoachData(hasEnoughData, activeView);

  const translateStrength = (s: string) => {
    switch(s) {
      case 'Dominant': return 'DOMINANTE';
      case 'Established': return 'ESTABLECIDO';
      case 'Emerging': return 'EMERGENTE';
      default: return s;
    }
  };

  if (!hasEnoughData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 p-12 text-center">
        <div className="text-8xl">🤖</div>
        <div className="space-y-4 max-w-md">
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Motor de IA en Standby</h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Necesito al menos <span className="text-cyan-400">3 días</span> de registros para calibrar tus redes metabólicas.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/30">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">FitStat Coach Engine</span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">INSIGHTS HUB</h1>
        </div>
        <div className="flex bg-slate-900/95 p-1 rounded-xl border border-slate-800 w-full md:w-auto">
          {(['coach', 'audit', 'predictions'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`flex-1 px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeView === view ? 'bg-cyan-500 text-slate-950' : 'text-slate-500 hover:text-white'}`}
            >
              {view === 'coach' ? 'Coach' : view === 'audit' ? 'Auditoría' : 'Proyecciones'}
            </button>
          ))}
        </div>
      </div>

      {activeView === 'coach' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReadinessCard score={readinessScore} />
            <CoachAlertsPanel alerts={coachAlerts} />
          </div>
          <SleepCorrelationCard data={sleepAnalysis} isLoading={isLoading} />
          <OptimizationStrategy readinessScore={readinessScore} />
        </div>
      )}

      {activeView === 'audit' && <DailyAudit />}

      {activeView === 'predictions' && (
        isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-6">
             <div className="w-20 h-20 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
             <p className="text-sm font-black text-cyan-400 animate-pulse uppercase tracking-widest">Consultando Oráculo...</p>
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PredictionCard title="7 Días" data={predictions?.weight7d} unit="kg" colorClass="bg-cyan-500" bgGradient="from-cyan-500 to-transparent" />
              <PredictionCard title="30 Días" data={predictions?.weight30d} unit="kg" colorClass="bg-purple-500" bgGradient="from-purple-500 to-transparent" />
              <PredictionCard title="90 Días" data={predictions?.weight90d} unit="kg" colorClass="bg-emerald-500" bgGradient="from-emerald-500 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">🧬 Huellas Metabólicas</h2>
                  <div className="space-y-4">
                    {patterns.map((pattern) => (
                      <div key={pattern.id} className="glass p-6 rounded-[2rem] border-slate-800">
                        <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-4 inline-block ${pattern.strength === 'Dominant' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-500'}`}>
                          {translateStrength(pattern.strength)}
                        </span>
                        <h4 className="text-lg font-black text-white mb-2 uppercase italic">{pattern.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-slate-800 pl-4">"{pattern.correlation}"</p>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="space-y-6">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">🏁 Hitos de Definición</h2>
                  <div className="space-y-4">
                     <div className="glass p-8 rounded-[3rem] border-orange-500/20 bg-orange-500/5">
                        <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2">Aparición 4-Abs</p>
                        <h3 className="text-6xl font-black text-white tracking-tighter">{predictions?.daysTo4Abs.value.toFixed(0)} <span className="text-lg text-slate-500 font-bold uppercase">Días</span></h3>
                     </div>
                     <div className="glass p-8 rounded-[3rem] border-cyan-500/20 bg-cyan-500/5">
                        <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2">Six-Pack Definido</p>
                        <h3 className="text-6xl font-black text-white tracking-tighter">{predictions?.daysToSixPack.value.toFixed(0)} <span className="text-lg text-slate-500 font-bold uppercase">Días</span></h3>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AICoach;
