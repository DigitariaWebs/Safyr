export type PayrollLine = { label: string; amount: number };

export type Payslip = {
  periodLabel: string;
  gross: number;
  net: number;
  hours: number;
  lines: PayrollLine[];
};

export const mockPayslip: Payslip = {
  periodLabel: "Janvier 2026",
  gross: 2150.0,
  net: 1675.42,
  hours: 151.67,
  lines: [
    { label: "Salaire de base", amount: 2150.0 },
    { label: "Primes", amount: 120.0 },
    { label: "Retenues", amount: -594.58 },
  ],
};

