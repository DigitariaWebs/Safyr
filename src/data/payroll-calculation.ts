import {
  PayrollCalculationRun,
  EmployeePayrollCalculation,
  SalaryElement,
  SocialContributionDetail,
  PaySlip,
  DSNDeclaration,
} from "@/lib/types";

// Mock salary elements templates
export const createBaseSalaryElement = (baseAmount: number): SalaryElement => ({
  id: "base-1",
  code: "SAL_BASE",
  label: "Salaire de base",
  type: "earning",
  category: "base",
  quantity: 151.67,
  rate: baseAmount / 151.67,
  amount: baseAmount,
  taxable: true,
  subjectToContributions: true,
});

export const createHoursElement = (
  code: string,
  label: string,
  hours: number,
  rate: number,
): SalaryElement => ({
  id: `hours-${code}`,
  code,
  label,
  type: "earning",
  category: hours > 151.67 ? "overtime" : "hours",
  quantity: hours,
  rate,
  amount: hours * rate,
  taxable: true,
  subjectToContributions: true,
});

export const createBonusElement = (
  code: string,
  label: string,
  amount: number,
): SalaryElement => ({
  id: `bonus-${code}`,
  code,
  label,
  type: "earning",
  category: "bonus",
  amount,
  taxable: true,
  subjectToContributions: true,
});

export const createAllowanceElement = (
  code: string,
  label: string,
  quantity: number,
  rate: number,
): SalaryElement => ({
  id: `allowance-${code}`,
  code,
  label,
  type: "earning",
  category: "allowance",
  quantity,
  rate,
  amount: quantity * rate,
  taxable: false,
  subjectToContributions: false,
});

export const createAbsenceElement = (
  code: string,
  label: string,
  hours: number,
  rate: number,
): SalaryElement => ({
  id: `absence-${code}`,
  code,
  label,
  type: "deduction",
  category: "absence",
  quantity: hours,
  rate,
  amount: -(hours * rate),
  taxable: true,
  subjectToContributions: true,
});

// Mock social contributions
export const createEmployeeContributions = (
  grossSalary: number,
): SocialContributionDetail[] => {
  const plafondSS = 3864; // Plafond mensuel SS 2024
  const baseTrancheA = Math.min(grossSalary, plafondSS);
  const baseTrancheB = Math.max(0, grossSalary - plafondSS);

  return [
    {
      id: "emp-health",
      code: "S21.G05.00.001",
      label: "Assurance maladie",
      type: "employee",
      category: "health",
      baseAmount: grossSalary,
      rate: 0,
      amount: 0,
      tranche: "A",
    },
    {
      id: "emp-retirement-t1",
      code: "S21.G05.00.002",
      label: "Retraite Tranche 1",
      type: "employee",
      category: "retirement",
      baseAmount: baseTrancheA,
      rate: 6.9,
      amount: baseTrancheA * 0.069,
      ceiling: plafondSS,
      tranche: "A",
    },
    {
      id: "emp-retirement-t2",
      code: "S21.G05.00.003",
      label: "Retraite Tranche 2",
      type: "employee",
      category: "retirement",
      baseAmount: baseTrancheB,
      rate: 8.64,
      amount: baseTrancheB * 0.0864,
      tranche: "B",
    },
    {
      id: "emp-unemployment",
      code: "S21.G05.00.004",
      label: "Assurance chômage",
      type: "employee",
      category: "unemployment",
      baseAmount: grossSalary,
      rate: 0,
      amount: 0,
    },
    {
      id: "emp-csg-deductible",
      code: "S21.G05.00.010",
      label: "CSG déductible",
      type: "employee",
      category: "csg",
      baseAmount: grossSalary * 0.9825,
      rate: 6.8,
      amount: grossSalary * 0.9825 * 0.068,
    },
    {
      id: "emp-csg-non-deductible",
      code: "S21.G05.00.011",
      label: "CSG non déductible",
      type: "employee",
      category: "csg",
      baseAmount: grossSalary * 0.9825,
      rate: 2.4,
      amount: grossSalary * 0.9825 * 0.024,
    },
    {
      id: "emp-crds",
      code: "S21.G05.00.012",
      label: "CRDS",
      type: "employee",
      category: "crds",
      baseAmount: grossSalary * 0.9825,
      rate: 0.5,
      amount: grossSalary * 0.9825 * 0.005,
    },
  ];
};

export const createEmployerContributions = (
  grossSalary: number,
): SocialContributionDetail[] => {
  const plafondSS = 3864;
  const baseTrancheA = Math.min(grossSalary, plafondSS);
  const baseTrancheB = Math.max(0, grossSalary - plafondSS);

  return [
    {
      id: "empr-health",
      code: "S21.G05.00.020",
      label: "Assurance maladie",
      type: "employer",
      category: "health",
      baseAmount: grossSalary,
      rate: 13.0,
      amount: grossSalary * 0.13,
    },
    {
      id: "empr-retirement-t1",
      code: "S21.G05.00.021",
      label: "Retraite Tranche 1",
      type: "employer",
      category: "retirement",
      baseAmount: baseTrancheA,
      rate: 8.55,
      amount: baseTrancheA * 0.0855,
      ceiling: plafondSS,
      tranche: "A",
    },
    {
      id: "empr-retirement-t2",
      code: "S21.G05.00.022",
      label: "Retraite Tranche 2",
      type: "employer",
      category: "retirement",
      baseAmount: baseTrancheB,
      rate: 12.95,
      amount: baseTrancheB * 0.1295,
      tranche: "B",
    },
    {
      id: "empr-unemployment",
      code: "S21.G05.00.023",
      label: "Assurance chômage",
      type: "employer",
      category: "unemployment",
      baseAmount: Math.min(grossSalary, plafondSS * 4),
      rate: 4.05,
      amount: Math.min(grossSalary, plafondSS * 4) * 0.0405,
    },
    {
      id: "empr-family",
      code: "S21.G05.00.024",
      label: "Allocations familiales",
      type: "employer",
      category: "family",
      baseAmount: grossSalary,
      rate: grossSalary <= plafondSS * 3.5 ? 3.45 : 5.25,
      amount: grossSalary * (grossSalary <= plafondSS * 3.5 ? 0.0345 : 0.0525),
    },
    {
      id: "empr-accident",
      code: "S21.G05.00.025",
      label: "Accidents du travail",
      type: "employer",
      category: "accident",
      baseAmount: grossSalary,
      rate: 1.8,
      amount: grossSalary * 0.018,
    },
  ];
};

// Mock employee calculations
export const mockEmployeeCalculations: EmployeePayrollCalculation[] = [
  {
    id: "calc-001",
    employeeId: "emp-001",
    employeeName: "Dubois Jean",
    employeeNumber: "AG001",
    period: "2024-12",
    status: "calculated",
    position: "Agent de Sécurité",
    contractType: "CDI",
    salaryElements: [
      createBaseSalaryElement(2100),
      createHoursElement("H_NUIT", "Heures de nuit", 24, 15.5),
      createHoursElement("H_DIM", "Heures dimanche", 8, 18.5),
      createBonusElement("PRIME_ANNU", "Prime d'ancienneté", 150),
      createAllowanceElement("PANIER", "Paniers repas", 20, 8.0),
    ],
    grossSalary: 2770,
    employeeContributions: createEmployeeContributions(2770),
    totalEmployeeContributions: 597.82,
    netSalary: 2172.18,
    netTaxable: 2313.51,
    netTaxableYTD: 27762.12,
    netToPay: 2332.18,
    employerContributions: createEmployerContributions(2770),
    totalEmployerContributions: 1159.45,
    totalCost: 3929.45,
    calculatedAt: new Date("2024-12-20T10:30:00"),
    calculatedBy: "admin@safyr.com",
    errors: [],
    warnings: [],
  },
  {
    id: "calc-002",
    employeeId: "emp-002",
    employeeName: "Martin Sophie",
    employeeNumber: "AG002",
    period: "2024-12",
    status: "calculated",
    position: "Agent de Sécurité",
    contractType: "CDI",
    salaryElements: [
      createBaseSalaryElement(2200),
      createHoursElement("H_NUIT", "Heures de nuit", 16, 16.0),
      createHoursElement("H_SUPP_25", "Heures supp. 25%", 8, 18.5),
      createBonusElement("PRIME_PERF", "Prime de performance", 200),
      createAllowanceElement("PANIER", "Paniers repas", 22, 8.0),
      createAbsenceElement("ABS_MALADIE", "Absence maladie", -16, 14.5),
    ],
    grossSalary: 2892,
    employeeContributions: createEmployeeContributions(2892),
    totalEmployeeContributions: 623.89,
    netSalary: 2268.11,
    netTaxable: 2415.44,
    netTaxableYTD: 28985.28,
    netToPay: 2444.11,
    employerContributions: createEmployerContributions(2892),
    totalEmployerContributions: 1210.56,
    totalCost: 4102.56,
    ijssAmount: 232.0,
    ijssDeduction: 232.0,
    salaryMaintenance: 232.0,
    calculatedAt: new Date("2024-12-20T10:31:00"),
    calculatedBy: "admin@safyr.com",
    errors: [],
    warnings: ["Absence maladie avec maintien de salaire appliqué"],
  },
  {
    id: "calc-003",
    employeeId: "emp-003",
    employeeName: "Bernard Thomas",
    employeeNumber: "CH001",
    period: "2024-12",
    status: "calculated",
    position: "Chef d'Équipe",
    contractType: "CDI",
    salaryElements: [
      createBaseSalaryElement(2800),
      createHoursElement("H_NUIT", "Heures de nuit", 12, 20.0),
      createHoursElement("H_FERIE", "Heures fériées", 8, 28.0),
      createBonusElement("PRIME_RESP", "Prime de responsabilité", 300),
      createAllowanceElement("PANIER", "Paniers repas", 22, 8.0),
    ],
    grossSalary: 3564,
    employeeContributions: createEmployeeContributions(3564),
    totalEmployeeContributions: 768.54,
    netSalary: 2795.46,
    netTaxable: 2964.13,
    netTaxableYTD: 35569.56,
    netToPay: 2971.46,
    employerContributions: createEmployerContributions(3564),
    totalEmployerContributions: 1491.28,
    totalCost: 5055.28,
    calculatedAt: new Date("2024-12-20T10:32:00"),
    calculatedBy: "admin@safyr.com",
    errors: [],
    warnings: [],
  },
  {
    id: "calc-004",
    employeeId: "emp-004",
    employeeName: "Petit Marie",
    employeeNumber: "AG003",
    period: "2024-12",
    status: "error",
    position: "Agent de Sécurité",
    contractType: "CDI",
    salaryElements: [createBaseSalaryElement(2050)],
    grossSalary: 2050,
    employeeContributions: createEmployeeContributions(2050),
    totalEmployeeContributions: 442.18,
    netSalary: 1607.82,
    netTaxable: 1722.35,
    netTaxableYTD: 20668.2,
    netToPay: 1607.82,
    employerContributions: createEmployerContributions(2050),
    totalEmployerContributions: 857.93,
    totalCost: 2907.93,
    calculatedAt: new Date("2024-12-20T10:33:00"),
    calculatedBy: "admin@safyr.com",
    errors: [
      "Heures de planning manquantes",
      "Aucune donnée d'import depuis le module Planning",
    ],
    warnings: ["Salaire en dessous de la moyenne du poste"],
  },
  {
    id: "calc-005",
    employeeId: "emp-005",
    employeeName: "Lefebvre Paul",
    employeeNumber: "AG004",
    period: "2024-12",
    status: "validated",
    position: "Agent de Sécurité",
    contractType: "CDD",
    salaryElements: [
      createBaseSalaryElement(2150),
      createHoursElement("H_NUIT", "Heures de nuit", 20, 15.8),
      createHoursElement("H_DIM", "Heures dimanche", 7, 18.5),
      createBonusElement("PRIME_PRECA", "Prime de précarité", 215),
      createAllowanceElement("PANIER", "Paniers repas", 21, 8.0),
    ],
    grossSalary: 2860.5,
    employeeContributions: createEmployeeContributions(2860.5),
    totalEmployeeContributions: 617.05,
    netSalary: 2243.45,
    netTaxable: 2389.28,
    netTaxableYTD: 14335.68,
    netToPay: 2411.45,
    employerContributions: createEmployerContributions(2860.5),
    totalEmployerContributions: 1197.09,
    totalCost: 4057.59,
    calculatedAt: new Date("2024-12-20T10:34:00"),
    calculatedBy: "admin@safyr.com",
    validatedAt: new Date("2024-12-20T11:15:00"),
    validatedBy: "manager@safyr.com",
    errors: [],
    warnings: [],
  },
  {
    id: "calc-006",
    employeeId: "emp-006",
    employeeName: "Rousseau Julie",
    employeeNumber: "AG005",
    period: "2024-12",
    status: "pending",
    position: "Agent de Sécurité",
    contractType: "CDI",
    salaryElements: [],
    grossSalary: 0,
    employeeContributions: [],
    totalEmployeeContributions: 0,
    netSalary: 0,
    netTaxable: 0,
    netTaxableYTD: 0,
    netToPay: 0,
    employerContributions: [],
    totalEmployerContributions: 0,
    totalCost: 0,
    errors: [],
    warnings: [],
  },
];

// Mock calculation run
export const mockCalculationRun: PayrollCalculationRun = {
  id: "run-2024-12",
  period: "2024-12",
  periodLabel: "Décembre 2024",
  status: "calculated",
  totalEmployees: 6,
  calculatedEmployees: 4,
  pendingEmployees: 1,
  errorEmployees: 1,
  validatedEmployees: 1,
  totalGrossSalary: 14136.5,
  totalNetSalary: 11086.82,
  totalEmployeeContributions: 3049.48,
  totalEmployerContributions: 5916.31,
  totalCost: 20052.81,
  startedAt: new Date("2024-12-20T10:30:00"),
  startedBy: "admin@safyr.com",
  completedAt: new Date("2024-12-20T10:35:00"),
  calculations: mockEmployeeCalculations,
};

// Mock pay slips
export const mockPaySlips: PaySlip[] = [
  {
    id: "slip-001",
    employeeId: "emp-001",
    employeeName: "Dubois Jean",
    period: "2024-12",
    calculationId: "calc-001",
    status: "sent",
    generatedAt: new Date("2024-12-20T12:00:00"),
    sentAt: new Date("2024-12-20T12:05:00"),
    sentTo: "j.dubois@example.com",
    viewedAt: new Date("2024-12-20T14:30:00"),
  },
  {
    id: "slip-002",
    employeeId: "emp-002",
    employeeName: "Martin Sophie",
    period: "2024-12",
    calculationId: "calc-002",
    status: "sent",
    generatedAt: new Date("2024-12-20T12:00:00"),
    sentAt: new Date("2024-12-20T12:05:00"),
    sentTo: "s.martin@example.com",
  },
  {
    id: "slip-003",
    employeeId: "emp-003",
    employeeName: "Bernard Thomas",
    period: "2024-12",
    calculationId: "calc-003",
    status: "generated",
    generatedAt: new Date("2024-12-20T12:00:00"),
  },
  {
    id: "slip-005",
    employeeId: "emp-005",
    employeeName: "Lefebvre Paul",
    period: "2024-12",
    calculationId: "calc-005",
    status: "sent",
    generatedAt: new Date("2024-12-20T12:00:00"),
    sentAt: new Date("2024-12-20T12:05:00"),
    sentTo: "p.lefebvre@example.com",
    viewedAt: new Date("2024-12-20T15:10:00"),
  },
];

// Mock DSN declaration
export const mockDSNDeclaration: DSNDeclaration = {
  id: "dsn-2024-12",
  period: "2024-12",
  type: "monthly",
  status: "generated",
  totalEmployees: 6,
  totalGrossSalary: 14136.5,
  totalContributions: 8965.79,
  generatedAt: new Date("2024-12-20T16:00:00"),
  errors: [],
};

// Helper functions
export function getCalculationRun(): PayrollCalculationRun {
  return mockCalculationRun;
}

export function getEmployeeCalculation(
  employeeId: string,
  period: string,
): EmployeePayrollCalculation | undefined {
  return mockEmployeeCalculations.find(
    (calc) => calc.employeeId === employeeId && calc.period === period,
  );
}

export function getPaySlips(period: string): PaySlip[] {
  return mockPaySlips.filter((slip) => slip.period === period);
}

export function getDSNDeclaration(period: string): DSNDeclaration | undefined {
  if (period === "2024-12") return mockDSNDeclaration;
  return undefined;
}

export function calculateTotals(calculations: EmployeePayrollCalculation[]): {
  totalGross: number;
  totalNet: number;
  totalEmployeeContributions: number;
  totalEmployerContributions: number;
  totalCost: number;
} {
  return calculations.reduce(
    (acc, calc) => ({
      totalGross: acc.totalGross + calc.grossSalary,
      totalNet: acc.totalNet + calc.netSalary,
      totalEmployeeContributions:
        acc.totalEmployeeContributions + calc.totalEmployeeContributions,
      totalEmployerContributions:
        acc.totalEmployerContributions + calc.totalEmployerContributions,
      totalCost: acc.totalCost + calc.totalCost,
    }),
    {
      totalGross: 0,
      totalNet: 0,
      totalEmployeeContributions: 0,
      totalEmployerContributions: 0,
      totalCost: 0,
    },
  );
}
