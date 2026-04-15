"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  Ban,
  CalendarOff,
  Clipboard,
  Clock,
  Copy,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";

import type { AgentShift } from "@/lib/types";
import type { SiteColor } from "@/lib/site-colors";
import { getSiteColorClasses } from "@/lib/site-colors";
import { mockPostes } from "@/data/sites";
import type { DateConflict } from "./types";
import { ShiftCard } from "./ShiftCard";
import { summarizeAgentHours } from "./contract-utils";
import {
  inferPosteWindow,
  countPosteCoverage,
  getPosteRequirementForDay,
} from "./besoin-utils";

export function WeeklyView({
  dates,
  agents,
  shifts,
  allShifts,
  copiedShift,
  copiedWeekDates,
  copiedWeekAgentId,
  onCreateShift,
  onEditShift,
  onDeleteShift,
  onCopyShift,
  onPasteShift,
  onCopyWeek,
  onPasteWeek,
  onDeleteWeek,
  onConflictClick,
  getDateConflict,
  calculateAgentHours,
  onCustomizeShiftHours,
  isClosedDay,
  maxWeeklyWorkHours,
  selectedSiteId,
  siteColor,
}: {
  dates: Date[];
  agents: { agentId: string; agentName: string }[];
  shifts: AgentShift[];
  allShifts: AgentShift[];
  copiedShift: AgentShift | null;
  copiedWeekDates: string[] | null;
  copiedWeekAgentId: string | null;
  onCreateShift: (agentId: string, date: string) => void;
  onEditShift: (shift: AgentShift) => void;
  onDeleteShift: (shiftId: string) => void;
  onCopyShift: (shift: AgentShift) => void;
  onPasteShift: (agentId: string, date: string) => void;
  onCopyWeek: (agentId: string, dates: string[]) => void;
  onPasteWeek: (agentId: string, dates: string[]) => void;
  onDeleteWeek: (agentId: string, dates: string[]) => void;
  onConflictClick: (agentId: string, date: string) => void;
  getDateConflict: (agentId: string, date: string) => DateConflict | null;
  calculateAgentHours: (agentId: string, dates: Date[]) => number;
  onCustomizeShiftHours: (shift: AgentShift) => void;
  isClosedDay: (date: Date | string) => boolean;
  maxWeeklyWorkHours: number;
  selectedSiteId: string | null;
  siteColor: SiteColor;
}) {
  const colors = getSiteColorClasses(siteColor);
  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  const isDateInPast = (d: string | Date) => {
    const check = typeof d === "string" ? new Date(d) : d;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    check.setHours(0, 0, 0, 0);
    return check < today;
  };

  const weekDates = dates.map(formatDate);
  const showActions = true;
  const sitePostes = useMemo(
    () =>
      selectedSiteId
        ? mockPostes.filter((p) => p.siteId === selectedSiteId)
        : [],
    [selectedSiteId],
  );

  const MIN_COL_WIDTH = 100;
  const MIN_TOTAL = 224 + 8 + dates.length * (MIN_COL_WIDTH + 8) + 40;

  return (
    <div className="overflow-x-auto">
      {/* Header with dates as x-axis */}
      <div className="flex mb-4 gap-2" style={{ minWidth: `${MIN_TOTAL}px` }}>
        <div className="w-56 shrink-0" />
        <div className="flex-1 flex gap-2">
          {dates.map((date: Date, idx: number) => {
            return (
              <div
                key={idx}
                className="flex-1 text-center p-3 rounded-lg"
                style={{ minWidth: `${MIN_COL_WIDTH}px` }}
              >
                <div className="text-sm font-medium">
                  {date.toLocaleDateString("fr-FR", { weekday: "short" })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {date.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              </div>
            );
          })}
          <div className="w-10 shrink-0" />
        </div>
      </div>

      {/* Besoin rows — one per poste */}
      {sitePostes.length > 0 && (
        <div className="space-y-1 mb-3" style={{ minWidth: `${MIN_TOTAL}px` }}>
          {sitePostes.map((poste) => {
            const win = inferPosteWindow(poste);
            return (
              <div key={poste.id} className="flex items-stretch gap-2">
                <div
                  className={`w-56 shrink-0 px-3 py-1.5 rounded-md ${colors.bgMuted} flex items-center justify-between gap-2`}
                  title={poste.name}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-medium truncate">
                      {poste.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {win.start}–{win.end}
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex gap-2">
                  {dates.map((date) => {
                    const dateStr = formatDate(date);
                    const isClosed = isClosedDay(date);
                    const required = getPosteRequirementForDay(
                      poste,
                      date.getDay(),
                    );
                    const covered = countPosteCoverage(shifts, poste, dateStr);
                    const complete = covered >= required;
                    return (
                      <div
                        key={dateStr}
                        className={`flex-1 flex items-center justify-center rounded-md border ${isClosed ? "bg-muted/30 border-border/30" : complete ? "bg-green-500/5 border-green-500/30" : "bg-amber-500/5 border-amber-500/30"}`}
                        style={{ minWidth: `${MIN_COL_WIDTH}px` }}
                      >
                        {isClosed ? (
                          <span className="text-[10px] text-muted-foreground">
                            —
                          </span>
                        ) : required === 0 ? (
                          <span className="text-[10px] text-muted-foreground">
                            —
                          </span>
                        ) : (
                          <span
                            className={`text-xs font-medium ${complete ? "text-green-600" : "text-amber-600"}`}
                          >
                            {covered}/{required}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {dates.length >= 7 && <div className="w-12 shrink-0" />}
              </div>
            );
          })}
        </div>
      )}

      {/* Agent rows */}
      <div className="space-y-3" style={{ minWidth: `${MIN_TOTAL}px` }}>
        {agents.map(({ agentId, agentName }) => {
          const agentHours = calculateAgentHours(agentId, dates);
          const hasAnyShift = weekDates.some((date) =>
            shifts.find((s) => s.agentId === agentId && s.date === date),
          );

          const hasWeekConflicts = weekDates.some((date) => {
            const conflict = getDateConflict(agentId, date);
            return conflict !== null;
          });

          const showWeekPasteBlock =
            copiedWeekDates &&
            copiedWeekAgentId &&
            !hasAnyShift &&
            !hasWeekConflicts &&
            weekDates.every((d) => !isDateInPast(d));

          // Contract hours scoped to the visible week
          const hours = summarizeAgentHours(agentId, allShifts, dates);
          const overWeekly = agentHours > maxWeeklyWorkHours;
          const hoursTone = overWeekly || hours.isOver;

          return (
            <div key={agentId} className="flex items-stretch gap-2">
              <div className="w-56 shrink-0 p-3 bg-muted rounded-lg flex flex-col justify-center gap-1.5">
                <div className="font-medium text-sm">{agentName}</div>
                <div
                  className={`flex items-center gap-2 px-2 py-1 rounded-md ${hoursTone ? "bg-destructive/10" : "bg-primary/10"}`}
                >
                  <Clock
                    className={`h-3.5 w-3.5 ${hoursTone ? "text-destructive" : "text-primary"}`}
                  />
                  <span
                    className={`font-bold text-sm ${hoursTone ? "text-destructive" : "text-primary"}`}
                  >
                    {hours.planned.toFixed(1)}h
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    / {hours.contract.toFixed(1)}h
                  </span>
                </div>
                <div
                  className={`text-[10px] font-medium ${hours.isOver ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {hours.isOver
                    ? `+${Math.abs(hours.diff).toFixed(1)}h dépassement`
                    : `${hours.diff.toFixed(1)}h restantes`}
                </div>
              </div>

              <div className="flex-1 relative flex gap-2">
                {dates.map((date: Date, idx: number) => {
                  const dateStr = formatDate(date);
                  const shift = shifts.find(
                    (s) => s.agentId === agentId && s.date === dateStr,
                  );
                  const conflict = getDateConflict(agentId, dateStr);
                  const isClosed = isClosedDay(date);

                  return (
                    <div
                      key={idx}
                      className={`flex-1 border rounded-lg relative overflow-hidden ${
                        isClosed ? "bg-muted/30" : "bg-background"
                      } ${showWeekPasteBlock ? "invisible" : ""}`}
                      style={{
                        minWidth: `${MIN_COL_WIDTH}px`,
                        height: "120px",
                      }}
                    >
                      {shift ? (
                        <ShiftCard
                          shift={shift}
                          isClosed={isClosed}
                          onEdit={onEditShift}
                          onDelete={onDeleteShift}
                          onCopy={onCopyShift}
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
                      ) : isClosed ? (
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
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}

                {showWeekPasteBlock && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-primary/5 border-2 border-dashed border-primary rounded-lg cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => onPasteWeek(agentId, weekDates)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Clipboard className="h-6 w-6 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        Coller la semaine
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {showActions && (
                <div className="w-12 shrink-0 h-24 flex items-center justify-center bg-muted/50 rounded-lg">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-muted"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {hasAnyShift && (
                        <>
                          <DropdownMenuItem
                            onClick={() => onCopyWeek(agentId, weekDates)}
                          >
                            <Copy className="h-3 w-3 mr-2" />
                            Copier la semaine
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteWeek(agentId, weekDates)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-3 w-3 mr-2" />
                            Vider la semaine
                          </DropdownMenuItem>
                        </>
                      )}
                      {!hasAnyShift && (
                        <DropdownMenuItem
                          onClick={() => onDeleteWeek(agentId, weekDates)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Vider la semaine
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
