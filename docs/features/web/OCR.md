# OCR

> Routes: `/dashboard/ocr/**`
> Source: `web/src/app/dashboard/ocr/`

## Overview

Document scanning and data extraction. Uses OCR to process identity documents, certificates, invoices, and other paperwork. Extracted data populates relevant modules (HR, billing, accounting).

## Pages

| Route | Purpose |
|-------|---------|
| `/ocr` | OCR hub |
| `/ocr/documents` | Document upload and processing |

## Workflows

### 1. Document Processing
1. Upload document (scan or photo): ID card, CNAPS card, certificate, invoice, etc.
2. OCR engine extracts text and structured data
3. Review extracted fields → correct if needed
4. Confirm extraction → data routed to target module

### 2. Bulk Processing
1. Upload multiple documents
2. System classifies document types automatically
3. Batch extraction with confidence scores
4. Review queue for low-confidence extractions

### 3. Data Routing
- **ID cards** → [[HR]] employee identity fields
- **CNAPS cards** → [[HR]] certification records
- **Certificates (SSIAP, SST)** → [[HR]] training module
- **Invoices** → [[Billing]] or [[Accounting]]
- **RIB** → [[HR]] employee bank details

## Data Types

Types defined in mock data:

```
OCRDocument: { id, fileName, fileUrl, type (id_card|cnaps_card|certificate|invoice|rib|other),
               uploadedAt, uploadedBy, status (pending|processing|completed|failed),
               confidence, extractedData (Record<string, string>),
               validatedBy, validatedAt }
```

## Related

- [[HR]] — Primary destination for extracted employee data
- [[Billing]] — Invoice data extraction
- [[Accounting]] — Receipt and document digitization
