
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: '📊' },
    { id: 'protocol', label: 'Plan', icon: '📋' },
    { id: 'nutrition_hub', label: 'Nutri', icon: '🧪' },
    { id: 'training_hub', label: 'Coach', icon: '⚡' },
    { id: 'log', label: 'Log', icon: '📝' },
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'ai_insights', label: 'IA', icon: '🤖' },
    { id: 'settings', label: 'Perfil', icon: '👤' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] max-w-4xl mx-auto shadow-2xl shadow-blue-900/10">
      {/* Header */}
      <header className="p-4 md:p-6 flex justify-between items-center border-b border-slate-800/50 sticky top-0 bg-[#020617]/80 backdrop-blur-xl z-40">
        <div>
          <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tighter uppercase">FITSTAT</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-800">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Protocol Sync</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 pb-28">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-4xl mx-auto bg-[#020617]/95 backdrop-blur-2xl border-t border-slate-800/50 flex justify-between px-4 py-4 z-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              activeTab === tab.id ? 'text-cyan-400 scale-110' : 'text-slate-600 hover:text-slate-400'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[8px] font-black uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
