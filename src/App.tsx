
import React, { useState, Suspense, useMemo } from 'react';
import Layout from '@/frontend/components/Layout';
import { useAppStore } from '@/frontend/stores/useAppStore';

// Lazy loading de todos los módulos del sistema
const Dashboard = React.lazy(() => import('@/frontend/components/Dashboard'));
const TrainingHub = React.lazy(() => import('@/frontend/components/TrainingHub'));
const NutritionHub = React.lazy(() => import('@/frontend/components/NutritionHub'));
const DailyLogForm = React.lazy(() => import('@/frontend/components/DailyLogForm'));
const ProtocolView = React.lazy(() => import('@/frontend/components/ProtocolView'));
const AICoach = React.lazy(() => import('@/frontend/components/AICoach'));
const FitStatChat = React.lazy(() => import('@/frontend/components/FitStatChat'));
const SettingsView = React.lazy(() => import('@/frontend/components/SettingsView'));

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { _hasHydrated } = useAppStore();

  const ActiveComponent = useMemo(() => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'training_hub': return <TrainingHub />;
      case 'nutrition_hub': return <NutritionHub />;
      case 'log': return <DailyLogForm />;
      case 'protocol': return <ProtocolView />;
      case 'ai_insights': return <AICoach />;
      case 'chat': return <FitStatChat />;
      case 'settings': return <SettingsView />;
      default: return <Dashboard />;
    }
  }, [activeTab]);

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Sincronizando Macros...</p>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64 text-slate-500 animate-pulse uppercase text-[10px] font-black">
          Cargando Módulo...
        </div>
      }>
        {ActiveComponent}
      </Suspense>
    </Layout>
  );
};

export default App;
