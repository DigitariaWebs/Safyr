# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- **Server** — New `apps/server` NestJS + Fastify backend scaffolded with envelope interceptor, AppError exception filter, Zod validation pipe, Pino logger, CORS allowlist, rate-limit, and `/api/health` endpoint
- **Server** — better-auth integration with plugin set: organization, access-control, magic-link, email-otp, bearer, admin, expo, two-factor, username, captcha (env-gated)
- **Server** — Prisma 7 schema with better-auth core (User, Session, Account, Verification), `organization` plugin tables (Organization with `siret`/`ape`/`address`, Member, Invitation, TwoFactor), and Safyr stubs (`Site`, `Employee` with orgId FK + lazy `userId` link)
- **Server** — Access-control roles (`owner`, `dirigeant_rh`, `chef_exploitation`, `comptable`, `chef_de_site`, `agent`) with per-resource statements (employee, payroll, planning, billing, accounting, geolocation, logbook)
- **Server** — `EmailService` (Nodemailer SMTP + React Email) with magic-link template; dev mode always console-logs URL, sends via SMTP when `SMTP_HOST` configured
- **Server** — Prisma seed producing demo org `safyr-demo` and owner user `owner@safyr-demo.fr`
- **Server** — `prisma.config.ts` using new Prisma 7 config-first pattern; driver adapter via `@prisma/adapter-pg`
- **Server** — `auth:generate` script wrapping `@better-auth/cli generate` to keep Prisma schema in sync with plugin set
- **Shared** — New workspaces `packages/schemas`, `packages/constants`, `packages/api-client`
- **Shared** — `@safyr/api-client` exposes `createSafyrAuthClient()` wiring magic-link, organization, admin, username, two-factor, email-otp better-auth client plugins
- **Web** — Replaced stubbed login form with real magic-link flow (`authClient.signIn.magicLink`) and success state
- **Web** — `/profile` page showing session user details + sign-out
- **Web** — `SessionGuard` on dashboard layout redirects unauthenticated users to `/login`
- **Web** — TanStack `QueryClientProvider` in root layout
- **Tooling** — Root `tsconfig.base.json` shared compiler options
- **Tooling** — Root `.env.example` documenting server + web env vars
- **Tooling** — Turbo pipeline gains `db:generate`, `db:migrate`, `db:push`, `db:seed`, `db:studio`, `auth:generate` tasks
- Multi-site schedule view — all active sites visible by default, grouped in collapsible color-banded cards
- Cascading client → site filters (Clients, Sites, Agents popovers); Sites disabled until a client is picked
- New three-row sticky header: title + stats + large week label / filters / controls (date nav + view switcher + simulation + PDF export); copy-mode and simulation banners pinned inside
- Monthly view redesign — replaces calendar grid with a row-per-agent layout (sticky name column, per-poste besoin rows, site-colored dots per shift)
- Rich besoin display in daily (24h timeline bars per poste with coverage badge) and weekly (one row per poste with per-day `covered/required`)
- Per-view contract summary under every agent (planned / contract + remaining or overbooked), computed across all visible sites so multi-site agents show true totals
- Simulation mode — red banner, shadow-state writes that don't touch live data, exit modal with Save / Discard / Stay
- Needed postes section at top of the shift template popover with inferred time windows and coverage count
- Multi-select agent assignment modal (excludes agents already assigned to the site)
- Quick-edit pencil on ShiftBlock (daily) and ShiftCard (weekly) bottom-right
- "Assigner un agent" button inside each site group header
- Planning summary card (Heures totales / sup. / Repas / Absences) and Détail des majorations always visible above the grid and scoped to active filters
- Mock data expanded to 12 agents across 5 sites with rotating shifts
- Structured emergency contact modes in postes form (site / client / manual) with `PhoneInput`
- Shared `planning-constants.ts` module exporting `BREAK_DURATION_OPTIONS`, `SHIFT_DURATION_OPTIONS`, `EQUIPMENT_OPTIONS`
- Multi-select equipment picker in postes form (replaces freetext comma-separated input)
- `@tanstack/react-form` dependency
- Collapsible right sidebar on schedule page (`PlanningSidebar`) for period navigation, view switcher, actions (simulation, PDF), and résumé metrics — open state persisted in `uiStore`
- Pill-variant filter controls in schedule topbar (client / site / agent popovers) with active-state styling
- Single global "Assigner un agent" button with required site select in the modal, replacing per-site buttons (P3-PG2)
- Week-number pill ("Semaine XX") centered above the weekly view weekday header, highlighted when it is the current ISO week (P3-PG7)
- Explicit 3-value agent summary (Contrat / Affectées / Restantes, Dépassement in red) in daily, weekly, and monthly agent cells (P3-PG8)
- Dedicated "Simulation" page at `/dashboard/planning/simulation` (named `ScheduleView` export with `forceSimulation` prop) — shares the schedule grid but forces simulation mode, shows red top banner and red "Simulation" title; nav entry between Planning and Paramètres with `FlaskConical` icon (P3-SIM1)
- Charts on geolocation Rapports page — stacked/grouped histogramme and secteur (camembert) per report type (Présences, Rondes, Déplacements, Incidents, Zones) with semantic color palette
- Editable "Observation" field on patrol incident modal (Historique) with _Enregistrer_ action
- "Envoyer au client" action on incident modal alongside existing "Envoyer au responsable"
- Time stamp (HH:MM) in front of each point de contrôle in Historique ronde detail
- Date début / Date fin filter on Historique (replaces year + month selects)
- Distinct colors for all four status pills on Historique (Toutes = cyan, Complètes = emerald, Incomplètes = amber, Incident = red)
- Whole incident row clickable in Historique detail (previously only the "Incident" badge)
- Montant, Statut paiement (Réglé / Non réglé), and Justificatif fields on Fiche d'interpellation (justificatif as placeholder, stockage à venir)
- Weekly view week-navigator bar under the planning grid — pills for every week of the current month with date range and active-week highlight (P4-PG7)
- "Détail des heures" section in the schedule sidebar — H normales / H de nuit / H dimanche / H fériés, hides zero categories (P4-PG3 / P4-PG4)
- Distinct simulation page background (diagonal rose hatching + rose inset ring) to prevent confusion with the Planning menu (P4-SIM2)

### Changed

- **Tooling** — Root workspaces glob `["apps/web", "apps/mobile"]` → `["apps/*", "packages/*"]`
- Extracted schedule page into `schedule/_components/` (view components, modals, filter bar, utilities) — page.tsx reduced from 4717 → ~2900 lines
- Shared `playAlertBeep` helper extracted to `lib/audio-alerts.ts`
- Contract hours interpreted as weekly reference and pro-rated across each view's visible period
- Shift template popover ordering: needed postes first, then site templates
- Migrate postes form from `useState` to `@tanstack/react-form` with per-field bindings
- Unify break duration control as `Select` (0/15/30/45/60 min) in postes and shifts pages
- Restyle site group labels in postes & shifts tables as colored badges instead of full-row tinted backgrounds
- Schedule topbar redesigned: filter pills replace stats readout, week label removed; sidebar toggle (with active-filter count badge) replaces week indicator (P3-PG1)
- Résumé du planning moved from main content into sidebar with compact 2x2 metric tiles; Détail des majorations rendered at bottom of the grid
- Weekly besoin per-day cells stack vacation window (`HH:mm–HH:mm`) and coverage `X/Y` with remaining deduction (`−N`) (P3-PG6)
- Copy-mode banner: bright red background, white bold uppercase text, larger icon & padding (P3-PG5)
- Month-view shift dot uses the shift's own color instead of the site color (P3-PG9)
- Remove in-page Simulation button, exit flow, and exit-confirmation modal from the schedule page — simulation now lives exclusively on the dedicated route (P3-SIM1)
- Simulation banner restyled to match copy-mode banner (bright red, white bold uppercase, larger padding)
- Logbook nav: "Exports" renamed **"Rapports"**, placed before Sécurité; Sécurité moved to end of menu
- Geolocation Rondes: "Itinéraire" → "Ronde", "Nouvel itinéraire" → "Nouvelle Ronde", "Ajouter un point" → "Nouveau point"
- Live Tracking top-left overlay enlarged (min-w 480px, increased padding)
- Comments on Historique checkpoints now shown inline regardless of incident flag
- PatrolReportEmailModal title adapts when a recipient label is passed ("— Responsable" / "— Client")
- Nouveau poste modal shrunk (`xl` → `lg`, ≈ ⅓ narrower) and Certifications requises dropdown aligned to the Type de poste Select style (P4-PP1 / P4-PP2)
- "Assigner un agent" renamed to "Affecter un agent" across the schedule (button, modal, action labels) (P4-PG1)
- Copy-mode and simulation banners now center their text with icon and "Désactiver" pinned to the edges (P4-PG2)
- Besoin row switched from count-based (`covered/required`) to time-interval coverage — cell shows remaining gaps (e.g. `14h–22h`) and flips to green "Affecter" once the vacation is fully covered (P4-PG5)
- Agent hours cell is now month-scoped across day/week/month views — contract shown as monthly equivalent (`151.67h` for a 35h weekly), affected hours cumulative for the month, overflow in red (P4-PG6)
- Monthly view replaces colored dots with compact `début-fin` shift labels (e.g. `7-14`, `14h30-22h`), stacked when multiple shifts land on the same day (P4-PG8)

### Fixed

- Résumé du planning showed 0 for Heures totales and Heures sup. on load (hour calculation was locked to a single active-site ref)
- Meal voucher count was scoped to the last-interacted site instead of all visible sites
- Past-date shifts were not editable in any view (click/dropdown/quick-pencil were all gated on `!isPast`); the "Date passée" placeholder replaced the add button on past cells. Edit, customize, copy, delete and add actions now work on past dates (create/paste still trigger the audio alert + confirmation modal).
