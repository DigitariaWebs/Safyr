export interface AccountingPlan {
  id: string;
  code: string;
  label: string;
  type: "Actif" | "Passif" | "Charge" | "Produit";
  class: string;
  analytique: boolean;
  status: "Actif" | "Inactif";
  lastUpdate: string;
}

export const mockAccountingPlans: AccountingPlan[] = [
  {
    id: "1",
    code: "101000",
    label: "Capital social",
    type: "Passif",
    class: "1 - Comptes de capitaux",
    analytique: false,
    status: "Actif",
    lastUpdate: "2024-01-01",
  },
  {
    id: "2",
    code: "401000",
    label: "Fournisseurs",
    type: "Passif",
    class: "4 - Comptes de tiers",
    analytique: true,
    status: "Actif",
    lastUpdate: "2024-01-01",
  },
  {
    id: "3",
    code: "411000",
    label: "Clients",
    type: "Actif",
    class: "4 - Comptes de tiers",
    analytique: true,
    status: "Actif",
    lastUpdate: "2024-01-01",
  },
  {
    id: "4",
    code: "512000",
    label: "Banque",
    type: "Actif",
    class: "5 - Comptes financiers",
    analytique: true,
    status: "Actif",
    lastUpdate: "2024-01-01",
  },
  {
    id: "5",
    code: "606300",
    label: "Fournitures d'entretien",
    type: "Charge",
    class: "6 - Comptes de charges",
    analytique: true,
    status: "Actif",
    lastUpdate: "2024-01-01",
  },
  {
    id: "6",
    code: "641100",
    label: "Salaires, appointements",
    type: "Charge",
    class: "6 - Comptes de charges",
    analytique: true,
    status: "Actif",
    lastUpdate: "2024-01-01",
  },
  {
    id: "7",
    code: "706000",
    label: "Prestations de services",
    type: "Produit",
    class: "7 - Comptes de produits",
    analytique: true,
    status: "Actif",
    lastUpdate: "2024-01-01",
  },
];


