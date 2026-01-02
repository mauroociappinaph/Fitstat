
import React, { useState } from 'react';
import { useAppStore } from '@/frontend/stores/useAppStore';
import { parseNaturalLanguageLog } from '@/backend/services/geminiService';

const QuickAILogger: React.FC = () => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { addDailyLog } = useAppStore();

  const handleQuickLog = async () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    
    // Usamos la fecha local actual como referencia para que la IA haga el cálculo
    const referenceDate = new Date().toISOString().split('T')[0];
    
    try {
      const data = await parseNaturalLanguageLog(text, referenceDate);
      if (data && data.date) {
        addDailyLog({ ...data, date: data.date });
        setText('');
        alert(`✅ Protocolo sincronizado para el día: ${data.date}`);
      } else {
        throw new Error("No se pudo determinar la fecha o los datos.");
      }
    } catch (e) {
      alert("❌ No pude procesar ese comando. Intenta decir algo como 'Ayer pesé 93kg' o 'Hoy caminé 10km'.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass p-6 rounded-[2.5rem] border-cyan-500/20 shadow-2xl space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-lg">🤖</div>
        <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Entrada Rápida (Smart Log)</p>
      </div>
      <div className="relative">
        <input 
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleQuickLog()}
          placeholder="Ej: Ayer pesé 93.5, hice 12000 pasos..."
          className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-5 pr-16 text-sm font-medium text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 transition-all"
        />
        <button 
          onClick={handleQuickLog}
          disabled={isProcessing}
          className="absolute right-2 top-2 bottom-2 px-4 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black rounded-xl text-[10px] uppercase transition-all disabled:opacity-50"
        >
          {isProcessing ? '...' : 'LOG'}
        </button>
      </div>
      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter px-2">
        Soporta fechas relativas: "ayer", "el lunes", "hace 2 días". La IA calculará la fecha automáticamente.
      </p>
    </div>
  );
};

export default QuickAILogger;
