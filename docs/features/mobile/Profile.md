# Profile (Mobile)

> Route: `(app)/profile/index`
> Source: `mobile/src/app/(app)/profile/`, `mobile/src/features/profile/`

## Overview

Agent profile screen. View personal info, employment details, certifications, and assigned equipment. Edit capabilities for bank details and address (triggers HR workflow).

## Workflows

### 1. View Profile
1. Agent opens profile
2. See: name, photo, employee number, position, department
3. View certifications with expiry dates (CNAPS, SSIAP, SST)
4. View assigned equipment

### 2. Update Personal Info
1. Tap edit on bank details or address
2. Submit change request → creates HR workflow on web
3. Pending approval notification

## Data Types

Storage: `profile.storage.ts` persists profile data via `AsyncStorage`.

## Related

- [[features/web/HR|Web HR]] — Employee profile source of truth
- [[features/mobile/Documents|Documents]] — Related employment documents
