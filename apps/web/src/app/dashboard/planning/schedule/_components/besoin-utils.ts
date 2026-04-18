import type { AgentShift, Poste } from "@/lib/types";

export type PosteWindow = {
  start: string; // "HH:mm"
  end: string; // "HH:mm"
  startHour: number; // 0-24 decimal
  endHour: number; // 0-24 decimal (may be > 24 for overnight)
  durationHours: number;
};

/**
 * Derive a poste's daily time window from its schedule flags. Postes don't
 * carry explicit start/end in the current model — we infer from nightShift +
 * defaultShiftDuration. Night shifts start at 22:00; day shifts at 06:00.
 */
export function inferPosteWindow(poste: Poste): PosteWindow {
  const duration = poste.schedule.defaultShiftDuration ?? 8;
  const startHour = poste.schedule.nightShift ? 22 : 6;
  const endRaw = startHour + duration;
  const endHour = endRaw % 24;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return {
    start: `${pad(startHour)}:00`,
    end: `${pad(endHour)}:00`,
    startHour,
    endHour: endRaw, // keep >24 for rendering overnight bars
    durationHours: duration,
  };
}

/**
 * Compute overlap in hours between a shift's [startTime, endTime] interval
 * and a poste's inferred window. Handles overnight shifts/postes by treating
 * time as a linear axis that can exceed 24h.
 */
function overlapHours(
  shiftStart: string,
  shiftEnd: string,
  posteStart: number,
  posteEnd: number,
): number {
  const [sh, sm] = shiftStart.split(":").map(Number);
  const [eh, em] = shiftEnd.split(":").map(Number);
  const sStart = sh + sm / 60;
  let sEnd = eh + em / 60;
  if (sEnd <= sStart) sEnd += 24; // overnight shift

  const pStart = posteStart;
  let pEnd = posteEnd;
  if (pEnd <= pStart) pEnd += 24;

  const ovStart = Math.max(sStart, pStart);
  const ovEnd = Math.min(sEnd, pEnd);
  return Math.max(0, ovEnd - ovStart);
}

/**
 * Count how many shifts on `dateStr` substantially cover `poste`'s window.
 * A shift counts if it overlaps more than half of the poste's duration.
 */
export function countPosteCoverage(
  shifts: AgentShift[],
  poste: Poste,
  dateStr: string,
): number {
  const win = inferPosteWindow(poste);
  const minOverlap = Math.max(1, win.durationHours / 2);

  return shifts.filter((s) => {
    if (s.date !== dateStr) return false;
    const o = overlapHours(s.startTime, s.endTime, win.startHour, win.endHour);
    return o >= minOverlap;
  }).length;
}

/**
 * Requirement count for a poste on a given weekday (0 = Sunday).
 * Uses dailyRequirements if present, else falls back to capacity.minAgents.
 */
export function getPosteRequirementForDay(
  poste: Poste,
  dayOfWeek: number,
): number {
  const req = poste.dailyRequirements;
  if (!req) return poste.capacity?.minAgents ?? 0;
  const map: Array<keyof NonNullable<typeof req>> = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  return req[map[dayOfWeek]] ?? poste.capacity?.minAgents ?? 0;
}
