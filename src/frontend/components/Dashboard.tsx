
import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/frontend/stores/useAppStore';
import { getPredictions } from '@/backend/services/geminiService';
import { useDashboardData } from '@/frontend/hooks/useDashboardData';
import {
  DashboardViewSwitcher,
  OverviewView,
  DailyAudit
} from './dashboard/index';
import ErrorBanner from './common/ErrorBanner';

const Dashboard: React.FC = () => {
  const { aiCache, setAiCache, selectedDate, dailyLogs, profile } = useAppStore();
  const [activeView, setActiveView] = useState<'overview' | 'audit'>('overview');
  const [error, setError] = useState<string | null>(null);
  const data = useDashboardData();

  useEffect(() => {
    const fetchPreds = async () => {
      if (dailyLogs.length >= 3 && !aiCache.predictions) {
        try {
          const preds = await getPredictions(profile, dailyLogs, []);
          if (preds) setAiCache({ predictions: preds });
        } catch (e: any) {
          console.error("Dashboard AI Error:", e);
          setError("No se pudieron generar predicciones. Intenta más tarde.");
        }
      }
    };
    fetchPreds();
  }, [dailyLogs, aiCache.predictions, profile, setAiCache]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 min-w-0">
      <DashboardViewSwitcher activeView={activeView} setActiveView={setActiveView} />

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {activeView === 'overview' ? (
        <OverviewView
          data={data}
          aiCache={aiCache}
          profile={profile}
          selectedDate={selectedDate}
        />
      ) : (
        <DailyAudit />
      )}
    </div>
  );
};

export default Dashboard;
