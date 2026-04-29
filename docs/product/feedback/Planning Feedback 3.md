# Remarques Planning — Retour client 3

**Date:** 2026-04-18
**Source:** Client feedback document (PDF)

**Raw assets** (in [`/assets/`](../../assets/)):
- [Remarques Planning-3 (PDF)](../../assets/Remarques%20Planning-3.pdf)

## Context

Third round of client feedback on the Planning module. Several items from round 2 are re-raised as **non fait** or **c'est pas fait**, plus new refinements on Postes, Shifts, and a clearer separation for the Simulation mode. Items originally flagged in round 2 are cross-referenced below.

---

## A/ Planning

### 2. Postes

| # | Issue | Severity |
|---|-------|----------|
| P3-PP1 | Nouveau poste > **Instruction** > "Equipement necessaire" : transformer en **menu deroulant avec cases a cocher** (multi-selection) | Feature request |
| P3-PP2 | Nouveau poste > **Planning** : rendre **dynamiques** la **duree de vacation** (de **1h a 24h**) et la **duree de pause** (**aucune, 5, 10, 15, 20, 30, 35, 40, 45, 50, 55, 60** min) | Feature request |

---

### 3. Shifts

| # | Issue | Severity |
|---|-------|----------|
| P3-SH1 | Cadre des noms des sites : appliquer la **couleur uniquement au niveau du nom du site**, **pas sur toute la longueur de la ligne** | UX polish |

---

### 5. Planning (Grid)

| # | Issue | Severity |
|---|-------|----------|
| P3-PG1 | Page Planning **trop chargee** — ameliorer la densite/hierarchie visuelle | UX improvement |
| P3-PG2 | Bouton **"Assigner un agent"** en **bleu clair**, comme les boutons Nouvel agent / Nouveau shift / Nouveau poste — **c'est pas fait** (rappel [[Planning Feedback 2#P2-PG1\|P2-PG1]]) | UX consistency |
| P3-PG3 | **Reduire la taille des shifts** dans la vue **semaine** d'**1/3** | UX improvement |
| P3-PG4 | **Reduire la taille de la fenetre** (modal) qui s'affiche au clic sur "Modifier le shift" (vues jour, semaine, mois) d'**1/3** | UX improvement |
| P3-PG5 | **Mode copier** : la banniere en haut indiquant "mode copie active" doit etre en **couleur vive (rouge)** avec **texte grand format** — **c'est pas fait** (rappel [[Planning Feedback 2#P2-PG4\|P2-PG4]]) | UX improvement |
| P3-PG6 | Au-dessus des lignes agents par site, ajouter une **ligne de besoin** : afficher la **duree complete de la vacation** (ex. 6h–22h) ; chaque shift affecte est **deduit du besoin journalier** — **non fait** (la modification precedente ne correspond pas a la demande ; rappel [[Planning Feedback 2#P2-PG5\|P2-PG5]]) | Feature request |
| P3-PG7 | Afficher le **numero de semaine** (ex. "Semaine 01") **au-dessus de chaque jeudi** (milieu de semaine) avec un **petit bouton de la taille du bouton "Semaine"** — **non fait** : le bouton actuel est **trop grand**, **ne s'allume pas**, et **n'est pas au milieu de la semaine** (rappel [[Planning Feedback 2#P2-PG6\|P2-PG6]]) | Feature request |
| P3-PG8 | Dans la case agent : afficher **3 valeurs** — **contrat** (ex. 151.67h), **heures affectees** (decremente au fur et a mesure), **depassement en rouge** si contrat depasse. A afficher **pour chaque agent** — **non fait** (rappel [[Planning Feedback 2#P2-PG7\|P2-PG7]]) | Feature request |
| P3-PG9 | **Vue mois** : quand un shift est affecte, le planning affiche un **point de la couleur du site**, meme si le shift choisi est d'une autre couleur (ex. orange). **Ameliorer la vue mois** pour refleter la couleur reelle du shift | Bug / UX improvement |

---

### 6. Simulation

| # | Issue | Severity |
|---|-------|----------|
| P3-SIM1 | L'implementation actuelle **risque de confondre** planning reel et simulation. **Creer une page dediee** "Simulation" : **duplicat exact** de la page Planning avec une **bordure/indicateur rouge** signalant le mode simulation active. Menu positionne **avant "Parametres"** dans la sidebar (rappel [[Planning Feedback 2#P2-SIM1\|P2-SIM1]]) | Feature request |

---

## Summary by Priority

### UX Fixes
- **P3-SH1** — Color only on site name, not full row width
- **P3-PG1** — Declutter Planning page
- **P3-PG3** — Shrink week-view shifts by 1/3
- **P3-PG4** — Shrink "Modifier shift" modal by 1/3

### Regressions / Still Not Implemented (from round 2)
- **P3-PG2** — "Assigner un agent" light blue (*c'est pas fait*)
- **P3-PG5** — Copy mode: bright red banner + large text (*c'est pas fait*)
- **P3-PG6** — Besoin row with vacation hours deducted (*non fait — current change does not match request*)
- **P3-PG7** — Week number above Thursday, small button, centered, must light up (*non fait — current button too big, off-center, not active*)
- **P3-PG8** — Agent cell: contract / assigned / overage (*non fait*)
- **P3-SIM1** — Dedicated Simulation page with red indicator (*still confused with Planning*)

### Feature Requests — New
- **P3-PP1** — Equipement necessaire as multi-check dropdown
- **P3-PP2** — Dynamic vacation duration (1h–24h) and pause duration (aucune, 5…60 min)
- **P3-PG9** — Month view: shift dot should reflect shift color, not site color

---

## Links

- [[index|Index]]
- [[features/web/Planning|Planning (Web)]]
- [[client feedback/Planning Feedback 2|Planning Feedback 2]]
- [[client feedback/Planning & Facturation Feedback|Planning & Facturation Feedback (v1)]]
