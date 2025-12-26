export interface PayrollVariable {
  id: string;
  code: string;
  name: string;
  category: "base" | "premium" | "deduction" | "benefit" | "other";
  type: "fixed" | "percentage" | "calculated" | "manual";
  value?: number;
  percentage?: number;
  formula?: string;
  appliesTo: string[]; // Employee IDs or "all"
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayrollPeriod {
  id: string;
  period: string; // Format: "YYYY-MM"
  status: "draft" | "validated" | "paid" | "locked";
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  employeeCount: number;
  validatedAt?: string;
  validatedBy?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockPayrollVariables: PayrollVariable[] = [
  {
    id: "VAR-001",
    code: "BASE_SALARY",
    name: "Salaire de base",
    category: "base",
    type: "fixed",
    appliesTo: ["all"],
    isActive: true,
    description: "Salaire de base mensuel",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "VAR-002",
    code: "NIGHT_PREMIUM",
    name: "Prime de nuit",
    category: "premium",
    type: "percentage",
    percentage: 25,
    appliesTo: ["all"],
    isActive: true,
    description: "Prime de 25% pour les heures de nuit",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "VAR-003",
    code: "SUNDAY_PREMIUM",
    name: "Prime dimanche",
    category: "premium",
    type: "percentage",
    percentage: 50,
    appliesTo: ["all"],
    isActive: true,
    description: "Prime de 50% pour les heures travaillées le dimanche",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "VAR-004",
    code: "OVERTIME_25",
    name: "Heures supplémentaires 25%",
    category: "premium",
    type: "percentage",
    percentage: 25,
    appliesTo: ["all"],
    isActive: true,
    description: "Majoration de 25% pour les heures supplémentaires",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "VAR-005",
    code: "OVERTIME_50",
    name: "Heures supplémentaires 50%",
    category: "premium",
    type: "percentage",
    percentage: 50,
    appliesTo: ["all"],
    isActive: true,
    description: "Majoration de 50% pour les heures supplémentaires",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "VAR-006",
    code: "TRANSPORT_ALLOWANCE",
    name: "Indemnité transport",
    category: "benefit",
    type: "fixed",
    value: 50,
    appliesTo: ["all"],
    isActive: true,
    description: "Indemnité mensuelle de transport",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "VAR-007",
    code: "MEAL_VOUCHER",
    name: "Tickets restaurant",
    category: "benefit",
    type: "fixed",
    value: 8,
    appliesTo: ["all"],
    isActive: true,
    description: "Valeur unitaire des tickets restaurant",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "VAR-008",
    code: "SOCIAL_SECURITY",
    name: "Cotisations sociales",
    category: "deduction",
    type: "percentage",
    percentage: 22,
    appliesTo: ["all"],
    isActive: true,
    description: "Taux de cotisations sociales salariales",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "VAR-009",
    code: "TEAM_LEADER_BONUS",
    name: "Prime chef d'équipe",
    category: "premium",
    type: "fixed",
    value: 200,
    appliesTo: ["2"],
    isActive: true,
    description: "Prime mensuelle pour les chefs d'équipe",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
];

export const mockPayrollPeriods: PayrollPeriod[] = [
  {
    id: "PERIOD-2024-12",
    period: "2024-12",
    status: "validated",
    totalGross: 245000,
    totalNet: 191100,
    totalDeductions: 53900,
    employeeCount: 12,
    validatedAt: "2024-12-20",
    validatedBy: "Sophie Dubois",
    createdAt: "2024-12-01",
    updatedAt: "2024-12-20",
  },
  {
    id: "PERIOD-2024-11",
    period: "2024-11",
    status: "paid",
    totalGross: 240000,
    totalNet: 187200,
    totalDeductions: 52800,
    employeeCount: 12,
    validatedAt: "2024-11-20",
    validatedBy: "Sophie Dubois",
    paidAt: "2024-11-25",
    createdAt: "2024-11-01",
    updatedAt: "2024-11-25",
  },
  {
    id: "PERIOD-2024-10",
    period: "2024-10",
    status: "paid",
    totalGross: 238000,
    totalNet: 185640,
    totalDeductions: 52360,
    employeeCount: 12,
    validatedAt: "2024-10-20",
    validatedBy: "Sophie Dubois",
    paidAt: "2024-10-25",
    createdAt: "2024-10-01",
    updatedAt: "2024-10-25",
  },
];


