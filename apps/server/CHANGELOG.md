# Changelog

All notable changes to `apps/server` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- `Organization` module with endpoints `GET /organization`, `PATCH /organization`, `POST /organization/representative`, `GET /organization/compliance`, `POST /organization/documents`
- `Storage` module with endpoints `POST /storage/upload` and `GET /storage/signed-url/*`; `StorageService` wraps Supabase Storage
- `POST /organization/documents` (multipart) — creates or replaces a `Document` linked to a `DocumentRequirement`, validates that the requirement's `targetType === "ORGANIZATION"`, and best-effort deletes the previous object on replace
- Compliance status is now computed from `Document.expiryDate` with a 30-day expiring window instead of trusting the stored `status` field
- `@@unique([organizationId, requirementId])` on the `Document` model (migration required)
- `UploadDocumentSchema` in `@safyr/schemas/organization`

### Changed

- `prisma/seed.ts` rewritten — now runs `TRUNCATE ... RESTART IDENTITY CASCADE` on all 11 tables before seeding, and provisions the `Prodige Securite` organization, a representative (Chaffa Belarbi, Gérant), two owner accounts (`prodigesecurite@gmail.com`, `khalil3cheddadi@gmail.com`), and 10 organization document requirements (8 required, 2 optional)
- `EmailService` no longer opens an SMTP transport in `NODE_ENV=development`; it logs recipient, subject, metadata, and rendered HTML through the Nest logger instead
- `EmailService.checkConnection()` short-circuits to `{ status: "up" }` in development

## [0.1.0] - 2026-04-22

### Added

- OTP email template (`src/email/templates/otp.tsx`) with type-specific content (connexion, vérification, reset, changement d'e-mail)
- `EmailService.sendOtp(...)` to send OTP emails through SMTP

### Changed

- Auth config now forwards email OTP sending through `EmailService.sendOtp(...)`
- Better Auth plugin config no longer includes CAPTCHA wiring
- SMTP environment variables are now required (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`)
- Better Auth advanced cookie defaults set for cross-site cookies (`SameSite=None`, `Secure`, `HttpOnly`)
- Internal imports in auth/prisma/filter modules were normalized to `@/` aliases

### Fixed
