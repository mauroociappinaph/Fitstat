
import React from 'react';

interface MetricInputProps {
  label: string;
  name: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unit?: string;
  step?: string;
  min?: string;
  max?: string;
  className?: string;
}

const MetricInput: React.FC<MetricInputProps> = ({ 
  label, name, value, onChange, unit, step = "1", min = "0", max, className = "" 
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2">{label}</label>
      <div className="relative group">
        <input 
          type="number" 
          name={name} 
          step={step}
          min={min}
          max={max}
          value={value} 
          onChange={onChange} 
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm font-bold text-white outline-none group-focus-within:border-cyan-500/40 transition-all shadow-inner" 
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-600 uppercase">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

export default MetricInput;
