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
 * Monthly contract hours for an agent. Mock data stores weekly contract
 * (e.g. 35h) — convert to legal monthly equivalent: weekly × 52 / 12.
 * A 35h weekly contract yields 151.67h/month.
 */
export function getAgentMonthlyContract(agentId: string): number {
  return (getAgentWeeklyContract(agentId) * 52) / 12;
}

/**
 * Total planned hours for an agent within the month containing `reference`.
 * View-agnostic — always month-scoped so agents show 151.67h/contract
 * and cumulative affected hours in day, week, and month views.
 */
export function getAgentPlannedForMonth(
  agentId: string,
  shifts: AgentShift[],
  reference: Date,
): number {
  const year = reference.getFullYear();
  const month = reference.getMonth();
  return shifts
    .filter((s) => {
      if (s.agentId !== agentId) return false;
      const d = new Date(s.date + "T00:00:00");
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .reduce((sum, s) => sum + shiftHours(s), 0);
}

export interface AgentHoursSummary {
  contract: number;
  planned: number;
  diff: number; // positive = remaining, negative = overbooked
  isOver: boolean;
}

/**
 * Always returns a month-scoped summary: contract = monthly (151.67h for 35h
 * weekly), planned = month-to-date affected hours from `shifts`. `dates` is
 * used only to pick the reference month (first element).
 */
export function summarizeAgentHours(
  agentId: string,
  shifts: AgentShift[],
  dates: Date[],
): AgentHoursSummary {
  const reference = dates[0] ?? new Date();
  const contract = getAgentMonthlyContract(agentId);
  const planned = getAgentPlannedForMonth(agentId, shifts, reference);
  const diff = contract - planned;
  return {
    contract,
    planned,
    diff,
    isOver: diff < 0,
  };
}
