export interface BillingClient {
  id: string;
  name: string;
  siret: string;
  contractType: "Mensuel" | "Forfaitaire" | "Heure réelle";
  serviceType: "Gardiennage" | "Rondes" | "Événementiel";
  contractStartDate: string;
  contractEndDate?: string;
  monthlyHours?: number; // volumes horaires mensuels
  hourlyRate: number;
  nightBonus: number; // %
  sundayBonus: number; // %
  holidayBonus: number; // %
  indexationRate?: number; // % d'indexation annuelle
  sites: number;
  status: "Actif" | "Suspendu" | "Inactif";
  billingDay: number; // jour du mois
  paymentTerm: number; // jours
  lastInvoice: string;
  // Connexions
  agentTypes?: string[]; // Typologie des agents affectés (RH)
  planningVolumes?: {
    site: string;
    monthlyHours: number;
  }[]; // Volumes contractuels (Planning)
}

export const mockBillingClients: BillingClient[] = [
  {
    id: "1",
    name: "Centre Commercial Rosny 2",
    siret: "12345678901234",
    contractType: "Mensuel",
    serviceType: "Gardiennage",
    contractStartDate: "2024-01-01",
    contractEndDate: "2024-12-31",
    monthlyHours: 720,
    hourlyRate: 25.50,
    nightBonus: 15,
    sundayBonus: 30,
    holidayBonus: 50,
    indexationRate: 2.5,
    sites: 1,
    status: "Actif",
    billingDay: 1,
    paymentTerm: 30,
    lastInvoice: "2024-01-01",
    agentTypes: ["Agent de sécurité", "Chef de poste"],
    planningVolumes: [
      { site: "Rosny 2 - Entrée principale", monthlyHours: 720 },
    ],
  },
  {
    id: "2",
    name: "Siège Social La Défense",
    siret: "98765432109876",
    contractType: "Forfaitaire",
    serviceType: "Rondes",
    contractStartDate: "2024-01-01",
    monthlyHours: 480,
    hourlyRate: 28.00,
    nightBonus: 20,
    sundayBonus: 35,
    holidayBonus: 55,
    indexationRate: 3.0,
    sites: 2,
    status: "Actif",
    billingDay: 5,
    paymentTerm: 45,
    lastInvoice: "2024-01-05",
    agentTypes: ["Rondier", "Agent de sécurité"],
    planningVolumes: [
      { site: "Tour A", monthlyHours: 240 },
      { site: "Tour B", monthlyHours: 240 },
    ],
  },
  {
    id: "3",
    name: "Entrepôt Logistique Gennevilliers",
    siret: "11223344556677",
    contractType: "Heure réelle",
    serviceType: "Événementiel",
    contractStartDate: "2024-01-01",
    hourlyRate: 22.00,
    nightBonus: 10,
    sundayBonus: 25,
    holidayBonus: 45,
    sites: 1,
    status: "Actif",
    billingDay: 10,
    paymentTerm: 30,
    lastInvoice: "2024-01-10",
    agentTypes: ["Agent événementiel"],
  },
];

