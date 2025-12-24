"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  MapPin,
  Camera,
  Video,
  Mic,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { mockLogbookEvents, mockSites, mockAgents, LogbookEvent } from "@/data/logbook-events";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";

function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  trend,
  isLoading,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  trend?: { value: string; direction: "up" | "down" };
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-48 mb-4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Icon className={`h-4 w-4 ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="text-4xl font-light tracking-tight">{value}</span>
            <span className="ml-2 text-sm text-muted-foreground">
              {subtitle}
            </span>
          </div>
          {trend && (
            <div className="flex items-center gap-2 text-sm">
              {trend.direction === "up" ? (
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-400" />
              )}
              <span
                className={
                  trend.direction === "up" ? "text-emerald-400" : "text-red-400"
                }
              >
                {trend.value}
              </span>
              <span className="text-muted-foreground">vs hier</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentEventsWidget({ 
  isLoading,
  onEventClick 
}: { 
  isLoading: boolean;
  onEventClick: (event: LogbookEvent) => void;
}) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const recentEvents = mockLogbookEvents.slice(0, 5);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Derniers événements
          </CardTitle>
          <a
            href="/dashboard/logbook/events"
            className="text-xs text-primary hover:underline"
          >
            Voir tout
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onEventClick(event)}
              className="block p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getSeverityColor(event.severity)}>
                      {event.severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString("fr-FR")}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium truncate">
                    {event.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {mockSites.find((s) => s.id === event.siteId)?.name || "N/A"} • {mockAgents.find((a) => a.id === event.agentId)?.name || "N/A"}
                  </p>
                </div>
                <Badge variant="outline">{event.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AlertsWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const alerts = [
    {
      type: "critical",
      label: "Événements critiques",
      count: 2,
      color: "text-red-500",
    },
    {
      type: "validation",
      label: "En attente validation",
      count: 3,
      color: "text-orange-500",
    },
    {
      type: "patrols",
      label: "Rondes manquées",
      count: 0,
      color: "text-blue-500",
    },
  ];

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          Alertes actives
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.type}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
            >
              <span className="text-sm">{alert.label}</span>
              <span className={`text-lg font-light ${alert.color}`}>
                {alert.count}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function LogbookDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<LogbookEvent | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleEventClick = (event: LogbookEvent) => {
    setViewingEvent(event);
    setIsViewModalOpen(true);
  };

  const totalEvents = mockLogbookEvents.length;
  const criticalEvents = mockLogbookEvents.filter(
    (e) => e.severity === "critical",
  ).length;
  const pendingValidation = mockLogbookEvents.filter(
    (e) => e.status === "pending" || e.status === "in_progress",
  ).length;
  const resolvedToday = mockLogbookEvents.filter((e) => e.status === "resolved")
    .length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            Main Courante Digitale
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Vue d&apos;ensemble des événements et incidents en temps réel
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total événements"
          value={totalEvents}
          subtitle="aujourd'hui"
          icon={BookOpen}
          iconColor="text-primary"
          trend={{ value: "+2", direction: "up" }}
          isLoading={isLoading}
        />
        <StatsCard
          title="Événements critiques"
          value={criticalEvents}
          subtitle="actifs"
          icon={AlertTriangle}
          iconColor="text-red-500"
          isLoading={isLoading}
        />
        <StatsCard
          title="En attente validation"
          value={pendingValidation}
          subtitle="événements"
          icon={Clock}
          iconColor="text-orange-500"
          isLoading={isLoading}
        />
        <StatsCard
          title="Résolus aujourd'hui"
          value={resolvedToday}
          subtitle="événements"
          icon={CheckCircle}
          iconColor="text-emerald-500"
          trend={{ value: "+15%", direction: "up" }}
          isLoading={isLoading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentEventsWidget isLoading={isLoading} onEventClick={handleEventClick} />
        </div>
        <div>
          <AlertsWidget isLoading={isLoading} />
        </div>
      </div>

      {/* View Event Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails de l'événement"
        size="lg"
      >
        {viewingEvent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ID</Label>
                <p className="text-sm font-mono">{viewingEvent.id}</p>
              </div>
              <div>
                <Label>Date/Heure</Label>
                <p className="text-sm">
                  {new Date(viewingEvent.timestamp).toLocaleString("fr-FR")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Site</Label>
                <p className="text-sm">
                  {mockSites.find((s) => s.id === viewingEvent.siteId)?.name || "N/A"}
                </p>
              </div>
              <div>
                <Label>Zone</Label>
                <p className="text-sm">{viewingEvent.zone || "-"}</p>
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
                <Label>Gravité</Label>
                <Badge variant={
                  viewingEvent.severity === "critical" || viewingEvent.severity === "high"
                    ? "destructive"
                    : viewingEvent.severity === "medium"
                    ? "default"
                    : "secondary"
                }>
                  {viewingEvent.severity}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Statut</Label>
                <Badge variant="secondary">{viewingEvent.status}</Badge>
              </div>
              <div>
                <Label>Agent</Label>
                <p className="text-sm">
                  {mockAgents.find((a) => a.id === viewingEvent.agentId)?.name || "N/A"}
                </p>
              </div>
            </div>

            {viewingEvent.location && (
              <div>
                <Label>Géolocalisation</Label>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {viewingEvent.location.lat.toFixed(4)}, {viewingEvent.location.lng.toFixed(4)}
                  </span>
                </div>
              </div>
            )}

            {viewingEvent.media && (
              <div>
                <Label>Médias</Label>
                <div className="flex gap-4 text-sm">
                  {viewingEvent.media.photos && viewingEvent.media.photos.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      <span>{viewingEvent.media.photos.length} photo(s)</span>
                    </div>
                  )}
                  {viewingEvent.media.videos && viewingEvent.media.videos.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      <span>{viewingEvent.media.videos.length} vidéo(s)</span>
                    </div>
                  )}
                  {viewingEvent.media.voiceNotes && viewingEvent.media.voiceNotes.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Mic className="h-4 w-4" />
                      <span>{viewingEvent.media.voiceNotes.length} note(s) vocale(s)</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

