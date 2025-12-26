export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  bic: string;
  accountType: "Compte courant" | "Compte de dépôt" | "Compte de caution";
  balance: number;
  currency: string;
  status: "Actif" | "Inactif" | "Suspendu";
  lastSync: string;
  apiConnected: boolean;
}

export const mockBankAccounts: BankAccount[] = [
  {
    id: "1",
    bankName: "BNP Paribas",
    accountNumber: "30004 00001 00000123456 25",
    iban: "FR76 3000 4000 0100 0001 2345 625",
    bic: "BNPAFRPPXXX",
    accountType: "Compte courant",
    balance: 125000.50,
    currency: "EUR",
    status: "Actif",
    lastSync: new Date().toISOString(),
    apiConnected: true,
  },
  {
    id: "2",
    bankName: "Société Générale",
    accountNumber: "30003 00001 00000987654 32",
    iban: "FR76 3000 3000 0100 0009 8765 432",
    bic: "SOGEFRPPXXX",
    accountType: "Compte de dépôt",
    balance: 50000.00,
    currency: "EUR",
    status: "Actif",
    lastSync: new Date(Date.now() - 3600000).toISOString(),
    apiConnected: true,
  },
  {
    id: "3",
    bankName: "Crédit Agricole",
    accountNumber: "12345 12345 00000111222 33",
    iban: "FR76 1234 5123 4500 0001 1122 233",
    bic: "AGRIFRPPXXX",
    accountType: "Compte de caution",
    balance: 10000.00,
    currency: "EUR",
    status: "Actif",
    lastSync: new Date(Date.now() - 7200000).toISOString(),
    apiConnected: false,
  },
];


