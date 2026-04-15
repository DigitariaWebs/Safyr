import type { AgentShift } from "@/lib/types";
import { mockPlanningAgents } from "@/data/planning-agents";

/**
 * Hours worked in a single shift, accounting for break + optional split.
 */
export function shiftHours(s: AgentShift): number {
  const [sh, sm] = s.startTime.split(":").map(Number);
  const [eh, em] = s.endTime.split(":").map(Number);
  let mins = eh * 60 + em - (sh * 60 + sm);
  if (mins < 0) mins += 24 * 60;
  mins -= s.breakDuration;
  let total = Math.max(0, mins);
  if (s.isSplit && s.splitStartTime2 && s.splitEndTime2) {
    const [s2h, s2m] = s.splitStartTime2.split(":").map(Number);
    const [e2h, e2m] = s.splitEndTime2.split(":").map(Number);
    let mins2 = e2h * 60 + e2m - (s2h * 60 + s2m);
    if (mins2 < 0) mins2 += 24 * 60;
    mins2 -= s.splitBreakDuration ?? 0;
    total += Math.max(0, mins2);
  }
  return total / 60;
}

/**
 * Look up an agent's weekly contract reference. `contractHours` in our mock
 * data is stored as a weekly value (35, 39 for standard French contracts).
 */
export function getAgentWeeklyContract(agentId: string): number {
  const agent = mockPlanningAgents.find((a) => a.id === agentId);
  return agent?.contractHours ?? agent?.weeklyHours ?? 35;
}

/**
 * Contract hours pro-rated across the visible period.
 * Uses `weeklyContract × (days / 7)` so every view (day=1, week=7, month≈30)
 * scales proportionally.
 */
export function getAgentContractForView(
  agentId: string,
  dates: Date[],
): number {
  const weekly = getAgentWeeklyContract(agentId);
  return (weekly * dates.length) / 7;
}

/**
 * Total planned hours for an agent across the visible dates.
 */
export function getAgentPlannedForView(
  agentId: string,
  shifts: AgentShift[],
  dates: Date[],
): number {
  const visible = new Set(dates.map((d) => d.toISOString().split("T")[0]));
  return shifts
    .filter((s) => s.agentId === agentId && visible.has(s.date))
    .reduce((sum, s) => sum + shiftHours(s), 0);
}

export interface AgentHoursSummary {
  contract: number;
  planned: number;
  diff: number; // positive = remaining, negative = overbooked
  isOver: boolean;
}

export function summarizeAgentHours(
  agentId: string,
  shifts: AgentShift[],
  dates: Date[],
): AgentHoursSummary {
  const contract = getAgentContractForView(agentId, dates);
  const planned = getAgentPlannedForView(agentId, shifts, dates);
  const diff = contract - planned;
  return {
    contract,
    planned,
    diff,
    isOver: diff < 0,
  };
}
