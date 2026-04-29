# Auth (Mobile)

> Routes: `(auth)/login`
> Source: `mobile/src/app/(auth)/`

## Overview

Agent authentication screen. Credentials stored securely via `expo-secure-store`. Supports token-based session persistence.

## Workflows

### 1. Agent Login
1. Agent opens app → if no valid token, redirected to login
2. Enter email + password
3. Authenticate → token stored in secure store
4. Redirected to Home tab

### 2. Session Persistence
1. App launched → check `expo-secure-store` for valid token
2. If valid → auto-navigate to authenticated app
3. If expired → redirect to login

## Data Types

```
AuthStorage: { token: string, userId: string, expiresAt: number }
```

Storage: `auth.storage.ts` wraps `expo-secure-store` for token CRUD.

## Related

- [[features/mobile/Home|Home]] — Post-login destination
- [[features/web/Auth|Web Auth]] — Same authentication flow, web version
