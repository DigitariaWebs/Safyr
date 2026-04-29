# Remarques Main Courante — Round 2

**Date:** 2026-04-15
**Source:** Client feedback document (PDF)

**Raw assets** (in [`/assets/`](../../assets/)):
- [Remarques MAIN COURANTE du 15-04-2026 (PDF)](../../assets/Remarques%20MAIN%20COURANTE%20du%2015-04-2026.pdf)

## Context

Second-round client review of the Main Courante (Digital Logbook) module. Scope of this doc = **only the items present in the 15-04-2026 PDF**. Round 1 items (2026-04-09) not restated here remain tracked in [[Main Courante Feedback|Round 1]]. This round delivers: a dashboard visual reopen, a date filter on Évènements (flagged "Non fait"), two client questions to discuss with Khalil, a navigation rename + reorder (Exports→Rapports, Sécurité to end), and an enrichment of the Fiche d'interpellation (montant, statut paiement, justificatif).

---

## 1. Tableau de bord

| ID   | Ask                                                                | Severity       |
| ---- | ------------------------------------------------------------------ | -------------- |
| MC16 | Améliorer le visuel du tableau de bord — **toujours à améliorer**  | UX improvement |

> Reopen of **MC1** (2026-04-09) — not yet satisfactory.

---

## 2. Évènements

| ID   | Ask                                                                                                                                                     | Severity                                 |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| MC17 | Afficher le **calendrier, la période, le mois, l'année** pour la recherche d'événement — **Non fait**                                                   | Feature request                          |
| MC18 | Nouvel événement : le **site doit être renseigné automatiquement** (site où l'agent a pris son service) — *à vérifier avec Khalil*                      | Client question (not for implementation) |
| MC19 | Nouvel événement : le **nom de l'agent doit s'afficher automatiquement** (identifié via son code d'accès à la main courante) — *à vérifier avec Khalil* | Client question (not for implementation) |

> **MC17** reopens **MC3** (2026-04-09), explicitly flagged "Non fait".
>
> **MC18** / **MC19** — items marked *"à vérifier avec Khalil"* are **client questions, not implementation tasks**. They require a product discussion before any build work. Do not treat as backlog.

---

## 7. Exports → Rapports (Rename + Reorder)

| ID   | Ask                                                              | Severity  |
| ---- | ---------------------------------------------------------------- | --------- |
| MC20 | Renommer **"Exports"** → **"Rapports"**                           | Naming    |
| MC21 | Positionner **Rapports avant Sécurité** dans le menu             | Nav order |

---

## 8. Gestion — Fiche d'interpellation (Enrichment)

| ID   | Ask                                                                                                                                                   | Severity        |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| MC22 | Ajouter le **montant de la dégradation ou du vol**                                                                                                     | Feature request |
| MC23 | Ajouter une case **"Réglé / Non réglé"**                                                                                                               | Feature request |
| MC24 | Permettre de **joindre un fichier** (ex. vol du téléphone : si la personne paie, on joint le ticket de caisse comme justificatif)                     | Feature request |

> Extends **MC15** (2026-04-09) — original ask was montant; 15-04 adds payment status + file attachment.

---

## 9. Sécurité (Nav Reorder)

| ID   | Ask                                             | Severity  |
| ---- | ----------------------------------------------- | --------- |
| MC25 | Déplacer **Sécurité à la fin du menu**          | Nav order |

---

## Implementation Scope

### Build Tasks (8)

| ID   | Section                    | Ask                                                                              |
| ---- | -------------------------- | -------------------------------------------------------------------------------- |
| MC16 | Tableau de bord            | Améliorer visuel (reopen — client not satisfied)                                 |
| MC17 | Évènements                 | Filter bar: calendrier / période / mois / année                                  |
| MC20 | Exports                    | Rename "Exports" → "Rapports"                                                    |
| MC21 | Exports                    | Place Rapports before Sécurité                                                   |
| MC22 | Fiche d'interpellation     | Field: montant dégradation OR vol                                                |
| MC23 | Fiche d'interpellation     | Checkbox: Réglé / Non réglé                                                      |
| MC24 | Fiche d'interpellation     | File upload: justificatif                                                        |
| MC25 | Sécurité                   | Move Sécurité to end of menu                                                     |

### Client Questions (2 — not build)

| ID   | Section    | Question                                                                   |
| ---- | ---------- | -------------------------------------------------------------------------- |
| MC18 | Évènements | Auto-prefill site from active shift? *à vérifier avec Khalil*              |
| MC19 | Évènements | Auto-prefill agent from login code? *à vérifier avec Khalil*               |

---

## Final Menu Order (after MC20 + MC21 + MC25)

```
... (unchanged upper items)
Rapports       ← renamed from Exports, placed before Sécurité
Gestion
Sécurité       ← moved to end
```

MC21 + MC25 together define: Rapports before Sécurité, Sécurité last.

---

## Fiche d'interpellation — Net-New Fields (MC22–MC24)

Added on top of the existing MC15 fields from Round 1:

```
Type              [radio: Vol | Dégradation]
Montant (€)       [number]
Statut paiement   [radio: Réglé | Non réglé]
Justificatif      [file upload — image/pdf]
```

---

## Suggested Implementation Order

1. **Nav rename + reorder** (MC20, MC21, MC25) — ~15 min, site.ts edit.
2. **Fiche d'interpellation fields** (MC22, MC23, MC24) — ~1h, form + upload.
3. **Évènements date filter** (MC17) — ~1h, filter bar component.
4. **Dashboard visual** (MC16) — iterative, needs direction.

---

## Relationship to Round 1 (2026-04-09)

| 15-04 ID | Supersedes / refines                                   |
| -------- | ------------------------------------------------------ |
| MC16     | MC1 (dashboard visual — still pending)                 |
| MC17     | MC3 (calendar filter on Évènements — "Non fait")       |
| MC18     | MC5 (auto-site — now explicit client question)         |
| MC19     | MC6 (auto-agent — now explicit client question)        |
| MC20, MC21 | *(new — Exports rename + nav order)*                 |
| MC22, MC23, MC24 | MC15 (fiche d'interpellation — adds paid + attachment) |
| MC25     | *(new — Sécurité nav position)*                        |

**Not restated in 15-04 PDF** (remain tracked in Round 1): MC0 (nav menu bug), MC2 (events/alertes on dashboard), MC4 (i18n gravité/statut), MC7 (demo data validation), MC8 (taille fenêtre alerte), MC9 (explication Planning & RH), MC10 (explication portails + sync géoloc), MC11 (graphiques Rapports), MC12/MC14 (filtres calendrier Rapports/Export), MC13 (explication Sécurité), MC15 full fiche d'interpellation spec (identité, naissance, adresse, tél, forces de l'ordre, libellé).

---

## Links

- [[index|Index]]
- [[product/client feedback/Main Courante Feedback|Main Courante Feedback (Round 1 — 2026-04-09)]]
- [[features/web/Logbook|Logbook (Web)]]
- [[features/mobile/Main Courante|Main Courante (Mobile)]]
- [[product/specification.en|Specification]]
