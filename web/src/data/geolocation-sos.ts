export type SOSStatus =
  | "active"
  | "acknowledged"
  | "dispatched"
  | "escalated"
  | "dismissed";

export interface SOSEvent {
  id: string;
  agentId: string;
  agentName: string;
  site: string;
  latitude: number;
  longitude: number;
  triggeredAt: string;
  status: SOSStatus;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  dismissedAt?: string;
  dismissReason?: string;
  dismissNote?: string;
}

export interface ImmobilityAlert {
  id: string;
  agentId: string;
  agentName: string;
  site: string;
  latitude: number;
  longitude: number;
  lastMovement: string;
  durationMinutes: number;
}

export const mockActiveSOSEvents: SOSEvent[] = [
  {
    id: "sos-1",
    agentId: "3",
    agentName: "Pierre Bernard",
    site: "Entrepôt Logistique Gennevilliers",
    latitude: 48.9333,
    longitude: 2.2978,
    triggeredAt: new Date(Date.now() - 3 * 60000).toISOString(),
    status: "active",
  },
];

export const mockSOSHistory: SOSEvent[] = [
  {
    id: "sos-2",
    agentId: "5",
    agentName: "Lucas Moreau",
    site: "Centre Commercial Rosny 2",
    latitude: 48.8615,
    longitude: 2.3475,
    triggeredAt: new Date(Date.now() - 45 * 60000).toISOString(),
    status: "dismissed",
    acknowledgedAt: new Date(Date.now() - 43 * 60000).toISOString(),
    dismissedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    dismissReason: "Fausse alerte",
  },
  {
    id: "sos-3",
    agentId: "1",
    agentName: "Jean Dupont",
    site: "Centre Commercial Rosny 2",
    latitude: 48.8566,
    longitude: 2.3522,
    triggeredAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    status: "dismissed",
    dismissedAt: new Date(Date.now() - 110 * 60000).toISOString(),
    dismissReason: "Test de système",
  },
  {
    id: "sos-4",
    agentId: "4",
    agentName: "Sophie Dubois",
    site: "Siège Social La Défense",
    latitude: 48.8922,
    longitude: 2.2365,
    triggeredAt: new Date(Date.now() - 5 * 60 * 60000).toISOString(),
    status: "dismissed",
    dismissedAt: new Date(Date.now() - 290 * 60000).toISOString(),
    dismissReason: "Problème technique",
  },
  {
    id: "sos-5",
    agentId: "2",
    agentName: "Marie Martin",
    site: "Siège Social La Défense",
    latitude: 48.8953,
    longitude: 2.2312,
    triggeredAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
    status: "dismissed",
    dismissedAt: new Date(Date.now() - 23 * 60 * 60000).toISOString(),
    dismissReason: "Agent confirme sécurité",
  },
];

export const mockImmobilityAlerts: ImmobilityAlert[] = [
  {
    id: "immo-1",
    agentId: "6",
    agentName: "Camille Leroy",
    site: "Siège Social La Défense",
    latitude: 48.8953,
    longitude: 2.2312,
    lastMovement: new Date(Date.now() - 18 * 60000).toISOString(),
    durationMinutes: 18,
  },
];

export const DISMISS_REASONS = [
  "Fausse alerte",
  "Test de système",
  "Problème technique",
  "Agent confirme sécurité",
  "Autre",
] as const;

export type DismissReason = (typeof DISMISS_REASONS)[number];

export const SOS_STATUS_CONFIG: Record<
  SOSStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Actif",
    className: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  acknowledged: {
    label: "Acquitté",
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  dispatched: {
    label: "Secours envoyé",
    className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  escalated: {
    label: "Escaladé",
    className: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  dismissed: {
    label: "Clôturé",
    className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  },
};
