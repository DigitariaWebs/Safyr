export interface PlanningAgent {
  id: string;
  name: string;
  contractType: "CDI" | "CDD" | "Intérim";
  contractHours: number;
  qualifications: string[];
  availabilityStatus: "Disponible" | "En mission" | "Congé" | "Absent";
  weeklyHours: number;
  maxAmplitude: number; // heures
  lastActivity: string;
  phone: string;
  email: string;
}

export const mockPlanningAgents: PlanningAgent[] = [
  {
    id: "1",
    name: "Jean Dupont",
    contractType: "CDI",
    contractHours: 35,
    qualifications: ["CQP APS", "SSIAP 1", "Carte Professionnelle"],
    availabilityStatus: "Disponible",
    weeklyHours: 35,
    maxAmplitude: 12,
    lastActivity: "2024-01-15",
    phone: "06 12 34 56 78",
    email: "jean.dupont@example.com",
  },
  {
    id: "2",
    name: "Marie Martin",
    contractType: "CDI",
    contractHours: 39,
    qualifications: ["CQP APS", "SST", "Carte Professionnelle"],
    availabilityStatus: "En mission",
    weeklyHours: 39,
    maxAmplitude: 10,
    lastActivity: "2024-01-20",
    phone: "06 23 45 67 89",
    email: "marie.martin@example.com",
  },
  {
    id: "3",
    name: "Pierre Bernard",
    contractType: "CDD",
    contractHours: 35,
    qualifications: ["CQP APS", "SSIAP 2", "Carte Professionnelle"],
    availabilityStatus: "Disponible",
    weeklyHours: 35,
    maxAmplitude: 12,
    lastActivity: "2024-01-18",
    phone: "06 34 56 78 90",
    email: "pierre.bernard@example.com",
  },
  {
    id: "4",
    name: "Sophie Dubois",
    contractType: "CDI",
    contractHours: 35,
    qualifications: ["CQP APS", "SST", "Carte Professionnelle"],
    availabilityStatus: "Congé",
    weeklyHours: 0,
    maxAmplitude: 12,
    lastActivity: "2024-01-10",
    phone: "06 45 67 89 01",
    email: "sophie.dubois@example.com",
  },
];


