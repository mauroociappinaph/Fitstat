import React from 'react';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onDismiss, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-xl flex justify-between items-center gap-4 animate-in fade-in slide-in-from-top-2 ${className}`}>
      <div className="flex items-center gap-3">
        <span>⚠️</span>
        <p className="text-sm font-bold">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-rose-500/20 rounded-full transition-colors"
          aria-label="Cerrar alerta"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;
