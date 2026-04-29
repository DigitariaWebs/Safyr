# Main Courante (Mobile)

> Routes: `(tabs)/main-courante/index`, `(app)/main-courante/new`
> Source: `mobile/src/app/(app)/(tabs)/main-courante/`, `mobile/src/features/mainCourante/`

## Overview

Digital logbook for field agents. Create and browse events with priority, description, and media attachments (photos, videos). Entries sync to the web dashboard for supervisor validation.

## Workflows

### 1. Browse Events
1. Agent opens Main Courante tab
2. Scrollable list of recent events for current site
3. Filter by priority, type, date
4. Tap event → view details

### 2. Create Event
1. Tap "+" → navigate to new event form
2. Fill: title, description, priority (low/medium/high), type
3. Attach media (camera or gallery via `expo-image-picker`)
4. GPS position auto-captured
5. Submit → event created and synced to web

## Data Types

```
// types.ts
MainCourantePriority: "low" | "medium" | "high"
MainCouranteEvent: { id, title, description, priority, type,
                     siteId, agentId, timestamp,
                     media[] { uri, type (photo|video) },
                     latitude, longitude }
```

Mock data in `mock.ts` provides sample events for development.

## Related

- [[features/web/Logbook|Web Logbook]] — Supervisor-side validation and reporting
- [[features/mobile/Geolocation|Geolocation]] — GPS context for events
