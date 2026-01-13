export interface OffboardingProcess {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  contractEndDate: string;
  noticePeriodStart: string;
  noticePeriodEnd: string;
  reason:
    | "resignation"
    | "end_of_contract"
    | "dismissal"
    | "retirement"
    | "other";
  status: "En cours" | "Terminé" | "Annulé";
  equipmentReturned: boolean;
  equipmentReturnDate?: string;
  documentsGenerated: {
    workCertificate: boolean;
    poleEmploiCertificate: boolean;
    finalSettlement: boolean;
  };
  payrollExported: boolean;
  fileArchived: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockOffboardingProcesses: OffboardingProcess[] = [
  {
    id: "OFF-001",
    employeeId: "11",
    employeeName: "Michel Blanc",
    employeeNumber: "EMP011",
    contractEndDate: "2024-12-31",
    noticePeriodStart: "2024-11-01",
    noticePeriodEnd: "2024-12-31",
    reason: "retirement",
    status: "En cours",
    equipmentReturned: false,
    documentsGenerated: {
      workCertificate: false,
      poleEmploiCertificate: false,
      finalSettlement: false,
    },
    payrollExported: false,
    fileArchived: false,
    notes: "Départ à la retraite. Processus en cours.",
    createdAt: "2024-10-15",
    updatedAt: "2024-12-20",
  },
  {
    id: "OFF-002",
    employeeId: "12",
    employeeName: "Céline Garnier",
    employeeNumber: "EMP012",
    contractEndDate: "2024-11-30",
    noticePeriodStart: "2024-10-01",
    noticePeriodEnd: "2024-11-30",
    reason: "dismissal",
    status: "Terminé",
    equipmentReturned: true,
    equipmentReturnDate: "2024-11-28",
    documentsGenerated: {
      workCertificate: true,
      poleEmploiCertificate: true,
      finalSettlement: true,
    },
    payrollExported: true,
    fileArchived: true,
    notes: "Processus terminé. Tous les documents générés.",
    createdAt: "2024-09-15",
    updatedAt: "2024-11-30",
  },
  {
    id: "OFF-003",
    employeeId: "13",
    employeeName: "Nicolas Petit",
    employeeNumber: "EMP013",
    contractEndDate: "2025-07-14",
    noticePeriodStart: "2025-06-14",
    noticePeriodEnd: "2025-07-14",
    reason: "end_of_contract",
    status: "En cours",
    equipmentReturned: false,
    documentsGenerated: {
      workCertificate: false,
      poleEmploiCertificate: false,
      finalSettlement: false,
    },
    payrollExported: false,
    fileArchived: false,
    notes: "Fin de CDD. Processus à démarrer en juin 2025.",
    createdAt: "2025-01-15",
    updatedAt: "2025-01-15",
  },
];
