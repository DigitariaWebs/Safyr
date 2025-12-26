export interface Expense {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  type: "mileage" | "meal" | "accommodation" | "training" | "equipment" | "other";
  description: string;
  amount: number;
  date: string;
  receiptUrl?: string;
  status: "draft" | "submitted" | "validated" | "rejected" | "paid";
  submittedAt?: string;
  validatedAt?: string;
  validatedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockExpenses: Expense[] = [
  {
    id: "EXP-001",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    type: "mileage",
    description: "Déplacements professionnels - Décembre 2024",
    amount: 125.50,
    date: "2024-12-15",
    receiptUrl: "/receipts/jean_dupont_kilometrage_dec2024.pdf",
    status: "paid",
    submittedAt: "2024-12-16T09:00:00Z",
    validatedAt: "2024-12-17T10:30:00Z",
    validatedBy: "Sophie Dubois",
    paidAt: "2024-12-20T00:00:00Z",
    createdAt: "2024-12-15T08:00:00Z",
    updatedAt: "2024-12-20T00:00:00Z",
  },
  {
    id: "EXP-002",
    employeeId: "2",
    employeeName: "Marie Martin",
    employeeNumber: "EMP002",
    type: "meal",
    description: "Repas d'affaires - Client Centre Commercial",
    amount: 45.80,
    date: "2024-12-18",
    receiptUrl: "/receipts/marie_martin_repas_18122024.pdf",
    status: "validated",
    submittedAt: "2024-12-19T08:30:00Z",
    validatedAt: "2024-12-19T14:00:00Z",
    validatedBy: "Sophie Dubois",
    createdAt: "2024-12-18T20:00:00Z",
    updatedAt: "2024-12-19T14:00:00Z",
  },
  {
    id: "EXP-003",
    employeeId: "3",
    employeeName: "Pierre Bernard",
    employeeNumber: "EMP003",
    type: "training",
    description: "Formation SST - Frais d'inscription",
    amount: 800.00,
    date: "2024-12-10",
    receiptUrl: "/receipts/pierre_bernard_formation_sst.pdf",
    status: "submitted",
    submittedAt: "2024-12-11T10:00:00Z",
    createdAt: "2024-12-10T15:00:00Z",
    updatedAt: "2024-12-11T10:00:00Z",
  },
  {
    id: "EXP-004",
    employeeId: "5",
    employeeName: "Luc Moreau",
    employeeNumber: "EMP005",
    type: "accommodation",
    description: "Hôtel - Mission sécurité événementielle Lyon",
    amount: 120.00,
    date: "2024-12-05",
    receiptUrl: "/receipts/luc_moreau_hotel_lyon.pdf",
    status: "validated",
    submittedAt: "2024-12-06T09:00:00Z",
    validatedAt: "2024-12-07T11:00:00Z",
    validatedBy: "Sophie Dubois",
    createdAt: "2024-12-05T18:00:00Z",
    updatedAt: "2024-12-07T11:00:00Z",
  },
  {
    id: "EXP-005",
    employeeId: "6",
    employeeName: "Claire Petit",
    employeeNumber: "EMP006",
    type: "equipment",
    description: "Achat chaussures de sécurité",
    amount: 89.90,
    date: "2024-12-12",
    receiptUrl: "/receipts/claire_petit_chaussures_securite.pdf",
    status: "rejected",
    submittedAt: "2024-12-13T08:00:00Z",
    rejectedAt: "2024-12-14T10:00:00Z",
    rejectedBy: "Sophie Dubois",
    rejectionReason: "Équipement non conforme aux normes internes. Voir liste des équipements approuvés.",
    createdAt: "2024-12-12T16:00:00Z",
    updatedAt: "2024-12-14T10:00:00Z",
  },
  {
    id: "EXP-006",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    type: "mileage",
    description: "Déplacements professionnels - Novembre 2024",
    amount: 98.30,
    date: "2024-11-30",
    receiptUrl: "/receipts/jean_dupont_kilometrage_nov2024.pdf",
    status: "paid",
    submittedAt: "2024-12-01T09:00:00Z",
    validatedAt: "2024-12-02T10:00:00Z",
    validatedBy: "Sophie Dubois",
    paidAt: "2024-12-05T00:00:00Z",
    createdAt: "2024-11-30T17:00:00Z",
    updatedAt: "2024-12-05T00:00:00Z",
  },
  {
    id: "EXP-007",
    employeeId: "9",
    employeeName: "Alexandre Simon",
    employeeNumber: "EMP009",
    type: "other",
    description: "Frais de stationnement - Mission client",
    amount: 12.50,
    date: "2024-12-20",
    receiptUrl: "/receipts/alexandre_simon_stationnement.pdf",
    status: "draft",
    createdAt: "2024-12-20T18:00:00Z",
    updatedAt: "2024-12-20T18:00:00Z",
  },
];


