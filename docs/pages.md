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

### Coming Soon
- Payroll Calculation
- Automatic Controls
- Social Report
- Payroll KPI Dashboard