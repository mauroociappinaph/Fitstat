
import React from 'react';

interface OptimizationStrategyProps {
  readinessScore: number;
}

const OptimizationStrategy: React.FC<OptimizationStrategyProps> = ({ readinessScore }) => {
  return (
    <div className="glass p-10 rounded-[3rem] border-slate-800 space-y-8">
      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Estrategia de Optimización</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Fuerza & Hipertrofia</p>
          <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800">
            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              Basado en tu readiness de hoy ({readinessScore}%), el volumen ideal es de <span className="text-white font-black">{readinessScore > 70 ? '16-20' : '8-12'} sets efectivos</span>. Prioriza la técnica sobre el peso absoluto si el sueño fue inferior a 7 horas.
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Cardio & Quema de Grasa</p>
          <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800">
            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              Tu eficiencia actual sugiere que la <span className="text-white font-black">Zona 2 (125-135 bpm)</span> es tu punto dulce para oxidación de grasas sin elevar el cortisol. Evita el HIIT si el balance calórico de ayer fue superior a -500 kcal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizationStrategy;
