export interface Warning {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  type: "oral" | "written" | "final";
  reason: string;
  description: string;
  date: string;
  issuedBy: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Suspension {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  startDate: string;
  endDate: string;
  duration: number; // days
  reason: string;
  description: string;
  type: "precautionary" | "disciplinary";
  issuedBy: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DisciplinaryProcedure {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  type: "warning" | "suspension" | "dismissal" | "other";
  status: "pending" | "in_progress" | "resolved" | "cancelled";
  reason: string;
  description: string;
  openedAt: string;
  openedBy: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
  warnings: string[]; // Warning IDs
  suspensions: string[]; // Suspension IDs
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Sanction {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  type: "warning" | "suspension" | "dismissal" | "other";
  date: string;
  reason: string;
  description: string;
  issuedBy: string;
  severity: "low" | "medium" | "high" | "critical";
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export const mockWarnings: Warning[] = [
  {
    id: "WARN-001",
    employeeId: "12",
    employeeName: "Céline Garnier",
    employeeNumber: "EMP012",
    type: "written",
    reason: "Retards répétés",
    description: "Plusieurs retards constatés au cours du mois de novembre. Avertissement écrit.",
    date: "2024-11-15",
    issuedBy: "Marie Martin",
    acknowledged: true,
    acknowledgedAt: "2024-11-16",
    documents: ["avertissement_ecrit_cegarnier_2024.pdf"],
    createdAt: "2024-11-15",
    updatedAt: "2024-11-16",
  },
  {
    id: "WARN-002",
    employeeId: "3",
    employeeName: "Pierre Bernard",
    employeeNumber: "EMP003",
    type: "oral",
    reason: "Non-respect des procédures",
    description: "Rappel oral concernant le respect des procédures de sécurité.",
    date: "2024-12-10",
    issuedBy: "Sophie Dubois",
    acknowledged: false,
    documents: [],
    createdAt: "2024-12-10",
    updatedAt: "2024-12-10",
  },
  {
    id: "WARN-003",
    employeeId: "5",
    employeeName: "Luc Moreau",
    employeeNumber: "EMP005",
    type: "final",
    reason: "Absences non justifiées",
    description: "Avertissement final suite à des absences non justifiées répétées.",
    date: "2024-10-20",
    issuedBy: "Marie Martin",
    acknowledged: true,
    acknowledgedAt: "2024-10-21",
    documents: ["avertissement_final_luc_moreau_2024.pdf"],
    createdAt: "2024-10-20",
    updatedAt: "2024-10-21",
  },
];

export const mockSuspensions: Suspension[] = [
  {
    id: "SUSP-001",
    employeeId: "12",
    employeeName: "Céline Garnier",
    employeeNumber: "EMP012",
    startDate: "2024-12-01",
    endDate: "2024-12-15",
    duration: 14,
    reason: "Mesure disciplinaire",
    description: "Suspension de 14 jours suite à manquements répétés aux obligations professionnelles.",
    type: "disciplinary",
    issuedBy: "Sophie Dubois",
    documents: ["decision_suspension_cegarnier_2024.pdf"],
    createdAt: "2024-11-28",
    updatedAt: "2024-12-01",
  },
];

export const mockDisciplinaryProcedures: DisciplinaryProcedure[] = [
  {
    id: "PROC-001",
    employeeId: "12",
    employeeName: "Céline Garnier",
    employeeNumber: "EMP012",
    type: "suspension",
    status: "resolved",
    reason: "Manquements répétés aux obligations professionnelles",
    description: "Procédure disciplinaire ouverte suite à retards répétés et absences non justifiées.",
    openedAt: "2024-11-01",
    openedBy: "Sophie Dubois",
    resolvedAt: "2024-12-15",
    resolvedBy: "Sophie Dubois",
    resolution: "Suspension de 14 jours prononcée. Retour au travail avec période d'observation de 3 mois.",
    warnings: ["WARN-001"],
    suspensions: ["SUSP-001"],
    documents: ["procedure_disciplinaire_cegarnier_2024.pdf"],
    createdAt: "2024-11-01",
    updatedAt: "2024-12-15",
  },
  {
    id: "PROC-002",
    employeeId: "5",
    employeeName: "Luc Moreau",
    employeeNumber: "EMP005",
    type: "warning",
    status: "in_progress",
    reason: "Absences non justifiées",
    description: "Procédure en cours suite à absences répétées non justifiées.",
    openedAt: "2024-10-15",
    openedBy: "Marie Martin",
    warnings: ["WARN-003"],
    suspensions: [],
    documents: [],
    createdAt: "2024-10-15",
    updatedAt: "2024-12-20",
  },
];

export const mockSanctions: Sanction[] = [
  {
    id: "SANC-001",
    employeeId: "12",
    employeeName: "Céline Garnier",
    employeeNumber: "EMP012",
    type: "suspension",
    date: "2024-12-01",
    reason: "Manquements répétés",
    description: "Suspension de 14 jours",
    issuedBy: "Sophie Dubois",
    severity: "high",
    documents: ["decision_suspension_cegarnier_2024.pdf"],
    createdAt: "2024-12-01",
    updatedAt: "2024-12-01",
  },
  {
    id: "SANC-002",
    employeeId: "3",
    employeeName: "Pierre Bernard",
    employeeNumber: "EMP003",
    type: "warning",
    date: "2024-12-10",
    reason: "Non-respect des procédures",
    description: "Avertissement oral",
    issuedBy: "Sophie Dubois",
    severity: "low",
    documents: [],
    createdAt: "2024-12-10",
    updatedAt: "2024-12-10",
  },
  {
    id: "SANC-003",
    employeeId: "5",
    employeeName: "Luc Moreau",
    employeeNumber: "EMP005",
    type: "warning",
    date: "2024-10-20",
    reason: "Absences non justifiées",
    description: "Avertissement final",
    issuedBy: "Marie Martin",
    severity: "medium",
    documents: ["avertissement_final_luc_moreau_2024.pdf"],
    createdAt: "2024-10-20",
    updatedAt: "2024-10-20",
  },
];


