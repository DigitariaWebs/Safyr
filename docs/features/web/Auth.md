# Auth

> Routes: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`
> Source: `web/src/app/(auth)/`

## Overview

Authentication portal handling user registration, login, password recovery, and email verification. Guards access to the dashboard.

## Pages

| Page | Route | Purpose |
|------|-------|---------|
| Login | `/login` | Email + password sign-in |
| Register | `/register` | New account creation |
| Forgot Password | `/forgot-password` | Request password reset link |
| Reset Password | `/reset-password` | Set new password via token |
| Verify Email | `/verify-email` | Confirm email address |

## Workflows

### 1. Registration
1. User fills registration form (name, email, company, password)
2. Account created → verification email sent
3. User clicks verification link → `/verify-email`
4. Email confirmed → redirected to `/login`

### 2. Login
1. User enters email + password
2. Credentials validated
3. Session created → redirected to `/dashboard`

### 3. Password Recovery
1. User clicks "Mot de passe oublié" on login
2. Enters email → reset link sent
3. Clicks link → `/reset-password` with token
4. Sets new password → redirected to `/login`

## Data Types

No dedicated types yet — authentication is currently client-side with mock data. Future: JWT tokens stored via `expo-secure-store` (mobile) or httpOnly cookies (web).

## Related

- [[Public]] — Marketing pages with registration CTA
- [[Dashboard]] — Post-login destination
