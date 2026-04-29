# HR Module Documentation

## Overview
The HR module is a comprehensive system for managing human resources, organizational compliance, payroll, and employee lifecycles within Safyr. It is divided into 8 main sub-modules accessible via the dashboard.

## Main Menus
1.  **Organisation**: Company structure, sub-contractors, clients, and administrative compliance.
2.  **Salariés**: Employee records, archives, and personnel registers.
3.  **Temps & Absences**: Tracking of worked hours, absences, and leave.
4.  **Paie & Coûts**: Payroll variables, costs analysis, and exports.
5.  **Formation**: Training certifications, plans, and alerts.
6.  **Cycle de vie salarié**: Recruitment, integration, discipline, and offboarding.
7.  **Conformité & Registres**: Regulatory registers (DUERP, accidents, etc.).
8.  **Workflows & Pilotage**: Operational workflows and strategic dashboards.

---

## 1. Organisation (`/dashboard/hr/entreprise`)
The administrative backbone of the HR module. It centralizes all legal, structural, and regulatory information.

### 1.1 Mon entreprise
*   **Link**: [`/dashboard/hr/entreprise`](/dashboard/hr/entreprise)
*   **Purpose**: Centralizes core legal identity and regulatory compliance for the main organization.
*   **Functionality**:
    *   **Legal Identity Management**: Edit name, SIRET, address, share capital, and CNAPS authorization.
    *   **Representative Dossier**: Management of the legal representative's personal and professional data.
    *   **Compliance Dashboard**: Visual tracking of mandatory documents (KBIS, insurance) with status indicators (Valid, Expiring, Missing, Expired).
    *   **Quick Links**: Integration with official portals (URSSAF, Impôts, Infogreffe).

### 1.2 Sous-traitants
*   **Link**: [`/dashboard/hr/entreprise/sous-traitants`](/dashboard/hr/entreprise/sous-traitants)
*   **Purpose**: Manages the directory and compliance of third-party security companies.
*   **Functionality**:
    *   **Registry**: Searchable table of partners with status tracking (Active, Inactive, Suspended).
    *   **Compliance Monitoring**: Tracks renewal dates for partner authorizations.
    *   **Detail Page** ([`/dashboard/hr/entreprise/sous-traitants/[id]`](/dashboard/hr/entreprise/sous-traitants/[id])):
        *   Deep management of partner company and representative data.
        *   Advanced Document Vault for specific mandatory documents (CNAPS cards, URSSAF vigilance, etc.).
        *   Alerts for missing or expired documents.

### 1.3 Clients
*   **Link**: [`/dashboard/hr/entreprise/clients`](/dashboard/hr/entreprise/clients)
*   **Purpose**: Tracks client relations, contracts, and business ethics compliance.
*   **Functionality**:
    *   **Client Directory**: Searchable list with legal identifiers and activity sectors.
    *   **Gift Registry**: Anti-corruption log to track gifts given to clients (Value, Date, Recipient).
    *   **Detail Page** ([`/dashboard/hr/entreprise/clients/[id]`](/dashboard/hr/entreprise/clients/[id])):
        *   Contract management (Active, Expired, Terminated).
        *   Specific document tracking (Contrat cadre, Kbis).
        *   Full history of gifts and relationship data.

### 1.4 Impôts & SIE (Taxes)
*   **Link**: [`/dashboard/hr/entreprise/impot-sie`](/dashboard/hr/entreprise/impot-sie)
*   **Purpose**: specialized hub for managing recurring fiscal obligations and communication with tax authorities.
*   **Functionality**:
    *   **TVA (VAT)**: Monthly workflow tracking Grand Livre, Declaration, and Payment.
    *   **CFE**: Annual tracking of *Cotisation Foncière des Entreprises*.
    *   **PAS (Withholding Tax)**: Monitoring of income tax withheld from payroll.
    *   **Fiscal Mail**: Log of communication with agencies (DGI, URSSAF).

### 1.5 Divers documents administratifs
*   **Link**: [`/dashboard/hr/entreprise/divers-documents`](/dashboard/hr/entreprise/divers-documents)
*   **Purpose**: Extensible document management organized by external partner organizations (Organismes).
*   **Functionality**:
    *   **Organisme Hub**: Groups documents by partner (URSSAF, Mutuelle, Bank, CNAPS).
    *   **Advanced Filtering**: Search by tags, urgency, or document type.
    *   **Communication Log**: Archive of letters and responses linked to specific organizations.

---

## 2. Salariés (`/dashboard/hr/employees`)
Central hub for managing the company's human capital and regulatory personnel tracking.

### 2.1 Dossiers salariés (Personnel)
*   **Link**: [`/dashboard/hr/employees`](/dashboard/hr/employees)
*   **Purpose**: Main directory for active and former employees.
*   **Functionality**:
    *   **Employee Directory**: Searchable list with status, role, and contact info.
    *   **Bulk Actions**: Send emails or delete multiple records simultaneously.
    *   **Stats Overview**: Quick view of total employees, active counts, and pending contract/expiration alerts.
    *   **Detail Page** ([`/dashboard/hr/employees/[id]`](/dashboard/hr/employees/[id])):
        *   **Informations**: Comprehensive personal/professional dossier.
        *   **Documents**: Digital vault for employee-specific files.
        *   **Contrats**: Full history and tracking of employment contracts.
        *   **Avantages**: Management of benefits (Mutuelle, Tickets Resto).
        *   **Équipements**: Inventory of gear assigned to the employee.
        *   **Badges**: Physical access badge management.
        *   **Épargne**: Employee savings plans and contributions.
        *   **Discipline**: Log of disciplinary interviews and sanctions.
        *   **CSE**: Interaction tracking with the Social and Economic Committee.
        *   **Géolocalisation**: Real-time or historical position tracking.

### 2.2 AKTO & OPCO
*   **Link**: [`/dashboard/hr/employees/akto-opco`](/dashboard/hr/employees/akto-opco)
*   **Purpose**: Management of training dossiers and funding requests with external organizations.
*   **Functionality**:
    *   **Dossier Tracking**: Monitor status (To create, In progress, Submitted, Validated) of funding requests.
    *   **Financials**: Track requested/approved amounts per training type (SSIAP, SST, H0B0).
    *   **External Integration**: Direct links to official AKTO/OPCO portals.

### 2.3 Archives BS (Payslips)
*   **Link**: [`/dashboard/hr/employees/archives`](/dashboard/hr/employees/archives)
*   **Purpose**: Historical archive of employee payslips (*Bulletins de Salaire*).
*   **Functionality**:
    *   **Advanced Search**: Filter by employee, month, and year.
    *   **Bulk Export**: Download all payslips for a specific filtered period.
    *   **Salary Verification**: Quick view of gross/net salaries for historical months.

### 2.4 Registre du personnel
*   **Link**: [`/dashboard/hr/employees/personnel-register`](/dashboard/hr/employees/personnel-register)
*   **Purpose**: The official, legally mandatory unique personnel register.
*   **Functionality**:
    *   **Regulatory Compliance**: Captures all required data points (CNAPS card numbers, SSIAP diplomas, birth place, SSN).
    *   **Entry/Exit Tracking**: Detailed log of all employee movements within the company.
    *   **PDF Export**: Generate a compliant version of the register for inspection by labor authorities or CNAPS.

---

## 3. Temps & Absences (`/dashboard/hr/time-management`)
Management of working time, leaves, and regulatory committees.

### 3.1 Absences
*   **Link**: [`/dashboard/hr/time-management`](/dashboard/hr/time-management)
*   **Purpose**: Centralized management of all employee time-off requests and status tracking.
*   **Functionality**:
    *   **Workflow Management**: Creation, validation (Approval/Rejection), and deletion of leave requests.
    *   **Comprehensive Types**: Support for Vacation, Sick leave, Unpaid leave, Maternity/Paternity, Family events, Training, and CSE Delegation.
    *   **Real-time Monitoring**: Dashboard showing total requests, pending approvals, and employees currently on leave.
    *   **Audit Trail**: Validation history including comments and timestamps.

### 3.2 Heures travaillées
*   **Link**: [`/dashboard/hr/time-management/worked-hours`](/dashboard/hr/time-management/worked-hours)
*   **Purpose**: Detailed tracking of worked hours for payroll accuracy.
*   **Functionality**:
    *   **Granular Breakdown**: Tracking of Regular, Supplementary (25%, 50%), Complementary (10%), Night, Sunday, and Holiday hours.
    *   **Payroll Prep**: Summary of hours by type and period for easy transfer to payroll systems.
    *   **Flexible Visualization**: Grouping of hour declarations by employee or by period.
    *   **Direct Integration**: Quick access to employee profiles from hour records.

### 3.3 Heures CSE
*   **Link**: [`/dashboard/hr/time-management/cse-hours`](/dashboard/hr/time-management/cse-hours)
*   **Purpose**: Specialized tracking of delegation hours for members of the Social and Economic Committee (*Comité Social et Économique*).
*   **Functionality**:
    *   **Allocation Management**: Tracking of allocated vs. used hours per elected member.
    *   **Session Tracking**: Log of sessions by type (Meeting, Employee reception, Inquiry, Training).
    *   **Compliance**: Validation workflow for delegation hours used by elected officials.
    *   **Usage Progress**: Visual indicators (progress bars) showing credit consumption per member.

### 3.4 Compteurs heures supplémentaires
*   **Link**: [`/dashboard/hr/time-management/overtime-counter`](/dashboard/hr/time-management/overtime-counter)
*   **Purpose**: Multi-month tracking of accumulated overtime for deferred payment or recovery.
*   **Functionality**:
    *   **Running Balances**: Clear view of Accumulated, Paid, and Remaining overtime hours.
    *   **Historical Breakdown**: Expandable monthly detail showing when and how hours were earned (Night, Weekend, Regular).
    *   **Payment Tracking**: Monitoring of last and next payment dates for overtime balances.

### 3.5 Suivi congés payés
*   **Link**: [`/dashboard/hr/time-management/paid-leave-tracking`](/dashboard/hr/time-management/paid-leave-tracking)
*   **Purpose**: Multi-year management of paid leave (*Congés Payés*) balances.
*   **Functionality**:
    *   **Yearly Partitioning**: Separate tracking for current year (N), previous year (N-1), and year N-2.
    *   **Dual Entry**: Supports both automatic import from payroll software and manual adjustments.
    *   **Leave History**: Detailed log of all historical leave periods taken by an employee.
    *   **Balance Dashboard**: Quick overview of acquired vs. taken days across the entire workforce.

---

## 4. Paie & Coûts (`/dashboard/hr/payroll`)
Financial management of human resources, from variable elements to final accounting exports.

### 4.1 Variables de paie
*   **Link**: [`/dashboard/hr/payroll/variables`](/dashboard/hr/payroll/variables)
*   **Purpose**: Centralized collection and validation of all variable salary elements.
*   **Functionality**:
    *   **Multi-type Tracking**: Support for premiums, meal allowances (*paniers*), uniform allowances, and various travel indemnities.
    *   **Validation Workflow**: Mandatory approval process with support for notes and rejection reasons.
    *   **Financial Overview**: Real-time tracking of total variable amounts and validation rates.
    *   **Grouping & Filtering**: Analysis by period or by employee to ensure no data is missed before closing payroll.

### 4.2 Contrôles de paie
*   **Link**: [`/dashboard/hr/payroll/control`](/dashboard/hr/payroll/control)
*   **Purpose**: Advanced anomaly detection to ensure payroll integrity and regulatory compliance.
*   **Functionality**:
    *   **Automated Audits**: Detection of missing hours, incorrect rates, duplicate payments, or contribution errors.
    *   **Severity Management**: Classification of issues from "Info" to "Critical" for prioritized resolution.
    *   **Issue Resolution**: Dedicated workflow to investigate, correct, or dismiss detected anomalies with a full audit trail.
    *   **Compliance Dashboard**: High-level view of open vs. resolved payroll risks.

### 4.3 Maintien de salaire
*   **Link**: [`/dashboard/hr/payroll/maintenance-analysis`](/dashboard/hr/payroll/maintenance-analysis)
*   **Purpose**: specialized tracking of sick leave, work accidents, and maternity/paternity leave financial impacts.
*   **Functionality**:
    *   **IJSS Tracking**: Monitoring of Social Security daily allowances (*Indemnités Journalières de Sécurité Sociale*).
    *   **Employer Cost Calculation**: Automatic computation of the required employer top-up based on seniority and collective agreements.
    *   **Subrogation Management**: Tracking of reimbursements due to the employer.
    *   **Status Monitoring**: Clear visibility on current vs. finalized maintenance cases.

### 4.4 Notes de frais
*   **Link**: [`/dashboard/hr/payroll/expenses`](/dashboard/hr/payroll/expenses)
*   **Purpose**: Professional expense management for employees with a full approval cycle.
*   **Functionality**:
    *   **Structured Submission**: Multi-item expense reports with digital receipt attachments.
    *   **Categorization**: Automated tracking by type (Travel, Meal, Accommodation, Fuel, Parking).
    *   **Approval Cycle**: Hierarchical review process with support for partial approvals and bulk actions.
    *   **Financial Controls**: Automatic total calculations and VAT tracking for company accounting.

### 4.5 Coût salarié / heure
*   **Link**: [`/dashboard/hr/payroll/cost-per-hour`](/dashboard/hr/payroll/cost-per-hour)
*   **Purpose**: Deep financial analysis of the "real" cost of human resources.
*   **Functionality**:
    *   **Full Cost Disclosure**: Breakdown of gross salary, net salary, and employer social contributions (*charges patronales*).
    *   **Hourly Rate Analysis**: Calculation of the effective cost per worked hour per employee.
    *   **Organizational Breakdown**: Cost analysis by department for budget monitoring and profitability studies.
    *   **Trend Monitoring**: Comparison of payroll costs vs. previous periods.

### 4.6 Exports Silae / Sage
*   **Link**: [`/dashboard/hr/payroll/export-config`](/dashboard/hr/payroll/export-config)
*   **Purpose**: Automated bridges between Safyr and external payroll software or accounting firms.
*   **Functionality**:
    *   **Software Compatibility**: Pre-configured formats for industry leaders (Silae, Sage, Cegid).
    *   **Automated Scheduling**: Programmed monthly exports on specific dates and times.
    *   **Multi-channel Delivery**: Automatic upload via FTP/SFTP or delivery via email notifications.
    *   **Data Scoping**: Selective export of hours, absences, variables, or expenses.

---

## 5. Formation (`/dashboard/hr/training`)
Strategic management of workforce skills, regulatory certifications, and educational budgets.

### 5.1 SSIAP
*   **Link**: [`/dashboard/hr/training/ssiap`](/dashboard/hr/training/ssiap)
*   **Purpose**: specialized tracking of fire safety certifications (*Service de Sécurité Incendie et d'Assistance à Personnes*).
*   **Functionality**:
    *   **Level Management**: Support for SSIAP 1 (Agent), 2 (Chef d'équipe), and 3 (Chef de service).
    *   **Certification Lifecycle**: Tracking from initial issuance to mandatory periodic renewals.
    *   **CNAPS Compliance**: Integrated validation workflow to ensure certifications meet regulatory requirements.
    *   **Visual Status**: Dashboard highlighting valid vs. expiring certifications for the security force.

### 5.2 SST & recyclages
*   **Link**: [`/dashboard/hr/training/sst`](/dashboard/hr/training/sst)
*   **Purpose**: Monitoring of first-aid certifications (*Sauveteur Secouriste du Travail*).
*   **Functionality**:
    *   **Renewal Workflow**: Dedicated system for managing "Recyclages" (periodic refresher training).
    *   **Historical Continuity**: Maintains links between initial certification and subsequent renewals.
    *   **Gap Analysis**: Identifies employees needing training to meet mandatory workforce ratios.

### 5.3 Habilitations H0B0
*   **Link**: [`/dashboard/hr/training/h0b0`](/dashboard/hr/training/h0b0)
*   **Purpose**: Management of electrical authorizations for non-electrician personnel operating in restricted areas.
*   **Status**: *Module currently under construction.*
*   **Functionality (Planned)**: Delivery tracking, renewal alerts, and centralized repository for habilitation certificates.

### 5.4 Plan & budget de formation
*   **Link**: [`/dashboard/hr/training/plan`](/dashboard/hr/training/plan)
*   **Purpose**: Annual strategic planning and financial monitoring of training investments.
*   **Functionality**:
    *   **Budgeting Dashboard**: Tracking of total annual budget vs. actual consumption by department or training type.
    *   **Session Planning**: Management of upcoming training sessions (organizers, locations, durations, and participants).
    *   **Cost Projection**: Estimated vs. actual cost analysis for better financial predictability.

### 5.5 Alertes d'expiration
*   **Link**: [`/dashboard/hr/training/alerts`](/dashboard/hr/training/alerts)
*   **Purpose**: Centralized "Control Tower" for all regulatory expiration dates.
*   **Functionality**:
    *   **Severity Scoring**: Categorization of risks (Critical, High, Medium) based on remaining days.
    *   **Consolidated View**: Unified list of all SSIAP, SST, H0B0, and other certifications requiring action.
    *   **Acknowledgement Workflow**: Ability to track which alerts are being handled by HR.

### 5.6 Registre de formation (History)
*   **Link**: [`/dashboard/hr/training/history`](/dashboard/hr/training/history)
*   **Purpose**: The official, historical register of all training events and professional development.
*   **Functionality**:
    *   **Regulatory Register**: Maintains a compliant log of all professional, regulatory, and technical training.
    *   **Funding Tracking**: Monitoring of financial sources (OPCO/AKTO, Company budget, Personal CPF).
    *   **PDF Export**: Generation of the official "Registre Unique de Formation" for administrative audits.

---

## 6. Cycle de vie salarié (`/dashboard/hr/lifecycle`)
End-to-end management of the employee journey, from initial application to departure.

### 6.1 Candidatures (Recruitment)
*   **Link**: [`/dashboard/hr/lifecycle/recruitment/applications`](/dashboard/hr/lifecycle/recruitment/applications)
*   **Purpose**: Pipeline management for potential new hires in the security sector.
*   **Functionality**:
    *   **Applicant Tracking (ATS)**: centralized database of candidates with contact info, position sought, and sourcing.
    *   **Funnel Management**: Status tracking from "Pending" through "Interviewed" to "Accepted/Rejected".
    *   **Document Repository**: Centralized storage for CVs and cover letters for easy review by hiring managers.
    *   **External Sourcing**: Quick integration links with official job boards like France Travail.

### 6.2 Vérifications réglementaires
*   **Link**: [`/dashboard/hr/lifecycle/recruitment/verifications`](/dashboard/hr/lifecycle/recruitment/verifications)
*   **Purpose**: Critical compliance check for private security personnel before hiring.
*   **Functionality**:
    *   **CNAPS Verification**: Formal tracking of the validity of the candidate's professional card.
    *   **Diploma Audit**: Verification and storage of required certifications (CQP, SSIAP, etc.).
    *   **Compliance Workflow**: Enforced review process that prevents hiring of non-compliant personnel.
    *   **Audit History**: Immutable log of who verified the candidate's credentials and when.

### 6.3 Création contrat & signature électronique
*   **Link**: [`/dashboard/hr/lifecycle/recruitment/contracts`](/dashboard/hr/lifecycle/recruitment/contracts)
*   **Purpose**: Legal formalization of the employment relationship using modern digital tools.
*   **Functionality**:
    *   **Smart Templates**: Support for CDI, CDD, Interim, and Apprenticeships.
    *   **Automated Rules**: Automatic calculation of probation periods based on collective agreements and position levels.
    *   **Digital Signature**: Integration of electronic signature workflows for both the employee and the legal representative.
    *   **Contract Vault**: Secure storage of signed digital contracts with status monitoring.

### 6.4 Parcours d'intégration (Onboarding)
*   **Link**: [`/dashboard/hr/lifecycle/recruitment/onboarding`](/dashboard/hr/lifecycle/recruitment/onboarding)
*   **Purpose**: Structured integration programs to ensure new hires are operational and compliant.
*   **Functionality**:
    *   **Visual Roadmap**: Progress tracking for each new employee's onboarding journey.
    *   **Multi-category Checklists**: Tracking of administrative documents, initial training, and equipment delivery (PPE, Radios).
    *   **Deadlines**: Automatic monitoring of milestone dates to ensure timely integration.

### 6.5 Entretiens (Reviews)
*   **Link**: [`/dashboard/hr/lifecycle/interviews`](/dashboard/hr/lifecycle/interviews)
*   **Purpose**: Management of recurring performance and career development dialogues.
*   **Functionality**:
    *   **Dual Track Reviews**: Management of both Annual Performance Reviews and mandatory Professional Development Interviews.
    *   **Objective Tracking**: SMART goal management with visual progress indicators and status updates.
    *   **History Vault**: Archival of previous interview minutes and agreed-upon action plans.
    *   **Scheduling**: Monitoring of review frequencies to ensure regulatory interview windows are met.

### 6.6 Discipline
*   **Link**: [`/dashboard/hr/lifecycle/discipline`](/dashboard/hr/lifecycle/discipline)
*   **Purpose**: Legal and administrative management of disciplinary matters.
*   **Functionality**:
    *   **Warning Management**: Tracking of formal warnings (*avertissements*) and their validity periods.
    *   **Procedure Monitoring**: Step-by-step tracking of complex disciplinary procedures (convocations, interviews).
    *   **Sanctions Register**: A centralized, compliant log of all applied disciplinary sanctions.

### 6.7 Offboarding (Exit)
*   **Link**: [`/dashboard/hr/lifecycle/offboarding`](/dashboard/hr/lifecycle/offboarding)
*   **Purpose**: Comprehensive management of contract terminations and employee departures.
*   **Functionality**:
    *   **Notice Period Tracking**: Monitoring of *préavis* start and end dates.
    *   **Asset Recovery**: Checklist for the return of company property (Keys, PPE, Communication devices).
    *   **Automated Document Generation**: One-click creation of mandatory exit documents (*Certificat de travail*, *Attestation Pôle Emploi*, *Solde de tout compte*).
    *   **Archiving**: Final workflow to export data to payroll and move the employee record to archives.

---

## 7. Conformité & Registres (`/dashboard/hr/compliance`)
Legal safeguarding of the organization through mandatory registries and health monitoring.

### 7.1 DUERP
*   **Link**: [`/dashboard/hr/compliance/duerp`](/dashboard/hr/compliance/duerp)
*   **Purpose**: Management of the *Document Unique d'Évaluation des Risques Professionnels* (legally mandatory).
*   **Functionality**:
    *   **Risk Mapping by Position**: Specific risk assessments for security roles (PC Security, Patrol, Event security).
    *   **Hazard Identification**: Tracking of causes, gravity, and probability for each identified risk.
    *   **Preventive Actions**: Documentation of mandatory safety measures and training required to mitigate risks.
    *   **Dynamic Updates**: Ability to add new operational posts and adapt the risk profile accordingly.

### 7.2 Accidents du travail
*   **Link**: [`/dashboard/hr/compliance/work-accidents`](/dashboard/hr/compliance/work-accidents)
*   **Purpose**: Official registry and tracking of occupational accidents and injuries.
*   **Functionality**:
    *   **Incident Logging**: Detailed capture of accident circumstances (Time, location, description, witnesses).
    *   **Administrative Tracking**: Monitoring of CPAM notifications and official declaration numbers.
    *   **Absence Integration**: Direct link to work stoppage periods and return-to-work dates.
    *   **Severity Analysis**: Dashboard for monitoring safety trends and accident severity across sites.

### 7.3 Suivi CDD
*   **Link**: [`/dashboard/hr/compliance/cdd`](/dashboard/hr/compliance/cdd)
*   **Purpose**: Regulatory monitoring of short-term contracts to prevent legal reclassification risks.
*   **Functionality**:
    *   **Entry/Exit Log**: Precise tracking of effective start and end dates for all CDD and Interim staff.
    *   **Motif Management**: Documentation of the legal reason for recourse (Replacement, Temporary increase, etc.).
    *   **Renewal Control**: Automatic tracking of the number of renewals to ensure compliance with labor laws.
    *   **Export for Inspection**: One-click generation of the CDD registry for labor inspectors.

### 7.4 Médecine du travail
*   **Link**: [`/dashboard/hr/compliance/occupational-medicine`](/dashboard/hr/compliance/occupational-medicine)
*   **Purpose**: Comprehensive monitoring of employee health visits and fitness status.
*   **Functionality**:
    *   **Visit Type Tracking**: Management of VM, VIP, and mandatory return-to-work visits after long absences.
    *   **Aptitude Management**: Formal logging of "Apte" vs "Inapte" status with support for specific medical restrictions.
    *   **Proactive Alerts**: Automated system to notify HR of overdue visits or upcoming renewal dates.
    *   **Organization Directory**: Centralized contact management for occupational health centers and doctors.

### 7.5 Exports réglementaires (Compliance Hub)
*   **Link**: [`/dashboard/hr/compliance`](/dashboard/hr/compliance)
*   **Purpose**: The central "Control Tower" for generating all legally required books and registers.
*   **Functionality**:
    *   **Unified Export Engine**: One-click generation of multiple registers (Personnel, Sanctions, Accidents, Training, CDD).
    *   **Regulatory Formats**: Guaranteed compliance with CNAPS and Labor Inspection PDF standards.
    *   **Selective Scoping**: Ability to export specific date ranges or specific types of registers.
    *   **Audit Readiness**: Visual confirmation of which mandatory registers are currently valid and ready for inspection.

### 7.6 Registres réglementaires
*   **Link**: [`/dashboard/hr/compliance/registers`](/dashboard/hr/compliance/registers)
*   **Purpose**: Unified digital consultation view of all mandatory company registers.
*   **Status**: *Currently under construction.*

---

## 8. Workflows & Pilotage (`/dashboard/hr/workflows` & `/dashboard/hr/pilotage`)
Operational automation, digital communication, and strategic data-driven steering.

### 8.1 Workflows (HR Operations)
*   **Vue d'ensemble** ([`/dashboard/hr/workflows/requests`](/dashboard/hr/workflows/requests)): Central dashboard for tracking all incoming employee requests (Certificates, Info changes, Documents).
*   **Demandes de documents** ([`/dashboard/hr/workflows/document`](/dashboard/hr/workflows/document)): Specialized workflow for requesting payslips, contracts, or tax documents with multiple delivery methods (Email, Pickup, Mail).
*   **Changements d'informations** ([`/dashboard/hr/workflows/bank-details`](/dashboard/hr/workflows/bank-details)): Managed process for updating sensitive personal data (IBAN, Address, Civil status) with mandatory supporting documents.
*   **Signature électronique** ([`/dashboard/hr/workflows/signatures/all`](/dashboard/hr/workflows/signatures/all)): EIDAS-compliant hub for managing digital signatures for contracts, disciplinary actions, and equipment delivery slips.
*   **Automatisation RH** ([`/dashboard/hr/workflows/automation`](/dashboard/hr/workflows/automation)): Rule-based engine (Trigger-Condition-Action) to automate repetitive tasks like auto-validating short leaves or sending expiration alerts.

### 8.2 Pilotage (Strategic Steering)
*   **Tableaux de bord RH** ([`/dashboard/hr/pilotage/dashboards`](/dashboard/hr/pilotage/dashboards)): Automated "Bilan Social" featuring real-time data visualization of turnover, gender pay gap, hourly costs, and workforce demographics.
*   **Communication Hub**:
    *   **Modèles d'emails** ([`/dashboard/hr/pilotage/communication/templates`](/dashboard/hr/pilotage/communication/templates)): Library of dynamic templates using variables (e.g., `{{prenom}}`, `{{nom}}`) for consistent HR communication.
    *   **Envois emails** ([`/dashboard/hr/pilotage/communication/send-email`](/dashboard/hr/pilotage/communication/send-email)): Mass mailing tool targeting employees, clients, or partners with archival in their respective dossiers.
    *   **Notifications & SMS** ([`/dashboard/hr/pilotage/communication/notifications`](/dashboard/hr/pilotage/communication/notifications)): Configuration for push notifications to the mobile app and SMS alerts.
    *   **Archives** ([`/dashboard/hr/pilotage/communication/archives`](/dashboard/hr/pilotage/communication/archives)): Historical log of all platform-sent communications with delivery status tracking.

### 8.3 Business (HR Marketing & Tenders)
*   **Marketing RH** ([`/dashboard/hr/business/marketing`](/dashboard/hr/business/marketing)): Tools for employer branding (Social post scheduling), recruitment auto-replies, and a simplified CRM for client prospecting.
*   **Appels d'offres** ([`/dashboard/hr/business/tenders`](/dashboard/hr/business/tenders)): Specialized hub for monitoring security service tenders with direct links to official portals (BOAMP, Marchés Publics) and dossier tracking.
