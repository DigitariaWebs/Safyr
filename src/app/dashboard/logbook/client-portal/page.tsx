"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  FileText,
  MessageSquare,
  BarChart3,
  Calendar,
  Filter,
  AlertTriangle,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { mockLogbookEvents, LogbookEvent } from "@/data/logbook-events";

export default function ClientPortalPage() {
  const [selectedSite, setSelectedSite] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<LogbookEvent | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // Filter events for client view (only today's events)
  const today = new Date().toISOString().split("T")[0];
  let filteredEvents = mockLogbookEvents.filter(
    (e) => new Date(e.timestamp).toISOString().split("T")[0] === today
  );

  if (selectedSite !== "all") {
    filteredEvents = filteredEvents.filter((e) => e.siteId === selectedSite);
  }
  if (selectedType !== "all") {
    filteredEvents = filteredEvents.filter((e) => e.type === selectedType);
  }
  if (selectedSeverity !== "all") {
    filteredEvents = filteredEvents.filter((e) => e.severity === selectedSeverity);
  }

  const totalEvents = filteredEvents.length;
  const criticalEvents = filteredEvents.filter((e) => e.severity === "critical").length;
  const resolvedEvents = filteredEvents.filter((e) => e.status === "resolved").length;
  const avgResolutionTime = "2.5h"; // Mock data

  const columns: ColumnDef<LogbookEvent>[] = [
    {
      key: "timestamp",
      label: "Heure",
      render: (event) =>
        new Date(event.timestamp).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "title",
      label: "Événement",
      render: (event) => <span className="font-medium">{event.title}</span>,
    },
    {
      key: "type",
      label: "Type",
      render: (event) => <Badge variant="outline">{event.type}</Badge>,
    },
    {
      key: "severity",
      label: "Criticité",
      render: (event) => {
        const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
          critical: "destructive",
          high: "destructive",
          medium: "default",
          low: "secondary",
        };
        return <Badge variant={variants[event.severity]}>{event.severity}</Badge>;
      },
    },
    {
      key: "status",
      label: "Statut",
      render: (event) => {
        const variants: Record<string, "default" | "secondary" | "outline"> = {
          resolved: "default",
          in_progress: "secondary",
          pending: "outline",
          deferred: "outline",
        };
        return <Badge variant={variants[event.status]}>{event.status}</Badge>;
      },
    },
    {
      key: "agentName",
      label: "Agent",
    },
  ];

  const handleExportPDF = (type: "daily" | "weekly" | "monthly") => {
    alert(`Export PDF ${type === "daily" ? "quotidien" : type === "weekly" ? "hebdomadaire" : "mensuel"} en cours...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            Portail Client
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Consultation en temps réel des événements et statistiques
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExportPDF("daily")}>
            <Download className="h-4 w-4 mr-2" />
            Export quotidien
          </Button>
          <Button variant="outline" onClick={() => handleExportPDF("weekly")}>
            <Download className="h-4 w-4 mr-2" />
            Export hebdo
          </Button>
          <Button variant="outline" onClick={() => handleExportPDF("monthly")}>
            <Download className="h-4 w-4 mr-2" />
            Export mensuel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements aujourd&apos;hui</CardTitle>
            <FileText className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Événements critiques</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{criticalEvents}</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résolus</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{resolvedEvents}</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps moyen résolution</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResolutionTime}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-light flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="site">Site</Label>
              <Select value={selectedSite} onValueChange={setSelectedSite}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les sites" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les sites</SelectItem>
                  <SelectItem value="SITE-001">Centre Commercial Atlantis</SelectItem>
                  <SelectItem value="SITE-002">Tour de Bureaux Skyline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="period">Période</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Aujourd&apos;hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Type d&apos;incident</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="incident">Incident</SelectItem>
                  <SelectItem value="action">Action</SelectItem>
                  <SelectItem value="control">Contrôle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="severity">Niveau de criticité</Label>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les niveaux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  <SelectItem value="critical">Critique</SelectItem>
                  <SelectItem value="high">Élevé</SelectItem>
                  <SelectItem value="medium">Moyen</SelectItem>
                  <SelectItem value="low">Faible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card className="glass-card border-border/40">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-light">Événements du jour</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMessageModalOpen(true)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contacter PC Sécurité
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredEvents}
            columns={columns}
            searchKey="title"
            searchPlaceholder="Rechercher un événement..."
            onRowClick={(event) => {
              setViewingEvent(event);
              setIsViewModalOpen(true);
            }}
          />
        </CardContent>
      </Card>

      {/* View Event Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails de l'événement"
        size="lg"
        actions={{
          secondary: {
            label: "Fermer",
            onClick: () => setIsViewModalOpen(false),
          },
        }}
      >
        {viewingEvent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date/Heure</Label>
                <p className="text-sm">
                  {new Date(viewingEvent.timestamp).toLocaleString("fr-FR")}
                </p>
              </div>
              <div>
                <Label>Site</Label>
                <p className="text-sm">{viewingEvent.site}</p>
              </div>
            </div>

            <div>
              <Label>Titre</Label>
              <p className="text-sm font-medium">{viewingEvent.title}</p>
            </div>

            <div>
              <Label>Description</Label>
              <p className="text-sm whitespace-pre-wrap">{viewingEvent.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Badge variant="outline">{viewingEvent.type}</Badge>
              </div>
              <div>
                <Label>Criticité</Label>
                <Badge
                  variant={
                    viewingEvent.severity === "critical" || viewingEvent.severity === "high"
                      ? "destructive"
                      : "default"
                  }
                >
                  {viewingEvent.severity}
                </Badge>
              </div>
            </div>

            <div>
              <Label>Statut</Label>
              <Badge variant="secondary">{viewingEvent.status}</Badge>
            </div>
          </div>
        )}
      </Modal>

      {/* Message Modal */}
      <Modal
        open={isMessageModalOpen}
        onOpenChange={setIsMessageModalOpen}
        type="form"
        title="Contacter PC Sécurité"
        size="md"
        actions={{
          primary: {
            label: "Envoyer",
            onClick: () => {
              alert("Message envoyé au PC Sécurité");
              setIsMessageModalOpen(false);
            },
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsMessageModalOpen(false),
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              className="w-full min-h-[120px] p-3 border rounded-lg"
              placeholder="Votre message au PC Sécurité..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

