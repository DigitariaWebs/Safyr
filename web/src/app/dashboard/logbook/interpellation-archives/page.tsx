"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Search,
  FileText,
  MapPin,
  Shield,
  Download,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";

interface InterpellationRecord {
  id: string;
  siteId: string;
  siteName: string;
  date: string;
  agentId: string;
  agentName: string;
  reason: string;
  description: string;
  personInterpellated?: string;
  status: "archived" | "active";
  archivedAt: string;
  archivedBy: string;
}

const mockInterpellationRecords: InterpellationRecord[] = [
  {
    id: "INT-2024-001",
    siteId: "SITE-001",
    siteName: "Centre Commercial Atlantis",
    date: "2024-12-24T14:30:00Z",
    agentId: "AGT-125",
    agentName: "Jean Dupont",
    reason: "Comportement suspect",
    description:
      "Personne suspecte observée dans le parking. Contrôle d'identité effectué.",
    personInterpellated: "M. X",
    status: "archived",
    archivedAt: "2024-12-24T15:00:00Z",
    archivedBy: "Marie Martin",
  },
  {
    id: "INT-2024-002",
    siteId: "SITE-002",
    siteName: "Tour de Bureaux Skyline",
    date: "2024-12-23T10:15:00Z",
    agentId: "AGT-126",
    agentName: "Marie Martin",
    reason: "Tentative d'intrusion",
    description:
      "Tentative d'accès non autorisé détectée. Intervention immédiate.",
    status: "archived",
    archivedAt: "2024-12-23T11:00:00Z",
    archivedBy: "Pierre Durand",
  },
  {
    id: "INT-2024-003",
    siteId: "SITE-001",
    siteName: "Centre Commercial Atlantis",
    date: "2024-12-22T16:45:00Z",
    agentId: "AGT-125",
    agentName: "Jean Dupont",
    reason: "Vérification d'identité",
    description: "Vérification d'identité de routine effectuée.",
    personInterpellated: "M. Y",
    status: "active",
    archivedAt: "",
    archivedBy: "",
  },
];

const reasons = [
  "Vol",
  "Comportement suspect",
  "Tentative d'intrusion",
  "Vérification d'identité",
  "Contrôle d'accès",
  "Autre",
];

export default function InterpellationArchivesPage() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewingRecord, setViewingRecord] =
    useState<InterpellationRecord | null>(null);
  const [editingRecord, setEditingRecord] =
    useState<InterpellationRecord | null>(null);
  const [deletingRecord, setDeletingRecord] =
    useState<InterpellationRecord | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    site: "all",
    agent: "",
    reason: "all",
    startDate: "",
    endDate: "",
    searchTerm: "",
  });

  let filteredRecords = mockInterpellationRecords;

  if (searchFilters.site !== "all") {
    filteredRecords = filteredRecords.filter(
      (r) => r.siteId === searchFilters.site,
    );
  }
  if (searchFilters.agent) {
    filteredRecords = filteredRecords.filter((r) =>
      r.agentName.toLowerCase().includes(searchFilters.agent.toLowerCase()),
    );
  }
  if (searchFilters.reason !== "all") {
    filteredRecords = filteredRecords.filter(
      (r) => r.reason === searchFilters.reason,
    );
  }
  if (searchFilters.startDate) {
    filteredRecords = filteredRecords.filter(
      (r) => new Date(r.date) >= new Date(searchFilters.startDate),
    );
  }
  if (searchFilters.endDate) {
    filteredRecords = filteredRecords.filter(
      (r) => new Date(r.date) <= new Date(searchFilters.endDate),
    );
  }
  if (searchFilters.searchTerm) {
    filteredRecords = filteredRecords.filter(
      (r) =>
        r.description
          .toLowerCase()
          .includes(searchFilters.searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchFilters.searchTerm.toLowerCase()),
    );
  }

  const columns: ColumnDef<InterpellationRecord>[] = [
    {
      key: "id",
      label: "ID",
      render: (record) => (
        <span className="font-mono text-xs">{record.id}</span>
      ),
    },
    {
      key: "siteName",
      label: "Site",
      render: (record) => (
        <span className="font-medium">{record.siteName}</span>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (record) => new Date(record.date).toLocaleString("fr-FR"),
    },
    {
      key: "agentName",
      label: "Agent",
    },
    {
      key: "reason",
      label: "Motif",
      render: (record) => <Badge variant="outline">{record.reason}</Badge>,
    },
    {
      key: "status",
      label: "Statut",
      render: (record) => (
        <Badge variant={record.status === "archived" ? "default" : "secondary"}>
          {record.status === "archived" ? "Archivé" : "Actif"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (record) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setViewingRecord(record);
              setIsViewModalOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setEditingRecord(record);
              setIsEditModalOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setDeletingRecord(record);
              setIsDeleteModalOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleEdit = () => {
    alert("Fiche d'interpellation modifiée avec succès!");
    setIsEditModalOpen(false);
    setEditingRecord(null);
  };

  const handleDelete = () => {
    alert("Fiche d'interpellation supprimée avec succès!");
    setIsDeleteModalOpen(false);
    setDeletingRecord(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            Archivage des Fiches d&apos;Interpellation
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Stockage sécurisé par site et date avec recherche avancée
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Search Filters */}
      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-light flex items-center gap-2">
            <Search className="h-5 w-5" />
            Recherche avancée
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="site">Site</Label>
              <Select
                value={searchFilters.site}
                onValueChange={(value) =>
                  setSearchFilters({ ...searchFilters, site: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les sites" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les sites</SelectItem>
                  <SelectItem value="SITE-001">
                    Centre Commercial Atlantis
                  </SelectItem>
                  <SelectItem value="SITE-002">
                    Tour de Bureaux Skyline
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="agent">Agent</Label>
              <Input
                id="agent"
                value={searchFilters.agent}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, agent: e.target.value })
                }
                placeholder="Nom de l'agent..."
              />
            </div>

            <div>
              <Label htmlFor="reason">Motif</Label>
              <Select
                value={searchFilters.reason}
                onValueChange={(value) =>
                  setSearchFilters({ ...searchFilters, reason: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les motifs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les motifs</SelectItem>
                  {reasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="startDate">Date début</Label>
              <Input
                id="startDate"
                type="date"
                value={searchFilters.startDate}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    startDate: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="endDate">Date fin</Label>
              <Input
                id="endDate"
                type="date"
                value={searchFilters.endDate}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    endDate: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="searchTerm">Recherche texte</Label>
              <Input
                id="searchTerm"
                value={searchFilters.searchTerm}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    searchTerm: e.target.value,
                  })
                }
                placeholder="Rechercher dans les descriptions..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <InfoCardContainer>
        <InfoCard
          icon={FileText}
          title="Total fiches"
          value={filteredRecords.length}
          color="blue"
        />
        <InfoCard
          icon={Shield}
          title="Archivées"
          value={filteredRecords.filter((r) => r.status === "archived").length}
          color="green"
        />
        <InfoCard
          icon={FileText}
          title="Actives"
          value={filteredRecords.filter((r) => r.status === "active").length}
          color="orange"
        />
        <InfoCard
          icon={MapPin}
          title="Sites concernés"
          value={new Set(filteredRecords.map((r) => r.siteId)).size}
          color="purple"
        />
      </InfoCardContainer>

      {/* Table */}
      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-light">
            Fiches d&apos;interpellation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredRecords}
            columns={columns}
            searchKey="description"
            searchPlaceholder="Rechercher une fiche..."
          />
        </CardContent>
      </Card>

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails de la fiche d'interpellation"
        size="lg"
        actions={{
          secondary: {
            label: "Fermer",
            onClick: () => setIsViewModalOpen(false),
          },
        }}
      >
        {viewingRecord && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ID</Label>
                <p className="text-sm font-mono">{viewingRecord.id}</p>
              </div>
              <div>
                <Label>Site</Label>
                <p className="text-sm font-medium">{viewingRecord.siteName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <p className="text-sm">
                  {new Date(viewingRecord.date).toLocaleString("fr-FR")}
                </p>
              </div>
              <div>
                <Label>Agent</Label>
                <p className="text-sm">{viewingRecord.agentName}</p>
              </div>
            </div>

            <div>
              <Label>Motif</Label>
              <Badge variant="outline">{viewingRecord.reason}</Badge>
            </div>

            <div>
              <Label>Description</Label>
              <p className="text-sm whitespace-pre-wrap">
                {viewingRecord.description}
              </p>
            </div>

            {viewingRecord.personInterpellated && (
              <div>
                <Label>Personne interpellée</Label>
                <p className="text-sm">{viewingRecord.personInterpellated}</p>
              </div>
            )}

            <div>
              <Label>Statut</Label>
              <Badge
                variant={
                  viewingRecord.status === "archived" ? "default" : "secondary"
                }
              >
                {viewingRecord.status === "archived" ? "Archivé" : "Actif"}
              </Badge>
            </div>

            {viewingRecord.status === "archived" && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label>Archivé le</Label>
                  <p className="text-sm">
                    {new Date(viewingRecord.archivedAt).toLocaleString("fr-FR")}
                  </p>
                </div>
                <div>
                  <Label>Archivé par</Label>
                  <p className="text-sm">{viewingRecord.archivedBy}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        type="form"
        title="Modifier la fiche d'interpellation"
        size="lg"
        actions={{
          primary: {
            label: "Enregistrer",
            onClick: handleEdit,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsEditModalOpen(false),
            variant: "outline",
          },
        }}
      >
        {editingRecord && (
          <div className="space-y-4">
            <div>
              <Label>ID</Label>
              <Input value={editingRecord.id} disabled />
            </div>
            <div>
              <Label>Motif</Label>
              <Select defaultValue={editingRecord.reason}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Input defaultValue={editingRecord.description} />
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        type="warning"
        title="Supprimer la fiche d'interpellation"
        description="Êtes-vous sûr de vouloir supprimer cette fiche d'interpellation ? Cette action est irréversible."
        size="sm"
        actions={{
          primary: {
            label: "Supprimer",
            onClick: handleDelete,
            variant: "destructive",
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsDeleteModalOpen(false),
            variant: "outline",
          },
        }}
      >
        {deletingRecord && (
          <div className="space-y-2">
            <p className="text-sm">
              <strong>ID:</strong> {deletingRecord.id}
            </p>
            <p className="text-sm">
              <strong>Site:</strong> {deletingRecord.siteName}
            </p>
            <p className="text-sm">
              <strong>Motif:</strong> {deletingRecord.reason}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
