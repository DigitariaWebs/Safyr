# Stock (Inventaire)

> Routes: `/dashboard/stock/**`
> Source: `web/src/app/dashboard/stock/`

## Overview

Equipment inventory management. Tracks all security equipment assigned to agents and sites: PPE, radios, keys, uniforms, badges, vehicles, and benefits (meal vouchers, CESU, fuel cards).

## Pages

| Route | Purpose |
|-------|---------|
| `/stock` | Stock hub — inventory overview |
| `/stock/equipment` | Equipment list and management |

## Workflows

### 1. Equipment Assignment
1. Browse equipment catalog
2. Select item → assign to employee
3. Record assignment with digital signature (issuance)
4. Equipment status: `assigned`
5. Track condition: `new` → `good` → `fair` → `poor` → `damaged`

### 2. Equipment Return
1. Employee returns equipment
2. Record return with digital signature
3. Inspect condition → update status
4. Equipment available for reassignment or marked `damaged`/`lost`

### 3. Inventory Tracking
1. View all equipment by type, status, assignee
2. Filter: assigned, returned, lost, damaged, exhausted (consumables)
3. Track consumable quantities (uniforms, meal vouchers)
4. Alert when stock levels low

## Data Types

Uses `Equipment` from `types.d.ts` (see [[HR]] for full definition):

```
Equipment: { id, name, type (PPE|RADIO|KEYS|UNIFORM|BADGE|VEHICLE|VACATION_VOUCHER|GIFT_CARD|CESU|FUEL_CARD|MEAL_VOUCHER|OTHER),
             serialNumber, description, quantity, consumable,
             assignedAt, assignedBy, returnedAt, returnedBy,
             issuanceSignature (Signature), returnSignature (Signature),
             condition (new|good|fair|poor|damaged),
             status (assigned|returned|lost|damaged|exhausted) }
Signature: { signedAt, signedBy, signatureData (base64), ipAddress, device }
```

## Related

- [[HR]] — Equipment assigned via employee profile
- [[Planning]] — Equipment requirements per poste
