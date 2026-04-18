// ── Types ──────────────────────────────────────────────────────────
// Mirrors web/src/data/geolocation-patrols.ts for API compatibility

export type CheckpointType = "GPS" | "QR" | "NFC";

export type PatrolFrequency =
  | "Quotidienne"
  | "Bi-quotidienne"
  | "Nocturne"
  | "Hebdomadaire";

export type PatrolStatus = "en-cours" | "terminee" | "incomplete" | "planifiee";

export interface PatrolCheckpoint {
  id: string;
  name: string;
  coords: [number, number]; // [lng, lat]
  type: CheckpointType;
  expectedMinutes: number;
  toleranceMinutes: number;
  order: number;
}

export interface PatrolRoute {
  id: string;
  name: string;
  site: string;
  checkpoints: PatrolCheckpoint[];
  estimatedDurationMinutes: number;
  frequency: PatrolFrequency;
  distanceMeters: number;
  createdAt: string; // ISO
}

export interface CheckpointScan {
  checkpointId: string;
  scannedAt: string | null;
  status: "scanned" | "missed" | "pending";
}

export interface PatrolExecution {
  id: string;
  routeId: string;
  routeName: string;
  agentId: string;
  agentName: string;
  site: string;
  status: PatrolStatus;
  startedAt: string; // ISO
  endedAt: string | null;
  checkpointScans: CheckpointScan[];
  gpsTrail: { coords: [number, number]; timestamp: string }[];
  completionRate: number; // 0-100
  actualDurationMinutes: number | null;
  actualDistanceMeters: number | null;
}

// ── Config ─────────────────────────────────────────────────────────

export const PATROL_STATUS_CONFIG: Record<
  PatrolStatus,
  { label: string; color: string }
> = {
  "en-cours": { label: "En cours", color: "#22d3ee" },
  terminee: { label: "Terminée", color: "#34d399" },
  incomplete: { label: "Incomplète", color: "#fbbf24" },
  planifiee: { label: "Planifiée", color: "#60a5fa" },
};

export const CHECKPOINT_TYPE_CONFIG: Record<
  CheckpointType,
  { label: string; color: string }
> = {
  GPS: { label: "GPS", color: "#22d3ee" },
  QR: { label: "QR Code", color: "#a855f7" },
  NFC: { label: "NFC", color: "#f59e0b" },
};

export const PATROL_FREQUENCIES: PatrolFrequency[] = [
  "Quotidienne",
  "Bi-quotidienne",
  "Nocturne",
  "Hebdomadaire",
];

export type PatrolPhase =
  | "idle"
  | "selecting"
  | "previewing"
  | "active"
  | "summary";

/** Scheduled patrol for home screen reminders */
export interface ScheduledPatrol {
  id: string;
  routeId: string;
  routeName: string;
  site: string;
  scheduledAt: string; // ISO
  checkpointCount: number;
  estimatedDurationMinutes: number;
}
