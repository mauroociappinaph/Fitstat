
import { Session, User } from '@supabase/supabase-js';
import { DailyLog, StrengthSet, UserProfile, MealEntry, PredictionData, MetabolicPattern, AIFeedback, AdvancedCardioInsight, SleepCorrelation } from '@/shared/types';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface AICache {
  predictions: PredictionData | null;
  patterns: MetabolicPattern[];
  cardioProjections: { date: string, efficiency: number }[];
  advancedCardioInsights: AdvancedCardioInsight | null;
  nutritionAdvice: AIFeedback | null;
  dailyAudits: Record<string, AIFeedback>;
  sleepAnalysis: SleepCorrelation | null;
}

export interface AppState {
  // State
  session: Session | null;
  user: User | null;
  profile: UserProfile;
  dailyLogs: DailyLog[];
  strengthLogs: StrengthSet[];
  chatHistory: ChatMessage[];
  aiCache: AICache;
  selectedDate: string;
  isLoading: boolean;
  _hasHydrated: boolean;

  // Actions
  setSession: (session: Session | null) => void;
  setHasHydrated: (state: boolean) => void;
  setSelectedDate: (date: string) => void;
  addDailyLog: (logData: Partial<DailyLog> & { date: string }) => void;
  updateMeals: (date: string, meals: MealEntry[]) => void;
  addStrengthLog: (log: StrengthSet) => void;
  setProfile: (profile: UserProfile) => void;
  setLoading: (loading: boolean) => void;
  setAiCache: (update: Partial<AICache>) => void;
  setChatHistory: (history: ChatMessage[]) => void;
  addChatMessage: (msg: ChatMessage) => void;
  importFullState: (state: { profile: UserProfile, dailyLogs: DailyLog[], strengthLogs: StrengthSet[] }) => void;
  resetToInitial: () => void;
  initializeFromDb: () => Promise<void>;
}
