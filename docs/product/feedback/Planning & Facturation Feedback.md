# Remarques Planning & Facturation

**Date:** 2026-04-06
**Source:** Client feedback document (PDF)

**Raw assets** (in [`/assets/`](../../assets/)):
- [Remarques Planning et facturation -2 (PDF)](../../assets/Remarques%20Planning%20et%20facturation%20-2.pdf)

## Context

Client review of the Planning module (dashboard, agents, sites, postes, shifts, planning grid) and the Facturation/Billing module (simulation and devis system). Planning feedback covers UX improvements, form cleanup, and significant planning grid enhancements. Billing feedback describes simulation and quote features — most of which are **already implemented** in the current codebase.

---

## A/ Planning

### Tableau de bord (Dashboard)

| # | Issue | Severity |
|---|-------|----------|
| PD1 | Dans les **actions rapides**, ajouter "Nouveau poste" | Feature request |
| PD2 | **Situation planning sur 3 jours** : afficher toutes les vacations d'aujourd'hui et les 2 jours a venir de l'ensemble des sites | Feature request |

---

### 1. Agents

| # | Issue | Severity |
|---|-------|----------|
| PA1 | Ajouter un bouton **"Nouvel agent"** pour ajouter directement depuis la page Planning (sans passer par RH) — l'agent doit apparaitre automatiquement dans le module RH | Feature request |
| PA2 | Dans la ligne d'un agent > Action > Modifier : a la fin de la modification, remplacer le bouton **"Modifier" par "Enregistrer"** | UX fix |

---

### 2. Sites et Postes

| # | Issue | Severity |
|---|-------|----------|
| SP1 | **Supprimer les postes** de la page "Sites et Postes" et garder uniquement Sites | UX restructure |

---

### 3. Postes

| # | Issue | Severity |
|---|-------|----------|
| PP1 | Dans Postes > Actions > Modifier > Horaires : ajouter le **debut de vacation et fin de vacation** | Feature request |
| PP2 | Dans Poste > Nouveau poste > Planning : ajouter **debut de vacation et fin de vacation** | Feature request |
| PP3 | Dans Poste > Nouveau poste > General > Type de poste : ajouter **Agent de Securite, SSIAP 1, SSIAP 2, SSIAP 3, Operateur video, Accueil, Manager, RH, Comptable** | Feature request |
| PP4 | Dans Poste > Nouveau poste : **supprimer "Experience minimum" et "Exigence physique"** | Removal |

---

### 4. Shifts

| # | Issue | Severity |
|---|-------|----------|
| SH1 | Page principale Shifts : **agrandir la taille des noms des sites x2** avec des **couleurs differentes** par site | UX improvement |
| SH2 | Nouveau Shift : **reduire la taille de la fenetre** et renommer **"Standard" → "Modele"** et **"Sur mesure" → "Personnalise"** | Naming + UX |
| SH3 | Nouveau Shift : la liste des sites sur **une seule ligne avec menu deroulant** | UX improvement |
| SH4 | **Duree de pause** : une seule ligne avec menu deroulant de 5 a 60 minutes | UX improvement |
| SH5 | Dans horaire, ajouter la possibilite de creer un **shift avec 2 horaires** (ex: 8h a 12h et 14h a 17h) | Feature request |

---

### 5. Planning (Grid)

| # | Issue | Severity |
|---|-------|----------|
| PG1 | Le bouton **"Assigner un agent"** en **bleu clair (cyan)** comme les autres boutons d'action | UX consistency |
| PG2 | **Affichage mois** : afficher tous les jours du mois sur la meme page | UX improvement |
| PG3 | Permettre d'**affecter des agents sur des dates passees** avec une alerte sonore ("date passee") puis confirmation | Feature request |
| PG4 | Fenetre d'ajout : renommer **"Ajouter un service" → "Ajouter un Shift"** ; dans "Sur mesure" → "Personnaliser ce modele" ajouter la possibilite de creer un shift a **2 horaires** | Naming + Feature |
| PG5 | Shifts deja affectes : ajouter la possibilite de **modifier le shift** inline (ex: changer 8h-14h en 9h-14h pour signer un retard) | Feature request |
| PG6 | Clarifier les statuts en bas du shift affecte : **"Termine", "Absent"** — c'est quoi ? | UX clarification |
| PG7 | **Mode copier** : afficher un message en haut "Mode copier active", ajouter un bouton pour **desactiver le mode copier** | UX improvement |
| PG8 | Au-dessus des lignes agents pour chaque site, ajouter une **ligne de besoin** : afficher le shift requis par poste, qui se reduit au fur et a mesure des affectations | Feature request |
| PG9 | Afficher le **numero de semaine** ("Semaine 01") au-dessus de chaque jeudi | Feature request |
| PG10 | Dans la case agent : afficher le **contrat (151.67h)**, les **heures affectees** (decroissant au fur et a mesure), et le **depassement en rouge** si on depasse le contrat | Feature request |
| PG11 | Ajouter un bouton **export PDF** : planning global, par agent, par site, par client, et tous les sites | Feature request |
| PG12 | En bas du planning : afficher le **detail des majorations** (heures, paniers, conges, arret maladie, formation, etc.) | Feature request |

---

## B/ Facturation

> **Note:** La plupart des fonctionnalites decrites ci-dessous sont **deja implementees** dans le module Facturation actuel. La page Simulation existe avec calcul des majorations, besoins fixes/variables, services additionnels, et conversion en devis (base/complet/detaille). A verifier avec le client si des ecarts existent entre l'implementation actuelle et ses attentes.

| # | Issue | Severity |
|---|-------|----------|
| FA1 | Ajouter le menu **"Simulation"** avant le devis | Already implemented |
| FA2 | Simulation : creer les **besoins du client** (shifts par poste) avec etude globale et majorations (nuit, feries, dimanche, nuit dimanche/feries) | Already implemented |
| FA3 | Besoins **fixes** (ex: lun-sam 6h-22h, dim 6h-14h toute l'annee) et **variables** (ex: juil-aout, certains jours 17h-20h) | Already implemented |
| FA4 | Possibilite d'ajouter d'**autres prestations** a facturer (main courante electronique, ordinateur, portail clients, PTI, geolocalisation) | Already implemented |
| FA5 | Bouton **"Devis"** pour transformer la simulation en devis avec 3 niveaux : **Devis base** (1 ligne par poste), **Devis complet** (avec majorations par poste), **Devis detaille** (jour par jour) | Already implemented |

---

## Summary by Priority

### Already Implemented (Billing)
- **FA1-FA5** — Simulation module with cost breakdown, fixed/variable needs, additional services, and 3-level devis conversion all exist in current codebase

### Naming Changes (Planning)
- **SH2** — "Standard" → "Modele", "Sur mesure" → "Personnalise"
- **PG4** — "Ajouter un service" → "Ajouter un Shift"

### Removals (Planning)
- **SP1** — Remove Postes from "Sites et Postes" page
- **PP4** — Remove "Experience minimum" and "Exigence physique" from poste form

### UX Fixes (Planning)
- **PA2** — "Modifier" → "Enregistrer" button label
- **PG1** — Assign button in cyan
- **PG6** — Clarify "Termine/Absent" statuses
- **PG7** — Copy mode banner + deactivation button
- **SH1** — Larger site names with colors
- **SH3, SH4** — Dropdown UX for site list and pause duration

### Feature Requests (Planning)
- **PD1, PD2** — Dashboard quick actions + 3-day overview
- **PA1** — Add agent from planning (synced to RH)
- **PP1-PP3** — Poste form: vacation hours, post types update
- **SH5, PG4** — Split shift (2 time ranges) support
- **PG2** — Full month view on one page
- **PG3** — Past-date assignment with alert
- **PG5** — Inline shift modification
- **PG8** — Requirement/besoin row per site
- **PG9** — Week number display
- **PG10** — Agent contract hours tracking (contract, assigned, remaining)
- **PG11** — PDF export (multiple scopes)
- **PG12** — Majorations detail at bottom

---

## Links

- [[index|Index]]
- [[features/web/Planning|Planning (Web)]]
- [[features/web/Billing|Billing (Web)]]
- [[features/web/HR|HR]]
