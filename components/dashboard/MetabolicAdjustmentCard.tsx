
import React from 'react';

interface Props {
  adjustment: {
    proteinTarget: number;
    carbTarget: number;
    kcalTarget: number;
    mode: string;
    modeColor: string;
    modeBg: string;
    description: string;
  };
}

const MetabolicAdjustmentCard: React.FC<Props> = ({ adjustment }) => {
  return (
    <div className="glass p-8 rounded-[3rem] border-slate-800 relative overflow-hidden shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
        <div className="space-y-4 max-w-md">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-lg ${adjustment.modeBg} ${adjustment.modeColor} text-[10px] font-black uppercase tracking-widest border border-current/20`}>
              {adjustment.mode}
            </span>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocolo Atlas</p>
          </div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Ajuste Metabólico</h2>
          <p className="text-xs text-slate-400 font-bold leading-relaxed italic border-l-2 border-slate-800 pl-4">
            "{adjustment.description}"
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 bg-slate-950/50 p-6 rounded-[2.5rem] border border-slate-800/50">
          <div className="text-center space-y-1">
            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Prot</p>
            <p className="text-2xl font-black text-white">{adjustment.proteinTarget}g</p>
          </div>
          <div className="text-center space-y-1 border-x border-slate-800/50 px-4">
            <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Carb</p>
            <p className="text-2xl font-black text-white">{adjustment.carbTarget}g</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Kcal</p>
            <p className="text-2xl font-black text-white">{adjustment.kcalTarget}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetabolicAdjustmentCard;
