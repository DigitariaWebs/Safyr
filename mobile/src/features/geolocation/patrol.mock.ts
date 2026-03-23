import { haversineMeters } from "./geo.utils";
import type {
  PatrolCheckpoint,
  PatrolRoute,
  ScheduledPatrol,
} from "./patrol.types";

// ── Utility ────────────────────────────────────────────────────────

/** Sum of haversine distances between consecutive checkpoints (meters). */
export function computeRouteDistance(checkpoints: PatrolCheckpoint[]): number {
  let total = 0;
  for (let i = 0; i < checkpoints.length - 1; i++) {
    const [lngA, latA] = checkpoints[i].coords;
    const [lngB, latB] = checkpoints[i + 1].coords;
    total += haversineMeters(
      { latitude: latA, longitude: lngA },
      { latitude: latB, longitude: lngB },
    );
  }
  return Math.round(total);
}

// ── Mock Routes ────────────────────────────────────────────────────
// Coordinates near existing mockWorkZones (Paris area)

export const mockPatrolRoutes: PatrolRoute[] = [
  {
    id: "route-opera",
    name: "Ronde Périmétrique Opéra",
    site: "Site Opéra",
    checkpoints: [
      {
        id: "cp-opera-1",
        name: "Entrée principale",
        coords: [2.3319, 48.87],
        type: "QR",
        expectedMinutes: 0,
        toleranceMinutes: 3,
        order: 1,
      },
      {
        id: "cp-opera-2",
        name: "Parking souterrain",
        coords: [2.333, 48.8695],
        type: "NFC",
        expectedMinutes: 8,
        toleranceMinutes: 3,
        order: 2,
      },
      {
        id: "cp-opera-3",
        name: "Accès livraison",
        coords: [2.3345, 48.8705],
        type: "GPS",
        expectedMinutes: 15,
        toleranceMinutes: 5,
        order: 3,
      },
      {
        id: "cp-opera-4",
        name: "Toiture technique",
        coords: [2.3312, 48.871],
        type: "QR",
        expectedMinutes: 22,
        toleranceMinutes: 3,
        order: 4,
      },
      {
        id: "cp-opera-5",
        name: "Retour entrée",
        coords: [2.332, 48.8701],
        type: "QR",
        expectedMinutes: 30,
        toleranceMinutes: 3,
        order: 5,
      },
    ],
    estimatedDurationMinutes: 30,
    frequency: "Quotidienne",
    distanceMeters: 0, // computed below
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "route-defense",
    name: "Ronde Nocturne La Défense",
    site: "La Défense",
    checkpoints: [
      {
        id: "cp-def-1",
        name: "Hall principal",
        coords: [2.236, 48.892],
        type: "QR",
        expectedMinutes: 0,
        toleranceMinutes: 3,
        order: 1,
      },
      {
        id: "cp-def-2",
        name: "Niveau -2 Parking",
        coords: [2.2375, 48.8915],
        type: "NFC",
        expectedMinutes: 10,
        toleranceMinutes: 5,
        order: 2,
      },
      {
        id: "cp-def-3",
        name: "Terrasse panoramique",
        coords: [2.235, 48.893],
        type: "GPS",
        expectedMinutes: 20,
        toleranceMinutes: 5,
        order: 3,
      },
      {
        id: "cp-def-4",
        name: "Local technique",
        coords: [2.2368, 48.8925],
        type: "NFC",
        expectedMinutes: 28,
        toleranceMinutes: 3,
        order: 4,
      },
    ],
    estimatedDurationMinutes: 35,
    frequency: "Nocturne",
    distanceMeters: 0,
    createdAt: "2026-02-01T14:00:00Z",
  },
  {
    id: "route-bastille",
    name: "Ronde Express Bastille",
    site: "Bastille",
    checkpoints: [
      {
        id: "cp-bast-1",
        name: "Portail est",
        coords: [2.3694, 48.8533],
        type: "QR",
        expectedMinutes: 0,
        toleranceMinutes: 3,
        order: 1,
      },
      {
        id: "cp-bast-2",
        name: "Zone de stockage",
        coords: [2.3705, 48.854],
        type: "GPS",
        expectedMinutes: 6,
        toleranceMinutes: 3,
        order: 2,
      },
      {
        id: "cp-bast-3",
        name: "Bureau sécurité",
        coords: [2.3685, 48.8535],
        type: "NFC",
        expectedMinutes: 12,
        toleranceMinutes: 3,
        order: 3,
      },
      {
        id: "cp-bast-4",
        name: "Retour portail",
        coords: [2.3693, 48.8532],
        type: "QR",
        expectedMinutes: 18,
        toleranceMinutes: 3,
        order: 4,
      },
    ],
    estimatedDurationMinutes: 20,
    frequency: "Bi-quotidienne",
    distanceMeters: 0,
    createdAt: "2026-02-20T09:00:00Z",
  },
];

// Compute distances from checkpoints
for (const route of mockPatrolRoutes) {
  route.distanceMeters = computeRouteDistance(route.checkpoints);
}

// ── Scheduled Patrols (for home screen reminders) ──────────────────

const today = new Date();
const todayStr = today.toISOString().slice(0, 10);

export const mockScheduledPatrols: ScheduledPatrol[] = [
  {
    id: "sched-1",
    routeId: "route-opera",
    routeName: "Ronde Périmétrique Opéra",
    site: "Site Opéra",
    scheduledAt: `${todayStr}T10:00:00`,
    checkpointCount: 5,
    estimatedDurationMinutes: 30,
  },
  {
    id: "sched-2",
    routeId: "route-bastille",
    routeName: "Ronde Express Bastille",
    site: "Bastille",
    scheduledAt: `${todayStr}T14:00:00`,
    checkpointCount: 4,
    estimatedDurationMinutes: 20,
  },
  {
    id: "sched-3",
    routeId: "route-defense",
    routeName: "Ronde Nocturne La Défense",
    site: "La Défense",
    scheduledAt: `${todayStr}T22:00:00`,
    checkpointCount: 4,
    estimatedDurationMinutes: 35,
  },
];
