export interface Contract {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  type: "CDI" | "CDD" | "CDI_TEMPORAIRE" | "STAGE" | "APPRENTISSAGE";
  startDate: string;
  endDate?: string;
  position: string;
  department: string;
  baseSalary: number;
  workingHours: number;
  status: "active" | "ended" | "suspended" | "pending";
  signedAt?: string;
  signedBy?: string;
  documents: string[];
  amendments: Amendment[];
  createdAt: string;
  updatedAt: string;
}

export interface Amendment {
  id: string;
  contractId: string;
  type: "salary" | "position" | "hours" | "other";
  description: string;
  effectiveDate: string;
  changes: Record<string, unknown>;
  signedAt?: string;
  signedBy?: string;
  status: "pending" | "signed" | "cancelled";
  createdAt: string;
}

export const mockContracts: Contract[] = [
  {
    id: "CT-001",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    type: "CDI",
    startDate: "2020-01-15",
    position: "Agent de sécurité",
    department: "Sécurité",
    baseSalary: 2400,
    workingHours: 35,
    status: "active",
    signedAt: "2020-01-10",
    signedBy: "Sophie Dubois",
    documents: ["contrat_cdi_jean_dupont.pdf", "avenant_salaire_2023.pdf"],
    amendments: [
      {
        id: "AM-001",
        contractId: "CT-001",
        type: "salary",
        description: "Augmentation salariale annuelle",
        effectiveDate: "2023-01-15",
        changes: { baseSalary: 2500 },
        signedAt: "2023-01-10",
        signedBy: "Sophie Dubois",
        status: "signed",
        createdAt: "2023-01-05",
      },
    ],
    createdAt: "2020-01-10",
    updatedAt: "2023-01-15",
  },
  {
    id: "CT-002",
    employeeId: "2",
    employeeName: "Marie Martin",
    employeeNumber: "EMP002",
    type: "CDI",
    startDate: "2019-03-10",
    position: "Chef d'équipe",
    department: "Sécurité",
    baseSalary: 3200,
    workingHours: 35,
    status: "active",
    signedAt: "2019-03-05",
    signedBy: "Sophie Dubois",
    documents: ["contrat_cdi_marie_martin.pdf"],
    amendments: [],
    createdAt: "2019-03-05",
    updatedAt: "2019-03-10",
  },
  {
    id: "CT-003",
    employeeId: "10",
    employeeName: "Julie Laurent",
    employeeNumber: "EMP010",
    type: "CDD",
    startDate: "2024-03-01",
    endDate: "2025-02-28",
    position: "Agent de sécurité",
    department: "Sécurité",
    baseSalary: 2400,
    workingHours: 35,
    status: "active",
    signedAt: "2024-02-25",
    signedBy: "Sophie Dubois",
    documents: ["contrat_cdd_julie_laurent.pdf"],
    amendments: [],
    createdAt: "2024-02-25",
    updatedAt: "2024-03-01",
  },
  {
    id: "CT-004",
    employeeId: "7",
    employeeName: "Thomas Roux",
    employeeNumber: "EMP007",
    type: "APPRENTISSAGE",
    startDate: "2023-09-01",
    endDate: "2025-08-31",
    position: "Apprenti Agent de sécurité",
    department: "Formation",
    baseSalary: 1200,
    workingHours: 35,
    status: "active",
    signedAt: "2023-08-25",
    signedBy: "Sophie Dubois",
    documents: ["contrat_apprentissage_thomas_roux.pdf"],
    amendments: [],
    createdAt: "2023-08-25",
    updatedAt: "2023-09-01",
  },
];

export const mockAmendments: Amendment[] = [
  {
    id: "AM-001",
    contractId: "CT-001",
    type: "salary",
    description: "Augmentation salariale annuelle",
    effectiveDate: "2023-01-15",
    changes: { baseSalary: 2500 },
    signedAt: "2023-01-10",
    signedBy: "Sophie Dubois",
    status: "signed",
    createdAt: "2023-01-05",
  },
  {
    id: "AM-002",
    contractId: "CT-002",
    type: "position",
    description: "Promotion au poste de Chef d'équipe",
    effectiveDate: "2022-06-01",
    changes: { position: "Chef d'équipe", baseSalary: 3200 },
    signedAt: "2022-05-25",
    signedBy: "Sophie Dubois",
    status: "signed",
    createdAt: "2022-05-20",
  },
  {
    id: "AM-003",
    contractId: "CT-001",
    type: "hours",
    description: "Modification des horaires de travail",
    effectiveDate: "2024-01-01",
    changes: { workingHours: 39 },
    status: "pending",
    createdAt: "2023-12-15",
  },
];

