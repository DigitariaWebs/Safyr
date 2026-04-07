"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Clock, MessageSquare, Route, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PatrolExecution } from "@/data/geolocation-patrols";
import { PATROL_STATUS_CONFIG } from "@/data/geolocation-patrols";
import { cn } from "@/lib/utils";

// ── Props ───────────────────────────────────────────────────────────

interface PatrolExecutionSidebarProps {
  executions: PatrolExecution[];
  selectedExecutionId: string | null;
  onSelectExecution: (id: string) => void;
  sidebarView: "list" | "detail" | "form";
  onBackToList: () => void;
  onUpdateCheckpointComment?: (
    executionId: string,
    checkpointId: string,
    comment: string,
  ) => void;
}

// ── Helpers ─────────────────────────────────────────────────────────

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getElapsedMinutes(startedAt: string): number {
  return Math.round((Date.now() - new Date(startedAt).getTime()) / 60000);
}

// ── Component ───────────────────────────────────────────────────────

export function PatrolExecutionSidebar({
  executions,
  selectedExecutionId,
  onSelectExecution,
  sidebarView,
  onBackToList,
  onUpdateCheckpointComment,
}: PatrolExecutionSidebarProps) {
  // Only show active + planned executions in this tab
  const activeExecutions = useMemo(
    () =>
      executions.filter(
        (e) => e.status === "en-cours" || e.status === "planifiee",
      ),
    [executions],
  );

  const selectedExecution = useMemo(
    () => executions.find((e) => e.id === selectedExecutionId) ?? null,
    [executions, selectedExecutionId],
  );

  // Local comment state, reset when selected execution changes
  const [localComments, setLocalComments] = useState<Record<string, string>>(
    {},
  );
  const [prevExecutionId, setPrevExecutionId] = useState<string | null>(null);

  if (selectedExecutionId !== prevExecutionId) {
    setPrevExecutionId(selectedExecutionId);
    const initial: Record<string, string> = {};
    if (selectedExecution) {
      for (const scan of selectedExecution.checkpointScans) {
        if (scan.comment) initial[scan.checkpointId] = scan.comment;
      }
    }
    setLocalComments(initial);
  }

  // ── Detail view ──────────────────────────────────────────────────

  if (sidebarView === "detail" && selectedExecution) {
    const statusConfig = PATROL_STATUS_CONFIG[selectedExecution.status];
    const scannedCount = selectedExecution.checkpointScans.filter(
      (s) => s.status === "validated",
    ).length;
    const totalCount = selectedExecution.checkpointScans.length;
    const progressPercent =
      totalCount > 0 ? Math.round((scannedCount / totalCount) * 100) : 0;

    return (
      <div className="flex flex-col h-full min-h-0">
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-4">
            {/* Back button */}
            <button
              onClick={onBackToList}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour
            </button>

            {/* Agent + site */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400 shrink-0">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold">
                  {selectedExecution.agentName}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {selectedExecution.site}
                </p>
              </div>
            </div>

            {/* Route + frequency */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {selectedExecution.routeName}
              </span>
              <Badge
                variant={statusConfig.badgeVariant}
                className="text-[10px] px-1.5 py-0"
              >
                {statusConfig.label}
              </Badge>
            </div>

            {/* Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">
                  {scannedCount}/{totalCount} points validés
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {progressPercent}%
                </span>
              </div>
              <div className="h-3 rounded-full bg-muted/50 overflow-hidden">
                <div
                  className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Duration info */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>Démarré à {formatTime(selectedExecution.startedAt)}</span>
              {selectedExecution.status === "en-cours" && (
                <>
                  <span className="text-muted-foreground/60">·</span>
                  <span>
                    {getElapsedMinutes(selectedExecution.startedAt)} min
                    écoulées
                  </span>
                </>
              )}
            </div>

            {/* Checkpoint timeline */}
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">
                Progression des points
              </div>
              <div className="relative pl-4">
                {/* Vertical connecting line */}
                <div
                  className="absolute left-[7px] top-1 bottom-1 w-px bg-border/50"
                  aria-hidden="true"
                />

                <div className="space-y-3">
                  {selectedExecution.checkpointScans.map((scan, index) => {
                    const dotColor =
                      scan.status === "validated"
                        ? "bg-emerald-500"
                        : scan.status === "missed"
                          ? "bg-red-500"
                          : "bg-slate-500";

                    return (
                      <div
                        key={scan.checkpointId}
                        className="relative flex items-start gap-3"
                      >
                        {/* Dot */}
                        <div
                          className={cn(
                            "absolute -left-4 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-background shrink-0 z-10",
                            dotColor,
                          )}
                          aria-hidden="true"
                        />

                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium truncate">
                              Point {index + 1}
                            </span>
                            {scan.status === "validated" && (
                              <Badge
                                variant="success"
                                className="text-[9px] px-1 py-0"
                              >
                                Validé
                              </Badge>
                            )}
                            {scan.status === "missed" && (
                              <Badge
                                variant="error"
                                className="text-[9px] px-1 py-0"
                              >
                                Manqué
                              </Badge>
                            )}
                            {scan.status === "pending" && (
                              <Badge
                                variant="muted"
                                className="text-[9px] px-1 py-0"
                              >
                                En attente
                              </Badge>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground">
                            {scan.status === "validated" && scan.scannedAt
                              ? `Validé à ${formatTime(scan.scannedAt)}`
                              : scan.status === "missed"
                                ? "Manqué"
                                : "En attente"}
                          </p>
                          {scan.status === "missed" && (
                            <div className="flex items-start gap-1.5">
                              <MessageSquare className="h-3 w-3 text-muted-foreground/60 shrink-0 mt-1.5" />
                              <textarea
                                rows={2}
                                placeholder="Ajouter une observation…"
                                value={localComments[scan.checkpointId] ?? ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setLocalComments((prev) => ({
                                    ...prev,
                                    [scan.checkpointId]: value,
                                  }));
                                  onUpdateCheckpointComment?.(
                                    selectedExecution.id,
                                    scan.checkpointId,
                                    value,
                                  );
                                }}
                                className="flex-1 rounded-md border border-border/50 bg-muted/30 px-2 py-1 text-[10px] text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-cyan-500/40 transition-colors"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────────────

  return (
    <div
      className="flex flex-col h-full"
      role="region"
      aria-label="Rondes en cours"
    >
      <div className="p-3 border-b border-border/50">
        <h2 className="text-sm font-bold">Rondes en cours</h2>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {activeExecutions.length} ronde
          {activeExecutions.length > 1 ? "s" : ""} active
          {activeExecutions.length > 1 ? "s" : ""}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <ul className="p-2 space-y-1 list-none">
          {activeExecutions.length === 0 ? (
            <li className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <Route className="h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                Aucune ronde en cours
              </p>
            </li>
          ) : (
            activeExecutions.map((exec) => {
              const isSelected = selectedExecutionId === exec.id;
              const statusConfig = PATROL_STATUS_CONFIG[exec.status];
              const scannedCount = exec.checkpointScans.filter(
                (s) => s.status === "validated",
              ).length;
              const totalCount = exec.checkpointScans.length;
              const progressPercent =
                totalCount > 0
                  ? Math.round((scannedCount / totalCount) * 100)
                  : 0;

              return (
                <li key={exec.id}>
                  <button
                    onClick={() => onSelectExecution(exec.id)}
                    className={cn(
                      "w-full text-left rounded-lg border p-2.5 transition-all duration-150 cursor-pointer",
                      isSelected
                        ? "border-cyan-500/40 bg-cyan-500/5"
                        : "border-border/60 hover:border-border hover:bg-muted/30",
                    )}
                    aria-current={isSelected ? "true" : undefined}
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400 shrink-0">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">
                          {exec.agentName}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {exec.routeName}
                        </p>
                      </div>
                      <Badge
                        variant={statusConfig.badgeVariant}
                        className="shrink-0 text-[10px] px-1.5 py-0"
                      >
                        {statusConfig.label}
                      </Badge>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">
                          {scannedCount} / {totalCount} points
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatTime(exec.startedAt)}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </ScrollArea>
    </div>
  );
}
