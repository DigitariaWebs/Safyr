export interface BillingClient {
  id: string;
  name: string;
  siret: string;
  tva?: string; // Numéro de TVA
  contractType: "Mensuel" | "Forfaitaire" | "Heure réelle";
  // Backwards-compatible single service type (kept for compatibility)
  serviceType?:
    | "Gardiennage"
    | "Rondes"
    | "Événementiel"
    | "SSIAP"
    | "Accueil"
    | "Intervention"
    | "ADS";
  // Multiple service types allowed
  serviceTypes?: (
    | "Gardiennage"
    | "Rondes"
    | "Événementiel"
    | "SSIAP"
    | "Accueil"
    | "Intervention"
    | "ADS"
  )[];
  contractStartDate: string;
  contractEndDate?: string;
  monthlyHours?: number; // volumes horaires mensuels
  hourlyRate: number;
  nightBonus: number; // % majoration nuit
  sundayBonus: number; // % majoration dimanche
  holidayBonus: number; // % majoration jours fériés
  indexationRate?: number; // % d'indexation annuelle
  sites: number;
  status: "Actif" | "Suspendu" | "Inactif";
  billingDay: number; // jour du mois
  paymentTerm: number; // jours
  lastInvoice: string;
  // Company info
  companyPhone?: string;
  companyEmail?: string;
  address?: string;
  // Contact info
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  // Legacy fields (kept for backward compatibility)
  phone?: string;
  email?: string;
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
    tva: "FR12345678901",
    contractType: "Mensuel",
    serviceType: "Gardiennage",
    serviceTypes: ["Gardiennage"],
    contractStartDate: "2024-01-01",
    contractEndDate: "2024-12-31",
    monthlyHours: 720,
    hourlyRate: 25.5,
    nightBonus: 15,
    sundayBonus: 30,
    holidayBonus: 50,
    indexationRate: 2.5,
    sites: 1,
    status: "Actif",
    billingDay: 1,
    paymentTerm: 30,
    lastInvoice: "2024-01-01",
    companyPhone: "01 23 45 67 89",
    companyEmail: "contact@rosny2.example.com",
    address: "1 Rue du Commerce, 93100 Rosny-sous-Bois",
    contactName: "Mme. Responsable",
    contactPhone: "06 12 34 56 78",
    contactEmail: "responsable@rosny2.example.com",
    agentTypes: ["Agent de sécurité", "Chef de poste"],
    planningVolumes: [
      { site: "Rosny 2 - Entrée principale", monthlyHours: 720 },
    ],
  },
  {
    id: "2",
    name: "Siège Social La Défense",
    siret: "98765432109876",
    tva: "FR98765432109",
    contractType: "Forfaitaire",
    serviceType: "Rondes",
    serviceTypes: ["Rondes"],
    contractStartDate: "2024-01-01",
    monthlyHours: 480,
    hourlyRate: 28.0,
    nightBonus: 20,
    sundayBonus: 35,
    holidayBonus: 55,
    indexationRate: 3.0,
    sites: 2,
    status: "Actif",
    billingDay: 5,
    paymentTerm: 45,
    lastInvoice: "2024-01-05",
    companyPhone: "01 98 76 54 32",
    companyEmail: "contact@ladefense.example.com",
    address: "10 Place de la Défense, 92000 La Défense",
    contactName: "M. Directeur",
    contactPhone: "06 98 76 54 32",
    contactEmail: "directeur@ladefense.example.com",
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
    tva: "FR11223344556",
    contractType: "Heure réelle",
    serviceType: "Événementiel",
    serviceTypes: ["Événementiel"],
    contractStartDate: "2024-01-01",
    hourlyRate: 22.0,
    nightBonus: 10,
    sundayBonus: 25,
    holidayBonus: 45,
    sites: 1,
    status: "Actif",
    billingDay: 10,
    paymentTerm: 30,
    lastInvoice: "2024-01-10",
    companyPhone: "01 34 56 78 90",
    companyEmail: "contact@gennevilliers-warehouse.example.com",
    address: "5 Rue des Entrepôts, 92230 Gennevilliers",
    contactName: "M. Logistique",
    contactPhone: "06 34 56 78 90",
    contactEmail: "logistique@gennevilliers-warehouse.example.com",
    agentTypes: ["Agent événementiel"],
  },
  {
    id: "4",
    name: "Hôpital Saint-Antoine",
    siret: "22334455667788",
    tva: "FR22334455667",
    contractType: "Mensuel",
    serviceType: "Gardiennage",
    serviceTypes: ["Gardiennage", "SSIAP"],
    contractStartDate: "2024-01-01",
    contractEndDate: "2024-12-31",
    monthlyHours: 960,
    hourlyRate: 26.7,
    nightBonus: 20,
    sundayBonus: 40,
    holidayBonus: 60,
    indexationRate: 2.0,
    sites: 3,
    status: "Actif",
    billingDay: 1,
    paymentTerm: 30,
    lastInvoice: "2024-01-01",
    companyPhone: "01 23 45 11 22",
    companyEmail: "security@stantoine.example.com",
    address: "2 Rue de l'Hôpital, 75012 Paris",
    contactName: "Direction des services",
    contactPhone: "06 23 45 11 22",
    contactEmail: "direction@stantoine.example.com",
    agentTypes: ["Agent de sécurité", "Chef de poste", "Superviseur"],
    planningVolumes: [
      { site: "Entrée principale", monthlyHours: 320 },
      { site: "Urgences", monthlyHours: 320 },
      { site: "Parking", monthlyHours: 320 },
    ],
  },
  {
    id: "5",
    name: "Aéroport Charles de Gaulle",
    siret: "33445566778899",
    tva: "FR33445566778",
    contractType: "Mensuel",
    serviceType: "Gardiennage",
    serviceTypes: ["Gardiennage", "Accueil"],
    contractStartDate: "2024-01-01",
    contractEndDate: "2024-12-31",
    monthlyHours: 1440,
    hourlyRate: 26.8,
    nightBonus: 25,
    sundayBonus: 50,
    holidayBonus: 70,
    indexationRate: 3.5,
    sites: 5,
    status: "Actif",
    billingDay: 1,
    paymentTerm: 45,
    lastInvoice: "2024-01-01",
    companyPhone: "01 60 79 60 00",
    companyEmail: "security@cdg.example.com",
    address: "95700 Roissy-en-France",
    contactName: "Direction Sécurité aéroportuaire",
    contactPhone: "06 60 79 60 00",
    contactEmail: "direction.securite@cdg.example.com",
    agentTypes: [
      "Agent de sécurité aéroportuaire",
      "Chef de poste",
      "Superviseur",
    ],
    planningVolumes: [
      { site: "Terminal 1", monthlyHours: 480 },
      { site: "Terminal 2", monthlyHours: 480 },
      { site: "Terminal 3", monthlyHours: 240 },
      { site: "Zone fret", monthlyHours: 144 },
      { site: "Parking", monthlyHours: 96 },
    ],
  },
];
