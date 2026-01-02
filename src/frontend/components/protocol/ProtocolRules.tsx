
import React from 'react';

interface Props {
  rules: string[];
}

const ProtocolRules: React.FC<Props> = ({ rules }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter px-1">Leyes del Protocolo</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule, idx) => (
          <div key={idx} className="glass p-5 rounded-[1.5rem] border-slate-800 flex items-center gap-5 group hover:border-emerald-500/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 font-black text-xs group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all">
              {idx + 1}
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight leading-snug group-hover:text-slate-200 transition-colors">{rule}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProtocolRules;
