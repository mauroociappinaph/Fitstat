
import React from 'react';
import { PerformanceHeader, QuickStatsGrid, MetabolicAdjustmentCard, BiometricTrendChart, MilestoneTimeline } from './index';

interface Props {
  data: any;
  aiCache: any;
  profile: any;
  selectedDate: string;
}

const OverviewView: React.FC<Props> = ({ data, aiCache, profile, selectedDate }) => {
  return (
    <div className="space-y-8">
      <PerformanceHeader 
        readiness={data.readinessScore} 
        proteinStatus={data.proteinStatus} 
      />

      <QuickStatsGrid 
        weight={data.latestLog.weight}
        progressPercent={data.progressPercent}
        steps={data.latestLog.steps}
        waterL={(data.latestLog.waterMl || 0) / 1000}
        isToday={selectedDate === data.latestLog.date}
      />

      <MetabolicAdjustmentCard adjustment={data.metabolicAdjustment} />

      <div className="space-y-6">
        <div className="px-1">
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Proyección de Hitos</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Basado en tu ritmo real de pérdida de peso</p>
        </div>
        <div className="glass p-8 rounded-[3rem] border-slate-800/60 shadow-xl overflow-hidden min-h-[250px]">
          <MilestoneTimeline 
            predictions={aiCache.predictions} 
            profile={profile} 
            currentWeight={data.latestLog.weight} 
          />
        </div>
      </div>

      <BiometricTrendChart data={data.timelineData} />
    </div>
  );
};

export default OverviewView;
