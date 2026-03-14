import type { GeolocationAgent } from "./geolocation-agents";
import type { GeoZone } from "./geolocation-zones";
import { isPointInZone, distanceToZone } from "./geolocation-zones";

// ── Types ──────────────────────────────────────────────────────────

export type PresenceStatus = "present" | "late" | "absent" | "off-zone";

export interface ShiftAssignment {
  id: string;
  agentId: string;
  agentName: string;
  siteName: string;
  zoneId: string;
  shiftStart: string; // HH:mm
  shiftEnd: string; // HH:mm
  date: string; // YYYY-MM-DD
}

export interface PresenceRecord extends ShiftAssignment {
  status: PresenceStatus;
  lastSeenAt: string | null;
  lastLatitude: number | null;
  lastLongitude: number | null;
  distanceFromZone: number | null;
  anomalies: string[];
}

// ── Status config ──────────────────────────────────────────────────

type PresenceBadgeVariant = "success" | "warning" | "error";

export const PRESENCE_STATUS_CONFIG: Record<
  PresenceStatus,
  { label: string; dotClass: string; badgeVariant: PresenceBadgeVariant; badgeClassName?: string; avatarClass: string; ringClass: string; color: string }
> = {
  present: {
    label: "Présent",
    dotClass: "bg-emerald-500",
    badgeVariant: "success",
    avatarClass: "bg-emerald-500/20 text-emerald-400",
    ringClass: "ring-emerald-500/50",
    color: "#10b981",
  },
  late: {
    label: "En retard",
    dotClass: "bg-yellow-500",
    badgeVariant: "warning",
    avatarClass: "bg-yellow-500/20 text-yellow-400",
    ringClass: "ring-yellow-500/50",
    color: "#eab308",
  },
  absent: {
    label: "Absent",
    dotClass: "bg-red-500",
    badgeVariant: "error",
    avatarClass: "bg-red-500/20 text-red-400",
    ringClass: "ring-red-500/50",
    color: "#ef4444",
  },
  "off-zone": {
    label: "Hors zone",
    dotClass: "bg-orange-500",
    badgeVariant: "warning",
    badgeClassName: "border-orange-500/30 bg-orange-500/10 text-orange-400",
    avatarClass: "bg-orange-500/20 text-orange-400",
    ringClass: "ring-orange-500/50",
    color: "#f97316",
  },
};

export const PRESENCE_STATUSES: PresenceStatus[] = [
  "present",
  "late",
  "absent",
  "off-zone",
];

// ── Mock shift data ────────────────────────────────────────────────

function localDateStr(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getMockShiftAssignments(targetDate?: string): ShiftAssignment[] {
  const date = targetDate ?? localDateStr();
  return [
    {
      id: "shift-1",
      agentId: "1",
      agentName: "Jean Dupont",
      siteName: "Centre Commercial Rosny 2",
      zoneId: "zone-1",
      shiftStart: "06:00",
      shiftEnd: "14:00",
      date,
    },
    {
      id: "shift-2",
      agentId: "2",
      agentName: "Marie Martin",
      siteName: "Siège Social La Défense",
      zoneId: "zone-2",
      shiftStart: "07:00",
      shiftEnd: "15:00",
      date,
    },
    {
      id: "shift-3",
      agentId: "3",
      agentName: "Pierre Bernard",
      siteName: "Entrepôt Logistique Gennevilliers",
      zoneId: "zone-3",
      shiftStart: "06:00",
      shiftEnd: "14:00",
      date,
    },
    {
      id: "shift-4",
      agentId: "4",
      agentName: "Sophie Dubois",
      siteName: "Entrepôt Logistique Gennevilliers",
      zoneId: "zone-3",
      shiftStart: "06:00",
      shiftEnd: "14:00",
      date,
    },
    {
      id: "shift-5",
      agentId: "5",
      agentName: "Lucas Moreau",
      siteName: "Centre Commercial Rosny 2",
      zoneId: "zone-1",
      shiftStart: "05:00",
      shiftEnd: "13:00",
      date,
    },
    {
      id: "shift-6",
      agentId: "6",
      agentName: "Camille Leroy",
      siteName: "Siège Social La Défense",
      zoneId: "zone-2",
      shiftStart: "08:00",
      shiftEnd: "16:00",
      date,
    },
    {
      id: "shift-7",
      agentId: "1",
      agentName: "Jean Dupont",
      siteName: "Centre Commercial Rosny 2",
      zoneId: "zone-1",
      shiftStart: "18:00",
      shiftEnd: "02:00",
      date,
    },
    {
      id: "shift-8",
      agentId: "3",
      agentName: "Pierre Bernard",
      siteName: "Entrepôt Logistique Gennevilliers",
      zoneId: "zone-3",
      shiftStart: "18:00",
      shiftEnd: "02:00",
      date,
    },
  ];
}

// ── Presence computation ───────────────────────────────────────────

const LATE_TOLERANCE_MIN = 15;

function parseShiftTime(date: string, time: string): Date {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
}

export function computePresenceRecords(
  shifts: ShiftAssignment[],
  agents: GeolocationAgent[],
  zones: GeoZone[],
  referenceTime?: Date,
): PresenceRecord[] {
  const now = referenceTime ?? new Date();

  return shifts.map((shift) => {
    const agent = agents.find((a) => a.id === shift.agentId);
    const zone = zones.find((z) => z.id === shift.zoneId);

    const shiftStart = parseShiftTime(shift.date, shift.shiftStart);
    const shiftEnd = parseShiftTime(shift.date, shift.shiftEnd);
    // Handle overnight shifts
    if (shiftEnd <= shiftStart) shiftEnd.setDate(shiftEnd.getDate() + 1);

    const isActive = now >= shiftStart && now <= shiftEnd;
    const hasNotStarted = now < shiftStart;

    const base: PresenceRecord = {
      ...shift,
      status: "present",
      lastSeenAt: agent?.lastUpdate ?? null,
      lastLatitude: agent?.latitude ?? null,
      lastLongitude: agent?.longitude ?? null,
      distanceFromZone: null,
      anomalies: [],
    };

    // Shift hasn't started yet
    if (hasNotStarted) {
      base.status = "present";
      base.anomalies = [];
      return base;
    }

    // No agent data found
    if (!agent) {
      base.status = "absent";
      base.anomalies.push("Agent introuvable dans le système");
      return base;
    }

    // Agent is offline during active shift
    if (agent.status === "Hors ligne" && isActive) {
      base.status = "absent";
      const offlineMinutes = Math.round(
        (now.getTime() - new Date(agent.lastUpdate).getTime()) / 60000,
      );
      base.anomalies.push(
        `Aucun signal GPS depuis ${offlineMinutes} min`,
      );
      return base;
    }

    // No zone to check against
    if (!zone) {
      base.status = "present";
      return base;
    }

    // Check GPS position against zone
    const agentPoint: [number, number] = [agent.longitude, agent.latitude];
    const inZone = isPointInZone(agentPoint, zone.shape);

    if (inZone) {
      // Check if agent's first GPS signal came after the late tolerance
      const agentLastUpdate = new Date(agent.lastUpdate);
      const lateThreshold = new Date(
        shiftStart.getTime() + LATE_TOLERANCE_MIN * 60000,
      );

      if (isActive && agentLastUpdate.getTime() > lateThreshold.getTime()) {
        const lateMinutes = Math.round(
          (agentLastUpdate.getTime() - shiftStart.getTime()) / 60000,
        );
        base.status = "late";
        base.anomalies.push(`Retard de ${lateMinutes} min`);
      } else {
        base.status = "present";
      }
    } else {
      // Agent is outside the zone
      base.status = "off-zone";
      const dist = Math.round(distanceToZone(agentPoint, zone.shape));
      base.distanceFromZone = dist;
      base.anomalies.push(`GPS hors zone assignée (${dist} m)`);
    }

    return base;
  });
}
