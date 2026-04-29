# Schedule (Mobile)

> Route: `(app)/schedule/index`
> Source: `mobile/src/app/(app)/schedule/`, `mobile/src/features/schedule/`

## Overview

Agent work schedule view. Shows upcoming shifts with site, times, and poste details. Read-only — schedule managed from web [[features/web/Planning|Planning]] module.

## Workflows

### 1. View Schedule
1. Agent opens schedule screen
2. See current week's shifts in chronological order
3. Each shift shows: date, site name, start/end time, poste
4. Tap shift → expanded details (address, instructions, contact)

### 2. Upcoming Shifts
1. Scroll forward to see future assigned shifts
2. Visual indicators for confirmed vs. pending shifts

## Data Types

```
// types.ts
Shift: { id, date, siteName, siteAddress, startTime, endTime,
         posteName, status, instructions }
```

Mock data in `mock.ts`, utilities in `utils.ts`.

## Related

- [[features/web/Planning|Web Planning]] — Source of schedule data
- [[features/mobile/Home|Home]] — Shows today's shift on dashboard
