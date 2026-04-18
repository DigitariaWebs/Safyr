"use client";

import { AlertTriangle, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSOSStore } from "@/lib/stores/sosStore";

export function ImmobilityAlertCard() {
  const immobilityAlerts = useSOSStore((s) => s.immobilityAlerts);
  const threshold = useSOSStore((s) => s.immobilityThresholdMinutes);
  const setThreshold = useSOSStore((s) => s.setImmobilityThreshold);

  if (immobilityAlerts.length === 0) return null;

  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h3 className="text-lg font-semibold">
              Alertes d&apos;immobilit&eacute;
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Seuil</span>
            <Input
              type="number"
              min={1}
              max={120}
              value={threshold}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (v > 0) setThreshold(v);
              }}
              className="h-7 w-16 text-center text-xs"
            />
            <span className="text-xs text-muted-foreground">min</span>
          </div>
        </div>

        <div className="space-y-4">
          {immobilityAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{alert.agentName}</span>
                  <span className="text-sm text-muted-foreground">
                    {alert.site}
                  </span>
                </div>
                <p className="text-sm text-amber-400">
                  Immobile depuis {alert.durationMinutes} min
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled
                title="Fonctionnalité à venir"
              >
                <Phone className="mr-1 h-3 w-3" />
                Contacter l&apos;agent
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
