// ============================================================================
// RECRUITMENT & INTEGRATION TYPES
// ============================================================================

export interface JobApplication {
  id: string;
  employeeId?: string;
  applicantName: string;
  email: string;
  phone: string;
  position: string;
  cv?: string; // File URL
  coverLetter?: string; // File URL
  status: "pending" | "reviewed" | "interviewed" | "accepted" | "rejected";
  appliedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegulatoryVerification {
  id: string;
  applicationId: string;
  cnapsVerified: boolean;
  diplomasVerified: boolean;
  cnapsNumber?: string;
  diplomaFiles: string[]; // File URLs
  verifiedAt?: Date;
  verifiedBy?: string;
  status: "pending" | "verified" | "rejected";
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OnboardingTask {
  id: string;
  employeeId: string;
  task: string; // e.g., "Upload ID", "Complete training"
  category: "documents" | "training" | "equipment" | "other";
  status: "pending" | "completed";
  dueDate?: Date;
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OnboardingPath {
  id: string;
  employeeId: string;
  employeeName: string;
  tasks: OnboardingTask[];
  startDate: Date;
  completionDate?: Date;
  status: "in-progress" | "completed";
  progress: number; // Percentage
  createdAt: Date;
  updatedAt: Date;
}

export interface RecruitmentStats {
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  totalVerifications: number;
  pendingVerifications: number;
  completedOnboardings: number;
  inProgressOnboardings: number;
}

export interface RecruitmentKPIs {
  successRate: number; // percentage of accepted applications
  averageDelay: number; // days from application to hire
  totalCost: number; // total recruitment cost
  costPerHire: number; // average cost per successful hire
  currency: string;
}

// ============================================================================
// EMAIL TEMPLATE TYPES
// ============================================================================

// ============================================================================
// TRAINING & CERTIFICATIONS TYPES
// ============================================================================

export interface TrainingCertification {
  id: string;
  employeeId: string;
  employeeName: string;
  type: CertificationType;
  level?: string; // for SSIAP 1/2/3
  number: string;
  issueDate: Date;
  expiryDate: Date;
  issuer: string;
  fileUrl?: string;
  status:
    | "valid"
    | "expired"
    | "expiring-soon"
    | "pending-renewal"
    | "acknowledged";
  lastRenewalDate?: Date;
  nextRenewalDate?: Date;
  validated: boolean;
  validatedBy?: string;
  validatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type CertificationType =
  | "SSIAP1"
  | "SSIAP2"
  | "SSIAP3"
  | "SST"
  | "H0B0"
  | "FIRE"
  | "OTHER";

export interface TrainingSession {
  id: string;
  employeeId: string;
  employeeName: string;
  certificationType: CertificationType;
  sessionDate: Date;
  duration: number;
  trainer: string;
  result: "passed" | "failed" | "pending";
  certificateNumber?: string;
  expiryDate?: Date;
  cost?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingPlan {
  id: string;
  title: string;
  description?: string;
  plannedDate: Date;
  duration: number; // hours
  participants: string[]; // employeeIds
  trainer?: string;
  location?: string;
  budget: number;
  currency: string;
  status: "planned" | "confirmed" | "completed" | "cancelled";
  actualDate?: Date;
  actualDuration?: number;
  actualCost?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingBudget {
  year: number;
  totalBudget: number;
  usedBudget: number;
  remainingBudget: number;
  currency: string;
  breakdown: {
    byType: Record<CertificationType, number>;
    byDepartment: Record<string, number>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TrainingStats {
  totalCertifications: number;
  validCertifications: number;
  expiredCertifications: number;
  expiringSoon: number;
  complianceRate: number; // percentage
  totalTrainingHours: number;
  totalTrainingCost: number;
  currency: string;
}

// ============================================================================
// EMAIL TEMPLATE TYPES
// ============================================================================

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: EmailTemplateCategory;
  tags: string[];
  lastModified: string;
}

export interface EmailTemplateFormData {
  name: string;
  subject: string;
  body: string;
  category: EmailTemplateCategory;
  tags: string[];
}

export type EmailTemplateCategory =
  | "rh"
  | "recrutement"
  | "formation"
  | "discipline"
  | "conges"
  | "paie"
  | "medical"
  | "autre";

export interface EmailTemplateCategoryOption {
  value: EmailTemplateCategory;
  label: string;
}

// ============================================================================
// EMPLOYEE TYPES
// ============================================================================

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo?: string;
  dateOfBirth: Date;
  placeOfBirth: string;
  nationality: string;
  gender: "male" | "female" | "other";

  // Civil Status
  civilStatus: "single" | "married" | "divorced" | "widowed" | "civil-union";
  children?: number;

  // Address
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    proofOfAddress?: string; // File path/URL
  };

  // Bank Details
  bankDetails: {
    iban: string;
    bic: string;
    bankName: string;
  };

  // Social Security
  socialSecurityNumber: string;
  healthCard?: string; // File path/URL

  // Employment
  employeeNumber: string;
  hireDate: Date;
  position: string;
  department: string;
  status: "active" | "inactive" | "suspended" | "terminated";

  // Documents
  documents: EmployeeDocuments;

  // Contracts
  contracts: Contract[];

  // Equipment
  assignedEquipment: Equipment[];

  // CSE
  cseRole?: CSERole;

  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  gender: Employee["gender"];
  civilStatus: Employee["civilStatus"];
  children: number;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  iban: string;
  bic: string;
  bankName: string;
  socialSecurityNumber: string;
  employeeNumber: string;
  hireDate: string;
  position: string;
  department: string;
  status: Employee["status"];
}

export interface EmployeeDocuments {
  idCard?: Document;
  cv?: Document;
  proCard?: Document; // CNAPS Professional Card

  // Diplomas and Certifications
  cqpAps?: Certification;
  ssiap?: Certification;
  sst?: Certification; // Sauveteur Secouriste du Travail
  vm?: Certification; // Visite Médicale (Medical Visit)
}

export interface Document {
  id: string;
  name: string;
  type:
    | "id-card"
    | "health-card"
    | "cv"
    | "proof-address"
    | "pro-card"
    | "other";
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy: string;
  expiresAt?: Date;
  verified: boolean;
  notes?: string;
}

export interface Certification {
  id: string;
  type:
    | "CQP_APS"
    | "CNAPS"
    | "SSIAP1"
    | "SSIAP2"
    | "SSIAP3"
    | "SST"
    | "VM"
    | "H0B0"
    | "FIRE";
  number: string;
  issueDate: Date;
  expiryDate: Date;
  fileUrl?: string;
  issuer: string;
  verified: boolean;
  status: "valid" | "expired" | "expiring-soon" | "pending-renewal";
}

export interface Contract {
  id: string;
  employeeId?: string;
  type: "CDI" | "CDD" | "INTERIM" | "APPRENTICESHIP" | "INTERNSHIP";
  startDate: Date;
  endDate?: Date;
  position: string;
  department: string;
  salary: {
    gross: number;
    net: number;
    currency: string;
  };
  workingHours: number; // Hours per week
  fileUrl?: string;
  signedAt?: Date;
  signedByEmployee: boolean;
  signedByEmployer: boolean;

  // Amendments
  amendments: ContractAmendment[];

  status: "draft" | "pending-signature" | "active" | "terminated" | "expired";
  createdAt: Date;
  updatedAt: Date;
}

export interface ContractAmendment {
  id: string;
  contractId: string;
  date: Date;
  reason: string;
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
  fileUrl?: string;
  signedAt?: Date;
}

export interface Equipment {
  id: string;
  name: string;
  type: "PPE" | "RADIO" | "KEYS" | "UNIFORM" | "BADGE" | "VEHICLE" | "OTHER";
  serialNumber?: string;
  description?: string;

  // Assignment
  assignedAt: Date;
  assignedBy: string;
  returnedAt?: Date;
  returnedBy?: string;

  // Digital Signature
  issuanceSignature?: Signature;
  returnSignature?: Signature;

  condition: "new" | "good" | "fair" | "poor" | "damaged";
  status: "assigned" | "returned" | "lost" | "damaged";
  notes?: string;
}

export interface Signature {
  signedAt: Date;
  signedBy: string;
  signatureData: string; // Base64 encoded signature
  ipAddress?: string;
  device?: string;
}

export interface CSERole {
  role: "member" | "alternate" | "secretary" | "treasurer" | "president";
  startDate: Date;
  endDate?: Date;
  delegationHours: number; // Hours per month
  usedHours: number;
  remainingHours: number;
  isElected: boolean;
  electionDate?: Date;
}

export interface ExpirationAlert {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "pro-card" | "ssiap" | "vm" | "sst" | "contract" | "certification";
  documentName: string;
  expiryDate: Date;
  daysUntilExpiry: number;
  severity: "critical" | "high" | "medium" | "low";
  status: "pending" | "acknowledged" | "resolved";
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
}

export interface CNAPSAccess {
  employeeId: string;
  cnapsNumber: string;
  lastChecked?: Date;
  status: "valid" | "invalid" | "pending" | "error";
  dracarLink?: string; // Direct link to CNAPS DRACAR system
}

export interface EmployeeFilters {
  status?: Employee["status"][];
  department?: string[];
  position?: string[];
  contractType?: Contract["type"][];
  certificationStatus?: "valid" | "expired" | "expiring-soon";
  search?: string;
}

export interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
  expiringCertifications: number;
  pendingContracts: number;
  cseMembers: number;
}

// ============================================================================
// TIME MANAGEMENT & ABSENCES TYPES
// ============================================================================

export type TimeOffType =
  | "vacation"
  | "sick_leave"
  | "unpaid_leave"
  | "maternity_leave"
  | "paternity_leave"
  | "family_event"
  | "training"
  | "cse_delegation";

export type TimeOffStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  department: string;
  type: TimeOffType;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason?: string;
  status: TimeOffStatus;
  validatedBy?: string;
  validatedAt?: Date;
  validationComment?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkedHours {
  id: string;
  employeeId: string;
  employeeName: string;
  date: Date;
  regularHours: number;
  overtimeHours: number;
  nightHours: number;
  sundayHours: number;
  holidayHours: number;
  totalHours: number;
  validated: boolean;
  validatedBy?: string;
  validatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CSEDelegationHours {
  id: string;
  employeeId: string;
  employeeName: string;
  cseRole: string;
  period: string; // e.g., "2024-12" for December 2024
  allocatedHours: number;
  usedHours: number;
  remainingHours: number;
  sessions: CSESession[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CSESession {
  id: string;
  date: Date;
  duration: number;
  type: "meeting" | "training" | "employee_reception" | "other";
  description: string;
  validated: boolean;
  validatedBy?: string;
  validatedAt?: Date;
}

export interface AbsenceSummary {
  employeeId: string;
  employeeName: string;
  year: number;
  vacationDays: {
    total: number;
    taken: number;
    remaining: number;
    pending: number;
  };
  sickLeaveDays: number;
  unpaidLeaveDays: number;
  otherAbsenceDays: number;
  totalAbsenceDays: number;
}

export interface TimeOffBalance {
  employeeId: string;
  year: number;
  vacationDaysEarned: number;
  vacationDaysTaken: number;
  vacationDaysPending: number;
  vacationDaysRemaining: number;
  carriedOverDays: number;
  totalAvailable: number;
}

export interface PayrollExport {
  id: string;
  period: string; // e.g., "2024-12"
  exportDate: Date;
  employeeCount: number;
  status: "pending" | "completed" | "failed";
  fileUrl?: string;
  createdBy: string;
  createdAt: Date;
}

export interface TimeManagementStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalAbsenceDays: number;
  averageResponseTime: number; // in hours
  employeesOnLeave: number;
}

export interface TimeOffFilters {
  status?: TimeOffStatus;
  type?: TimeOffType;
  department?: string;
  employeeId?: string;
  startDate?: Date;
  endDate?: Date;
}

// ============================================================================
// PAYROLL PREPARATION & ANALYSES TYPES
// ============================================================================

export interface PayrollVariable {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string; // e.g., "2024-12"
  type: PayrollVariableType;
  amount: number;
  currency: string;
  description?: string;
  validated: boolean;
  validatedBy?: string;
  validatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type PayrollVariableType =
  | "bonus"
  | "night_shift"
  | "sunday_shift"
  | "holiday_shift"
  | "travel_allowance"
  | "meal_allowance"
  | "dressing_allowance"
  | "other_allowance";

export interface Allowance {
  id: string;
  employeeId: string;
  employeeName: string;
  type: AllowanceType;
  amount: number;
  currency: string;
  frequency: "monthly" | "daily" | "one-time";
  startDate: Date;
  endDate?: Date;
  description?: string;
  validated: boolean;
  validatedBy?: string;
  validatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type AllowanceType =
  | "travel"
  | "meal"
  | "dressing"
  | "transport"
  | "housing"
  | "phone"
  | "other";

export interface SalaryMaintenance {
  id: string;
  employeeId: string;
  employeeName: string;
  type: SalaryMaintenanceType;
  startDate: Date;
  endDate?: Date;
  dailyRate: number;
  totalDays: number;
  totalAmount: number;
  currency: string;
  medicalCertificate?: string; // File URL
  status: "active" | "completed" | "pending";
  validated: boolean;
  validatedBy?: string;
  validatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type SalaryMaintenanceType =
  | "illness"
  | "work_accident"
  | "maternity"
  | "paternity"
  | "family_event"
  | "other";

export interface PersonnelCost {
  employeeId: string;
  employeeName: string;
  period: string;
  grossSalary: number;
  netSalary: number;
  taxableNet: number;
  employeeContributions: number;
  employerContributions: number;
  totalEmployerCost: number;
  currency: string;
  workedHours: number;
  costPerHour: number;
  allowances: number;
  bonuses: number;
  maintenance: number;
  totalCost: number;
}

export interface PayrollAnomaly {
  id: string;
  employeeId: string;
  employeeName: string;
  type: PayrollAnomalyType;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  period: string;
  expectedValue?: number;
  actualValue?: number;
  currency?: string;
  status: "open" | "investigating" | "resolved" | "dismissed";
  resolvedBy?: string;
  resolvedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PayrollAnomalyType =
  | "missing_hours"
  | "incorrect_rate"
  | "duplicate_payment"
  | "missing_allowance"
  | "contribution_error"
  | "tax_calculation_error"
  | "other";

export interface PayrollExportConfig {
  id: string;
  name: string;
  software: "silae" | "sage" | "other";
  format: "csv" | "xlsx" | "xml" | "json";
  mapping: Record<string, string>; // Field mapping for export
  delimiter?: string;
  includeHeaders: boolean;
  dateFormat: string;
  currencyFormat: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayrollAnalysis {
  period: string;
  totalEmployees: number;
  totalGrossPayroll: number;
  totalNetPayroll: number;
  totalEmployerContributions: number;
  totalEmployeeContributions: number;
  totalPersonnelCost: number;
  averageCostPerEmployee: number;
  averageCostPerHour: number;
  currency: string;
  breakdowns: {
    byDepartment: Record<string, PersonnelCostSummary>;
    byContractType: Record<string, PersonnelCostSummary>;
    byAllowanceType: Record<string, number>;
  };
  anomalies: PayrollAnomaly[];
  createdAt: Date;
}

export interface PersonnelCostSummary {
  employeeCount: number;
  totalGross: number;
  totalNet: number;
  totalEmployerCost: number;
  averageCostPerEmployee: number;
  averageCostPerHour: number;
}

export interface PayrollStats {
  totalVariables: number;
  pendingValidations: number;
  anomaliesCount: number;
  totalPersonnelCost: number;
  averageCostPerEmployee: number;
  currency: string;
  lastExportDate?: Date;
  nextPayrollDate?: Date;
}

// Discipline & Legal Types
export interface Warning {
  id: string;
  employeeId: string;
  date: Date;
  reason: string;
  description: string;
  issuedBy: string;
  status: "active" | "lifted";
  createdAt: Date;
  updatedAt: Date;
}

export interface Suspension {
  id: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  description: string;
  issuedBy: string;
  status: "active" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export interface DisciplinaryProcedure {
  id: string;
  employeeId: string;
  startDate: Date;
  steps: DisciplinaryStep[];
  currentStep: number;
  status: "ongoing" | "completed" | "cancelled";
  documents: string[]; // file URLs
  createdAt: Date;
  updatedAt: Date;
}

export interface DisciplinaryStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
}

export interface Interview {
  id: string;
  employeeId: string;
  type: "professional" | "annual";
  date: Date;
  interviewer: string;
  notes: string;
  objectives: string[];
  status: "scheduled" | "completed" | "cancelled";
  documents?: string[]; // file URLs
  createdAt: Date;
  updatedAt: Date;
}

export interface Objective {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  category: "performance" | "development" | "career" | "skills";
  targetDate: Date;
  progress: number; // 0-100
  status: "active" | "completed" | "cancelled";
  relatedInterviewId?: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sanction {
  id: string;
  employeeId: string;
  date: Date;
  type: string;
  reason: string;
  description: string;
  issuedBy: string;
  severity: "minor" | "major" | "severe";
  createdAt: Date;
  updatedAt: Date;
}

export interface SanctionsRegister {
  id: string;
  employeeId: string;
  sanctions: Sanction[];
  totalWarnings: number;
  totalSuspensions: number;
  lastUpdated: Date;
}

// ============================================================================
// EXPENSE REPORTS & ALLOWANCES TYPES
// ============================================================================

export interface ExpenseItem {
  id: string;
  category: "travel" | "meal" | "accommodation" | "fuel" | "parking" | "other";
  description: string;
  amount: number;
  date: Date;
  receipt?: string; // File URL
  notes?: string;
}

export interface ExpenseReport {
  id: string;
  employeeId: string;
  title: string;
  items: ExpenseItem[];
  totalAmount: number;
  status: "draft" | "submitted" | "approved" | "rejected" | "paid";
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  paymentDate?: Date;
  exportedToPayroll: boolean;
  exportedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
