# Dashboard

> Route: `/dashboard`
> Source: `web/src/app/dashboard/page.tsx`

## Overview

Main entry point after login. Configurable dashboard home with KPI cards, activity feed, and quick-access links to all modules. Uses `dashboardConfigStore` for user-customizable widget layout.

## Pages

| Page | Route | Purpose |
|------|-------|---------|
| Dashboard Home | `/dashboard` | KPI overview, widgets, activity feed |

## Workflows

### 1. Dashboard Configuration
1. User opens dashboard settings
2. Enables/disables widgets (stats cards, charts, recent activity)
3. Reorders layout via drag-and-drop (`dnd-kit`)
4. Configuration persisted to `dashboardConfigStore` (localStorage)

### 2. Quick Navigation
1. User sees module summary cards (HR, Payroll, Planning, etc.)
2. Clicks a module → navigated to that module's hub page
3. Command palette (`cmdk`) available for fast search across all modules

## Data Types

### Zustand Stores
- `dashboardConfigStore` — Widget visibility, ordering, user preferences
- `uiStore` — Sidebar collapsed state, active navigation

### Calendar Types
```typescript
CalendarScope: "global" | "personal"
CalendarViewMode: "month" | "week" | "day"
CalendarSettings: { defaultView, defaultScope, showWeekends, startHour, endHour }
Appointment: { id, title, date, startTime, endTime, type, color, scope }
```

## Related

- [[HR]] — Employee & compliance overview
- [[features/web/Payroll|Payroll]] — Current period status
- [[Planning]] — Today's assignments
- [[features/web/Geolocation|Geolocation]] — Live agent positions
