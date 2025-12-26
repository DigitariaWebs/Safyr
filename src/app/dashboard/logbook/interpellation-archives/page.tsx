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
} from "lucide-react";
import { Modal } from "@/components/ui/modal";

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
    description: "Personne suspecte observée dans le parking. Contrôle d'identité effectué.",
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
    description: "Tentative d'accès non autorisé détectée. Intervention immédiate.",
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
  "Comportement suspect",
  "Tentative d'intrusion",
  "Vérification d'identité",
  "Contrôle d'accès",
  "Autre",
];

export default function InterpellationArchivesPage() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<InterpellationRecord | null>(null);
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
    filteredRecords = filteredRecords.filter((r) => r.siteId === searchFilters.site);
  }
  if (searchFilters.agent) {
    filteredRecords = filteredRecords.filter((r) =>
      r.agentName.toLowerCase().includes(searchFilters.agent.toLowerCase())
    );
  }
  if (searchFilters.reason !== "all") {
    filteredRecords = filteredRecords.filter((r) => r.reason === searchFilters.reason);
  }
  if (searchFilters.startDate) {
    filteredRecords = filteredRecords.filter(
      (r) => new Date(r.date) >= new Date(searchFilters.startDate)
    );
  }
  if (searchFilters.endDate) {
    filteredRecords = filteredRecords.filter(
      (r) => new Date(r.date) <= new Date(searchFilters.endDate)
    );
  }
  if (searchFilters.searchTerm) {
    filteredRecords = filteredRecords.filter(
      (r) =>
        r.description.toLowerCase().includes(searchFilters.searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchFilters.searchTerm.toLowerCase())
    );
  }

  const columns: ColumnDef<InterpellationRecord>[] = [
    {
      key: "id",
      label: "ID",
      render: (record) => <span className="font-mono text-xs">{record.id}</span>,
    },
    {
      key: "siteName",
      label: "Site",
      render: (record) => <span className="font-medium">{record.siteName}</span>,
    },
    {
      key: "date",
      label: "Date",
      render: (record) =>
        new Date(record.date).toLocaleString("fr-FR"),
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
  ];

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
                  <SelectItem value="SITE-001">Centre Commercial Atlantis</SelectItem>
                  <SelectItem value="SITE-002">Tour de Bureaux Skyline</SelectItem>
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
                  setSearchFilters({ ...searchFilters, startDate: e.target.value })
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
                  setSearchFilters({ ...searchFilters, endDate: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="searchTerm">Recherche texte</Label>
              <Input
                id="searchTerm"
                value={searchFilters.searchTerm}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, searchTerm: e.target.value })
                }
                placeholder="Rechercher dans les descriptions..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total fiches</CardTitle>
            <FileText className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredRecords.length}</div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archivées</CardTitle>
            <Shield className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {filteredRecords.filter((r) => r.status === "archived").length}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actives</CardTitle>
            <FileText className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredRecords.filter((r) => r.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sites concernés</CardTitle>
            <MapPin className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(filteredRecords.map((r) => r.siteId)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-light">Fiches d&apos;interpellation</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredRecords}
            columns={columns}
            searchKey="description"
            searchPlaceholder="Rechercher une fiche..."
            onRowClick={(record) => {
              setViewingRecord(record);
              setIsViewModalOpen(true);
            }}
          />
        </CardContent>
      </Card>

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails de la fiche d&apos;interpellation"
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
              <p className="text-sm whitespace-pre-wrap">{viewingRecord.description}</p>
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
                variant={viewingRecord.status === "archived" ? "default" : "secondary"}
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
    </div>
  );
}

