"use client";

import { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Battery, Clock } from "lucide-react";
import {
  mockGeolocationAgents,
  GeolocationAgent,
} from "@/data/geolocation-agents";

export default function LiveTrackingPage() {
  const [agents] = useState<GeolocationAgent[]>(mockGeolocationAgents);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<GeolocationAgent | null>(
    null
  );

  const columns: ColumnDef<GeolocationAgent>[] = [
    {
      key: "name",
      label: "Agent",
      sortable: true,
    },
    {
      key: "site",
      label: "Site",
      sortable: true,
    },
    {
      key: "status",
      label: "Statut",
      render: (agent) => (
        <Badge
          variant={
            agent.status === "En poste"
              ? "default"
              : agent.status === "En déplacement"
                ? "secondary"
                : "outline"
          }
        >
          {agent.status}
        </Badge>
      ),
    },
    {
      key: "speed",
      label: "Vitesse",
      render: (agent) => `${agent.speed} km/h`,
    },
    {
      key: "direction",
      label: "Direction",
      render: (agent) => `${agent.direction}°`,
    },
    {
      key: "battery",
      label: "Batterie",
      render: (agent) => (
        <div className="flex items-center gap-2">
          <Battery
            className={`h-4 w-4 ${agent.battery < 20 ? "text-red-500" : agent.battery < 50 ? "text-orange-500" : "text-green-500"}`}
          />
          <span>{agent.battery}%</span>
        </div>
      ),
    },
    {
      key: "lastUpdate",
      label: "Dernière MAJ",
      render: (agent) => {
        const diff = Date.now() - new Date(agent.lastUpdate).getTime();
        const minutes = Math.floor(diff / 60000);
        return minutes === 0
          ? "À l'instant"
          : `il y a ${minutes} min`;
      },
    },
  ];

  const handleRowClick = (agent: GeolocationAgent) => {
    setSelectedAgent(agent);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Suivi en Temps Réel</h1>
          <p className="text-muted-foreground">
            Localisation des agents toutes les X secondes
          </p>
        </div>
      </div>

      <DataTable
        data={agents}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Rechercher un agent..."
        onRowClick={handleRowClick}
      />

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails de localisation"
        size="lg"
        actions={{
          secondary: {
            label: "Fermer",
            onClick: () => setIsViewModalOpen(false),
          },
        }}
      >
        {selectedAgent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Agent</Label>
                <p className="text-sm font-medium">{selectedAgent.name}</p>
              </div>

              <div>
                <Label>Site</Label>
                <p className="text-sm font-medium">{selectedAgent.site}</p>
              </div>

              <div>
                <Label>Statut</Label>
                <Badge
                  variant={
                    selectedAgent.status === "En poste"
                      ? "default"
                      : selectedAgent.status === "En déplacement"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {selectedAgent.status}
                </Badge>
              </div>

              <div>
                <Label>Dernière mise à jour</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {new Date(selectedAgent.lastUpdate).toLocaleTimeString("fr-FR")}
                  </span>
                </div>
              </div>

              <div>
                <Label>Position</Label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {selectedAgent.latitude.toFixed(4)},{" "}
                    {selectedAgent.longitude.toFixed(4)}
                  </span>
                </div>
              </div>

              <div>
                <Label>Vitesse</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Navigation className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {selectedAgent.speed} km/h
                  </span>
                </div>
              </div>

              <div>
                <Label>Direction</Label>
                <p className="text-sm font-medium">{selectedAgent.direction}°</p>
              </div>

              <div>
                <Label>Batterie</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Battery
                    className={`h-4 w-4 ${selectedAgent.battery < 20 ? "text-red-500" : selectedAgent.battery < 50 ? "text-orange-500" : "text-green-500"}`}
                  />
                  <span className="text-sm font-medium">
                    {selectedAgent.battery}%
                  </span>
                </div>
              </div>
            </div>

            {selectedAgent.status !== "Hors ligne" && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Carte interactive de localisation disponible prochainement
                  (Google Maps / OpenStreetMap)
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

