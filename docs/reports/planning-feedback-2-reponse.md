# Réponse — Planning Feedback 2

**Date :** 2026-04-15

---

## Bouton « Assigner un agent » bleu clair

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** entête coloré d'un site → bouton `+ Assigner un agent`

- Bouton déplacé du header global vers l'entête de chaque groupe de site
- Couleur bleu ciel cohérente avec les autres actions
- Supprime l'ancien bouton en bas de la vue Jour

---

## Mois complet avec couleur par site

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** sélecteur de vue → **Mois**

- Ajoute la vue mensuelle en lignes (colonne agent sticky + 28–31 colonnes de jours)
- Supprime l'ancienne vue calendrier à 7 colonnes
- Ajoute le regroupement par site coloré, tous sites visibles sur une page
- Ajoute les points colorés par affectation + infobulle au survol

---

## Alerte sonore date passée + confirmation + édition débloquée

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** `+` sur une cellule d'une date antérieure à aujourd'hui

- Ajoute le bip sonore via `playAlertBeep` (partagé avec Géolocalisation)
- Ajoute la modale de confirmation « Date passée »
- Débloque l'édition des shifts sur dates passées : clic sur la carte, crayon d'édition rapide, menu ⋮ (Modifier / Personnaliser / Copier / Supprimer) désormais disponibles partout
- Remplace le placeholder « Date passée » (non-cliquable) par le bouton `+ Ajouter un shift` sur les cellules passées vides
- La création/collage sur date passée passe toujours par l'alerte sonore + modale de confirmation

---

## Mode copier visible

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** menu ⋮ d'un shift → **Copier** → cliquer une cellule vide

- Déplace la bannière du mode copie dans l'entête sticky (toujours visible)
- Conserve l'icône _coller_ sur toutes les cellules compatibles

---

## Ligne de besoin par poste

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** toutes les vues (Jour / Semaine / Mois)

- Ajoute une représentation du besoin dans chaque vue :
  - Jour : barres horaires sur la chronologie 24h
  - Semaine : ligne par poste × jour avec `couvert/requis`
  - Mois : ligne par poste + ligne **Couverture** agrégée
- Calcule la couverture par chevauchement horaire (≥ 50 % de la fenêtre)

---

## Numéro de semaine

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** entête sticky, coin haut droit

- Ajoute l'affichage grand format (`Semaine 16` / `Semaines 14 – 18` en mois)
- Supprime les badges `S.XX` internes aux vues Semaine et Mois

---

## Contrat / affectées / dépassement

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** colonne agent de n'importe quelle vue

- Ajoute sous chaque nom : `planifiées / contrat` + `restantes` ou `+dépassement`
- Totaux agrégés **sur tous les sites visibles** (plus seulement le site courant)
- Contrat pro-raté selon la période affichée (jour / semaine / mois)

---

## Détail des majorations

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** au-dessus de la grille, toujours visible

- Déplace la section du bas de page vers le haut
- Ajoute **Résumé du planning** (Heures totales, Sup., Repas, Absences)
- Les deux sections se mettent à jour avec les filtres

---

## Mode Simulation

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** entête sticky → bouton **Simulation**

- Ajoute le basculement avec bannière rouge « Mode simulation actif »
- Les modifications écrivent dans un état fantôme (live non affecté)
- À la sortie : modale **Sauvegarder / Jeter / Rester en simulation**

---

## Améliorations hors périmètre (livrées sur le même chantier)

### Multi-sites par défaut

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>

- Supprime la sélection unique site/client
- Ajoute l'affichage de tous les sites actifs en groupes pliables colorés

### Filtres en cascade (Clients → Sites → Agents)

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** entête sticky, deuxième ligne

- Ajoute 3 popovers multi-sélection
- Sites désactivé tant qu'aucun client n'est choisi
- Ajoute un bouton **Tout effacer**

### Modale multi-sélection d'assignation

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** entête de site → `+ Assigner un agent`

- Remplace la palette de commande par une modale
- Ajoute la recherche (nom / qualification / contrat)
- Filtre à seulement les agents non-encore assignés au site
- Ajoute la sélection multiple + bouton `Assigner N agents`

### Postes à combler dans le popover de shift

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** `+` sur une cellule vide

- Ajoute une section « Postes à combler » en haut du popover
- Clic sur un poste = création du shift à ses horaires

### Édition rapide sur les cartes shift

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** coin bas-droit d'un shift (vues Jour / Semaine)

- Ajoute une icône crayon pour ouvrir l'édition en un clic

### Entête sticky

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>

- 3 lignes : titre+résumé+semaine / filtres / contrôles
- Plein largeur, collé au défilement

### Export PDF multi-sites

**Lien :** <https://safyr-web.vercel.app/dashboard/planning/schedule>
**Navigation :** entête sticky → icône ⬇︎

- Remplace l'export mono-site par un PDF couvrant l'ensemble des sites visibles (toutes les sections enchaînées)

---

## Items à livrer

| Sujet                           | Lien                                                     | Navigation                               |
| ------------------------------- | -------------------------------------------------------- | ---------------------------------------- |
| Début / fin de vacation (poste) | <https://safyr-web.vercel.app/dashboard/planning/postes> | Actions → Modifier → Planning            |
| Types de poste étendus          | <https://safyr-web.vercel.app/dashboard/planning/postes> | Nouveau poste → Général → Type de poste  |
| Certifications multi-sélection  | <https://safyr-web.vercel.app/dashboard/planning/postes> | Nouveau poste → Général → Certifications |
| Entêtes de sites colorées       | <https://safyr-web.vercel.app/dashboard/planning/shifts> | Page Shifts                              |
| Pause « Aucune »                | <https://safyr-web.vercel.app/dashboard/planning/shifts> | Nouveau shift → Durée de pause           |
