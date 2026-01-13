export interface CertificateRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  type: "work" | "salary" | "employment" | "training" | "other";
  purpose: string;
  deliveryMethod: "email" | "pickup" | "post";
  status: "pending" | "in_progress" | "ready" | "delivered" | "cancelled";
  submittedAt: string;
  processedAt?: string;
  processedBy?: string;
  readyAt?: string;
  deliveredAt?: string;
  documentUrl?: string;
  priority: "low" | "normal" | "high" | "urgent";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  department?: string;
  documentType: "payslip" | "contract" | "attestation" | "other";
  documentDescription: string;
  period?: string;
  year?: number;
  specificDetails?: string;
  deliveryMethod: "email" | "pickup" | "post";
  status: "pending" | "in_progress" | "validated" | "provided" | "cancelled";
  submittedAt: string;
  processedAt?: string;
  processedBy?: string;
  providedAt?: string;
  documentUrl?: string;
  priority: "low" | "normal" | "high" | "urgent";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankDetailsChange {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  currentIban?: string;
  newIban: string;
  newBic: string;
  newBankName: string;
  reason: string;
  status: "pending" | "validated" | "rejected" | "cancelled";
  submittedAt: string;
  validatedAt?: string;
  validatedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SignatureRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  documentType: "contract" | "amendment" | "acknowledgment" | "other";
  documentTitle: string;
  documentUrl: string;
  status: "pending" | "sent" | "signed" | "expired" | "cancelled";
  sentAt?: string;
  signedAt?: string;
  expiresAt?: string;
  signatureMethod: "electronic" | "physical";
  reminderSent: boolean;
  reminderSentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockCertificateRequests: CertificateRequest[] = [
  {
    id: "CERT-REQ-001",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    type: "work",
    purpose: "Dossier locatif",
    deliveryMethod: "email",
    status: "delivered",
    submittedAt: "2024-12-10T09:00:00Z",
    processedAt: "2024-12-10T10:30:00Z",
    processedBy: "Sophie Dubois",
    readyAt: "2024-12-10T11:00:00Z",
    deliveredAt: "2024-12-10T11:15:00Z",
    documentUrl: "/certificates/certificat_travail_jean_dupont_2024.pdf",
    priority: "normal",
    createdAt: "2024-12-10T09:00:00Z",
    updatedAt: "2024-12-10T11:15:00Z",
  },
  {
    id: "CERT-REQ-002",
    employeeId: "2",
    employeeName: "Marie Martin",
    employeeNumber: "EMP002",
    type: "salary",
    purpose: "Demande de prêt immobilier",
    deliveryMethod: "email",
    status: "ready",
    submittedAt: "2024-12-18T14:00:00Z",
    processedAt: "2024-12-19T09:00:00Z",
    processedBy: "Sophie Dubois",
    readyAt: "2024-12-19T10:00:00Z",
    documentUrl: "/certificates/attestation_salaire_marie_martin_2024.pdf",
    priority: "high",
    createdAt: "2024-12-18T14:00:00Z",
    updatedAt: "2024-12-19T10:00:00Z",
  },
  {
    id: "CERT-REQ-003",
    employeeId: "3",
    employeeName: "Pierre Bernard",
    employeeNumber: "EMP003",
    type: "employment",
    purpose: "Dossier CAF",
    deliveryMethod: "post",
    status: "in_progress",
    submittedAt: "2024-12-20T10:00:00Z",
    priority: "normal",
    createdAt: "2024-12-20T10:00:00Z",
    updatedAt: "2024-12-20T10:00:00Z",
  },
];

export const mockDocumentRequests: DocumentRequest[] = [
  {
    id: "DOC-REQ-001",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    documentType: "payslip",
    documentDescription: "Bulletins de paie de janvier à juin 2024",
    period: "2024-01 à 2024-06",
    deliveryMethod: "email",
    status: "provided",
    submittedAt: "2024-12-15T09:30:00Z",
    processedAt: "2024-12-15T14:20:00Z",
    processedBy: "Sophie Dubois",
    providedAt: "2024-12-15T14:20:00Z",
    documentUrl: "/documents/payslips_jean_dupont_2024.pdf",
    priority: "normal",
    createdAt: "2024-12-15T09:30:00Z",
    updatedAt: "2024-12-15T14:20:00Z",
  },
  {
    id: "DOC-REQ-002",
    employeeId: "2",
    employeeName: "Marie Martin",
    employeeNumber: "EMP002",
    department: "Sécurité",
    documentType: "contract",
    documentDescription: "Copie du contrat de travail CDI",
    year: 2019,
    deliveryMethod: "email",
    status: "validated",
    submittedAt: "2024-12-20T10:15:00Z",
    processedAt: "2024-12-20T14:00:00Z",
    processedBy: "Sophie Dubois",
    documentUrl: "/documents/contrat_marie_martin_2019.pdf",
    priority: "high",
    createdAt: "2024-12-20T10:15:00Z",
    updatedAt: "2024-12-20T14:00:00Z",
  },
  {
    id: "DOC-REQ-003",
    employeeId: "4",
    employeeName: "Sophie Dubois",
    employeeNumber: "EMP004",
    department: "Management",
    documentType: "attestation",
    documentDescription: "Attestation employeur pour la CAF",
    specificDetails: "Pour dossier APL",
    deliveryMethod: "pickup",
    status: "in_progress",
    submittedAt: "2024-12-19T11:00:00Z",
    priority: "normal",
    createdAt: "2024-12-19T11:00:00Z",
    updatedAt: "2024-12-20T08:00:00Z",
  },
];

export const mockBankDetailsChanges: BankDetailsChange[] = [
  {
    id: "BANK-001",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    currentIban: "FR76 1234 5678 9012 3456 7890 123",
    newIban: "FR76 9999 8888 7777 6666 5555 444",
    newBic: "SOGEFRPP",
    newBankName: "Société Générale",
    reason: "Changement de banque",
    status: "validated",
    submittedAt: "2024-12-05T10:00:00Z",
    validatedAt: "2024-12-06T09:00:00Z",
    validatedBy: "Sophie Dubois",
    documents: ["rib_nouvelle_banque_jean_dupont.pdf"],
    createdAt: "2024-12-05T10:00:00Z",
    updatedAt: "2024-12-06T09:00:00Z",
  },
  {
    id: "BANK-002",
    employeeId: "5",
    employeeName: "Luc Moreau",
    employeeNumber: "EMP005",
    currentIban: "FR76 8888 9999 0000 1111 2222 333",
    newIban: "FR76 1111 2222 3333 4444 5555 666",
    newBic: "AGRIFRPP",
    newBankName: "Crédit Agricole",
    reason: "Regroupement de comptes",
    status: "pending",
    submittedAt: "2024-12-22T14:00:00Z",
    documents: ["rib_nouvelle_banque_luc_moreau.pdf"],
    createdAt: "2024-12-22T14:00:00Z",
    updatedAt: "2024-12-22T14:00:00Z",
  },
];

export const mockSignatureRequests: SignatureRequest[] = [
  {
    id: "SIG-001",
    employeeId: "10",
    employeeName: "Julie Laurent",
    employeeNumber: "EMP010",
    documentType: "contract",
    documentTitle: "Contrat de travail CDD",
    documentUrl: "/documents/contrat_cdd_julie_laurent.pdf",
    status: "signed",
    sentAt: "2024-02-25T10:00:00Z",
    signedAt: "2024-02-26T14:30:00Z",
    expiresAt: "2024-03-05T23:59:59Z",
    signatureMethod: "electronic",
    reminderSent: false,
    createdAt: "2024-02-25T10:00:00Z",
    updatedAt: "2024-02-26T14:30:00Z",
  },
  {
    id: "SIG-002",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    documentType: "amendment",
    documentTitle: "Avenant salarial 2025",
    documentUrl: "/documents/avenant_salaire_jean_dupont_2025.pdf",
    status: "pending",
    sentAt: "2024-12-20T09:00:00Z",
    expiresAt: "2024-12-27T23:59:59Z",
    signatureMethod: "electronic",
    reminderSent: true,
    reminderSentAt: "2024-12-23T09:00:00Z",
    createdAt: "2024-12-20T09:00:00Z",
    updatedAt: "2024-12-23T09:00:00Z",
  },
  {
    id: "SIG-003",
    employeeId: "3",
    employeeName: "Pierre Bernard",
    employeeNumber: "EMP003",
    documentType: "acknowledgment",
    documentTitle: "Accusé de réception - Nouvelle procédure",
    documentUrl: "/documents/accuse_reception_procedure_pierre_bernard.pdf",
    status: "expired",
    sentAt: "2024-12-10T10:00:00Z",
    expiresAt: "2024-12-17T23:59:59Z",
    signatureMethod: "electronic",
    reminderSent: true,
    reminderSentAt: "2024-12-15T09:00:00Z",
    createdAt: "2024-12-10T10:00:00Z",
    updatedAt: "2024-12-18T00:00:00Z",
  },
];
