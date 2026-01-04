
import React, { useMemo, useState, useEffect } from 'react';
import { useAppStore } from '@/frontend/stores/useAppStore';
import { MASTER_PLAN } from '@/shared/constants/masterPlan';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getNutritionFeedback } from '@/backend/services/geminiService';
import AIFeedbackDisplay from './AIFeedbackDisplay';
import { useBiometrics } from '@/frontend/hooks/useBiometrics';

const NutritionView: React.FC = () => {
  const { setAiCache, aiCache } = useAppStore();
  const { currentLog, targets, nutritionTotals, profile, selectedDate } = useBiometrics();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const startDate = new Date(profile.startDate);
  const diffMonths = (new Date().getFullYear() - startDate.getFullYear()) * 12 + (new Date().getMonth() - startDate.getMonth());
  const currentPhase = MASTER_PLAN.phases.find(p => diffMonths >= p.rangeMonths[0] && diffMonths < p.rangeMonths[1]) || MASTER_PLAN.phases[0];

  useEffect(() => {
    const fetchFeedback = async () => {
      if ((nutritionTotals.p === 0 && nutritionTotals.c === 0) || aiCache.nutritionAdvice) return;
      setIsAnalyzing(true);
      const feedback = await getNutritionFeedback(nutritionTotals, targets, currentPhase.name, currentLog.trainingType || 'General');
      if (feedback) setAiCache({ nutritionAdvice: feedback });
      setIsAnalyzing(false);
    };
    fetchFeedback();
  }, [nutritionTotals, targets, currentPhase.name, aiCache.nutritionAdvice, currentLog.trainingType, setAiCache]);

  const chartData = [
    { name: 'INGESTA', Prot: nutritionTotals.p, Carb: nutritionTotals.c, Gras: nutritionTotals.f },
    { name: 'TARGET', Prot: targets.p, Carb: targets.c, Gras: targets.f }
  ];

  const AdherenceBar = ({ label, current, target, color, unit, sub }: any) => {
    const percent = Math.min(Math.round((current / (target || 1)) * 100), 115);
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-end">
           <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
              <p className="text-xl font-black text-white">{current}<span className="text-[10px] text-slate-500 ml-1">{unit}</span></p>
           </div>
           <div className="text-right">
              <p className="text-[9px] font-bold text-slate-600 uppercase">{sub || `Target: ${target}${unit}`}</p>
              <p className={`text-[10px] font-black ${percent > 105 ? 'text-rose-500' : percent > 90 ? 'text-emerald-400' : 'text-cyan-400'}`}>{percent}%</p>
           </div>
        </div>
        <div className="h-2 w-full bg-slate-900 rounded-full border border-slate-800 overflow-hidden">
           <div className={`h-full transition-all duration-1000 ${color}`} style={{ width: `${Math.min(percent, 100)}%` }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-28">
      <div className="px-1 space-y-1">
        <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">NUTRITION LAB</h2>
        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">{currentPhase.name}</p>
      </div>

      <AIFeedbackDisplay data={aiCache.nutritionAdvice} isLoading={isAnalyzing} type="nutrition" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[3rem] border-slate-800 h-[400px]">
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8">Matriz de Balance</h3>
          <div className="h-full w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="black" />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }} />
                  <Bar dataKey="Prot" stackId="a" fill="#10b981" />
                  <Bar dataKey="Carb" stackId="a" fill="#06b6d4" />
                  <Bar dataKey="Gras" stackId="a" fill="#f59e0b" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="glass p-8 rounded-[3rem] border-slate-800 space-y-8">
           <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Precision Score</h3>
           <div className="space-y-6">
              <AdherenceBar label="Ancla Proteica" current={nutritionTotals.p} target={targets.p} color="bg-emerald-500" unit="g" />
              <AdherenceBar label="Energía (Carbos)" current={nutritionTotals.c} target={targets.c} color="bg-cyan-500" unit="g" sub={`${targets.carbMultiplier}g/kg`} />
              <AdherenceBar label="Grasas" current={nutritionTotals.f} target={targets.f} color="bg-amber-500" unit="g" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionView;
