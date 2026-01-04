import React, { useState, useEffect } from 'react'
import { syncService, SyncStatus } from '../../backend/services/syncService'
import { GlassCard, StatusBadge } from './common'

export const PersistenceStatus: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(syncService.getSyncStatus())

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(syncService.getSyncStatus())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleForceSync = async () => {
    try {
      await syncService.forceSync()
      setSyncStatus(syncService.getSyncStatus())
    } catch (error) {
      console.error('Manual sync failed:', error)
    }
  }

  const getStatusType = (): 'success' | 'warning' | 'danger' => {
    if (!syncStatus.isOnline) return 'danger'
    if (syncStatus.pendingChanges > 0) return 'warning'
    return 'success'
  }

  const getStatusText = () => {
    if (!syncStatus.isOnline) return 'Offline'
    if (syncStatus.pendingChanges > 0) return `Syncing (${syncStatus.pendingChanges} pending)`
    return 'Synced'
  }

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <StatusBadge type={getStatusType()} label={getStatusText()} />

          {syncStatus.lastSync && (
            <span className="text-sm text-gray-400">
              Last sync: {new Date(syncStatus.lastSync).toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleForceSync}
            disabled={!syncStatus.isOnline || syncStatus.syncInProgress}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncStatus.syncInProgress ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </div>

      {syncStatus.pendingChanges > 0 && (
        <div className="mt-2 text-sm text-yellow-400">
          Data will sync automatically when online
        </div>
      )}
    </GlassCard>
  )
}
