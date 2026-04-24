# Changelog

All notable changes to `apps/web` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- `PhoneField` component (`src/components/ui/phone-field.tsx`) — event-style, digit-only with auto-format; compatible with `EditableFormField`'s cloneElement pattern
- `EditableFormField` (`src/components/ui/editable-form-field.tsx`) and `form-field` (`src/components/ui/form-field.tsx`) for inline-edit forms
- Per-row upload loading state and inline error messages on the entreprise Documents tab
- `date-utils` (`src/lib/date-utils.ts`) exposing `formatDate` and `formatDateForInput`
- Entreprise page now wires organization info, representative, and compliance documents through tanstack-form + react-query

### Changed

- API client `baseURL` now auto-appends `/api`; `NEXT_PUBLIC_API_URL` is expected to be the server origin only (fixes 404s on `/organization` routes)
- Document upload on the entreprise page switched from the generic `uploadFile` to `uploadOrganizationDocument`, which links the resulting `Document` to a `DocumentRequirement`
- Phone and mobile inputs on the entreprise page use the new `PhoneField` instead of bare `<Input>`

### Fixed

- Tanstack-form validation on the entreprise page now uses a single form-level Zod validator instead of broken inline `getValidator(...)` calls (every render previously threw `ReferenceError`)
- Field error rendering now maps Standard-Schema issue objects to `.message` strings (no more `[object Object]`)
- Validation errors only surface on touched fields (`field.state.meta.isTouched`)
- Network errors, non-JSON responses, empty 5xx bodies, and hung requests in `@safyr/api-client` all surface as typed `ApiError` with codes `NETWORK_ERROR`, `TIMEOUT`, `PARSE_ERROR`, `HTTP_ERROR`; a 30s default request timeout was added

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
