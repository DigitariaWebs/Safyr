export interface Equipment {
  id: string;
  name: string;
  type: "radio" | "uniform" | "epi" | "vehicle" | "other";
  category: string;
  serialNumber?: string;
  brand?: string;
  model?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  status: "available" | "assigned" | "maintenance" | "lost" | "damaged";
  assignedTo?: string;
  assignedToName?: string;
  assignedAt?: string;
  returnDate?: string;
  location?: string;
  notes?: string;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentAssignment {
  id: string;
  equipmentId: string;
  equipmentName: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  assignedAt: string;
  returnedAt?: string;
  condition: "good" | "fair" | "poor";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockEquipment: Equipment[] = [
  {
    id: "EQ-001",
    name: "Radio Motorola DP4400",
    type: "radio",
    category: "Communication",
    serialNumber: "MTR-2024-001",
    brand: "Motorola",
    model: "DP4400",
    purchaseDate: "2024-01-15",
    purchasePrice: 350,
    status: "assigned",
    assignedTo: "1",
    assignedToName: "Jean Dupont",
    assignedAt: "2024-01-20",
    location: "Centre Commercial Atlantis",
    documents: ["fiche_radio_motorola_dp4400.pdf"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "EQ-002",
    name: "Uniforme Agent Sécurité",
    type: "uniform",
    category: "Vêtement",
    brand: "Protex",
    purchaseDate: "2024-03-10",
    purchasePrice: 120,
    status: "assigned",
    assignedTo: "1",
    assignedToName: "Jean Dupont",
    assignedAt: "2024-03-15",
    documents: ["fiche_uniforme_protex.pdf"],
    createdAt: "2024-03-10",
    updatedAt: "2024-03-15",
  },
  {
    id: "EQ-003",
    name: "Chaussures de sécurité S3",
    type: "epi",
    category: "Protection individuelle",
    brand: "Sécuritas",
    model: "S3",
    purchaseDate: "2024-02-01",
    purchasePrice: 95,
    status: "assigned",
    assignedTo: "1",
    assignedToName: "Jean Dupont",
    assignedAt: "2024-02-05",
    documents: ["fiche_chaussures_securitas_s3.pdf"],
    createdAt: "2024-02-01",
    updatedAt: "2024-02-05",
  },
  {
    id: "EQ-004",
    name: "Radio Motorola DP4400",
    type: "radio",
    category: "Communication",
    serialNumber: "MTR-2024-002",
    brand: "Motorola",
    model: "DP4400",
    purchaseDate: "2024-01-15",
    purchasePrice: 350,
    status: "assigned",
    assignedTo: "2",
    assignedToName: "Marie Martin",
    assignedAt: "2024-01-20",
    location: "Tour de Bureaux Skyline",
    documents: ["fiche_radio_motorola_dp4400.pdf"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "EQ-005",
    name: "Radio Motorola DP4400",
    type: "radio",
    category: "Communication",
    serialNumber: "MTR-2024-003",
    brand: "Motorola",
    model: "DP4400",
    purchaseDate: "2024-01-15",
    purchasePrice: 350,
    status: "maintenance",
    location: "Atelier",
    notes: "En réparation - Problème d'antenne",
    documents: ["fiche_radio_motorola_dp4400.pdf", "bon_maintenance_radio_003.pdf"],
    createdAt: "2024-01-15",
    updatedAt: "2024-12-10",
  },
  {
    id: "EQ-006",
    name: "Gants de protection",
    type: "epi",
    category: "Protection individuelle",
    brand: "Ansell",
    purchaseDate: "2024-06-01",
    purchasePrice: 25,
    status: "available",
    location: "Stock EPI",
    documents: ["fiche_gants_ansell.pdf"],
    createdAt: "2024-06-01",
    updatedAt: "2024-06-01",
  },
  {
    id: "EQ-007",
    name: "Clés d'accès Site A",
    type: "other",
    category: "Accès",
    status: "assigned",
    assignedTo: "1",
    assignedToName: "Jean Dupont",
    assignedAt: "2024-01-20",
    location: "Centre Commercial Atlantis",
    documents: ["fiche_cles_site_a.pdf"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
];

export const mockEquipmentAssignments: EquipmentAssignment[] = [
  {
    id: "ASG-001",
    equipmentId: "EQ-001",
    equipmentName: "Radio Motorola DP4400",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    assignedAt: "2024-01-20",
    condition: "good",
    notes: "Remise en bon état",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  {
    id: "ASG-002",
    equipmentId: "EQ-002",
    equipmentName: "Uniforme Agent Sécurité",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    assignedAt: "2024-03-15",
    condition: "good",
    notes: "Taille M",
    createdAt: "2024-03-15",
    updatedAt: "2024-03-15",
  },
  {
    id: "ASG-003",
    equipmentId: "EQ-003",
    equipmentName: "Chaussures de sécurité S3",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    assignedAt: "2024-02-05",
    condition: "good",
    notes: "Taille 42",
    createdAt: "2024-02-05",
    updatedAt: "2024-02-05",
  },
  {
    id: "ASG-004",
    equipmentId: "EQ-004",
    equipmentName: "Radio Motorola DP4400",
    employeeId: "2",
    employeeName: "Marie Martin",
    employeeNumber: "EMP002",
    assignedAt: "2024-01-20",
    condition: "good",
    notes: "Remise en bon état",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
];

