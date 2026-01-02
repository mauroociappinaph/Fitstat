
import React, { useState, Suspense, useMemo } from 'react';
import Layout from '@/frontend/components/Layout';
import ErrorBoundary from '@/frontend/components/common/ErrorBoundary';
import { useAppStore } from '@/frontend/stores/useAppStore';

// Lazy loading para optimizar el bundle inicial
const Dashboard = React.lazy(() => import('@/frontend/components/Dashboard'));
const ProtocolView = React.lazy(() => import('@/frontend/components/ProtocolView'));
const NutritionHub = React.lazy(() => import('@/frontend/components/NutritionHub'));
const TrainingHub = React.lazy(() => import('@/frontend/components/TrainingHub'));
const DailyLogForm = React.lazy(() => import('@/frontend/components/DailyLogForm'));
const FitStatChat = React.lazy(() => import('@/frontend/components/FitStatChat'));
const AICoach = React.lazy(() => import('@/frontend/components/AICoach'));
const SettingsView = React.lazy(() => import('@/frontend/components/SettingsView'));

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
      <ErrorBoundary
        fallback={
          <div className="min-h-64 flex flex-col items-center justify-center space-y-4 p-6">
            <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-red-400">Error al cargar el componente</h3>
              <p className="text-sm text-slate-400 max-w-md text-center">
                Hubo un problema al cargar esta sección. Por favor intenta de nuevo.
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all duration-300 font-bold text-sm"
                >
                  Recargar App
                </button>
              </div>
            </div>
          </div>
        }
      >
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
             <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
          </div>
        }>
          {ActiveComponent}
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
};

export default App;
