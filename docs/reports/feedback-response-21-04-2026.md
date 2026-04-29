# Réponse — Retours Main Courante, Géolocalisation & Planning (15-04 / 19-04-2026)

**Date :** 2026-04-21
**Sources :** Remarques MAIN COURANTE du 15-04-2026 · Remarques Géolocalisation 15-04-2026 · Remarques Planning 19-04-2026

---

# Main Courante

## Navigation — Rapports & Sécurité

**Navigation :** Main Courante → barre de menu

- « Exports » renommé **« Rapports »** (étiquette, titre, onglets).
- **Rapports** positionnée avant **Sécurité** ; **Sécurité** déplacée en fin de menu.
- Ordre final : Événements → Validation → Alertes → Planning & RH → Portails → Gestion → Rapports → Sécurité.

## Fiche d'interpellation

**Navigation :** Main Courante → Gestion → Fiches d'Interpellation

- **Montant (€)** : champ numérique, affiché dès qu'un type d'infraction est sélectionné.
- **Statut du paiement** : radio _Réglé_ / _Non réglé_, affiché si montant > 0 €.
- **Justificatif** : pièce jointe (image / PDF) — **placeholder** ; stockage activé dans une prochaine itération.

## Filtre événements

**Navigation :** Main Courante → Événements → barre de filtre

- Filtre **calendrier / période / mois / année** opérationnel : _Aujourd'hui_, _Cette semaine_, _Ce mois_, _Cette année_, _Période personnalisée_ (date début / date fin).
- Aucun développement nécessaire — déjà en place.

---

# Géolocalisation

## Rondes — renommage & flux

**Navigation :** Géolocalisation → Rondes

- **« Itinéraire »** renommé **« Ronde »** sur tout le module (onglet, sidebar, bouton de suppression).
- **« Nouvel itinéraire »** → **« Nouvelle Ronde »**.
- **« Ajouter un point »** → **« Nouveau point »** ; accessible uniquement après ouverture du formulaire de création d'une ronde.

## Suivi en Temps Réel — carte

**Navigation :** Géolocalisation → Suivi en Temps Réel

- Panneau supérieur gauche agrandi (largeur minimum 480 px, padding interne augmenté) pour améliorer la lecture du titre, des filtres et de la barre d'outils.

## Historique — refonte complète

**Navigation :** Géolocalisation → Historique

- **Filtres temporels** : « Toutes années » et « Tous mois » supprimés ; remplacés par **Date début** + **Date fin** (cohérent avec la page Rapport).
- **Filtres contextuels** : libellés « toutes » / « tous » retirés ; seuls **Sites** et **Clients** sont conservés.
- **Statuts colorés** : pastilles (Toutes / Complètes / Incomplètes / Incident) avec couleurs distinctes (cyan / vert / ambre / rouge).

## Historique — détail d'une ronde

**Navigation :** Géolocalisation → Historique → _ronde_

- **Heure** affichée devant chaque point de contrôle (format HH:MM, tiret si non scanné).
- **Commentaire** visible sur les points non validés et d'incident.
- **Gestion des incidents** : ligne de point avec anomalie entièrement cliquable (plus seulement le badge). Ouvre une fenêtre avec :
  - zone **Observation** éditable (bouton _Enregistrer_),
  - **galerie photos / vidéos** + vue agrandie (lightbox),
  - actions mail : **« Envoyer au responsable »** et **« Envoyer au client »**.

## Rapports — graphiques

**Navigation :** Géolocalisation → Rapports

- Chaque type de rapport (Présences, Rondes, Déplacements, Incidents, Zones) affiche entre les KPIs et le tableau une section **graphiques** :
  - **Histogramme** (gauche) — évolution journalière, séries empilées ou groupées selon le rapport.
  - **Secteur (camembert)** — répartition par catégorie, pourcentages au survol.
- Palette cohérente : vert = OK, ambre = avertissement, rouge = critique, cyan = neutre/total, violet = secondaire.
- Tableau de données et exports PDF / Excel / CSV inchangés.

---

# Planning

## Postes

**Navigation :** Planning → Postes

- Fenêtre **« Nouveau poste »** réduite (`xl` → `lg`, ≈ ⅓ de largeur en moins).
- Menu déroulant **« Certifications requises »** aligné sur le style du champ **Type de poste** (hauteur `h-9`, largeur du popover calée sur le déclencheur).

## Planning — grille

**Navigation :** Planning → Planning

- Bouton **« Assigner un agent »** renommé **« Affecter un agent »** (bouton, modale, libellés d'action).
- **Bannières** (mode copie / mode simulation) : texte **centré** ; icône et bouton « Désactiver » positionnés en absolu aux extrémités.
- **Panneau Résumé & détails** (sidebar droite) : nouvelle section **« Détail des heures »** — H normales, H de nuit, H dimanche, H fériés. Catégories à zéro masquées. Semaine affichée toujours lundi → dimanche.
- **Ligne de besoin par site** (au-dessus des agents) : affichage fondé sur des **intervalles horaires** (plus de compteur). Le poste affiche sa plage (`6h–22h`) ; chaque shift affecté est **soustrait** de la plage restant à couvrir. Lorsque la vacation est entièrement couverte, la case bascule en **« Affecter »** vert.
- **Cellule agent** — 3 valeurs visibles en vues jour, semaine et mois :
  - **Contrat** mensuel (ex. `151.67h` pour un 35h hebdo = `35 × 52 / 12`).
  - **Heures affectées** cumulées sur le mois en cours ; décrémentent le restant.
  - **Dépassement** en rouge si le contrat est dépassé.
- **Vue semaine** — barre de navigation sous la grille : pastilles `S01`, `S02`, … couvrant tout le mois courant avec plage de dates ; semaine active mise en évidence ; clic recalibre le planning sur le lundi choisi.
- **Vue mois** — points de couleur remplacés par des **étiquettes compactes `début-fin`** (ex. `7-14`, `14h30-22h`), empilées verticalement si plusieurs shifts le même jour.

## Simulation

**Navigation :** Planning → Simulation

- **Isolation** confirmée : les modifications (shifts, affectations, shifts standards) vont dans un **état fantôme** ; le menu Planning officiel n'est jamais muté.
- **Arrière-plan distinct** : fond rosé en **hachures diagonales** + **anneau inset rouge** pour écarter toute confusion visuelle avec le menu Planning.

---

# Questions ouvertes & cadrage

## Main Courante

### Retour 15-04-2026

| #   | Question                                                                                                 |
| --- | -------------------------------------------------------------------------------------------------------- |
| 1   | Nouvel événement : le **site** doit-il être auto-rempli depuis la vacation en cours ? Source de vérité ? |
| 2   | Nouvel événement : le **nom de l'agent** doit-il être auto-rempli depuis le code d'accès ?               |

### Retour 09-04-2026 — toujours ouvert

| #   | Page              | Demande                                                                              |
| --- | ----------------- | ------------------------------------------------------------------------------------ |
| 3   | **Planning & RH** | Explication du fonctionnement de la page.                                            |
| 4   | **Portails**      | Explication des portails + synchronisation du portail agent avec la géolocalisation. |
| 5   | **Sécurité**      | Explication du menu.                                                                 |

### En attente de cadrage

- **Tableau de bord** — demande ouverte « toujours à améliorer ». Cadrage nécessaire : KPIs prioritaires, informations à remonter, références visuelles.
