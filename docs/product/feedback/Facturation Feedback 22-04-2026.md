# Remarques Facturation — 22-04-2026

**Date:** 2026-04-22  
**Source:** Client feedback document (PDF)

**Raw assets** (in [`/assets/`](../../assets/)):
- [Remarque Facturation du 22-04-2026 (PDF)](https://drive.google.com/file/d/1IYZrwGZWGaYRdAjjzw-77XFvM0qc9-A3/view?usp=drive_link)

## Context

Client feedback focused on the Billing/Facturation module, with requests across Simulation, Clients, Services, Invoices, Purchase Orders, and menu cleanup.

---

## A/ Remarques FACTURATION

### 1. Simulation

| ID | Ask | Severity |
|---|---|---|
| F22-SIM1 | Nouvelle simulation : ajouter la **date de debut** et la **date de fin** du besoin | Feature request |

### 2. Clients

| ID | Ask | Severity |
|---|---|---|
| F22-CLI1 | Nouveau client : dans la saisie SIRET, connecter `www.peppers.fr` pour **auto-remplir les informations de l'entreprise** | Feature request |
| F22-CLI2 | Nouveau client : page trop longue, la **decouper en 2 ou 3 pages** (ex: a partir de "information contrat") | UX improvement |
| F22-CLI3 | Nouveau client : "typologie des agents affectes" en **menu deroulant** | UX improvement |

### 3. Service

| ID | Ask | Severity |
|---|---|---|
| F22-SRV1 | Nouveau service : champ nom avec **menu deroulant pre-rempli** (Agent de Securite, SSIAP1, SSIAP2, SSIAP3, Rondier, Agent Cynophile, Agent d'accueil, Chef de poste, Operateur video, DI) | Feature request |
| F22-SRV2 | Nouveau service : possibilite d'ajouter un **detail** pour differencier les services entre clients | Feature request |

### 4. Facture

| ID | Ask | Severity |
|---|---|---|
| F22-INV1 | Voir facture : ajouter la **date d'echeance** | Feature request |
| F22-INV2 | Nouvelle facture : pour "Source des donnees", afficher le **detail pour chaque source de donnees** | Feature request |
| F22-INV3 | Nouvelle facture : possibilite de **saisir manuellement les services effectues** (comme pour un devis) | Feature request |

### 5. Bon de commande

| ID | Ask | Severity |
|---|---|---|
| F22-PO1 | Ajouter un bouton **"Nouveau BC"** | Feature request |
| F22-PO2 | Bon de commande : permettre de creer une commande avec des **besoins de service** (logique similaire au devis) | Feature request |
| F22-PO3 | Bon de commande : le document est adresse au sous-traitant (qui devient client dans ce contexte) | Functional rule |

### 6. TVA et PAIE

| ID | Ask | Severity |
|---|---|---|
| F22-MENU1 | Supprimer le menu **TVA** | Removal |
| F22-MENU2 | Supprimer le menu **PAIE** | Removal |

---

## Summary by Priority

### Menu removals
- **F22-MENU1, F22-MENU2** — Remove TVA and PAIE menus

### Core billing feature requests
- **F22-SIM1** — Need start/end dates on simulation needs
- **F22-INV1, F22-INV2, F22-INV3** — Invoice due date, data source detail, manual service entry
- **F22-PO1, F22-PO2, F22-PO3** — Purchase order flow ("Nouveau BC") aligned with quote-like service needs

### Client onboarding and service catalog UX
- **F22-CLI1** — SIRET auto-fill via peppers.fr
- **F22-CLI2, F22-CLI3** — Multi-step new client flow + typology dropdown
- **F22-SRV1, F22-SRV2** — Pre-filled service names + per-client service details

---

## Links

- [[index|Index]]
- [[features/web/Billing|Billing (Web)]]
- [[client feedback/Planning & Facturation Feedback|Planning & Facturation Feedback (v1)]]
