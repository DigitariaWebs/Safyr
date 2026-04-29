# Time Off (Mobile)

> Routes: `(app)/time-off/index`, `(app)/time-off/new`
> Source: `mobile/src/app/(app)/time-off/`, `mobile/src/features/timeoff/`

## Overview

Leave request management for agents. Submit time-off requests and track their status. Approval handled by managers on web [[features/web/HR|HR]] module.

## Workflows

### 1. View Requests
1. Agent opens time-off screen
2. List of requests with status indicators (pending, approved, rejected)
3. Current leave balance displayed

### 2. Submit Request
1. Tap "+" → new request form
2. Select type (vacation, sick leave, unpaid, family event, etc.)
3. Pick dates (start, end)
4. Add reason/notes
5. Submit → status: `pending`
6. Push notification when manager approves/rejects

## Data Types

```
// types.ts
TimeOffStatus: "pending" | "approved" | "rejected"
TimeOffRequest: { id, type, startDate, endDate, totalDays, reason,
                  status, submittedAt, respondedAt, respondedBy }
```

Storage: `timeoff.storage.ts` persists requests locally via `AsyncStorage`.

## Related

- [[features/web/HR|Web HR]] — Time management section handles approval
- [[features/mobile/Notifications|Notifications]] — Status change notifications
