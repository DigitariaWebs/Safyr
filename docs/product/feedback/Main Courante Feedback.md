# Remarques Main Courante

**Date:** 2026-04-09
**Source:** Client feedback document (PDF)

**Raw assets** (in [`/assets/`](../../assets/)):
- [Remarques MAIN COURANTE (PDF)](../../assets/Remarques%20MAIN%20COURANTE.pdf)

## Context

Client review of the Main Courante (Digital Logbook) module covering navigation, dashboard, events, validation, alerts, portals, reports, security, exports, and interpellation management. Feedback focuses on UX improvements (date filters, French translations), auto-population of agent/site context, and richer report/export pages. Several items are requests for clarification on existing features.

---

## General Navigation

| # | Issue | Severity |
|---|-------|----------|
| MC0 | Le menu ne s'affiche pas sur une seule ligne — probleme d'affichage de la navigation | Bug |

---

## 1. Tableau de bord (Dashboard)

| # | Issue | Severity |
|---|-------|----------|
| MC1 | Ameliorer le visuel du tableau de bord | UX improvement |
| MC2 | A partir du tableau de bord, pouvoir voir les **evenements et les alertes** directement | Feature request |

---

## 2. Evenements

| # | Issue | Severity |
|---|-------|----------|
| MC3 | Afficher le **calendrier, la periode, le mois, l'annee** pour la recherche d'evenements | Feature request |
| MC4 | **Traduire en francais** les elements de gravite et de statut | Bug / i18n |
| MC5 | Nouvel evenement : le **site doit etre renseigne automatiquement** (site ou l'agent a pris son service) — l'agent ne doit pas avoir a le choisir | UX improvement |
| MC6 | Nouvel evenement : le **nom de l'agent doit s'afficher automatiquement** puisqu'il est identifie par son code d'acces a la main courante | UX improvement |

---

## 3. Validation

| # | Issue | Severity |
|---|-------|----------|
| MC7 | La page est vide — afficher un **exemple d'evenement a valider** pour montrer le fonctionnement | UX / Demo data |

---

## 4. Notifications et alertes

| # | Issue | Severity |
|---|-------|----------|
| MC8 | **Augmenter la taille de la fenetre** quand on clique sur une alerte | UX improvement |

---

## 5. Planning et RH

| # | Issue | Severity |
|---|-------|----------|
| MC9 | Client demande une **explication du fonctionnement** de cette page | Documentation / Onboarding |

---

## 6. Portails

| # | Issue | Severity |
|---|-------|----------|
| MC10 | Revoir les **explications des portails** et la **synchronisation du portail agent avec la geolocalisation** | Documentation / UX |

---

## 7. Rapports

| # | Issue | Severity |
|---|-------|----------|
| MC11 | Ameliorer la page des rapports avec des **graphiques** | Feature request |
| MC12 | Afficher le **calendrier, la periode, le mois, l'annee** pour la recherche d'evenements | Feature request |

---

## 8. Securite

| # | Issue | Severity |
|---|-------|----------|
| MC13 | Client demande une **explication de ce menu** | Documentation / Onboarding |

---

## 9. Export

| # | Issue | Severity |
|---|-------|----------|
| MC14 | Ajouter un **calendrier, la periode, le mois, l'annee** pour la recherche d'evenements a exporter | Feature request |

---

## 10. Gestion — Fiche d'interpellation

| # | Issue | Severity |
|---|-------|----------|
| MC15 | La fiche d'interpellation doit contenir : **date, heure, site, nom et prenom, date et lieu de naissance, adresse, numero de telephone** de la personne interpellee, case si **appel des forces de l'ordre**, **libelle**, **montant des produits** (vol) ou **montant de la degradation** | Feature request |

---

## Summary by Priority

### Bugs / i18n
- **MC0** — Navigation menu ne s'affiche pas sur une seule ligne
- **MC4** — Gravite et statut non traduits en francais

### UX Improvements
- **MC1** — Visuel du tableau de bord a ameliorer
- **MC5** — Auto-population du site lors de la saisie d'un evenement
- **MC6** — Auto-population de l'agent lors de la saisie d'un evenement
- **MC8** — Taille de la fenetre d'alerte trop petite

### Demo Data / Onboarding
- **MC7** — Page validation vide, besoin d'un exemple
- **MC9** — Explication de la page Planning et RH demandee
- **MC10** — Explication des portails et synchronisation geolocalisation
- **MC13** — Explication du menu Securite demandee

### Feature Requests
- **MC2** — Evenements et alertes visibles depuis le dashboard
- **MC3, MC12, MC14** — Filtres calendrier/periode/mois/annee sur Evenements, Rapports, et Export
- **MC11** — Graphiques dans la page Rapports
- **MC15** — Fiche d'interpellation enrichie (identite complete, forces de l'ordre, montants)

---

## Links

- [[index|Index]]
- [[features/web/Logbook|Logbook (Web)]]
- [[features/mobile/Main Courante|Main Courante (Mobile)]]
- [[product/specification.en|Specification]]
