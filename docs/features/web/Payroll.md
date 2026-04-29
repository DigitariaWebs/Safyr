# Payroll (Paie)

> Routes: `/dashboard/payroll/**`
> Source: `web/src/app/dashboard/payroll/`

## Overview

Full payroll calculation engine for French private security companies. Handles gross-to-net calculation with social contributions (URSSAF, AGIRC-ARRCO), state aids (Réduction Fillon), primes, indemnités, and DSN social declarations. Generates PDF payslips via jsPDF.

## Pages

| Route | Purpose |
|-------|---------|
| `/payroll` | Payroll hub — current period overview |
| `/payroll/calculation` | Payroll calculation dashboard with batch run |
| `/payroll/calculation/[employeeId]/[month]/[year]` | Individual payslip detail (7-step breakdown) |
| `/payroll/archives` | Historical payslips and past periods |
| `/payroll/variables` | Payroll variable management |
| `/payroll/controls` | Pre-calculation control checks |
| `/payroll/social-report` | DSN social report generation |
| `/payroll/configuration/company` | Company payroll settings |
| `/payroll/configuration/conventions-sync` | Collective agreement sync |
| `/payroll/configuration/indemnites` | Indemnity type configuration |
| `/payroll/configuration/legal` | Legal configuration |
| `/payroll/configuration/organisms` | Social organism rules (URSSAF, etc.) |
| `/payroll/configuration/state-help` | State aid programs (Fillon, etc.) |

## Workflows

### 1. Monthly Payroll Cycle
1. **Period opened** → `PayrollPeriod` created with status `draft`
2. **Import variables** from [[HR]] → planning hours + HR absences → status `importing`
3. **Review & validate** variables per employee → coherence checks run → status `review`
4. **Run controls** → `ControlExecution` checks for anomalies (missing hours, duplicate entries, excessive hours, IJSS mismatches)
5. **Resolve anomalies** → correct or dismiss each `PayrollAnomaly`
6. **Calculate payroll** → batch `PayrollCalculationRun` processes all employees
7. **Validate calculations** → manager reviews and approves → status `validated`
8. **Generate payslips** → PDF via jsPDF (`payroll-bulletin-pdf.ts`)
9. **Export** → to external software (Silae/Sage) via configured format
10. **Close period** → status `closed`, DSN declaration generated

### 2. Individual Payslip Calculation (7 Steps)
1. **Brute calculation** — Base salary + worked hours (normal, night, Sunday, holiday) + overtime (25%/50%) + bonuses - time off deductions = `bruteSalary`
2. **Primes** — Ancienneté, habillage, risque, astreinte, objectif primes added to gross (subject to contributions)
3. **Employee deductions** — Social contributions applied via organism rules (health, retirement, unemployment, CSG/CRDS) per tranche A/B/C
4. **Employer charges** — Employer-side contributions calculated per organism rules
5. **State help** — Réduction Fillon, aide à l'embauche calculated and deducted from employer charges
6. **Indemnités** — Transport, repas, logement, habillement indemnities added to net (not subject to contributions)
7. **Taxes (PAS)** — Prélèvement à la source applied → final `netToPay`

### 3. DSN Declaration
1. Period validated → generate DSN declaration
2. Aggregate employee data: gross salaries, contributions, absences, work accidents
3. Status: `draft` → `generated` → `validated` → `sent` → `acknowledged`
4. Track CPAM acknowledgment

### 4. Anomaly Resolution
1. Control execution detects anomaly (e.g., `hours_vs_planning`, `ijss_mismatch`)
2. Anomaly assigned severity: `info` / `warning` / `critical`
3. Reviewer investigates → correction available or manual fix
4. Auto-correct applied if available, or manually corrected
5. Status: `open` → `investigating` → `corrected` / `dismissed` / `false_positive`

## Data Types

### Payroll Period & Run
```
PayrollPeriod: { id, month, year, label, status (draft|importing|review|validated|calculated|closed),
                 totalEmployees, importedEmployees, validatedEmployees, totalErrors, totalWarnings }
PayrollCalculationRun: { id, period, status, totalEmployees, calculatedEmployees,
                         totalGrossSalary, totalNetSalary, totalEmployerContributions, totalCost, calculations[] }
```

### Calculation Workflow (7-step)
```
PayrollCalculationWorkflow: {
  employeeId, period, status,
  // Step 1: Brute
  workedHours (WorkedHoursBreakdown), baseSalary, hoursAmount, overtimeAmount,
  nightBonus, sundayBonus, holidayBonus, timeOffDeductions[], bruteSalary,
  // Step 2: Primes
  primes (PrimeApplication[]), totalPrimes,
  // Step 3: Employee deductions
  employeeDeductions (OrganismRuleApplication[]), totalEmployeeDeductions,
  // Step 4: Employer charges
  employerCharges (OrganismRuleApplication[]), totalEmployerCharges,
  // Step 5: State help
  stateHelps (StateHelpApplication[]), totalStateHelp, employerNetCharges,
  // Step 6: Indemnités
  indemnites (IndemniteApplication[]), totalIndemnites,
  // Step 7: Taxes
  netBeforeTax, employeeTaxes (EmployeeTax[]), netToPay, totalEmployerCost,
  leaveBalance (LeaveBalance)
}
```

### Social Contributions
```
OrganismRule: { id, code, name, organism (URSSAF|AGIRC-ARRCO|...),
                category (health|retirement|unemployment|family|accident|csg|crds),
                appliesTo, rateEmployee, rateEmployer, ceiling, tranche (A|B|C) }
SocialContributionDetail: { id, code, label, type (employee|employer),
                            category, baseAmount, rate, amount, ceiling, tranche }
```

### State Help & Configuration
```
StateHelp: { id, code, name, type (reduction|credit|exoneration),
             calculationMethod (percentage|fixed|formula), rate, conditions[], maxAmount }
PrimeType: { id, code, name, category (anciennete|habillage|risque|astreinte|objectif),
             subjectToContributions: true, calculationMethod }
IndemniteType: { id, code, name, category (transport|repas|logement|habillement),
                 taxable: false, subjectToContributions: false, calculationMethod }
```

### Controls & Anomalies
```
PayrollControl: { id, name, category (hours|legal|bonuses|ijss|duplicates), severity, enabled }
ControlExecution: { id, periodId, status, controlsRun[], totalAnomalies, criticalCount }
PayrollAnomaly: { id, employeeId, type, severity, status, expectedValue, actualValue,
                  autoCorrectAvailable, correction }
```

### Payslip & DSN
```
PaySlip: { id, employeeId, period, pdfUrl, status (draft|generated|sent|viewed|archived) }
DSNDeclaration: { id, period, type (monthly|event), status, totalEmployees,
                  totalGrossSalary, totalContributions, fileUrl, errors[] }
```

### Social Report
```
PayrollSocialReport: { period, masses (PayrollMasses), costAnalysis, demographics,
                       turnover (TurnoverMetrics), contracts, absences, workAccidents,
                       genderEquality, comparison (YearOverYearComparison) }
```

## Related

- [[HR]] — Source of payroll variables, absences, and employee data
- [[Planning]] — Source of worked hours imported into payroll
- [[Billing]] — Payroll-to-billing sync for margin analysis
