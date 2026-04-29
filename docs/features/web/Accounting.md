# Accounting (Comptabilité)

> Routes: `/dashboard/accounting/**`
> Source: `web/src/app/dashboard/accounting/`

## Overview

General accounting module with journal entries, chart of accounts, and bank reconciliation. Receives entries from billing and payroll modules.

## Pages

| Route | Purpose |
|-------|---------|
| `/accounting` | Accounting hub |
| `/accounting/entries` | Accounting journal entries |
| `/accounting/journals` | Accounting journals (achat, vente, banque, OD) |
| `/accounting/chart` | Plan comptable (chart of accounts) |
| `/accounting/bank` | Bank reconciliation |

## Workflows

### 1. Journal Entry Creation
1. Select journal (achat, vente, banque, opérations diverses)
2. Enter debit/credit lines with account codes
3. Validate balanced entry (total debits = total credits)
4. Post entry → status: `posted`

### 2. Billing → Accounting Sync
1. Invoice validated in [[Billing]]
2. Accounting entry auto-generated: debit client account, credit revenue account
3. VAT entries created in VAT journal
4. Review and validate synced entries

### 3. Bank Reconciliation
1. Import bank transactions from [[Banking]]
2. Match transactions against accounting entries
3. Flag unmatched transactions for manual review
4. Reconcile → mark as matched

### 4. Period Close
1. Review all unposted entries
2. Run trial balance
3. Generate financial statements
4. Lock period

## Data Types

Accounting types are defined in mock data files rather than `types.d.ts`:

```
AccountingEntry: { id, journalId, date, reference, description,
                   lines[] { accountCode, accountName, debit, credit, label },
                   status (draft|posted|validated), createdBy }
AccountingJournal: { id, code, name, type (achat|vente|banque|od), entries[] }
ChartOfAccounts: { accounts[] { code, name, class, type (actif|passif|charge|produit), balance } }
```

## Related

- [[Billing]] — Source of sales entries
- [[features/web/Payroll|Payroll]] — Source of salary and contribution entries
- [[Banking]] — Bank transactions for reconciliation
