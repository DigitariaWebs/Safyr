# Payroll (Mobile)

> Route: `(app)/payroll/index`
> Source: `mobile/src/app/(app)/payroll/`, `mobile/src/features/payroll/`

## Overview

Agent payslip viewer. Browse and view monthly payslips with gross/net breakdown. Read-only — payroll calculated from web [[features/web/Payroll|Payroll]] module.

## Workflows

### 1. View Payslips
1. Agent opens payroll screen
2. List of payslips by period (most recent first)
3. Tap payslip → view breakdown (gross, deductions, net, employer cost)
4. Download PDF option

## Data Types

Mock data in `mock.ts` — reuses web payslip structures.

## Related

- [[features/web/Payroll|Web Payroll]] — Source of payslip data
- [[features/mobile/Documents|Documents]] — Payroll documents section
