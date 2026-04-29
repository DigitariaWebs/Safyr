# Server

NestJS backend API for Safyr. Consumed by web (`@safyr/web`) and mobile (`@safyr/mobile`) via shared TanStack Query client.

Status: design locked, implementation pending. Currently web/mobile use Zustand + mock data; cutover is module-by-module.

---

## Stack

| Concern | Choice |
|---|---|
| Framework | NestJS + Fastify adapter |
| Language | TypeScript |
| ORM | Prisma |
| Database | NeonDB (Postgres) |
| Auth | better-auth (see [Auth plugins](#auth-plugins)) |
| Validation | `nestjs-zod` (shared Zod schemas) |
| Logger | Pino (`nestjs-pino`) |
| Realtime | Socket.io |
| Storage | Supabase Storage (standalone, service key, presigned URLs — no Supabase Auth) |
| Tests | Vitest + Testcontainers (real Postgres per suite) |
| Rate limit | `@fastify/rate-limit` |
| API docs | OpenAPI derived from Zod → Swagger at `/api/docs` |
| Deploy target | TBD |
| Jobs infra | TBD (candidates: BullMQ+Redis, pg-boss) |
| Email | Nodemailer (SMTP) + React Email templates, wrapped in `EmailService` |

---

## Repo layout

Turborepo monorepo. Single `bun install` at root.

Apps:

- `apps/server` — NestJS API.
- `apps/web` — `@safyr/web`.
- `apps/mobile` — `@safyr/mobile`.

Shared packages:

- `packages/schemas` — Zod DTOs shared across server and clients.
- `packages/api-types` — request/response TypeScript types.
- `packages/constants` — role names, status enums, permission statements.
- `packages/api-client` — fetch wrapper + TanStack hooks imported by web and mobile.

---

## Module boundaries

Start minimal, grow as needed:

**v1 modules:** `AuthModule`, `OrgModule`, `HrModule`.

Later modules mirror dashboard domains: Payroll, Planning, Billing, Accounting, Banking, Geolocation, Logbook, Stock, OCR.

### Internal layers per module

Each module splits into three layers: controller → service → repository.

- **Controller:** HTTP only. Delegates to service, returns envelope.
- **Service:** business logic. Throws `AppError` subclasses.
- **Repository:** Prisma queries only.

Pattern ported from oumischool server.

---

## Tenancy model

- **Organization = security company** (the SaaS customer). better-auth `organization` plugin handles it.
- **Site** (agence/client site) = field/FK on domain entities, NOT a separate tenant.
- **Multi-org users:** enabled. Session carries `activeOrganizationId`. Supports Safyr support staff, freelance managers, future multi-employer agents.
- **Agents (security guards):** `Employee` row created by HR at onboarding. `User` account created lazily on first mobile login, 1-1 linked to Employee. Decouples HR lifecycle from auth lifecycle.

### Tenant scoping enforcement

Prisma `$extends` + `AsyncLocalStorage`:

- Request-scoped ALS holds `orgId` from authenticated session.
- Prisma extension auto-injects `where: { orgId }` on every model that carries an `orgId` column.
- Impossible to forget at call sites.

---

## Auth

### Methods

| Surface | Method |
|---|---|
| Web admins | Magic link only (no password) |
| Mobile agents | Email + OTP |

⚠️ **Risk:** magic-link-only = email provider is SPOF. Account lockout if provider fails. Reconsider adding password fallback.

### Sessions

better-auth DB sessions on both platforms.

| Platform | Transport | Storage |
|---|---|---|
| Web | Cookie | better-auth default |
| Mobile | Bearer header | `expo-secure-store` |

DB sessions enable server-side revocation + logout-all-devices + audit trail.

### RBAC

better-auth `createAccessControl` with custom statements and roles per org.

Safyr roles: `DirigeantRH`, `ChefExploitation`, `Comptable`, `ChefDeSite`, `Agent`, `ClientFinal` (portal, deferred).

Native integration with invitations, sessions, role checks.

### Auth plugins

v1 plugin set:

| Plugin | Purpose |
|---|---|
| `organization` | Multi-tenant core. Members, invitations, roles scoped per org. |
| `access-control` | Custom permission statements + Safyr roles. |
| `magic-link` | Web admin login. `sendMagicLink` hook wired to `EmailService`. |
| `email-otp` | Mobile agent login. `sendVerificationOTP` hook wired to `EmailService`. |
| `bearer` | Bearer-token transport for mobile (replaces cookie session on Expo). |
| `admin` | Safyr-staff impersonation, ban/unban, cross-org user management for support. |
| `expo` | Expo integration: deep-link handling for magic-link/OTP callbacks, `expo-secure-store` binding. |
| `captcha` | Turnstile/reCAPTCHA/hCaptcha on public auth endpoints. Blunts bot spam and OTP/magic-link abuse. |
| `two-factor` | TOTP for privileged roles (DirigeantRH, Comptable, admin). Required posture for payroll/payment data. |
| `username` | Human-friendly handle per member. Improves org UX (mentions, assignment UIs, logbook authorship) without replacing email auth. |

Deferred candidates (revisit as Safyr grows): `api-key` (external integrations), `phone-number` (SMS-OTP swap for agents), `multi-session` (simultaneous sessions across orgs), `sso` / `oidc-provider` (enterprise SSO), `jwt` (3rd-party API access), `have-i-been-pwned` (only if password fallback lands), `openapi` (duplicates nestjs-zod docs), `passkey` (low ROI on shared field devices).

Skipped: `anonymous`, `one-tap`, `oauth-provider`, `siwe`, `stripe`/`polar` (billing model TBD).

---

## Data layer

### Prisma

- Single `schema.prisma` in `apps/server/prisma/`.
- Native Prisma enums (DB-level enforcement, accepts migration cost).
- `prisma/seed.ts` with scenario seed: 1 org, 3 users per role, 20 employees, 5 sites, 2 weeks of planning. Idempotent, re-runnable.

### NeonDB

- `main` branch = production.
- Neon branch per PR via GitHub integration. Auto-migrate on deploy.
- Preview envs consume PR branch.

### Audit log

Prisma `$extends` writes `AuditLog` rows on create/update/delete for sensitive models: `Employee`, `Contract`, `Payroll`, `Shift`, etc. Required for French labor compliance defense.

---

## HTTP contract

### Response envelope

Every response carries a `success` boolean. Success responses include `data` and optional `meta` (pagination, etc). Error responses include `error` with `code`, `message`, and optional `details`.

Implemented via NestJS response interceptor + exception filter. Clients unwrap `data`, throw on non-success.

### Error hierarchy

Port oumischool `AppError` as NestJS `HttpException` subclasses: `NotFoundError`, `UnauthorizedError`, `ForbiddenError`, `ValidationError`, `ConflictError`, `DomainError`.

Each error carries a stable `code` (English, for logs/grep), a French `message` for end users, and optional `details` for field-level validation errors.

### Localization

French error messages in `AppError`. Error `code` stays English for logs/grep. Safyr is France-only.

### Pagination

Offset-based. List responses carry `data`, `total`, `page`, `limit`, and `totalPages`. Matches oumischool and current TanStack Table usage. Fine up to ~100k rows per table.

### Versioning

None in v1. Add `/v1` prefix when first breaking change hits.

### Validation

`nestjs-zod` globally. Shared schemas in `packages/schemas` used by both server pipes and client forms.

### API docs

OpenAPI generated from Zod schemas. Swagger UI at `/api/docs`.

### Rate limiting

`@fastify/rate-limit`, in-memory per-IP + per-userId. Stricter on `/auth/*` (login, OTP, magic-link request) to blunt OTP spam / brute force.

### CORS

Allowlist from `ALLOWED_ORIGINS` env var (comma-separated). Web prod + staging + localhost. Mobile uses Bearer so no origin check applies.

---

## Realtime

Socket.io gateway. Use cases:

- Geolocation: agent positions, work-zone breach alerts.
- Logbook: live feed of main courante entries to dispatcher.
- Planning: shift swap notifications.

Rooms scoped by `orgId` + optional `siteId`.

---

## File storage

Supabase Storage, standalone — service role key, no Supabase Auth layer.

Flow:

1. Client requests presigned PUT URL from server.
2. Server validates permissions, issues presigned URL, persists `StoredFile` row (key + metadata + `orgId`).
3. Client uploads directly to Supabase.
4. Read via presigned GET or signed URL with TTL.

Use cases: OCR docs, HR documents, logbook photos, avatars, contract attachments.

---

## Observability

- **Logs:** Pino structured JSON (`nestjs-pino`). Request ID propagated via ALS.
- **Errors:** TBD (Sentry candidate).
- **Metrics/traces:** deferred.

---

## Email

`EmailService` (NestJS `@Injectable()` provider) owns all outbound email.

### Stack

- **Transport:** Nodemailer with SMTP. Provider-agnostic (Resend/Postmark/Brevo/SES all expose SMTP).
- **Templating:** React Email. Templates live in `apps/server/src/email/templates/*.tsx`, rendered to HTML at send time via `@react-email/render`.

### API

One typed method per email type (magic link, OTP, org invitation, password reset, payslip-ready, planning publication, weekly reports, etc). Each method takes a recipient plus strongly-typed params. Internally: render the matching React template, hand the HTML to the Nodemailer transport.

### Wiring

- better-auth `sendMagicLink` + `sendVerificationOTP` hooks call `EmailService`.
- Invitations (better-auth `organization` plugin) call `EmailService.sendInvitation`.
- Password reset, weekly reports, payslip-ready, planning publication — all route through `EmailService`.

### Config

SMTP credentials (host, port, user, password, from-address) supplied via the Zod-validated env module.

### Async dispatch

When jobs infra lands, `EmailService` enqueues into the email queue instead of sending inline. Same interface — internal change only.

---

## Env & secrets

Zod-validated env module at `apps/server/src/config/env.ts`. Parses `process.env` on boot, exports typed config, fails fast on missing/invalid vars.

---

## Testing

Vitest + Testcontainers spin real Postgres per test suite. Tests run `controller → service → repo` against real DB. Catches migration bugs, constraint violations, SQL drift.

---

## Client integration

### Shared API client

`packages/api-client` consumed by web + mobile:

- Fetch wrapper with envelope unwrap (`json.success`, throw `ApiError` on failure, return `json.data`).
- Token refresh mutex on 401 (ported from oumischool mobile).
- Platform-injected storage adapter (localStorage for web, expo-secure-store for mobile).

### TanStack Query layout

Per-domain folder in each app containing three files: `api.ts` (typed fetch functions), `hooks.ts` (TanStack `useQuery`/`useMutation` wrappers), `keys.ts` (query key factory).

### Query key factory

Each domain exports a factory object with entries for `all`, `list(params)`, `detail(id)`, and any sub-resources (e.g. `detail(id).lessons`). Keys nest so invalidation by prefix cascades. Matches oumischool pattern.

### Optimistic updates

Only on high-frequency mutations: planning shift drag-drop, logbook entries, geo status toggles. Rest invalidate-on-success.

### Auth bootstrapping

`SessionBootstrapper` component mounts globally, hydrates user via `GET /auth/session` on app load. Pattern ported from oumischool web.

---

## Migration path from mock data

Module-by-module cutover:

1. Scaffold server (Auth + Org + HR).
2. Land HR endpoints. Replace employee-related Zustand stores in web with TanStack hooks from `packages/api-client`.
3. Repeat per domain: Planning, Payroll, Billing, and so on.
4. Each merge ships one module end-to-end.

Rationale: Planning, Payroll, Geolocation all depend on Employee. HR first unblocks everything.

---

## Open items

Unresolved design questions that block concrete implementation:

- [ ] **Deploy target.** Blocks Dockerfile + CI. Candidates: Railway, Render, Fly.io, Hetzner/OVH VPS. Vercel-style serverless ruled out (WebSockets + jobs).
- [ ] **Jobs infra.** Blocks DSN exports, async PDF generation, email dispatch. Candidates: BullMQ + Upstash Redis, pg-boss (Postgres-backed), `@nestjs/schedule` (too limited).
- [ ] **SMTP provider choice.** Transport is Nodemailer SMTP; pick provider (Resend/Postmark/Brevo/SES). France data-residency requirements?
- [ ] **Password fallback for web.** Magic-link-only = email SPOF. Add password as backup method?
- [ ] **SMS provider for future phone-OTP.** Mobile currently email-OTP but industry often prefers SMS (agents lack work email). Twilio / OVH SMS?

---

## Reference: oumischool patterns ported

| Pattern | Oumischool source | Safyr equivalent |
|---|---|---|
| `controller → service → repo` split | `src/modules/<domain>/` | Same, NestJS `@Injectable()` providers |
| `AppError` hierarchy | `src/shared/errors/AppError.ts` | Custom `HttpException` subclasses |
| Envelope `{success, data, error}` | `src/shared/utils/response.ts` | Response interceptor + exception filter |
| Pagination shape | `src/shared/utils/pagination.ts` | Identical shape — clients already expect it |
| Refresh mutex on 401 | `oumischool-mobile/hooks/api/client.ts` | Shared `packages/api-client` |
| Query key factory objects | `oumischool-web/src/hooks/<domain>/keys.ts` | Per-domain `keys.ts` in each app |
| `SessionBootstrapper` on app load | `oumischool-web` | Same pattern, web + mobile |
| Stripe-style raw-body webhook handling | `src/app.ts` | Fastify raw-body plugin on webhook routes |
