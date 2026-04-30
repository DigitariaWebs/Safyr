# Changelog

Project-wide changes only.

## [Unreleased]
### Added
- F22-PO1: Added "New PO" button on the Purchase Orders page
- F22-PO2: Added "Service needs" section in the New Purchase Order form
- F22-INV3: Added manual service entry in the New Invoice form
- F22-SIM1: Added "Start date" and "End date" fields in the New Simulation form
- F22-CLI1: SIRET auto-fill company information via peppers.fr

### Changed
- F22-CLI2: "New client" form split into multi-step wizard
- F22-CLI3: "Agent typology" field converted to dropdown
- F22-SRV1: "Service name" field converted to pre-filled dropdown
- F22-SRV2: Added optional "Detail" field in the New Service form
- F22-INV1: Added due date display in invoice view
- F22-INV2: Full detail display for each data source in New Invoice form
- F22-PO3: Purchase order recipient now uses subcontractor list

### Removed
- F22-MENU1: Removed VAT menu
- F22-MENU2: Removed Payroll menu
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
