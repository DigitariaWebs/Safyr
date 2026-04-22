# Changelog

All notable changes to `apps/server` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

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
