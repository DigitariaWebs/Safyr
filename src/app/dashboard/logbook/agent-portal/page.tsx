"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  MessageSquare,
  FileText,
  Shield,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { mockLogbookEvents, LogbookEvent } from "@/data/logbook-events";
import { MediaUpload } from "@/components/logbook/MediaUpload";
import { QRCodeScanner } from "@/components/logbook/QRCodeScanner";

export default function AgentPortalPage() {
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<LogbookEvent | null>(null);
  const [formData, setFormData] = useState({
    type: "",
    severity: "",
    title: "",
    description: "",
    zone: "",
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [voiceNotes, setVoiceNotes] = useState<File[]>([]);

  // Filter events for current agent (RGPD - restricted access)
  const currentAgentId = "AGT-125"; // Mock current agent
  const agentEvents = mockLogbookEvents.filter(
    (e) => e.agentId === currentAgentId
  );

  const columns: ColumnDef<LogbookEvent>[] = [
    {
      key: "timestamp",
      label: "Date/Heure",
      render: (event) =>
        new Date(event.timestamp).toLocaleString("fr-FR"),
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
  ];

  const handleCreateEvent = () => {
    setFormData({
      type: "",
      severity: "",
      title: "",
      description: "",
      zone: "",
    });
    setPhotos([]);
    setVideos([]);
    setVoiceNotes([]);
    setIsNewEventModalOpen(true);
  };

  const handleSaveEvent = () => {
    alert("Événement créé avec succès!");
    setIsNewEventModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            Portail Agent
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Accès restreint (RGPD) - Vos événements et interventions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsTicketModalOpen(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Ticket interne
          </Button>
          <Button variant="outline" onClick={() => setIsMessageModalOpen(true)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Messagerie
          </Button>
          <Button onClick={handleCreateEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle main courante
          </Button>
        </div>
      </div>

      {/* Agent Info Card */}
      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-light flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Mes informations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Agent</Label>
              <p className="text-sm font-medium">Jean Dupont</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Site actuel</Label>
              <p className="text-sm font-medium">Centre Commercial Atlantis</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Poste</Label>
              <p className="text-sm font-medium">Rondier</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* My Events */}
      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-light">
            Mes événements et interventions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={agentEvents}
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

      {/* Create Event Modal */}
      <Modal
        open={isNewEventModalOpen}
        onOpenChange={setIsNewEventModalOpen}
        type="form"
        title="Nouvelle main courante"
        size="lg"
        actions={{
          primary: {
            label: "Créer",
            onClick: handleSaveEvent,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsNewEventModalOpen(false),
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="type">Type d&apos;événement</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="incident">Incident</SelectItem>
                <SelectItem value="action">Action</SelectItem>
                <SelectItem value="control">Contrôle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="severity">Gravité</Label>
            <Select
              value={formData.severity}
              onValueChange={(value) => setFormData({ ...formData, severity: value })}
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
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Titre de l'événement"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description détaillée..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="zone">Zone (scan QR code)</Label>
            <div className="flex gap-2">
              <Input
                id="zone"
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                placeholder="Zone ou scan QR code"
              />
              <QRCodeScanner onScan={(data) => setFormData({ ...formData, zone: data.zone })} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Photos</Label>
              <MediaUpload
                type="photo"
                files={photos}
                onUpload={setPhotos}
                onRemove={(index) => setPhotos(photos.filter((_, i) => i !== index))}
              />
            </div>
            <div>
              <Label>Vidéos</Label>
              <MediaUpload
                type="video"
                files={videos}
                onUpload={setVideos}
                onRemove={(index) => setVideos(videos.filter((_, i) => i !== index))}
              />
            </div>
            <div>
              <Label>Notes vocales</Label>
              <MediaUpload
                type="voice"
                files={voiceNotes}
                onUpload={setVoiceNotes}
                onRemove={(index) => setVoiceNotes(voiceNotes.filter((_, i) => i !== index))}
              />
            </div>
          </div>
        </div>
      </Modal>

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
                <Label>Statut</Label>
                <Badge variant="secondary">{viewingEvent.status}</Badge>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Ticket Modal */}
      <Modal
        open={isTicketModalOpen}
        onOpenChange={setIsTicketModalOpen}
        type="form"
        title="Créer un ticket interne"
        size="md"
        actions={{
          primary: {
            label: "Créer",
            onClick: () => {
              alert("Ticket créé avec succès!");
              setIsTicketModalOpen(false);
            },
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsTicketModalOpen(false),
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="ticketSubject">Sujet</Label>
            <Input id="ticketSubject" placeholder="Sujet du ticket" />
          </div>
          <div>
            <Label htmlFor="ticketMessage">Message</Label>
            <Textarea
              id="ticketMessage"
              placeholder="Description du problème ou demande..."
              rows={5}
            />
          </div>
        </div>
      </Modal>

      {/* Message Modal */}
      <Modal
        open={isMessageModalOpen}
        onOpenChange={setIsMessageModalOpen}
        type="form"
        title="Messagerie interne"
        size="md"
        actions={{
          primary: {
            label: "Envoyer",
            onClick: () => {
              alert("Message envoyé!");
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
            <Label htmlFor="messageTo">Destinataire</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pc">PC Sécurité</SelectItem>
                <SelectItem value="supervisor">Superviseur</SelectItem>
                <SelectItem value="rh">RH</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="messageText">Message</Label>
            <Textarea
              id="messageText"
              placeholder="Votre message..."
              rows={5}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

