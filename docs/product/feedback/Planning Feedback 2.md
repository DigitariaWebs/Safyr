# Remarques Planning — Retour client 2

**Date:** 2026-04-15
**Source:** Client feedback document (PDF)

**Raw assets** (in [`/assets/`](../../assets/)):
- [Remarques Planning-2 (PDF)](../../assets/Remarques%20Planning-2.pdf)

## Context

Second round of client feedback on the Planning module. Covers refinements to Postes, Shifts, and the Planning grid, plus a new Simulation menu request. Several items confirm that previously requested features are still not implemented.

---

## A/ Planning

### 3. Postes

| # | Issue | Severity |
|---|-------|----------|
| P2-PP1 | Dans Postes > Actions > Modifier > cadre Planning : ajouter **debut de vacation** et **fin de vacation** | Feature request |
| P2-PP2 | Dans Poste > Nouveau poste > General > Type de poste : ajouter **Rondier, Agent cynophile, Chef de poste, DI, Autres** | Feature request |
| P2-PP3 | Dans Poste > Nouveau poste > General > **Certifications** : ajouter un menu deroulant multi-selection avec cases a cocher — options : CQP/APS, Carte Pro, SSIAP 1, SSIAP 2, SSIAP 3, SST, H0B0, Autres | Feature request |

---

### 3. Shifts

| # | Issue | Severity |
|---|-------|----------|
| P2-SH1 | Page principale Shifts : agrandir le cadre des **noms des sites** avec des **couleurs differentes** par site — agrandir uniquement dans l'entete/cadre des noms de sites, PAS dans les lignes du tableau (garder taille normale dans le tableau) | UX improvement |
| P2-SH2 | **Duree de pause** : ajouter l'option **"Aucune"** | UX improvement |

---

### 5. Planning (Grid)

| # | Issue | Severity |
|---|-------|----------|
| P2-PG1 | Le bouton **"Assigner un agent"** en bleu clair, comme les autres boutons d'action (Nouvel agent, Nouveau shift, Nouveau poste…) | UX consistency |
| P2-PG2 | **Affichage mois complet** : afficher tous les jours du mois sur la meme page avec les sites (couleur par site) et les agents affectes | UX improvement |
| P2-PG3 | Permettre d'**affecter des agents sur des dates passees** : alerte avec son ("date passee"), puis possibilite de confirmer l'affectation — **non fait** | Feature request |
| P2-PG4 | **Mode copier** : icone copier visible sur tous les jours restants a affecter ; banniere du mode copie en **rouge vif** avec texte en grand format | UX improvement |
| P2-PG5 | Au-dessus des lignes agents pour chaque site, ajouter une **ligne de besoin** : afficher la duree de la vacation (ex. 6h–22h) ; chaque shift affecte est deduit du besoin journalier — **non fait** | Feature request |
| P2-PG6 | Afficher le **numero de semaine** (ex. "Semaine 01") au-dessus de chaque jeudi, avec un petit bouton de la taille du bouton "Semaine" — **non fait** | Feature request |
| P2-PG7 | Dans la case agent : afficher 3 valeurs — **contrat** (ex. 151.67h), **heures affectees** (decremente au fur et a mesure), **depassement en rouge** si contrat depasse — afficher ces 3 chiffres pour chaque agent — **non fait** | Feature request |
| P2-PG8 | En bas du planning : **detail des majorations** complet — heures, paniers, conges, arret maladie, formation, etc. — il manque des elements dans l'implementation actuelle | Feature request |

---

### 6. Simulation

| # | Issue | Severity |
|---|-------|----------|
| P2-SIM1 | Ajouter un menu **"Simulation"** dans la sidebar avant "Parametres" : **doublon exact du menu Planning** (memes pages, meme fonctionnement) pour tester des scenarios sans toucher au planning reel | Feature request |

---

## Summary by Priority

### UX Fixes
- **P2-SH1** — Enlarge site name headers with colors (headers only, not table rows)
- **P2-SH2** — Add "Aucune" to pause duration options
- **P2-PG1** — "Assigner un agent" button light blue
- **P2-PG4** — Copy mode: red banner + large text + copy icon on remaining days

### Feature Requests — Not Yet Implemented
- **P2-PP1** — Vacation start/end fields in poste edit modal (planning section)
- **P2-PP2** — New post types: Rondier, Agent cynophile, Chef de poste, DI, Autres
- **P2-PP3** — Certifications multi-select on poste form
- **P2-PG2** — Full month view with colored site names and agents
- **P2-PG3** — Past-date assignment with audio alert + confirmation *(non fait)*
- **P2-PG5** — Besoin row per site with vacation hours deducted per assignment *(non fait)*
- **P2-PG6** — Week numbers above Thursday columns *(non fait)*
- **P2-PG7** — Agent cell: 3 contract/assigned/remaining numbers *(non fait)*
- **P2-PG8** — Complete majorations detail at bottom (missing elements)
- **P2-SIM1** — Simulation menu as Planning duplicate

---

## Links

- [[index|Index]]
- [[features/web/Planning|Planning (Web)]]
- [[client feedback/Planning & Facturation Feedback|Planning & Facturation Feedback (v1)]]
