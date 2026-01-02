
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCardioData } from '@/frontend/hooks/useCardioData';
import EfficiencyHero from './cardio/EfficiencyHero';
import ExecutiveInsights from './cardio/ExecutiveInsights';
import LabMetricsGrid from './cardio/LabMetricsGrid';
import HistoryTable from './cardio/HistoryTable';

type SubTab = 'lab' | 'history' | 'projections';

const CardioLab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('lab');
  const [mounted, setMounted] = useState(false);
  const data = useCardioData(activeSubTab);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!data.latestSession) {
    return (
      <div className="p-20 text-center space-y-6 flex flex-col items-center">
        <div className="text-8xl animate-bounce-slow">👣</div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">SINCRONIZACIÓN REQUERIDA</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Registra una actividad para activar el Cardio Lab.</p>
        </div>
      </div>
    );
  }

  const getDiagnostic = () => {
    if (data.efficiencyData.length < 3) return { status: 'CALIBRATING', color: 'cyan', label: 'Calibrando Baseline', bio: 'Estableciendo huella cardiovascular basal.' };
    if (data.baselineDelta > 3) return { status: 'OPTIMAL', color: 'emerald', label: 'Eficiencia Óptima', bio: `Tu corazón rinde un ${data.baselineDelta.toFixed(1)}% mejor que tu promedio.` };
    if (data.baselineDelta < -3) return { status: 'FATIGUE', color: 'rose', label: 'Fatiga Acumulada', bio: `Caída de eficiencia detectada. Considera reducción de volumen.` };
    return { status: 'STABLE', color: 'cyan', label: 'Estado Estacionario', bio: 'Respuesta biomecánica consistente con el plan.' };
  };

  const combinedChartData = (() => {
    const history = data.efficiencyData.map(d => ({
      date: d.dateFormatted,
      fullDate: d.date,
      historyEff: d.efficiency,
      predictionEff: null
    }));
    if (data.aiCache.cardioProjections.length === 0) return history;
    const lastReal = history[history.length - 1];
    const projections = data.aiCache.cardioProjections.map(p => ({
      date: p.date.split('-').slice(1).reverse().join('/'),
      predictionEff: parseFloat(p.efficiency.toFixed(1)),
      historyEff: null
    }));
    return lastReal ? [...history.slice(0, -1), { ...lastReal, predictionEff: lastReal.historyEff }, ...projections] : projections;
  })();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 pb-32 min-w-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
        <div className="space-y-1">
          <h2 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">CARDIO LAB</h2>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Ingeniería Biomecánica v4.0</p>
        </div>
        <div className="flex bg-slate-900/95 p-1 rounded-xl border border-slate-800 shadow-xl overflow-x-auto scrollbar-hide">
          {(['lab', 'history', 'projections'] as SubTab[]).map(tab => (
            <button key={tab} onClick={() => setActiveSubTab(tab)} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === tab ? 'bg-cyan-500 text-slate-950' : 'text-slate-500 hover:text-white'}`}>
              {tab === 'lab' ? 'Bio-Análisis' : tab === 'history' ? 'Historial' : 'IA Projections'}
            </button>
          ))}
        </div>
      </div>

      {activeSubTab === 'lab' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <EfficiencyHero 
            efficiency={data.currentEfficiency} 
            baseline={data.baselineEfficiency} 
            delta={data.baselineDelta} 
            diagnostic={getDiagnostic()} 
          />
          
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter px-1">Executive Analysis</h3>
            <ExecutiveInsights insights={data.aiCache.advancedCardioInsights} isLoading={data.isLoadingInsights} />
          </div>

          <LabMetricsGrid session={data.latestSession} />
        </div>
      )}

      {activeSubTab === 'history' && (
        <div className="animate-in fade-in duration-500">
           <HistoryTable data={data.efficiencyData} baseline={data.baselineEfficiency} />
        </div>
      )}

      {activeSubTab === 'projections' && (
        <div className="glass p-10 rounded-[3rem] border-slate-800 shadow-2xl space-y-8 animate-in fade-in duration-500">
          <div className="flex justify-between items-end">
             <div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Proyección de Eficiencia IA</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Modelado Predictivo a 30 Días</p>
             </div>
             <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">Learning Mode On</span>
          </div>
          <div className="h-[350px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={combinedChartData}>
                  <defs>
                    <linearGradient id="gHistory" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/><stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/></linearGradient>
                    <linearGradient id="gPred" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={9} fontWeight="black" tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '24px', padding: '12px' }} />
                  <Area type="monotone" dataKey="historyEff" stroke="#22d3ee" fill="url(#gHistory)" strokeWidth={5} />
                  <Area type="monotone" dataKey="predictionEff" stroke="#10b981" fill="url(#gPred)" strokeWidth={5} strokeDasharray="8 8" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          <p className="text-[9px] text-slate-500 italic text-center uppercase tracking-widest">
            * Predicción basada en adaptación cardiovascular y supercompensación.
          </p>
        </div>
      )}
    </div>
  );
};

export default CardioLab;
