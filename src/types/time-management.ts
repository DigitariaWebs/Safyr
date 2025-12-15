// Time Management & Absences Type Definitions

export type TimeOffType = 
  | "vacation" 
  | "sick_leave" 
  | "unpaid_leave" 
  | "maternity_leave" 
  | "paternity_leave" 
  | "family_event" 
  | "training"
  | "cse_delegation";

export type TimeOffStatus = 
  | "pending" 
  | "approved" 
  | "rejected" 
  | "cancelled";

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
