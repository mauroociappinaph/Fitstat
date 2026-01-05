import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/backend/services/supabase';
import { useNavigate } from 'react-router-dom';

const AuthView: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Escuchar cambios en la sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tighter uppercase mb-2">
            FITSTAT
          </h1>
          <p className="text-slate-400 font-medium tracking-wide">Protocolo de Salud Inteligente</p>
        </div>

        <div className="glass p-8 rounded-2xl border border-slate-800/50 shadow-2xl">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#06b6d4',
                    brandAccent: '#0891b2',
                    inputBackground: 'rgba(15, 23, 42, 0.4)',
                    inputText: '#f8fafc',
                    inputPlaceholder: '#64748b',
                    inputBorder: 'rgba(255, 255, 255, 0.05)',
                  },
                  fontSizes: {
                    baseBodySize: '14px',
                  },
                  radii: {
                    borderRadiusButton: '12px',
                  }
                },
              },
              className: {
                container: 'space-y-4',
                label: 'text-slate-400 text-xs font-bold uppercase tracking-widest mb-1 ml-1',
                button: 'font-black uppercase tracking-widest text-[#020617] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300',
                input: 'glass border-slate-800/50 text-slate-100 placeholder:text-slate-600',
                anchor: 'text-cyan-400 hover:text-cyan-300 text-xs font-bold transition-colors duration-200'
              }
            }}
            providers={['google']}
            localization={{
              variables: {
                sign_up: {
                  email_label: 'Correo electrónico',
                  password_label: 'Contraseña',
                  button_label: 'Crear Protocolo',
                  social_provider_text: 'Iniciar con {{provider}}',
                  link_text: '¿No tienes cuenta? Regístrate',
                },
                sign_in: {
                  email_label: 'Correo electrónico',
                  password_label: 'Contraseña',
                  button_label: 'Acceder al Sistema',
                  social_provider_text: 'Iniciar con {{provider}}',
                  link_text: '¿Ya tienes cuenta? Inicia sesión',
                },
              },
            }}
          />
        </div>

        <div className="text-center pt-4">
          <div className="flex items-center gap-2 justify-center px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800 inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Servidor Seguro Activo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
