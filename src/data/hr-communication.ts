export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: "recruitment" | "onboarding" | "training" | "disciplinary" | "general" | "other";
  variables: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SentEmail {
  id: string;
  templateId?: string;
  templateName?: string;
  subject: string;
  body: string;
  recipients: {
    type: "employee" | "client" | "partner" | "other";
    ids: string[];
    emails: string[];
    names: string[];
  };
  sentAt: string;
  sentBy: string;
  status: "sent" | "failed" | "pending";
  attachments?: string[];
  opened?: boolean;
  openedAt?: string;
  clicked?: boolean;
  clickedAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: "email" | "sms" | "push" | "in_app";
  recipientId: string;
  recipientName: string;
  recipientType: "employee" | "client" | "supervisor" | "other";
  title: string;
  message: string;
  status: "pending" | "sent" | "delivered" | "failed" | "read";
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  priority: "low" | "normal" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
}

export const mockEmailTemplates: EmailTemplate[] = [
  {
    id: "TMPL-001",
    name: "Accusé de réception candidature",
    subject: "Candidature reçue - {{companyName}}",
    body: "Bonjour {{candidateName}},\n\nNous avons bien reçu votre candidature pour le poste de {{position}}.\n\nNous vous recontacterons dans les plus brefs délais.\n\nCordialement,\nService RH",
    category: "recruitment",
    variables: ["candidateName", "position", "companyName"],
    isDefault: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "TMPL-002",
    name: "Rappel formation expirante",
    subject: "Rappel - Formation {{certificationType}} expire bientôt",
    body: "Bonjour {{employeeName}},\n\nNous vous rappelons que votre certification {{certificationType}} expire le {{expiryDate}}.\n\nMerci de prendre rendez-vous pour le recyclage.\n\nCordialement,\nService RH",
    category: "training",
    variables: ["employeeName", "certificationType", "expiryDate"],
    isDefault: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "TMPL-003",
    name: "Invitation entretien annuel",
    subject: "Entretien annuel {{year}} - {{employeeName}}",
    body: "Bonjour {{employeeName}},\n\nVous êtes convié(e) à votre entretien annuel le {{date}} à {{time}}.\n\nLieu: {{location}}\n\nCordialement,\n{{managerName}}",
    category: "general",
    variables: ["employeeName", "year", "date", "time", "location", "managerName"],
    isDefault: false,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "TMPL-004",
    name: "Avertissement disciplinaire",
    subject: "Avertissement {{type}} - {{employeeName}}",
    body: "Bonjour {{employeeName}},\n\nPar la présente, nous vous informons d'un avertissement {{type}} concernant: {{reason}}.\n\nDate: {{date}}\n\n{{details}}\n\nCordialement,\n{{issuedBy}}",
    category: "disciplinary",
    variables: ["employeeName", "type", "reason", "date", "details", "issuedBy"],
    isDefault: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
];

export const mockSentEmails: SentEmail[] = [
  {
    id: "EMAIL-001",
    templateId: "TMPL-002",
    templateName: "Rappel formation expirante",
    subject: "Rappel - Formation SSIAP1 expire bientôt",
    body: "Bonjour Jean Dupont,\n\nNous vous rappelons que votre certification SSIAP1 expire le 15/01/2025.\n\nMerci de prendre rendez-vous pour le recyclage.\n\nCordialement,\nService RH",
    recipients: {
      type: "employee",
      ids: ["1"],
      emails: ["jean.dupont@safyr.com"],
      names: ["Jean Dupont"],
    },
    sentAt: "2024-12-20T09:00:00Z",
    sentBy: "Sophie Dubois",
    status: "sent",
    opened: true,
    openedAt: "2024-12-20T10:30:00Z",
    createdAt: "2024-12-20T09:00:00Z",
  },
  {
    id: "EMAIL-002",
    templateId: "TMPL-001",
    templateName: "Accusé de réception candidature",
    subject: "Candidature reçue - Safyr",
    body: "Bonjour Marc Lefebvre,\n\nNous avons bien reçu votre candidature pour le poste de Agent de sécurité.\n\nNous vous recontacterons dans les plus brefs délais.\n\nCordialement,\nService RH",
    recipients: {
      type: "other",
      ids: [],
      emails: ["marc.lefebvre@email.com"],
      names: ["Marc Lefebvre"],
    },
    sentAt: "2024-12-15T10:30:00Z",
    sentBy: "Sophie Dubois",
    status: "sent",
    opened: true,
    openedAt: "2024-12-15T11:00:00Z",
    createdAt: "2024-12-15T10:30:00Z",
  },
  {
    id: "EMAIL-003",
    subject: "Rapport mensuel sécurité - Novembre 2024",
    body: "Bonjour,\n\nVeuillez trouver ci-joint le rapport mensuel de sécurité pour le mois de novembre.\n\nCordialement,\nService RH",
    recipients: {
      type: "client",
      ids: ["CLIENT-001"],
      emails: ["contact@rosny2.fr"],
      names: ["Centre Commercial Rosny 2"],
    },
    sentAt: "2024-12-19T14:15:00Z",
    sentBy: "Sophie Dubois",
    status: "sent",
    attachments: ["rapport_novembre_2024.pdf", "statistiques.xlsx"],
    opened: false,
    createdAt: "2024-12-19T14:15:00Z",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "NOTIF-001",
    type: "email",
    recipientId: "1",
    recipientName: "Jean Dupont",
    recipientType: "employee",
    title: "Rappel formation",
    message: "Votre certification SSIAP1 expire le 15/01/2025",
    status: "read",
    sentAt: "2024-12-20T09:00:00Z",
    deliveredAt: "2024-12-20T09:00:05Z",
    readAt: "2024-12-20T10:30:00Z",
    priority: "normal",
    createdAt: "2024-12-20T09:00:00Z",
    updatedAt: "2024-12-20T10:30:00Z",
  },
  {
    id: "NOTIF-002",
    type: "sms",
    recipientId: "2",
    recipientName: "Marie Martin",
    recipientType: "employee",
    title: "Alerte sécurité",
    message: "Incident critique détecté sur votre site",
    status: "delivered",
    sentAt: "2024-12-24T14:00:00Z",
    deliveredAt: "2024-12-24T14:00:02Z",
    priority: "urgent",
    createdAt: "2024-12-24T14:00:00Z",
    updatedAt: "2024-12-24T14:00:02Z",
  },
  {
    id: "NOTIF-003",
    type: "in_app",
    recipientId: "3",
    recipientName: "Pierre Bernard",
    recipientType: "employee",
    title: "Nouvelle demande de document",
    message: "Votre demande de certificat de travail est en cours de traitement",
    status: "read",
    sentAt: "2024-12-20T10:00:00Z",
    deliveredAt: "2024-12-20T10:00:00Z",
    readAt: "2024-12-20T11:15:00Z",
    priority: "normal",
    createdAt: "2024-12-20T10:00:00Z",
    updatedAt: "2024-12-20T11:15:00Z",
  },
];


