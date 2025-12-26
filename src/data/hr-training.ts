export interface TrainingCertification {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  type: "SSIAP1" | "SSIAP2" | "SSIAP3" | "SST" | "H0B0" | "CACES" | "OTHER";
  level?: string;
  number: string;
  issueDate: string;
  expiryDate: string;
  issuer: string;
  status: "valid" | "expired" | "expiring-soon";
  validated: boolean;
  validatedBy?: string;
  validatedAt?: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TrainingPlan {
  id: string;
  year: number;
  employeeId: string;
  employeeName: string;
  trainingType: string;
  plannedDate: string;
  duration: number; // hours
  provider: string;
  estimatedCost: number;
  status: "planned" | "confirmed" | "completed" | "cancelled";
  completedDate?: string;
  actualCost?: number;
  certificateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrainingAlert {
  id: string;
  employeeId: string;
  employeeName: string;
  certificationId: string;
  certificationType: string;
  expiryDate: string;
  daysUntilExpiry: number;
  alertLevel: "info" | "warning" | "critical";
  notified: boolean;
  notifiedAt?: string;
  createdAt: string;
}

export const mockTrainingCertifications: TrainingCertification[] = [
  {
    id: "CERT-001",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    type: "SSIAP1",
    level: "1",
    number: "SSIAP-2023-001",
    issueDate: "2023-01-15",
    expiryDate: "2025-01-15",
    issuer: "CNAPS",
    status: "expiring-soon",
    validated: true,
    validatedBy: "Admin",
    validatedAt: "2023-01-15",
    documents: ["certificat_ssiap1_jean_dupont.pdf"],
    createdAt: "2023-01-15",
    updatedAt: "2023-01-15",
  },
  {
    id: "CERT-002",
    employeeId: "2",
    employeeName: "Marie Martin",
    employeeNumber: "EMP002",
    type: "SST",
    number: "SST-2023-002",
    issueDate: "2023-06-01",
    expiryDate: "2025-06-01",
    issuer: "INRS",
    status: "expiring-soon",
    validated: true,
    validatedBy: "Admin",
    validatedAt: "2023-06-01",
    documents: ["certificat_sst_marie_martin.pdf"],
    createdAt: "2023-06-01",
    updatedAt: "2023-06-01",
  },
  {
    id: "CERT-003",
    employeeId: "6",
    employeeName: "Claire Petit",
    employeeNumber: "EMP006",
    type: "SSIAP2",
    level: "2",
    number: "SSIAP-2022-003",
    issueDate: "2022-03-20",
    expiryDate: "2024-03-20",
    issuer: "CNAPS",
    status: "expired",
    validated: true,
    validatedBy: "Admin",
    validatedAt: "2022-03-20",
    documents: ["certificat_ssiap2_claire_petit.pdf"],
    createdAt: "2022-03-20",
    updatedAt: "2024-03-20",
  },
  {
    id: "CERT-004",
    employeeId: "7",
    employeeName: "Thomas Roux",
    employeeNumber: "EMP007",
    type: "SST",
    number: "SST-2024-004",
    issueDate: "2024-01-10",
    expiryDate: "2026-01-10",
    issuer: "INRS",
    status: "valid",
    validated: true,
    validatedBy: "Admin",
    validatedAt: "2024-01-10",
    documents: ["certificat_sst_thomas_roux.pdf"],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
  },
  {
    id: "CERT-005",
    employeeId: "9",
    employeeName: "Alexandre Simon",
    employeeNumber: "EMP009",
    type: "H0B0",
    number: "H0B0-2023-005",
    issueDate: "2023-05-15",
    expiryDate: "2025-05-15",
    issuer: "Organisme agréé",
    status: "valid",
    validated: true,
    validatedBy: "Admin",
    validatedAt: "2023-05-15",
    documents: ["certificat_h0b0_alexandre_simon.pdf"],
    createdAt: "2023-05-15",
    updatedAt: "2023-05-15",
  },
  {
    id: "CERT-006",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    type: "SST",
    number: "SST-2022-006",
    issueDate: "2022-08-20",
    expiryDate: "2024-08-20",
    issuer: "INRS",
    status: "expired",
    validated: true,
    validatedBy: "Admin",
    validatedAt: "2022-08-20",
    documents: ["certificat_sst_jean_dupont.pdf"],
    createdAt: "2022-08-20",
    updatedAt: "2024-08-20",
  },
];

export const mockTrainingPlans: TrainingPlan[] = [
  {
    id: "PLAN-001",
    year: 2025,
    employeeId: "1",
    employeeName: "Jean Dupont",
    trainingType: "SSIAP1 - Recyclage",
    plannedDate: "2025-01-10",
    duration: 21,
    provider: "Centre de Formation SSIAP",
    estimatedCost: 1200,
    status: "confirmed",
    createdAt: "2024-12-01",
    updatedAt: "2024-12-15",
  },
  {
    id: "PLAN-002",
    year: 2025,
    employeeId: "3",
    employeeName: "Pierre Bernard",
    trainingType: "SST - Initial",
    plannedDate: "2025-02-15",
    duration: 14,
    provider: "INRS",
    estimatedCost: 800,
    status: "planned",
    createdAt: "2024-12-10",
    updatedAt: "2024-12-10",
  },
  {
    id: "PLAN-003",
    year: 2024,
    employeeId: "2",
    employeeName: "Marie Martin",
    trainingType: "Formation Management",
    plannedDate: "2024-11-20",
    duration: 35,
    provider: "Organisme de formation",
    estimatedCost: 2500,
    status: "completed",
    completedDate: "2024-11-20",
    actualCost: 2500,
    certificateId: "CERT-MGMT-001",
    createdAt: "2024-10-01",
    updatedAt: "2024-11-25",
  },
];

export const mockTrainingAlerts: TrainingAlert[] = [
  {
    id: "ALERT-001",
    employeeId: "1",
    employeeName: "Jean Dupont",
    certificationId: "CERT-001",
    certificationType: "SSIAP1",
    expiryDate: "2025-01-15",
    daysUntilExpiry: 22,
    alertLevel: "warning",
    notified: true,
    notifiedAt: "2024-12-20",
    createdAt: "2024-12-20",
  },
  {
    id: "ALERT-002",
    employeeId: "2",
    employeeName: "Marie Martin",
    certificationId: "CERT-002",
    certificationType: "SST",
    expiryDate: "2025-06-01",
    daysUntilExpiry: 159,
    alertLevel: "info",
    notified: false,
    createdAt: "2024-12-24",
  },
  {
    id: "ALERT-003",
    employeeId: "6",
    employeeName: "Claire Petit",
    certificationId: "CERT-003",
    certificationType: "SSIAP2",
    expiryDate: "2024-03-20",
    daysUntilExpiry: -279,
    alertLevel: "critical",
    notified: true,
    notifiedAt: "2024-03-15",
    createdAt: "2024-03-15",
  },
];


