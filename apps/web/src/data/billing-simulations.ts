export interface SimulationShiftNeed {
  id: string;
  postType: string; // "Agent de Sécurité" | "SSIAP 1" | "SSIAP 2" | "SSIAP 3" | "Opérateur Vidéo" | "Accueil" etc.
  type: "fixe" | "variable";
  // For fixed needs
  daysOfWeek?: number[]; // 0=Sunday to 6=Saturday
  startTime: string;
  endTime: string;
  // For variable needs
  startMonth?: number; // 1-12
  endMonth?: number;
  specificDays?: number[]; // days of week
  quantity: number;
}

export interface SimulationService {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  description?: string;
}

export interface Simulation {
  id: string;
  clientName: string;
  clientId?: string;
  siteName: string;
  siteAddress?: string;
  // Date range for the need
  startDate?: string;
  endDate?: string;
  status: "Brouillon" | "En cours" | "Terminée" | "Convertie";
  shiftNeeds: SimulationShiftNeed[];
  additionalServices: SimulationService[];
  // Rate configuration
  hourlyRate: number;
  nightSurchargePercent: number; // default 10%
  sundaySurchargePercent: number; // default 10%
  holidaySurchargePercent: number; // default 100%
  sundayNightSurchargePercent: number; // default 110%
  holidayNightSurchargePercent: number; // default 110%
  totalEstimate?: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export const mockSimulations: Simulation[] = [
  {
    id: "sim-1",
    clientName: "Carrefour France",
    clientId: "client-1",
    siteName: "Centre Commercial Rosny",
    siteAddress: "Rosny-sous-Bois",
    status: "En cours",
    shiftNeeds: [
      {
        id: "need-1",
        postType: "Agent de Sécurité",
        type: "fixe",
        daysOfWeek: [1, 2, 3, 4, 5, 6], // Lundi-Samedi
        startTime: "06:00",
        endTime: "22:00",
        quantity: 2,
      },
      {
        id: "need-2",
        postType: "Agent de Sécurité",
        type: "fixe",
        daysOfWeek: [0], // Dimanche
        startTime: "06:00",
        endTime: "14:00",
        quantity: 1,
      },
      {
        id: "need-3",
        postType: "SSIAP 1",
        type: "fixe",
        daysOfWeek: [1, 2, 3, 4, 5, 6],
        startTime: "06:00",
        endTime: "22:00",
        quantity: 1,
      },
      {
        id: "need-4",
        postType: "Agent de Sécurité",
        type: "variable",
        startMonth: 7,
        endMonth: 8,
        specificDays: [1, 5, 0], // Lundi, Vendredi, Dimanche
        startTime: "17:00",
        endTime: "20:00",
        quantity: 1,
      },
    ],
    additionalServices: [
      {
        id: "svc-1",
        name: "Main courante électronique",
        unitPrice: 150,
        quantity: 1,
        description: "Licence mensuelle",
      },
      {
        id: "svc-2",
        name: "Portail clients",
        unitPrice: 100,
        quantity: 1,
        description: "Accès reporting en ligne",
      },
      {
        id: "svc-3",
        name: "PTI (Protection Travailleur Isolé)",
        unitPrice: 25,
        quantity: 2,
        description: "Par agent",
      },
      {
        id: "svc-4",
        name: "Géolocalisation",
        unitPrice: 30,
        quantity: 2,
        description: "Par agent",
      },
    ],
    hourlyRate: 22.5,
    nightSurchargePercent: 10,
    sundaySurchargePercent: 10,
    holidaySurchargePercent: 100,
    sundayNightSurchargePercent: 110,
    holidayNightSurchargePercent: 110,
    totalEstimate: 285000,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    notes: "Client prioritaire - renouvellement contrat",
  },
  {
    id: "sim-2",
    clientName: "BNP Paribas",
    clientId: "client-2",
    siteName: "Tour La Défense",
    siteAddress: "La Défense, Puteaux",
    status: "Terminée",
    shiftNeeds: [
      {
        id: "need-5",
        postType: "Agent de Sécurité",
        type: "fixe",
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: "07:00",
        endTime: "20:00",
        quantity: 3,
      },
      {
        id: "need-6",
        postType: "SSIAP 2",
        type: "fixe",
        daysOfWeek: [1, 2, 3, 4, 5],
        startTime: "07:00",
        endTime: "20:00",
        quantity: 1,
      },
    ],
    additionalServices: [
      {
        id: "svc-5",
        name: "Main courante électronique",
        unitPrice: 150,
        quantity: 1,
      },
    ],
    hourlyRate: 25.0,
    nightSurchargePercent: 10,
    sundaySurchargePercent: 10,
    holidaySurchargePercent: 100,
    sundayNightSurchargePercent: 110,
    holidayNightSurchargePercent: 110,
    totalEstimate: 420000,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
  },
  {
    id: "sim-3",
    clientName: "Hôpital Saint-Louis",
    clientId: "client-3",
    siteName: "Hôpital Saint-Louis",
    siteAddress: "Paris 10e",
    status: "Brouillon",
    shiftNeeds: [],
    additionalServices: [],
    hourlyRate: 23.0,
    nightSurchargePercent: 10,
    sundaySurchargePercent: 10,
    holidaySurchargePercent: 100,
    sundayNightSurchargePercent: 110,
    holidayNightSurchargePercent: 110,
    createdAt: "2024-01-22",
    updatedAt: "2024-01-22",
  },
];

// Service suggestions for the dropdown
export const availableServices = [
  "Main courante électronique",
  "Portail clients",
  "PTI (Protection Travailleur Isolé)",
  "Géolocalisation",
  "Ordinateur de gestion",
  "Radio HF",
  "Tenue vestimentaire",
  "Badge d'accès",
  "Formation spécifique site",
];
