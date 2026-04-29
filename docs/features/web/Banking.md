# Banking (Banque)

> Routes: `/dashboard/banking/**`
> Source: `web/src/app/dashboard/banking/`

## Overview

Bank account management with transaction tracking. Provides data for accounting reconciliation and cash flow visibility.

## Pages

| Route | Purpose |
|-------|---------|
| `/banking` | Banking hub — account overview |
| `/banking/accounts` | Bank accounts list and details |

## Workflows

### 1. Account Overview
1. View all company bank accounts with current balances
2. Browse transaction history per account
3. Filter by date range, type, amount

### 2. Transaction Categorization
1. View incoming/outgoing transactions
2. Categorize transactions (salary, supplier, client payment, tax, other)
3. Link to relevant invoice or payroll period
4. Export to [[Accounting]] for reconciliation

## Data Types

Types defined in mock data files:

```
BankAccount: { id, bankName, iban, bic, accountType (courant|epargne),
               balance, currency, status (active|inactive) }
BankTransaction: { id, accountId, date, description, amount, type (credit|debit),
                   category, reference, reconciled, reconciledWith }
```

## Related

- [[Accounting]] — Transactions exported for bank reconciliation
- [[features/web/Payroll|Payroll]] — Salary payments appear as bank transactions
- [[Billing]] — Client payments appear as incoming transactions
