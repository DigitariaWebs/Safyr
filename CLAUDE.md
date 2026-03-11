# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Safyr is a monorepo containing web and mobile applications for managing private security companies. It unifies HR, payroll, accounting, billing, banking, planning, geolocation, inventory, OCR, and digital activity logs.

- **web/**: Next.js 16 web application (App Router)
- **mobile/**: Expo React Native mobile application

## Common Commands

### Web Application
```bash
cd web
bun dev          # Start development server
bun build        # Production build
bun start        # Start production server
bun lint         # Run ESLint
bun format       # Format code with Prettier
bun test         # Type check with tsc
bun prune        # Remove unused code with knip
```

### Mobile Application
```bash
cd mobile
bun start        # Start Expo dev server
bun android      # Run on Android
bun ios          # Run on iOS
bun build        # Build for production
```

### Root
```bash
bun install      # Install all workspaces
```

## Architecture

### Web App Structure (`web/src/`)
- **app/**: Next.js App Router pages. Routes under `(public)/` are marketing pages, `dashboard/` contains authenticated app pages, `(auth)/` contains login/register
- **components/**: Reusable UI components organized by feature (layout, sections, ui)
- **config/**: Site-wide configuration (site.ts, assets.ts)
- **contexts/**: React contexts (SidebarContext)
- **hooks/**: Custom React hooks
- **lib/**: Utilities including stores (Zustand), utils
- **services/**: API/service integrations

### State Management
- **Zustand** for UI state (sidebar, modals)
- **Redux Toolkit** for complex application state
- **React Context** for theme and other global providers

### UI Stack
- **Tailwind CSS 4** for styling
- **Radix UI** for accessible component primitives
- **Framer Motion** and **Motion** for animations
- **Lucide React** for icons

### Mobile App Structure (`mobile/src/`)
- **app/**: Expo Router file-based routing with `(auth)` and `(app)` route groups
- **components/**: UI components (ui/, geolocation/)
- **features/**: Feature modules (auth, geolocation, mainCourante, notifications, payroll, profile, schedule, timeoff)
- **theme/**: Theme configuration (colors, typography, spacing)
- **lib/**: Utilities (cn.ts, utils.ts)

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
