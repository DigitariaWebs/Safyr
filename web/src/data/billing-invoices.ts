export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  siteId?: string;
  siteName?: string;
  period: {
    start: string;
    end: string;
  };
  status:
    | "Brouillon"
    | "En attente"
    | "Validée"
    | "Envoyée"
    | "Payée"
    | "Annulée";
  // Sources de données
  planningHours?: number; // heures planifiées
  realizedHours?: number; // heures réalisées (géoloc/main courante)
  validatedHours?: number; // heures validées (paie)
  // Facturation
  normalHours: number;
  overtimeHours: number;
  replacements: number;
  // Montants
  subtotal: number; // HT
  vatRate: number; // % TVA
  vatAmount: number;
  total: number; // TTC
  // Écarts
  variance?: {
    planned: number;
    realized: number;
    difference: number;
  };
  // Validation
  previewed: boolean;
  validatedBy?: string;
  validatedAt?: string;
  // Émission
  issuedAt?: string;
  sentAt?: string;
  paymentDueDate?: string;
  paidAt?: string;
  // Ajustements
  adjustments?: {
    id: string;
    type: "Manual" | "Credit" | "Exception";
    amount: number;
    reason: string;
    createdAt: string;
    createdBy: string;
  }[];
  // Avoirs
  credits?: {
    id: string;
    creditNumber: string;
    amount: number;
    reason: string;
    createdAt: string;
  }[];
  // Connexion Paie
  payrollAlignment?: {
    hoursPaid: number;
    hoursBillable: number;
    variance: number;
    profitability: number; // %
  };
  // Connexion Comptabilité
  accountingEntries?: {
    salesEntry: string;
    vatEntry: string;
    status: "Pending" | "Generated" | "Exported";
  };
  createdAt: string;
  updatedAt: string;
}

export const mockBillingInvoices: BillingInvoice[] = [
  {
    id: "1",
    invoiceNumber: "FAC-2024-001",
    clientId: "1",
    clientName: "Centre Commercial Rosny 2",
    siteId: "site-1",
    siteName: "Rosny 2 - Entrée principale",
    period: {
      start: "2024-01-01",
      end: "2024-01-31",
    },
    status: "Payée",
    planningHours: 720,
    realizedHours: 715,
    validatedHours: 715,
    normalHours: 715,
    overtimeHours: 0,
    replacements: 0,
    subtotal: 18232.5,
    vatRate: 20,
    vatAmount: 3646.5,
    total: 21879.0,
    variance: {
      planned: 720,
      realized: 715,
      difference: -5,
    },
    previewed: true,
    validatedBy: "Admin",
    validatedAt: "2024-02-01T10:00:00",
    issuedAt: "2024-02-01T10:30:00",
    sentAt: "2024-02-01T11:00:00",
    paymentDueDate: "2024-03-02",
    paidAt: "2024-02-28T14:30:00",
    adjustments: [
      {
        id: "adj-1",
        type: "Manual",
        amount: 150.0,
        reason: "Majoration pour intervention urgente le 15/01",
        createdAt: "2024-02-01T09:30:00",
        createdBy: "Admin",
      },
    ],
    payrollAlignment: {
      hoursPaid: 715,
      hoursBillable: 715,
      variance: 0,
      profitability: 15.5,
    },
    accountingEntries: {
      salesEntry: "EC-2024-001",
      vatEntry: "EC-2024-002",
      status: "Exported",
    },
    createdAt: "2024-02-01T09:00:00",
    updatedAt: "2024-02-28T14:30:00",
  },
  {
    id: "2",
    invoiceNumber: "FAC-2024-002",
    clientId: "2",
    clientName: "Siège Social La Défense",
    period: {
      start: "2024-01-01",
      end: "2024-01-31",
    },
    status: "Envoyée",
    planningHours: 480,
    realizedHours: 485,
    validatedHours: 485,
    normalHours: 480,
    overtimeHours: 5,
    replacements: 0,
    subtotal: 13520.0,
    vatRate: 20,
    vatAmount: 2704.0,
    total: 16224.0,
    variance: {
      planned: 480,
      realized: 485,
      difference: 5,
    },
    previewed: true,
    validatedBy: "Admin",
    validatedAt: "2024-02-01T14:00:00",
    issuedAt: "2024-02-01T14:30:00",
    sentAt: "2024-02-01T15:00:00",
    paymentDueDate: "2024-03-02",
    adjustments: [
      {
        id: "adj-2",
        type: "Exception",
        amount: 200.0,
        reason: "Refacturation heures supplémentaires non prévues",
        createdAt: "2024-02-01T13:45:00",
        createdBy: "Admin",
      },
    ],
    payrollAlignment: {
      hoursPaid: 485,
      hoursBillable: 485,
      variance: 0,
      profitability: 18.2,
    },
    accountingEntries: {
      salesEntry: "EC-2024-003",
      vatEntry: "EC-2024-004",
      status: "Generated",
    },
    createdAt: "2024-02-01T13:00:00",
    updatedAt: "2024-02-01T15:00:00",
  },
  {
    id: "3",
    invoiceNumber: "FAC-2024-003",
    clientId: "3",
    clientName: "Entrepôt Logistique Gennevilliers",
    period: {
      start: "2024-01-01",
      end: "2024-01-31",
    },
    status: "En attente",
    planningHours: 0,
    realizedHours: 120,
    validatedHours: 120,
    normalHours: 120,
    overtimeHours: 0,
    replacements: 0,
    subtotal: 2640.0,
    vatRate: 10,
    vatAmount: 264.0,
    total: 2904.0,
    previewed: false,
    payrollAlignment: {
      hoursPaid: 120,
      hoursBillable: 120,
      variance: 0,
      profitability: 12.8,
    },
    accountingEntries: {
      salesEntry: "EC-2024-005",
      vatEntry: "EC-2024-006",
      status: "Pending",
    },
    createdAt: "2024-02-01T15:00:00",
    updatedAt: "2024-02-01T15:00:00",
  },
  {
    id: "4",
    invoiceNumber: "FAC-2024-004",
    clientId: "1",
    clientName: "Centre Commercial Rosny 2",
    siteId: "site-2",
    siteName: "Rosny 2 - Parking",
    period: {
      start: "2024-02-01",
      end: "2024-02-29",
    },
    status: "Validée",
    planningHours: 680,
    realizedHours: 675,
    validatedHours: 675,
    normalHours: 670,
    overtimeHours: 5,
    replacements: 1,
    subtotal: 17250.0,
    vatRate: 20,
    vatAmount: 3450.0,
    total: 20700.0,
    variance: {
      planned: 680,
      realized: 675,
      difference: -5,
    },
    previewed: true,
    validatedBy: "Supervisor",
    validatedAt: "2024-03-01T09:00:00",
    adjustments: [
      {
        id: "adj-3",
        type: "Manual",
        amount: -100.0,
        reason: "Réduction pour service non conforme le 10/02",
        createdAt: "2024-03-01T08:30:00",
        createdBy: "Supervisor",
      },
    ],
    credits: [
      {
        id: "cred-1",
        creditNumber: "AVO-2024-001",
        amount: 500.0,
        reason: "Avoir pour panne matériel le 15/02",
        createdAt: "2024-02-20T10:00:00",
      },
    ],
    payrollAlignment: {
      hoursPaid: 675,
      hoursBillable: 675,
      variance: 0,
      profitability: 16.3,
    },
    accountingEntries: {
      salesEntry: "EC-2024-007",
      vatEntry: "EC-2024-008",
      status: "Generated",
    },
    createdAt: "2024-03-01T08:00:00",
    updatedAt: "2024-03-01T09:00:00",
  },
  {
    id: "5",
    invoiceNumber: "FAC-2024-005",
    clientId: "2",
    clientName: "Siège Social La Défense",
    period: {
      start: "2024-02-01",
      end: "2024-02-29",
    },
    status: "Brouillon",
    planningHours: 480,
    realizedHours: 490,
    validatedHours: 490,
    normalHours: 480,
    overtimeHours: 10,
    replacements: 0,
    subtotal: 13720.0,
    vatRate: 20,
    vatAmount: 2744.0,
    total: 16464.0,
    variance: {
      planned: 480,
      realized: 490,
      difference: 10,
    },
    previewed: false,
    payrollAlignment: {
      hoursPaid: 490,
      hoursBillable: 490,
      variance: 0,
      profitability: 17.8,
    },
    accountingEntries: {
      salesEntry: "",
      vatEntry: "",
      status: "Pending",
    },
    createdAt: "2024-03-01T10:00:00",
    updatedAt: "2024-03-01T10:00:00",
  },
  {
    id: "6",
    invoiceNumber: "FAC-2024-006",
    clientId: "4",
    clientName: "Hôpital Saint-Antoine",
    period: {
      start: "2024-01-01",
      end: "2024-01-31",
    },
    status: "Payée",
    planningHours: 960,
    realizedHours: 955,
    validatedHours: 955,
    normalHours: 920,
    overtimeHours: 35,
    replacements: 2,
    subtotal: 25480.0,
    vatRate: 5.5,
    vatAmount: 1401.4,
    total: 26881.4,
    variance: {
      planned: 960,
      realized: 955,
      difference: -5,
    },
    previewed: true,
    validatedBy: "Admin",
    validatedAt: "2024-02-01T11:00:00",
    issuedAt: "2024-02-01T11:30:00",
    sentAt: "2024-02-01T12:00:00",
    paymentDueDate: "2024-03-02",
    paidAt: "2024-02-25T10:00:00",
    adjustments: [
      {
        id: "adj-4",
        type: "Manual",
        amount: 300.0,
        reason: "Majoration heures de nuit supplémentaires",
        createdAt: "2024-02-01T10:45:00",
        createdBy: "Admin",
      },
    ],
    payrollAlignment: {
      hoursPaid: 955,
      hoursBillable: 955,
      variance: 0,
      profitability: 14.2,
    },
    accountingEntries: {
      salesEntry: "EC-2024-009",
      vatEntry: "EC-2024-010",
      status: "Exported",
    },
    createdAt: "2024-02-01T10:00:00",
    updatedAt: "2024-02-25T10:00:00",
  },
  {
    id: "7",
    invoiceNumber: "FAC-2024-007",
    clientId: "5",
    clientName: "Aéroport Charles de Gaulle",
    period: {
      start: "2024-01-01",
      end: "2024-01-31",
    },
    status: "Envoyée",
    planningHours: 1440,
    realizedHours: 1435,
    validatedHours: 1435,
    normalHours: 1400,
    overtimeHours: 35,
    replacements: 3,
    subtotal: 38450.0,
    vatRate: 20,
    vatAmount: 7690.0,
    total: 46140.0,
    variance: {
      planned: 1440,
      realized: 1435,
      difference: -5,
    },
    previewed: true,
    validatedBy: "Admin",
    validatedAt: "2024-02-01T16:00:00",
    issuedAt: "2024-02-01T16:30:00",
    sentAt: "2024-02-01T17:00:00",
    paymentDueDate: "2024-03-02",
    adjustments: [
      {
        id: "adj-5",
        type: "Exception",
        amount: 500.0,
        reason: "Refacturation remplacement urgent",
        createdAt: "2024-02-01T15:30:00",
        createdBy: "Admin",
      },
      {
        id: "adj-6",
        type: "Manual",
        amount: -200.0,
        reason: "Ajustement pour absence non remplacée",
        createdAt: "2024-02-01T15:45:00",
        createdBy: "Admin",
      },
    ],
    credits: [
      {
        id: "cred-2",
        creditNumber: "AVO-2024-002",
        amount: 1000.0,
        reason: "Avoir pour service non conforme période 10-15/01",
        createdAt: "2024-01-20T14:00:00",
      },
    ],
    payrollAlignment: {
      hoursPaid: 1435,
      hoursBillable: 1435,
      variance: 0,
      profitability: 19.5,
    },
    accountingEntries: {
      salesEntry: "EC-2024-011",
      vatEntry: "EC-2024-012",
      status: "Generated",
    },
    createdAt: "2024-02-01T15:00:00",
    updatedAt: "2024-02-01T17:00:00",
  },
  {
    id: "8",
    invoiceNumber: "FAC-2024-008",
    clientId: "3",
    clientName: "Entrepôt Logistique Gennevilliers",
    period: {
      start: "2024-02-01",
      end: "2024-02-29",
    },
    status: "En attente",
    planningHours: 240,
    realizedHours: 245,
    validatedHours: 245,
    normalHours: 240,
    overtimeHours: 5,
    replacements: 0,
    subtotal: 5390.0,
    vatRate: 10,
    vatAmount: 539.0,
    total: 5929.0,
    variance: {
      planned: 240,
      realized: 245,
      difference: 5,
    },
    previewed: false,
    payrollAlignment: {
      hoursPaid: 245,
      hoursBillable: 245,
      variance: 0,
      profitability: 13.5,
    },
    accountingEntries: {
      salesEntry: "",
      vatEntry: "",
      status: "Pending",
    },
    createdAt: "2024-03-01T11:00:00",
    updatedAt: "2024-03-01T11:00:00",
  },
];
