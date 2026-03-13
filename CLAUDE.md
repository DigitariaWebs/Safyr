# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Safyr is a monorepo containing web and mobile applications for managing private security companies. It unifies HR, payroll, accounting, billing, banking, planning, geolocation, inventory, OCR, and digital activity logs.

**All user-facing content is in French.** The app targets the French private security industry — regulatory references include CNAPS, URSSAF, DSN, Légifrance, SSIAP, and French collective agreements.

- **web/**: Next.js 16 web application (App Router)
- **mobile/**: Expo React Native mobile application

## Common Commands

### Root (Turborepo — runs across all workspaces)
```bash
bun install      # Install all workspaces
bun dev          # Start all dev servers concurrently
bun build        # Build all packages
bun lint         # Lint all packages
```

### Web Application
```bash
cd web
bun dev          # Start development server
bun build        # Production build
bun start        # Start production server
bun lint         # Run ESLint
bun format       # Format code with Prettier
bun test         # Type check with tsc --noEmit
bun prune        # Remove unused code with knip
```

### Mobile Application
```bash
cd mobile
bun start        # Start Expo dev server
bun android      # Run on Android (expo run:android)
bun ios          # Run on iOS (expo run:ios)
bun lint         # Run ESLint via expo lint
```

## Architecture

### Web App Structure (`web/src/`)
- **app/**: Next.js App Router pages. Routes under `(public)/` are marketing pages, `dashboard/` contains authenticated app pages, `(auth)/` contains login/register
- **app/dashboard/**: Module routes — `hr/`, `payroll/`, `billing/`, `accounting/`, `banking/`, `planning/`, `geolocation/`, `logbook/`, `stock/`, `ocr/`
- **components/**: Reusable UI components organized by feature (layout, sections, ui)
- **config/**: Site-wide configuration (site.ts, assets.ts)
- **contexts/**: `SidebarContext`, `NavigationContext`, `AgendaContext`, `SendEmailContext`, `LiensUtilesContext`
- **hooks/**: Custom React hooks
- **lib/stores/**: Zustand stores — `uiStore.ts`, `planningSettingsStore.ts`
- **lib/**: `utils.ts` (cn helper), `payroll-bulletin-pdf.ts` (jsPDF payslip generation), `types.d.ts`
- **services/**: API/service integrations

### State Management
- **Zustand** for UI state (sidebar, modals)
- **Redux Toolkit** for complex application state
- **React Context** for theme and other global providers

### UI Stack
- **Tailwind CSS 4** for styling (web); **NativeWind v4** + Tailwind CSS v3 (mobile)
- **Radix UI** for accessible component primitives
- **Framer Motion** / **Motion** for animations
- **Lucide React** for icons
- **TanStack React Table v8** for data tables
- **dnd-kit** for drag-and-drop
- **Recharts v3** for charts/graphs
- **jsPDF + jspdf-autotable** for PDF generation
- **Zod v4** for schema validation
- **cmdk** for the command palette
- **Mapbox** (`@rnmapbox/maps`) for geolocation maps (mobile)

### Mobile App Structure (`mobile/src/`)
- **app/**: Expo Router file-based routing with `(auth)` and `(app)` route groups
- **components/**: UI components (ui/, geolocation/)
- **features/**: `auth`, `geolocation`, `mainCourante` (digital logbook), `notifications`, `payroll`, `profile`, `schedule`, `timeoff`
- **theme/**: Theme configuration (colors, typography, spacing); uses Montserrat font
- **lib/**: Utilities (cn.ts, utils.ts)
- Storage: `AsyncStorage` for general data, `expo-secure-store` for sensitive tokens

## Design Patterns

### Component Organization
- UI components in `components/ui/` using Radix primitives with CVA (class-variance-authority)
- Page layouts in `components/layout/`
- Section components in `components/sections/`

### Configuration
- Site content in `web/src/config/site.ts` — all copy, labels, nav items, solutions defined here
- Solution pages need `disabled: boolean` field in config items

### Styling
- Uses CSS variables with Tailwind 4
- Dark theme with slate/cyan accent colors (#0f172a background, #22d3ee accent)
- Utility function `cn()` from `lib/utils` for className merging

## Project Management

### Vibe Kanban Project ID
```
ef2f5d47-2b1b-4881-9367-83303d9506fc
```
Use this ID when querying the vibe_kanban MCP for project-specific operations.
