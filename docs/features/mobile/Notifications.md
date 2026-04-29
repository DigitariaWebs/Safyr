# Notifications (Mobile)

> Route: `(app)/notifications/index`
> Source: `mobile/src/app/(app)/notifications/`, `mobile/src/features/notifications/`

## Overview

Push notification center. Aggregates alerts from all modules: schedule changes, time-off approvals, patrol reminders, SOS acknowledgments, certification expiry warnings.

## Workflows

### 1. View Notifications
1. Agent opens notifications screen
2. Chronological list with level indicators (info, warning, success, destructive)
3. Tap notification → navigate to relevant screen
4. Mark as read, dismiss, or bulk clear

### 2. Notification Sources
- Schedule changes (new assignment, shift modification)
- Time-off approval/rejection
- Patrol reminders
- SOS acknowledgment from manager
- Certification expiry approaching
- New logbook event requiring attention

## Data Types

```ts
// types.ts
NotificationLevel: "info" | "warning" | "success" | "destructive"
AgentNotification: { id, title, body, level, source (schedule|timeoff|patrol|sos|certification|logbook),
                     sourceId, read, timestamp, actionUrl }
```

Context: `NotificationsContext.tsx` provides app-wide notification state.
Storage: `notifications.storage.ts` persists read/dismissed state.

## Related

- [[features/mobile/Time Off|Time Off]] — Approval notifications
- [[features/mobile/Schedule|Schedule]] — Schedule change notifications
- [[features/mobile/Geolocation|Geolocation]] — Patrol and SOS notifications
