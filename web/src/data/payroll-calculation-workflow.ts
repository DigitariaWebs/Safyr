import {
  PayrollCalculationWorkflow,
  PayrollCalculationRunWorkflow,
  WorkedHoursBreakdown,
  TimeOffDeduction,
  EmployeeTax,
  LeaveBalance,
  TimeOffType,
} from "@/lib/types.d";
import {
  getOrganismRules,
  calculateOrganismDeductions,
} from "./payroll-organisms";
import {
  calculateStateHelpApplications,
  getTotalStateHelp,
} from "./payroll-state-help";
import { calculateIndemnites, getIndemnitesTotals } from "./payroll-indemnites";

// Convention collective rates for security sector
const CONVENTION_RATES = {
  nightBonus: 0.1, // 10% majoration
  sundayBonus: 0.25, // 25% majoration
  holidayBonus: 1.0, // 100% majoration
  overtime25: 0.25, // 25% majoration first 8 hours
  overtime50: 0.5, // 50% majoration beyond
  overtime100: 1.0, // 100% majoration special cases
};

// Calculate worked hours amount
function calculateWorkedHoursAmount(
  hours: WorkedHoursBreakdown,
  hourlyRate: number,
): {
  hoursAmount: number;
  overtimeAmount: number;
  nightBonus: number;
  sundayBonus: number;
  holidayBonus: number;
} {
  const normalAmount = hours.normalHours * hourlyRate;
  const nightAmount = hours.nightHours * hourlyRate;
  const sundayAmount = hours.sundayHours * hourlyRate;
  const holidayAmount = hours.holidayHours * hourlyRate;

  // Overtime calculations
  const overtime25Amount =
    hours.overtime25 * hourlyRate * (1 + CONVENTION_RATES.overtime25);
  const overtime50Amount =
    hours.overtime50 * hourlyRate * (1 + CONVENTION_RATES.overtime50);
  const overtime100Amount =
    hours.overtime100 * hourlyRate * (1 + CONVENTION_RATES.overtime100);

  // Bonuses on special hours
  const nightBonus =
    hours.nightHours * hourlyRate * CONVENTION_RATES.nightBonus;
  const sundayBonus =
    hours.sundayHours * hourlyRate * CONVENTION_RATES.sundayBonus;
  const holidayBonus =
    hours.holidayHours * hourlyRate * CONVENTION_RATES.holidayBonus;

  return {
    hoursAmount: normalAmount + nightAmount + sundayAmount + holidayAmount,
    overtimeAmount: overtime25Amount + overtime50Amount + overtime100Amount,
    nightBonus,
    sundayBonus,
    holidayBonus,
  };
}

// Calculate time off deductions
function calculateTimeOffDeductions(
  deductions: { type: TimeOffType; days: number; hours: number }[],
  dailyRate: number,
  hourlyRate: number,
): TimeOffDeduction[] {
  return deductions.map((d) => {
    const amount = d.days > 0 ? d.days * dailyRate : d.hours * hourlyRate;
    return {
      type: d.type,
      days: d.days,
      hours: d.hours,
      dailyRate,
      amount: -Math.abs(amount), // Always negative for deductions
      salaryMaintenance: d.type === "sick_leave",
    };
  });
}

// Mock employee data for workflow calculations
interface EmployeePayrollInput {
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  position: string;
  contractType: "CDI" | "CDD" | "Intérim" | "Apprentissage";
  baseSalary: number;
  hourlyRate: number;
  workedHours: WorkedHoursBreakdown;
  timeOffDeductions: { type: TimeOffType; days: number; hours: number }[];
  indemnites: { code: string; quantity?: number; amount?: number }[];
  pasRate: number; // Prélèvement à la source rate
  leaveBalance: LeaveBalance;
  anciennete?: number; // years
}

// Full payroll calculation workflow
export function calculatePayrollWorkflow(
  input: EmployeePayrollInput,
  period: string,
): PayrollCalculationWorkflow {
  const dailyRate = input.baseSalary / 21.67; // Average working days per month

  // Step 1: Calculate brute salary
  const hoursCalc = calculateWorkedHoursAmount(
    input.workedHours,
    input.hourlyRate,
  );

  const timeOffDeductions = calculateTimeOffDeductions(
    input.timeOffDeductions,
    dailyRate,
    input.hourlyRate,
  );

  const totalTimeOffDeduction = timeOffDeductions.reduce(
    (sum, d) => sum + d.amount,
    0,
  );

  const bruteSalary =
    input.baseSalary +
    hoursCalc.hoursAmount -
    input.baseSalary + // Remove base since it's included in hoursAmount calculation
    hoursCalc.overtimeAmount +
    hoursCalc.nightBonus +
    hoursCalc.sundayBonus +
    hoursCalc.holidayBonus +
    totalTimeOffDeduction;

  // Step 2: Calculate employee deductions from organism rules
  const organismRules = getOrganismRules();
  const employeeDeductions = calculateOrganismDeductions(
    bruteSalary,
    organismRules,
    "employee",
  );
  const totalEmployeeDeductions = employeeDeductions.reduce(
    (sum, d) => sum + d.amount,
    0,
  );

  // Step 3: Calculate employer charges from organism rules
  const employerCharges = calculateOrganismDeductions(
    bruteSalary,
    organismRules,
    "employer",
  );
  const totalEmployerCharges = employerCharges.reduce(
    (sum, c) => sum + c.amount,
    0,
  );

  // Step 4: Calculate state help for employer
  const totalOvertimeHours =
    input.workedHours.overtime25 +
    input.workedHours.overtime50 +
    input.workedHours.overtime100;

  const stateHelps = calculateStateHelpApplications(
    bruteSalary,
    totalOvertimeHours,
    ["FILLON", "HEURES_SUP"],
    true, // Assume < 50 employees
  );
  const totalStateHelp = getTotalStateHelp(stateHelps);
  const employerNetCharges = totalEmployerCharges - totalStateHelp;

  // Step 5: Calculate indemnités
  const indemniteApplications = calculateIndemnites(input.indemnites);
  const indemniteTotals = getIndemnitesTotals(indemniteApplications);

  // Step 6: Calculate net before tax and employee taxes (PAS)
  const netBeforeTax =
    bruteSalary - totalEmployeeDeductions + indemniteTotals.totalNonTaxable;

  const netTaxableAmount =
    bruteSalary - totalEmployeeDeductions + indemniteTotals.totalTaxable;

  const employeeTaxes: EmployeeTax[] = [
    {
      type: "pas",
      name: "Prélèvement à la source",
      baseAmount: netTaxableAmount,
      rate: input.pasRate,
      amount: netTaxableAmount * (input.pasRate / 100),
    },
  ];
  const totalEmployeeTaxes = employeeTaxes.reduce(
    (sum, t) => sum + t.amount,
    0,
  );

  // Step 7: Calculate final net to pay
  const netToPay = netBeforeTax - totalEmployeeTaxes;

  // Total employer cost
  const totalEmployerCost =
    bruteSalary +
    indemniteTotals.totalSubjectToContributions +
    employerNetCharges;

  return {
    employeeId: input.employeeId,
    employeeName: input.employeeName,
    employeeNumber: input.employeeNumber,
    period,
    status: "calculated",
    position: input.position,
    contractType: input.contractType,

    // Step 1
    workedHours: input.workedHours,
    baseSalary: input.baseSalary,
    hoursAmount: hoursCalc.hoursAmount,
    overtimeAmount: hoursCalc.overtimeAmount,
    nightBonus: hoursCalc.nightBonus,
    sundayBonus: hoursCalc.sundayBonus,
    holidayBonus: hoursCalc.holidayBonus,
    timeOffDeductions,
    totalTimeOffDeduction,
    primes: [],
    totalPrimes: 0,
    bruteSalary,

    // Step 2
    employeeDeductions,
    totalEmployeeDeductions,

    // Step 3
    employerCharges,
    totalEmployerCharges,

    // Step 4
    stateHelps,
    totalStateHelp,
    employerNetCharges,

    // Step 5
    indemnites: indemniteApplications,
    totalIndemnitesNonTaxable: indemniteTotals.totalNonTaxable,
    totalIndemnitesTaxable: indemniteTotals.totalTaxable,
    totalIndemnites: indemniteTotals.total,

    // Step 6
    netBeforeTax,
    employeeTaxes,
    totalEmployeeTaxes,

    // Step 7
    netToPay,
    totalEmployerCost,

    // Leave balance
    leaveBalance: input.leaveBalance,

    // Metadata
    calculatedAt: new Date(),
    calculatedBy: "system",
    errors: [],
    warnings: [],
  };
}

// Mock employee inputs for demonstration
const mockEmployeeInputs: EmployeePayrollInput[] = [
  {
    employeeId: "emp-001",
    employeeName: "Dubois Jean",
    employeeNumber: "AG001",
    position: "Agent de Sécurité",
    contractType: "CDI",
    baseSalary: 2100,
    hourlyRate: 13.85,
    workedHours: {
      normalHours: 151.67,
      nightHours: 24,
      sundayHours: 8,
      holidayHours: 0,
      overtime25: 8,
      overtime50: 0,
      overtime100: 0,
      totalHours: 191.67,
    },
    timeOffDeductions: [],
    indemnites: [
      { code: "PANIER_JOUR", quantity: 20 },
      { code: "TRANSPORT", amount: 75 },
      { code: "ANCIENNETE", amount: 105 }, // 5% of base for 5 years
    ],
    pasRate: 7.5,
    leaveBalance: {
      employeeId: "emp-001",
      period: "2024-12",
      congesPayes: {
        previousBalance: 15,
        acquired: 2.5,
        taken: 0,
        remaining: 17.5,
        monthlyAccrual: 2.5,
      },
    },
    anciennete: 5,
  },
  {
    employeeId: "emp-002",
    employeeName: "Martin Sophie",
    employeeNumber: "AG002",
    position: "Agent de Sécurité",
    contractType: "CDI",
    baseSalary: 2200,
    hourlyRate: 14.51,
    workedHours: {
      normalHours: 135.67,
      nightHours: 16,
      sundayHours: 0,
      holidayHours: 8,
      overtime25: 12,
      overtime50: 4,
      overtime100: 0,
      totalHours: 175.67,
    },
    timeOffDeductions: [{ type: "sick_leave", days: 2, hours: 0 }],
    indemnites: [
      { code: "PANIER_JOUR", quantity: 18 },
      { code: "PANIER_NUIT", quantity: 4 },
      { code: "TRANSPORT", amount: 75 },
    ],
    pasRate: 5.2,
    leaveBalance: {
      employeeId: "emp-002",
      period: "2024-12",
      congesPayes: {
        previousBalance: 12,
        acquired: 2.5,
        taken: 0,
        remaining: 14.5,
        monthlyAccrual: 2.5,
      },
    },
    anciennete: 3,
  },
  {
    employeeId: "emp-003",
    employeeName: "Bernard Thomas",
    employeeNumber: "CH001",
    position: "Chef d'Équipe",
    contractType: "CDI",
    baseSalary: 2800,
    hourlyRate: 18.47,
    workedHours: {
      normalHours: 151.67,
      nightHours: 12,
      sundayHours: 0,
      holidayHours: 8,
      overtime25: 0,
      overtime50: 0,
      overtime100: 0,
      totalHours: 171.67,
    },
    timeOffDeductions: [],
    indemnites: [
      { code: "PANIER_JOUR", quantity: 22 },
      { code: "TRANSPORT", amount: 75 },
      { code: "ANCIENNETE", amount: 280 }, // 10% of base for 10 years
      { code: "RISQUE", amount: 150 },
    ],
    pasRate: 11.3,
    leaveBalance: {
      employeeId: "emp-003",
      period: "2024-12",
      congesPayes: {
        previousBalance: 25,
        acquired: 2.5,
        taken: 5,
        remaining: 22.5,
        monthlyAccrual: 2.5,
      },
      congesAnciennete: {
        acquired: 2,
        taken: 0,
        remaining: 2,
      },
    },
    anciennete: 10,
  },
  {
    employeeId: "emp-004",
    employeeName: "Petit Marie",
    employeeNumber: "AG003",
    position: "Agent de Sécurité",
    contractType: "CDI",
    baseSalary: 2050,
    hourlyRate: 13.52,
    workedHours: {
      normalHours: 151.67,
      nightHours: 0,
      sundayHours: 0,
      holidayHours: 0,
      overtime25: 0,
      overtime50: 0,
      overtime100: 0,
      totalHours: 151.67,
    },
    timeOffDeductions: [],
    indemnites: [
      { code: "PANIER_JOUR", quantity: 22 },
      { code: "TRANSPORT", amount: 75 },
    ],
    pasRate: 0, // Non imposable
    leaveBalance: {
      employeeId: "emp-004",
      period: "2024-12",
      congesPayes: {
        previousBalance: 5,
        acquired: 2.5,
        taken: 0,
        remaining: 7.5,
        monthlyAccrual: 2.5,
      },
    },
    anciennete: 1,
  },
  {
    employeeId: "emp-005",
    employeeName: "Lefebvre Paul",
    employeeNumber: "AG004",
    position: "Agent de Sécurité",
    contractType: "CDD",
    baseSalary: 2150,
    hourlyRate: 14.18,
    workedHours: {
      normalHours: 151.67,
      nightHours: 20,
      sundayHours: 7,
      holidayHours: 0,
      overtime25: 4,
      overtime50: 0,
      overtime100: 0,
      totalHours: 182.67,
    },
    timeOffDeductions: [],
    indemnites: [
      { code: "PANIER_JOUR", quantity: 21 },
      { code: "TRANSPORT", amount: 75 },
    ],
    pasRate: 3.8,
    leaveBalance: {
      employeeId: "emp-005",
      period: "2024-12",
      congesPayes: {
        previousBalance: 0,
        acquired: 2.5,
        taken: 0,
        remaining: 2.5,
        monthlyAccrual: 2.5,
      },
    },
    anciennete: 0,
  },
  {
    employeeId: "emp-006",
    employeeName: "Rousseau Julie",
    employeeNumber: "AG005",
    position: "Agent de Sécurité",
    contractType: "CDI",
    baseSalary: 2100,
    hourlyRate: 13.85,
    workedHours: {
      normalHours: 121.33,
      nightHours: 0,
      sundayHours: 0,
      holidayHours: 0,
      overtime25: 0,
      overtime50: 0,
      overtime100: 0,
      totalHours: 121.33,
    },
    timeOffDeductions: [{ type: "vacation", days: 5, hours: 0 }],
    indemnites: [
      { code: "PANIER_JOUR", quantity: 17 },
      { code: "TRANSPORT", amount: 75 },
    ],
    pasRate: 4.5,
    leaveBalance: {
      employeeId: "emp-006",
      period: "2024-12",
      congesPayes: {
        previousBalance: 20,
        acquired: 2.5,
        taken: 5,
        remaining: 17.5,
        monthlyAccrual: 2.5,
      },
    },
    anciennete: 2,
  },
];

// Generate mock calculations
export const mockCalculationsWorkflow: PayrollCalculationWorkflow[] =
  mockEmployeeInputs.map((input) => calculatePayrollWorkflow(input, "2024-12"));

// Create mock calculation run
export const mockCalculationRunWorkflow: PayrollCalculationRunWorkflow = {
  id: "run-2024-12",
  period: "2024-12",
  periodLabel: "Décembre 2024",
  status: "calculated",
  totalEmployees: mockCalculationsWorkflow.length,
  calculatedEmployees: mockCalculationsWorkflow.filter(
    (c) => c.status === "calculated",
  ).length,
  pendingEmployees: mockCalculationsWorkflow.filter(
    (c) => c.status === "pending",
  ).length,
  errorEmployees: mockCalculationsWorkflow.filter((c) => c.status === "error")
    .length,
  validatedEmployees: mockCalculationsWorkflow.filter(
    (c) => c.status === "validated",
  ).length,

  // Financial totals
  totalBruteSalary: mockCalculationsWorkflow.reduce(
    (sum, c) => sum + c.bruteSalary,
    0,
  ),
  totalIndemnites: mockCalculationsWorkflow.reduce(
    (sum, c) => sum + c.totalIndemnites,
    0,
  ),
  totalEmployeeDeductions: mockCalculationsWorkflow.reduce(
    (sum, c) => sum + c.totalEmployeeDeductions,
    0,
  ),
  totalEmployerCharges: mockCalculationsWorkflow.reduce(
    (sum, c) => sum + c.totalEmployerCharges,
    0,
  ),
  totalStateHelp: mockCalculationsWorkflow.reduce(
    (sum, c) => sum + c.totalStateHelp,
    0,
  ),
  totalEmployeeTaxes: mockCalculationsWorkflow.reduce(
    (sum, c) => sum + c.totalEmployeeTaxes,
    0,
  ),
  totalNetToPay: mockCalculationsWorkflow.reduce(
    (sum, c) => sum + c.netToPay,
    0,
  ),
  totalEmployerCost: mockCalculationsWorkflow.reduce(
    (sum, c) => sum + c.totalEmployerCost,
    0,
  ),

  // Metadata
  startedAt: new Date("2024-12-20T10:30:00"),
  startedBy: "admin@safyr.com",
  completedAt: new Date("2024-12-20T10:35:00"),

  calculations: mockCalculationsWorkflow,
};

// Helper functions
export function getCalculationRunWorkflow(): PayrollCalculationRunWorkflow {
  return mockCalculationRunWorkflow;
}

export function getEmployeeCalculationWorkflow(
  employeeId: string,
  period: string,
): PayrollCalculationWorkflow | undefined {
  return mockCalculationsWorkflow.find(
    (calc) => calc.employeeId === employeeId && calc.period === period,
  );
}

export function calculateTotalsWorkflow(
  calculations: PayrollCalculationWorkflow[],
): {
  totalBrute: number;
  totalIndemnites: number;
  totalEmployeeDeductions: number;
  totalEmployerCharges: number;
  totalStateHelp: number;
  totalEmployeeTaxes: number;
  totalNetToPay: number;
  totalEmployerCost: number;
} {
  return calculations.reduce(
    (acc, calc) => ({
      totalBrute: acc.totalBrute + calc.bruteSalary,
      totalIndemnites: acc.totalIndemnites + calc.totalIndemnites,
      totalEmployeeDeductions:
        acc.totalEmployeeDeductions + calc.totalEmployeeDeductions,
      totalEmployerCharges:
        acc.totalEmployerCharges + calc.totalEmployerCharges,
      totalStateHelp: acc.totalStateHelp + calc.totalStateHelp,
      totalEmployeeTaxes: acc.totalEmployeeTaxes + calc.totalEmployeeTaxes,
      totalNetToPay: acc.totalNetToPay + calc.netToPay,
      totalEmployerCost: acc.totalEmployerCost + calc.totalEmployerCost,
    }),
    {
      totalBrute: 0,
      totalIndemnites: 0,
      totalEmployeeDeductions: 0,
      totalEmployerCharges: 0,
      totalStateHelp: 0,
      totalEmployeeTaxes: 0,
      totalNetToPay: 0,
      totalEmployerCost: 0,
    },
  );
}

// Workflow step labels
export const workflowStepLabels = {
  step1: "Calcul du Brut",
  step2: "Cotisations Salariales",
  step3: "Cotisations Patronales",
  step4: "Aides de l'État",
  step5: "Indemnités",
  step6: "Impôt sur le Revenu",
  step7: "Net à Payer",
};

// Workflow step descriptions
export const workflowStepDescriptions = {
  step1:
    "Salaire de base + heures travaillées + majorations - absences (hors indemnités)",
  step2: "Cotisations déduites du salaire brut selon les règles des organismes",
  step3: "Charges calculées pour l'employeur selon les règles des organismes",
  step4: "Réductions et aides dont bénéficie l'employeur (Fillon, etc.)",
  step5: "Indemnités ajoutées au net (transport, panier, primes...)",
  step6: "Prélèvement à la source et autres impôts salariés",
  step7: "Montant final versé au salarié",
};
