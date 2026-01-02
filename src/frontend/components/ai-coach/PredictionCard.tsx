
import React from 'react';
import { PredictionValue } from '../../types';

interface PredictionCardProps {
  title: string;
  data: PredictionValue | undefined;
  unit: string;
  colorClass: string;
  bgGradient: string;
}

const MetricRangeViz: React.FC<{ data: PredictionValue; unit: string; color: string }> = ({ data, unit, color }) => {
  const range = data.max - data.min;
  const progress = range === 0 ? 50 : ((data.value - data.min) / range) * 100;
  return (
    <div className="mt-4 space-y-2">
      <div className="relative h-3 w-full bg-slate-900/50 rounded-full border border-slate-800/50 overflow-hidden">
        <div className={`absolute inset-y-0 opacity-30 ${color} rounded-full`} style={{ left: '0%', width: '100%' }}></div>
        <div className="absolute top-0 bottom-0 w-1.5 bg-white shadow-xl z-10 rounded-full" style={{ left: `${Math.max(0, Math.min(100, progress))}%`, transform: 'translateX(-50%)' }}></div>
      </div>
      <div className="flex justify-between text-[7px] font-black text-slate-600 uppercase tracking-widest">
        <span>Límite Inf.</span>
        <span>Expectativa</span>
        <span>Límite Sup.</span>
      </div>
    </div>
  );
};

const PredictionCard: React.FC<PredictionCardProps> = ({ title, data, unit, colorClass, bgGradient }) => {
  if (!data) return null;
  const confidencePercent = Math.round(data.confidence * 100);
  return (
    <div className="glass p-6 rounded-[2.5rem] border-t border-slate-800 relative overflow-hidden group shadow-2xl">
      <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${bgGradient}`}></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</p>
          <span className={`text-[9px] font-black ${confidencePercent > 80 ? 'text-emerald-400' : 'text-orange-400'}`}>{confidencePercent}% CONF.</span>
        </div>
        <h3 className="text-6xl font-black text-white tracking-tighter leading-none">{data.value.toFixed(1)}<span className="text-sm font-bold text-slate-500 ml-1 uppercase">{unit}</span></h3>
        <MetricRangeViz data={data} unit={unit} color={colorClass} />
      </div>
    </div>
  );
};

export default PredictionCard;
