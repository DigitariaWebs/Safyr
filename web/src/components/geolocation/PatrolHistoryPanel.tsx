"use client";

import { useMemo } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  MessageSquare,
  Pause,
  Play,
  User,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef, FilterDef } from "@/components/ui/DataTable";
import type { PatrolExecution } from "@/data/geolocation-patrols";
import { PATROL_STATUS_CONFIG } from "@/data/geolocation-patrols";
import { cn } from "@/lib/utils";

// ── Props ───────────────────────────────────────────────────────────

interface PatrolHistoryPanelProps {
  executions: PatrolExecution[];
  selectedExecutionId: string | null;
  onSelectExecution: (id: string) => void;
  replayProgress: number;
  onReplayProgressChange: (progress: number) => void;
  isReplaying: boolean;
  onToggleReplay: () => void;
}

// ── Helpers ─────────────────────────────────────────────────────────

function formatFrenchDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatFrenchDateTime(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDistance(meters: number | null): string {
  if (meters === null) return "—";
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${meters} m`;
}

// ── Column definitions ──────────────────────────────────────────────

const historyColumns: ColumnDef<PatrolExecution>[] = [
  {
    key: "startedAt",
    label: "Date",
    render: (item) => (
      <span className="text-xs">{formatFrenchDate(item.startedAt)}</span>
    ),
    sortValue: (item) => new Date(item.startedAt).getTime(),
  },
  {
    key: "agentName",
    label: "Agent",
    render: (item) => (
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400 shrink-0">
          <User className="h-3 w-3" />
        </div>
        <span className="text-xs">{item.agentName}</span>
      </div>
    ),
  },
  {
    key: "routeName",
    label: "Itinéraire",
    render: (item) => <span className="text-xs">{item.routeName}</span>,
  },
  {
    key: "actualDurationMinutes",
    label: "Durée",
    render: (item) => (
      <span className="text-xs">
        {item.actualDurationMinutes !== null
          ? `${item.actualDurationMinutes} min`
          : "—"}
      </span>
    ),
    sortValue: (item) => item.actualDurationMinutes ?? 0,
  },
  {
    key: "completionRate",
    label: "Taux",
    render: (item) => (
      <span
        className={cn(
          "text-xs font-semibold",
          item.completionRate >= 80
            ? "text-emerald-400"
            : item.completionRate >= 50
              ? "text-amber-400"
              : "text-red-400",
        )}
      >
        {item.completionRate}%
      </span>
    ),
    sortValue: (item) => item.completionRate,
  },
  {
    key: "actualDistanceMeters",
    label: "Distance",
    render: (item) => (
      <span className="text-xs">
        {formatDistance(item.actualDistanceMeters)}
      </span>
    ),
    sortValue: (item) => item.actualDistanceMeters ?? 0,
  },
  {
    key: "status",
    label: "Statut",
    render: (item) => {
      const config = PATROL_STATUS_CONFIG[item.status];
      return (
        <Badge
          variant={config.badgeVariant}
          className="text-[10px] px-1.5 py-0"
        >
          {config.label}
        </Badge>
      );
    },
  },
];

const historyFilters: FilterDef[] = [
  {
    key: "status",
    label: "Statut",
    options: [
      { value: "all", label: "Tous" },
      { value: "terminee", label: "Terminée" },
      { value: "incomplete", label: "Incomplète" },
    ],
  },
];

// ── Component ───────────────────────────────────────────────────────

export function PatrolHistoryPanel({
  executions,
  selectedExecutionId,
  onSelectExecution,
  replayProgress,
  onReplayProgressChange,
  isReplaying,
  onToggleReplay,
}: PatrolHistoryPanelProps) {
  // Only show completed/incomplete executions in history
  const historyExecutions = useMemo(
    () =>
      executions.filter(
        (e) => e.status === "terminee" || e.status === "incomplete",
      ),
    [executions],
  );

  const selectedExecution = useMemo(
    () => executions.find((e) => e.id === selectedExecutionId) ?? null,
    [executions, selectedExecutionId],
  );

  // ── Replay detail view ────────────────────────────────────────────

  if (selectedExecution) {
    const statusConfig = PATROL_STATUS_CONFIG[selectedExecution.status];
    const scannedCount = selectedExecution.checkpointScans.filter(
      (s) => s.status === "validated",
    ).length;
    const missedCount = selectedExecution.checkpointScans.filter(
      (s) => s.status === "missed",
    ).length;
    const totalCount = selectedExecution.checkpointScans.length;

    return (
      <div className="flex flex-col h-full min-h-0">
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Back button */}
          <button
            onClick={() => onSelectExecution("")}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour à l&apos;historique
          </button>

          {/* Execution summary */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400 shrink-0">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold">{selectedExecution.agentName}</p>
              <p className="text-[10px] text-muted-foreground">
                {selectedExecution.routeName}
              </p>
            </div>
            <Badge
              variant={statusConfig.badgeVariant}
              className="ml-auto text-[10px] px-1.5 py-0"
            >
              {statusConfig.label}
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-border/50 bg-muted/30 p-2.5">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Date
              </div>
              <div className="text-xs font-semibold">
                {formatFrenchDateTime(selectedExecution.startedAt)}
              </div>
            </div>
            <div className="rounded-lg border border-border/50 bg-muted/30 p-2.5">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Durée
              </div>
              <div className="text-xs font-semibold">
                {selectedExecution.actualDurationMinutes !== null
                  ? `${selectedExecution.actualDurationMinutes} min`
                  : "—"}
              </div>
            </div>
            <div className="rounded-lg border border-border/50 bg-muted/30 p-2.5">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Distance
              </div>
              <div className="text-xs font-semibold">
                {formatDistance(selectedExecution.actualDistanceMeters)}
              </div>
            </div>
          </div>

          {/* Completion rate */}
          <div className="rounded-lg border border-border/50 bg-muted/30 p-2.5">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">
              Taux de complétion
            </div>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "text-lg font-bold",
                  selectedExecution.completionRate >= 80
                    ? "text-emerald-400"
                    : selectedExecution.completionRate >= 50
                      ? "text-amber-400"
                      : "text-red-400",
                )}
              >
                {selectedExecution.completionRate}%
              </span>
              <div className="flex-1 h-2 rounded-full bg-muted/50 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    selectedExecution.completionRate >= 80
                      ? "bg-emerald-500"
                      : selectedExecution.completionRate >= 50
                        ? "bg-amber-500"
                        : "bg-red-500",
                  )}
                  style={{
                    width: `${selectedExecution.completionRate}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Checkpoint scan summary */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-muted-foreground">
                {scannedCount} validés
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <XCircle className="h-3.5 w-3.5 text-red-400" />
              <span className="text-muted-foreground">
                {missedCount} manqués
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">{totalCount} total</span>
            </div>
          </div>

          {/* Replay controls */}
          <div className="rounded-lg border border-border/50 bg-muted/20 p-3 space-y-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Rejouer le trajet
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 shrink-0"
                onClick={onToggleReplay}
              >
                {isReplaying ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
              </Button>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(replayProgress * 100)}
                onChange={(e) =>
                  onReplayProgressChange(Number(e.target.value) / 100)
                }
                className="flex-1 h-1.5 accent-cyan-500"
              />
              <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">
                {Math.round(replayProgress * 100)}%
              </span>
            </div>
          </div>

          {/* Checkpoint detail with comments */}
          {selectedExecution.checkpointScans.some((s) => s.comment) && (
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">
                Détail des points
              </div>
              <div className="relative pl-4 space-y-3">
                <div
                  className="absolute left-[7px] top-1 bottom-1 w-px bg-border/50"
                  aria-hidden="true"
                />
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
                      <div
                        className={cn(
                          "absolute -left-4 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-background shrink-0 z-10",
                          dotColor,
                        )}
                        aria-hidden="true"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">
                            Point {index + 1}
                          </span>
                          <Badge
                            variant={
                              scan.status === "validated"
                                ? "success"
                                : scan.status === "missed"
                                  ? "error"
                                  : "muted"
                            }
                            className="text-[9px] px-1 py-0"
                          >
                            {scan.status === "validated"
                              ? "Validé"
                              : scan.status === "missed"
                                ? "Manqué"
                                : "En attente"}
                          </Badge>
                        </div>
                        {scan.comment && (
                          <div className="flex items-start gap-1.5">
                            <MessageSquare className="h-3 w-3 text-muted-foreground/60 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                              {scan.comment}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Table view ────────────────────────────────────────────────────

  return (
    <div
      className="flex flex-col h-full min-h-0"
      role="region"
      aria-label="Historique des rondes"
    >
      <div className="p-3 border-b border-border/50">
        <h2 className="text-sm font-bold">Historique des rondes</h2>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {historyExecutions.length} ronde
          {historyExecutions.length > 1 ? "s" : ""} terminée
          {historyExecutions.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex-1 overflow-auto p-3">
        <DataTable
          data={historyExecutions}
          columns={historyColumns}
          filters={historyFilters}
          getSearchValue={(item) =>
            `${item.agentName} ${item.routeName} ${item.site}`
          }
          searchPlaceholder="Rechercher…"
          itemsPerPage={10}
          getRowId={(item) => item.id}
          onRowClick={(item) => onSelectExecution(item.id)}
        />
      </div>
    </div>
  );
}
