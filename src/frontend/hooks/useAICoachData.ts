
import { useEffect, useMemo } from 'react';
import { useAppStore } from '@/frontend/stores/useAppStore';
import { getPredictions, getMetabolicPatterns, getSleepCorrelationAnalysis } from '@/backend/services/geminiService';
import { calculateReadiness } from '@/shared/utils/healthMath';

export const useAICoachData = (hasEnoughData: boolean, activeView: string) => {
  const { profile, dailyLogs, strengthLogs, setLoading, aiCache, setAiCache } = useAppStore();

  useEffect(() => {
    const fetchAIInsights = async () => {
      if (!hasEnoughData || activeView === 'audit' || (aiCache.predictions && aiCache.patterns.length > 0 && aiCache.sleepAnalysis)) return;

      setLoading(true);
      try {
        const [predData, patternsData, sleepData] = await Promise.all([
          getPredictions(profile, dailyLogs, strengthLogs),
          getMetabolicPatterns(dailyLogs),
          getSleepCorrelationAnalysis(dailyLogs)
        ]);
        setAiCache({ predictions: predData, patterns: patternsData, sleepAnalysis: sleepData });
      } catch (err) {
        console.error("Error fetching AI insights:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAIInsights();
  }, [dailyLogs.length, activeView, aiCache.predictions, aiCache.patterns.length, aiCache.sleepAnalysis, hasEnoughData, profile, strengthLogs.length, setAiCache, setLoading]);

  // Use calculateReadiness from healthMath instead of local implementation
  const readinessScore = useMemo(() => calculateReadiness(dailyLogs, profile), [dailyLogs, profile]);

  const coachAlerts = useMemo(() => {
    const alerts = [];
    const latest = dailyLogs[0];
    if (!latest) return [];

    if (readinessScore > 85) alerts.push({ type: 'success' as const, msg: 'ESTADO ÓPTIMO: Día para buscar RPE 9-10 en fuerza.' });
    if (readinessScore < 60) alerts.push({ type: 'warning' as const, msg: 'RECUPERACIÓN COMPROMETIDA: Considera cardio LISS o reducción de volumen.' });
    if (latest.sleepHours < 6) alerts.push({ type: 'danger' as const, msg: 'DÉFICIT CRÍTICO DE SUEÑO: Riesgo de lesión incrementado.' });
    if (latest.proteinG < (latest.weight * 1.8)) alerts.push({ type: 'warning' as const, msg: 'ANCLA PROTEICA BAJA: Riesgo de pérdida de masa magra.' });

    return alerts;
  }, [readinessScore, dailyLogs]);

  return {
    readinessScore,
    coachAlerts,
    predictions: aiCache.predictions,
    patterns: aiCache.patterns,
    sleepAnalysis: aiCache.sleepAnalysis
  };
};
