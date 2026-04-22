export interface AccountingJournal {
  id: string;
  code: string; // "ACHAT", "VENTE", "BANQUE", "OD"
  label: string; // "Journal des Achats", "Journal des Ventes", etc.
  type: "Achats" | "Ventes" | "Banque" | "Opérations Diverses" | "Société";
  entriesCount: number;
  totalDebit: number;
  totalCredit: number;
  lastEntryDate: string;
  status: "Actif" | "Inactif";
}

export const mockAccountingJournals: AccountingJournal[] = [
  {
    id: "1",
    code: "ACHAT",
    label: "Journal des Achats",
    type: "Achats",
    entriesCount: 156,
    totalDebit: 285400.5,
    totalCredit: 285400.5,
    lastEntryDate: "2024-03-10",
    status: "Actif",
  },
  {
    id: "2",
    code: "VENTE",
    label: "Journal des Ventes",
    type: "Ventes",
    entriesCount: 234,
    totalDebit: 456700.0,
    totalCredit: 456700.0,
    lastEntryDate: "2024-03-11",
    status: "Actif",
  },
  {
    id: "3",
    code: "BANQUE",
    label: "Journal de Banque",
    type: "Banque",
    entriesCount: 89,
    totalDebit: 189500.25,
    totalCredit: 175200.0,
    lastEntryDate: "2024-03-11",
    status: "Actif",
  },
  {
    id: "4",
    code: "CAISSE",
    label: "Journal de Caisse",
    type: "Banque",
    entriesCount: 42,
    totalDebit: 8500.0,
    totalCredit: 8200.0,
    lastEntryDate: "2024-03-09",
    status: "Actif",
  },
  {
    id: "5",
    code: "OD",
    label: "Opérations Diverses",
    type: "Opérations Diverses",
    entriesCount: 28,
    totalDebit: 125000.0,
    totalCredit: 125000.0,
    lastEntryDate: "2024-03-05",
    status: "Actif",
  },
  {
    id: "6",
    code: "societe",
    label: "Journal Société",
    type: "Société",
    entriesCount: 12,
    totalDebit: 95000.0,
    totalCredit: 95000.0,
    lastEntryDate: "2024-02-28",
    status: "Actif",
  },
  {
    id: "7",
    code: "PAYE",
    label: "Journal de Paie",
    type: "Société",
    entriesCount: 24,
    totalDebit: 156000.0,
    totalCredit: 156000.0,
    lastEntryDate: "2024-03-05",
    status: "Inactif",
  },
];
