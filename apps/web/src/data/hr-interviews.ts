export interface AnnualInterview {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  year: number;
  scheduledDate: string;
  completedDate?: string;
  interviewer: string;
  status: "scheduled" | "completed" | "cancelled" | "pending";
  topics: {
    achievements: string[];
    challenges: string[];
    goals: string[];
    training: string[];
  };
  notes?: string;
  rating?: number; // 1-5
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProfessionalInterview {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  type: "professional" | "career" | "skills";
  scheduledDate: string;
  completedDate?: string;
  interviewer: string;
  status: "scheduled" | "completed" | "cancelled" | "pending";
  topics: {
    career: string[];
    skills: string[];
    development: string[];
  };
  notes?: string;
  nextSteps?: string[];
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Objective {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  year: number;
  title: string;
  description: string;
  category: "performance" | "development" | "project" | "other";
  targetDate: string;
  status: "not_started" | "in_progress" | "completed" | "cancelled";
  progress: number; // 0-100
  completedDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockAnnualInterviews: AnnualInterview[] = [
  {
    id: "INT-ANN-2024-001",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    year: 2024,
    scheduledDate: "2024-12-20T14:00:00Z",
    completedDate: "2024-12-20T15:30:00Z",
    interviewer: "Sophie Dubois",
    status: "completed",
    topics: {
      achievements: [
        "Excellente gestion des incidents de sécurité",
        "Formation SSIAP1 obtenue avec succès",
        "Bonne intégration dans l'équipe",
      ],
      challenges: [
        "Gestion du stress lors des situations d'urgence",
        "Amélioration de la communication avec les clients",
      ],
      goals: [
        "Obtenir la certification SSIAP2 en 2025",
        "Développer les compétences en management",
      ],
      training: [
        "Formation SSIAP2 prévue en janvier 2025",
        "Formation communication client",
      ],
    },
    notes:
      "Très bon entretien. Agent motivé et performant. Objectifs clairs pour 2025.",
    rating: 4,
    documents: ["entretien_annuel_jean_dupont_2024.pdf"],
    createdAt: "2024-12-01",
    updatedAt: "2024-12-20",
  },
  {
    id: "INT-ANN-2024-002",
    employeeId: "2",
    employeeName: "Marie Martin",
    employeeNumber: "EMP002",
    year: 2024,
    scheduledDate: "2024-12-18T10:00:00Z",
    completedDate: "2024-12-18T11:30:00Z",
    interviewer: "Sophie Dubois",
    status: "completed",
    topics: {
      achievements: [
        "Excellente gestion d'équipe",
        "Mise en place de nouvelles procédures",
        "Formation des nouveaux agents",
      ],
      challenges: [
        "Gestion de la charge de travail",
        "Équilibre vie professionnelle/personnelle",
      ],
      goals: [
        "Développer les compétences en leadership",
        "Optimiser les processus de gestion",
      ],
      training: ["Formation management avancé", "Formation gestion du stress"],
    },
    notes: "Performance exceptionnelle. Leadership reconnu. À promouvoir.",
    rating: 5,
    documents: ["entretien_annuel_marie_martin_2024.pdf"],
    createdAt: "2024-12-01",
    updatedAt: "2024-12-18",
  },
  {
    id: "INT-ANN-2025-001",
    employeeId: "3",
    employeeName: "Pierre Bernard",
    employeeNumber: "EMP003",
    year: 2025,
    scheduledDate: "2025-01-15T14:00:00Z",
    interviewer: "Sophie Dubois",
    status: "scheduled",
    topics: {
      achievements: [],
      challenges: [],
      goals: [],
      training: [],
    },
    documents: [],
    createdAt: "2024-12-20",
    updatedAt: "2024-12-20",
  },
];

export const mockProfessionalInterviews: ProfessionalInterview[] = [
  {
    id: "INT-PRO-001",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    type: "career",
    scheduledDate: "2024-11-15T14:00:00Z",
    completedDate: "2024-11-15T15:00:00Z",
    interviewer: "Sophie Dubois",
    status: "completed",
    topics: {
      career: [
        "Évolution vers poste de chef d'équipe",
        "Développement des compétences managériales",
      ],
      skills: ["Leadership", "Gestion d'équipe", "Communication"],
      development: ["Formation management", "Mentorat avec Marie Martin"],
    },
    notes:
      "Intéressé par une évolution vers un poste d'encadrement. Profil prometteur.",
    nextSteps: [
      "Formation management prévue Q1 2025",
      "Mise en situation d'encadrement progressif",
    ],
    documents: ["entretien_professionnel_jean_dupont_2024.pdf"],
    createdAt: "2024-11-01",
    updatedAt: "2024-11-15",
  },
  {
    id: "INT-PRO-002",
    employeeId: "6",
    employeeName: "Claire Petit",
    employeeNumber: "EMP006",
    type: "skills",
    scheduledDate: "2024-12-10T10:00:00Z",
    completedDate: "2024-12-10T11:00:00Z",
    interviewer: "Sophie Dubois",
    status: "completed",
    topics: {
      career: ["Spécialisation en sécurité incendie"],
      skills: ["SSIAP2", "Intervention incendie", "Formation des équipes"],
      development: ["Recyclage SSIAP2", "Formation formateur"],
    },
    notes: "Très bonne expertise technique. Potentiel formateur identifié.",
    nextSteps: [
      "Recyclage SSIAP2 en janvier 2025",
      "Formation formateur en Q2 2025",
    ],
    documents: ["entretien_professionnel_claire_petit_2024.pdf"],
    createdAt: "2024-12-01",
    updatedAt: "2024-12-10",
  },
];

export const mockObjectives: Objective[] = [
  {
    id: "OBJ-2025-001",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    year: 2025,
    title: "Obtenir la certification SSIAP2",
    description: "Suivre et valider la formation SSIAP2 prévue en janvier 2025",
    category: "development",
    targetDate: "2025-03-31",
    status: "in_progress",
    progress: 25,
    notes: "Formation confirmée pour janvier 2025",
    createdAt: "2024-12-20",
    updatedAt: "2024-12-24",
  },
  {
    id: "OBJ-2025-002",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    year: 2025,
    title: "Améliorer la communication client",
    description: "Réduire les réclamations clients de 20%",
    category: "performance",
    targetDate: "2025-06-30",
    status: "in_progress",
    progress: 10,
    notes: "Formation communication prévue en février",
    createdAt: "2024-12-20",
    updatedAt: "2024-12-24",
  },
  {
    id: "OBJ-2024-001",
    employeeId: "2",
    employeeName: "Marie Martin",
    employeeNumber: "EMP002",
    year: 2024,
    title: "Mise en place de nouvelles procédures",
    description:
      "Finaliser la rédaction et la mise en œuvre des nouvelles procédures de sécurité",
    category: "project",
    targetDate: "2024-12-31",
    status: "completed",
    progress: 100,
    completedDate: "2024-12-15",
    notes: "Projet finalisé avec succès. Procédures validées et déployées.",
    createdAt: "2024-01-15",
    updatedAt: "2024-12-15",
  },
  {
    id: "OBJ-2025-003",
    employeeId: "2",
    employeeName: "Marie Martin",
    employeeNumber: "EMP002",
    year: 2025,
    title: "Développer les compétences en leadership",
    description:
      "Suivre une formation en management avancé et appliquer les acquis",
    category: "development",
    targetDate: "2025-09-30",
    status: "not_started",
    progress: 0,
    createdAt: "2024-12-18",
    updatedAt: "2024-12-18",
  },
  {
    id: "OBJ-2024-002",
    employeeId: "6",
    employeeName: "Claire Petit",
    employeeNumber: "EMP006",
    year: 2024,
    title: "Recyclage SSIAP2",
    description: "Effectuer le recyclage SSIAP2 avant expiration",
    category: "development",
    targetDate: "2024-03-20",
    status: "completed",
    progress: 100,
    completedDate: "2024-03-15",
    notes: "Recyclage effectué avec succès. Certification renouvelée.",
    createdAt: "2024-01-10",
    updatedAt: "2024-03-15",
  },
];
