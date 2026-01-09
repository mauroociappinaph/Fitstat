import { db } from './supabase'
import { useAppStore } from '../../frontend/stores/useAppStore'
import type {
  UserProfile,
  DailyLog,
  MealLog,
  StrengthLog,
  CardioLog,
  ProtocolPhase,
  ProtocolRoutine
} from './supabase'
import { db as dexie } from '../db/dexie'
import { DailyLog as SharedDailyLog, StrengthSet } from '../../shared/types'

export interface SyncStatus {
  isOnline: boolean
  lastSync: string | null
  pendingChanges: number
  syncInProgress: boolean
}

class SyncService {
  private syncStatus: SyncStatus = {
    isOnline: navigator.onLine,
    lastSync: null,
    pendingChanges: 0,
    syncInProgress: false
  }

  private syncInterval: NodeJS.Timeout | null = null
  private retryTimeout: NodeJS.Timeout | null = null

  constructor() {
    this.setupEventListeners()
    this.startPeriodicSync()
  }

  private setupEventListeners() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.syncStatus.isOnline = true
      this.scheduleSync()
    })

    window.addEventListener('offline', () => {
      this.syncStatus.isOnline = false
    })

    // Listen for storage events (changes from other tabs)
    window.addEventListener('storage', (e) => {
      if (e.key === 'fitstat_sync_pending') {
        this.scheduleSync()
      }
    })
  }

  private startPeriodicSync() {
    // Sync every 5 minutes when online
    this.syncInterval = setInterval(() => {
      if (this.syncStatus.isOnline) {
        this.syncData()
      }
    }, 5 * 60 * 1000)
  }

  private scheduleSync() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }

    this.retryTimeout = setTimeout(() => {
      if (this.syncStatus.isOnline) {
        this.syncData()
      }
    }, 2000) // Wait 2 seconds before syncing
  }

  public async syncData(): Promise<void> {
    if (this.syncStatus.syncInProgress || !this.syncStatus.isOnline) {
      return
    }

    this.syncStatus.syncInProgress = true

    try {
      const { user } = useAppStore.getState()
      const userId = user?.id
      if (!userId) {
        return
      }

      // Sync user profile
      await this.syncUserProfile(userId)

      // Sync daily logs
      await this.syncDailyLogs(userId)

      // Sync meal logs
      await this.syncMealLogs(userId)

      // Sync strength logs
      await this.syncStrengthLogs(userId)

      // Sync cardio logs
      await this.syncCardioLogs(userId)

      // Sync protocol data
      await this.syncProtocolData(userId)

      this.syncStatus.lastSync = new Date().toISOString()
      this.syncStatus.pendingChanges = 0

      // Clear local pending changes flag
      localStorage.removeItem('fitstat_sync_pending')

    } catch (error) {
      console.error('Sync failed:', error)
      this.scheduleRetry()
    } finally {
      this.syncStatus.syncInProgress = false
    }
  }

  private async syncUserProfile(userId: string): Promise<void> {
    const localProfile = await this.getLocalUserProfile(userId)
    if (!localProfile) return

    const { data: remoteProfile } = await db.getUserProfile(userId)

    if (!remoteProfile) {
      if (localProfile.id) { // Ensure ID exists
          await db.updateUserProfile(userId, localProfile)
      }
    } else {
      const localUpdated = localProfile.updated_at ? new Date(localProfile.updated_at) : new Date(0)
      const remoteUpdated = new Date(remoteProfile.updated_at)

      if (localUpdated > remoteUpdated) {
        await db.updateUserProfile(userId, localProfile)
      } else {
        await this.setLocalUserProfile(userId, remoteProfile)
      }
    }
  }

  private async syncDailyLogs(userId: string): Promise<void> {
    const lastSync = this.syncStatus.lastSync || new Date(0).toISOString()

    // 1. Get Local Deltas
    const allLocal = await this.getLocalDailyLogs(userId)
    const deltaLocal = allLocal.filter(l => (l as any).updated_at && (l as any).updated_at > lastSync)

    // 2. Get Remote Deltas
    const { data: deltaRemote } = await db.getDailyLogsSince(userId, lastSync)

    // 3. Conflict Resolution & Push
    const toPush = deltaLocal.filter(l => {
      const remoteConflict = deltaRemote?.find(r => r.date === l.date)
      if (remoteConflict && remoteConflict.updated_at > ((l as any).updated_at || '')) {
         return false
      }
      return true
    })

    if (toPush.length > 0) {
      const batch = toPush.map(l => ({
         user_id: userId,
         date: l.date,
         weight: l.weight,
         sleep_hours: l.sleepHours,
         updated_at: (l as any).updated_at,
         // Map other fields as needed, using casting for now
         ...l as any
      }))
      await db.upsertDailyLogs(batch)
    }

    // 4. Pull & Merge
    if (deltaRemote && deltaRemote.length > 0) {
       const dates = deltaRemote.map(r => r.date)
       const existing = await dexie.dailyLogs.bulkGet(dates)

       const merged = deltaRemote.map((r, i) => {
         // Merge remote fields into existing local object (preserving meals if not present in remote)
         const local = existing[i] || {}
         return { ...local, ...r }
       })

       await dexie.dailyLogs.bulkPut(merged)
    }
  }

  private async syncMealLogs(userId: string): Promise<void> {
    const lastSync = this.syncStatus.lastSync || new Date(0).toISOString()

    // 1. Get Local Deltas (meals from modified daily logs)
    // We infer meal changes from daily log changes
    const allLocalDaily = await dexie.dailyLogs.toArray()
    const modifiedDaily = allLocalDaily.filter(l => (l as any).updated_at && (l as any).updated_at > lastSync)

    const deltaLocalMeals: Omit<MealLog, 'id' | 'created_at' | 'updated_at'>[] = []

    modifiedDaily.forEach(log => {
      if (log.meals) {
        log.meals.forEach(m => {
          deltaLocalMeals.push({
             user_id: userId,
             date: log.date,
             meal_type: m.type === 'Desayuno' ? 'breakfast' :
                        m.type === 'Almuerzo' ? 'lunch' :
                        m.type === 'Cena' ? 'dinner' : 'snack',
             name: 'Comida',
             calories: m.calories,
             protein: m.protein,
             carbs: m.carbs,
             fat: m.fats,
             // Shared types might not have matching props
             ...m
          })
        })
      }
    })

    // 2. Get Remote Deltas
    const { data: deltaRemote } = await db.getMealLogsSince(userId, lastSync)

    // 3. Push Local
    // Simple push of all "modified" meals. Upsert handles updates.
    if (deltaLocalMeals.length > 0) {
      await db.upsertMealLogs(deltaLocalMeals)
    }

    // 4. Pull & Merge Remote
    if (deltaRemote && deltaRemote.length > 0) {
       // Group by date to minimize DB reads
       const mealsByDate = deltaRemote.reduce((acc, m) => {
         acc[m.date] = acc[m.date] || []
         acc[m.date].push(m)
         return acc
       }, {} as Record<string, MealLog[]>)

       const dates = Object.keys(mealsByDate)
       const existingLogs = await dexie.dailyLogs.bulkGet(dates)

       const toUpdate: any[] = []

       dates.forEach((date, i) => {
         const log = existingLogs[i]
         if (log) {
           const remoteMealsForDate = mealsByDate[date]
           // Merge logic: Update existing meals by ID, add new ones
           const currentMeals = log.meals || []

           remoteMealsForDate.forEach(rm => {
             const existingIdx = currentMeals.findIndex(cm => cm.id === rm.id)
             const mappedMeal = {
                id: rm.id,
                type: rm.meal_type === 'breakfast' ? 'Desayuno' :
                      rm.meal_type === 'lunch' ? 'Almuerzo' :
                      rm.meal_type === 'dinner' ? 'Cena' : 'Merienda',
                protein: rm.protein || 0,
                carbs: rm.carbs || 0,
                fats: rm.fat || 0,
                calories: rm.calories || 0,
                timestamp: rm.updated_at
             } as any // Simplified casting

             if (existingIdx >= 0) {
               currentMeals[existingIdx] = { ...currentMeals[existingIdx], ...mappedMeal }
             } else {
               currentMeals.push(mappedMeal)
             }
           })

           toUpdate.push({ ...log, meals: currentMeals, updated_at: new Date().toISOString() })
         }
       })

       if (toUpdate.length > 0) {
         await dexie.dailyLogs.bulkPut(toUpdate)
       }
    }
  }

  private async syncStrengthLogs(userId: string): Promise<void> {
    const lastSync = this.syncStatus.lastSync || new Date(0).toISOString()

    // 1. Get Local Deltas
    const allLocal = await this.getLocalStrengthLogs(userId)
    const deltaLocal = allLocal.filter(l => (l as any).updated_at && (l as any).updated_at > lastSync)

    // 2. Get Remote Deltas
    const { data: deltaRemote } = await db.getStrengthLogsSince(userId, lastSync)

    // 3. Push Local
    if (deltaLocal.length > 0) {
      const batch = deltaLocal.map(l => ({
           user_id: userId,
           date: l.date,
           exercise: l.exercise,
           sets: l.sets,
           reps: l.reps,

           weight: (l as any).weight || 0,
           ...l as any
      }))
      await db.upsertStrengthLogs(batch)
    }

    // 4. Pull Remote
    if (deltaRemote && deltaRemote.length > 0) {
       // Simple overwrite for now (Last Write Wins from Remote)
       // Map to local
       const mapped = deltaRemote.map(r => ({
          ...r,
          // Map back fields if needed
       } as any))

       await dexie.strengthLogs.bulkPut(mapped)
    }
  }

  private async syncCardioLogs(userId: string): Promise<void> {
    const localLogs = this.getLocalCardioLogs(userId)

    for (const log of localLogs) {
      if (!log.id) {
        await db.createCardioLog(log)
      } else {
        const { data: remoteLog } = await db.getCardioLogs(userId, log.date)
        const existingLog = remoteLog?.find(l => l.id === log.id)

        if (!existingLog) {
          await db.createCardioLog(log)
        } else {
          const localUpdated = new Date(log.updated_at)
          const remoteUpdated = new Date(existingLog.updated_at)

          if (localUpdated > remoteUpdated) {
            await db.updateCardioLog(log.id, log)
          } else {
            this.updateLocalCardioLog(userId, log.date, log.id, existingLog)
          }
        }
      }
    }
  }

  private async syncProtocolData(userId: string): Promise<void> {
    // Sync protocol phases
    const localPhases = this.getLocalProtocolPhases(userId)

    for (const phase of localPhases) {
      if (!phase.id) {
        await db.createProtocolPhase(phase)
      } else {
        const { data: remotePhase } = await db.getProtocolPhases(userId)
        const existingPhase = remotePhase?.find(p => p.id === phase.id)

        if (!existingPhase) {
          await db.createProtocolPhase(phase)
        } else {
          const localUpdated = new Date(phase.updated_at)
          const remoteUpdated = new Date(existingPhase.updated_at)

          if (localUpdated > remoteUpdated) {
            await db.updateProtocolPhase(phase.id, phase)
          } else {
            this.updateLocalProtocolPhase(userId, phase.id, existingPhase)
          }
        }
      }
    }

    // Sync protocol routines
    const localRoutines = this.getLocalProtocolRoutines(userId)

    for (const routine of localRoutines) {
      if (!routine.id) {
        await db.createProtocolRoutine(routine)
      } else {
        const { data: remoteRoutine } = await db.getProtocolRoutines(routine.phase_id)
        const existingRoutine = remoteRoutine?.find(r => r.id === routine.id)

        if (!existingRoutine) {
          await db.createProtocolRoutine(routine)
        } else {
          const localUpdated = new Date(routine.updated_at)
          const remoteUpdated = new Date(existingRoutine.updated_at)

          if (localUpdated > remoteUpdated) {
            await db.updateProtocolRoutine(routine.id, routine)
          } else {
            this.updateLocalProtocolRoutine(routine.phase_id, routine.id, existingRoutine)
          }
        }
      }
    }
  }

  private scheduleRetry() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }

    this.retryTimeout = setTimeout(() => {
      if (!this.syncStatus.isOnline) {
        this.scheduleRetry()
      } else {
        this.syncData()
      }
    }, 10000) // Retry after 10 seconds
  }

  // Local storage helpers replacement
  private async getLocalUserProfile(userId: string): Promise<UserProfile | null> {
    const profile = await dexie.userProfile.get(userId)
    return profile as unknown as UserProfile | null
  }

  private async setLocalUserProfile(userId: string, profile: UserProfile): Promise<void> {
    await dexie.userProfile.put({ ...profile as any, id: userId })
  }

  private async getLocalDailyLogs(userId: string): Promise<SharedDailyLog[]> {
    return await dexie.dailyLogs.toArray()
  }

  private async setLocalDailyLog(userId: string, date: string, log: any): Promise<void> {
      // Logic to convert Supabase log back to Shared log?
      // For now, just update specific fields
      const existing = await dexie.dailyLogs.get(date);
      if (existing) {
          await dexie.dailyLogs.put({ ...existing, ...log });
      } else {
          await dexie.dailyLogs.put({ date, ...log });
      }
  }

  private async getLocalMealLogs(userId: string): Promise<MealLog[]> {
    const dailyLogs = await dexie.dailyLogs.toArray();
    const meals: MealLog[] = [];

    dailyLogs.forEach(log => {
      if (log.meals) {
        log.meals.forEach(m => {
           meals.push({
             id: m.id,
             user_id: userId,
             date: log.date,
             meal_type: m.type === 'Desayuno' ? 'breakfast' :
                        m.type === 'Almuerzo' ? 'lunch' :
                        m.type === 'Cena' ? 'dinner' : 'snack',
             name: 'Comida',
             calories: m.calories,
             protein: m.protein,
             carbs: m.carbs,
             fat: m.fats,
             created_at: m.timestamp || new Date().toISOString(),
             updated_at: m.timestamp || new Date().toISOString()
           })
        });
      }
    });
    return meals;
  }

  private async setLocalMealLog(userId: string, date: string, remoteMeal: MealLog): Promise<void> {
      // Find daily log and update the specific meal
      const log = await dexie.dailyLogs.get(date);
      if (log && log.meals) {
          const index = log.meals.findIndex(m => m.id === remoteMeal.id);
          if (index >= 0) {
              // Update meal
              // We need to map back from MealLog to MealEntry
              // This is complex. For now, let's just log it.
              console.warn("Syncing meal back to local is pending implementation of reverse mapping.");
          }
      }
  }

  private async getLocalStrengthLogs(userId: string): Promise<StrengthSet[]> {
    return await dexie.strengthLogs.toArray()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async updateLocalStrengthLog(_userId: string, _date: string, _id: string, _log: StrengthLog): Promise<void> {
      // Update local strength log from remote
      // Pending implementation
  }

  private getLocalCardioLogs(userId: string): CardioLog[] {
    const data = localStorage.getItem(`fitstat_cardio_logs_${userId}`)
    return data ? JSON.parse(data) : []
  }

  private updateLocalCardioLog(userId: string, date: string, id: string, log: CardioLog): void {
    const logs = this.getLocalCardioLogs(userId)
    const index = logs.findIndex(l => l.id === id)
    if (index >= 0) {
      logs[index] = log
    }
    localStorage.setItem(`fitstat_cardio_logs_${userId}`, JSON.stringify(logs))
  }

  private getLocalProtocolPhases(userId: string): ProtocolPhase[] {
    const data = localStorage.getItem(`fitstat_protocol_phases_${userId}`)
    return data ? JSON.parse(data) : []
  }

  private updateLocalProtocolPhase(userId: string, id: string, phase: ProtocolPhase): void {
    const phases = this.getLocalProtocolPhases(userId)
    const index = phases.findIndex(p => p.id === id)
    if (index >= 0) {
      phases[index] = phase
    }
    localStorage.setItem(`fitstat_protocol_phases_${userId}`, JSON.stringify(phases))
  }

  private getLocalProtocolRoutines(userId: string): ProtocolRoutine[] {
    const data = localStorage.getItem(`fitstat_protocol_routines_${userId}`)
    return data ? JSON.parse(data) : []
  }

  private updateLocalProtocolRoutine(phaseId: string, id: string, routine: ProtocolRoutine): void {
    const routines = this.getLocalProtocolRoutines(phaseId)
    const index = routines.findIndex(r => r.id === id)
    if (index >= 0) {
      routines[index] = routine
    }
    localStorage.setItem(`fitstat_protocol_routines_${phaseId}`, JSON.stringify(routines))
  }

  // Public methods
  public markPendingChanges(): void {
    this.syncStatus.pendingChanges++
    localStorage.setItem('fitstat_sync_pending', 'true')
    this.scheduleSync()
  }

  public getSyncStatus(): SyncStatus {
    return { ...this.syncStatus }
  }

  public async forceSync(): Promise<void> {
    await this.syncData()
  }

  public cleanup(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout)
    }
  }
}

// Export singleton instance
export const syncService = new SyncService()

// Export for use in components
export default syncService
