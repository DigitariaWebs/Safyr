# Logbook (Main Courante)

> Routes: `/dashboard/logbook/**`
> Source: `web/src/app/dashboard/logbook/`

## Overview

Digital logbook (main courante) for security operations. Records events, incidents, alerts, and interpellations. Supports validation workflows, agent and client portal views, and statistical analysis.

## Pages

| Route | Purpose |
|-------|---------|
| `/logbook` | Logbook hub |
| `/logbook/events` | Event list and creation |
| `/logbook/validation` | Event validation workflow |
| `/logbook/security` | Security incidents and alerts |
| `/logbook/alerts` | Alert management |
| `/logbook/interpellation-archives` | Incident/interpellation archives |
| `/logbook/unknown-losses` | Unknown loss logging (démarque inconnue) |
| `/logbook/exports` | Export logbook to PDF/CSV |
| `/logbook/planning-rh` | HR planning from logbook data |
| `/logbook/agent-portal` | Agent-facing logbook view |
| `/logbook/client-portal` | Client-facing logbook view |
| `/logbook/statistics` | Logbook statistics dashboard |

## Workflows

### 1. Event Logging
1. Agent creates event (from mobile or web): type, description, priority, location, media attachments
2. Event recorded with timestamp and author
3. Events appear in real-time feed on dashboard

### 2. Event Validation
1. Supervisor reviews pending events
2. Validates or requests correction
3. Validated events become part of official record
4. Exported to client reports

### 3. Security Incident Management
1. Security alert raised (theft, intrusion, aggression, etc.)
2. Incident documented with full details, witnesses, evidence
3. Escalation if needed → interpellation recorded
4. Archived in interpellation archives with searchable history

### 4. Unknown Loss Tracking (Démarque Inconnue)
1. Log unknown/unexplained loss events
2. Track frequency, location, estimated value
3. Generate reports for client review

### 5. Client Reporting
1. Filter events by client, site, period
2. Generate client-facing report (sanitized view)
3. Export as PDF/CSV
4. Client portal provides self-service access to their logbook data

### 6. Statistics & Analytics
1. Event frequency by type, priority, site, time of day
2. Trend analysis over time
3. Agent activity metrics
4. Response time tracking

## Data Types

Types defined in mock data and mobile feature types:

### Events
```
LogbookEvent: { id, type (ronde|incident|observation|interpellation|autre),
                title, description, priority (low|medium|high),
                siteId, siteName, agentId, agentName,
                timestamp, location, media[] (photos, videos),
                status (draft|pending|validated|archived),
                validatedBy, validatedAt }
```

### Mobile Main Courante Types
```
MainCourantePriority: "low" | "medium" | "high"
MainCouranteEvent: { id, title, description, priority, type,
                     siteId, agentId, timestamp, media[],
                     latitude, longitude }
```

### Alerts & Security
```
LogbookAlert: { id, type, severity, title, message, siteId, agentId,
                timestamp, acknowledged, resolvedAt }
SecurityIncident: { id, type (theft|intrusion|aggression|fire|other),
                    description, location, witnesses[], evidence[],
                    severity, status, reportedBy, reportedAt }
```

## Related

- [[features/web/Geolocation|Geolocation]] — Location context for events
- [[Planning]] — Site and agent assignment context
- [[features/mobile/Main Courante|Mobile Main Courante]] — Agent-side event creation
