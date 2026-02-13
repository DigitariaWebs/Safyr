import type { TimeOffRequest } from "./types";

export const mockTimeOff: TimeOffRequest[] = [
  {
    id: "to_1",
    type: "paid",
    startIso: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    endIso: new Date(Date.now() + 9 * 24 * 3600 * 1000).toISOString(),
    reason: "Congé planifié",
    status: "approved",
    createdAtIso: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: "to_2",
    type: "other",
    startIso: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    endIso: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    reason: "Rendez-vous",
    status: "pending",
    createdAtIso: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
  },
];

