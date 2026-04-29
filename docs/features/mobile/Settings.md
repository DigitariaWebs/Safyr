# Settings (Mobile)

> Route: `(tabs)/settings/index`
> Source: `mobile/src/app/(app)/(tabs)/settings/`

## Overview

App settings and preferences. Theme toggle, notification preferences, location sharing controls, and account management.

## Workflows

### 1. Manage Settings
1. Toggle dark/light theme
2. Enable/disable notification categories
3. Control location sharing (active/paused)
4. Manage discrete mode (silent tracking)
5. Sign out → clear secure store → redirect to login

## Data Types

Theme managed via `ThemeContext.tsx` and `useTheme.ts`.

## Related

- [[features/mobile/Auth|Auth]] — Sign out flow
- [[features/mobile/Geolocation|Geolocation]] — Location sharing toggle
- [[features/mobile/Notifications|Notifications]] — Notification preferences
