# Changelog

All notable changes to `apps/web` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [0.1.0] - 2026-04-22

### Added

- Login now supports OTP (default) and magic-link fallback with better-auth (`sendVerificationOtp`, `signIn.emailOtp`, `signIn.magicLink`)
- shadcn/ui OTP input component added (`src/components/ui/input-otp.tsx`) via `input-otp`
- `(auth)` route-group layout now redirects authenticated sessions to `/dashboard`
- Shared `getUserDisplayData()` utility (`src/lib/user-display.ts`) to centralize user name/email/role/avatar/initials derivation

### Changed

- `ProfileModal` and `ModuleTopBar` now use centralized session-driven user display derivation
- `ModuleTopBar` now derives avatar/initials from local session, and dashboard module layouts no longer pass static `userInitials`
- Login form stores draft state in `sessionStorage` (mode, email, OTP step) to preserve progress during tab switches/navigation
- Auth-page loading behavior now only gates on initial session resolution to reduce disruptive remount/loading flashes
- Profile modal actions were updated for better overflow handling in long labels/descriptions

### Fixed

- OTP sign-in verification now uses the exact email address used for OTP request
- Login draft in `sessionStorage` is now cleared after successful magic-link submission
