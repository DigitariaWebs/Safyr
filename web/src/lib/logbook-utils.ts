// No UI imports — only types
import type { LogbookEvent } from "@/data/logbook-events";
import type { Alert } from "@/data/logbook-alerts";

// Silence unused-import lint — types are part of the public API surface
export type { LogbookEvent, Alert };

export function getSeverityBadgeVariant(
  severity: string,
): "error" | "warning" | "success" | "muted" {
  switch (severity) {
    case "critical":
    case "high":
      return "error";
    case "medium":
      return "warning";
    case "low":
      return "success";
    default:
      return "muted";
  }
}

export function getStatusBadgeVariant(
  status: string,
): "success" | "info" | "warning" | "muted" {
  switch (status) {
    case "resolved":
      return "success";
    case "in_progress":
      return "info";
    case "pending":
      return "warning";
    case "deferred":
      return "muted";
    default:
      return "muted";
  }
}

export function getSeverityLabel(severity: string): string {
  switch (severity) {
    case "critical":
      return "Critique";
    case "high":
      return "Élevée";
    case "medium":
      return "Moyenne";
    case "low":
      return "Faible";
    default:
      return severity;
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "pending":
      return "En attente";
    case "in_progress":
      return "En cours";
    case "resolved":
      return "Résolu";
    case "deferred":
      return "Reporté";
    case "completed":
      return "Terminé";
    case "processing":
      return "En cours";
    case "failed":
      return "Échoué";
    default:
      return status;
  }
}

export function getSeverityDotColor(severity: string): string {
  switch (severity) {
    case "critical":
      return "bg-red-500";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-amber-400";
    case "low":
      return "bg-emerald-500";
    default:
      return "bg-slate-500";
  }
}

export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = then.getTime() - now.getTime();
  const isFuture = diffMs > 0;
  const absDiffMs = Math.abs(diffMs);
  const diffMin = Math.floor(absDiffMs / 60_000);
  const diffH = Math.floor(absDiffMs / 3_600_000);
  const diffJ = Math.floor(absDiffMs / 86_400_000);

  if (diffMin < 60) {
    return isFuture ? `Dans ${diffMin} min` : `Il y a ${diffMin} min`;
  } else if (diffH < 24) {
    return isFuture ? `Dans ${diffH}h` : `Il y a ${diffH}h`;
  } else {
    return isFuture ? `Dans ${diffJ}j` : `Il y a ${diffJ}j`;
  }
}
