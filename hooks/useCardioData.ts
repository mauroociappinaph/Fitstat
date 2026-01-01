
import { useMemo, useState, useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { getCardioProjections, getAdvancedCardioInsights } from '../services/geminiService';

export const useCardioData = (activeSubTab: string) => {
  const { dailyLogs, profile, aiCache, setAiCache } = useAppStore();
  const [isLoadingProjections, setIsLoadingProjections] = useState(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  const walkSessions = useMemo(() => {
    // Ordenar explícitamente por fecha ISO para manejar el cambio 2025 -> 2026
    return [...dailyLogs]
      .filter(log => log.walkActivity && log.walkDistanceKm > 0)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [dailyLogs]);

  const efficiencyData = useMemo(() => {
    return walkSessions.map(log => {
      const hr = log.walkAvgHR || 1;
      const efficiency = (log.walkDistanceKm / hr) * 1000;
      return {
        ...log,
        dateFormatted: log.date.split('-').slice(1).reverse().join('/'),
        efficiency: parseFloat(efficiency.toFixed(1)),
      };
    });
  }, [walkSessions]);

  const latestSession = walkSessions[walkSessions.length - 1];

  const currentEfficiency = useMemo(() => {
    if (!latestSession || !latestSession.walkAvgHR) return 0;
    return (latestSession.walkDistanceKm / latestSession.walkAvgHR) * 1000;
  }, [latestSession]);

  const baselineEfficiency = useMemo(() => {
    const firstThree = efficiencyData.slice(0, 3);
    if (firstThree.length === 0) return 0;
    const sum = firstThree.reduce((acc, d) => acc + d.efficiency, 0);
    return sum / firstThree.length;
  }, [efficiencyData]);

  const baselineDelta = useMemo(() => {
    if (baselineEfficiency === 0) return 0;
    return ((currentEfficiency - baselineEfficiency) / baselineEfficiency) * 100;
  }, [currentEfficiency, baselineEfficiency]);

  useEffect(() => {
    const fetchAI = async () => {
      if (activeSubTab === 'projections' && aiCache.cardioProjections.length === 0 && walkSessions.length >= 3) {
        setIsLoadingProjections(true);
        const data = await getCardioProjections(dailyLogs, profile);
        setAiCache({ cardioProjections: data });
        setIsLoadingProjections(false);
      }
      if (activeSubTab === 'lab' && !aiCache.advancedCardioInsights && walkSessions.length >= 3) {
        setIsLoadingInsights(true);
        const data = await getAdvancedCardioInsights(dailyLogs, profile);
        setAiCache({ advancedCardioInsights: data });
        setIsLoadingInsights(false);
      }
    };
    fetchAI();
  }, [activeSubTab, walkSessions.length, profile, aiCache.cardioProjections.length, aiCache.advancedCardioInsights, dailyLogs, setAiCache]);

  return {
    walkSessions,
    efficiencyData,
    latestSession,
    currentEfficiency,
    baselineEfficiency,
    baselineDelta,
    isLoadingProjections,
    isLoadingInsights,
    aiCache
  };
};
