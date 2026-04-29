# Remarques Géolocalisation

**Date:** 2026-04-06
**Source:** Client feedback document (PDF)

**Raw assets** (in [`/assets/`](../../assets/)):
- [Remarques Géolocalisation (PDF)](../../assets/Remarques%20G%C3%A9olocalisation.pdf)

## Context

Client review of the Geolocation module covering the dashboard, live tracking, zones, presence monitoring, patrol rounds, and a request for a new History section. Includes annotated screenshots of expected UI behavior.

---

## 1. Tableau de bord (Dashboard)

| # | Issue | Severity |
|---|-------|----------|
| D1 | Ajouter un bouton **"Personnaliser"** pour choisir les KPIs affichés — comme dans le tableau de bord RH. Idéalement, ajouter ce bouton à **tous les tableaux de bord de chaque module** | Feature request |

---

## 2. Live Tracking

| # | Issue | Severity |
|---|-------|----------|
| LT1 | Dans la fenêtre de détail d'un agent, ajouter **l'heure de début et l'heure de fin de vacation** | Feature request |

---

## 3. Zones Géo-fencées

| #   | Issue                                                                                              | Severity         |
| --- | -------------------------------------------------------------------------------------------------- | ---------------- |
| Z1  | Renommer **"Zones Géo-fencées"** → **"Zone Géolocalisée"**                                         | Naming           |
| Z2  | Revoir l'utilité de ce menu avec Khalil — décision à prendre lors du meeting (garder ou supprimer) | Decision pending |

---

## 4. Contrôle Présence → "Pointage"

| # | Issue | Severity |
|---|-------|----------|
| P1 | Renommer **"Contrôle présence"** → **"Pointage"** | Naming |
| P2 | Mettre en place le **rapprochement des heures** entre le planning et la présence géolocalisée pour vérifier les heures réalisées exactes | Feature request |
| P3 | Mettre en place un **suivi des heures** pour chaque agent | Feature request |

---

## 5. Rondes (Patrols)

| # | Issue | Severity |
|---|-------|----------|
| R1 | Ajouter dans l'itinéraire un bouton **"Nouvel itinéraire"**, et dans nouvel itinéraire un bouton **"Nouveau point"** — pour créer des rondes à la demande d'un client (ex. ronde technique à 2h00 pour les locaux techniques) | Feature request |
| R2 | Quand on clique sur **ronde en cours** puis une ronde, afficher tous les **points de contrôle au fur et à mesure** — si un point n'est pas contrôlé ou s'il y a un incident, possibilité de **rédiger un commentaire** | Feature request |
| R3 | Quand on clique sur un agent, la liste des points de ronde s'affiche — remplacer **"Scanner"** par **"Valider"** | Naming |
| R4 | Pendant la ronde, afficher une **barre de progression** (ex. 3/8 points validés) | Feature request |
| R5 | **Transférer l'historique des rondes** vers un nouveau menu "Historique" | UX restructure |

---

## 6. Historique (New Section)

| # | Issue | Severity |
|---|-------|----------|
| H1 | Créer un nouveau menu **"Historique"** — afficher toutes les rondes avec filtrage par **année, mois, sites, clients** | Feature request |
| H2 | Filtrer les rondes par statut : **validées, incomplètes, incident** (ajouter "incident" aux filtres existants "tous", "terminée", "incomplète") | Feature request |
| H3 | Dans le détail d'une ronde historique : afficher **tous les points de contrôle avec incidents** et commentaires sur les points non validés / incidents | Feature request |
| H4 | En bas du détail de la ronde : bouton **"Générer rapport"** et bouton **"Envoyer rapport par mail"** au manager / client | Feature request |
| H5 | Sur un point avec anomalie/incident : afficher le badge **"Incident"** — au clic, ouvrir une fenêtre pour **noter l'observation**, voir la **photo/vidéo**, et **envoyer au responsable ou client** | Feature request |

---

## Summary by Priority

### Naming Changes
- **Z1** — "Zones Géo-fencées" → "Zone Géolocalisée"
- **P1** — "Contrôle présence" → "Pointage"
- **R3** — "Scanner" → "Valider"

### Decision Pending
- **Z2** — Garder ou supprimer le menu Zones (à décider en meeting)

### Feature Requests
- **D1** — Bouton "Personnaliser" les KPIs sur tous les dashboards
- **LT1** — Heures de vacation dans le détail agent (live tracking)
- **P2/P3** — Rapprochement planning/présence + suivi des heures par agent
- **R1** — Création d'itinéraires et points à la demande
- **R2** — Commentaires sur les points de contrôle non validés / incidents
- **R4** — Barre de progression des rondes
- **H1-H5** — Nouveau menu "Historique" avec filtres, détail, rapport, et gestion des incidents

---

## Links

- [[index|Index]]
- [[features/web/Geolocation|Geolocation (Web)]]
- [[features/mobile/Geolocation|Geolocation (Mobile)]]
- [[features/web/Planning|Planning]]
- [[features/web/HR|HR]]
