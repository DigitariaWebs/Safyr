"use client";

import { useState } from "react";
import {
  mockLogbookEvents,
  mockSites,
  mockAgents,
  LogbookEvent,
} from "@/data/logbook-events";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  MapPin,
  Camera,
  Video,
  Mic,
  Edit,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";

export default function ValidationPage() {
  const [events, setEvents] = useState<LogbookEvent[]>(mockLogbookEvents);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [action, setAction] = useState<"approve" | "reject" | "modify" | null>(
    null,
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<LogbookEvent | null>(null);
  const [modifyData, setModifyData] = useState({
    severity: "",
    type: "",
    tags: "",
    notifyClient: false,
  });

  const pendingEvents = events.filter(
    (e) =>
      (e.status === "pending" || e.status === "in_progress") &&
      e.severity === "critical",
  );

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

  const handleValidation = (
    eventId: string,
    validationAction: "approve" | "reject" | "modify",
  ) => {
    setSelectedEvent(eventId);
    setAction(validationAction);
    const event = events.find((e) => e.id === eventId);
    if (event && validationAction === "modify") {
      setModifyData({
        severity: event.severity,
        type: event.type,
        tags: event.tags.join(", "),
        notifyClient: event.clientNotified,
      });
      setIsModifyModalOpen(true);
    }
  };

  const handleSubmitValidation = () => {
    if (!selectedEvent) return;

    const eventIndex = events.findIndex((e) => e.id === selectedEvent);
    if (eventIndex === -1) return;

    const updatedEvents = [...events];
    const event = updatedEvents[eventIndex];

    if (action === "approve") {
      updatedEvents[eventIndex] = {
        ...event,
        status: "resolved" as const,
        validatedAt: new Date().toISOString(),
        supervisorComment: comment || undefined,
        clientNotified: event.severity === "critical" || event.clientNotified,
      };
      // Notification client si critique
      if (event.severity === "critical") {
        alert("Notification envoyée au client (événement critique)");
      }
    } else if (action === "reject") {
      updatedEvents[eventIndex] = {
        ...event,
        status: "deferred" as const,
        supervisorComment: comment,
      };
    }

    setEvents(updatedEvents);
    setSelectedEvent(null);
    setComment("");
    setAction(null);
  };

  const handleModifyEvent = () => {
    if (!selectedEvent) return;

    const eventIndex = events.findIndex((e) => e.id === selectedEvent);
    if (eventIndex === -1) return;

    const updatedEvents = [...events];
    updatedEvents[eventIndex] = {
      ...updatedEvents[eventIndex],
      severity: modifyData.severity as LogbookEvent["severity"],
      type: modifyData.type as LogbookEvent["type"],
      tags: modifyData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      clientNotified: modifyData.notifyClient,
    };

    setEvents(updatedEvents);
    setIsModifyModalOpen(false);
    setSelectedEvent(null);
    setModifyData({ severity: "", type: "", tags: "", notifyClient: false });
    setAction(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleGenerateReport = (type: "daily" | "weekly" | "monthly") => {
    alert(
      `Génération du rapport ${type === "daily" ? "quotidien" : type === "weekly" ? "hebdomadaire" : "mensuel"} en cours...`,
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-light tracking-tight">
          Validation des événements
        </h1>
        <p className="mt-2 text-sm font-light text-muted-foreground">
          {pendingEvents.length} événement(s) en attente de validation
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pendingEvents.length === 0 ? (
          <Card className="glass-card border-border/40">
            <CardContent className="pt-6 text-center py-12">
              <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
              <p className="text-lg font-light text-muted-foreground">
                Aucun événement en attente de validation
              </p>
            </CardContent>
          </Card>
        ) : (
          pendingEvents.map((event) => (
            <Card
              key={event.id}
              className="glass-card border-border/40 hover:border-primary/30 transition-all cursor-pointer"
              onClick={() => {
                setViewingEvent(event);
                setIsViewModalOpen(true);
              }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                      <Badge variant="outline">{event.type}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString("fr-FR")}
                      </span>
                    </div>
                    <CardTitle className="text-xl font-light">
                      {event.title}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {event.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Site:</span>
                    <span className="ml-2 font-medium">
                      {mockSites.find((s) => s.id === event.siteId)?.name ||
                        event.site}
                    </span>
                  </div>
                  {event.zone && (
                    <div>
                      <span className="text-muted-foreground">Zone:</span>
                      <span className="ml-2 font-medium">{event.zone}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Agent:</span>
                    <span className="ml-2 font-medium">
                      {mockAgents.find((a) => a.id === event.agentId)?.name ||
                        event.agentName}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ID:</span>
                    <span className="ml-2 font-mono text-xs">{event.id}</span>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm">{event.description}</p>
                </div>

                {event.media && (
                  <div className="flex gap-2">
                    {event.media.photos && event.media.photos.length > 0 && (
                      <Badge variant="outline" className="gap-1">
                        📷 {event.media.photos.length} photo(s)
                      </Badge>
                    )}
                    {event.media.videos && event.media.videos.length > 0 && (
                      <Badge variant="outline" className="gap-1">
                        🎥 {event.media.videos.length} vidéo(s)
                      </Badge>
                    )}
                    {event.media.voiceNotes &&
                      event.media.voiceNotes.length > 0 && (
                        <Badge variant="outline" className="gap-1">
                          🎤 {event.media.voiceNotes.length} note(s) vocale(s)
                        </Badge>
                      )}
                  </div>
                )}

                {event.location && (
                  <Badge variant="secondary" className="gap-1">
                    📍 Géolocalisation disponible
                  </Badge>
                )}

                <div
                  className="flex gap-2 pt-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    onClick={() => handleValidation(event.id, "approve")}
                    className="flex-1 gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Valider
                  </Button>
                  <Button
                    onClick={() => handleValidation(event.id, "reject")}
                    variant="destructive"
                    className="flex-1 gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Rejeter
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleValidation(event.id, "modify");
                    }}
                  >
                    <Edit className="h-4 w-4" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewingEvent(event);
                      setIsViewModalOpen(true);
                    }}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Commenter
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
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
                  {mockSites.find((s) => s.id === viewingEvent.siteId)?.name ||
                    "N/A"}
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
              <p className="text-sm whitespace-pre-wrap">
                {viewingEvent.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Badge variant="outline">{viewingEvent.type}</Badge>
              </div>
              <div>
                <Label>Gravité</Label>
                <Badge variant={getSeverityColor(viewingEvent.severity)}>
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
                  {mockAgents.find((a) => a.id === viewingEvent.agentId)
                    ?.name || "N/A"}
                </p>
              </div>
            </div>

            {viewingEvent.location && (
              <div>
                <Label>Géolocalisation</Label>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {viewingEvent.location.lat.toFixed(4)},{" "}
                    {viewingEvent.location.lng.toFixed(4)}
                  </span>
                </div>
              </div>
            )}

            {viewingEvent.media && (
              <div>
                <Label>Médias</Label>
                <div className="flex gap-4 text-sm">
                  {viewingEvent.media.photos &&
                    viewingEvent.media.photos.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        <span>{viewingEvent.media.photos.length} photo(s)</span>
                      </div>
                    )}
                  {viewingEvent.media.videos &&
                    viewingEvent.media.videos.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        <span>{viewingEvent.media.videos.length} vidéo(s)</span>
                      </div>
                    )}
                  {viewingEvent.media.voiceNotes &&
                    viewingEvent.media.voiceNotes.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Mic className="h-4 w-4" />
                        <span>
                          {viewingEvent.media.voiceNotes.length} note(s)
                          vocale(s)
                        </span>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Validation Modal */}
      <Modal
        open={selectedEvent !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedEvent(null);
            setComment("");
            setAction(null);
          }
        }}
        type="form"
        title={
          action === "approve" ? "Valider l'événement" : "Rejeter l'événement"
        }
        size="md"
        actions={{
          primary: {
            label: "Confirmer",
            onClick: handleSubmitValidation,
            variant: action === "reject" ? "destructive" : "default",
            disabled: action === "reject" && !comment.trim(),
          },
          secondary: {
            label: "Annuler",
            onClick: () => {
              setSelectedEvent(null);
              setComment("");
              setAction(null);
            },
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="comment">
              Commentaire {action === "reject" && "(requis)"}
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                action === "approve"
                  ? "Ajouter un commentaire (optionnel)..."
                  : "Expliquer la raison du rejet..."
              }
              rows={4}
              required={action === "reject"}
            />
          </div>
        </div>
      </Modal>

      {/* Modify Event Modal */}
      <Modal
        open={isModifyModalOpen}
        onOpenChange={setIsModifyModalOpen}
        type="form"
        title="Modifier l'événement"
        size="lg"
        actions={{
          primary: {
            label: "Enregistrer",
            onClick: handleModifyEvent,
          },
          secondary: {
            label: "Annuler",
            onClick: () => {
              setIsModifyModalOpen(false);
              setSelectedEvent(null);
              setModifyData({
                severity: "",
                type: "",
                tags: "",
                notifyClient: false,
              });
              setAction(null);
            },
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="severity">Gravité</Label>
            <Select
              value={modifyData.severity}
              onValueChange={(value) =>
                setModifyData({ ...modifyData, severity: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Faible</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="high">Élevée</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={modifyData.type}
              onValueChange={(value) =>
                setModifyData({ ...modifyData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="incident">Incident</SelectItem>
                <SelectItem value="action">Action</SelectItem>
                <SelectItem value="control">Contrôle</SelectItem>
                <SelectItem value="critical">Critique</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
            <Input
              id="tags"
              value={modifyData.tags}
              onChange={(e) =>
                setModifyData({ ...modifyData, tags: e.target.value })
              }
              placeholder="ex: urgent, police, incendie"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notifyClient"
              checked={modifyData.notifyClient}
              onChange={(e) =>
                setModifyData({ ...modifyData, notifyClient: e.target.checked })
              }
              className="rounded border-gray-300"
            />
            <Label htmlFor="notifyClient" className="cursor-pointer">
              Notifier le client immédiatement
            </Label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
