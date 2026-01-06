
import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/frontend/components/Layout';
import ErrorBoundary from '@/frontend/components/common/ErrorBoundary';
import ProtectedRoute from '@/frontend/components/common/ProtectedRoute';
import { useAppStore } from '@/frontend/stores/useAppStore';
import { supabase } from '@/backend/services/supabase';

// Lazy loading para optimizar el bundle inicial
const Dashboard = React.lazy(() => import('@/frontend/components/Dashboard'));
const ProtocolView = React.lazy(() => import('@/frontend/components/ProtocolView'));
const NutritionHub = React.lazy(() => import('@/frontend/components/NutritionHub'));
const TrainingHub = React.lazy(() => import('@/frontend/components/TrainingHub'));
const DailyLogForm = React.lazy(() => import('@/frontend/components/DailyLogForm'));
const FitStatChat = React.lazy(() => import('@/frontend/components/FitStatChat'));
const AICoach = React.lazy(() => import('@/frontend/components/AICoach'));
const SettingsView = React.lazy(() => import('@/frontend/components/SettingsView'));

// Auth Component
const AuthView = React.lazy(() => import('@/frontend/components/AuthView'));

const App: React.FC = () => {
  const { _hasHydrated, setSession } = useAppStore();

  useEffect(() => {
    // 1. Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-1 bg-cyan-500 rounded-full animate-pulse"></div>
        <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">Cargando Atlas de Salud...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4 p-6 text-center">
          <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
          <h3 className="text-lg font-bold text-red-400">Error en el núcleo de la aplicación</h3>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg font-bold text-sm"
          >
            Reiniciar Sistema
          </button>
        </div>
      }
    >
      <Suspense fallback={
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
           <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      }>
        <Routes>
          {/* Public Routes */}
          <Route path="/auth" element={<AuthView />} />

          {/* Protected Routes Wrapper */}
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="protocol" element={<ProtocolView />} />
                  <Route path="nutrition_hub" element={<NutritionHub />} />
                  <Route path="training_hub" element={<TrainingHub />} />
                  <Route path="log" element={<DailyLogForm />} />
                  <Route path="chat" element={<FitStatChat />} />
                  <Route path="ai_insights" element={<AICoach />} />
                  <Route path="settings" element={<SettingsView />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
