"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SOSEvent } from "@/data/geolocation-sos";
import { SOS_STATUS_CONFIG } from "@/data/geolocation-sos";
import { useSOSStore } from "@/lib/stores/sosStore";
import { cn, getInitials } from "@/lib/utils";

import { SOSDismissDialog } from "./SOSDismissDialog";

function formatTimeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return `il y a ${hours}h${minutes % 60 > 0 ? ` ${minutes % 60}min` : ""}`;
}

function AlertBannerItem({ alert }: { alert: SOSEvent }) {
  const [dismissDialogOpen, setDismissDialogOpen] = useState(false);
  const acknowledgeAlert = useSOSStore((s) => s.acknowledgeAlert);
  const dispatchHelp = useSOSStore((s) => s.dispatchHelp);
  const escalateHR = useSOSStore((s) => s.escalateHR);

  const isActive = alert.status === "active";
  const status = SOS_STATUS_CONFIG[alert.status];
  const showAcknowledge =
    alert.status !== "acknowledged" &&
    alert.status !== "dispatched" &&
    alert.status !== "escalated";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          "w-full rounded-lg border border-red-500/30 bg-red-500/10 p-4",
          isActive && "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]",
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          {/* Left: Avatar + pulse indicator */}
          <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-center sm:gap-1">
            <div className="relative flex size-10 items-center justify-center rounded-full bg-red-500/20 text-sm font-semibold text-red-400">
              {getInitials(alert.agentName)}
              {isActive && (
                <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-red-500 motion-safe:animate-ping" />
              )}
            </div>
            <ShieldAlert className="size-4 text-red-400" />
          </div>

          {/* Middle: Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate font-semibold text-white">
                {alert.agentName}
              </span>
              {status && (
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                    status.className,
                  )}
                >
                  {status.label}
                </span>
              )}
            </div>
            <div className="text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm">
              <span>{alert.site}</span>
              <span>
                {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
              </span>
              <span suppressHydrationWarning>
                {formatTimeAgo(alert.triggeredAt)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {showAcknowledge && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => acknowledgeAlert(alert.id)}
              >
                <CheckCircle2 />
                Accusé de réception
              </Button>
            )}
            <Button
              size="sm"
              variant="destructive"
              disabled={
                alert.status === "dispatched" || alert.status === "escalated"
              }
              onClick={() => dispatchHelp(alert.id)}
            >
              <AlertTriangle />
              Envoyer secours
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={alert.status === "escalated"}
              onClick={() => escalateHR(alert.id)}
            >
              <ArrowUpRight />
              Escalader RH
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setDismissDialogOpen(true)}
            >
              <X />
              Fermer
            </Button>
          </div>
        </div>
      </motion.div>

      <SOSDismissDialog
        sosId={alert.id}
        open={dismissDialogOpen}
        onOpenChange={setDismissDialogOpen}
      />
    </>
  );
}

export function SOSAlertBanner() {
  const activeAlerts = useSOSStore((s) => s.activeAlerts);

  if (activeAlerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {activeAlerts.map((alert) => (
          <AlertBannerItem key={alert.id} alert={alert} />
        ))}
      </AnimatePresence>
    </div>
  );
}
