# Pages Documentation

This file documents all implemented pages in the Safyr application with their features.

## Payroll Module

### 1. Payroll Configuration (Legal, Conventional, Company & Employee)
**Route**: `/dashboard/payroll/configuration`

**Description**: Comprehensive payroll configuration page covering legal parameters, collective agreements, company structures, and employee settings. Uses a full-width tab-based layout where tabs replace the module navigation bar.

**Layout Pattern**: 
- No side navigation bar (hidden for this page)
- Tabs displayed at the top of the page with icons
- Each tab contains its own header, actions, and data table
- Similar to employee detail page layout pattern

**Features**:

#### Tab 1: Legal & Conventional (Légal & Conventionnel)
- List of collective agreements (IDCC, name, sector)
- Minimum hourly rate management
- Bonus configuration (night, Sunday, public holidays)
- Overtime settings
- Maximum working time amplitude
- Work Accident/Occupational Disease rates (AT/MP)
- Full CRUD with create/edit/view modals
- Search and sort agreements
- Status: Active, Under Review, Inactive

#### Tab 2: Company Structures (Structures)
- Management of companies, establishments, and departments
- Hierarchical structures (parent/child)
- SIRET numbers and addresses
- Active/inactive status

#### Tab 3: Cost Centers (Centres de Coûts)
- Analytical and operational centers
- Links to company structures
- Budget management
- Custom codes and labels

#### Tab 4: Internal Rules (Règles Internes)
- Configuration of bonuses and allowances
- Calculation types: Fixed, % Salary, % Hours
- Frequencies: Monthly, Quarterly, Annual, One-time
- Eligibility by staff category
- Amount and percentage management

#### Tab 5: Monthly Closings (Clôtures)
- List of payroll periods
- Closing tracking (Open, Closed, Validated)
- Payroll amounts and employee count
- Closing date and responsible person

#### Tab 6: Accounting Transfers (Transferts Compta)
- Configuration of exports to accounting
- Types: Payroll, Charges, Provisions
- Account prefixes
- Analytical axes
- Automatic or manual transfer

#### Tab 7: Employee Contracts (Contrats)
**Sub-tab: Active Contracts**
- List of current contracts
- Types: Permanent (CDI), Fixed-term (CDD), Temporary, Apprenticeship
- Hourly rates and gross monthly salaries
- Weekly hours
- Staff categories

**Sub-tab: History (Historique)**
- Contract modification history
- Types: Amendment, Modification, Renewal, Termination
- Previous and new values
- Dates and validators

**Sub-tab: DPAE / DUE**
- Prior Employment Declarations (DPAE)
- Unique Employment Declarations (DUE)
- Status: Pending, Sent, Validated, Rejected
- Declaration references

#### Tab 8: Assignments (Affectations)
- Employee assignments to sites and clients
- Positions held
- Start and end dates
- Weekly hours per assignment
- Status: Active, Ended, Suspended

#### Tab 9: Qualifications (Habilitations)
- Management of qualifications and certifications
- Types: CQP, Professional Card, SST, SSIAP, Other
- Qualification numbers
- Issue and expiry dates
- Expiry alerts (Valid, Expiring Soon, Expired)

#### Tab 10: Absence Import (Import Absences)
- Configuration of automatic absence import
- Types: Sick Leave, Work Accident/Occupational Disease, Paid Leave, Unpaid Leave
- Sources: HR Module, Planning, External
- Frequencies: Real-time, Daily, Weekly, Manual
- Last import tracking
- Enable/disable by absence type

**CRUD Operations**:
All tabs support full CRUD (Create, Read, Update, Delete) operations:
- **Create**: "+" button on each tab opens a modal with form fields specific to that entity
- **View**: Eye icon in actions dropdown shows read-only details modal
- **Edit**: Pencil icon opens edit modal pre-filled with existing data
- **Delete**: Trash icon with confirmation prompt removes the item
- Actions accessed via three-dot menu (MoreVertical) in each row

**Forms Implemented**:
1. **Company Structure**: Code, name, type (société/établissement/service), SIRET, address, status
2. **Cost Center**: Code, name, type (Analytique/Opérationnel), budget, status
3. **Internal Rule**: Code, name, type (Prime/Indemnité), amount/percentage, calculation basis, frequency
4. **Monthly Closing**: Month, year, closing date, closed by, status
5. **Accounting Transfer**: Name, transfer type, account prefix, analytical axis, automatic transfer toggle
6. **Employee Contract**: Employee name, contract type, position, hourly rate, monthly gross salary, weekly hours
7. **Employee Assignment**: Employee name, site, client, position, start date
8. **Employee Qualification**: Employee name, qualification type, name, number, issue/expiry dates
9. **Absence Import Config**: Absence type, source module, auto-import toggle, import frequency

**Components used**:
- Tabs for main tab organization (10 tabs)
- Nested tabs for contract subcategories
- DataTable for all tables with row actions
- DropdownMenu with MoreVertical trigger for row actions
- Modal for CRUD operations (separate modals for view and edit)
- Badge for statuses and types
- Select, Input, Label for forms
- Switch for boolean toggles

**Integrations**:
- HR Module (absence import, employee data)
- Planning Module (paid leave, assignments)
- Accounting Module (accounting transfers)
- Geolocation Module (sites and positions)

**Mock Data**:
- `/src/data/payroll-conventions.ts`: Legal collective agreements
- `/src/data/payroll-company-config.ts`: Structures, cost centers, internal rules, closings, transfers
- `/src/data/payroll-employee-config.ts`: Contracts, history, declarations, assignments, qualifications, absence configs

**Implementation Notes**:
- Consolidates both "Paramétrage Légal & Conventionnel" (Item D.1) and "Paramétrage Entreprise & Salarié" (Item D.2) into a single comprehensive configuration page
- Uses full-width tab-based layout - tabs replace the navigation bar
- Navigation bar is conditionally hidden when pathname is `/dashboard/payroll/configuration`
- Layout controlled in `PayrollLayout` component using `usePathname` hook
- 10 main tabs with icons for visual clarity
- Nested tabs for contract management (3 sub-tabs)
- All data tables support search and sorting
- Complete CRUD operations with handlers for create, view, edit, and delete
- Modal system: separate modal for legal conventions (complex form), view modal for read-only details, generic form modal for other entities
- Row actions implemented via DropdownMenu component with Eye/Pencil/Trash icons
- Delete operations include confirmation prompt
- Form fields dynamically rendered based on entity type via `renderFormFields()` function
- State management with individual setters for each entity type
- Back button to return to payroll dashboard
- Page padding removed when navigation is hidden to allow full-width tabs

---

## Implementation Notes

### Naming Conventions
- Routes in kebab-case
- Components in PascalCase
- Data files in kebab-case with module prefix

### Patterns Used
- Client components with "use client"
- Local state with useState
- Nested tabs for subcategories
- Reusable DataTable for all tables
- Generic Modal for CRUD operations
- Badge for consistent visual statuses
- Separate modal handlers for complex forms (conventions) vs. simple placeholder modals (other entities)
- Conditional layout rendering based on pathname (hide navigation for specific pages)
- Tab-based navigation with state management (activeTab)

### 2. Payroll Variables - Input & Import
**Route**: `/dashboard/payroll/variables`

**Description**: Comprehensive variable input and import management for payroll processing. Allows synchronization of data from internal modules (Planning, HR) and import from external sources. Includes automated coherence checks and validation workflow.

**Features**:

#### Period Selection
- Dropdown selector for payroll periods (month/year)
- Visual period selector with calendar icon
- Shows period status: Draft, Importing, Review, Validated, Calculated, Closed
- Tracks total employees, imported count, validated count, errors, and warnings

#### Statistics Dashboard
- **Employees**: Total employee count for the period
- **Importés**: Number of employees with complete import (Planning + HR)
- **Validés**: Number of validated employee records
- **Erreurs**: Count of employees with blocking errors
- **Avertissements**: Count of employees with warnings

#### Data Synchronization Actions
Three main import sources:
1. **Synchroniser Planning**: One-click sync of latest planning data
   - Normal hours, night hours, holiday hours
   - Overtime (25%, 50%)
   - Sunday hours, Sunday night hours
   - Holiday night hours, on-call hours
   - Meal allowances, travel allowances
   - Dressing allowances, uniform allowances

2. **Synchroniser RH**: One-click sync of latest HR data
   - Paid leave (congés payés)
   - Sick leave (maladie)
   - Work accidents (arrêts AT)
   - Exceptional leave
   - Maternity/paternity leave
   - Union hours (heures de délégation syndicales)
   - Salary deductions (retenues)

3. **Importer fichier externe**: Manual upload of CSV/Excel files
   - File format validation
   - Dialog with file upload interface
   - Supports .csv, .xlsx, .xls formats

#### Coherence Checks Panel
Automated validation displayed when issues are detected:
- **Errors** (blocking):
  - Hours exceeding legal maximum
  - Missing contract information
  - Invalid data entries
  - Each error shows employee name, description, and "Corriger" action

- **Warnings** (non-blocking):
  - Missing absence data
  - Unusual hour patterns
  - Data completeness issues
  - Each warning shows employee name, description, and "Voir" action

#### Data Tables (3 Tabs)

**Tab 1: Vue d'ensemble (Overview)**
Columns:
- Employee (name + ID)
- Position
- Contract type (CDI, CDD, Intérim, Apprentissage)
- Planning import status (badge with icon)
- HR import status (badge with icon)
- Validation status (Erreurs, Avertissements, Validé, À valider)
- Actions dropdown: View details, Edit, Validate

**Tab 2: Heures Planning (Planning Hours)**
Detailed hour breakdown:
- Employee name
- Normal hours (H. Normales)
- Night hours (H. Nuit)
- Holiday hours (H. Fériées)
- Overtime 25% (H. Sup 25%)
- Overtime 50% (H. Sup 50%)
- Sunday hours (H. Dimanche)
- Meal allowances (Paniers)
- Edit action per row

**Tab 3: Absences RH (HR Absences)**
Absence data:
- Employee name
- Paid leave (Congés payés)
- Sick leave (Maladie)
- Work accidents (AT)
- Exceptional leave (Congés except.)
- Union hours (H. Syndicales)
- Salary deductions (Retenues)
- Edit action per row

#### View/Edit Modal
Comprehensive modal for viewing and editing employee variables:

**Employee Information**:
- Employee name (read-only)
- Position (read-only)

**Planning Hours Section**:
All hours use HoursInput component with increment/decrement buttons:
- Normal hours (0.5 step increments)
- Night hours
- Holiday hours
- Overtime 25%
- Overtime 50%
- Sunday hours
- Meal allowances (integer input)
- Travel allowances (integer input)
- Dressing allowances (integer input)

**HR Absences Section**:
Integer inputs for:
- Paid leave (days)
- Sick leave (days)
- Work accident (days)
- Exceptional leave (days)
- Union hours
- Salary deductions (euros)

**Coherence Checks Section**:
Displays all validation results for the employee:
- Error messages in red background
- Warning messages in orange background
- Details and expected vs. actual values

**Modal Actions**:
- **View mode**: "Fermer" button only
- **Edit mode**: "Fermer" and "Enregistrer" buttons
- Saves changes with last modified timestamp

#### External Import Dialog
Simple file upload interface:
- Period display (read-only)
- File input (.csv, .xlsx, .xls)
- Format instructions
- Import confirmation
- Cancel and Import actions

**Import Status Badges**:
- **En attente** (Pending): Gray/outline
- **Import en cours** (Importing): Secondary with refresh icon
- **Importé** (Imported): Default with checkmark
- **Erreur** (Error): Destructive with X icon
- **Validé** (Validated): Green with check icon

**Row Actions**:
- **Voir détails**: Opens view-only modal
- **Modifier**: Opens edit modal with all fields
- **Valider**: Marks record as validated (only if no errors)

**Components Used**:
- InfoCard and InfoCardContainer for statistics
- PeriodSelector for period selection
- HoursInput for all hour inputs (with increment/decrement)
- DataTable for all three tabs
- Tabs for organizing different views
- Dialog for view/edit and external import
- Badge for status indicators
- Card for grouping sections
- DropdownMenu for row actions

**Mock Data**:
- `/src/data/payroll-variables.ts`:
  - 10 employee payroll variable records
  - 3 payroll periods (current + 2 previous)
  - Coherence check examples (errors and warnings)
  - Helper functions: getVariablesByPeriod, getVariableById, getCurrentPeriod, getPeriodsForSelector

**Types** (`/src/lib/types.d.ts`):
- ImportSource: "planning" | "hr" | "external" | "manual"
- ImportStatus: "pending" | "importing" | "imported" | "error" | "validated"
- PlanningHoursImport: All hour types and allowances from planning
- HRAbsencesImport: All absence types from HR
- CoherenceCheck: Validation results with severity levels
- EmployeePayrollVariables: Main entity combining all data
- PayrollPeriod: Period management with status tracking

**Integrations**:
- Planning Module: Automatic sync of worked hours and allowances
- HR Module: Automatic sync of absences and deductions
- External Systems: CSV/Excel import capability
- Payroll Calculation: Provides input for payroll processing

**Workflow**:
1. Select payroll period
2. Sync data from Planning module
3. Sync data from HR module
4. Review coherence checks (errors and warnings)
5. Correct any errors via edit modal
6. Validate employee records individually or in bulk
7. Optionally import additional data from external files
8. Once all validated, data is ready for payroll calculation

**Implementation Notes**:
- Implements specification item D.3 "Saisie & Import des Variables"
- All 15 checklist items completed and marked in todo.md
- Uses InfoCard component for consistent statistics display
- PeriodSelector component for reusable period selection
- HoursInput component provides better UX for hour entry
- Warning colors improved for better contrast (orange instead of yellow)
- Sync actions are one-click operations (not complex imports)
- External import is the only manual file-based import
- Real-time coherence checks displayed prominently
- Modal forms support both view and edit modes
- All hour inputs support decimal values (0.5 increments)
- Table search functionality on employee name
- Responsive grid layouts for cards and forms

---

## Reusable Components

### PeriodSelector
**Location**: `/src/components/ui/period-selector.tsx`

**Description**: Reusable component for selecting payroll/accounting periods across the application.

**Props**:
- `periods`: Array of Period objects (id, month, year, label)
- `selectedPeriod`: Currently selected period
- `onPeriodChange`: Callback when period changes
- `label`: Optional label text (default: "Période")
- `showIcon`: Optional calendar icon display (default: true)
- `className`: Optional additional CSS classes

**Helper Function**:
- `generatePeriods(startYear, startMonth, count)`: Generates array of periods going backwards from start date

**Usage**:
```tsx
<PeriodSelector
  periods={periods}
  selectedPeriod={selectedPeriod}
  onPeriodChange={setSelectedPeriod}
  label="Période de paie"
/>
```

**Implementation Notes**:
- Can be used in Payroll, HR, Accounting, or any module needing period selection
- Consistent UI across the application
- French month names
- Period format: "Janvier 2024", "Février 2024", etc.

### 3. Payroll Calculation
**Route**: `/dashboard/payroll/calculation`

**Description**: Complete payroll calculation engine that processes all employee variables, applies legal and contractual rules, calculates social contributions, and generates pay slips. Handles gross to net calculations with full breakdown of all salary elements and contributions.

**Features**:

#### Period Selection
- Reuses PeriodSelector component for consistent period selection
- Shows selected period prominently
- Period determines which calculation run to display

#### Calculation Status Overview
Five key metrics displayed using InfoCard components:
1. **Total Employés**: Total number of employees in the period
2. **Calculés**: Employees with completed calculations (blue/success)
3. **En Attente**: Pending calculations (yellow/warning)
4. **Erreurs**: Employees with calculation errors (red/danger)
5. **Validés**: Validated and locked calculations (green/info)

#### Financial Summary
Four main financial cards:
1. **Masse Salariale Brute**: Total gross payroll for all employees
2. **Total Net à Payer**: Total net salary to be paid (green)
3. **Charges Patronales**: Total employer contributions (orange)
4. **Coût Total**: Complete cost including gross salary + employer charges (primary)

All amounts displayed in euros with French formatting (e.g., "14 136,50 €")

#### Action Buttons
Contextual actions based on calculation status:
- **Calculer (X)**: Run calculation for pending employees (shows count)
- **Recalculer tout**: Recalculate all employees from scratch
- **Valider & Verrouiller**: Lock calculations to prevent modifications
- **Bulletins de Paie**: Export all pay slips as PDFs
- **Générer DSN**: Generate monthly DSN declaration file

#### Employee Calculations Table
Comprehensive DataTable with columns:
- **Matricule**: Employee registration number (sortable)
- **Nom**: Employee name and position (sortable)
- **Statut**: Calculation status badge (Validé, Calculé, En attente, Erreur)
- **Brut**: Gross salary (sortable)
- **Net**: Net salary (sortable)
- **Charges patronales**: Employer contributions (sortable)
- **Coût total**: Total cost per employee (sortable, primary color)
- **Actions**: View details (eye icon), Download pay slip (if calculated)

**Status Badges**:
- **Validé** (Validated): Green with CheckCircle icon
- **Calculé** (Calculated): Blue with Calculator icon
- **En attente** (Pending): Gray with Clock icon
- **Erreur** (Error): Red with AlertCircle icon

#### Employee Calculation Detail Modal
Full-width modal with 4 tabs showing complete calculation breakdown:

**Tab 1: Vue d'ensemble (Overview)**

Three main cards:
1. **Informations Employé**:
   - Matricule (employee number)
   - Poste (position)
   - Contrat (contract type)
   - Période
   - Statut (badge)

2. **Résumé Financier**:
   - Salaire Brut
   - - Cotisations salarié (red, deduction)
   - = Net à Payer (bold, green)
   - Net Imposable (current month)
   - Net Imposable Cumulé (year-to-date)

3. **Coût Employeur**:
   - Salaire Brut
   - + Charges patronales (orange)
   - = Coût Total (bold, primary, large text)

4. **Maintien de Salaire (IJSS)** (if applicable):
   - Blue card displayed when sick leave with salary maintenance
   - Montant IJSS (social security benefit amount)
   - Maintien de salaire (employer top-up)

5. **Alertes & Erreurs** (if any):
   - Red cards for blocking errors with AlertCircle icon
   - Orange cards for warnings with AlertCircle icon
   - Full error/warning message text

**Tab 2: Éléments de Paie (Salary Elements)**

Two sections:
1. **Gains (Earnings)**:
   - Each earning displayed as a row
   - Label and code
   - Quantity × Rate calculation (if applicable)
   - Amount in green (+ prefix)
   - Categories: Base salary, hours, overtime, bonuses, allowances

2. **Déductions (Deductions)**:
   - Each deduction displayed as a row
   - Label and code
   - Quantity × Rate calculation (if applicable)
   - Amount in red (negative)
   - Categories: Absences, advances, other deductions

3. **Salaire Brut (Summary)**:
   - Gray background card
   - Bold total in large text

**Tab 3: Cotisations Salarié (Employee Contributions)**

Detailed breakdown of all employee social contributions:
- Each contribution displayed as a row
- Label and code (e.g., "S21.G05.00.002")
- Tranche indication (A, B, or C for social security ceiling)
- Base amount × Rate% calculation
- Contribution amount in red
- Categories:
  - Assurance maladie (health insurance)
  - Retraite Tranche 1 & 2 (retirement)
  - Assurance chômage (unemployment)
  - CSG déductible (deductible social contribution)
  - CSG non déductible (non-deductible social contribution)
  - CRDS (social debt repayment)

Summary card (gray background):
- Salaire Brut
- - Total Cotisations Salarié (red)
- = Net à Payer (bold, green, large)

**Tab 4: Cotisations Patronales (Employer Contributions)**

Detailed breakdown of all employer social contributions:
- Each contribution displayed as a row
- Label and code
- Tranche indication (A, B, or C)
- Base amount × Rate% calculation
- Contribution amount in orange
- Categories:
  - Assurance maladie (health insurance - 13%)
  - Retraite Tranche 1 & 2 (retirement)
  - Assurance chômage (unemployment - 4.05%)
  - Allocations familiales (family allowances - 3.45% or 5.25%)
  - Accidents du travail (work accidents)

Summary card (gray background):
- Salaire Brut
- + Total Charges Patronales (orange)
- = Coût Total Employeur (bold, primary, large)

**Calculation Logic Implemented**:
1. **Gross Salary Calculation**:
   - Base salary (monthly)
   - Hours (normal, night, holiday, overtime with majoration)
   - Bonuses and premiums
   - Allowances (meal, travel, uniform)
   - Absence deductions

2. **Social Contributions**:
   - Social security ceiling (Plafond SS): 3,864 € (2024)
   - Tranche A: up to 1× ceiling
   - Tranche B: between 1× and 4× ceiling
   - Employee contributions: retirement, CSG, CRDS (no health or unemployment)
   - Employer contributions: health (13%), retirement, unemployment (4.05%), family, work accidents

3. **IJSS (Sick Leave Benefits)**:
   - Social security benefit amount
   - Employer salary maintenance
   - Net calculation including IJSS

4. **Net Calculations**:
   - Net salary: Gross - Employee contributions
   - Net taxable: Net + non-deductible CSG/CRDS
   - Net to pay: Net salary (+ allowances if not included)
   - Year-to-date cumulative tracking

**Components Used**:
- PeriodSelector for period selection
- InfoCard for statistics
- Card for financial summary and sections
- DataTable for employee list
- Dialog for detail modal
- Tabs for organizing detail sections
- Badge for status indicators
- Button for actions

**Mock Data**:
- `/src/data/payroll-calculation.ts`:
  - 6 employee calculations (4 calculated, 1 validated, 1 pending, 1 error)
  - Complete PayrollCalculationRun for December 2024
  - Realistic French salary calculations with proper rates
  - Social contributions following French law
  - Pay slip records
  - DSN declaration
  - Helper functions: getCalculationRun, getEmployeeCalculation, getPaySlips, getDSNDeclaration, calculateTotals
  - Factory functions for creating salary elements and contributions

**Types** (`/src/lib/types.d.ts`):
- PayrollCalculationStatus: pending | calculating | calculated | validated | error | exported
- SalaryElement: Earnings and deductions with type, category, quantity, rate, amount
- SocialContributionDetail: Employee and employer contributions with base, rate, amount, tranche
- EmployeePayrollCalculation: Complete calculation for one employee
- PayrollCalculationRun: Complete calculation run for a period
- PaySlip: Pay slip document tracking
- DSNDeclaration: DSN declaration data

**Calculation Features**:
1. **Gross Salary**: All earning elements summed
2. **IJSS Management**: Automatic calculation with salary maintenance
3. **Bonuses**: All types (performance, seniority, responsibility, precarity)
4. **Absences**: Deducted from gross salary
5. **Overtime**: 25% and 50% majoration applied
6. **Social Security Ceilings**: Tranche A/B regularization
7. **Net Taxable**: Monthly and year-to-date cumulative
8. **Pay Slips**: PDF generation ready (status tracking)
9. **DSN**: Automatic declaration generation

**Workflow**:
1. Select payroll period
2. Review calculation status overview
3. Click "Calculer" to run pending calculations
4. Review each employee calculation
5. Click employee row to view full detail breakdown
6. Verify all salary elements, contributions, and amounts
7. Correct any errors by recalculating
8. Validate and lock calculations
9. Export pay slips as PDFs
10. Generate DSN declaration for submission

**Integration Points**:
- Input from Payroll Variables (D.3): Uses imported hours and absences
- Legal/Conventional parameters (D.1): Applies rates and rules
- Employee configuration (D.2): Uses contract and assignment data
- Output to Controls (D.5): Provides data for automated checks
- Output to Social Report (D.6): Feeds into reporting
- Pay slip distribution: Employee portal, email, HR vault
- DSN: Automated social declarations

**Implementation Notes**:
- Implements specification item D.4 "Calcul de Paie"
- All 9 checklist items completed and marked in todo.md
- Uses realistic 2024 French social contribution rates
- Plafond SS: 3,864 € monthly
- CSG calculated on 98.25% of gross (assiette)
- Family allowances: 3.45% or 5.25% based on salary level
- Complete breakdown from gross to net with all intermediary steps
- Employee and employer sides fully detailed
- Year-to-date tracking for net taxable
- Error and warning display for calculation issues
- Status-based action buttons (contextual UI)
- Modal tabs provide organized view of complex data
- French number formatting throughout
- Color coding: green for net/earnings, red for deductions, orange for employer charges
- Responsive grid layouts
- Search and sort on employee table

---

### Coming Soon
- Automatic Controls (D.5)
- Social Report (D.6)
- Payroll KPI Dashboard (D.7)