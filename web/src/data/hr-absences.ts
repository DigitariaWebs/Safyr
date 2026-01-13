export interface Absence {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  type:
    | "sick_leave"
    | "accident_work"
    | "maternity"
    | "paternity"
    | "unpaid"
    | "other";
  startDate: string;
  endDate?: string;
  totalDays: number;
  reason: string;
  medicalCertificate: boolean;
  certificateUrl?: string;
  workAccident: boolean;
  workAccidentId?: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockAbsences: Absence[] = [
  {
    id: "ABS-001",
    employeeId: "2",
    employeeName: "Marie Martin",
    employeeNumber: "EMP002",
    type: "sick_leave",
    startDate: "2024-12-16",
    endDate: "2024-12-18",
    totalDays: 3,
    reason: "Grippe",
    medicalCertificate: true,
    certificateUrl: "/documents/certificat_medical_marie_martin_dec2024.pdf",
    workAccident: false,
    status: "approved",
    approvedBy: "Sophie Dubois",
    approvedAt: "2024-12-16",
    createdAt: "2024-12-16",
    updatedAt: "2024-12-16",
  },
  {
    id: "ABS-002",
    employeeId: "10",
    employeeName: "Julie Laurent",
    employeeNumber: "EMP010",
    type: "sick_leave",
    startDate: "2024-11-28",
    endDate: "2024-11-29",
    totalDays: 2,
    reason: "Gastro-entérite",
    medicalCertificate: true,
    certificateUrl: "/documents/certificat_medical_julie_laurent_nov2024.pdf",
    workAccident: false,
    status: "approved",
    approvedBy: "Sophie Dubois",
    approvedAt: "2024-11-28",
    createdAt: "2024-11-28",
    updatedAt: "2024-11-28",
  },
  {
    id: "ABS-003",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    type: "accident_work",
    startDate: "2024-09-15",
    endDate: "2024-09-20",
    totalDays: 5,
    reason: "Accident du travail - Entorse cheville",
    medicalCertificate: true,
    certificateUrl: "/documents/certificat_medical_jean_dupont_sept2024.pdf",
    workAccident: true,
    workAccidentId: "ACC-001",
    status: "approved",
    approvedBy: "Sophie Dubois",
    approvedAt: "2024-09-16",
    createdAt: "2024-09-15",
    updatedAt: "2024-09-16",
  },
  {
    id: "ABS-004",
    employeeId: "5",
    employeeName: "Luc Moreau",
    employeeNumber: "EMP005",
    type: "accident_work",
    startDate: "2024-08-10",
    endDate: "2024-08-13",
    totalDays: 3,
    reason: "Accident du travail - Lumbago",
    medicalCertificate: true,
    certificateUrl: "/documents/certificat_medical_luc_moreau_aout2024.pdf",
    workAccident: true,
    workAccidentId: "ACC-003",
    status: "approved",
    approvedBy: "Sophie Dubois",
    approvedAt: "2024-08-11",
    createdAt: "2024-08-10",
    updatedAt: "2024-08-11",
  },
  {
    id: "ABS-005",
    employeeId: "8",
    employeeName: "Emma Leroy",
    employeeNumber: "EMP008",
    type: "sick_leave",
    startDate: "2024-12-20",
    endDate: "2024-12-20",
    totalDays: 1,
    reason: "Migraine sévère",
    medicalCertificate: false,
    workAccident: false,
    status: "pending",
    createdAt: "2024-12-20",
    updatedAt: "2024-12-20",
  },
];
