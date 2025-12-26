export type AlertType =
  | "grave_incident"
  | "effraction"
  | "incendie"
  | "critique_medical"
  | "absence_ronde"
  | "inactivite"
  | "pc_securite"
  | "superviseur"
  | "client"
  | "rh";

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  timestamp: string;
  site: string;
  siteId: string;
  zone?: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "active" | "acknowledged" | "resolved" | "closed";
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  notified: {
    pcSecurite: boolean;
    superviseur: boolean;
    client: boolean;
    rh: boolean;
  };
  eventId?: string;
  agentId?: string;
  agentName?: string;
  location?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
}

export const mockAlerts: Alert[] = [
  {
    id: "ALT-001",
    type: "incendie",
    title: "Détection incendie - Zone Technique",
    description: "Alarme incendie déclenchée dans la zone technique. Équipe d'intervention en route.",
    timestamp: "2024-12-24T14:00:00Z",
    site: "Centre Commercial Atlantis",
    siteId: "SITE-001",
    zone: "Zone Technique",
    severity: "critical",
    status: "resolved",
    acknowledgedBy: "Marie Martin",
    acknowledgedAt: "2024-12-24T14:02:00Z",
    resolvedBy: "Marie Martin",
    resolvedAt: "2024-12-24T14:45:00Z",
    notified: {
      pcSecurite: true,
      superviseur: true,
      client: true,
      rh: false,
    },
    eventId: "EVT-2024-004",
    agentId: "AGT-125",
    agentName: "Jean Dupont",
    location: {
      lat: 48.8566,
      lng: 2.3522,
    },
    createdAt: "2024-12-24T14:00:00Z",
    updatedAt: "2024-12-24T14:45:00Z",
  },
  {
    id: "ALT-002",
    type: "absence_ronde",
    title: "Ronde manquée - Niveau -2",
    description: "Ronde de 18h non effectuée par l'agent Jean Dupont",
    timestamp: "2024-12-24T18:15:00Z",
    site: "Tour de Bureaux Skyline",
    siteId: "SITE-002",
    zone: "Niveau -2",
    severity: "medium",
    status: "acknowledged",
    acknowledgedBy: "Marie Martin",
    acknowledgedAt: "2024-12-24T18:20:00Z",
    notified: {
      pcSecurite: true,
      superviseur: true,
      client: false,
      rh: false,
    },
    agentId: "AGT-125",
    agentName: "Jean Dupont",
    createdAt: "2024-12-24T18:15:00Z",
    updatedAt: "2024-12-24T18:20:00Z",
  },
  {
    id: "ALT-003",
    type: "effraction",
    title: "Tentative d'effraction détectée",
    description: "Tentative d'effraction sur véhicule dans le parking. Police contactée.",
    timestamp: "2024-12-24T10:45:00Z",
    site: "Centre Commercial Atlantis",
    siteId: "SITE-001",
    zone: "Parking Niveau 2",
    severity: "high",
    status: "resolved",
    acknowledgedBy: "Marie Martin",
    acknowledgedAt: "2024-12-24T10:47:00Z",
    resolvedBy: "Marie Martin",
    resolvedAt: "2024-12-24T11:30:00Z",
    notified: {
      pcSecurite: true,
      superviseur: true,
      client: true,
      rh: false,
    },
    eventId: "EVT-2024-002",
    agentId: "AGT-125",
    agentName: "Jean Dupont",
    location: {
      lat: 48.8566,
      lng: 2.3522,
    },
    createdAt: "2024-12-24T10:45:00Z",
    updatedAt: "2024-12-24T11:30:00Z",
  },
  {
    id: "ALT-004",
    type: "critique_medical",
    title: "Intervention médicale urgente",
    description: "Agent nécessite assistance médicale immédiate. SAMU contacté.",
    timestamp: "2024-12-24T16:30:00Z",
    site: "Tour de Bureaux Skyline",
    siteId: "SITE-002",
    severity: "critical",
    status: "resolved",
    acknowledgedBy: "Marie Martin",
    acknowledgedAt: "2024-12-24T16:31:00Z",
    resolvedBy: "Marie Martin",
    resolvedAt: "2024-12-24T17:00:00Z",
    notified: {
      pcSecurite: true,
      superviseur: true,
      client: true,
      rh: true,
    },
    agentId: "AGT-128",
    agentName: "Sophie Bernard",
    createdAt: "2024-12-24T16:30:00Z",
    updatedAt: "2024-12-24T17:00:00Z",
  },
  {
    id: "ALT-005",
    type: "inactivite",
    title: "Inactivité prolongée agent",
    description: "Agent inactif depuis plus de 2 heures. Vérification en cours.",
    timestamp: "2024-12-24T20:00:00Z",
    site: "Centre Commercial Atlantis",
    siteId: "SITE-001",
    severity: "medium",
    status: "active",
    notified: {
      pcSecurite: true,
      superviseur: true,
      client: false,
      rh: false,
    },
    agentId: "AGT-125",
    agentName: "Jean Dupont",
    createdAt: "2024-12-24T20:00:00Z",
    updatedAt: "2024-12-24T20:00:00Z",
  },
  {
    id: "ALT-006",
    type: "grave_incident",
    title: "Incident grave - Agression",
    description: "Agression verbale et physique signalée. Police et secours contactés.",
    timestamp: "2024-12-23T15:30:00Z",
    site: "Centre Commercial Atlantis",
    siteId: "SITE-001",
    zone: "Hall principal",
    severity: "critical",
    status: "resolved",
    acknowledgedBy: "Marie Martin",
    acknowledgedAt: "2024-12-23T15:32:00Z",
    resolvedBy: "Marie Martin",
    resolvedAt: "2024-12-23T16:00:00Z",
    notified: {
      pcSecurite: true,
      superviseur: true,
      client: true,
      rh: true,
    },
    agentId: "AGT-125",
    agentName: "Jean Dupont",
    location: {
      lat: 48.8566,
      lng: 2.3522,
    },
    createdAt: "2024-12-23T15:30:00Z",
    updatedAt: "2024-12-23T16:00:00Z",
  },
];

