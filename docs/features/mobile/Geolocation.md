# Geolocation (Mobile)

> Routes: `(tabs)/geolocation/index`
> Source: `mobile/src/app/(app)/(tabs)/geolocation/`, `mobile/src/features/geolocation/`

## Overview

Agent-side geolocation with live tracking, work zone monitoring, and connected patrol system with QR checkpoint scanning. Uses `expo-location` for GPS, `@rnmapbox/maps` for map display.

## Workflows

### 1. Location Sharing
1. Agent starts shift → location sharing activated
2. `useAgentLocation` hook streams GPS position to server
3. Position updated on web dashboard in real-time
4. Battery level and speed tracked

### 2. Work Zone Monitoring
1. `useWorkZoneMonitor` / `useMultiZoneMonitor` hooks track agent position
2. Zone entry/exit detected based on polygon boundaries
3. Alert triggered if agent exits assigned zone
4. Discrete mode available (silent tracking for undercover)

### 3. Patrol Session
1. Agent selects patrol route → sees checkpoint list and map preview
2. Phase flow: `idle` → `selecting` → `previewing` → `active` → `summary`
3. `usePatrolSession` hook manages active patrol state
4. Navigate to each checkpoint → scan QR code or validate GPS proximity
5. Each scan recorded: `CheckpointScan { checkpointId, scannedAt, latitude, longitude, validated }`
6. Patrol complete → summary displayed with completion status

### 4. SOS Alert
1. Agent triggers SOS button (prominent in tab bar)
2. Current GPS position captured
3. Alert dispatched to web dashboard
4. Agent's location highlighted on manager's live map

## Data Types

```
// Patrol types (patrol.types.ts)
CheckpointType: "GPS" | "QR" | "NFC"
PatrolFrequency: "Quotidienne" | "Bi-quotidienne" | "Nocturne" | "Hebdomadaire"
PatrolStatus: "en-cours" | "terminee" | "incomplete" | "planifiee"
PatrolCheckpoint: { id, name, type, latitude, longitude, order, radius, qrCode }
PatrolRoute: { id, name, siteId, checkpoints[], frequency, estimatedDuration }
CheckpointScan: { checkpointId, scannedAt, latitude, longitude, validated }
PatrolExecution: { id, routeId, agentId, startedAt, completedAt, status, scans[] }
ScheduledPatrol: { id, routeId, scheduledTime, reminder }
PatrolPhase: "idle" | "selecting" | "previewing" | "active" | "summary"
```

### Hooks
| Hook | Purpose |
|------|---------|
| `useAgentLocation` | Streams agent GPS position |
| `usePatrolSession` | Manages active patrol state machine |
| `useWorkZoneMonitor` | Monitors single zone boundary |
| `useMultiZoneMonitor` | Monitors multiple zones simultaneously |

## Related

- [[features/web/Geolocation|Web Geolocation]] — Manager's live tracking dashboard
- [[features/mobile/Main Courante|Main Courante]] — Events can include geolocation data
- [[features/mobile/SOS|SOS]] — Emergency alert with GPS
