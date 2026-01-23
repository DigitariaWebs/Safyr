import type { Shift } from "./types";

export function minutesBetween(startIso: string, endIso: string) {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  return Math.max(0, Math.round((end - start) / 60000));
}

export function workedMinutesForShift(shift: Shift) {
  const total = minutesBetween(shift.startIso, shift.endIso);
  return Math.max(0, total - (shift.breakMinutes ?? 0));
}

export function formatHours(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${m.toString().padStart(2, "0")}`;
}

