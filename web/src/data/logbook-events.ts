export type EventType =
  | "routine"
  | "incident"
  | "action"
  | "control"
  | "critical";

export type EventStatus = "in_progress" | "resolved" | "deferred" | "pending";

export type EventSeverity = "low" | "medium" | "high" | "critical";

export interface LogbookEvent {
  id: string;
  timestamp: string;
  site: string;
  siteId: string;
  zone?: string;
  type: EventType;
  severity: EventSeverity;
  status: EventStatus;
  title: string;
  description: string;
  agentId: string;
  agentName: string;
  supervisorId?: string;
  supervisorName?: string;
  supervisorComment?: string;
  clientNotified: boolean;
  tags: string[];
  media?: {
    photos?: string[];
    videos?: string[];
    voiceNotes?: string[];
  };
  location?: {
    lat: number;
    lng: number;
  };
  signature?: string;
  validatedAt?: string;
  resolvedAt?: string;
}

// Helper function to get today's date in ISO format
const getTodayISO = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const mockLogbookEvents: LogbookEvent[] = [
  // Today's events (for client portal)
  {
    id: "EVT-TODAY-001",
    timestamp: `${getTodayISO()}T08:15:00Z`,
    site: "Centre Commercial Atlantis",
    siteId: "SITE-001",
    zone: "Entrée Principale",
    type: "routine",
    severity: "low",
    status: "resolved",
    title: "Ouverture site",
    description:
      "Ouverture normale du site. Inspection visuelle effectuée. RAS.",
    agentId: "AGT-125",
    agentName: "Jean Dupont",
    supervisorId: "SUP-012",
    supervisorName: "Marie Martin",
    supervisorComment: "Conforme",
    clientNotified: false,
    tags: ["ouverture", "routine"],
    media: {
      photos: ["/logbook/opening-today-001.jpg"],
    },
    signature: "signed",
    validatedAt: `${getTodayISO()}T08:30:00Z`,
    resolvedAt: `${getTodayISO()}T08:20:00Z`,
  },
  {
    id: "EVT-TODAY-002",
    timestamp: `${getTodayISO()}T10:30:00Z`,
    site: "Centre Commercial Atlantis",
    siteId: "SITE-001",
    zone: "Hall principal",
    type: "incident",
    severity: "medium",
    status: "resolved",
    title: "Intervention visiteur",
    description:
      "Visiteur sans badge d'accès. Accompagné au bureau d'accueil. Situation résolue.",
    agentId: "AGT-125",
    agentName: "Jean Dupont",
    supervisorId: "SUP-012",
    supervisorName: "Marie Martin",
    supervisorComment: "Bien géré",
    clientNotified: true,
    tags: ["visiteur", "intervention"],
    media: {
      photos: ["/logbook/visitor-today-002.jpg"],
    },
    signature: "signed",
    validatedAt: `${getTodayISO()}T10:45:00Z`,
    resolvedAt: `${getTodayISO()}T10:40:00Z`,
  },
  {
    id: "EVT-TODAY-003",
    timestamp: `${getTodayISO()}T14:00:00Z`,
    site: "Tour de Bureaux Skyline",
    siteId: "SITE-002",
    zone: "Niveau 3",
    type: "control",
    severity: "low",
    status: "resolved",
    title: "Ronde de contrôle",
    description:
      "Ronde de contrôle effectuée. Vérification des accès et alarmes. Tout conforme.",
    agentId: "AGT-087",
    agentName: "Sophie Bernard",
    clientNotified: false,
    tags: ["ronde", "contrôle", "routine"],
    signature: "signed",
    resolvedAt: `${getTodayISO()}T14:15:00Z`,
  },
  {
    id: "EVT-TODAY-004",
    timestamp: `${getTodayISO()}T16:00:00Z`,
    site: "Centre Commercial Atlantis",
    siteId: "SITE-001",
    zone: "Parking",
    type: "action",
    severity: "low",
    status: "resolved",
    title: "Nettoyage déversement",
    description:
      "Déversement de liquide détecté. Nettoyage immédiat effectué. Zone sécurisée.",
    agentId: "AGT-125",
    agentName: "Jean Dupont",
    clientNotified: false,
    tags: ["nettoyage", "action"],
    signature: "signed",
    resolvedAt: `${getTodayISO()}T16:10:00Z`,
  },
  {
    id: "EVT-TODAY-005",
    timestamp: `${getTodayISO()}T19:00:00Z`,
    site: "Centre Commercial Atlantis",
    siteId: "SITE-001",
    zone: "Sortie Principale",
    type: "routine",
    severity: "low",
    status: "resolved",
    title: "Fermeture site",
    description:
      "Fermeture du site. Vérification de tous les accès. Armement alarme effectué. RAS.",
    agentId: "AGT-125",
    agentName: "Jean Dupont",
    clientNotified: false,
    tags: ["fermeture", "routine"],
    media: {
      photos: ["/logbook/closing-today-005.jpg"],
    },
    signature: "signed",
    resolvedAt: `${getTodayISO()}T19:15:00Z`,
  },
  // Historical events
  {
    id: "EVT-2024-001",
    timestamp: "2024-12-24T08:15:00Z",
    site: "Centre Commercial Atlantis",
    siteId: "SITE-001",
    zone: "Entrée Principale",
    type: "routine",
    severity: "low",
    status: "resolved",
    title: "Ouverture site",
    description:
      "Ouverture normale du site. Inspection visuelle effectuée. RAS.",
    agentId: "AGT-125",
    agentName: "Jean Dupont",
    supervisorId: "SUP-012",
    supervisorName: "Marie Martin",
    supervisorComment: "Conforme",
    clientNotified: false,
    tags: ["ouverture", "routine"],
    media: {
      photos: ["/logbook/opening-001.jpg"],
    },
    signature: "signed",
    validatedAt: "2024-12-24T08:30:00Z",
    resolvedAt: "2024-12-24T08:20:00Z",
  },
  {
    id: "EVT-2024-002",
    timestamp: "2024-12-24T10:45:00Z",
    site: "Centre Commercial Atlantis",
    siteId: "SITE-001",
    zone: "Parking Niveau 2",
    type: "incident",
    severity: "high",
    status: "in_progress",
    title: "Tentative d'effraction véhicule",
    description:
      "Détection d'une tentative d'effraction sur véhicule Peugeot 308 grise, immatriculée AB-123-CD. Auteur en fuite. Police contactée.",
    agentId: "AGT-125",
    agentName: "Jean Dupont",
    clientNotified: true,
    tags: ["effraction", "police", "urgent"],
    media: {
      photos: ["/logbook/incident-002-1.jpg", "/logbook/incident-002-2.jpg"],
      videos: ["/logbook/incident-002-video.mp4"],
    },
    location: {
      lat: 48.8566,
      lng: 2.3522,
    },
    signature: "signed",
  },
  {
    id: "EVT-2024-003",
    timestamp: "2024-12-24T12:30:00Z",
    site: "Tour de Bureaux Skyline",
    siteId: "SITE-002",
    zone: "Hall d'accueil",
    type: "action",
    severity: "medium",
    status: "resolved",
    title: "Intervention visiteur agressif",
    description:
      "Visiteur refusant de présenter une pièce d'identité, comportement agressif. Personne accompagnée vers la sortie sans incident.",
    agentId: "AGT-087",
    agentName: "Sophie Bernard",
    supervisorId: "SUP-012",
    supervisorName: "Marie Martin",
    supervisorComment: "Bien géré. Procédure respectée.",
    clientNotified: true,
    tags: ["visiteur", "intervention", "sécurité"],
    media: {
      photos: ["/logbook/action-003.jpg"],
    },
    signature: "signed",
    validatedAt: "2024-12-24T13:00:00Z",
    resolvedAt: "2024-12-24T12:45:00Z",
  },
  {
    id: "EVT-2024-004",
    timestamp: "2024-12-24T14:00:00Z",
    site: "Centre Commercial Atlantis",
    siteId: "SITE-001",
    zone: "Zone Technique",
    type: "critical",
    severity: "critical",
    status: "resolved",
    title: "Détection incendie - Alarme déclenchée",
    description:
      "Alarme incendie déclenchée dans la zone technique. Évacuation partielle effectuée. Fausse alarme confirmée par les pompiers. Défaut de détecteur.",
    agentId: "AGT-125",
    agentName: "Jean Dupont",
    supervisorId: "SUP-012",
    supervisorName: "Marie Martin",
    supervisorComment:
      "Intervention rapide et conforme. Maintenance préventive à prévoir.",
    clientNotified: true,
    tags: ["incendie", "alarme", "pompiers", "critique"],
    media: {
      photos: [
        "/logbook/fire-004-1.jpg",
        "/logbook/fire-004-2.jpg",
        "/logbook/fire-004-3.jpg",
      ],
      voiceNotes: ["/logbook/fire-004-note.mp3"],
    },
    location: {
      lat: 48.8566,
      lng: 2.3522,
    },
    signature: "signed",
    validatedAt: "2024-12-24T14:30:00Z",
    resolvedAt: "2024-12-24T14:45:00Z",
  },
  {
    id: "EVT-2024-005",
    timestamp: "2024-12-24T16:15:00Z",
    site: "Tour de Bureaux Skyline",
    siteId: "SITE-002",
    zone: "Niveau -2",
    type: "control",
    severity: "low",
    status: "resolved",
    title: "Ronde de contrôle - Niveau -2",
    description:
      "Ronde de contrôle effectuée. Vérification des accès, alarmes, caméras et éclairages. Tout conforme.",
    agentId: "AGT-087",
    agentName: "Sophie Bernard",
    clientNotified: false,
    tags: ["ronde", "contrôle", "routine"],
    location: {
      lat: 48.8566,
      lng: 2.3522,
    },
    signature: "signed",
    resolvedAt: "2024-12-24T16:30:00Z",
  },
  {
    id: "EVT-2024-006",
    timestamp: "2024-12-24T18:00:00Z",
    site: "Centre Commercial Atlantis",
    siteId: "SITE-001",
    zone: "Parking extérieur",
    type: "incident",
    severity: "medium",
    status: "pending",
    title: "Véhicule suspect stationné",
    description:
      "Véhicule stationné depuis plus de 4 heures sans mouvement. Immatriculation relevée. Surveillance en cours.",
    agentId: "AGT-125",
    agentName: "Jean Dupont",
    clientNotified: false,
    tags: ["suspect", "surveillance", "véhicule"],
    media: {
      photos: ["/logbook/vehicle-006.jpg"],
    },
    location: {
      lat: 48.8566,
      lng: 2.3522,
    },
    signature: "signed",
  },
  {
    id: "EVT-2024-007",
    timestamp: "2024-12-24T19:30:00Z",
    site: "Centre Commercial Atlantis",
    siteId: "SITE-001",
    zone: "Sortie Principale",
    type: "routine",
    severity: "low",
    status: "resolved",
    title: "Fermeture site",
    description:
      "Fermeture du site. Vérification de tous les accès. Armement alarme effectué. RAS.",
    agentId: "AGT-125",
    agentName: "Jean Dupont",
    clientNotified: false,
    tags: ["fermeture", "routine"],
    media: {
      photos: ["/logbook/closing-007.jpg"],
    },
    signature: "signed",
    resolvedAt: "2024-12-24T19:45:00Z",
  },
  {
    id: "EVT-2024-008",
    timestamp: "2024-12-23T22:15:00Z",
    site: "Tour de Bureaux Skyline",
    siteId: "SITE-002",
    zone: "Hall principal",
    type: "incident",
    severity: "medium",
    status: "deferred",
    title: "Panne ascenseur",
    description:
      "Ascenseur principal bloqué au 5ème étage. Personnes évacuées par les pompiers. Maintenance technique prévue demain matin.",
    agentId: "AGT-087",
    agentName: "Sophie Bernard",
    supervisorId: "SUP-012",
    supervisorName: "Marie Martin",
    supervisorComment: "Suivi maintenance nécessaire",
    clientNotified: true,
    tags: ["panne", "ascenseur", "maintenance"],
    media: {
      photos: ["/logbook/elevator-008.jpg"],
    },
    signature: "signed",
    validatedAt: "2024-12-23T22:45:00Z",
  },
];

export const mockSites = [
  { id: "SITE-001", name: "Centre Commercial Atlantis", city: "Paris" },
  { id: "SITE-002", name: "Tour de Bureaux Skyline", city: "Lyon" },
  { id: "SITE-003", name: "Entrepôt Logistique Nord", city: "Lille" },
  { id: "SITE-004", name: "Campus Technologique", city: "Toulouse" },
];

export const mockAgents = [
  {
    id: "AGT-125",
    name: "Jean Dupont",
    role: "Agent de sécurité",
    siteId: "SITE-001",
  },
  {
    id: "AGT-087",
    name: "Sophie Bernard",
    role: "Agent de sécurité",
    siteId: "SITE-002",
  },
  {
    id: "AGT-234",
    name: "Thomas Petit",
    role: "Agent de sécurité",
    siteId: "SITE-003",
  },
  {
    id: "AGT-156",
    name: "Julie Moreau",
    role: "Agent de sécurité",
    siteId: "SITE-004",
  },
];

export const mockSupervisors = [
  { id: "SUP-012", name: "Marie Martin", role: "Superviseur" },
  { id: "SUP-024", name: "Pierre Durand", role: "Superviseur" },
];
