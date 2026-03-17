# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Safyr is a monorepo containing web and mobile applications for managing private security companies. It unifies HR, payroll, accounting, billing, banking, planning, geolocation, inventory, OCR, and digital activity logs.

**All user-facing content is in French.** The app targets the French private security industry — regulatory references include CNAPS, URSSAF, DSN, Légifrance, SSIAP, and French collective agreements.

- **web/**: Next.js 16 web application (App Router), package `@safyr/web`
- **mobile/**: Expo React Native mobile application, package `@safyr/mobile`

## Common Commands

### Root (Turborepo — runs across all workspaces)
```bash
bun install          # Install all workspaces
bun dev              # Start all dev servers concurrently
bun build            # Build all packages (gates on lint, typecheck, format:check)
bun lint             # Lint all packages
bun typecheck        # Type check all packages
bun format           # Format all packages
bun format:check     # Check formatting without writing
```

### Web Application (`--filter=@safyr/web`)
```bash
bun run --filter=@safyr/web dev          # Start development server
bun run --filter=@safyr/web build        # Production build
bun run --filter=@safyr/web start        # Start production server
bun run --filter=@safyr/web lint         # Run ESLint
bun run --filter=@safyr/web format       # Format code with Prettier
bun run --filter=@safyr/web test         # Type check with tsc --noEmit
bun run --filter=@safyr/web prune        # Remove unused code with knip
```

### Mobile Application (`--filter=@safyr/mobile`)
```bash
bun run --filter=@safyr/mobile start        # Start Expo dev server
bun run --filter=@safyr/mobile android      # Run on Android (expo run:android)
bun run --filter=@safyr/mobile ios          # Run on iOS (expo run:ios)
bun run --filter=@safyr/mobile lint         # Run ESLint via expo lint
```

## Environment Variables

- **Web**: Copy `web/.env.example` to `web/.env.local`. Required: `NEXT_PUBLIC_MAPBOX_TOKEN` (Mapbox GL for live geolocation map).

## Architecture

### Web App Structure (`web/src/`)
- **app/**: Next.js App Router. `(public)/` = marketing pages, `dashboard/` = authenticated app, `(auth)/` = login/register
- **app/dashboard/**: Module routes — `hr/`, `payroll/`, `billing/`, `accounting/`, `banking/`, `planning/`, `geolocation/`, `logbook/`, `stock/`, `ocr/`
- **components/**: Organized by domain — `ui/`, `layout/`, `sections/`, `modals/`, `geolocation/`, `employees/`, `logbook/`, `payroll/`
- **config/**: Site-wide configuration (`site.ts` defines all copy, labels, nav items, solutions; `assets.ts`)
- **contexts/**: `SendEmailContext`
- **lib/stores/**: Zustand stores with `persist` middleware — `uiStore.ts` (sidebar, navigation), `agendaStore.ts`, `liensUtilesStore.ts`, `dashboardConfigStore.ts`, `planningSettingsStore.ts`
- **lib/**: `utils.ts` (cn helper), `payroll-bulletin-pdf.ts` (jsPDF payslip generation), `types.d.ts`
- **services/**: API/service integrations
- **data/**: Mock data files for geolocation, presence, zones

### State Management
- **Zustand** for all UI and feature state (stores use `persist` middleware with `partialize` for selective localStorage persistence)
- **React Context** for email sending and theme providers
- Pattern: use Zustand selectors (`useStore((s) => s.field)`) to avoid unnecessary re-renders

### Mobile App Structure (`mobile/src/`)
- **app/**: Expo Router file-based routing with `(auth)` and `(app)` route groups
- **components/**: `ui/` (shared primitives), `geolocation/` (MapView)
- **features/**: `auth`, `geolocation` (agent tracking, work zone monitoring), `mainCourante` (digital logbook), `notifications`, `payroll`, `profile`, `schedule`, `timeoff`
- **theme/**: Colors (HSL-to-hex), typography, spacing, animations; uses Montserrat font
- **lib/**: Utilities (`cn.ts`, `utils.ts`)
- Storage: `AsyncStorage` for general data, `expo-secure-store` for sensitive tokens

### UI Stack
- **Tailwind CSS 4** for styling (web); **NativeWind v4** + Tailwind CSS v3 (mobile)
- **Radix UI** primitives with **CVA** (`class-variance-authority`) for component variants
- **Framer Motion** / **Motion** for animations
- **Lucide React** for icons
- **TanStack React Table v8** for data tables
- **dnd-kit** for drag-and-drop
- **Recharts v3** for charts/graphs
- **jsPDF + jspdf-autotable** for PDF generation
- **Zod v4** for schema validation
- **cmdk** for the command palette
- **Mapbox** (`react-map-gl` on web, `@rnmapbox/maps` on mobile) for geolocation maps

### Build Pipeline (Turborepo)
- `build` depends on `lint`, `typecheck`, and `format:check` — all must pass before build succeeds
- Web uses React Compiler (`reactCompiler: true` in `next.config.ts`)
- TypeScript path alias: `@/*` → `src/*` in both apps

### Worktrunk Hooks (`.config/wt.toml`)
- **post-create**: `bun install` (auto-installs deps in new worktrees)
- **pre-commit**: gates on `lint`, `typecheck`, `format:check`
- **pre-merge**: gates on full `bun run build`

## Design Patterns

### Component Organization
- UI components in `components/ui/` using Radix primitives with CVA variants
- Solution pages need `disabled: boolean` field in `web/src/config/site.ts`

### Styling
- Uses CSS variables with Tailwind 4 (web) and HSL-to-hex conversion (mobile)
- Dark theme with slate/cyan accent colors (`#0f172a` background, `#22d3ee` accent)
- `cn()` from `lib/utils` for className merging (both web and mobile)

### React Patterns
- Prefer setState-during-render over `useEffect` for derived/reset state from props (official React recommendation)
- Zustand stores use `partialize` to persist only non-transient state