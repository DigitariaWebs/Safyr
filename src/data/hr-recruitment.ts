export interface Application {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  appliedAt: string;
  source: "website" | "linkedin" | "indeed" | "referral" | "other";
  status: "new" | "screening" | "interview" | "offer" | "hired" | "rejected";
  resumeUrl?: string;
  coverLetterUrl?: string;
  interviewDate?: string;
  interviewNotes?: string;
  offerDetails?: {
    salary: number;
    startDate: string;
    position: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Verification {
  id: string;
  applicationId: string;
  candidateName: string;
  type: "identity" | "diploma" | "certification" | "criminal_record" | "reference";
  status: "pending" | "in_progress" | "validated" | "rejected";
  requestedAt: string;
  completedAt?: string;
  verifiedBy?: string;
  notes?: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingTask {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "document" | "training" | "equipment" | "access" | "meeting";
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "in_progress" | "completed" | "overdue";
  assignedTo?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockApplications: Application[] = [
  {
    id: "APP-001",
    candidateName: "Marc Lefebvre",
    email: "marc.lefebvre@email.com",
    phone: "+33 6 11 22 33 44",
    position: "Agent de sécurité",
    department: "Sécurité",
    appliedAt: "2024-12-15T10:30:00Z",
    source: "website",
    status: "interview",
    resumeUrl: "/resumes/marc_lefebvre.pdf",
    coverLetterUrl: "/cover-letters/marc_lefebvre.pdf",
    interviewDate: "2024-12-28T14:00:00Z",
    interviewNotes: "Bon profil, expérience confirmée. À revoir pour décision finale.",
    createdAt: "2024-12-15T10:30:00Z",
    updatedAt: "2024-12-20T09:00:00Z",
  },
  {
    id: "APP-002",
    candidateName: "Laura Moreau",
    email: "laura.moreau@email.com",
    phone: "+33 6 22 33 44 55",
    position: "Chef d'équipe",
    department: "Sécurité",
    appliedAt: "2024-12-18T14:15:00Z",
    source: "linkedin",
    status: "screening",
    resumeUrl: "/resumes/laura_moreau.pdf",
    createdAt: "2024-12-18T14:15:00Z",
    updatedAt: "2024-12-19T10:00:00Z",
  },
  {
    id: "APP-003",
    candidateName: "Nicolas Petit",
    email: "nicolas.petit@email.com",
    phone: "+33 6 33 44 55 66",
    position: "Agent de sécurité SSIAP",
    department: "Sécurité Incendie",
    appliedAt: "2024-12-10T09:00:00Z",
    source: "indeed",
    status: "offer",
    resumeUrl: "/resumes/nicolas_petit.pdf",
    interviewDate: "2024-12-18T15:00:00Z",
    interviewNotes: "Excellent candidat, certifications à jour. Offre préparée.",
    offerDetails: {
      salary: 2500,
      startDate: "2025-01-15",
      position: "Agent de sécurité SSIAP",
    },
    createdAt: "2024-12-10T09:00:00Z",
    updatedAt: "2024-12-22T11:00:00Z",
  },
  {
    id: "APP-004",
    candidateName: "Sarah Bernard",
    email: "sarah.bernard@email.com",
    phone: "+33 6 44 55 66 77",
    position: "Agent de sécurité",
    department: "Sécurité",
    appliedAt: "2024-12-20T11:30:00Z",
    source: "referral",
    status: "new",
    resumeUrl: "/resumes/sarah_bernard.pdf",
    createdAt: "2024-12-20T11:30:00Z",
    updatedAt: "2024-12-20T11:30:00Z",
  },
  {
    id: "APP-005",
    candidateName: "David Martin",
    email: "david.martin@email.com",
    phone: "+33 6 55 66 77 88",
    position: "Agent de sécurité",
    department: "Sécurité",
    appliedAt: "2024-11-25T08:45:00Z",
    source: "website",
    status: "rejected",
    resumeUrl: "/resumes/david_martin.pdf",
    interviewDate: "2024-12-05T14:00:00Z",
    interviewNotes: "Profil ne correspond pas aux attentes du poste.",
    createdAt: "2024-11-25T08:45:00Z",
    updatedAt: "2024-12-06T10:00:00Z",
  },
];

export const mockVerifications: Verification[] = [
  {
    id: "VER-001",
    applicationId: "APP-001",
    candidateName: "Marc Lefebvre",
    type: "identity",
    status: "validated",
    requestedAt: "2024-12-16T09:00:00Z",
    completedAt: "2024-12-17T14:30:00Z",
    verifiedBy: "Marie Martin",
    notes: "Pièce d'identité vérifiée - conforme",
    documents: ["copie_cni_marc_lefebvre.pdf"],
    createdAt: "2024-12-16T09:00:00Z",
    updatedAt: "2024-12-17T14:30:00Z",
  },
  {
    id: "VER-002",
    applicationId: "APP-001",
    candidateName: "Marc Lefebvre",
    type: "certification",
    status: "validated",
    requestedAt: "2024-12-16T09:00:00Z",
    completedAt: "2024-12-18T10:15:00Z",
    verifiedBy: "Marie Martin",
    notes: "Certificat SSIAP1 valide jusqu'en 2026",
    documents: ["certificat_ssiap1_marc_lefebvre.pdf"],
    createdAt: "2024-12-16T09:00:00Z",
    updatedAt: "2024-12-18T10:15:00Z",
  },
  {
    id: "VER-003",
    applicationId: "APP-001",
    candidateName: "Marc Lefebvre",
    type: "criminal_record",
    status: "in_progress",
    requestedAt: "2024-12-16T09:00:00Z",
    notes: "En attente de réception du casier judiciaire",
    documents: [],
    createdAt: "2024-12-16T09:00:00Z",
    updatedAt: "2024-12-20T09:00:00Z",
  },
  {
    id: "VER-004",
    applicationId: "APP-003",
    candidateName: "Nicolas Petit",
    type: "identity",
    status: "validated",
    requestedAt: "2024-12-11T09:00:00Z",
    completedAt: "2024-12-12T11:00:00Z",
    verifiedBy: "Marie Martin",
    notes: "Pièce d'identité vérifiée",
    documents: ["copie_cni_nicolas_petit.pdf"],
    createdAt: "2024-12-11T09:00:00Z",
    updatedAt: "2024-12-12T11:00:00Z",
  },
  {
    id: "VER-005",
    applicationId: "APP-003",
    candidateName: "Nicolas Petit",
    type: "certification",
    status: "validated",
    requestedAt: "2024-12-11T09:00:00Z",
    completedAt: "2024-12-13T14:00:00Z",
    verifiedBy: "Marie Martin",
    notes: "SSIAP1 et SST valides",
    documents: ["certificat_ssiap1_nicolas_petit.pdf", "certificat_sst_nicolas_petit.pdf"],
    createdAt: "2024-12-11T09:00:00Z",
    updatedAt: "2024-12-13T14:00:00Z",
  },
];

export const mockOnboardingTasks: OnboardingTask[] = [
  {
    id: "ONB-001",
    employeeId: "13",
    employeeName: "Nicolas Petit",
    type: "document",
    title: "Signature du contrat de travail",
    description: "Contrat CDI à signer et retourner",
    dueDate: "2025-01-10",
    status: "pending",
    createdAt: "2024-12-22T10:00:00Z",
    updatedAt: "2024-12-22T10:00:00Z",
  },
  {
    id: "ONB-002",
    employeeId: "13",
    employeeName: "Nicolas Petit",
    type: "document",
    title: "Déclaration URSSAF",
    description: "Formulaire de déclaration unique d'embauche",
    dueDate: "2025-01-12",
    status: "pending",
    createdAt: "2024-12-22T10:00:00Z",
    updatedAt: "2024-12-22T10:00:00Z",
  },
  {
    id: "ONB-003",
    employeeId: "13",
    employeeName: "Nicolas Petit",
    type: "training",
    title: "Formation sécurité interne",
    description: "Formation obligatoire de 8h sur les procédures internes",
    dueDate: "2025-01-20",
    status: "pending",
    assignedTo: "Thomas Roux",
    createdAt: "2024-12-22T10:00:00Z",
    updatedAt: "2024-12-22T10:00:00Z",
  },
  {
    id: "ONB-004",
    employeeId: "13",
    employeeName: "Nicolas Petit",
    type: "equipment",
    title: "Remise du matériel",
    description: "Radio, clés, EPI, uniforme",
    dueDate: "2025-01-15",
    status: "pending",
    assignedTo: "Marie Martin",
    createdAt: "2024-12-22T10:00:00Z",
    updatedAt: "2024-12-22T10:00:00Z",
  },
  {
    id: "ONB-005",
    employeeId: "13",
    employeeName: "Nicolas Petit",
    type: "access",
    title: "Création des accès",
    description: "Badge, codes d'accès, compte informatique",
    dueDate: "2025-01-14",
    status: "pending",
    assignedTo: "IT Support",
    createdAt: "2024-12-22T10:00:00Z",
    updatedAt: "2024-12-22T10:00:00Z",
  },
  {
    id: "ONB-006",
    employeeId: "13",
    employeeName: "Nicolas Petit",
    type: "meeting",
    title: "Entretien d'intégration",
    description: "Rencontre avec le responsable RH et le chef d'équipe",
    dueDate: "2025-01-16",
    status: "pending",
    assignedTo: "Sophie Dubois",
    createdAt: "2024-12-22T10:00:00Z",
    updatedAt: "2024-12-22T10:00:00Z",
  },
];


