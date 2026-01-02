# FitStat Persistence Layer Implementation

This document describes the implementation of the real persistence layer for FitStat using Supabase, enabling cross-device data synchronization.

## Overview

The persistence layer consists of several components:

1. **Supabase Database Configuration** (`src/backend/services/supabase.ts`)
2. **Database Schema** (`database/schema.sql`)
3. **Data Synchronization Service** (`src/backend/services/syncService.ts`)

## Features

- **Real-time Data Sync**: Automatic synchronization between local storage and remote database
- **Offline Support**: Works seamlessly when offline, syncing when connection is restored
- **Conflict Resolution**: Smart merging of local and remote changes
- **Cross-device Compatibility**: Data persists across different devices and browsers
- **Periodic Sync**: Automatic sync every 5 minutes when online
- **Event-driven Sync**: Immediate sync on data changes

## Database Schema

The database includes the following tables:

### Core Tables
- `user_profiles` - User information and settings
- `daily_logs` - Daily biometric and activity data
- `meal_logs` - Nutrition tracking data
- `strength_logs` - Strength training records
- `cardio_logs` - Cardiovascular exercise data

### Protocol Tables
- `protocol_phases` - Training phase definitions
- `protocol_routines` - Exercise routines for each phase

### Key Features
- UUID primary keys for security
- Proper foreign key relationships
- Data validation constraints
- Performance indexes
- Automatic timestamp updates

## Implementation Details

### Supabase Configuration

The `supabase.ts` file provides:
- Database client initialization
- Type-safe database operations
- Comprehensive CRUD operations for all entities
- Proper error handling

### Synchronization Strategy

The `syncService.ts` implements:
- **Background Sync**: Automatic periodic synchronization
- **Event-driven Sync**: Immediate sync on data changes
- **Conflict Resolution**: Last-write-wins with timestamp comparison
- **Offline Queueing**: Pending changes stored locally when offline
- **Retry Logic**: Automatic retry with exponential backoff

### Data Flow

1. **Local Changes**: When data is modified locally, it's stored in localStorage
2. **Sync Trigger**: Changes trigger immediate sync or are queued for periodic sync
3. **Conflict Detection**: Service compares local and remote timestamps
4. **Data Merging**: Latest changes win, with bidirectional sync
5. **Status Updates**: Sync status tracked and reported

## Usage

### Environment Setup

1. Create a Supabase project
2. Set environment variables:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Run the database schema:
   ```sql
   -- Execute database/schema.sql in Supabase SQL editor
   ```

### Integration

The sync service automatically integrates with the existing Zustand store:

```typescript
import { syncService } from './backend/services/syncService'

// Mark data as changed
syncService.markPendingChanges()

// Check sync status
const status = syncService.getSyncStatus()

// Force sync
await syncService.forceSync()
```

### Component Integration

Components can access sync status:

```typescript
import { syncService } from './backend/services/syncService'

function MyComponent() {
  const [syncStatus, setSyncStatus] = useState(syncService.getSyncStatus())

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(syncService.getSyncStatus())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      {syncStatus.isOnline ? 'Online' : 'Offline'}
      {syncStatus.pendingChanges > 0 && ` (${syncStatus.pendingChanges} pending)`}
    </div>
  )
}
```

## Security Considerations

- **UUID Keys**: Uses UUIDs instead of auto-incrementing IDs
- **Row Level Security**: Can be enabled in Supabase for multi-user support
- **Environment Variables**: Sensitive keys stored in environment variables
- **Data Validation**: Input validation at database level

## Performance Optimizations

- **Indexed Queries**: Proper indexes on frequently queried columns
- **Batch Operations**: Efficient bulk operations where possible
- **Lazy Loading**: Data loaded on-demand
- **Caching**: Local caching reduces database calls

## Future Enhancements

- **Multi-user Support**: Add authentication and user isolation
- **Real-time Subscriptions**: Live updates across devices
- **Data Compression**: Compress large datasets
- **Backup Strategy**: Automated database backups
- **Analytics**: Usage and performance monitoring

## Troubleshooting

### Common Issues

1. **Sync Not Working**: Check internet connection and Supabase credentials
2. **Data Conflicts**: Service handles conflicts automatically, but manual review may be needed
3. **Performance**: Monitor database query performance and add indexes as needed

### Debugging

Enable debug logging:
```typescript
// Add to syncService.ts
console.log('Sync status:', syncStatus)
console.log('Last sync:', syncStatus.lastSync)
```

## Testing

The persistence layer includes:
- **Unit Tests**: Individual component testing
- **Integration Tests**: End-to-end sync testing
- **Offline Testing**: Simulate offline scenarios
- **Conflict Testing**: Test data conflict resolution

## Migration Strategy

For existing users:
1. Export current localStorage data
2. Import into Supabase database
3. Enable sync service
4. Verify data integrity

## Dependencies

- `@supabase/supabase-js` - Supabase client library
- `@supabase/auth-ui-react` - Authentication UI components
- `zustand` - State management (existing)
- `localStorage` - Local caching (existing)
