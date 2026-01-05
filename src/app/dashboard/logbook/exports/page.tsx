"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileText, Archive, Search, Database } from "lucide-react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";

interface Export {
  id: string;
  type: "PDF" | "Excel" | "CSV";
  format: "daily" | "weekly" | "monthly" | "custom";
  createdAt: string;
  status: "completed" | "processing" | "failed";
  fileSize?: string;
  downloadUrl?: string;
}

interface Archive {
  id: string;
  name: string;
  period: string;
  eventCount: number;
  archivedAt: string;
  retentionUntil: string;
}

const mockExports: Export[] = [
  {
    id: "1",
    type: "PDF",
    format: "daily",
    createdAt: "2024-12-24T08:00:00Z",
    status: "completed",
    fileSize: "2.3 MB",
    downloadUrl: "#",
  },
  {
    id: "2",
    type: "Excel",
    format: "weekly",
    createdAt: "2024-12-23T18:00:00Z",
    status: "completed",
    fileSize: "1.8 MB",
    downloadUrl: "#",
  },
  {
    id: "3",
    type: "CSV",
    format: "monthly",
    createdAt: "2024-12-20T00:00:00Z",
    status: "completed",
    fileSize: "5.2 MB",
    downloadUrl: "#",
  },
];

const mockArchives: Archive[] = [
  {
    id: "1",
    name: "Archive 2024 - Q1",
    period: "Janvier - Mars 2024",
    eventCount: 1247,
    archivedAt: "2024-04-01T00:00:00Z",
    retentionUntil: "2034-04-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Archive 2024 - Q2",
    period: "Avril - Juin 2024",
    eventCount: 1356,
    archivedAt: "2024-07-01T00:00:00Z",
    retentionUntil: "2034-07-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Archive 2024 - Q3",
    period: "Juillet - Septembre 2024",
    eventCount: 1423,
    archivedAt: "2024-10-01T00:00:00Z",
    retentionUntil: "2034-10-01T00:00:00Z",
  },
];

export default function ExportsPage() {
  const [activeTab, setActiveTab] = useState<"exports" | "archives" | "search">(
    "exports",
  );
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportConfig, setExportConfig] = useState({
    type: "PDF",
    format: "daily",
    site: "all",
    startDate: "",
    endDate: "",
  });

  const exportColumns: ColumnDef<Export>[] = [
    {
      key: "type",
      label: "Type",
      render: (export_) => <Badge variant="outline">{export_.type}</Badge>,
    },
    {
      key: "format",
      label: "Format",
      render: (export_) => {
        const labels: Record<string, string> = {
          daily: "Quotidien",
          weekly: "Hebdomadaire",
          monthly: "Mensuel",
          custom: "Personnalisé",
        };
        return <span>{labels[export_.format] || export_.format}</span>;
      },
    },
    {
      key: "createdAt",
      label: "Créé le",
      render: (export_) => new Date(export_.createdAt).toLocaleString("fr-FR"),
    },
    {
      key: "status",
      label: "Statut",
      render: (export_) => {
        const variants: Record<
          string,
          "default" | "secondary" | "outline" | "destructive"
        > = {
          completed: "default",
          processing: "secondary",
          failed: "destructive",
        };
        return (
          <Badge variant={variants[export_.status]}>{export_.status}</Badge>
        );
      },
    },
    {
      key: "fileSize",
      label: "Taille",
      render: (export_) => export_.fileSize || "-",
    },
    {
      key: "actions",
      label: "Actions",
      render: (export_) => (
        <Button
          variant="outline"
          size="sm"
          disabled={export_.status !== "completed"}
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger
        </Button>
      ),
    },
  ];

  const archiveColumns: ColumnDef<Archive>[] = [
    {
      key: "name",
      label: "Nom",
      render: (archive) => <span className="font-medium">{archive.name}</span>,
    },
    {
      key: "period",
      label: "Période",
    },
    {
      key: "eventCount",
      label: "Événements",
      render: (archive) => (
        <Badge variant="outline">{archive.eventCount}</Badge>
      ),
    },
    {
      key: "archivedAt",
      label: "Archivé le",
      render: (archive) =>
        new Date(archive.archivedAt).toLocaleDateString("fr-FR"),
    },
    {
      key: "retentionUntil",
      label: "Conservation jusqu&apos;au",
      render: (archive) =>
        new Date(archive.retentionUntil).toLocaleDateString("fr-FR"),
    },
  ];

  const handleGenerateExport = () => {
    alert("Génération de l'export en cours...");
    setIsExportModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            Export, Reporting & Archivage
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Exports PDF/Excel/CSV, rapports paramétrables et archivage légal 10
            ans
          </p>
        </div>
        <Button onClick={() => setIsExportModalOpen(true)}>
          <Download className="h-4 w-4 mr-2" />
          Nouvel export
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === "exports" ? "default" : "ghost"}
          onClick={() => setActiveTab("exports")}
        >
          <FileText className="h-4 w-4 mr-2" />
          Exports
        </Button>
        <Button
          variant={activeTab === "archives" ? "default" : "ghost"}
          onClick={() => setActiveTab("archives")}
        >
          <Archive className="h-4 w-4 mr-2" />
          Archivage
        </Button>
        <Button
          variant={activeTab === "search" ? "default" : "ghost"}
          onClick={() => setActiveTab("search")}
        >
          <Search className="h-4 w-4 mr-2" />
          Recherche avancée
        </Button>
      </div>

      {/* Exports Tab */}
      {activeTab === "exports" && (
        <Card className="glass-card border-border/40">
          <CardHeader>
            <CardTitle className="text-lg font-light flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Exports disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={mockExports}
              columns={exportColumns}
              searchKey="type"
              searchPlaceholder="Rechercher un export..."
            />
          </CardContent>
        </Card>
      )}

      {/* Archives Tab */}
      {activeTab === "archives" && (
        <Card className="glass-card border-border/40">
          <CardHeader>
            <CardTitle className="text-lg font-light flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Archivage légal (10 ans)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Archivage automatique
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Conservation légale de 10 ans • Sauvegardes sécurisées
                  </p>
                </div>
              </div>
            </div>
            <DataTable
              data={mockArchives}
              columns={archiveColumns}
              searchKey="name"
              searchPlaceholder="Rechercher une archive..."
            />
          </CardContent>
        </Card>
      )}

      {/* Search Tab */}
      {activeTab === "search" && (
        <Card className="glass-card border-border/40">
          <CardHeader>
            <CardTitle className="text-lg font-light flex items-center gap-2">
              <Search className="h-5 w-5" />
              Recherche multicritère avancée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="searchSite">Site</Label>
                  <Select>
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
                  <Label htmlFor="searchType">Type d&apos;événement</Label>
                  <Select>
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
                  <Label htmlFor="searchStartDate">Date début</Label>
                  <Input id="searchStartDate" type="date" />
                </div>

                <div>
                  <Label htmlFor="searchEndDate">Date fin</Label>
                  <Input id="searchEndDate" type="date" />
                </div>

                <div>
                  <Label htmlFor="searchAgent">Agent</Label>
                  <Input id="searchAgent" placeholder="Nom de l'agent..." />
                </div>

                <div>
                  <Label htmlFor="searchSeverity">Gravité</Label>
                  <Select>
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

              <div className="flex gap-2">
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter résultats
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Modal */}
      <Modal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        type="form"
        title="Nouvel export"
        size="lg"
        actions={{
          primary: {
            label: "Générer",
            onClick: handleGenerateExport,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsExportModalOpen(false),
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="exportType">Type d&apos;export</Label>
            <Select
              value={exportConfig.type}
              onValueChange={(value) =>
                setExportConfig({ ...exportConfig, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="Excel">Excel</SelectItem>
                <SelectItem value="CSV">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="exportFormat">Format</Label>
            <Select
              value={exportConfig.format}
              onValueChange={(value) =>
                setExportConfig({ ...exportConfig, format: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Quotidien</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="monthly">Mensuel</SelectItem>
                <SelectItem value="custom">Personnalisé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {exportConfig.format === "custom" && (
            <>
              <div>
                <Label htmlFor="startDate">Date début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={exportConfig.startDate}
                  onChange={(e) =>
                    setExportConfig({
                      ...exportConfig,
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
                  value={exportConfig.endDate}
                  onChange={(e) =>
                    setExportConfig({
                      ...exportConfig,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="exportSite">Site</Label>
            <Select
              value={exportConfig.site}
              onValueChange={(value) =>
                setExportConfig({ ...exportConfig, site: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
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
        </div>
      </Modal>
    </div>
  );
}
