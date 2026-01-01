
import React, { useState } from 'react';
import { useBiometrics } from '../hooks/useBiometrics';
import { useAppStore } from '../stores/useAppStore';

const Dashboard: React.FC = () => {
  const { currentLog, nutritionTotals, targets, readiness } = useBiometrics();
  const { profile } = useAppStore();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">RESUMEN <span className="text-emerald-400">ELITE</span></h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Protocolo Atlas v11</p>
        </div>
        <div className="glass px-6 py-3 rounded-2xl border-slate-800 flex items-center gap-3">
          <span className="text-xs font-black text-slate-400 uppercase">Readiness</span>
          <span className="text-2xl font-black text-cyan-400">{readiness}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass p-6 rounded-[2rem] border-slate-800">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Peso</p>
          <h3 className="text-3xl font-black text-white">{currentLog.weight}kg</h3>
        </div>
        <div className="glass p-6 rounded-[2rem] border-emerald-500/20 bg-emerald-500/5">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Proteína</p>
          <h3 className="text-3xl font-black text-white">{nutritionTotals.p}g</h3>
          <p className="text-[8px] text-slate-500 font-bold uppercase mt-1">Meta: {targets.p}g</p>
        </div>
        <div className="glass p-6 rounded-[2rem] border-cyan-500/20 bg-cyan-500/5">
          <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Carbos</p>
          <h3 className="text-3xl font-black text-white">{nutritionTotals.c}g</h3>
        </div>
        <div className="glass p-6 rounded-[2rem] border-amber-500/20 bg-amber-500/5">
          <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Grasas</p>
          <h3 className="text-3xl font-black text-white">{nutritionTotals.f}g</h3>
        </div>
      </div>

      <div className="p-8 glass rounded-[3rem] border-slate-800/50 bg-slate-900/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Status de Nutrición</h2>
          <span className="text-[10px] font-black text-emerald-400 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">SYNC OK</span>
        </div>
        <div className="h-4 w-full bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
          <div 
            className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000" 
            style={{ width: `${Math.min((nutritionTotals.p / targets.p) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase mt-4 text-center tracking-widest">
          Consumo Proteico Actual: {Math.round((nutritionTotals.p / targets.p) * 100)}% de la meta diaria
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
