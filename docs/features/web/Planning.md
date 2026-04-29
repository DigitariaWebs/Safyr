# Planning

> Routes: `/dashboard/planning/**`
> Source: `web/src/app/dashboard/planning/`

## Overview

Schedule management for security agents across client sites. Defines sites, postes (positions), shifts, and agent assignments. Supports auto-scheduling, conflict detection, and template-based recurring schedules.

## Pages

| Route | Purpose |
|-------|---------|
| `/planning` | Planning hub — weekly overview |
| `/planning/schedule` | Schedule grid (daily/weekly/monthly views, group by agent/site/poste) |
| `/planning/agents` | Agent assignment and availability |
| `/planning/postes` | Position management per site |
| `/planning/sites` | Client site configuration |
| `/planning/shifts` | Shift template definitions |
| `/planning/settings` | Planning settings (persisted in `planningSettingsStore`) |

## Workflows

### 1. Site & Poste Setup
1. Create `Site` with client link, address, billing rates, constraints, required certifications
2. Define `Poste` for each position at the site (agent_securite, ssiap1-3, operateur_video, accueil, etc.)
3. Set capacity (min/max agents), daily requirements per day of week
4. Configure shift templates with start/end times, break duration, colors

### 2. Schedule Creation
1. Open schedule grid → select view (daily/weekly/monthly) and grouping (agent/site/poste)
2. Create `Assignment`: select agent → site → poste → date → shift times
3. System checks for conflicts:
   - `double_booking` — agent already assigned elsewhere
   - `missing_qualification` — agent lacks required certification
   - `hours_exceeded` — weekly hour limit breached
   - `unavailable` — agent on leave or inactive
4. Resolve conflicts or override with notes
5. Agent confirms assignment → status: `confirmed`

### 3. Auto-Scheduling
1. Define parameters: date range, sites, prioritize qualifications vs. cost, allow overtime
2. System generates optimal assignments based on:
   - Agent qualifications matching poste requirements
   - Current worked hours (avoid exceeding limits)
   - Site daily requirements and capacity
3. Review results: assignments created, conflicts, unfilled shifts
4. For unfilled shifts: system suggests agents with match scores

### 4. Template Application
1. Create `ScheduleTemplate` with recurrence pattern (daily/weekly/monthly)
2. Define template assignments (agent → site → poste → times)
3. Apply template to date range → generates concrete assignments
4. Review and adjust individual assignments

### 5. Shift Management
1. Define `StandardShift` per site: name, start/end time, break, color
2. Assign shifts to agents → `AgentShift` (standard or on-demand)
3. Support split shifts (two parts in one day)
4. Track completion: `completed`, `noShow`
5. Copy shifts between days/agents via `ShiftCopyData`

### 6. Hours Export
1. Period completed → aggregate worked hours per employee
2. Calculate: normal, night, Sunday, holiday, overtime 25%/50% hours
3. Export to [[features/web/Payroll|Payroll]] as `PlanningHoursImport`
4. Export to [[Billing]] for invoicing with site-specific rates

## Data Types

### Sites & Postes
```
Site: { id, name, clientId, clientName, address, contact,
        constraints { mandatoryHours, requiredCertifications, accessInstructions },
        billing { hourlyRate, overtimeRate, nightRate, weekendRate, holidayRate },
        status (active|inactive|suspended), contractStartDate, postes[] }
Poste: { id, siteId, name, type (PosteType), requirements { minimumExperience, requiredCertifications },
         schedule { defaultShiftDuration, breakDuration, nightShift, weekendWork, rotatingShift },
         capacity { minAgents, maxAgents, currentAgents }, dailyRequirements { mon-sun },
         instructions { duties[], procedures, equipment[], emergencyContact }, priority }
PosteType: "agent_securite" | "ssiap1" | "ssiap2" | "ssiap3" | "operateur_video" | "accueil" | "manager" | "rh" | "comptable"
```

### Shifts
```
StandardShift: { id, siteId, name, startTime, endTime, breakDuration, color }
AgentShift: { id, agentId, siteId, date, shiftType (standard|on_demand),
              standardShiftId, startTime, endTime, breakDuration, color,
              isSplit, splitStartTime2, splitEndTime2, completed, noShow }
ShiftCopyData: { agentId, shiftType, startTime, endTime, breakDuration, color }
```

### Assignments & Schedule
```
Assignment: { id, agentId, agentName, siteId, siteName, posteId, posteName,
              startDate, endDate, startTime, endTime, plannedHours, actualHours,
              status (scheduled|confirmed|in_progress|completed|cancelled|no_show),
              conflicts[], hasConflicts }
AssignmentConflict: { type (double_booking|missing_qualification|hours_exceeded|unavailable),
                      severity, message, relatedAssignmentId }
ScheduleAlert: { id, type, severity, title, message, assignmentId, agentId, resolved }
```

### Templates & Auto-Scheduling
```
ScheduleTemplate: { id, name, recurrence (daily|weekly|monthly), pattern { daysOfWeek, weeksOfMonth },
                    assignments (TemplateAssignment[]), active }
AutoScheduleRequest: { startDate, endDate, siteIds, prioritizeQualifications, prioritizeCost, allowOvertime }
AutoScheduleResult: { success, assignmentsCreated, conflicts[], unfilledShifts[] }
UnfilledShift: { siteId, posteId, date, startTime, endTime, reason, suggestedAgents[] }
SuggestedAgent: { agentId, matchScore, qualificationMatch, availabilityStatus, hoursThisWeek }
```

### Filters & Stats
```
ScheduleFilters: { view (daily|weekly|monthly), groupBy (agent|site|poste), dateRange, agentIds, siteIds, status }
ScheduleStats: { totalAssignments, confirmed, pending, conflicts, coverageRate, totalHours, agentsAssigned }
```

## Related

- [[features/web/Payroll|Payroll]] — Worked hours exported for salary calculation
- [[Billing]] — Planned/realized hours exported for invoicing
- [[HR]] — Employee qualifications determine assignment eligibility
- [[features/web/Geolocation|Geolocation]] — Real-time tracking of assigned agents on sites
