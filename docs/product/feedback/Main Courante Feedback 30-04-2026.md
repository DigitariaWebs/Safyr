# Remarques Main Courante - 30-04-2026

**Date:** 2026-04-30  
**Source:** Retour client (message)

## Contexte

Ce feedback couvre 3 sujets prioritaires du module Main Courante:
- Tableau de bord: rendre l'ecran plus visuel (plus de graphiques, moins de texte)
- Planning et RH: simplifier le menu en renommant et repositionnant l'entree
- Gestion: fusionner DI et Fiche d'interpellation, puis ajouter un historique archive avec recherche par periode

---

## A/ MAIN COURANTE

### 1) Tableau de bord - orienter vers des graphiques

| ID | Tache | Details | Priorite | Critere d'acceptation |
|---|---|---|---|---|
| MC30-DASH-1 | Audit des blocs actuels | Identifier les blocs trop textuels et les KPI a visualiser | Haute | Liste validee des KPI cibles et des zones a remplacer |
| MC30-DASH-2 | Ajouter des widgets graphiques | Creer des graphiques (barres, courbes, camembert) pour incidents, alertes, statuts, volumes | Haute | Le dashboard affiche majoritairement des graphs et reste lisible desktop/mobile |
| MC30-DASH-3 | Uniformiser la lecture visuelle | Ajouter legende, couleurs metier, badges de statut, info-bulles | Moyenne | Les graphiques sont comprehensibles sans bloc explicatif long |
| MC30-DASH-4 | Optimiser les performances | Eviter surcharge UI (memoization, aggregation), limiter repaint | Moyenne | Temps d'affichage stable et interaction fluide |

### 2) Planning et RH - simplification du menu

| ID | Tache | Details | Priorite | Critere d'acceptation |
|---|---|---|---|---|
| MC30-MENU-1 | Renommer l'entree | Remplacer "Planning et RH" par "Agents affectes" | Haute | Le libelle "Planning et RH" disparait du menu |
| MC30-MENU-2 | Repositionner dans l'arborescence | Deplacer l'entree dans "Securite > Parametrage" | Haute | Navigation accessible uniquement depuis ce nouvel emplacement |
| MC30-MENU-3 | Garder compatibilite navigation | Ajouter redirection depuis ancienne URL/menu si necessaire | Moyenne | Aucun lien casse, anciens favoris continuent de fonctionner |
| MC30-MENU-4 | Valider UX menu minimal | Verifier que le menu reste court et essentiel | Moyenne | Validation metier: menu allege et coherent |

### 8) Gestion - fusion DI + Fiche d'interpellation, archivage et historique

| ID | Tache | Details | Priorite | Critere d'acceptation |
|---|---|---|---|---|
| MC30-GES-1 | Fusion fonctionnelle | Supprimer l'ecran DI et conserver une seule "Fiche d'interpellation" complete | Haute | Un seul parcours de saisie est expose |
| MC30-GES-2 | Aligner le modele de donnees | Integrer les champs DI dans la fiche detaillee (si manquants) | Haute | Aucun champ utile DI n'est perdu |
| MC30-GES-3 | Ajouter statut archive | Ajouter action "Archiver" sur une fiche | Haute | Une fiche peut etre archivee sans suppression |
| MC30-GES-4 | Ajouter bouton Historique | Creer vue "Historique" des fiches archivees | Haute | Bouton visible et vue historique accessible |
| MC30-GES-5 | Filtrer par periode | Ajouter filtres "Date de debut" + "Date de fin" dans Historique | Haute | Recherche par plage de dates operationnelle |
| MC30-GES-6 | Rechercher et trier | Ajouter recherche texte + tri date/statut | Moyenne | Operateur retrouve une fiche en moins de 3 actions |
| MC30-GES-7 | Tracabilite des actions | Journaliser creation, edition, archivage | Moyenne | Historique des actions visible et datee |

---

## Plan de mise en oeuvre propose

### Sprint 1 (priorite haute)
- MC30-DASH-1, MC30-DASH-2
- MC30-MENU-1, MC30-MENU-2
- MC30-GES-1, MC30-GES-2, MC30-GES-3, MC30-GES-4, MC30-GES-5

### Sprint 2 (qualite et stabilisation)
- MC30-DASH-3, MC30-DASH-4
- MC30-MENU-3, MC30-MENU-4
- MC30-GES-6, MC30-GES-7

---

## Risques et points d'attention

- Fusion DI/interpellation: risque de perte d'information si mapping incomplet
- Deplacement menu: risque d'incomprehension utilisateur sans communication claire
- Dashboard plus graphique: risque de surcharge visuelle si trop de widgets

---

## Definition of Done (globale)

- Les 3 demandes client sont implementees et valideses metier
- Les parcours critiques (navigation, creation, archivage, recherche periode) sont testes
- Aucun lien/menu obsolete expose a l'utilisateur final
- Documentation produit mise a jour

---

## Liens

- [[index|Index]]
- [[features/web/Logbook|Logbook (Web)]]
- [[product/feedback/Main Courante Feedback|Main Courante Feedback (precedent)]]
