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
    triggeredAt: "2026-03-17T09:57:00Z",
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
    triggeredAt: "2026-03-17T09:15:00Z",
    status: "dismissed",
    acknowledgedAt: "2026-03-17T09:17:00Z",
    dismissedAt: "2026-03-17T09:30:00Z",
    dismissReason: "Fausse alerte",
  },
  {
    id: "sos-3",
    agentId: "1",
    agentName: "Jean Dupont",
    site: "Centre Commercial Rosny 2",
    latitude: 48.8566,
    longitude: 2.3522,
    triggeredAt: "2026-03-17T08:00:00Z",
    status: "dismissed",
    dismissedAt: "2026-03-17T08:10:00Z",
    dismissReason: "Test de système",
  },
  {
    id: "sos-4",
    agentId: "4",
    agentName: "Sophie Dubois",
    site: "Siège Social La Défense",
    latitude: 48.8922,
    longitude: 2.2365,
    triggeredAt: "2026-03-17T05:00:00Z",
    status: "dismissed",
    dismissedAt: "2026-03-17T05:10:00Z",
    dismissReason: "Problème technique",
  },
  {
    id: "sos-5",
    agentId: "2",
    agentName: "Marie Martin",
    site: "Siège Social La Défense",
    latitude: 48.8953,
    longitude: 2.2312,
    triggeredAt: "2026-03-16T10:00:00Z",
    status: "dismissed",
    dismissedAt: "2026-03-16T11:00:00Z",
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
    lastMovement: "2026-03-17T09:42:00Z",
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
