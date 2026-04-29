# Remarques Géolocalisation — Round 2

**Date:** 2026-04-15
**Source:** Client feedback document (PDF)

**Raw assets** (in [`/assets/`](../../assets/)):
- [Remarques Géolocalisation 15-04-2026 (PDF)](../../assets/Remarques%20G%C3%A9olocalisation%2015-04-2026.pdf)

## Context

Second-round client review of the Geolocation module. Scope of this doc = **only the items present in the 15-04-2026 PDF**. Round 1 items (2026-04-06) not restated here remain tracked in [[Geolocation Feedback|Round 1]]. This round focuses on four sections: the map detail panel (agrandir la fenêtre), the Rondes naming & creation flow (Itinéraire → Ronde, gating of "Nouveau point"), a rework of the Historique page (date range + colored statuses + per-point hours + comments + incident handling), and charts on the Rapport page.

---

## Carte (Live Tracking)

| ID | Ask                                                               | Severity       |
| -- | ----------------------------------------------------------------- | -------------- |
| M1 | Agrandir un peu la **fenêtre qui s'affiche à gauche de la carte** | UX improvement |

---

## 5. Rondes (Renommage + Flux de création)

| ID | Ask                                                                                                                                                             | Severity |
| -- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| R6 | Remplacer **« Itinéraire »** → **« Ronde »**                                                                                                                    | Naming   |
| R7 | Remplacer **« Nouvel itinéraire »** → **« Nouvelle Ronde »**                                                                                                    | Naming   |
| R8 | Le bouton **« Nouveau point »** n'est activé qu'après création d'une **Nouvelle Ronde** (le bouton est conditionné à la présence d'une ronde active)            | UX flow  |

> Refines **R1** (2026-04-06) — même intention "créer rondes à la demande", mais avec la terminologie corrigée (Ronde, pas Itinéraire) et un conditionnement explicite entre les deux boutons.

---

## 6. Historique (Refonte)

### Filtres

| ID  | Ask                                                                                                                                                          | Severity       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| H6  | Supprimer **« toutes années »** et **« tous mois »** — les remplacer par **Date début** et **Date fin** (comme dans la page Rapport)                          | UX improvement |
| H7  | Enlever **« toutes »** et **« tous »** des filtres — **garder uniquement Sites et Clients**                                                                   | UX improvement |
| H8  | Donner des **couleurs distinctes** pour les statuts **Toutes / Complètes / Incomplètes / Incident** — possibilité de les regrouper dans un **menu déroulant** | UX improvement |

### Détail d'une ronde

| ID  | Ask                                                                                                                                        | Severity        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------- |
| H9  | Ajouter l'**heure devant chaque point de contrôle** (en plus de la liste déjà en place)                                                    | Feature request |
| H10 | Pour un point **non validé** ou un point **d'incident** : permettre de **voir le commentaire** associé                                     | Feature request |

### Gestion des incidents

| ID  | Ask                                                                                                                                                                                                                                                                        | Severity        |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| H11 | Sur un point avec anomalie/incident (ex. *Point N°3 — porte hors service*), afficher le badge **« Incident »** sur ce point — au clic, ouvrir une fenêtre pour **noter l'observation**, voir la **photo/vidéo**, et bouton **« Envoyer au responsable ou client »**      | Feature request |

> **H11** restates **H5** (2026-04-06) — toujours ouvert.
> **H9 / H10** refine **H3** (2026-04-06).
> **H6 / H7 / H8** supersede **H1 / H2** (2026-04-06) — plage de dates au lieu de année/mois, statuts colorés.

---

## 7. Rapport

| ID  | Ask                                                                                                | Severity        |
| --- | -------------------------------------------------------------------------------------------------- | --------------- |
| RP1 | Améliorer la page avec des **graphiques histogramme + secteur (camembert)** avec des **couleurs** | Feature request |

---

## Implementation Scope

### Build Tasks (10)

| ID  | Section                     | Ask                                                                     |
| --- | --------------------------- | ----------------------------------------------------------------------- |
| M1  | Carte (Live Tracking)       | Agrandir la fenêtre de détail à gauche de la carte                      |
| R6  | Rondes                      | Renommer « Itinéraire » → « Ronde »                                     |
| R7  | Rondes                      | Renommer « Nouvel itinéraire » → « Nouvelle Ronde »                     |
| R8  | Rondes                      | Conditionner « Nouveau point » à l'existence d'une ronde active         |
| H6  | Historique — Filtres        | Remplacer année/mois par Date début + Date fin                          |
| H7  | Historique — Filtres        | Retirer « toutes » / « tous », garder Sites et Clients                  |
| H8  | Historique — Filtres        | Couleurs par statut + menu déroulant                                    |
| H9  | Historique — Détail         | Heure devant chaque point de contrôle                                   |
| H10 | Historique — Détail         | Voir le commentaire sur les points non validés / incidents              |
| H11 | Historique — Incidents      | Badge « Incident » cliquable → observation + photo/vidéo + envoi        |
| RP1 | Rapport                     | Graphiques histogramme + secteur avec couleurs                          |

*(Total 11 — M1 + R6-R8 + H6-H11 + RP1.)*

---

## Suggested Implementation Order

1. **Renommages Rondes** (R6, R7) + **conditionnement Nouveau point** (R8) — ~30 min, copy + UI state.
2. **Historique — filtres** (H6, H7, H8) — ~1h, réutilisation du pattern DateRangeFilter déjà existant.
3. **Historique — détail** (H9, H10) — ~1h, enrichissement de la vue existante.
4. **Historique — incidents** (H11) — ~2–3h, modale observation + media viewer + envoi email.
5. **Fenêtre Live Tracking** (M1) — ~15 min, ajustement largeur.
6. **Rapport — graphiques** (RP1) — ~1–2h, Recharts (BarChart + PieChart).

---

## Relationship to Round 1 (2026-04-06)

| 15-04 ID | Supersedes / refines                                         |
| -------- | ------------------------------------------------------------ |
| R6, R7, R8 | R1 (création rondes à la demande — terminologie corrigée)  |
| H6, H7, H8 | H1, H2 (filtres Historique — date range + statuts colorés) |
| H9, H10  | H3 (détail ronde historique)                                 |
| H11      | H5 (badge Incident + observation + média + envoi)            |
| M1, RP1  | *(nouveaux — Live Tracking panel + graphiques Rapport)*      |

**Not restated in 15-04 PDF** (remain tracked in Round 1) : D1 (Personnaliser KPIs), LT1 (heures de vacation), Z1/Z2 (Zones Géo-fencées — naming + décision à prendre), P1/P2/P3 (Pointage + rapprochement heures + suivi heures), R2 (commentaires points non validés en direct), R3 (« Scanner » → « Valider »), R4 (barre de progression), R5 (transférer historique vers menu Historique), H4 (Générer rapport + Envoyer rapport par mail).

---

## Links

- [[index|Index]]
- [[product/client feedback/Geolocation Feedback|Geolocation Feedback (Round 1 — 2026-04-06)]]
- [[features/web/Geolocation|Geolocation (Web)]]
- [[features/mobile/Geolocation|Geolocation (Mobile)]]
