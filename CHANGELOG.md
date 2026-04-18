# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

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

### Changed

- Extracted schedule page into `schedule/_components/` (view components, modals, filter bar, utilities) — page.tsx reduced from 4717 → ~2900 lines
- Shared `playAlertBeep` helper extracted to `lib/audio-alerts.ts`
- Contract hours interpreted as weekly reference and pro-rated across each view's visible period
- Shift template popover ordering: needed postes first, then site templates
- Migrate postes form from `useState` to `@tanstack/react-form` with per-field bindings
- Unify break duration control as `Select` (0/15/30/45/60 min) in postes and shifts pages
- Restyle site group labels in postes & shifts tables as colored badges instead of full-row tinted backgrounds

### Fixed

- Résumé du planning showed 0 for Heures totales and Heures sup. on load (hour calculation was locked to a single active-site ref)
- Meal voucher count was scoped to the last-interacted site instead of all visible sites
- Past-date shifts were not editable in any view (click/dropdown/quick-pencil were all gated on `!isPast`); the "Date passée" placeholder replaced the add button on past cells. Edit, customize, copy, delete and add actions now work on past dates (create/paste still trigger the audio alert + confirmation modal).
