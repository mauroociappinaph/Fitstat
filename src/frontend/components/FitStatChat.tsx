
import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/frontend/stores/useAppStore';
import { streamChatResponse } from '@/backend/services/geminiService';

const FormattedMessage: React.FC<{ text: string; role: 'user' | 'model' }> = ({ text, role }) => {
  if (role === 'user') {
    return <span className="font-bold text-white">{text}</span>;
  }

  // Dividir por líneas y procesar
  const lines = text.split('\n');

  return (
    <div className="space-y-4">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2" />;

        // Si es una lista
        if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
          return (
            <div key={i} className="flex gap-3 pl-2 group">
              <span className="text-cyan-500 font-black mt-1">▶</span>
              <p className="text-slate-300 font-medium leading-relaxed group-hover:text-white transition-colors">
                {formatMetrics(trimmed.replace(/^[-•]\s*/, ''))}
              </p>
            </div>
          );
        }

        // Si parece un título (contiene emojis al inicio o es corto)
        const hasEmojiStart = /^\p{Emoji}/u.test(trimmed);
        if (hasEmojiStart) {
          return (
            <div key={i} className="pt-2">
              <h4 className="text-sm font-black text-white uppercase tracking-tighter flex items-center gap-2">
                {trimmed}
              </h4>
            </div>
          );
        }

        // Texto normal con métricas resaltadas
        return (
          <p key={i} className="text-slate-400 font-medium leading-relaxed">
            {formatMetrics(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

// Resalta números seguidos de unidades
const formatMetrics = (text: string) => {
  const parts = text.split(/(\d+(?:\.\d+)?\s?(?:kg|g|kcal|ml|steps|pasos|km|%))/gi);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <span key={i} className="text-cyan-400 font-black">{part}</span>;
    }
    return part;
  });
};

const FitStatChat: React.FC = () => {
  const { chatHistory, addChatMessage, setChatHistory, profile, dailyLogs, strengthLogs, selectedDate } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { role: 'user' as const, parts: [{ text: input }] };
    addChatMessage(userMessage);
    setInput('');
    setIsTyping(true);

    try {
      const stream = await streamChatResponse(input, chatHistory, profile, dailyLogs, strengthLogs, selectedDate);
      let fullText = '';
      
      const modelMessage = { role: 'model' as const, parts: [{ text: '' }] };
      addChatMessage(modelMessage);

      for await (const chunk of stream) {
        fullText += chunk.text;
        setChatHistory([
          ...chatHistory,
          userMessage,
          { role: 'model', parts: [{ text: fullText }] }
        ]);
      }
    } catch (err) {
      console.error(err);
      addChatMessage({ role: 'model', parts: [{ text: "❌ Error de conexión. El servidor de IA está saturado." }] });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[78vh] animate-in fade-in duration-500 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 space-y-8 scrollbar-hide pb-8" ref={scrollRef}>
        {chatHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
             <div className="w-20 h-20 rounded-[2.5rem] bg-cyan-500/10 flex items-center justify-center text-4xl border border-cyan-500/20 shadow-2xl animate-pulse">🤖</div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">FitStat Oráculo</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] leading-relaxed max-w-xs mx-auto">
                  Motor Predictivo v4.0 Sincronizado
                </p>
             </div>
             <div className="flex flex-wrap justify-center gap-3 pt-4">
               {["¿Cómo llego a mi proteína?", "¿Por qué subí de peso?", "¿Qué entreno hoy?"].map(q => (
                 <button 
                  key={q} 
                  onClick={() => setInput(q)}
                  className="px-4 py-2 rounded-2xl bg-slate-900/50 border border-slate-800 text-[10px] font-black text-cyan-400 uppercase tracking-tighter hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all"
                 >
                   {q}
                 </button>
               ))}
             </div>
          </div>
        )}

        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] px-6 py-5 rounded-[2.5rem] shadow-2xl relative ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none border border-blue-400/20' 
                : 'bg-slate-900/80 border border-slate-800/80 text-slate-200 rounded-tl-none backdrop-blur-xl'
            }`}>
              {msg.role === 'model' && (
                <div className="absolute -top-3 -left-1 px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[7px] font-black text-slate-500 uppercase tracking-widest">
                  AI FEEDBACK
                </div>
              )}
              <FormattedMessage text={msg.parts[0].text} role={msg.role} />
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-slate-900 border border-slate-800 px-6 py-4 rounded-[2rem] rounded-tl-none">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#020617]/80 backdrop-blur-xl border-t border-slate-800">
        <div className="relative max-w-2xl mx-auto">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Interroga al Oráculo..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-[2rem] py-5 pl-7 pr-20 text-sm font-bold text-white outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-600 shadow-inner"
          />
          <button 
            onClick={handleSend}
            disabled={isTyping}
            className="absolute right-2.5 top-2.5 bottom-2.5 px-6 bg-white text-slate-950 font-black rounded-[1.5rem] text-[10px] uppercase transition-all hover:bg-cyan-400 active:scale-95 disabled:opacity-50 shadow-xl"
          >
            SND
          </button>
        </div>
      </div>
    </div>
  );
};

export default FitStatChat;
