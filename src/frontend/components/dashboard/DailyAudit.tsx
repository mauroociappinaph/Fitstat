
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { getDailyAuditFeedback } from '../../services/geminiService';
import AIFeedbackDisplay from '../AIFeedbackDisplay';
import AuditStoryChart from './AuditStoryChart';
import { useBiometrics } from '../../hooks/useBiometrics';

const DailyAudit: React.FC = () => {
  const { setAiCache, aiCache, dailyLogs } = useAppStore();
  const { currentLog, metabolism, nutritionTotals, profile, selectedDate } = useBiometrics();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const cachedFeedback = currentLog ? aiCache.dailyAudits[currentLog.date] : null;

  useEffect(() => {
    const fetchAudit = async () => {
      if (currentLog && !cachedFeedback) {
        setIsAnalyzing(true);
        const advice = await getDailyAuditFeedback(currentLog, profile, dailyLogs);
        if (advice) {
          setAiCache({ dailyAudits: { ...aiCache.dailyAudits, [currentLog.date]: advice } });
        }
        setIsAnalyzing(false);
      }
    };
    fetchAudit();
  }, [currentLog?.date, cachedFeedback, dailyLogs, profile, setAiCache, aiCache.dailyAudits]);

  const balance = nutritionTotals.kcal - metabolism.actualTDEE;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-[2.5rem] border-slate-800 space-y-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Motor Adaptativo (ActualTDEE)</p>
          <div className="flex justify-between items-end">
            <h4 className="text-4xl font-black text-white tracking-tighter">{Math.round(metabolism.actualTDEE)} <span className="text-sm text-slate-500 font-bold uppercase">kcal</span></h4>
            <span className="text-[9px] font-black text-cyan-400 uppercase bg-cyan-500/10 px-2 py-1 rounded">{metabolism.deltaReason}</span>
          </div>
        </div>
        <div className={`glass p-6 rounded-[2.5rem] border-slate-800 space-y-4 ${balance < 0 ? 'border-emerald-500/20' : 'border-rose-500/20'}`}>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Balance Neto Registrado</p>
          <h4 className={`text-4xl font-black tracking-tighter ${balance < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {balance > 0 ? '+' : ''}{Math.round(balance)} <span className="text-sm opacity-50 uppercase">kcal</span>
          </h4>
        </div>
      </div>

      <div className="glass p-8 rounded-[3rem] border-slate-800 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Visualización de Flujo Energético</h3>
           <div className="flex gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                 <span className="text-[8px] font-black text-slate-500 uppercase">Ingesta</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                 <span className="text-[8px] font-black text-slate-500 uppercase">Gasto</span>
              </div>
           </div>
        </div>
        <AuditStoryChart meals={currentLog.meals || []} hourlyBurn={metabolism.actualTDEE / 24} />
      </div>

      <AIFeedbackDisplay data={cachedFeedback} isLoading={isAnalyzing} type="audit" />
    </div>
  );
};

export default DailyAudit;
