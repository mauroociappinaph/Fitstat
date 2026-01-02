
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { validateProfile } from '../utils/validation';

const SettingsView: React.FC = () => {
  const { profile, setProfile, dailyLogs, strengthLogs, importFullState, resetToInitial } = useAppStore();
  const [editProfile, setEditProfile] = useState(profile);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setEditProfile(profile);
  }, [profile]);

  const handleExport = () => {
    const dataStr = JSON.stringify({ profile, dailyLogs, strengthLogs }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `fitstat_backup_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.profile && json.dailyLogs) {
          importFullState(json);
          alert("✅ Protocolo FitStat sincronizado correctamente.");
          window.location.reload();
        } else {
          alert("❌ El archivo no parece ser un backup válido.");
        }
      } catch (err) {
        alert("❌ Error al leer el archivo.");
      }
    };
    reader.readAsText(file);
  };

  const handleHardReset = () => {
    if (window.confirm("⚠️ ¿Sincronizar Dataset Maestro? Esto sobreescribirá tus cambios manuales con el historial real del 24/12 al 31/12.")) {
      resetToInitial();
      alert("🚀 Dataset Maestro sincronizado (8 días de registros reales).");
      window.location.reload();
    }
  };

  const saveProfileUpdate = () => {
    const validation = validateProfile(editProfile);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    setErrors([]);
    setProfile(editProfile);
    alert("✅ Perfil Biométrico Actualizado");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="space-y-1">
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase">PERFIL & SYNC</h2>
        <p className="text-slate-400 text-sm">Gestión de datos y portabilidad del protocolo</p>
      </div>

      {errors.length > 0 && (
        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] space-y-2">
          {errors.map((err, i) => (
            <p key={i} className="text-xs font-black text-rose-400 uppercase tracking-widest text-center italic">• {err}</p>
          ))}
        </div>
      )}
      
      <div className="glass p-8 rounded-[2.5rem] border-slate-800/60 space-y-8 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-black shadow-lg shadow-cyan-500/20">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">{profile.name}</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Master Plan Nivel 1</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Nombre de Usuario</label>
            <input 
              type="text" 
              value={editProfile.name}
              onChange={(e) => setEditProfile({...editProfile, name: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm font-bold text-white focus:ring-2 focus:ring-cyan-500 outline-none" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Peso Objetivo (kg)</label>
            <input 
              type="number" 
              min="30"
              max="500"
              value={editProfile.targetWeight}
              onChange={(e) => setEditProfile({...editProfile, targetWeight: parseFloat(e.target.value) || 0})}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm font-bold text-cyan-400 focus:ring-2 focus:ring-cyan-500 outline-none" 
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Altura (cm)</label>
            <input 
              type="number" 
              min="50"
              max="270"
              value={editProfile.height}
              onChange={(e) => setEditProfile({...editProfile, height: parseFloat(e.target.value) || 0})}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm font-bold text-white focus:ring-2 focus:ring-cyan-500 outline-none" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Edad (Años)</label>
            <input 
              type="number" 
              min="12"
              max="110"
              value={editProfile.age}
              onChange={(e) => setEditProfile({...editProfile, age: parseFloat(e.target.value) || 0})}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm font-bold text-white focus:ring-2 focus:ring-cyan-500 outline-none" 
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Nivel de Actividad Diaria</label>
            <select 
              value={editProfile.activityLevel}
              onChange={(e) => setEditProfile({...editProfile, activityLevel: e.target.value as any})}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm font-bold text-white focus:ring-2 focus:ring-cyan-500 outline-none appearance-none"
            >
              <option value="sedentary">Sedentario (Trabajo sentado, poco movimiento)</option>
              <option value="light">Ligero (1-3 días de actividad suave)</option>
              <option value="moderate">Moderado (3-5 días entrenamiento)</option>
              <option value="active">Activo (6-7 días entrenamiento intenso)</option>
              <option value="very_active">Muy Activo (Atleta o trabajo físico pesado)</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={saveProfileUpdate}
            className="flex-1 py-5 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-cyan-600/20 active:scale-95 uppercase text-[10px] tracking-widest"
          >
            Actualizar Datos
          </button>
          <button 
            onClick={handleHardReset}
            className="px-6 py-5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 font-black rounded-2xl transition-all uppercase text-[10px] tracking-widest"
          >
            Sync Maestro
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass p-8 rounded-[2rem] border-cyan-500/20 space-y-4">
          <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-400 w-fit">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </div>
          <h4 className="text-lg font-black text-white">Exportar Historial</h4>
          <button onClick={handleExport} className="w-full py-4 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-black rounded-2xl border border-cyan-500/30 transition-all uppercase text-[10px] tracking-widest">Generar .JSON</button>
        </div>
        <div className="glass p-8 rounded-[2rem] border-emerald-500/20 space-y-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 w-fit">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          </div>
          <h4 className="text-lg font-black text-white">Importar Protocolo</h4>
          <input type="file" accept=".json" onChange={handleImport} className="block w-full text-[10px] text-slate-500 file:py-4 file:px-4 file:rounded-2xl file:border-0 file:font-black file:bg-emerald-500/10 file:text-emerald-400 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
