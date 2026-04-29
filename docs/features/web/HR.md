# HR (Ressources Humaines)

> Routes: `/dashboard/hr/**`
> Source: `web/src/app/dashboard/hr/`

## Overview

Comprehensive HR management module covering employee lifecycle from recruitment to offboarding. Handles compliance with French labor law, CNAPS regulations, and collective agreements for private security.

## Sections

### Employees
**Routes:** `/hr/employees`, `/hr/employees/[id]`, `/hr/employees/akto-opco`, `/hr/employees/archives`

Employee directory with detailed profiles. Each profile contains identity, contracts, certifications (CNAPS, SSIAP, SST), equipment, CSE roles, and savings plans (PEE, PERECO).

### Communication
**Routes:** `/hr/communication/send-email`, `/hr/communication/templates`, `/hr/communication/notifications`, `/hr/communication/archives`

Email sending system with template management. Categories: RH, recrutement, formation, discipline, congés, paie, médical.

### Discipline
**Routes:** `/hr/discipline/warnings`, `/hr/discipline/disciplinary-procedures`, `/hr/discipline/sanctions-register`

Warnings, disciplinary procedures (multi-step), sanctions register, and mises à pied.

### Recruitment
**Routes:** `/hr/recruitment`, `/hr/recruitment/applications`, `/hr/recruitment/applications/new`, `/hr/recruitment/contracts`, `/hr/recruitment/onboarding`, `/hr/recruitment/verifications`

Full recruitment pipeline: applications → CNAPS/diploma verification → contract generation → onboarding tasks.

### Entreprise
**Routes:** `/hr/entreprise`, `/hr/entreprise/clients/[id]`, `/hr/entreprise/sous-traitants/[id]`, `/hr/entreprise/impot-sie`, `/hr/entreprise/divers-documents`

Company management: clients, subcontractors, tax/SIE info, administrative documents (KBIS, URSSAF vigilance, RC Pro insurance).

### Training
**Routes:** `/hr/training`, `/hr/training/certifications`, `/hr/training/plan`, `/hr/training/sst`, `/hr/training/ssiap`, `/hr/training/alerts`

Certification tracking (SSIAP 1/2/3, SST, H0B0, CQP APS), training plans with budget, and expiration alerts.

### Time Management
**Routes:** `/hr/time-management`, `/hr/time-management/worked-hours`, `/hr/time-management/overtime-counter`, `/hr/time-management/paid-leave-tracking`, `/hr/time-management/cse-hours`

Worked hours tracking (regular, night, Sunday, holiday, supplementary 25%/50%, complementary 10%), overtime counters, leave balances, and CSE delegation hours.

### Payroll (HR side)
**Routes:** `/hr/payroll`, `/hr/payroll/variables`, `/hr/payroll/expenses`, `/hr/payroll/cost-per-hour`, `/hr/payroll/maintenance-analysis`, `/hr/payroll/control`, `/hr/payroll/export-config`

Payroll variable preparation, expense reports, cost analysis per hour, salary maintenance (illness, work accident, maternity), and export configuration (Silae, Sage).

### Legal Registers
**Routes:** `/hr/legal-registers/personnel`, `/hr/legal-registers/cdd`, `/hr/legal-registers/training`, `/hr/legal-registers/work-accidents`, `/hr/legal-registers/duerp`

Mandatory French registers: registre du personnel, registre CDD, registre formation, registre accidents du travail, DUERP.

### Workflows & Requests
**Routes:** `/hr/workflows/requests`, `/hr/workflows/signatures`, `/hr/workflows/automation`, `/hr/workflows/bank-details`, `/hr/workflows/certificate`, `/hr/workflows/document`

Employee self-service requests (certificates, documents, bank detail changes, address changes), e-signature workflows (eIDAS compliant), and automation rules.

### Standalone Pages
| Route | Purpose |
|-------|---------|
| `/hr/interviews` | Professional & annual interviews, objectives tracking |
| `/hr/occupational-medicine` | Medical visit tracking (visite médicale) |
| `/hr/offboarding` | Employee exit process |
| `/hr/marketing` | Internal communications |
| `/hr/social-report` | DSN social report |
| `/hr/tenders` | Tender (appels d'offres) management |

## Workflows

### 1. Employee Onboarding
1. Create job application → status: `pending`
2. Review application → `reviewed` → schedule interview → `interviewed`
3. Accept → `accepted` → trigger regulatory verification
4. CNAPS number verified, diplomas checked → verification status: `verified`
5. Generate employment contract (CDI/CDD) → status: `draft`
6. E-signature workflow created → participants sign (eIDAS method)
7. Contract signed → status: `active`
8. Onboarding path created with tasks: upload ID, complete training, receive equipment
9. Equipment assigned with digital issuance signature
10. Employee status: `active`

### 2. Certification Renewal
1. System detects certificate expiring within 90/60/30 days → `ExpirationAlert` created
2. Alert severity escalates: `low` → `medium` → `high` → `critical`
3. Manager acknowledges alert → schedules training session
4. Employee completes training → result: `passed`/`failed`
5. New certification recorded with updated expiry date
6. Alert resolved

### 3. Discipline Procedure
1. Incident reported → `Warning` created with reason and description
2. If escalation needed → `DisciplinaryProcedure` initiated with steps
3. Each step completed in sequence (convocation, entretien, notification)
4. Sanction issued → recorded in `SanctionsRegister`
5. E-signature workflow for disciplinary documents

### 4. HR Request Processing
1. Employee submits request (certificate, document, bank details change)
2. Automation rules evaluate: auto-approve if conditions met, or assign to HR
3. HR reviews → validates or refuses with comment
4. If certificate: generated and delivered (email/pickup/mail)
5. If personal info change: requires approval → applied to system
6. History logged in `RequestHistoryEntry` audit trail

### 5. Time Off Management
1. Employee submits `TimeOffRequest` (type, dates, reason)
2. Manager reviews against `TimeOffBalance` and team calendar
3. Approve or reject with validation comment
4. If approved: balance updated, absence recorded in `AbsenceSummary`
5. Exported to payroll variables for salary calculation

### 6. Payroll Variable Preparation
1. Import hours from planning → `PlanningHoursImport` (normal, night, Sunday, holiday, overtime)
2. Import absences from HR → `HRAbsencesImport` (sick leave, paid leave, etc.)
3. Coherence checks run → `CoherenceCheck` flags discrepancies
4. Manual adjustments for allowances, bonuses, expenses
5. Validate all variables → exported to [[features/web/Payroll|Payroll]] module

## Data Types

### Company & Enterprise
```
Company: { id, name, legalForm, siret, vatNumber, authorizationNumber (CNAPS),
           address, contact, bankDetails, legalRepresentative, administrativeDocuments,
           expirationAlerts, subcontractors[], clients[] }
Client: { id, name, address, contactPerson, siret, numTVA, dirigeant, contracts[], gifts[] }
Subcontractor: { id, name, contracts[] }
```

### Employee
```
Employee: { id, firstName, lastName, email, phone, photo, dateOfBirth, placeOfBirth,
            nationality, gender, civilStatus, children, address, bankDetails,
            socialSecurityNumber, employeeNumber, hireDate, position, department,
            contractType, workSchedule, status, documents (EmployeeDocuments),
            contracts[], assignedEquipment[], cseRole?, savingsPlans { pee, pereco } }
```

### Contracts & Documents
```
Contract: { id, type (CDI|CDD|INTERIM|APPRENTICESHIP|INTERNSHIP), startDate, endDate,
            salary { gross, net }, hourlyRate, category, level, echelon, coefficient,
            workingHours, probationPeriod, amendments[], status }
Document: { id, name, type, fileUrl, expiresAt, verified }
Certification: { id, type (CQP_APS|CNAPS|SSIAP1-3|SST|VM|H0B0|FIRE), number,
                 issueDate, expiryDate, issuer, status }
Equipment: { id, name, type (PPE|RADIO|KEYS|UNIFORM|BADGE|VEHICLE|...),
             serialNumber, assignedAt, condition, status, issuanceSignature, returnSignature }
```

### Recruitment
```
JobApplication: { id, applicantName, email, position, cv, status (pending→reviewed→interviewed→accepted|rejected) }
RegulatoryVerification: { id, applicationId, cnapsVerified, diplomasVerified, status }
OnboardingPath: { id, employeeId, tasks[], progress (%), status }
```

### Training
```
TrainingCertification: { id, employeeId, type (SSIAP1-3|SST|H0B0|FIRE|OTHER), level, number,
                         issueDate, expiryDate, status (valid|expired|expiring-soon|pending-renewal) }
TrainingSession: { id, employeeId, certificationType, sessionDate, duration, trainer, result, cost }
TrainingPlan: { id, title, plannedDate, duration, participants[], budget, status }
ExpirationAlert: { id, employeeId, type, expiryDate, daysUntilExpiry, severity }
```

### Time Management
```
TimeOffRequest: { id, employeeId, type (vacation|sick_leave|unpaid_leave|maternity|paternity|family_event|training|cse_delegation),
                  startDate, endDate, totalDays, status (pending|approved|rejected|cancelled) }
WorkedHours: { id, employeeId, date, regularHours, supplementaryHours25, supplementaryHours50,
               complementaryHours10, nightHours, sundayHours, sundayNightHours, holidayHours, holidayNightHours }
TimeOffBalance: { employeeId, year, vacationDaysEarned, taken, pending, remaining, carriedOver }
CSEDelegationHours: { id, employeeId, cseRole, period, allocatedHours, usedHours, sessions[] }
```

### Discipline
```
Warning: { id, employeeId, date, reason, description, issuedBy, status }
DisciplinaryProcedure: { id, employeeId, startDate, steps[], currentStep, status }
Sanction: { id, employeeId, date, type, reason, severity (minor|major|severe) }
```

### Payroll Preparation
```
PayrollVariable: { id, employeeId, period, type (h_jour|h_nuit|h_dimanche|h_ferie|h_supp_25|h_supp_50|...),
                   amount, status (pending|validated|refused) }
Allowance: { id, employeeId, type (travel|meal|dressing|transport|housing|phone), amount, frequency }
SalaryMaintenance: { id, employeeId, type (illness|work_accident|maternity|paternity), dailyRate, totalDays, totalAmount }
PersonnelCost: { employeeId, period, grossSalary, netSalary, employerContributions, totalCost, costPerHour }
ExpenseReport: { id, employeeId, items[], totalAmount, status (draft→submitted→approved→paid) }
PayrollExportConfig: { id, name, software (silae|sage|other), format (csv|xlsx|xml|json), mapping }
```

### Legal Registers
```
PersonnelRegisterEntry: { id, employeeId, registrationNumber, entryDate, exitDate, contractType, position,
                           nationality, cnapsProfessionalCardNumber, ssiapDiplomaNumber }
CDDRegisterEntry: { id, employeeId, contractNumber, entryDate, expectedEndDate, reason, renewalCount }
WorkAccident: { id, employeeId, accidentDate, location, description, injuries, severity, workStoppage, cpamNotified }
TrainingRegisterEntry: { id, employeeId, trainingName, trainingType, organization, duration, cost, fundingSource }
```

### Workflows & Signatures
```
HRRequest: { id, employeeId, type (certificate|document|bank_details|address|civil_status),
             status (pending|in_progress|validated|refused), priority, history[] }
AutomationRule: { id, name, requestType, conditions, actions { autoApprove, autoAssign, setPriority } }
SignatureWorkflow: { id, type, title, status, documents[], participants[], signatureMethod (eidas|simple|advanced|qualified),
                     sequentialSigning, auditTrail[] }
```

### Communication
```
EmailTemplate: { id, name, subject, body, category (rh|recrutement|formation|discipline|conges|paie|medical), tags[] }
```

## Related

- [[features/web/Payroll|Payroll]] — Receives validated payroll variables from HR
- [[Planning]] — Provides worked hours data for time management
- [[Billing]] — Client contracts link to HR entreprise clients
- [[features/web/Geolocation|Geolocation]] — Employee geolocation tab in profile
