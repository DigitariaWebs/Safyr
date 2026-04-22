"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Ban,
  CalendarOff,
  Clipboard,
  Clock,
  Moon,
  Plus,
  X,
} from "lucide-react";

import type { AgentShift, Poste } from "@/lib/types";
import type { SiteColor } from "@/lib/site-colors";
import { getSiteColorClasses } from "@/lib/site-colors";
import type { DateConflict } from "./types";
import { ShiftBlock } from "./ShiftBlock";
import {
  inferPosteWindow,
  computeUncoveredIntervals,
  formatHourLabel,
  getPosteRequirementForDay,
} from "./besoin-utils";
import { summarizeAgentHours } from "./contract-utils";
import { AgentHoursCell } from "./AgentHoursCell";

export function DailyView({
  date,
  agents,
  shifts,
  allShifts,
  copiedShift,
  onCreateShift,
  onEditShift,
  onDeleteShift,
  onCopyShift,
  onPasteShift,
  onConflictClick,
  getDateConflict,
  getOvernightShift,
  calculateAgentHours,
  onRemoveAgent,
  onCustomizeShiftHours,
  isClosedDay,
  maxDailyWorkHours,
  sitePostes,
  siteColor,
}: {
  date: Date;
  agents: { agentId: string; agentName: string }[];
  shifts: AgentShift[];
  allShifts: AgentShift[];
  copiedShift: AgentShift | null;
  onCreateShift: (agentId: string, date: string) => void;
  onEditShift: (shift: AgentShift) => void;
  onDeleteShift: (shiftId: string) => void;
  onCopyShift: (shift: AgentShift) => void;
  onPasteShift: (agentId: string, date: string) => void;
  onConflictClick: (agentId: string, date: string) => void;
  getDateConflict: (agentId: string, date: string) => DateConflict | null;
  getOvernightShift: (agentId: string, date: string) => AgentShift | null;
  calculateAgentHours: (agentId: string, dates: Date[]) => number;
  onRemoveAgent: (agentId: string) => void;
  onCustomizeShiftHours: (shift: AgentShift) => void;
  isClosedDay: (date: Date | string) => boolean;
  maxDailyWorkHours: number;
  sitePostes: Poste[];
  siteColor: SiteColor;
}) {
  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  const dateStr = formatDate(date);

  const isClosed = isClosedDay(date);
  const colors = getSiteColorClasses(siteColor);

  return (
    <div>
      <div className="text-lg font-medium mb-4">
        {date.toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>

      {/* Besoin timeline — one bar per poste across 24h */}
      {sitePostes.length > 0 && !isClosed && (
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-56 shrink-0 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Besoins du jour
            </div>
            <div className="flex-1 flex text-[10px] text-muted-foreground">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="flex-1 text-center">
                  {i % 2 === 0 ? `${i}h` : ""}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            {sitePostes.map((poste) => {
              const win = inferPosteWindow(poste);
              const required = getPosteRequirementForDay(poste, date.getDay());
              if (required === 0) return null;
              const gaps = computeUncoveredIntervals(shifts, poste, dateStr);
              const complete = gaps.length === 0;
              const gapLabel = gaps
                .map(
                  (g) =>
                    `${formatHourLabel(g.start)}–${formatHourLabel(g.end)}`,
                )
                .join(", ");

              // Compute bar segments — overnight postes wrap past 00:00
              const startPct = (win.startHour / 24) * 100;
              const endPct = (win.endHour / 24) * 100;
              const wrapsMidnight = win.endHour > 24;
              const firstSegmentWidth = wrapsMidnight
                ? 100 - startPct
                : endPct - startPct;
              const secondSegmentWidth = wrapsMidnight
                ? ((win.endHour - 24) / 24) * 100
                : 0;

              return (
                <div key={poste.id} className="flex items-stretch gap-3">
                  <div className="w-56 shrink-0 px-2 py-1.5 rounded-md bg-muted/50 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate">
                        {poste.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {win.start}–{win.end}
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] shrink-0 ${complete ? "bg-green-500/15 text-green-600 border-green-500/30" : "bg-amber-500/15 text-amber-600 border-amber-500/30"}`}
                      title={complete ? "Besoin couvert" : gapLabel}
                    >
                      {complete ? "Affecter" : gapLabel || "—"}
                    </Badge>
                  </div>
                  <div className="flex-1 relative h-7 border rounded-md bg-background/50">
                    {/* First segment */}
                    <div
                      className={`absolute top-0 bottom-0 ${colors.bgMuted} border ${colors.border} rounded-md flex items-center px-2 gap-1 overflow-hidden`}
                      style={{
                        left: `${startPct}%`,
                        width: `${firstSegmentWidth}%`,
                      }}
                    >
                      <Clock className={`h-3 w-3 shrink-0 ${colors.text}`} />
                      <span
                        className={`text-[10px] font-medium truncate ${colors.text}`}
                      >
                        {win.start}–{win.end} · {required} requis
                      </span>
                    </div>
                    {/* Overnight wrap segment */}
                    {wrapsMidnight && secondSegmentWidth > 0 && (
                      <div
                        className={`absolute top-0 bottom-0 ${colors.bgMuted} border ${colors.border} rounded-md flex items-center px-1 overflow-hidden`}
                        style={{
                          left: `0%`,
                          width: `${secondSegmentWidth}%`,
                        }}
                        title={`Nuit précédente — ${poste.name}`}
                      >
                        <Moon className={`h-3 w-3 ${colors.text}`} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Timeline header */}
      <div className="flex mb-2">
        <div className="w-56 shrink-0" />
        <div className="flex-1 flex border-b">
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className="flex-1 text-center text-xs text-muted-foreground pb-1"
            >
              {i}h
            </div>
          ))}
        </div>
      </div>

      {/* Agent rows */}
      <div className="space-y-3">
        {agents.map(({ agentId, agentName }) => {
          const shift = shifts.find(
            (s) => s.agentId === agentId && s.date === dateStr,
          );
          const overnightShift = getOvernightShift(agentId, dateStr);
          const conflict = getDateConflict(agentId, dateStr);
          const agentHours = calculateAgentHours(agentId, [date]);
          const hours = summarizeAgentHours(agentId, allShifts, [date]);
          const overDaily = agentHours > maxDailyWorkHours;

          return (
            <div key={agentId} className="flex items-center gap-3">
              <div className="w-56 shrink-0 p-3 bg-muted rounded-lg group relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => onRemoveAgent(agentId)}
                  title="Retirer l'agent"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
                <div className="font-medium text-sm mb-2">{agentName}</div>
                <AgentHoursCell summary={hours} />
                {overDaily && (
                  <div className="mt-1 px-1.5 py-0.5 rounded bg-destructive/10 text-destructive text-[10px] font-medium text-center">
                    Dépassement journalier
                  </div>
                )}
              </div>

              <div className="flex-1 relative h-24 border rounded-lg bg-background">
                {/* 24-hour grid */}
                {Array.from({ length: 24 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 border-l border-dashed border-muted-foreground/20"
                    style={{ left: `${(i / 24) * 100}%` }}
                  />
                ))}

                {/* Overnight continuation from previous day */}
                {overnightShift && (
                  <div
                    className="absolute top-2 bottom-2 flex flex-col items-start justify-center text-xs font-medium cursor-pointer hover:shadow-md transition-all overflow-hidden"
                    style={{
                      left: "0%",
                      width: `${
                        (parseInt(overnightShift.endTime.split(":")[0]) / 24) *
                        100
                      }%`,
                      backgroundColor: overnightShift.color,
                      color: "#fff",
                      borderRadius: "0 0.5rem 0.5rem 0",
                    }}
                    onClick={() => onEditShift(overnightShift)}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/40" />
                    <div
                      className="absolute left-0 top-0 bottom-0 w-8 opacity-20"
                      style={{
                        background:
                          "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)",
                      }}
                    />
                    <div className="px-3 flex flex-col gap-1 relative z-10">
                      <div className="font-bold text-sm flex items-center gap-2">
                        <Moon className="h-3.5 w-3.5" />
                        {overnightShift.startTime} - {overnightShift.endTime}
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs h-5 bg-white/20 text-white border-0 w-fit"
                      >
                        Nuit précédente
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Current day shift */}
                {shift ? (
                  <ShiftBlock
                    shift={shift}
                    conflict={conflict}
                    isClosed={isClosedDay(dateStr)}
                    onEdit={onEditShift}
                    onDelete={onDeleteShift}
                    onCopy={onCopyShift}
                    onConflictClick={onConflictClick}
                    onCustomizeHours={onCustomizeShiftHours}
                  />
                ) : conflict?.type === "time_off" ? (
                  <button
                    onClick={() => onConflictClick(agentId, dateStr)}
                    className="absolute inset-2 flex items-center justify-center gap-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors border border-red-200"
                  >
                    <Ban className="h-4 w-4" />
                    <span className="text-sm font-medium">Congé</span>
                  </button>
                ) : conflict?.type === "double_booking" ? (
                  <button
                    onClick={() => onConflictClick(agentId, dateStr)}
                    disabled
                    className="absolute inset-2 flex items-center justify-center gap-2 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-300 cursor-not-allowed opacity-75"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Double affectation
                    </span>
                  </button>
                ) : isClosedDay(dateStr) ? (
                  <button
                    onClick={() =>
                      copiedShift
                        ? onPasteShift(agentId, dateStr)
                        : onCreateShift(agentId, dateStr)
                    }
                    className="absolute inset-2 flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-muted-foreground/20 text-muted-foreground/50 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-colors group"
                    title="Jour fermé — cliquer pour forcer l'ajout"
                  >
                    <CalendarOff className="h-4 w-4" />
                    <span className="text-xs">Fermé</span>
                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Forcer
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      copiedShift
                        ? onPasteShift(agentId, dateStr)
                        : onCreateShift(agentId, dateStr)
                    }
                    className="absolute inset-2 flex items-center justify-center gap-2 rounded-lg hover:bg-primary/10 transition-colors group border border-dashed border-muted-foreground/30"
                  >
                    {copiedShift ? (
                      <>
                        <Clipboard className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        <span className="text-sm text-muted-foreground group-hover:text-primary">
                          Coller
                        </span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        <span className="text-sm text-muted-foreground group-hover:text-primary">
                          Ajouter un Shift
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
