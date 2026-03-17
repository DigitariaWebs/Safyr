import { flatEarthDistance } from "@/data/geolocation-zones";

// ── Types ──────────────────────────────────────────────────────────

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

type PatrolBadgeVariant = "cyan" | "success" | "warning" | "error";

export const PATROL_STATUS_CONFIG: Record<
  PatrolStatus,
  { label: string; badgeVariant: PatrolBadgeVariant; dotClass: string }
> = {
  "en-cours": {
    label: "En cours",
    badgeVariant: "cyan",
    dotClass: "bg-cyan-500",
  },
  terminee: {
    label: "Terminée",
    badgeVariant: "success",
    dotClass: "bg-emerald-500",
  },
  incomplete: {
    label: "Incomplète",
    badgeVariant: "warning",
    dotClass: "bg-yellow-500",
  },
  planifiee: {
    label: "Planifiée",
    badgeVariant: "error",
    dotClass: "bg-slate-400",
  },
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

// ── Utility functions ──────────────────────────────────────────────

/** Sum of flat-earth distances between consecutive checkpoints */
export function computeRouteDistance(checkpoints: PatrolCheckpoint[]): number {
  let total = 0;
  for (let i = 0; i < checkpoints.length - 1; i++) {
    total += flatEarthDistance(checkpoints[i].coords, checkpoints[i + 1].coords);
  }
  return total;
}

/** Filter executions that are currently active */
export function getActivePatrols(
  executions: PatrolExecution[],
): PatrolExecution[] {
  return executions.filter((e) => e.status === "en-cours");
}

/** Filter executions that are completed or incomplete */
export function getPatrolHistory(
  executions: PatrolExecution[],
): PatrolExecution[] {
  return executions.filter(
    (e) => e.status === "terminee" || e.status === "incomplete",
  );
}

/** Lookup a route by ID */
export function getRouteById(
  routes: PatrolRoute[],
  id: string,
): PatrolRoute | undefined {
  return routes.find((r) => r.id === id);
}

/**
 * Generate a mock GPS trail by interpolating between checkpoint coordinates
 * with slight random deviation to simulate realistic movement.
 */
export function generateMockTrail(
  checkpoints: PatrolCheckpoint[],
  options?: {
    pointsPerSegment?: number;
    deviationMeters?: number;
    startTime?: Date;
    intervalSeconds?: number;
  },
): { coords: [number, number]; timestamp: string }[] {
  const {
    pointsPerSegment = 5,
    deviationMeters = 10,
    startTime = new Date(),
    intervalSeconds = 30,
  } = options ?? {};

  const trail: { coords: [number, number]; timestamp: string }[] = [];
  let timeOffset = 0;

  // Seeded pseudo-random for deterministic output
  let seed = 42;
  function seededRandom(): number {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  for (let i = 0; i < checkpoints.length - 1; i++) {
    const [lng1, lat1] = checkpoints[i].coords;
    const [lng2, lat2] = checkpoints[i + 1].coords;

    for (let j = 0; j <= pointsPerSegment; j++) {
      // Skip first point of subsequent segments to avoid duplicates
      if (i > 0 && j === 0) continue;

      const t = j / pointsPerSegment;
      const baseLng = lng1 + (lng2 - lng1) * t;
      const baseLat = lat1 + (lat2 - lat1) * t;

      // Add random deviation (convert meters to degrees)
      const devLat =
        ((seededRandom() - 0.5) * 2 * deviationMeters) / 111320;
      const devLng =
        ((seededRandom() - 0.5) * 2 * deviationMeters) /
        (111320 * Math.cos((baseLat * Math.PI) / 180));

      const timestamp = new Date(
        startTime.getTime() + timeOffset * 1000,
      ).toISOString();

      trail.push({
        coords: [baseLng + devLng, baseLat + devLat],
        timestamp,
      });

      timeOffset += intervalSeconds;
    }
  }

  return trail;
}

// ── Mock Data — Patrol Routes ──────────────────────────────────────

const rosny2Checkpoints: PatrolCheckpoint[] = [
  { id: "cp-r1-1", name: "Entrée Nord", coords: [2.3502, 48.8576], type: "QR", expectedMinutes: 0, toleranceMinutes: 2, order: 1 },
  { id: "cp-r1-2", name: "Parking P2", coords: [2.3535, 48.8580], type: "NFC", expectedMinutes: 8, toleranceMinutes: 3, order: 2 },
  { id: "cp-r1-3", name: "Quai de livraison", coords: [2.3548, 48.8560], type: "GPS", expectedMinutes: 16, toleranceMinutes: 2, order: 3 },
  { id: "cp-r1-4", name: "Sortie Sud", coords: [2.3540, 48.8548], type: "QR", expectedMinutes: 24, toleranceMinutes: 3, order: 4 },
  { id: "cp-r1-5", name: "Zone technique", coords: [2.3515, 48.8550], type: "NFC", expectedMinutes: 32, toleranceMinutes: 2, order: 5 },
  { id: "cp-r1-6", name: "Retour Entrée Nord", coords: [2.3502, 48.8576], type: "QR", expectedMinutes: 42, toleranceMinutes: 3, order: 6 },
];

const defenseCheckpoints: PatrolCheckpoint[] = [
  { id: "cp-r2-1", name: "Accueil Tour A", coords: [2.2345, 48.8930], type: "NFC", expectedMinutes: 0, toleranceMinutes: 2, order: 1 },
  { id: "cp-r2-2", name: "Sous-sol Parking", coords: [2.2370, 48.8925], type: "QR", expectedMinutes: 7, toleranceMinutes: 3, order: 2 },
  { id: "cp-r2-3", name: "Esplanade Ouest", coords: [2.2385, 48.8935], type: "GPS", expectedMinutes: 15, toleranceMinutes: 2, order: 3 },
  { id: "cp-r2-4", name: "Terrasse Niveau 3", coords: [2.2360, 48.8940], type: "NFC", expectedMinutes: 24, toleranceMinutes: 3, order: 4 },
  { id: "cp-r2-5", name: "Retour Accueil", coords: [2.2345, 48.8930], type: "NFC", expectedMinutes: 33, toleranceMinutes: 2, order: 5 },
];

const gennevilliersCheckpoints: PatrolCheckpoint[] = [
  { id: "cp-r3-1", name: "Portail Principal", coords: [2.2960, 48.9340], type: "QR", expectedMinutes: 0, toleranceMinutes: 2, order: 1 },
  { id: "cp-r3-2", name: "Hangar A", coords: [2.2990, 48.9338], type: "NFC", expectedMinutes: 6, toleranceMinutes: 3, order: 2 },
  { id: "cp-r3-3", name: "Zone de stockage B", coords: [2.2995, 48.9325], type: "GPS", expectedMinutes: 14, toleranceMinutes: 2, order: 3 },
  { id: "cp-r3-4", name: "Retour Portail", coords: [2.2960, 48.9340], type: "QR", expectedMinutes: 22, toleranceMinutes: 3, order: 4 },
];

const serveursCheckpoints: PatrolCheckpoint[] = [
  { id: "cp-r4-1", name: "Sas d'entrée", coords: [2.2355, 48.8920], type: "NFC", expectedMinutes: 0, toleranceMinutes: 1, order: 1 },
  { id: "cp-r4-2", name: "Baie Serveurs A", coords: [2.2362, 48.8917], type: "NFC", expectedMinutes: 5, toleranceMinutes: 2, order: 2 },
  { id: "cp-r4-3", name: "Baie Serveurs B", coords: [2.2368, 48.8915], type: "NFC", expectedMinutes: 12, toleranceMinutes: 2, order: 3 },
];

export const mockPatrolRoutes: PatrolRoute[] = [
  {
    id: "route-1",
    name: "Ronde Extérieure Rosny 2",
    site: "Centre Commercial Rosny 2",
    checkpoints: rosny2Checkpoints,
    estimatedDurationMinutes: 45,
    frequency: "Quotidienne",
    distanceMeters: Math.round(computeRouteDistance(rosny2Checkpoints)),
    createdAt: "2026-01-10T08:00:00Z",
  },
  {
    id: "route-2",
    name: "Ronde Nocturne La Défense",
    site: "Siège Social La Défense",
    checkpoints: defenseCheckpoints,
    estimatedDurationMinutes: 35,
    frequency: "Nocturne",
    distanceMeters: Math.round(computeRouteDistance(defenseCheckpoints)),
    createdAt: "2026-01-15T14:00:00Z",
  },
  {
    id: "route-3",
    name: "Ronde Entrepôt Gennevilliers",
    site: "Entrepôt Logistique Gennevilliers",
    checkpoints: gennevilliersCheckpoints,
    estimatedDurationMinutes: 25,
    frequency: "Bi-quotidienne",
    distanceMeters: Math.round(computeRouteDistance(gennevilliersCheckpoints)),
    createdAt: "2026-02-01T10:00:00Z",
  },
  {
    id: "route-4",
    name: "Ronde Périmétrique Serveurs",
    site: "Siège Social La Défense",
    checkpoints: serveursCheckpoints,
    estimatedDurationMinutes: 15,
    frequency: "Hebdomadaire",
    distanceMeters: Math.round(computeRouteDistance(serveursCheckpoints)),
    createdAt: "2026-02-10T16:00:00Z",
  },
];

// ── Mock Data — Patrol Executions ──────────────────────────────────

const now = new Date();
const today = now.toISOString().slice(0, 10);

function isoAt(hoursAgo: number, minutesAgo = 0): string {
  return new Date(
    now.getTime() - (hoursAgo * 60 + minutesAgo) * 60000,
  ).toISOString();
}

export const mockPatrolExecutions: PatrolExecution[] = [
  // ── 1. En cours — Jean Dupont, Rosny 2, 4/6 checkpoints scanned
  {
    id: "exec-1",
    routeId: "route-1",
    routeName: "Ronde Extérieure Rosny 2",
    agentId: "1",
    agentName: "Jean Dupont",
    site: "Centre Commercial Rosny 2",
    status: "en-cours",
    startedAt: isoAt(0, 30),
    endedAt: null,
    checkpointScans: [
      { checkpointId: "cp-r1-1", scannedAt: isoAt(0, 30), status: "scanned" },
      { checkpointId: "cp-r1-2", scannedAt: isoAt(0, 22), status: "scanned" },
      { checkpointId: "cp-r1-3", scannedAt: isoAt(0, 14), status: "scanned" },
      { checkpointId: "cp-r1-4", scannedAt: isoAt(0, 6), status: "scanned" },
      { checkpointId: "cp-r1-5", scannedAt: null, status: "pending" },
      { checkpointId: "cp-r1-6", scannedAt: null, status: "pending" },
    ],
    gpsTrail: generateMockTrail(rosny2Checkpoints.slice(0, 5), {
      startTime: new Date(now.getTime() - 30 * 60000),
      pointsPerSegment: 4,
      deviationMeters: 8,
    }),
    completionRate: 67,
    actualDurationMinutes: null,
    actualDistanceMeters: null,
  },

  // ── 2. En cours — Marie Martin, La Défense, 2/5 checkpoints scanned
  {
    id: "exec-2",
    routeId: "route-2",
    routeName: "Ronde Nocturne La Défense",
    agentId: "2",
    agentName: "Marie Martin",
    site: "Siège Social La Défense",
    status: "en-cours",
    startedAt: isoAt(0, 15),
    endedAt: null,
    checkpointScans: [
      { checkpointId: "cp-r2-1", scannedAt: isoAt(0, 15), status: "scanned" },
      { checkpointId: "cp-r2-2", scannedAt: isoAt(0, 8), status: "scanned" },
      { checkpointId: "cp-r2-3", scannedAt: null, status: "pending" },
      { checkpointId: "cp-r2-4", scannedAt: null, status: "pending" },
      { checkpointId: "cp-r2-5", scannedAt: null, status: "pending" },
    ],
    gpsTrail: generateMockTrail(defenseCheckpoints.slice(0, 3), {
      startTime: new Date(now.getTime() - 15 * 60000),
      pointsPerSegment: 4,
      deviationMeters: 6,
    }),
    completionRate: 40,
    actualDurationMinutes: null,
    actualDistanceMeters: null,
  },

  // ── 3. Terminée — Lucas Moreau, Rosny 2, 100%
  {
    id: "exec-3",
    routeId: "route-1",
    routeName: "Ronde Extérieure Rosny 2",
    agentId: "5",
    agentName: "Lucas Moreau",
    site: "Centre Commercial Rosny 2",
    status: "terminee",
    startedAt: isoAt(3, 0),
    endedAt: isoAt(2, 12),
    checkpointScans: rosny2Checkpoints.map((cp) => ({
      checkpointId: cp.id,
      scannedAt: isoAt(3, -cp.expectedMinutes),
      status: "scanned" as const,
    })),
    gpsTrail: generateMockTrail(rosny2Checkpoints, {
      startTime: new Date(now.getTime() - 3 * 3600000),
      pointsPerSegment: 4,
      deviationMeters: 7,
    }),
    completionRate: 100,
    actualDurationMinutes: 48,
    actualDistanceMeters: Math.round(computeRouteDistance(rosny2Checkpoints) * 1.05),
  },

  // ── 4. Terminée — Camille Leroy, La Défense, 100%
  {
    id: "exec-4",
    routeId: "route-2",
    routeName: "Ronde Nocturne La Défense",
    agentId: "6",
    agentName: "Camille Leroy",
    site: "Siège Social La Défense",
    status: "terminee",
    startedAt: isoAt(5, 0),
    endedAt: isoAt(4, 22),
    checkpointScans: defenseCheckpoints.map((cp) => ({
      checkpointId: cp.id,
      scannedAt: isoAt(5, -cp.expectedMinutes),
      status: "scanned" as const,
    })),
    gpsTrail: generateMockTrail(defenseCheckpoints, {
      startTime: new Date(now.getTime() - 5 * 3600000),
      pointsPerSegment: 4,
      deviationMeters: 10,
    }),
    completionRate: 100,
    actualDurationMinutes: 38,
    actualDistanceMeters: Math.round(computeRouteDistance(defenseCheckpoints) * 1.08),
  },

  // ── 5. Terminée — Pierre Bernard, Gennevilliers, 80% (1 missed but still "terminee")
  {
    id: "exec-5",
    routeId: "route-3",
    routeName: "Ronde Entrepôt Gennevilliers",
    agentId: "3",
    agentName: "Pierre Bernard",
    site: "Entrepôt Logistique Gennevilliers",
    status: "terminee",
    startedAt: isoAt(6, 0),
    endedAt: isoAt(5, 32),
    checkpointScans: [
      { checkpointId: "cp-r3-1", scannedAt: isoAt(6, 0), status: "scanned" },
      { checkpointId: "cp-r3-2", scannedAt: isoAt(5, 54), status: "scanned" },
      { checkpointId: "cp-r3-3", scannedAt: null, status: "missed" },
      { checkpointId: "cp-r3-4", scannedAt: isoAt(5, 35), status: "scanned" },
    ],
    gpsTrail: generateMockTrail(
      [gennevilliersCheckpoints[0], gennevilliersCheckpoints[1], gennevilliersCheckpoints[3]],
      {
        startTime: new Date(now.getTime() - 6 * 3600000),
        pointsPerSegment: 4,
        deviationMeters: 12,
      },
    ),
    completionRate: 75,
    actualDurationMinutes: 28,
    actualDistanceMeters: Math.round(computeRouteDistance(gennevilliersCheckpoints) * 0.9),
  },

  // ── 6. Incomplète — Sophie Dubois, Gennevilliers, abandoned at 50%
  {
    id: "exec-6",
    routeId: "route-3",
    routeName: "Ronde Entrepôt Gennevilliers",
    agentId: "4",
    agentName: "Sophie Dubois",
    site: "Entrepôt Logistique Gennevilliers",
    status: "incomplete",
    startedAt: isoAt(8, 0),
    endedAt: isoAt(7, 45),
    checkpointScans: [
      { checkpointId: "cp-r3-1", scannedAt: isoAt(8, 0), status: "scanned" },
      { checkpointId: "cp-r3-2", scannedAt: isoAt(7, 54), status: "scanned" },
      { checkpointId: "cp-r3-3", scannedAt: null, status: "missed" },
      { checkpointId: "cp-r3-4", scannedAt: null, status: "missed" },
    ],
    gpsTrail: generateMockTrail(gennevilliersCheckpoints.slice(0, 2), {
      startTime: new Date(now.getTime() - 8 * 3600000),
      pointsPerSegment: 4,
      deviationMeters: 15,
    }),
    completionRate: 50,
    actualDurationMinutes: 15,
    actualDistanceMeters: Math.round(computeRouteDistance(gennevilliersCheckpoints.slice(0, 2)) * 1.1),
  },

  // ── 7. Incomplète — Jean Dupont, La Défense (yesterday), 60%
  {
    id: "exec-7",
    routeId: "route-4",
    routeName: "Ronde Périmétrique Serveurs",
    agentId: "1",
    agentName: "Jean Dupont",
    site: "Siège Social La Défense",
    status: "incomplete",
    startedAt: `${today}T02:00:00Z`,
    endedAt: `${today}T02:10:00Z`,
    checkpointScans: [
      { checkpointId: "cp-r4-1", scannedAt: `${today}T02:00:00Z`, status: "scanned" },
      { checkpointId: "cp-r4-2", scannedAt: `${today}T02:06:00Z`, status: "scanned" },
      { checkpointId: "cp-r4-3", scannedAt: null, status: "missed" },
    ],
    gpsTrail: generateMockTrail(serveursCheckpoints.slice(0, 2), {
      startTime: new Date(`${today}T02:00:00Z`),
      pointsPerSegment: 3,
      deviationMeters: 5,
    }),
    completionRate: 67,
    actualDurationMinutes: 10,
    actualDistanceMeters: Math.round(computeRouteDistance(serveursCheckpoints.slice(0, 2)) * 1.02),
  },

  // ── 8. Planifiée — Camille Leroy, La Défense, tonight
  {
    id: "exec-8",
    routeId: "route-2",
    routeName: "Ronde Nocturne La Défense",
    agentId: "6",
    agentName: "Camille Leroy",
    site: "Siège Social La Défense",
    status: "planifiee",
    startedAt: `${today}T22:00:00Z`,
    endedAt: null,
    checkpointScans: defenseCheckpoints.map((cp) => ({
      checkpointId: cp.id,
      scannedAt: null,
      status: "pending" as const,
    })),
    gpsTrail: [],
    completionRate: 0,
    actualDurationMinutes: null,
    actualDistanceMeters: null,
  },
];
