// Employee Types for Personnel Administrative Management

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
  civilStatus: 'single' | 'married' | 'divorced' | 'widowed' | 'civil-union';
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
  status: 'active' | 'inactive' | 'suspended' | 'terminated';
  
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
  type: 'id-card' | 'health-card' | 'cv' | 'proof-address' | 'pro-card' | 'other';
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy: string;
  expiresAt?: Date;
  verified: boolean;
  notes?: string;
}

export interface Certification {
  id: string;
  type: 'CQP_APS' | 'CNAPS' | 'SSIAP1' | 'SSIAP2' | 'SSIAP3' | 'SST' | 'VM' | 'H0B0' | 'FIRE';
  number: string;
  issueDate: Date;
  expiryDate: Date;
  fileUrl?: string;
  issuer: string;
  verified: boolean;
  status: 'valid' | 'expired' | 'expiring-soon' | 'pending-renewal';
}

export interface Contract {
  id: string;
  type: 'CDI' | 'CDD' | 'INTERIM' | 'APPRENTICESHIP' | 'INTERNSHIP';
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
  
  status: 'draft' | 'pending-signature' | 'active' | 'terminated' | 'expired';
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
  type: 'PPE' | 'RADIO' | 'KEYS' | 'UNIFORM' | 'BADGE' | 'VEHICLE' | 'OTHER';
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
  
  condition: 'new' | 'good' | 'fair' | 'poor' | 'damaged';
  status: 'assigned' | 'returned' | 'lost' | 'damaged';
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
  role: 'member' | 'alternate' | 'secretary' | 'treasurer' | 'president';
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
  type: 'pro-card' | 'ssiap' | 'vm' | 'sst' | 'contract' | 'certification';
  documentName: string;
  expiryDate: Date;
  daysUntilExpiry: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'acknowledged' | 'resolved';
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
}

export interface CNAPSAccess {
  employeeId: string;
  cnapsNumber: string;
  lastChecked?: Date;
  status: 'valid' | 'invalid' | 'pending' | 'error';
  dracarLink?: string; // Direct link to CNAPS DRACAR system
}

// Filter and Search Types
export interface EmployeeFilters {
  status?: Employee['status'][];
  department?: string[];
  position?: string[];
  contractType?: Contract['type'][];
  certificationStatus?: 'valid' | 'expired' | 'expiring-soon';
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
