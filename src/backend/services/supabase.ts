import { createClient } from '@supabase/supabase-js'

// Replace with your Supabase project URL and anon key
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface UserProfile {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
  settings: {
    target_weight?: number
    target_body_fat?: number
    activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
    measurement_system?: 'metric' | 'imperial'
  }
}

export interface DailyLog {
  id: string
  user_id: string
  date: string
  weight?: number
  body_fat?: number
  waist?: number
  chest?: number
  arms?: number
  thighs?: number
  sleep_hours?: number
  sleep_quality?: number
  stress_level?: number
  energy_level?: number
  mood?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface MealLog {
  id: string
  user_id: string
  date: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  name: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  sugar?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface StrengthLog {
  id: string
  user_id: string
  date: string
  exercise: string
  sets: number
  reps: number
  weight: number
  rpe?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface CardioLog {
  id: string
  user_id: string
  date: string
  activity_type: string
  duration_minutes: number
  distance_km?: number
  calories_burned?: number
  avg_heart_rate?: number
  max_heart_rate?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface ProtocolPhase {
  id: string
  user_id: string
  name: string
  description?: string
  start_date: string
  end_date?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProtocolRoutine {
  id: string
  phase_id: string
  day_of_week: number
  exercise: string
  sets: number
  reps: number
  intensity: number
  rest_minutes: number
  notes?: string
  created_at: string
  updated_at: string
}

// Database operations
export const db = {
  // User operations
  getUserProfile: (userId: string) => supabase.from('user_profiles').select('*').eq('id', userId).single(),
  updateUserProfile: (userId: string, data: Partial<UserProfile>) =>
    supabase.from('user_profiles').upsert({ ...data, id: userId, updated_at: new Date().toISOString() }),

  // Daily log operations
  getDailyLogs: (userId: string, startDate?: string, endDate?: string) => {
    let query = supabase.from('daily_logs').select('*').eq('user_id', userId)
    if (startDate) query = query.gte('date', startDate)
    if (endDate) query = query.lte('date', endDate)
    return query.order('date', { ascending: false })
  },
  getDailyLog: (userId: string, date: string) =>
    supabase.from('daily_logs').select('*').eq('user_id', userId).eq('date', date).single(),
  createDailyLog: (data: Omit<DailyLog, 'id' | 'created_at' | 'updated_at'>) =>
    supabase.from('daily_logs').insert({ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }),
  updateDailyLog: (userId: string, date: string, data: Partial<DailyLog>) =>
    supabase.from('daily_logs').update({ ...data, updated_at: new Date().toISOString() }).eq('user_id', userId).eq('date', date),

  // Meal log operations
  getMealLogs: (userId: string, date: string) =>
    supabase.from('meal_logs').select('*').eq('user_id', userId).eq('date', date).order('created_at', { ascending: true }),
  createMealLog: (data: Omit<MealLog, 'id' | 'created_at' | 'updated_at'>) =>
    supabase.from('meal_logs').insert({ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }),
  updateMealLog: (id: string, data: Partial<MealLog>) =>
    supabase.from('meal_logs').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id),
  deleteMealLog: (id: string) => supabase.from('meal_logs').delete().eq('id', id),

  // Strength log operations
  getStrengthLogs: (userId: string, date: string) =>
    supabase.from('strength_logs').select('*').eq('user_id', userId).eq('date', date).order('created_at', { ascending: true }),
  createStrengthLog: (data: Omit<StrengthLog, 'id' | 'created_at' | 'updated_at'>) =>
    supabase.from('strength_logs').insert({ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }),
  updateStrengthLog: (id: string, data: Partial<StrengthLog>) =>
    supabase.from('strength_logs').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id),
  deleteStrengthLog: (id: string) => supabase.from('strength_logs').delete().eq('id', id),

  // Cardio log operations
  getCardioLogs: (userId: string, date: string) =>
    supabase.from('cardio_logs').select('*').eq('user_id', userId).eq('date', date).order('created_at', { ascending: true }),
  createCardioLog: (data: Omit<CardioLog, 'id' | 'created_at' | 'updated_at'>) =>
    supabase.from('cardio_logs').insert({ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }),
  updateCardioLog: (id: string, data: Partial<CardioLog>) =>
    supabase.from('cardio_logs').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id),
  deleteCardioLog: (id: string) => supabase.from('cardio_logs').delete().eq('id', id),

  // Protocol operations
  getProtocolPhases: (userId: string) =>
    supabase.from('protocol_phases').select('*').eq('user_id', userId).order('start_date', { ascending: true }),
  getActiveProtocolPhase: (userId: string) =>
    supabase.from('protocol_phases').select('*').eq('user_id', userId).eq('is_active', true).single(),
  createProtocolPhase: (data: Omit<ProtocolPhase, 'id' | 'created_at' | 'updated_at'>) =>
    supabase.from('protocol_phases').insert({ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }),
  updateProtocolPhase: (id: string, data: Partial<ProtocolPhase>) =>
    supabase.from('protocol_phases').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id),
  deleteProtocolPhase: (id: string) => supabase.from('protocol_phases').delete().eq('id', id),

  getProtocolRoutines: (phaseId: string) =>
    supabase.from('protocol_routines').select('*').eq('phase_id', phaseId).order('day_of_week', { ascending: true }),
  createProtocolRoutine: (data: Omit<ProtocolRoutine, 'id' | 'created_at' | 'updated_at'>) =>
    supabase.from('protocol_routines').insert({ ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }),
  updateProtocolRoutine: (id: string, data: Partial<ProtocolRoutine>) =>
    supabase.from('protocol_routines').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id),
  deleteProtocolRoutine: (id: string) => supabase.from('protocol_routines').delete().eq('id', id),
}
