
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { getPredictions } from '../services/geminiService';
import { useDashboardData } from '../hooks/useDashboardData';
import {
  DashboardViewSwitcher,
  OverviewView,
  DailyAudit
} from './dashboard/index';

const Dashboard: React.FC = () => {
  const { aiCache, setAiCache, selectedDate, dailyLogs, profile } = useAppStore();
  const [activeView, setActiveView] = useState<'overview' | 'audit'>('overview');
  const data = useDashboardData();

  useEffect(() => {
    const fetchPreds = async () => {
      if (dailyLogs.length >= 3 && !aiCache.predictions) {
        const preds = await getPredictions(profile, dailyLogs, []);
        if (preds) setAiCache({ predictions: preds });
      }
    };
    fetchPreds();
  }, [dailyLogs.length, aiCache.predictions, profile, setAiCache]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 min-w-0">
      <DashboardViewSwitcher activeView={activeView} setActiveView={setActiveView} />

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
