import { supabase, db } from './supabase'
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
    const localProfile = this.getLocalUserProfile(userId)
    if (!localProfile) return

    const { data: remoteProfile } = await db.getUserProfile(userId)

    if (!remoteProfile) {
      // Create new profile
      await db.updateUserProfile(userId, localProfile)
    } else {
      // Update existing profile if local is newer
      const localUpdated = new Date(localProfile.updated_at)
      const remoteUpdated = new Date(remoteProfile.updated_at)

      if (localUpdated > remoteUpdated) {
        await db.updateUserProfile(userId, localProfile)
      } else {
        // Update local with remote data
        this.setLocalUserProfile(userId, remoteProfile)
      }
    }
  }

  private async syncDailyLogs(userId: string): Promise<void> {
    const localLogs = this.getLocalDailyLogs(userId)

    for (const log of localLogs) {
      const { data: remoteLog } = await db.getDailyLog(userId, log.date)

      if (!remoteLog) {
        // Create new log
        await db.createDailyLog(log)
      } else {
        // Update existing log if local is newer
        const localUpdated = new Date(log.updated_at)
        const remoteUpdated = new Date(remoteLog.updated_at)

        if (localUpdated > remoteUpdated) {
          await db.updateDailyLog(userId, log.date, log)
        } else {
          // Update local with remote data
          this.setLocalDailyLog(userId, log.date, remoteLog)
        }
      }
    }
  }

  private async syncMealLogs(userId: string): Promise<void> {
    const localLogs = this.getLocalMealLogs(userId)

    for (const log of localLogs) {
      if (!log.id) {
        // Create new log
        await db.createMealLog(log)
      } else {
        const { data: remoteLog } = await db.getMealLogs(userId, log.date)
        const existingLog = remoteLog?.find(l => l.id === log.id)

        if (!existingLog) {
          await db.createMealLog(log)
        } else {
          const localUpdated = new Date(log.updated_at)
          const remoteUpdated = new Date(existingLog.updated_at)

          if (localUpdated > remoteUpdated) {
            await db.updateMealLog(log.id, log)
          } else {
            this.updateLocalMealLog(userId, log.date, log.id, existingLog)
          }
        }
      }
    }
  }

  private async syncStrengthLogs(userId: string): Promise<void> {
    const localLogs = this.getLocalStrengthLogs(userId)

    for (const log of localLogs) {
      if (!log.id) {
        await db.createStrengthLog(log)
      } else {
        const { data: remoteLog } = await db.getStrengthLogs(userId, log.date)
        const existingLog = remoteLog?.find(l => l.id === log.id)

        if (!existingLog) {
          await db.createStrengthLog(log)
        } else {
          const localUpdated = new Date(log.updated_at)
          const remoteUpdated = new Date(existingLog.updated_at)

          if (localUpdated > remoteUpdated) {
            await db.updateStrengthLog(log.id, log)
          } else {
            this.updateLocalStrengthLog(userId, log.date, log.id, existingLog)
          }
        }
      }
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

  // Local storage helpers
  private getLocalUserProfile(userId: string): UserProfile | null {
    const data = localStorage.getItem(`fitstat_user_profile_${userId}`)
    return data ? JSON.parse(data) : null
  }

  private setLocalUserProfile(userId: string, profile: UserProfile): void {
    localStorage.setItem(`fitstat_user_profile_${userId}`, JSON.stringify(profile))
  }

  private getLocalDailyLogs(userId: string): DailyLog[] {
    const data = localStorage.getItem(`fitstat_daily_logs_${userId}`)
    return data ? JSON.parse(data) : []
  }

  private setLocalDailyLog(userId: string, date: string, log: DailyLog): void {
    const logs = this.getLocalDailyLogs(userId)
    const index = logs.findIndex(l => l.date === date)
    if (index >= 0) {
      logs[index] = log
    } else {
      logs.push(log)
    }
    localStorage.setItem(`fitstat_daily_logs_${userId}`, JSON.stringify(logs))
  }

  private getLocalMealLogs(userId: string): MealLog[] {
    const data = localStorage.getItem(`fitstat_meal_logs_${userId}`)
    return data ? JSON.parse(data) : []
  }

  private updateLocalMealLog(userId: string, date: string, id: string, log: MealLog): void {
    const logs = this.getLocalMealLogs(userId)
    const index = logs.findIndex(l => l.id === id)
    if (index >= 0) {
      logs[index] = log
    }
    localStorage.setItem(`fitstat_meal_logs_${userId}`, JSON.stringify(logs))
  }

  private getLocalStrengthLogs(userId: string): StrengthLog[] {
    const data = localStorage.getItem(`fitstat_strength_logs_${userId}`)
    return data ? JSON.parse(data) : []
  }

  private updateLocalStrengthLog(userId: string, date: string, id: string, log: StrengthLog): void {
    const logs = this.getLocalStrengthLogs(userId)
    const index = logs.findIndex(l => l.id === id)
    if (index >= 0) {
      logs[index] = log
    }
    localStorage.setItem(`fitstat_strength_logs_${userId}`, JSON.stringify(logs))
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
