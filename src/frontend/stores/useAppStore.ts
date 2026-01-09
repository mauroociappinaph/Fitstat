
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DailyLog } from '@/shared/types';
import { db } from '@/backend/db/dexie';
import { AppState } from '@/frontend/stores/types';
import { INITIAL_AICACHE, DEFAULT_PROFILE, MASTER_DATASET, MASTER_STRENGTH_DATASET, getLocalDateString } from '@/frontend/stores/initialState';

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // --- STATE ---
      session: null,
      user: null,
      profile: DEFAULT_PROFILE,
      dailyLogs: MASTER_DATASET,
      strengthLogs: MASTER_STRENGTH_DATASET,
      chatHistory: [],
      aiCache: INITIAL_AICACHE,
      selectedDate: getLocalDateString(),
      isLoading: false,
      _hasHydrated: false,

      // --- ACTIONS ---
      setSession: (session) => set({ session, user: session?.user ?? null }),
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



        // Async write to IndexedDB
        const finalLog = existingLogIndex >= 0 ? newLogs[existingLogIndex] : newLogs[0];
        db.dailyLogs.put({ ...finalLog, updated_at: new Date().toISOString() }).catch(e => console.error("DB Error:", e));

        return {
          dailyLogs: newLogs.sort((a, b) => b.date.localeCompare(a.date)),
          aiCache: { ...state.aiCache, predictions: null, cardioProjections: [], advancedCardioInsights: null }
        };
      }),

      updateMeals: (date, meals) => {
        const totalProtein = meals.reduce((acc, m) => acc + (m.protein || 0), 0);
        get().addDailyLog({ date, meals, proteinG: totalProtein });
      },

      addStrengthLog: (log) => {
        db.strengthLogs.put({ ...log, updated_at: new Date().toISOString() }).catch(e => console.error("DB Error:", e));
        set((state) => ({
          strengthLogs: [...state.strengthLogs, log],
          aiCache: { ...state.aiCache, predictions: null }
        }))
      },

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

      initializeFromDb: async () => {
        try {
          const logsCount = await db.dailyLogs.count();

          // Migration Strategy: If Dexie is empty but State has data (from LS), migrate it.
          if (logsCount === 0) {
            const currentLogs = get().dailyLogs;
            const currentStrength = get().strengthLogs;

            // Check if we have meaningful data to migrate (simple check: more than just initial dataset or just length > 0)
            if (currentLogs.length > 0) {
               console.log("🛠️ Migrating legacy data from LocalStorage to DexieDB...");
               await db.dailyLogs.bulkPut(currentLogs);
               await db.strengthLogs.bulkPut(currentStrength);

               const user = get().user;
               const profile = get().profile;
               if (user?.id) {
                 await db.userProfile.put({ ...profile, id: user.id });
               }
            }
          }

          // Load from Dexie
          const logs = await db.dailyLogs.toArray();
          const strength = await db.strengthLogs.toArray();

          const update: Partial<AppState> = {};
          if (logs.length > 0) {
            update.dailyLogs = logs.sort((a, b) => b.date.localeCompare(a.date));
          }
          if (strength.length > 0) {
            update.strengthLogs = strength;
          }

          if (Object.keys(update).length > 0) {
             set(update as Partial<AppState>);
          }
        } catch (error) {
          console.error("Failed to initialize from Dexie:", error);
        }
      }
    }),
    {
      name: 'fitstat-elite-storage-v9',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        // Exclude large datasets from LocalStorage to prevent blocking main thread
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { dailyLogs, strengthLogs, ...persisted } = state;
        return persisted as AppState;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        state?.initializeFromDb();
      },
    }
  )
);
