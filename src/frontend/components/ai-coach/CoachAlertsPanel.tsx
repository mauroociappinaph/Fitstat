
import React from 'react';

interface Alert {
  type: 'success' | 'warning' | 'danger';
  msg: string;
}

interface CoachAlertsPanelProps {
  alerts: Alert[];
}

const CoachAlertsPanel: React.FC<CoachAlertsPanelProps> = ({ alerts }) => {
  return (
    <div className="glass p-8 rounded-[3rem] border-slate-800 space-y-6">
      <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-slate-800 pb-4">Alertas de Inteligencia</h3>
      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <div key={i} className={`p-4 rounded-2xl border text-[10px] font-bold leading-relaxed ${
            alert.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
            alert.type === 'warning' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
            'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {alert.msg}
          </div>
        ))}
        {alerts.length === 0 && <p className="text-[10px] text-slate-500 italic text-center py-10">Sigue registrando datos para generar alertas...</p>}
      </div>
    </div>
  );
};

export default CoachAlertsPanel;
