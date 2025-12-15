// ============================================================================
// EMAIL TEMPLATE TYPES
// ============================================================================

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: EmailTemplateCategory;
  lastModified: string;
}

export interface EmailTemplateFormData {
  name: string;
  subject: string;
  body: string;
  category: EmailTemplateCategory;
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
