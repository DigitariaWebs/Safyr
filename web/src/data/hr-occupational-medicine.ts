export interface MedicalVisit {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  type: "VM" | "VIP" | "Pré-reprise" | "Reprise" | "Autre";
  status: "À planifier" | "Planifiée" | "Effectuée" | "En retard" | "Annulée";
  scheduledDate?: string;
  completedDate?: string;
  nextVisitDate?: string;
  fitness: "Apte" | "Apte avec réserves" | "Inapte temporaire" | "Inapte" | "-";
  doctor: string;
  organization: string;
  restrictions?: string;
  notes?: string;
  documents: string[];
  alertSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export const mockMedicalVisits: MedicalVisit[] = [
  {
    id: "MED-001",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    type: "VM",
    status: "Effectuée",
    scheduledDate: "2024-11-15",
    completedDate: "2024-11-15",
    nextVisitDate: "2026-11-15",
    fitness: "Apte",
    doctor: "Dr. Martin",
    organization: "Médecine du Travail Paris",
    documents: ["certificat_aptitude_jean_dupont_2024.pdf"],
    alertSent: false,
    createdAt: "2024-10-01",
    updatedAt: "2024-11-15",
  },
  {
    id: "MED-002",
    employeeId: "2",
    employeeName: "Marie Martin",
    employeeNumber: "EMP002",
    type: "VIP",
    status: "À planifier",
    fitness: "-",
    doctor: "",
    organization: "Médecine du Travail Paris",
    documents: [],
    alertSent: true,
    notes:
      "Visite d'information et de prévention à planifier avant fin d'année",
    createdAt: "2024-12-01",
    updatedAt: "2024-12-20",
  },
  {
    id: "MED-003",
    employeeId: "3",
    employeeName: "Pierre Bernard",
    employeeNumber: "EMP003",
    type: "Reprise",
    status: "Planifiée",
    scheduledDate: "2024-12-28",
    fitness: "-",
    doctor: "Dr. Dubois",
    organization: "Médecine du Travail Paris",
    documents: [],
    alertSent: false,
    notes: "Reprise après arrêt maladie",
    createdAt: "2024-12-10",
    updatedAt: "2024-12-15",
  },
  {
    id: "MED-004",
    employeeId: "4",
    employeeName: "Sophie Dubois",
    employeeNumber: "EMP004",
    type: "VM",
    status: "En retard",
    scheduledDate: "2024-11-30",
    fitness: "-",
    doctor: "",
    organization: "Médecine du Travail Paris",
    documents: [],
    alertSent: true,
    notes: "Visite médicale en retard. À replanifier rapidement.",
    createdAt: "2024-10-15",
    updatedAt: "2024-12-01",
  },
  {
    id: "MED-005",
    employeeId: "5",
    employeeName: "Luc Moreau",
    employeeNumber: "EMP005",
    type: "VM",
    status: "Effectuée",
    scheduledDate: "2024-10-20",
    completedDate: "2024-10-20",
    nextVisitDate: "2026-10-20",
    fitness: "Apte avec réserves",
    doctor: "Dr. Martin",
    organization: "Médecine du Travail Paris",
    restrictions: "Pas de port de charges lourdes supérieures à 20kg",
    documents: ["certificat_aptitude_luc_moreau_2024.pdf"],
    alertSent: false,
    createdAt: "2024-09-15",
    updatedAt: "2024-10-20",
  },
  {
    id: "MED-006",
    employeeId: "6",
    employeeName: "Claire Petit",
    employeeNumber: "EMP006",
    type: "Pré-reprise",
    status: "Planifiée",
    scheduledDate: "2025-01-10",
    fitness: "-",
    doctor: "Dr. Dubois",
    organization: "Médecine du Travail Paris",
    documents: [],
    alertSent: false,
    notes: "Pré-reprise après arrêt de travail prolongé",
    createdAt: "2024-12-15",
    updatedAt: "2024-12-15",
  },
  {
    id: "MED-007",
    employeeId: "7",
    employeeName: "Thomas Roux",
    employeeNumber: "EMP007",
    type: "VM",
    status: "Planifiée",
    scheduledDate: "2025-02-15",
    fitness: "-",
    doctor: "Dr. Martin",
    organization: "Médecine du Travail Paris",
    documents: [],
    alertSent: false,
    createdAt: "2024-12-01",
    updatedAt: "2024-12-01",
  },
];
