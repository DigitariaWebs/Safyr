"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  MapPin,
} from "lucide-react";
import { mockLogbookEvents } from "@/data/logbook-events";

interface PlanningConnection {
  id: string;
  agentId: string;
  agentName: string;
  siteId: string;
  siteName: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  status: "scheduled" | "present" | "absent" | "late";
  canCreateEvent: boolean;
  reason?: string;
}

interface RHTransmission {
  id: string;
  eventId: string;
  eventTitle: string;
  agentId: string;
  agentName: string;
  type: "incident" | "explication" | "eloge" | "accident_travail" | "disciplinaire";
  transmittedAt: string;
  status: "pending" | "processed" | "archived";
  rhDossierId?: string;
}

const mockPlanningConnections: PlanningConnection[] = [
  {
    id: "1",
    agentId: "AGT-125",
    agentName: "Jean Dupont",
    siteId: "SITE-001",
    siteName: "Centre Commercial Atlantis",
    scheduledStart: "2024-12-24T08:00:00Z",
    scheduledEnd: "2024-12-24T16:00:00Z",
    actualStart: "2024-12-24T08:05:00Z",
    status: "present",
    canCreateEvent: true,
  },
  {
    id: "2",
    agentId: "AGT-126",
    agentName: "Marie Martin",
    siteId: "SITE-002",
    siteName: "Tour de Bureaux Skyline",
    scheduledStart: "2024-12-24T08:00:00Z",
    scheduledEnd: "2024-12-24T16:00:00Z",
    status: "absent",
    canCreateEvent: false,
    reason: "Agent non affecté à ce site",
  },
  {
    id: "3",
    agentId: "AGT-127",
    agentName: "Pierre Durand",
    siteId: "SITE-001",
    siteName: "Centre Commercial Atlantis",
    scheduledStart: "2024-12-24T16:00:00Z",
    scheduledEnd: "2024-12-25T00:00:00Z",
    status: "late",
    canCreateEvent: true,
  },
];

const mockRHTransmissions: RHTransmission[] = [
  {
    id: "1",
    eventId: "EVT-2024-002",
    eventTitle: "Tentative d'effraction véhicule",
    agentId: "AGT-125",
    agentName: "Jean Dupont",
    type: "incident",
    transmittedAt: "2024-12-24T10:50:00Z",
    status: "processed",
  },
  {
    id: "2",
    eventId: "EVT-2024-004",
    eventTitle: "Intervention médicale urgente",
    agentId: "AGT-128",
    agentName: "Sophie Bernard",
    type: "accident_travail",
    transmittedAt: "2024-12-24T16:35:00Z",
    status: "processed",
    rhDossierId: "RH-AT-2024-001",
  },
  {
    id: "3",
    eventId: "EVT-2024-005",
    eventTitle: "Éloge client - Excellent service",
    agentId: "AGT-125",
    agentName: "Jean Dupont",
    type: "eloge",
    transmittedAt: "2024-12-23T14:20:00Z",
    status: "processed",
  },
];

export default function PlanningRHPage() {
  const [activeTab, setActiveTab] = useState<"planning" | "rh">("planning");
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(true);
  const [autoTransmitEnabled, setAutoTransmitEnabled] = useState(true);

  const planningColumns: ColumnDef<PlanningConnection>[] = [
    {
      key: "agentName",
      label: "Agent",
      sortable: true,
    },
    {
      key: "siteName",
      label: "Site",
    },
    {
      key: "scheduledStart",
      label: "Début prévu",
      render: (conn) =>
        new Date(conn.scheduledStart).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "actualStart",
      label: "Début réel",
      render: (conn) =>
        conn.actualStart
          ? new Date(conn.actualStart).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-",
    },
    {
      key: "status",
      label: "Statut",
      render: (conn) => {
        const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
          scheduled: "outline",
          present: "default",
          absent: "destructive",
          late: "secondary",
        };
        return <Badge variant={variants[conn.status]}>{conn.status}</Badge>;
      },
    },
    {
      key: "canCreateEvent",
      label: "Peut saisir",
      render: (conn) =>
        conn.canCreateEvent ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <XCircle className="h-4 w-4 text-red-600" />
        ),
    },
  ];

  const rhColumns: ColumnDef<RHTransmission>[] = [
    {
      key: "eventTitle",
      label: "Événement",
      render: (trans) => <span className="font-medium">{trans.eventTitle}</span>,
    },
    {
      key: "agentName",
      label: "Agent",
    },
    {
      key: "type",
      label: "Type",
      render: (trans) => {
        const labels: Record<string, string> = {
          incident: "Incident",
          explication: "Demande d'explication",
          eloge: "Éloge / Félicitation",
          accident_travail: "Accident de travail",
          disciplinaire: "Suivi disciplinaire",
        };
        return <Badge variant="outline">{labels[trans.type] || trans.type}</Badge>;
      },
    },
    {
      key: "transmittedAt",
      label: "Transmis le",
      render: (trans) =>
        new Date(trans.transmittedAt).toLocaleString("fr-FR"),
    },
    {
      key: "status",
      label: "Statut",
      render: (trans) => {
        const variants: Record<string, "default" | "secondary" | "outline"> = {
          pending: "outline",
          processed: "default",
          archived: "secondary",
        };
        return <Badge variant={variants[trans.status]}>{trans.status}</Badge>;
      },
    },
    {
      key: "rhDossierId",
      label: "Dossier RH",
      render: (trans) =>
        trans.rhDossierId ? (
          <Badge variant="default">{trans.rhDossierId}</Badge>
        ) : (
          "-"
        ),
    },
  ];

  const roundsFromPlanning = mockLogbookEvents.filter(
    (e) => e.type === "action" && e.title.toLowerCase().includes("ronde")
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            Connexion Planning & RH
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Vérification automatique des affectations et transmission des événements RH
          </p>
        </div>
      </div>

      {/* Configuration */}
      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-light">Configuration automatique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Vérification automatique agent affecté</Label>
              <p className="text-sm text-muted-foreground">
                Seuls les agents affectés au site peuvent saisir des événements
              </p>
            </div>
            <Switch
              checked={autoCheckEnabled}
              onCheckedChange={setAutoCheckEnabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Transmission automatique vers RH</Label>
              <p className="text-sm text-muted-foreground">
                Transmission automatique des incidents, éloges et accidents de travail
              </p>
            </div>
            <Switch
              checked={autoTransmitEnabled}
              onCheckedChange={setAutoTransmitEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === "planning" ? "default" : "ghost"}
          onClick={() => setActiveTab("planning")}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Connexion Planning
        </Button>
        <Button
          variant={activeTab === "rh" ? "default" : "ghost"}
          onClick={() => setActiveTab("rh")}
        >
          <Users className="h-4 w-4 mr-2" />
          Transmission RH
        </Button>
      </div>

      {/* Planning Tab */}
      {activeTab === "planning" && (
        <div className="space-y-6">
          <Card className="glass-card border-border/40">
            <CardHeader>
              <CardTitle className="text-lg font-light flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Vérification des affectations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={mockPlanningConnections}
                columns={planningColumns}
                searchKey="agentName"
                searchPlaceholder="Rechercher un agent..."
              />
            </CardContent>
          </Card>

          <Card className="glass-card border-border/40">
            <CardHeader>
              <CardTitle className="text-lg font-light flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Rondes journalisées (Planning → Main Courante)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {roundsFromPlanning.length > 0 ? (
                  roundsFromPlanning.map((round) => (
                    <div
                      key={round.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{round.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {round.agentName} • {round.site} •{" "}
                          {new Date(round.timestamp).toLocaleString("fr-FR")}
                        </p>
                      </div>
                      <Badge variant="outline">Journalisé</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucune ronde journalisée
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/40">
            <CardHeader>
              <CardTitle className="text-lg font-light flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Contrôle de présence (badgeuse / photo)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPlanningConnections
                  .filter((c) => c.actualStart)
                  .map((conn) => (
                    <div
                      key={conn.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{conn.agentName}</p>
                        <p className="text-sm text-muted-foreground">
                          Présence confirmée à {new Date(conn.actualStart!).toLocaleTimeString("fr-FR")}
                        </p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* RH Tab */}
      {activeTab === "rh" && (
        <div className="space-y-6">
          <Card className="glass-card border-border/40">
            <CardHeader>
              <CardTitle className="text-lg font-light flex items-center gap-2">
                <Users className="h-5 w-5" />
                Transmissions automatiques vers RH
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={mockRHTransmissions}
                columns={rhColumns}
                searchKey="eventTitle"
                searchPlaceholder="Rechercher une transmission..."
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-card border-border/40">
              <CardHeader>
                <CardTitle className="text-sm font-light">Incidents impliquant un agent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockRHTransmissions.filter((t) => t.type === "incident").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Transmissions automatiques
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-border/40">
              <CardHeader>
                <CardTitle className="text-sm font-light">Dossiers disciplinaires générés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockRHTransmissions.filter((t) => t.type === "disciplinaire" && t.rhDossierId).length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Créés automatiquement
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

