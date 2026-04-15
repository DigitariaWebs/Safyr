import type { AgentShift, TimeOffRequest } from "@/lib/types";

export type ViewType = "daily" | "weekly" | "monthly";
export type ConflictType = "time_off" | "double_booking";

export interface DateConflict {
  type: ConflictType;
  severity: "high" | "medium";
  message: string;
  details?: TimeOffRequest | AgentShift;
}

export interface PendingPasteAction {
  type: "shift" | "week";
  agentId: string;
  dates: string[];
}

export interface ShiftContext {
  agentId: string;
  date: string;
}
