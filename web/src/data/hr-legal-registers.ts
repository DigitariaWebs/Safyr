export interface PersonnelRegisterEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  action: "entry" | "exit" | "modification";
  date: string;
  type: "CDI" | "CDD" | "STAGE" | "APPRENTISSAGE" | "OTHER";
  position: string;
  department: string;
  notes?: string;
  documents: string[];
  createdAt: string;
}

export interface WorkAccident {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  date: string;
  time: string;
  location: string;
  description: string;
  severity: "light" | "moderate" | "serious" | "fatal";
  cause: string;
  witness?: string;
  medicalCare: boolean;
  workStoppage: boolean;
  workStoppageDays?: number;
  declared: boolean;
  declaredAt?: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TrainingRegisterEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  trainingType: string;
  provider: string;
  startDate: string;
  endDate: string;
  duration: number; // hours
  certificateNumber?: string;
  cost: number;
  documents: string[];
  createdAt: string;
}

export interface CDDEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  action: "entry" | "exit" | "renewal";
  contractStartDate: string;
  contractEndDate: string;
  position: string;
  reason: string;
  renewalCount?: number;
  documents: string[];
  createdAt: string;
}

export const mockPersonnelRegister: PersonnelRegisterEntry[] = [
  {
    id: "REG-PERS-001",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    action: "entry",
    date: "2020-01-15",
    type: "CDI",
    position: "Agent de sécurité",
    department: "Sécurité",
    notes: "Embauche CDI",
    documents: ["contrat_cdi_jean_dupont.pdf"],
    createdAt: "2020-01-15",
  },
  {
    id: "REG-PERS-002",
    employeeId: "2",
    employeeName: "Marie Martin",
    employeeNumber: "EMP002",
    action: "entry",
    date: "2019-03-10",
    type: "CDI",
    position: "Agent de sécurité",
    department: "Sécurité",
    notes: "Embauche CDI",
    documents: ["contrat_cdi_marie_martin.pdf"],
    createdAt: "2019-03-10",
  },
  {
    id: "REG-PERS-003",
    employeeId: "2",
    employeeName: "Marie Martin",
    employeeNumber: "EMP002",
    action: "modification",
    date: "2022-06-01",
    type: "CDI",
    position: "Chef d'équipe",
    department: "Sécurité",
    notes: "Promotion au poste de Chef d'équipe",
    documents: ["avenant_promotion_marie_martin.pdf"],
    createdAt: "2022-06-01",
  },
  {
    id: "REG-PERS-004",
    employeeId: "10",
    employeeName: "Julie Laurent",
    employeeNumber: "EMP010",
    action: "entry",
    date: "2024-03-01",
    type: "CDD",
    position: "Agent de sécurité",
    department: "Sécurité",
    notes: "Embauche CDD 12 mois",
    documents: ["contrat_cdd_julie_laurent.pdf"],
    createdAt: "2024-03-01",
  },
  {
    id: "REG-PERS-005",
    employeeId: "11",
    employeeName: "Michel Blanc",
    employeeNumber: "EMP011",
    action: "exit",
    date: "2024-11-30",
    type: "CDI",
    position: "Superviseur",
    department: "Management",
    notes: "Départ à la retraite",
    documents: ["lettre_demission_michel_blanc.pdf"],
    createdAt: "2024-11-30",
  },
];

export const mockWorkAccidents: WorkAccident[] = [
  {
    id: "ACC-001",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    date: "2024-09-15",
    time: "14:30",
    location: "Centre Commercial Atlantis - Parking Niveau 2",
    description:
      "Chute sur sol glissant lors d'une ronde. Entorse de la cheville droite.",
    severity: "moderate",
    cause: "Sol glissant non signalé",
    witness: "Marie Martin",
    medicalCare: true,
    workStoppage: true,
    workStoppageDays: 5,
    declared: true,
    declaredAt: "2024-09-16",
    documents: [
      "declaration_accident_jean_dupont_2024.pdf",
      "certificat_medical_jean_dupont.pdf",
    ],
    createdAt: "2024-09-15",
    updatedAt: "2024-09-16",
  },
  {
    id: "ACC-002",
    employeeId: "3",
    employeeName: "Pierre Bernard",
    employeeNumber: "EMP003",
    date: "2024-11-20",
    time: "10:15",
    location: "Tour de Bureaux Skyline - Hall d'accueil",
    description:
      "Coupure à la main droite avec du verre brisé lors du nettoyage.",
    severity: "light",
    cause: "Manipulation de verre brisé sans protection",
    witness: "Sophie Bernard",
    medicalCare: true,
    workStoppage: false,
    declared: true,
    declaredAt: "2024-11-20",
    documents: ["declaration_accident_pierre_bernard_2024.pdf"],
    createdAt: "2024-11-20",
    updatedAt: "2024-11-20",
  },
  {
    id: "ACC-003",
    employeeId: "5",
    employeeName: "Luc Moreau",
    employeeNumber: "EMP005",
    date: "2024-08-10",
    time: "16:45",
    location: "Centre Commercial Atlantis - Zone Technique",
    description: "Lumbago suite à un effort de manutention.",
    severity: "moderate",
    cause: "Manutention manuelle sans équipement adapté",
    medicalCare: true,
    workStoppage: true,
    workStoppageDays: 3,
    declared: true,
    declaredAt: "2024-08-11",
    documents: [
      "declaration_accident_luc_moreau_2024.pdf",
      "certificat_medical_luc_moreau.pdf",
    ],
    createdAt: "2024-08-10",
    updatedAt: "2024-08-11",
  },
];

export const mockTrainingRegister: TrainingRegisterEntry[] = [
  {
    id: "REG-TRAIN-001",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    trainingType: "SSIAP1",
    provider: "CNAPS",
    startDate: "2023-01-10",
    endDate: "2023-01-15",
    duration: 21,
    certificateNumber: "SSIAP-2023-001",
    cost: 1200,
    documents: ["certificat_ssiap1_jean_dupont.pdf"],
    createdAt: "2023-01-15",
  },
  {
    id: "REG-TRAIN-002",
    employeeId: "2",
    employeeName: "Marie Martin",
    employeeNumber: "EMP002",
    trainingType: "SST",
    provider: "INRS",
    startDate: "2023-06-01",
    endDate: "2023-06-03",
    duration: 14,
    certificateNumber: "SST-2023-002",
    cost: 800,
    documents: ["certificat_sst_marie_martin.pdf"],
    createdAt: "2023-06-03",
  },
  {
    id: "REG-TRAIN-003",
    employeeId: "6",
    employeeName: "Claire Petit",
    employeeNumber: "EMP006",
    trainingType: "SSIAP2",
    provider: "CNAPS",
    startDate: "2022-03-15",
    endDate: "2022-03-20",
    duration: 28,
    certificateNumber: "SSIAP-2022-003",
    cost: 1500,
    documents: ["certificat_ssiap2_claire_petit.pdf"],
    createdAt: "2022-03-20",
  },
  {
    id: "REG-TRAIN-004",
    employeeId: "7",
    employeeName: "Thomas Roux",
    employeeNumber: "EMP007",
    trainingType: "Formation Formateur SST",
    provider: "INRS",
    startDate: "2024-05-10",
    endDate: "2024-05-17",
    duration: 35,
    certificateNumber: "FORM-SST-2024-001",
    cost: 2500,
    documents: ["certificat_formateur_sst_thomas_roux.pdf"],
    createdAt: "2024-05-17",
  },
];

export const mockCDDEntries: CDDEntry[] = [
  {
    id: "REG-CDD-001",
    employeeId: "10",
    employeeName: "Julie Laurent",
    employeeNumber: "EMP010",
    action: "entry",
    contractStartDate: "2024-03-01",
    contractEndDate: "2025-02-28",
    position: "Agent de sécurité",
    reason: "Remplacement congé maternité",
    renewalCount: 0,
    documents: ["contrat_cdd_julie_laurent.pdf"],
    createdAt: "2024-03-01",
  },
  {
    id: "REG-CDD-002",
    employeeId: "13",
    employeeName: "Nicolas Petit",
    employeeNumber: "EMP013",
    action: "entry",
    contractStartDate: "2025-01-15",
    contractEndDate: "2025-07-14",
    position: "Agent de sécurité",
    reason: "Accroissement temporaire d'activité",
    renewalCount: 0,
    documents: ["contrat_cdd_nicolas_petit.pdf"],
    createdAt: "2025-01-15",
  },
];
