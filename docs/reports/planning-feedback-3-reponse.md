# Réponse — Planning Feedback 3

**Date :** 2026-04-18

---

## Entête planning redessiné

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** entête sticky

- Remplace le bandeau de stats par des pills de filtres (Clients / Sites / Agents) avec état actif
- Supprime le grand libellé de semaine et l'indicateur de semaine du topbar
- Ajoute un bouton de bascule de la sidebar avec badge du nombre de filtres actifs

---

## Bouton « Assigner un agent » global

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** entête sticky → bouton **Assigner un agent**

- Remplace les boutons par entête de site par un bouton global unique
- Ajoute un sélecteur de site requis dans la modale d'assignation

---

## Bannière « Mode copie » restylée

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** menu ⋮ d'un shift → **Copier**

- Fond rouge vif, texte blanc gras en majuscules, icône agrandie, plus de padding
- Lisibilité renforcée pendant le mode copie

---

## Besoin hebdomadaire enrichi

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** vue **Semaine** → ligne par poste

- Chaque cellule empile : fenêtre de vacation (`HH:mm–HH:mm`), couverture `X/Y`, et déduction restante (`−N`)
- Lecture plus rapide de la couverture par jour

---

## Pill « Semaine XX »

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** vue **Semaine** → au-dessus de l'entête des jours

- Ajoute une pill centrée avec le numéro de semaine ISO
- Mise en évidence quand la semaine affichée = semaine courante

---

## Résumé agent en 3 valeurs

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** colonne agent (Jour / Semaine / Mois)

- Affiche explicitement : **Contrat**, **Affectées**, **Restantes**
- **Dépassement** en rouge quand affectées > contrat
- Pro-raté selon la période visible, agrégé sur tous les sites visibles

---

## Couleur du shift en vue Mois

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** vue **Mois** → points colorés des cellules

- Le point utilise désormais la couleur propre du shift (plus celle du site)
- Discrimination visuelle entre shifts d'un même site

---

## Page Simulation dédiée

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/simulation>
**Navigation :** barre de navigation Planning → **Simulation** (entre Planning et Paramètres, icône `FlaskConical`)

- Nouvelle route dédiée, réutilise la grille planning via `ScheduleView` avec `forceSimulation`
- Mode simulation toujours actif sur cette page : bandeau rouge en haut, titre « Simulation » rouge
- Écritures en état fantôme, données live jamais touchées
- Supprime le bouton Simulation, le flux de sortie et la modale de confirmation de la page Planning (la simulation vit uniquement sur la route dédiée)
- Bannière simulation alignée sur la bannière copie (rouge vif, texte blanc gras en majuscules)

---

## Sidebar planning collapsible

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** icône de bascule dans le topbar

- Nouvelle sidebar droite repliable : navigation de période, sélecteur de vue, actions (Simulation, PDF), métriques de résumé
- État ouvert/fermé persisté dans `uiStore`
- **Résumé du planning** déplacé du contenu principal vers la sidebar sous forme de tuiles compactes 2×2
- **Détail des majorations** rendu en bas de la grille

---

## Formulaire Postes migré vers TanStack Form

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/postes>
**Navigation :** **Nouveau poste** / **Modifier**

- Migration `useState` → `@tanstack/react-form` avec bindings par champ
- Modes de contact d'urgence structurés : **site** / **client** / **manuel** avec `PhoneInput`
- Multi-sélection des équipements (remplace la saisie libre séparée par virgules)
- Durée de pause unifiée en `Select` (0 / 15 / 30 / 45 / 60 min), partagée avec la page Shifts

---

## Constantes planning partagées

**Fichier :** `web/src/lib/planning-constants.ts`

- Nouveau module exportant `BREAK_DURATION_OPTIONS`, `SHIFT_DURATION_OPTIONS`, `EQUIPMENT_OPTIONS`
- Source unique entre Postes et Shifts

---

## Badges de groupe de site

**Liens :**
- <https://safyr-web.vercel.app/dashboard/planning/postes>
- <https://safyr-web.vercel.app/dashboard/planning/shifts>

- Les libellés de groupe de site deviennent des badges colorés (plus de fond teinté sur toute la ligne)
- Lecture des tables plus propre
