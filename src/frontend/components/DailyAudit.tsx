
import React, { useMemo, useState, useEffect } from 'react';
import { useAppStore } from '@/frontend/stores/useAppStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

import AIFeedbackDisplay from './AIFeedbackDisplay';
import { getDailyAuditFeedback } from '../../backend/services/geminiService';

const DailyAudit: React.FC = () => {
  const { dailyLogs, profile, aiCache, setAiCache } = useAppStore();
  const [isAnalyzingToday, setIsAnalyzingToday] = useState(false);
  const [isAnalyzingYesterday, setIsAnalyzingYesterday] = useState(false);
  const [mounted] = useState(true);

  const todayLog = dailyLogs[0];
  const yesterdayLog = dailyLogs[1];

  const cachedTodayFeedback = todayLog ? aiCache.dailyAudits[todayLog.date] : null;
  const cachedYesterdayFeedback = yesterdayLog ? aiCache.dailyAudits[yesterdayLog.date] : null;

  const calculateStats = React.useCallback((log: typeof todayLog) => {
    if (!log) return null;
    const kcalIn = log.meals?.reduce((acc, m) => acc + (m.calories || 0), 0) || 0;
    const bmr = profile.gender === 'male'
      ? (10 * log.weight) + (6.25 * profile.height) - (5 * profile.age) + 5
      : (10 * log.weight) + (6.25 * profile.height) - (5 * profile.age) - 161;

    const neat = log.steps * 0.04;
    const exercise = (log.trainingCalories || 0) + (log.walkCalories || 0);
    const kcalOut = bmr + neat + exercise;
    const balance = kcalIn - kcalOut;

    return {
      date: log.date,
      kcalIn: Math.round(kcalIn),
      kcalOut: Math.round(kcalOut),
      balance: Math.round(balance),
      bmr: Math.round(bmr),
      neat: Math.round(neat),
      exercise: Math.round(exercise)
    };
  }, [profile]);

  const todayStats = useMemo(() => calculateStats(todayLog), [todayLog, calculateStats]);
  const yesterdayStats = useMemo(() => calculateStats(yesterdayLog), [yesterdayLog, calculateStats]);

  useEffect(() => {
    const fetchTodayAudit = async () => {
      if (todayLog && !cachedTodayFeedback) {
        setIsAnalyzingToday(true);
        // Added dailyLogs as third argument
        try {
          const advice = await getDailyAuditFeedback(todayLog, profile, dailyLogs);
          if (advice) {
            setAiCache({ dailyAudits: { ...aiCache.dailyAudits, [todayLog.date]: advice } });
          }
        } catch (err) {
          console.error("Failed to fetch today's audit:", err);
          // Optional: Set some error state here if needed in next task
        }
        setIsAnalyzingToday(false);
      }
    };

    const fetchYesterdayAudit = async () => {
      if (yesterdayLog && !cachedYesterdayFeedback) {
        setIsAnalyzingYesterday(true);
        // Added dailyLogs as third argument
        try {
          const advice = await getDailyAuditFeedback(yesterdayLog, profile, dailyLogs);
          if (advice) {
            setAiCache({ dailyAudits: { ...aiCache.dailyAudits, [yesterdayLog.date]: advice } });
          }
        } catch (err) {
           console.error("Failed to fetch yesterday's audit:", err);
        }
        setIsAnalyzingYesterday(false);
      }
    };

    fetchTodayAudit();
    fetchYesterdayAudit();
  }, [todayLog, yesterdayLog, profile, setAiCache, aiCache.dailyAudits, cachedTodayFeedback, cachedYesterdayFeedback, dailyLogs]);

  if (!todayStats) return <div className="p-10 text-center uppercase font-black text-slate-500 tracking-[0.3em]">Esperando Datos...</div>;

  const todayChartData = [
    { name: 'INGESTA', val: todayStats.kcalIn, color: '#22d3ee' },
    { name: 'GASTO', val: todayStats.kcalOut, color: '#10b981' }
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500 min-w-0 pb-12">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-1">
          <span className="text-2xl">📊</span>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Balance de Hoy</h3>
        </div>
        <AIFeedbackDisplay data={cachedTodayFeedback} isLoading={isAnalyzingToday} type="audit" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass p-10 rounded-[3rem] border-slate-800 space-y-8 min-h-[350px]">
            <div className="text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Balance Neto</p>
                <h3 className={`text-6xl font-black tracking-tighter ${todayStats.balance < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {todayStats.balance > 0 ? '+' : ''}{todayStats.balance} <span className="text-sm text-slate-500 font-bold uppercase">kcal</span>
                </h3>
            </div>
            <div className="h-[200px] min-h-[200px] w-full relative">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={todayChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="black" tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Bar dataKey="val" radius={[12, 12, 0, 0]} barSize={50}>
                          {todayChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border-slate-800 flex flex-col justify-center">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Desglose Metabólico Actual</h4>
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                    <p className="text-xs font-black text-white uppercase tracking-tight">Basal (TMB)</p>
                    <span className="text-lg font-black text-white">{todayStats.bmr} kcal</span>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-xs font-black text-white uppercase tracking-tight">Actividad NEAT</p>
                    <span className="text-lg font-black text-cyan-400">{todayStats.neat} kcal</span>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-xs font-black text-white uppercase tracking-tight">Entrenamiento</p>
                    <span className="text-lg font-black text-blue-400">{todayStats.exercise} kcal</span>
                </div>
              </div>
          </div>
        </div>
      </div>

      {yesterdayLog && yesterdayStats && (
        <div className="space-y-6 pt-6 border-t border-slate-800/50">
          <div className="flex justify-between items-end px-1">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🕒</span>
              <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Resumen IA - Día Anterior</h3>
            </div>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{yesterdayLog.date}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <AIFeedbackDisplay data={cachedYesterdayFeedback} isLoading={isAnalyzingYesterday} type="audit" />
            </div>

            <div className="glass p-8 rounded-[3rem] border-slate-800 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Métricas Ayer</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Pasos</span>
                    <span className="text-sm font-black text-white">{yesterdayLog.steps.toLocaleString()}</span>
                  </div>
                  <div className={`flex justify-between items-end border-b border-slate-800 pb-2`}>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Balance</span>
                    <span className={`text-sm font-black ${yesterdayStats.balance < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {yesterdayStats.balance > 0 ? '+' : ''}{yesterdayStats.balance} kcal
                    </span>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-800 pb-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Proteína</span>
                    <span className="text-sm font-black text-cyan-400">{yesterdayLog.proteinG}g</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Sueño</span>
                    <span className="text-sm font-black text-purple-400">{yesterdayLog.sleepHours}h</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-slate-950/50 rounded-2xl border border-slate-800 text-center">
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">Entreno</p>
                <p className="text-[10px] font-black text-white uppercase truncate">{yesterdayLog.trainingType || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyAudit;
