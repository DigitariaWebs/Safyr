"use client";

import { useMemo } from "react";
import { Clipboard, Plus } from "lucide-react";

import type { AgentShift, Poste } from "@/lib/types";
import type { SiteColor } from "@/lib/site-colors";
import { getSiteColorClasses } from "@/lib/site-colors";
import { summarizeAgentHours, type AgentHoursSummary } from "./contract-utils";
import { AgentHoursCell } from "./AgentHoursCell";

const DAY_LETTERS = ["D", "L", "M", "M", "J", "V", "S"];

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function isDateInPast(d: Date): boolean {
  const check = new Date(d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  check.setHours(0, 0, 0, 0);
  return check < today;
}

export function MonthlyView({
  dates,
  agents,
  shifts,
  allShifts,
  copiedShift,
  onCreateShift,
  onEditShift,
  onPasteShift,
  isClosedDay,
  siteColor,
  sitePostes,
}: {
  dates: Date[];
  weekGroups?: { dates: Date[]; startIdx: number }[];
  agents: { agentId: string; agentName: string }[];
  shifts: AgentShift[];
  allShifts: AgentShift[];
  copiedShift: AgentShift | null;
  onCreateShift: (agentId: string, date: string) => void;
  onEditShift: (shift: AgentShift) => void;
  onPasteShift: (agentId: string, date: string) => void;
  isClosedDay: (date: Date | string) => boolean;
  totalNeededPerDay?: number;
  siteColor: SiteColor;
  sitePostes: Poste[];
}) {
  const colors = getSiteColorClasses(siteColor);

  const gridTemplate = `180px repeat(${dates.length}, minmax(24px, 1fr))`;

  // Assigned agents per day (for per-poste besoin row fill display)
  const dayAssignedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    shifts.forEach((s) => {
      counts[s.date] = (counts[s.date] ?? 0) + 1;
    });
    return counts;
  }, [shifts]);

  const totalNeeded = sitePostes.reduce(
    (sum, p) => sum + (p.capacity?.minAgents ?? 0),
    0,
  );

  return (
    <div className="overflow-x-auto">
      <div
        className="grid gap-px min-w-fit text-xs"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {/* Header row: weekday letter + day number */}
        <div className="px-2 py-1 font-semibold text-muted-foreground">
          {dates[0]?.toLocaleDateString("fr-FR", {
            month: "long",
            year: "numeric",
          })}
        </div>
        {dates.map((d, i) => {
          const closed = isClosedDay(d);
          const past = isDateInPast(d);
          const isWeekend = d.getDay() === 0 || d.getDay() === 6;
          return (
            <div
              key={`h-${i}`}
              className={`text-center leading-tight py-0.5 ${closed || isWeekend ? "bg-muted/40" : ""} ${past ? "opacity-50" : ""}`}
            >
              <div className="text-[9px] text-muted-foreground">
                {DAY_LETTERS[d.getDay()]}
              </div>
              <div className="text-[11px] font-semibold">{d.getDate()}</div>
            </div>
          );
        })}

        {/* Besoin rows — one per poste */}
        {sitePostes.map((poste) => (
          <MonthBesoinRow
            key={poste.id}
            poste={poste}
            dates={dates}
            isClosedDay={isClosedDay}
            bgClass={colors.bgMuted}
          />
        ))}

        {/* Aggregate site coverage row */}
        {totalNeeded > 0 && (
          <>
            <div className="px-2 py-1 bg-muted/30 flex items-center text-[10px] font-semibold">
              Couverture
            </div>
            {dates.map((d, i) => {
              const dateStr = formatDate(d);
              const assigned = dayAssignedCounts[dateStr] ?? 0;
              const closed = isClosedDay(d);
              const ok = assigned >= totalNeeded;
              return (
                <div
                  key={`cov-${i}`}
                  className={`flex items-center justify-center text-[9px] ${closed ? "bg-muted/30 text-muted-foreground" : ok ? "text-green-600" : "text-amber-600"}`}
                >
                  {closed ? "—" : `${assigned}/${totalNeeded}`}
                </div>
              );
            })}
          </>
        )}

        {/* Agent rows */}
        {agents.map((agent) => {
          const hours = summarizeAgentHours(agent.agentId, allShifts, dates);

          return (
            <MonthAgentRow
              key={agent.agentId}
              agent={agent}
              hours={hours}
              dates={dates}
              shifts={shifts}
              copiedShift={copiedShift}
              onCreateShift={onCreateShift}
              onEditShift={onEditShift}
              onPasteShift={onPasteShift}
              isClosedDay={isClosedDay}
            />
          );
        })}

        {agents.length === 0 && (
          <div
            className="px-2 py-4 text-xs text-muted-foreground italic"
            style={{ gridColumn: `1 / -1` }}
          >
            Aucun agent affecté à ce site.
          </div>
        )}
      </div>
    </div>
  );
}

function MonthBesoinRow({
  poste,
  dates,
  isClosedDay,
  bgClass,
}: {
  poste: Poste;
  dates: Date[];
  isClosedDay: (d: Date | string) => boolean;
  bgClass: string;
}) {
  const minPerDay = poste.capacity?.minAgents ?? 0;
  return (
    <>
      <div
        className={`px-2 py-1 ${bgClass} flex items-center gap-1 text-[10px] font-medium truncate`}
        title={poste.name}
      >
        <span className="truncate">{poste.name}</span>
        <span className="text-muted-foreground shrink-0">· {minPerDay}/j</span>
      </div>
      {dates.map((d, i) => {
        const closed = isClosedDay(d);
        return (
          <div
            key={`b-${poste.id}-${i}`}
            className={`flex items-center justify-center text-[9px] ${closed ? "bg-muted/30 text-muted-foreground" : `${bgClass} text-foreground/70`}`}
          >
            {closed ? "" : minPerDay > 0 ? minPerDay : ""}
          </div>
        );
      })}
    </>
  );
}

function MonthAgentRow({
  agent,
  hours,
  dates,
  shifts,
  copiedShift,
  onCreateShift,
  onEditShift,
  onPasteShift,
  isClosedDay,
}: {
  agent: { agentId: string; agentName: string };
  hours: AgentHoursSummary;
  dates: Date[];
  shifts: AgentShift[];
  copiedShift: AgentShift | null;
  onCreateShift: (agentId: string, date: string) => void;
  onEditShift: (shift: AgentShift) => void;
  onPasteShift: (agentId: string, date: string) => void;
  isClosedDay: (d: Date | string) => boolean;
}) {
  return (
    <>
      {/* Sticky left: name + contract summary */}
      <div className="px-2 py-1 border-t border-border/50 bg-background flex flex-col justify-center gap-0.5">
        <div className="font-medium text-[11px] truncate">
          {agent.agentName}
        </div>
        <AgentHoursCell summary={hours} size="sm" />
      </div>

      {/* Day cells */}
      {dates.map((d, i) => {
        const dateStr = formatDate(d);
        const past = isDateInPast(d);
        const closed = isClosedDay(d);
        const dayShifts = shifts.filter(
          (s) => s.agentId === agent.agentId && s.date === dateStr,
        );

        return (
          <div
            key={`c-${agent.agentId}-${i}`}
            className={`border-t border-border/50 relative flex items-center justify-center group ${closed ? "bg-muted/30" : ""} ${past ? "opacity-50" : ""}`}
            style={{ minHeight: 24 }}
          >
            {dayShifts.length > 0 ? (
              <div className="flex flex-col items-stretch justify-center gap-px w-full px-0.5">
                {dayShifts.map((shift) => {
                  const compactHour = (t: string) => {
                    const [h, m] = t.split(":").map(Number);
                    return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}`;
                  };
                  const label = `${compactHour(shift.startTime)}-${compactHour(shift.endTime)}`;
                  return (
                    <button
                      key={shift.id}
                      onClick={() => onEditShift(shift)}
                      title={`${shift.startTime}–${shift.endTime}${shift.isSplit ? ` | ${shift.splitStartTime2}–${shift.splitEndTime2}` : ""} · ${agent.agentName}`}
                      className="text-[9px] leading-tight font-semibold rounded-sm px-0.5 py-px text-center text-white hover:ring-1 hover:ring-offset-0 hover:ring-primary/40 transition truncate"
                      style={{
                        backgroundColor: shift.color ?? "#6366f1",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            ) : !closed ? (
              <button
                onClick={() =>
                  copiedShift
                    ? onPasteShift(agent.agentId, dateStr)
                    : onCreateShift(agent.agentId, dateStr)
                }
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-primary/5"
                title={copiedShift ? "Coller" : "Ajouter un shift"}
              >
                {copiedShift ? (
                  <Clipboard className="h-2.5 w-2.5 text-primary" />
                ) : (
                  <Plus className="h-2.5 w-2.5 text-muted-foreground" />
                )}
              </button>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
