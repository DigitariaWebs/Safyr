# Remarques Main Courante — Round 3

**Date:** 2026-04-24
**Source:** Client feedback document (PDF)

**Raw assets** (in [`/assets/`](../../assets/)):
- [Remarques MAIN COURANTE 24_04_2026 (PDF)](../../assets/Remarques%20MAIN%20COURANTE%2024_04_2026.pdf)
- [Google Drive copy](https://drive.google.com/file/d/1oMvDh8RuuNFhb1oBLwm0Wy1L60cWfUFD/view?usp=drive_link)

## Context

Third-round client review of the Main Courante (Digital Logbook) module. Scope of this doc = **only the items present in the 24-04-2026 PDF**. Round 1 (2026-04-09) and Round 2 (2026-04-15) items not restated here remain tracked in [[Main Courante Feedback|Round 1]] / [[Main Courante Feedback 2|Round 2]]. This round is short (3 items) and structural: it reopens the dashboard visual with a concrete direction (more charts, less text), demotes "Planning & RH" out of the top-level menu (renamed and moved into Sécurité / Paramétrage as a configuration rule), and consolidates the Gestion module (merge DI into Fiche d'Interpellation, add a date-range archive view).

---

## 1. Tableau de bord

| ID   | Ask                                                                                              | Severity       |
| ---- | ------------------------------------------------------------------------------------------------ | -------------- |
| MC26 | Améliorer le visuel du tableau de bord — **mettre plus de graphiques que d'écritures (texte)** | UX improvement |

> Reopen of **MC1** (Round 1) and **MC16** (Round 2). Round 3 makes the direction explicit: the dashboard currently leans heavily on text/KPI cards; the client wants visual charts to dominate over written summaries.
>
> **Codebase pointer:** `apps/web/src/app/dashboard/logbook/page.tsx` — current `defaultWidgetConfigs` and KPI widgets (`@/components/logbook/dashboard/LogbookKpiWidgets`) are mostly numeric/text-based. New widgets should bias toward Recharts visualizations (trends over time, severity breakdowns, site comparisons, agent activity heatmaps) instead of text panels.

---

## 2. Planning & RH → Agent affecté (Demote out of top-level nav)

| ID   | Ask                                                                                                    | Severity        |
| ---- | ------------------------------------------------------------------------------------------------------ | --------------- |
| MC27 | Déplacer **Planning & RH** sous **Sécurité / Paramétrage** comme une règle                             | Nav restructure |
| MC28 | Renommer **Planning & RH** → **Agent affecté**                                                          | Naming          |

> Rationale (client): "soulager les menus, garder le minimum mais l'essentiel comme une règle". Planning & RH is a configuration concern, not a daily-use top-level destination; it belongs alongside other rules under Sécurité / Paramétrage.
>
> **Codebase pointer:**
> - Top-nav entry to remove: `apps/web/src/components/layout/LogbookNavigationBar.tsx:36-39` (`label: "Planning & RH"`, `href: /dashboard/logbook/planning-rh`).
> - Page itself stays at `apps/web/src/app/dashboard/logbook/planning-rh/page.tsx` (or moves under a settings route — TBD; see implementation note below).
> - The Sécurité page (`apps/web/src/app/dashboard/logbook/security/page.tsx`) currently exposes encryption / audit / backup / 2FA / RGPD / masking toggles via `mockSecurityConfigs`. It is effectively the Paramétrage area for the module — Agent affecté should be added as a new "rule" panel/section there (or as a child route under Sécurité).
>
> **Implementation note — open question:** does the client want Agent affecté as (a) a tab inside `/dashboard/logbook/security`, (b) a child item under a renamed "Sécurité / Paramétrage" nav group with children, or (c) the existing `/planning-rh` page wholesale relabeled and reachable from Sécurité? Default assumption: (b) — convert Sécurité into a parent with children `[Sécurité, Agent affecté]`, matching the existing `Gestion` / `Portails` parent pattern in `LogbookNavigationBar.tsx`.

---

## 3. Gestion — Fusion DI + Fiche d'Interpellation + Historique

| ID   | Ask                                                                                                                     | Severity         |
| ---- | ----------------------------------------------------------------------------------------------------------------------- | ---------------- |
| MC29 | **Fusionner** la DI (Démarque Inconnue) et la Fiche d'Interpellation — garder uniquement la Fiche d'Interpellation     | Module merge     |
| MC30 | Ajouter un bouton **Historique** permettant de **rechercher par période** (Date de début + Date de fin) les fiches archivées | Feature request  |

> **Rationale (client):** "on répète la même chose, on trouve plus de détaillé dans la fiche d'interpellation". The DI page and the Fiche d'Interpellation page overlap — DI is a strictly less-detailed version of the same record. Keep the richer one and drop the duplicate.
>
> **Codebase pointer:**
> - DI module to remove: `apps/web/src/app/dashboard/logbook/unknown-losses/page.tsx` (634 lines), `apps/web/src/data/logbook-unknown-losses*` data files, and the corresponding nav child `LogbookNavigationBar.tsx:58-62` (`Démarque Inconnue (DI)`).
> - Fiche d'Interpellation module to keep + extend: `apps/web/src/app/dashboard/logbook/interpellation-archives/page.tsx` (1110 lines) — already contains the richer fields, including `montantProduits`, statut paiement (`regle` / `non_regle`), and the form sections from Round 2's MC22–MC24 work.
> - The remaining `Gestion` parent in the nav collapses to a single child (Fiches d'Interpellation). Consider promoting it to a leaf nav item directly (no parent group needed once DI is gone).
> - `Historique` UI: the archives page already has a `DataTable`; MC30 is a date-range filter (Date de début / Date de fin) over `createdAt` / `dateInterpellation`, surfaced behind a clear "Historique" button or section header. Reuse the date-range filter pattern from MC17 (Round 2 Évènements filter) for consistency.
>
> **Migration note:** any existing DI records (mock or real) need a migration path into the Fiche d'Interpellation schema. Categories `Vol` / `Dégradation` / `Perte` from the DI map cleanly onto the existing `type` field of the fiche; `estimatedAmount` → `montantProduits`. Confirm whether DI's `Perte` category needs adding to the fiche `type` enum, which currently covers Vol / Dégradation only (per Round 2).

---

## Implementation Scope

### Build Tasks (5)

| ID   | Section                | Ask                                                                                  |
| ---- | ---------------------- | ------------------------------------------------------------------------------------ |
| MC26 | Tableau de bord        | Re-balance widgets toward charts (Recharts) over text/KPI cards                      |
| MC27 | Navigation             | Remove "Planning & RH" from top-level Logbook nav; relocate under Sécurité / Paramétrage |
| MC28 | Navigation             | Rename "Planning & RH" → "Agent affecté"                                             |
| MC29 | Gestion                | Delete `/unknown-losses` (DI) module; fold any remaining schema deltas into Fiche d'Interpellation |
| MC30 | Fiche d'Interpellation | Add "Historique" view with Date de début / Date de fin range filter                  |

---

## Suggested Implementation Order

1. **Nav restructure** (MC27 + MC28) — ~30 min, edits in `LogbookNavigationBar.tsx` + decision on Sécurité parent/children shape; possibly mount the existing planning-rh page under Sécurité as "Agent affecté".
2. **DI removal + merge** (MC29) — ~1h, delete unknown-losses route + data + nav child, verify no cross-links from dashboard or events pages, add `Perte` to fiche type enum if needed.
3. **Historique date filter** (MC30) — ~1h on top of MC29; reuse MC17 date-range filter component.
4. **Dashboard chart bias** (MC26) — iterative, design-led; needs widget catalog review and likely 2–3 new Recharts widgets (trend line, severity donut, site bar) replacing existing text widgets in `defaultWidgetConfigs`.

---

## Relationship to Prior Rounds

| 24-04 ID | Supersedes / refines                                              |
| -------- | ----------------------------------------------------------------- |
| MC26     | MC1 (R1), MC16 (R2) — dashboard visual; now explicit "more charts, less text" |
| MC27     | *(new — demote Planning & RH from top nav)*                       |
| MC28     | *(new — rename Planning & RH → Agent affecté)*                    |
| MC29     | *(new — DI / Fiche d'Interpellation merge)*                       |
| MC30     | Extends MC15 (R1) + MC22–MC24 (R2) — adds archive/historique view with period filter |

**Open from prior rounds, not restated in 24-04 PDF** (still tracked):
- Round 1: MC0 (nav single-line bug), MC2 (events/alertes on dashboard), MC4 (i18n gravité/statut), MC7 (demo data validation), MC8 (taille fenêtre alerte), MC9 / MC10 / MC13 (explanation pages — Planning&RH, Portails, Sécurité), MC11 (graphiques Rapports), MC12 / MC14 (filtres calendrier Rapports/Export).
- Round 2: MC17 (date filter Évènements — "Non fait"), MC18 / MC19 (questions à vérifier avec Khalil), MC20 / MC21 / MC25 (nav rename + reorder Rapports/Sécurité), MC22 / MC23 / MC24 (Fiche d'Interpellation enrichment — montant / paiement / justificatif).

> Note on overlap: MC9 (Round 1, "explication du Planning & RH") becomes partially moot if MC27 demotes the page out of the top nav and MC28 renames it — the explanation ask should be re-scoped to the new "Agent affecté" rule under Sécurité.

---

## Links

- [[index|Index]]
- [[product/client feedback/Main Courante Feedback|Main Courante Feedback (Round 1 — 2026-04-09)]]
- [[product/client feedback/Main Courante Feedback 2|Main Courante Feedback 2 (Round 2 — 2026-04-15)]]
- [[features/web/Logbook|Logbook (Web)]]
- [[features/mobile/Main Courante|Main Courante (Mobile)]]
- [[product/specification.en|Specification]]
