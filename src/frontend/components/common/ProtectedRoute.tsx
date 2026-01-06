import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/frontend/stores/useAppStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, _hasHydrated } = useAppStore();
  const location = useLocation();

  // Esperar a que el store se hidrate antes de decidir
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-1 bg-cyan-500 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (!session) {
    // Redirigir a /auth pero guardando la ubicación actual para volver después del login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
