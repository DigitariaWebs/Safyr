"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/modal";

type Alert = {
  id: string;
  type: "critical" | "warning";
  title: string;
  description: string;
  timestamp: string;
  site: string;
};

export default function AlertsPage() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingAlert, setViewingAlert] = useState<Alert | null>(null);

  const alerts: Alert[] = [
    {
      id: "1",
      type: "critical",
      title: "Détection incendie - Zone Technique",
      description: "Alarme incendie déclenchée",
      timestamp: "2024-12-24T14:00:00Z",
      site: "Centre Commercial Atlantis",
    },
    {
      id: "2",
      type: "warning",
      title: "Ronde manquée - Niveau -2",
      description: "Ronde de 18h non effectuée",
      timestamp: "2024-12-24T18:15:00Z",
      site: "Tour de Bureaux Skyline",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-light tracking-tight">
          Alertes actives
        </h1>
        <p className="mt-2 text-sm font-light text-muted-foreground">
          {alerts.length} alerte(s) nécessitant votre attention
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {alerts.map((alert) => (
          <Card
            key={alert.id}
            className="glass-card border-border/40 hover:border-primary/30 transition-all cursor-pointer"
            onClick={() => {
              setViewingAlert(alert);
              setIsViewModalOpen(true);
            }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    className={`h-5 w-5 ${alert.type === "critical" ? "text-red-500" : "text-orange-500"}`}
                  />
                  <CardTitle className="text-xl font-light">
                    {alert.title}
                  </CardTitle>
                </div>
                <Badge
                  variant={
                    alert.type === "critical" ? "destructive" : "default"
                  }
                >
                  {alert.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {alert.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">{alert.site}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {new Date(alert.timestamp).toLocaleString("fr-FR")}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Alert Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails de l'alerte"
        size="lg"
      >
        {viewingAlert && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Badge
                  variant={
                    viewingAlert.type === "critical" ? "destructive" : "default"
                  }
                >
                  {viewingAlert.type}
                </Badge>
              </div>
              <div>
                <Label>Date/Heure</Label>
                <p className="text-sm">
                  {new Date(viewingAlert.timestamp).toLocaleString("fr-FR")}
                </p>
              </div>
            </div>

            <div>
              <Label>Titre</Label>
              <p className="text-sm font-medium">{viewingAlert.title}</p>
            </div>

            <div>
              <Label>Description</Label>
              <p className="text-sm">{viewingAlert.description}</p>
            </div>

            <div>
              <Label>Site</Label>
              <p className="text-sm">{viewingAlert.site}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

