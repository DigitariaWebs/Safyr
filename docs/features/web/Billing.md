# Billing (Facturation)

> Routes: `/dashboard/billing/**`
> Source: `web/src/app/dashboard/billing/`

## Overview

Client billing module for security services. Generates invoices from planning hours, manages quotes and purchase orders, handles VAT configuration, and syncs with accounting and payroll for margin analysis.

## Pages

| Route | Purpose |
|-------|---------|
| `/billing` | Billing hub — overview and KPIs |
| `/billing/invoices` | Invoice list with status filters |
| `/billing/invoices/new` | Create new invoice |
| `/billing/quotes` | Quotes management |
| `/billing/quotes/new` | Create new quote |
| `/billing/clients` | Billing client directory |
| `/billing/services` | Service pricing catalog |
| `/billing/purchase-orders` | Purchase order management |
| `/billing/credits` | Credit notes |
| `/billing/adjustments` | Invoice adjustments |
| `/billing/vat` | VAT configuration & reports |
| `/billing/simulation` | Billing simulation |
| `/billing/accounting` | Billing → accounting sync |
| `/billing/payroll` | Billing → payroll sync (margin) |
| `/billing/kpi` | Billing KPIs dashboard |

## Workflows

### 1. Invoice Creation (from Planning)
1. Select client and billing period
2. Import planned/realized/validated hours from [[Planning]]
3. Apply site-specific billing rates (hourly, overtime, night, weekend, holiday)
4. Calculate subtotal, apply VAT rate
5. Review variance between planned and realized hours
6. Preview invoice → status: `previewed`
7. Validate → issue invoice → send to client
8. Track payment: `issuedAt` → `sentAt` → `paidAt`

### 2. Quote to Invoice
1. Create quote with services and pricing
2. Client approves quote
3. Convert quote to invoice with same line items
4. Track through invoice workflow

### 3. Credit Note
1. Identify invoice requiring adjustment
2. Create credit note referencing original invoice
3. Apply partial or full credit
4. Accounting entry generated

### 4. Billing Simulation
1. Select clients, period, and scenario parameters
2. Run simulation with projected hours and rates
3. Compare against actual billing
4. Export simulation results

### 5. KPI Dashboard
1. Revenue tracking (monthly, quarterly, annual)
2. Outstanding receivables and aging
3. Margin analysis (billing vs payroll cost)
4. Client profitability ranking

## Data Types

### Invoice
```
BillingInvoice: { id, invoiceNumber, clientId, clientName, siteId, siteName, period,
                  status, planningHours, realizedHours, validatedHours,
                  normalHours, overtimeHours, replacements,
                  subtotal, vatRate, vatAmount, total, variance,
                  previewed, validatedBy, issuedAt, sentAt, paidAt, adjustments }
```

### Quote
```
BillingQuote: { id, quoteNumber, clientId, clientName, services[],
                subtotal, vatRate, vatAmount, total, validUntil,
                status (draft|sent|accepted|rejected|expired|converted) }
```

### Client & Services
```
BillingClient: { id, name, siret, address, contact, paymentTerms, vatRate,
                 billingFrequency, contracts[] }
Service: { id, name, description, unitPrice, unit (hour|day|month|unit),
           category, vatRate, active }
```

## Related

- [[Planning]] — Source of planned/realized hours for invoicing
- [[features/web/Payroll|Payroll]] — Margin analysis (billing revenue vs. payroll cost)
- [[Accounting]] — Invoice entries synced to accounting journals
- [[HR]] — Client contracts linked to HR entreprise
