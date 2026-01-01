
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DailyLog } from '../types';
import { AppState } from './types';
import { INITIAL_AICACHE, DEFAULT_PROFILE, MASTER_DATASET, MASTER_STRENGTH_DATASET, getLocalDateString } from './initialState';

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      dailyLogs: MASTER_DATASET,
      strengthLogs: MASTER_STRENGTH_DATASET,
      chatHistory: [],
      aiCache: INITIAL_AICACHE,
      selectedDate: getLocalDateString(),
      isLoading: false,
      _hasHydrated: false,

      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      
      addDailyLog: (logData) => set((state) => {
        const existingLogIndex = state.dailyLogs.findIndex(l => l.date === logData.date);
        let newLogs = [...state.dailyLogs];
        
        if (existingLogIndex >= 0) {
          newLogs[existingLogIndex] = { ...newLogs[existingLogIndex], ...logData };
        } else {
          const fullLog: DailyLog = {
            date: logData.date,
            weight: state.dailyLogs[0]?.weight || state.profile.initialWeight,
            waterMl: 0, steps: 0, sleepHours: 8, trainingDone: false, trainingType: '', 
            trainingCalories: 0, trainingAvgHR: 0, walkActivity: false, walkDistanceKm: 0, 
            walkDurationMin: 0, walkAvgHR: 0, walkMaxHR: 0, walkCalories: 0, proteinG: 0, 
            ...logData
          } as DailyLog;
          newLogs = [fullLog, ...state.dailyLogs];
        }

        return { 
          dailyLogs: newLogs.sort((a, b) => b.date.localeCompare(a.date)),
          aiCache: { ...state.aiCache, predictions: null, nutritionAdvice: null, dailyAudits: {} }
        };
      }),

      updateMeals: (date, meals) => {
        const totalProtein = meals.reduce((acc, m) => acc + (m.protein || 0), 0);
        get().addDailyLog({ date, meals, proteinG: totalProtein });
      },

      addStrengthLog: (log) => set((state) => ({ 
        strengthLogs: [...state.strengthLogs, log],
        aiCache: { ...state.aiCache, predictions: null }
      })),

      setProfile: (profile) => set({ profile, aiCache: INITIAL_AICACHE }),
      setLoading: (loading) => set({ isLoading: loading }),
      setAiCache: (update) => set((state) => ({ aiCache: { ...state.aiCache, ...update } })),
      setChatHistory: (chatHistory) => set({ chatHistory }),
      addChatMessage: (msg) => set((state) => ({ chatHistory: [...state.chatHistory, msg] })),
      importFullState: (newState) => set({ 
        profile: newState.profile, 
        dailyLogs: newState.dailyLogs, 
        strengthLogs: newState.strengthLogs,
        aiCache: INITIAL_AICACHE
      }),
      resetToInitial: () => set({
        profile: DEFAULT_PROFILE,
        dailyLogs: MASTER_DATASET,
        strengthLogs: MASTER_STRENGTH_DATASET,
        aiCache: INITIAL_AICACHE,
        chatHistory: [],
        selectedDate: getLocalDateString()
      }),
    }),
    {
      name: 'fitstat-enterprise-storage-v11', // Incrementado para forzar sync
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => { state?.setHasHydrated(true); },
    }
  )
);
