# Remarques Planning — Retour client 4

**Date:** 2026-04-19
**Source:** Client feedback document (PDF)

**Raw assets** (in [`/assets/`](../../assets/)):
- [Remarques Planning le 19 avril 2026 (PDF)](../../assets/Remarques%20Planning%20le%2019%20avril%202026.pdf)

## Context

Fourth round of feedback on the Planning module. Only new items listed below; restated items cross-referenced with earlier rounds and marked **(rappel)**.

---

## A/ Planning

### 1. Postes

| # | Issue | Severity |
|---|-------|----------|
| P4-PP1 | **Reduire d'1/3** la taille de la fenetre **Nouveau poste** | UX improvement |
| P4-PP2 | **Reduire** le menu deroulant **Certifications requises** pour qu'il corresponde au style du menu **Type de poste** | UX consistency |

---

### 2. Planning (Grid)

| # | Issue | Severity |
|---|-------|----------|
| P4-PG1 | **Renommer** le bouton **"Assigner un agent"** en **"Affecter un agent"** | Copy change |
| P4-PG2 | **Centrer** le texte des bannieres superieures indiquant **"mode copie active"** et **"mode simulation active"** | UX polish |
| P4-PG3 | Cadre **Resume / Detail** (gauche du planning) : en **vue semaine**, afficher la semaine complete **lundi → dimanche**. Actuellement le **dimanche ne s'affiche pas** | Bug |
| P4-PG4 | Cadre **Resume / Detail** : afficher **H normale, H de nuit, H dimanche, H ferie**. **Masquer** les categories a zero (ex. si 0 H ferie, ne pas l'afficher dans le raccourci) | Feature request |
| P4-PG5 | **Ligne de besoin** par site (rappel [[client feedback/Planning Feedback 3\|P3-PG6]] / [[client feedback/Planning Feedback 2\|P2-PG5]]) — precision : quand le besoin est **entierement couvert**, afficher **"Affecter"** en **vert** dans la case besoin | Feature request (rappel + detail) |
| P4-PG6 | Case agent : contrat (151.67h) + heures affectees + depassement en rouge — **doit aussi s'afficher en vue semaine ET vue journee** (rappel [[client feedback/Planning Feedback 3\|P3-PG8]] / [[client feedback/Planning Feedback 2\|P2-PG7]]) | Feature request (rappel + detail) |
| P4-PG7 | **Vue semaine** : ajouter une **barre de defilement** sous le planning pour parcourir le mois complet **semaine par semaine** | Feature request |
| P4-PG8 | **Vue mois** : les **points** ne conviennent pas. Remplacer par l'**heure de debut et fin** du shift (ex. `7-14`), meme en petit | UX improvement |

---

### 3. Simulation

| # | Issue | Severity |
|---|-------|----------|
| P4-SIM1 | Le mode simulation doit **fonctionner exactement** comme le planning, mais les **modifications restent uniquement dans simulation** et **ne doivent pas modifier** le planning officiel (rappel [[client feedback/Planning Feedback 3\|P3-SIM1]] / [[client feedback/Planning Feedback 2\|P2-SIM1]]) | Feature request (rappel) |
| P4-SIM2 | Menu **Simulation** : appliquer un **arriere-plan different** du menu Planning pour eviter toute confusion visuelle entre les deux vues (message client, 2026-04-21) | UX improvement |

---

## Summary by Priority

### UX Fixes (new)
- **P4-PP1** — Shrink "Nouveau poste" modal by 1/3
- **P4-PP2** — Shrink "Certifications requises" dropdown to match "Type de poste"
- **P4-PG1** — Rename "Assigner un agent" → "Affecter un agent"
- **P4-PG2** — Center copy-mode / simulation-mode banner text
- **P4-PG8** — Month view: replace dots with `start-end` shift text

### Bugs (new)
- **P4-PG3** — Week-view summary omits Sunday

### Feature Requests (new)
- **P4-PG4** — Summary shows H normale / nuit / dimanche / ferie, hide zero categories
- **P4-PG7** — Week-view scrollbar to navigate month week-by-week

### UX Fixes (new, client message)
- **P4-SIM2** — Simulation menu: different background vs Planning menu

### Restated / Still Not Implemented
- **P4-PG5** — Besoin row with deducted vacation + green "Affecter" at full coverage (rappel P3-PG6 / P2-PG5)
- **P4-PG6** — Agent cell 3-values display extended to week + day views (rappel P3-PG8 / P2-PG7)
- **P4-SIM1** — Simulation isolated from official planning (rappel P3-SIM1 / P2-SIM1)

---

## Links

- [[index|Index]]
- [[features/web/Planning|Planning (Web)]]
- [[client feedback/Planning Feedback 3|Planning Feedback 3]]
- [[client feedback/Planning Feedback 2|Planning Feedback 2]]
- [[client feedback/Planning & Facturation Feedback|Planning & Facturation Feedback (v1)]]
