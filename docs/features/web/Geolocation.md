# Geolocation

> Routes: `/dashboard/geolocation/**`
> Source: `web/src/app/dashboard/geolocation/`

## Overview

Real-time agent tracking on a Mapbox map. Monitors agent presence in work zones, manages patrol rounds with GPS/QR/NFC checkpoints, and provides KPI analytics. Includes SOS alerts and immobility detection.

## Pages

| Route | Purpose |
|-------|---------|
| `/geolocation` | Geolocation hub |
| `/geolocation/live` | Live tracking map (Mapbox GL via `react-map-gl`) |
| `/geolocation/presence` | Zone presence monitoring |
| `/geolocation/rounds` | Patrol round management with route creation |
| `/geolocation/zones` | Work zone configuration |
| `/geolocation/reports` | Reports & KPI analytics dashboard |

## Workflows

### 1. Live Agent Tracking
1. Agents share location from mobile app → positions updated in real-time
2. Map displays all agents with status indicators (en service, hors zone, SOS, immobile)
3. Click agent → see details: name, site, speed, direction, battery level
4. Filter by site, zone, or status

### 2. Zone Presence Monitoring
1. Define work zones as geographic polygons on the map
2. System monitors agent positions against zone boundaries
3. Detect zone entry/exit events
4. Alert when agent leaves assigned zone (hors zone)
5. Track presence duration per zone

### 3. Patrol Round Management
1. Create patrol route on map: define ordered checkpoints (GPS waypoints or QR codes)
2. Set patrol frequency: quotidienne, bi-quotidienne, nocturne, hebdomadaire
3. Agent starts patrol on mobile → scans checkpoints in order
4. System tracks: checkpoint scanned, timestamp, GPS position at scan
5. Patrol completed when all checkpoints validated
6. Report: on-time, late, missed checkpoints

### 4. SOS & Immobility Alerts
1. Agent triggers SOS from mobile app → alert dispatched to dashboard
2. Dashboard shows SOS location, agent info, timestamp
3. Manager acknowledges → coordinates response
4. Immobility detection: system flags agents stationary beyond threshold
5. Discrete mode available for undercover operations

### 5. KPI Analytics
1. Dashboard with charts: zone coverage, patrol completion rates, response times
2. Agent performance metrics: hours on site, patrol adherence, zone compliance
3. Historical trends and period comparisons
4. Export reports

## Data Types

Types defined in mock data files (`web/src/data/geolocation-*.ts`):

### Agent Tracking
```
GeolocationAgent: { id, name, site, zone, status (en_service|hors_zone|sos|immobile|hors_ligne),
                    lastUpdate, latitude, longitude, speed, direction, battery }
```

### Zones & Presence
```
GeolocationZone: { id, name, siteId, coordinates (polygon), color, radius,
                   agentCount, status (active|inactive) }
PresenceRecord: { id, agentId, zoneId, entryTime, exitTime, duration,
                  status (in_zone|out_of_zone) }
```

### Patrols
```
PatrolRoute: { id, name, siteId, checkpoints[], frequency, status, estimatedDuration }
PatrolCheckpoint: { id, routeId, name, type (gps|qr|nfc), latitude, longitude,
                    order, radius, qrCode }
PatrolExecution: { id, routeId, agentId, startedAt, completedAt, status (en-cours|terminee|incomplete),
                   checkpointScans[] }
CheckpointScan: { checkpointId, scannedAt, latitude, longitude, validated }
```

### SOS & Alerts
```
SOSAlert: { id, agentId, agentName, latitude, longitude, timestamp,
            status (active|acknowledged|resolved), acknowledgedBy, resolvedAt }
```

### KPIs
```
GeolocationKPI: { zoneCompliance (%), patrolCompletionRate (%), averageResponseTime,
                  activeAgents, alertsTriggered, hoursTracked }
```

## Related

- [[Planning]] — Assignments determine which agents should be at which sites
- [[HR]] — Employee geolocation tab in profile shows presence and patrol data
- [[Logbook]] — Geolocation events can trigger logbook entries
- [[features/mobile/Geolocation|Mobile Geolocation]] — Agent-side tracking and patrol execution
