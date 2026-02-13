import type { Shift } from "./types";

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function setTime(d: Date, h: number, m: number) {
  const x = new Date(d);
  x.setHours(h, m, 0, 0);
  return x;
}

const today = new Date();

export const mockShifts: Shift[] = [
  {
    id: "s1",
    siteName: "Siège • Paris",
    startIso: setTime(today, 8, 0).toISOString(),
    endIso: setTime(today, 16, 0).toISOString(),
    breakMinutes: 30,
  },
  {
    id: "s2",
    siteName: "Siège • Paris",
    startIso: setTime(addDays(today, 1), 8, 0).toISOString(),
    endIso: setTime(addDays(today, 1), 16, 0).toISOString(),
    breakMinutes: 30,
  },
  {
    id: "s3",
    siteName: "Siège • Paris",
    startIso: setTime(addDays(today, 2), 14, 0).toISOString(),
    endIso: setTime(addDays(today, 2), 22, 0).toISOString(),
    breakMinutes: 30,
  },
  {
    id: "s4",
    siteName: "Siège • Paris",
    startIso: setTime(addDays(today, 3), 8, 0).toISOString(),
    endIso: setTime(addDays(today, 3), 16, 0).toISOString(),
    breakMinutes: 30,
  },
  {
    id: "s5",
    siteName: "Siège • Paris",
    startIso: setTime(addDays(today, 4), 8, 0).toISOString(),
    endIso: setTime(addDays(today, 4), 16, 0).toISOString(),
    breakMinutes: 30,
  },
];

