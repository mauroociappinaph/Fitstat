
import React, { useState, Suspense, useMemo } from 'react';
import Layout from './components/Layout';
import { useAppStore } from './stores/useAppStore';

// Lazy loading para optimizar el bundle inicial
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const ProtocolView = React.lazy(() => import('./components/ProtocolView'));
const NutritionHub = React.lazy(() => import('./components/NutritionHub'));
const TrainingHub = React.lazy(() => import('./components/TrainingHub'));
const DailyLogForm = React.lazy(() => import('./components/DailyLogForm'));
const FitStatChat = React.lazy(() => import('./components/FitStatChat'));
const AICoach = React.lazy(() => import('./components/AICoach'));
const SettingsView = React.lazy(() => import('./components/SettingsView'));

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { _hasHydrated } = useAppStore();

  const ActiveComponent = useMemo(() => {
    const routes: Record<string, React.ReactNode> = {
      dashboard: <Dashboard />,
      protocol: <ProtocolView />,
      nutrition_hub: <NutritionHub />,
      training_hub: <TrainingHub />,
      log: <DailyLogForm />,
      chat: <FitStatChat />,
      ai_insights: <AICoach />,
      settings: <SettingsView />,
    };
    return routes[activeTab] || <Dashboard />;
  }, [activeTab]);

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-1 bg-cyan-500 rounded-full animate-pulse"></div>
        <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">Cargando Atlas de Salud...</p>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
           <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      }>
        {ActiveComponent}
      </Suspense>
    </Layout>
  );
};

export default App;
