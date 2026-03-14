// ── Types ──────────────────────────────────────────────────────────

export type ZoneType =
  | "Site client"
  | "Zone sensible"
  | "Zone restreinte"
  | "Point de contrôle";

export type ZoneShape =
  | { kind: "circle"; center: [number, number]; radius: number } // [lng, lat], radius in meters
  | { kind: "polygon"; vertices: [number, number][] }; // [lng, lat] pairs

export interface ZoneAlertRules {
  entry: boolean;
  exit: boolean;
  absence: boolean;
  parking: boolean;
}

export interface GeoZone {
  id: string;
  name: string;
  type: ZoneType;
  site: string;
  color: string; // hex color
  shape: ZoneShape;
  alerts: ZoneAlertRules;
  createdAt: string; // ISO date
}

// ── Config ─────────────────────────────────────────────────────────

export const ZONE_TYPES: ZoneType[] = [
  "Site client",
  "Zone sensible",
  "Zone restreinte",
  "Point de contrôle",
];

export const ZONE_TYPE_COLORS: Record<ZoneType, string> = {
  "Site client": "#22d3ee",
  "Zone sensible": "#f59e0b",
  "Zone restreinte": "#ef4444",
  "Point de contrôle": "#a855f7",
};

export type ZoneTypeBadgeVariant = "cyan" | "warning" | "error" | "secondary";

export const ZONE_TYPE_BADGE: Record<ZoneType, ZoneTypeBadgeVariant> = {
  "Site client": "cyan",
  "Zone sensible": "warning",
  "Zone restreinte": "error",
  "Point de contrôle": "secondary",
};

export const ALERT_LABELS: { key: keyof ZoneAlertRules; label: string }[] = [
  { key: "entry", label: "Alerte entrée" },
  { key: "exit", label: "Alerte sortie" },
  { key: "absence", label: "Alerte absence programmée" },
  { key: "parking", label: "Alerte stationnement prolongé" },
];

// ── Geometry utilities (derived, not stored) ───────────────────────

/** Convert circle to polygon ring for rendering/calculations */
export function circleToPolygon(
  center: [number, number],
  radiusM: number,
  steps = 64,
): [number, number][] {
  const [lng, lat] = center;
  const points: [number, number][] = [];
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const dLat = (radiusM / 111320) * Math.cos(angle);
    const dLng =
      (radiusM / (111320 * Math.cos((lat * Math.PI) / 180))) * Math.sin(angle);
    points.push([lng + dLng, lat + dLat]);
  }
  points.push(points[0]);
  return points;
}

/** Ensure a polygon ring is closed (first === last vertex) */
export function ensureClosedRing(
  vertices: [number, number][],
): [number, number][] {
  if (vertices.length === 0) return vertices;
  const first = vertices[0];
  const last = vertices[vertices.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    return [...vertices, first];
  }
  return vertices;
}

/** Flat-earth distance between two [lng, lat] points in meters */
export function flatEarthDistance(a: [number, number], b: [number, number]): number {
  const [lng1, lat1] = a;
  const [lng2, lat2] = b;
  const dLat = (lat2 - lat1) * 111320;
  const dLng = (lng2 - lng1) * 111320 * Math.cos(((lat1 + lat2) / 2) * (Math.PI / 180));
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

/** Compute zone area in m² using the shoelace formula on projected coordinates */
export function computeZoneArea(shape: ZoneShape): number {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius * shape.radius;
  }
  // Shoelace formula on flat-earth projected coordinates
  const verts = shape.vertices;
  const refLat = verts[0][1];
  const cosLat = Math.cos((refLat * Math.PI) / 180);
  let area = 0;
  for (let i = 0; i < verts.length; i++) {
    const j = (i + 1) % verts.length;
    const xi = verts[i][0] * 111320 * cosLat;
    const yi = verts[i][1] * 111320;
    const xj = verts[j][0] * 111320 * cosLat;
    const yj = verts[j][1] * 111320;
    area += xi * yj - xj * yi;
  }
  return Math.abs(area) / 2;
}

/** Compute zone perimeter in meters */
export function computeZonePerimeter(shape: ZoneShape): number {
  if (shape.kind === "circle") {
    return 2 * Math.PI * shape.radius;
  }
  const verts = shape.vertices;
  let perimeter = 0;
  for (let i = 0; i < verts.length; i++) {
    const j = (i + 1) % verts.length;
    perimeter += flatEarthDistance(verts[i], verts[j]);
  }
  return perimeter;
}

/** Format area for display: m² if < 10000, otherwise ha */
export function formatArea(areaM2: number): string {
  if (areaM2 < 10000) return `${Math.round(areaM2)} m²`;
  return `${(areaM2 / 10000).toFixed(2)} ha`;
}

/** Format perimeter for display: m if < 1000, otherwise km */
export function formatPerimeter(perimeterM: number): string {
  if (perimeterM < 1000) return `${Math.round(perimeterM)} m`;
  return `${(perimeterM / 1000).toFixed(2)} km`;
}

// ── Mock Data ──────────────────────────────────────────────────────

export const mockGeolocationZones: GeoZone[] = [
  {
    id: "zone-1",
    name: "Zone Nord — Rosny 2",
    type: "Site client",
    site: "Centre Commercial Rosny 2",
    color: "#22d3ee",
    shape: {
      kind: "circle",
      center: [2.3522, 48.8566],
      radius: 300,
    },
    alerts: { entry: true, exit: true, absence: true, parking: false },
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "zone-2",
    name: "Périmètre La Défense",
    type: "Zone sensible",
    site: "Siège Social La Défense",
    color: "#f59e0b",
    shape: {
      kind: "polygon",
      vertices: [
        [2.2330, 48.8900],
        [2.2400, 48.8940],
        [2.2420, 48.8910],
        [2.2380, 48.8880],
        [2.2340, 48.8885],
      ],
    },
    alerts: { entry: true, exit: true, absence: false, parking: true },
    createdAt: "2026-01-20T14:30:00Z",
  },
  {
    id: "zone-3",
    name: "Entrepôt Gennevilliers",
    type: "Site client",
    site: "Entrepôt Logistique Gennevilliers",
    color: "#10b981",
    shape: {
      kind: "circle",
      center: [2.2978, 48.9333],
      radius: 200,
    },
    alerts: { entry: false, exit: true, absence: true, parking: false },
    createdAt: "2026-02-01T09:00:00Z",
  },
  {
    id: "zone-4",
    name: "Zone Restreinte Serveurs",
    type: "Zone restreinte",
    site: "Siège Social La Défense",
    color: "#ef4444",
    shape: {
      kind: "polygon",
      vertices: [
        [2.2355, 48.8920],
        [2.2370, 48.8920],
        [2.2370, 48.8912],
        [2.2355, 48.8912],
      ],
    },
    alerts: { entry: true, exit: true, absence: false, parking: false },
    createdAt: "2026-02-10T16:00:00Z",
  },
  {
    id: "zone-5",
    name: "Checkpoint Ronde A",
    type: "Point de contrôle",
    site: "Centre Commercial Rosny 2",
    color: "#a855f7",
    shape: {
      kind: "circle",
      center: [2.3490, 48.8580],
      radius: 50,
    },
    alerts: { entry: true, exit: false, absence: false, parking: false },
    createdAt: "2026-02-15T11:00:00Z",
  },
];
