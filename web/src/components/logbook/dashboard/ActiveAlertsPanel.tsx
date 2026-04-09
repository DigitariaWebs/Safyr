"use client";

import {
  Flame,
  ShieldAlert,
  Heart,
  AlertTriangle,
  Clock,
  CheckCircle,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { mockAlerts } from "@/data/logbook-alerts";
import type { AlertType } from "@/data/logbook-alerts";
import {
  getSeverityBadgeVariant,
  formatRelativeTime,
} from "@/lib/logbook-utils";

interface ActiveAlertsPanelProps {
  isLoading: boolean;
}

const SEVERITY_LABELS: Record<string, string> = {
  critical: "Critique",
  high: "Haute",
  medium: "Moyenne",
  low: "Basse",
};

function AlertTypeIcon({ type }: { type: AlertType }) {
  const cls = "h-4 w-4 shrink-0";
  switch (type) {
    case "incendie":
      return <Flame className={cls} />;
    case "effraction":
      return <ShieldAlert className={cls} />;
    case "critique_medical":
      return <Heart className={cls} />;
    case "grave_incident":
      return <AlertTriangle className={cls} />;
    case "absence_ronde":
      return <Clock className={cls} />;
    default:
      return <Activity className={cls} />;
  }
}

export function ActiveAlertsPanel({ isLoading }: ActiveAlertsPanelProps) {
  const activeAlerts = mockAlerts.filter(
    (a) => a.status === "active" || a.status === "acknowledged",
  );
  const resolvedCount = mockAlerts.filter(
    (a) => a.status === "resolved" || a.status === "closed",
  ).length;

  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            Alertes actives
          </CardTitle>
          <Link
            href="/dashboard/logbook/alerts"
            className="text-xs text-primary hover:underline"
          >
            Voir tout
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {activeAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
            <span className="text-sm">Aucune alerte active</span>
          </div>
        ) : (
          activeAlerts.map((alert) => (
            <Link
              key={alert.id}
              href="/dashboard/logbook/alerts"
              className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <span className="mt-0.5 text-muted-foreground">
                <AlertTypeIcon type={alert.type} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{alert.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {alert.site}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                  {SEVERITY_LABELS[alert.severity] ?? alert.severity}
                </Badge>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {formatRelativeTime(alert.timestamp)}
                </span>
              </div>
            </Link>
          ))
        )}

        {/* Summary footer */}
        <p className="text-xs text-muted-foreground pt-2 border-t border-border/40">
          {activeAlerts.length} active{activeAlerts.length !== 1 ? "s" : ""}{" "}
          &middot; {resolvedCount} resolue{resolvedCount !== 1 ? "s" : ""}
        </p>
      </CardContent>
    </Card>
  );
}
