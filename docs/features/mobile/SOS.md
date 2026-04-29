# SOS (Mobile)

> Routes: `(tabs)/sos`, `(app)/sos`
> Source: `mobile/src/app/(app)/(tabs)/sos.tsx`, `mobile/src/app/(app)/sos.tsx`

## Overview

Emergency alert system. Prominent button in tab bar for immediate SOS dispatch. Captures GPS position and sends alert to web dashboard for manager response.

## Workflows

### 1. Trigger SOS
1. Agent taps SOS button (always visible in tab bar)
2. Confirmation prompt to prevent accidental triggers
3. GPS position captured via `expo-location`
4. Haptic feedback via `expo-haptics`
5. Alert dispatched to web [[features/web/Geolocation|Geolocation]] dashboard
6. Screen shows: "Alerte envoyée" with timestamp and location

### 2. SOS Acknowledgment
1. Manager acknowledges on web dashboard
2. Push notification sent to agent: "Alerte prise en charge"
3. Resolution communicated when situation handled

## Data Types

```
SOSAlert: { id, agentId, latitude, longitude, timestamp,
            status (active|acknowledged|resolved), message }
```

## Related

- [[features/web/Geolocation|Web Geolocation]] — Manager receives and handles SOS
- [[features/mobile/Geolocation|Geolocation]] — GPS position source
- [[features/mobile/Notifications|Notifications]] — Acknowledgment notification
