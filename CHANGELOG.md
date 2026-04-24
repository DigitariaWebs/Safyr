# Changelog

Project-wide changes only.

## [Unreleased]

### Added

- `@safyr/schemas/employee` subpath — `CreateEmployeeSchema`, `UpdateEmployeeSchema`, `CreateCertificationSchema`, `UpdateCertificationSchema`, `UploadMemberDocumentSchema` plus shared validators (Name, Email, PhoneFr, SsnFr, BirthDate, etc.)
- `@safyr/schemas/shared` placeholder for cross-schema helpers
- `@safyr/api-client` `employees` client + types — list, get, stats, compliance, create, update, delete, invite, document upload, certification CRUD; re-exported from package root
- `@faker-js/faker` root devDependency

### Changed

- `@safyr/schemas` organization validators reworked with shared helpers (`optionalPattern`, `optionalText`) and stricter French-format validation for SIRET, APE, phone, NIR, CNAPS authorization number, share capital, names, and ISO dates
- `@safyr/schemas/organization` reorganized — `AuthorizationNumberSchema` now exported; appointment date validator generalized into `PastOrTodayDate` and `AnyIsoDate`

## [0.1.0] - 2026-04-22

### Added

### Changed

### Fixed
