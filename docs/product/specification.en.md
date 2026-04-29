# Specification — Safyr

Digital management platform for private security companies.

---

## Table of Contents

- [A. Complete HR Platform](#a-complete-hr-platform-for-security-companies)
  - [1. Administrative Personnel Management](#1-administrative-personnel-management)
  - [2. HR Communication](#2-hr-communication)
  - [3. Time & Absence Management](#3-time--absence-management)
  - [4. Payroll Preparation & Analysis](#4-payroll-preparation--analysis)
  - [5. Training & Certifications](#5-training--certifications)
  - [6. Recruitment & Onboarding](#6-recruitment--onboarding)
  - [7. Disciplinary & Legal](#7-disciplinary--legal)
  - [8. Reviews & Performance](#8-reviews--performance)
  - [9. Expense Reports & Allowances](#9-expense-reports--allowances)
  - [10. Legal Registers](#10-legal-registers)
  - [11. HR Workflows & Requests](#11-hr-workflows--requests)
  - [12. Digitization & Electronic Signatures](#12-digitization--electronic-signatures)
  - [13. Occupational Health](#13-occupational-health)
  - [14. Offboarding / End of Contract](#14-offboarding--end-of-contract)
  - [15. Automated Social Report](#15-automated-social-report)
  - [16. HR Dashboard & Advanced KPIs](#16-hr-dashboard--advanced-kpis)
- [B. Digital Logbook Module](#b-digital-logbook-module)
- [C. Agent Geolocation Module](#c-agent-geolocation-module)
- [D. Payroll Module](#d-payroll-module)
- [E. Accounting Module](#e-accounting-module)
- [F. OCR Module](#f-ocr-module)

---

## A. Complete HR Platform for Security Companies

### 1. Administrative Personnel Management

- **Employee file**: National ID, health insurance card, resume, photo, proof of address
- **Documents & certifications**: CQP/APS, CNAPS professional card, SSIAP, first aid (SST), medical fitness (VM)
- Direct access to CNAPS DRACAR system
- Employment contract and contractual history (fixed-term, permanent, amendments)
- Works council (CSE) management / delegation hours / elected representatives
- Equipment tracking (PPE, radios, keys…)
- Digital signature for PPE (issuance / return)
- Expiration alerts: professional card, SSIAP, medical fitness, first aid
- Updates to personal details, contact info, bank details, etc.

### 2. HR Communication

- Email sending from the platform:
  - Employees
  - Clients
  - Partners (training, occupational health…)
- HR email template library
- Communication archiving in employee files
- Push notifications / SMS (optional)

### 3. Time & Absence Management

- Leave, absences, sick leave
- Hours worked (for payroll only)
- Full tracking of CSE delegation hours / elected representatives
- Declarations + HR validation
- Automatic payroll export

### 4. Payroll Preparation & Analysis

- Variable tracking: bonuses, night shifts, Sundays, public holidays, allowances
- Allowances (travel, meal, clothing…)
- Salary maintenance analysis (sick leave, work accidents, maternity…)
- Payroll anomaly checks
- **Personnel costs**:
  - Taxable net
  - Total payroll
  - Employee / employer contributions
  - Total employer cost
- Cost per worked hour per employee
- Export to Silae / Sage / other software

### 5. Training & Certifications

- SSIAP 1/2/3 tracking
- First aid (SST) tracking and renewals
- H0B0 / fire safety certification tracking
- Annual training plan
- Automatic expiration alerts
- Training budget & history

### 6. Recruitment & Onboarding

- Application management
- Regulatory file verification (CNAPS + certifications)
- Contract creation + electronic signature
- Onboarding process (documents, training)

### 7. Disciplinary & Legal

- Warnings
- Suspensions
- Disciplinary procedures
- Interview archiving
- Sanctions register (integrated legal register)

### 8. Reviews & Performance

- Mandatory professional reviews
- Annual reviews
- Objectives and internal development
- CSE follow-up if relevant

### 9. Expense Reports & Allowances

- Expenses submitted via app
- Manager / HR validation
- Payroll export
- Complete history

### 10. Legal Registers

All mandatory registers integrated:

- Personnel register
- Sanctions register
- Work accident register
- Training register
- Fixed-term contract entry / exit register
- PDF export compliant with labor inspection / CNAPS

### 11. HR Workflows & Requests

- Certificate requests
- Document requests
- Requests for bank details, address, or personal info changes
- History + status (pending / approved / rejected)
- Automation possible based on HR rules

### 12. Digitization & Electronic Signatures

- eIDAS contract signatures
- Disciplinary sanction signatures
- PPE / equipment signatures
- Electronic acknowledgments of receipt
- Secure internal HR validation

### 13. Occupational Health

- Full tracking: medical fitness, VIP visits, pre-return, return-to-work
- Automatic alerts
- Archived fitness certificates
- Regulatory medical history
- Link to medical provider (automated email)

### 14. Offboarding / End of Contract

- Notice period management
- Equipment return checklist
- Mandatory document generation:
  - Work certificate
  - Employment center attestation (Pôle Emploi)
  - Final settlement receipt
- Payroll export
- File archiving

### 15. Automated Social Report

Automatically generated data:

- Employee distribution (age, gender, seniority)
- Permanent / fixed-term / apprentice contracts
- Turnover (hires, departures)
- Absences (work accidents, sick leave, vacation)
- Gross / net payroll
- Employer / employee contributions
- Year-over-year comparison (N vs N-1)
- Gender pay gap
- Training expenditure
- Total personnel cost
- Average hourly cost

### 16. HR Dashboard & Advanced KPIs

- Certification compliance rate
- Delegation hours
- Absenteeism rate
- Cost per employee
- Evolving payroll
- Employer charges
- Turnover
- Gender equality index
- HR forecasting
- Salary maintenance analysis
- Recruitment KPIs (time-to-hire, cost, success rate)

---

## B. Digital Logbook Module

### 1. Module Objective

The Digital Logbook module must enable:

- Real-time traceability of all events on a secured site
- Centralization and securing of all information recorded by agents
- Smooth communication between agents, security control room, clients, and HR
- Automatic generation of reports, statistics, alerts, and history
- Connection to other modules: Agent Portal, Client Portal, HR, Planning, and Dashboard
- A reliable, tamper-proof, searchable, archivable, timestamped, and exportable system

### 2. Module Scope

- Event entry by agents
- Alert & notification system
- Validation / supervision workflow
- Automatic client reporting
- Secure legal archiving
- Connections to: Client Portal, Agent Portal, HR, KPI Dashboard, and Planning interface

### 3. Functional Features

#### 3.1. Event Entry (Agent)

Agents must be able to enter events from:

- Agent mobile application
- Security control room
- Tablet
- QR code scan from patrol zone

**Event types**:

- Routine events (entry/exit, visitors…)
- Incidents (intrusion, breakdown, suspicious behavior, medical intervention, fire…)
- Actions (doubt resolution, door closure, patrol)
- Checks (temperature, alarms, badge…)

**Documents or media**: Photos, videos, voice notes, and geolocation.

**Requirements**:

- Automatic timestamping
- Site + position recording
- Responsible agent
- Digital signature
- Status (in progress, resolved, deferred)

#### 3.2. Validation Workflow

1. Agent creates an event
2. Supervisor validates / comments / modifies (if needed)
3. Client receives (based on permissions):
   - Immediately for critical events
   - Daily via automatic report
   - Weekly via summary

#### 3.3. Categorization & Classification

Automatic classification by:

- Site
- Client
- Incident type
- Severity
- Zone
- Manual or automatic tag

#### 3.4. Notifications & Alerts

The system sends alerts for:

- Serious incidents
- Break-in attempts
- Fire detection
- Critical events (medical, assault…)
- Missing patrol
- Prolonged inactivity

**Possible recipients**:

- Security control room
- Site manager / supervisor
- Client (optional)
- HR manager (e.g., incident involving an agent)

#### 3.5. Connection with Planning / HR

**Planning**:

- Automatic verification: the agent assigned to the site can enter data
- Patrol logging (planning → logbook)
- Agent presence check (badge reader / photo → logbook)

**HR** — Automatic HR event transmission:

- Incident involving an agent
- Requests for explanation
- Praise / commendation
- Work accident traceability
- Automatic file creation in "HR Disciplinary Tracking" if necessary

### 4. Client Portal

#### 4.1. Real-Time Viewing

- All events of the day
- Filters: site / period / incident type / agent
- Instant statistics
- Criticality level

#### 4.2. Automated Export

- Daily PDF
- Automatic weekly PDF report
- Monthly report including:
  - Number of events
  - Typology
  - Time-to-resolution
  - Year-over-year comparison (N/N-1)

#### 4.3. Internal Messaging (Client ↔ Security Control Room)

Enables exchanges around an event.

### 5. Agent Portal

Agents must have:

- Access to events related to their post
- Restricted access (GDPR)
- Viewing of their actions / interventions
- New logbook entry
- Photo/video upload from mobile
- Internal ticket system
- Internal messaging for instructions

### 6. Connected KPI Dashboard

The Logbook module must automatically feed the KPI Dashboard:

#### Security KPIs

- Number of incidents / site / period
- Incident typology
- Hours between detection & resolution
- Number of visitors
- Number of patrols completed
- Average time between two patrols
- Most frequently impacted zones
- Incident resolution rate
- Critical vs minor incidents

#### HR KPIs

- Agents involved in incidents
- HSE / occupational safety incidents
- History per agent
- Service quality indicators

#### Client KPIs

- Security performance
- Service quality delivered
- Incident peak analysis
- Year-over-year comparison (N/N-1)
- Multi-site analysis

### 7. Technical Features

#### 7.1. Database

- Encrypted storage
- Tamper-proof logging
- Automatic backups
- Complete traceability (audit log)

#### 7.2. APIs & Connectors

REST API for integration with:

- CRM
- Alarm systems
- Video surveillance
- Accounting software
- Client software (IS)

#### 7.3. Security

- Strong authentication (2FA)
- Role-based access (agent, supervisor, client, admin)
- AES256 encryption
- GDPR compliant
- Automatic masking of sensitive data

### 8. Export, Reporting & Archiving

- Exports: PDF, Excel, CSV
- 10-year legal archiving
- Advanced multi-criteria search
- Automatic client report generation
- Customizable reports per client / site

### 9. Expected Deliverables

- Complete Logbook module (mobile + web)
- Connected Client Portal
- Linked Agent Portal
- Secure history
- Fully documented API
- Operational KPI Dashboard
- Validation workflow
- Automated alert system

---

## C. Agent Geolocation Module

### 1. Module Objectives

The geolocation module must enable:

- Real-time tracking of agents in the field
- Presence verification on site / intervention zone
- Agent safety features (SOS function, motion loss detection, etc.)
- Traceability of patrols and professional movements
- Automatic service validation (presence, patrols, interventions)
- Transparency for clients via their dedicated portal
- Automatic feeding of the Central Dashboard and HR module
- Strict GDPR compliance and legal geolocation rules in the workplace

### 2. Module Scope

- Real-time geolocation
- Presence validation / mission start-end
- Geolocated patrols
- Geo-fenced zones / alerts
- Traceability & history
- Discrete mode / agent safety
- Exportable data and statistics
- Connections: Agents / Client / HR / Dashboard

### 3. Main Features

#### 3.1. Real-Time Geolocation (Live Tracking)

- Agent location every X seconds (configurable)
- Visible by:
  - Security control room
  - Supervisors
  - Client (based on permissions)
- **Features**:
  - Map display (Google Maps / OpenStreetMap)
  - Position + direction + speed
  - Filter by badge/site/client/mission
  - Last known position if offline

#### 3.2. Geo-Fenced Zones

- Creation of circular or polygonal zones:
  - Client site
  - Sensitive zones
  - Restricted zones
  - Patrol checkpoints
- **Automatic alerts**:
  - Agent enters the zone
  - Agent leaves the zone
  - Agent is not in the scheduled zone
  - Extended parking outside zone

#### 3.3. Presence Verification

- Automatic validation "agent present on site" via GPS
- Shift start/end based on geolocation
- Automatic timestamping
- Schedule compliance verification
- **Connection with planning**:
  - Agent not located in zone → absence alert
  - Agent located outside zone → anomaly alert

#### 3.4. Connected Patrol (geolocated + QR code)

- GPS / QR / NFC checkpoints
- Route verification
- Duration, distance, and zone coverage analysis
- Planned vs. actual patrol comparison
- Automatic feed to Logbook (events + photos)

#### 3.5. Agent Safety (HSE)

- **SOS function** (alert button) — immediate dispatch to security control room:
  - Precise position
  - Time
  - Agent identity
- **Fall/motion loss detection** — automatic alert after X minutes of abnormal immobility
- **Discrete mode**:
  - Silent alert
  - Position hidden from other agents

### 4. Agent Portal

Agents must be able to:

- Enable/disable geolocation within legal limits
- View their missions and authorized zones
- Receive zone alerts (entry/exit)
- Trigger SOS
- View their professional travel history
- Validate a patrol
- **GDPR compliance**: no location tracking outside work hours

### 5. Client Portal

#### 5.1. Live Tracking

- Position of agents present ONLY on their site
- Patrol and passage visualization
- Geolocated intervention history

#### 5.2. Reporting

Daily / weekly / monthly reports:

- Validated presence
- Completed patrols
- Interventions
- Incidents with GPS coordinates

#### 5.3. Proof of Service

- Times + positions
- Patrol routes
- Geolocated photos

### 6. Connection with HR Module

The geolocation module feeds HR with:

- Actual presence (vs. schedule)
- Tardiness / absences
- HSE or SOS interventions
- Professional travel
- Elements that may generate:
  - Agent evaluation
  - Commendation
  - Disciplinary file
- HSE incidents trigger an automatic report in the HR file

### 7. Connection with Central Dashboard

#### 7.1. Security KPIs

- Number of patrols completed
- Planned vs. actual patrol compliance rate
- High-activity zones
- Sensitive zones (heatmap)
- Events (intrusion, SOS, anomalies)

#### 7.2. Operational KPIs

- Actual presence rate
- Tardiness rate
- Average intervention time
- Average travel per site

#### 7.3. HR KPIs

- Most solicited agents
- Geolocated absence / tardiness tracking
- SOS incident history
- Exposure duration / fatigue (HSE prevention)

### 8. Collected Data

- GPS coordinates
- Timestamps
- Agent identity
- Site / client / mission
- HSE events
- Geolocated photos / videos
- Patrol history

### 9. Security & GDPR

**Strict compliance with legal obligations**:

- Geolocation only during work hours
- Legal purposes: security, service verification, agent protection
- Employee information and consent
- Retention period limit (6 months — configurable)
- Anonymized mapping for HR / KPIs

**Data security**:

- AES256 encryption
- Role-based access
- Tamper-proof audit log
- Servers in Europe
- Secure APIs

### 10. Technical Features

- Mobile application iOS + Android
- Offline mode (buffer → auto sync)
- REST API for integration
- Multi-layer mapping
- Microservices architecture
- Automatic backup + replication
- Real-time alert engine

### 11. Export & Reporting

**Available formats**: Excel, PDF, CSV, JSON (API)

**Report types**:

- Geolocated attendance
- Patrols & interventions
- Travel
- HSE incidents
- Critical zone heatmaps

### 12. Expected Deliverables

- Agent mobile application (geolocation + SOS + patrol)
- Client portal (mapping + reporting)
- Complete HR connection
- Real-time dashboard
- Open API
- Technical documentation
- GDPR audit
- History and archiving

---

## D. Payroll Module

### 1. Payroll Module Objectives

The Payroll module must enable:

- Complete, reliable, and compliant salary calculation according to applicable rules
- Centralization of all salary data and variables
- Maximum automation of processing: imports, checks, outputs
- Automatic production of the Social Report using payroll + HR data
- Feeding the HR/Finance KPI Dashboard: payroll, turnover, gender distribution, etc.
- Native integration with:
  - HR module
  - Planning module
  - Quality Control module
  - HR Document Management (GED)
  - Accounting (exports)

### 2. Main Features

#### 2.1. Configuration

##### Legal and Collective Agreement Configuration

- Collective agreement configuration (IDCC 1351, 4127… — private security) and other agreements
- Classification, coefficient, and level management
- Grid configuration: maintenance allowance, meal bonus, night bonus, Sunday/holiday bonus
- Minimum conventional remuneration
- Overtime rules
- Amplitude, break, and premium rules
- Occupational accident/disease rates (AT/MP)
- Retirement, provident fund, and health insurance rates

##### Company Configuration

- Company profiles, establishments, structures
- Cost centers and analytical sections
- Internal rules (bonuses, allowances)
- Monthly closing management
- Configurable accounting transfer

##### Employee Configuration

- Contract, hourly rate, gross monthly remuneration
- Contract history (amendments, changes)
- Pre-employment declaration (DPAE) and single employment declaration (DUE)
- Assignments (site / client)
- Certifications and qualifications (CQP, professional card)
- Automatic absence import (sick leave / work accident / vacation)

### 3. Operational Management

#### 3.1. Variable Entry / Import

**Automatic import from Planning**:

- Regular hours
- Night hours
- Holiday hours
- Premium hours
- On-call duty
- Meal allowances, bonuses

**Import from HR**:

- Absences
- Sick leave
- Work accident leave
- Paid vacation
- Exceptional leave
- Union delegation hours
- HR sanctions affecting salary (deductions)

**Other**:

- External file import (CSV, API)
- Automated consistency checks

#### 3.2. Payroll Calculation

- Gross salary calculation
- Salary maintenance management with daily sickness benefits / IJSS (auto-calculation)
- Bonus management
- Absence calculation
- Overtime and premiums
- Social security ceiling regularization (tier A/B)
- Monthly & cumulative taxable net
- Pay slips (PDF, HR digital safe)
- Automatic DSN (social declaration) submissions

### 4. Analysis, Controls & Reporting

#### 4.1. Automatic Controls

- Hours vs. schedule consistency check
- Duplicate or omission check
- Maximum amplitude threshold check
- Bonus/schedule inconsistency check
- IJSS anomaly check (over/under received)
- Automatic anomaly report generation with quick correction

### 5. Social Report — Automatically Generated from Payroll

The module must automatically generate the Social Report using data from: Payroll, HR, Planning.

#### 5.1. Data Collected from Payroll

- Gross payroll
- Net payroll
- Cumulative taxable net
- Employer contributions
- Employee contributions
- Average salary by category
- Annual and monthly employer cost
- Cost per worked hour (per employee / team / site)

#### 5.2. Data Collected from HR

- Gender distribution (M/F)
- Contract type (permanent/fixed-term/apprentice)
- Seniority
- Age
- Turnover (hires / departures)
- Absences (sick leave, work accidents, vacation…)
- Work accidents
- Average contract duration

#### 5.3. Automatic Calculations

**Demographic distribution**:

- Distribution by gender
- Distribution by age group
- Distribution by status (agent / administrative / management)

**Contracts**:

- Permanent / fixed-term distribution
- Renewed fixed-term volumes
- Average fixed-term duration
- Departure reasons

**Turnover**:

- Hires / departures
- Overall turnover
- Turnover by site
- Turnover by contract type

**Payroll & Cost**:

- Year-over-year payroll comparison (N vs N-1)
- Employer contribution trends
- Employee contribution trends
- Total employer cost
- Cost per worked hour
- Average salary by gender (professional equality indicator)

**Absences**:

- Overall absence rate
- Absence rate by reason
- Average absence duration
- Absence cost (direct / indirect)

### 6. KPI Dashboard Connected to Payroll Module

#### HR Demographics

- Gender distribution (M/F)
- Average age
- Average seniority
- Permanent / fixed-term distribution
- Available vs. unavailable headcount

#### Economic & Financial

- Payroll (global + analytical)
- Total employer cost
- Employer / employee contributions
- Cost per hour / per site
- Year-over-year comparison (N / N-1)

#### Social

- Turnover
- Absence rate
- Average leave duration
- Sickness benefits received / salary maintenance paid

### 7. Connections with Other Modules

**With HR module**:

- Synchronization: contracts, absences, qualifications
- Automatic employee file updates
- Pay slip archiving in document management

**With Planning**:

- Automatic hour retrieval
- Hours vs. presence anomaly check

**With Dashboard**:

- Automatic indicator updates
- Data available in pivot / analytical format

**With Accounting**:

- Configurable accounting export
- Analytics by site / client / department

### 8. Expected Deliverables

- Complete payroll module
- Automated social report
- Connected dashboard
- Export templates (Excel, PDF)
- Validation workflow
- Complete pay slip management

---

## E. Accounting Module

### 1. Module Objectives

The Accounting module must enable:

- Complete management of automated accounting entries
- Synchronization with HR, Payroll, Invoicing, Banking, and Inventory modules
- Automatic generation of financial statements and accounting KPIs
- Reduction of manual data entry through OCR
- Complete traceability and internal control
- Global view via the central dashboard

### 2. Functional Scope

#### 2.1. Chart of Accounts & Configuration

- French General Chart of Accounts (PCG) support + export to other frameworks
- Account configuration: classes, journals, analytical sections
- Multi-level analytical plans (agency, client, site, agent…)
- Cost center configuration linked to HR teams / Missions

#### 2.2. Automatic Accounting Entries

**Module connections**:

- **Invoicing** → automatic generation: sales, VAT, provisions, credit notes
- **Payroll** → automatic posting: salaries, employer contributions, employee contributions, payroll adjustments
- **HR** → provisions for absences, bonuses, allowances
- **Banking** → automated bank reconciliation
- **Inventory** → valuation of inflows and outflows by method (weighted average cost / FIFO)

**Features**:

- Customizable entry templates
- Automatic or manual generation
- Multi-level validation
- Automatic lettering
- Complete history + audit trail

#### 2.3. Accounting Journal Management

- Automatic journals: Sales, Purchases, Banking, Payroll, Adjustments
- General ledger / Third-party ledger
- Trial balance
- Balance sheet / Income statement
- Security-specific journals (sites, contracts, clients)
- Entry import / export (PDF, Excel, CSV, API, FEC)
- **Automatic pre-validation checks**:
  - Total debits = total credits
  - VAT compliance
  - Date consistency

#### 2.4. Purchases / Expenses Module (with integrated OCR)

- Supplier invoice scanning (PDF / photo)
- **Automatic recognition**:
  - Supplier
  - Date
  - Amounts
  - VAT
  - Expense account
  - Payment method
- Validation workflow (Agent → Manager → Accounting)
- Automatic posting to Purchases Journal
- Automatic association with bank upon payment

#### 2.5. Banking Module

**Bank reconciliation**:

- Automatic import via banking API (Bridge, Linxo, Powens, etc.)
- Automatic categorization
- Automatic Invoice ↔ Payment matching
- Exception handling + intelligent suggestions

**Tracking**:

- Actual balance vs. book balance
- Discrepancy alerts
- Multi-account and multi-bank support

#### 2.6. Connected Invoicing Module

- Revenue accounting tracking:
  - Total revenue
  - Revenue by client
  - Revenue by service type
- Entry generation for invoices and credit notes
- Outstanding balance tracking and automatic reminders
- Analytical accounting linked to missions / sites

#### 2.7. Integration with Payroll and HR

**Automatically imported data**:

- Payroll amounts (automated payroll journal)
- Employer / employee contributions
- Advances / deposits / reimbursements
- Vacation / comp time / bonus provisions
- Analytical accounting by agent or site

**Cross-referenced HR & Accounting KPIs**:

- Payroll vs. revenue
- Agent cost per hour
- Site/client profitability
- Payroll-to-cost ratio

#### 2.8. Inventory Module

- Automatic entries for:
  - Equipment intake
  - Agent assignments
  - Equipment outflow
- Loss and depreciation analysis
- Automatic valuation (weighted average cost / FIFO)

#### 2.9. Accounting Dashboard & KPIs

**Accounting KPIs**:

- Revenue (real-time & year-over-year)
- Gross margin / operating margin
- Total payroll
- Employer / employee contributions
- DSO (Days Sales Outstanding)
- DPO (Days Payable Outstanding)
- Profitability by: client, site, agent
- Available cash
- Outstanding receivables level

**Visualizations**:

- Multi-period charts
- Account / journal heatmap
- Automatic forecasting (AI)

#### 2.10. Exports and Legal Compliance

- FEC export to standards (mandatory)
- Timestamped accounting journal
- Excel / PDF / API export
- Certified archiving
- Complete traceability of all modifications

### 3. Technical Constraints

- Mandatory REST API for all interactions (HR, Payroll, Banking, Invoicing…)
- Batch functions for automated processing (payroll, banking)
- Encryption: AES-256 + TLS 1.3
- Multi-environment: Staging / Production
- Centralized logging system
- Critical data redundancy

### 4. Roles and Permissions

| Role | Permissions |
|------|------------|
| **Accountant** | Full module access, entry validation, bank reconciliation |
| **HR** | Analytical consultation, Payroll → Accounting |
| **Management** | Dashboard + KPI access, reporting export |
| **Client** (via portal) | Limited access to revenue + invoices + account balance |

### 5. Expected Deliverables

- Complete functional specification
- Accounting database model
- API & integration schemas
- UX/UI (mockups)
- Functional test scenarios
- Compliant FEC file

### 6. Acceptance Criteria

- 90% automation minimizing manual data entry
- Stable synchronization with HR, Payroll, Banking
- Functional real-time dashboard
- Validated FEC export
- Verified legal compliance and security

---

## F. OCR Module

### 1. OCR Module Objectives

The OCR module must enable:

- Automating the reading and extraction of information from incoming documents (invoices, expense reports, contracts, bank statements…)
- Reducing manual entry for HR, Accounting, and Administrative teams
- Automatically classifying documents into appropriate categories
- Automatically feeding modules:
  - **Accounting** (purchases, expenses, fixed assets, VAT…)
  - **Banking** (automatic reconciliation)
  - **HR** (expense reports, absence justifications, scanned contracts)
  - **Dashboard** (automated KPIs for expenses, payroll, spending…)

### 2. Functional Scope

#### 2.1. Supported Document Types

**Accounting**:

- Supplier invoices
- Credit notes
- Miscellaneous expenses
- Expense reports
- Quotes / client contracts

**Banking**:

- Bank statements (PDF)
- Payment receipts
- Slips

**HR**:

- Sick leave certificates
- Absence justifications
- Health insurance / provident fund forms
- Contracts and amendments (document management)

### 3. Detailed Features

#### 3.1. Document Upload

- Upload from:
  - Web platform
  - Agent mobile
  - Automatic email (dedicated address: `ocr@company.com`)
  - External API
- Supported formats: PDF, JPG, PNG, TIFF
- Configurable maximum file size

#### 3.2. Automatic Recognition (OCR + AI)

**For invoices & expenses (Accounting)**:

- Supplier name
- Address
- Invoice date
- Invoice number
- Amount excl. tax / incl. tax / VAT
- IBAN
- Line item descriptions
- Expense type
- Payment method
- Suggested accounting code (AI)
- Automatic Bank ↔ Invoice reconciliation if payment detected

**For HR documents**:

- Relevant agent
- Document type (sick leave, absence, contract…)
- Start / end dates
- Medical information not extracted (GDPR compliance)
- Automatic link to HR file
- Automatic counter updates (absence, payroll…)

**For Banking**:

- Automatic detection of entries in statement PDFs
- Automatic matching:
  - Paid invoice
  - Salary payment
  - Miscellaneous expenses
- Automatic pre-categorization (AI)

#### 3.3. Intelligent Classification & Indexing

**Automatic classification**:

- Accounting → Purchases journal
- Accounting → Expense reports
- Banking → Reconciliation
- HR → Employee file
- Client → Contract / mission file
- Inventory → Delivery notes

**Automatic indexing for search**:

- Supplier
- Agent
- Client
- Amount
- Date
- Document type

#### 3.4. Validation Workflow

1. Capture / Upload
2. OCR reading
3. AI extraction
4. Accounting entry suggestion (if accounting document)
5. Human review (optional based on confidence threshold)
6. Validation
7. Automatic integration into modules

#### 3.5. Connections to Other Modules

**ACCOUNTING integration**:

- Pre-filled purchase entries
- Storage in accounting document management
- Automatic 6xxx account suggestion
- VAT entry preparation
- Automatic association with bank payments

**BANKING integration**:

- Automatic bank reconciliation
- Receipt recognition
- Supplier payment detection
- Matching with OCR invoices

**HR integration**:

- Automatic justification processing: absence, sick leave, expense reports
- Automatic counter updates: leave, payroll, payroll variables
- Direct storage in employee file

**Central Dashboard integration** — Automatically generated KPIs:

- Supplier expenses (by type, site, period)
- Total cost per client / mission
- Expense report amounts
- Document volume
- OCR automation rate
- Generated savings (processing time reduction)
- Spending analysis by category / team

### 4. Technical Constraints

#### 4.1. OCR Algorithms

- OCR based on advanced engine (Tesseract, Google Vision, AWS Textract, Azure OCR…)
- AI for structured extraction LSTM / transformer
- Self-learning: progressive improvement

#### 4.2. Architecture

- Dedicated OCR microservice
- REST API / Webhooks
- Storage:
  - NoSQL database for extraction
  - Secure storage for PDFs (S3 / Blob)

#### 4.3. Security & GDPR

- AES-256 encryption for documents
- Storage in Europe
- Access logs
- OCR restricted for medical documents (do not read sensitive content)
- Configurable retention policy (e.g., 10 years for accounting)

### 5. Roles & Permissions

| Role | Permissions |
|------|------------|
| **Accounting** | Invoice validation, account modification, accounting publication |
| **HR** | Document assignment to employee, expense report validation |
| **Agent** | Mobile upload, no OCR extraction modification |
| **Management** | OCR KPI Dashboard, reporting export |

### 6. Expected Deliverables

- Complete functional specification
- OCR technical architecture
- API documentation
- OCR screen UX/UI
- OCR test scenarios
- Connectors: Accounting — Banking — HR — Dashboard

### 7. Acceptance Criteria

- 90% minimum documents recognized without manual correction
- Automatic Bank ↔ Invoice reconciliation ≥ 80%
- Correct extraction (date, amount, supplier) ≥ 95%
- Real-time integration with Accounting / HR / Banking
- Operational KPIs on dashboard
