"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  Users,
} from "lucide-react";
import type { PayrollAnomaly, PayrollAnomalyType } from "@/lib/types";

// Mock data
const mockAnomalies: PayrollAnomaly[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "Jean Dupont",
    type: "missing_hours",
    description: "Heures travaillées manquantes pour décembre 2024",
    severity: "high",
    period: "2024-12",
    expectedValue: 160,
    actualValue: 145,
    status: "open",
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-20"),
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Marie Martin",
    type: "contribution_error",
    description: "Erreur dans le calcul des cotisations sociales",
    severity: "medium",
    period: "2024-12",
    expectedValue: 410,
    actualValue: 380,
    currency: "EUR",
    status: "investigating",
    createdAt: new Date("2024-12-19"),
    updatedAt: new Date("2024-12-20"),
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "Pierre Durand",
    type: "incorrect_rate",
    description: "Taux horaire incorrect appliqué",
    severity: "critical",
    period: "2024-12",
    expectedValue: 21.5,
    actualValue: 19.8,
    currency: "EUR",
    status: "open",
    createdAt: new Date("2024-12-18"),
    updatedAt: new Date("2024-12-18"),
  },
  {
    id: "4",
    employeeId: "EMP004",
    employeeName: "Sophie Leroy",
    type: "duplicate_payment",
    description: "Paiement du même montant effectué deux fois",
    severity: "high",
    period: "2024-12",
    expectedValue: 2800,
    actualValue: 5600,
    currency: "EUR",
    status: "resolved",
    resolvedBy: "Admin",
    resolvedAt: new Date("2024-12-17"),
    notes: "Doublon identifié et corrigé",
    createdAt: new Date("2024-12-16"),
    updatedAt: new Date("2024-12-17"),
  },
  {
    id: "5",
    employeeId: "EMP005",
    employeeName: "Lucas Moreau",
    type: "missing_allowance",
    description: "Indemnité de repas non versée",
    severity: "low",
    period: "2024-12",
    expectedValue: 120,
    actualValue: 0,
    currency: "EUR",
    status: "resolved",
    resolvedBy: "Admin",
    resolvedAt: new Date("2024-12-15"),
    notes: "Indemnité ajoutée manuellement",
    createdAt: new Date("2024-12-14"),
    updatedAt: new Date("2024-12-15"),
  },
];

const anomalyTypeLabels: Record<PayrollAnomalyType, string> = {
  missing_hours: "Heures manquantes",
  incorrect_rate: "Taux incorrect",
  duplicate_payment: "Paiement doublon",
  missing_allowance: "Indemnité manquante",
  contribution_error: "Erreur cotisations",
  tax_calculation_error: "Erreur impôts",
  other: "Autre",
};

const severityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

const statusLabels = {
  open: "Ouvert",
  investigating: "En cours",
  resolved: "Résolu",
  dismissed: "Rejeté",
};

export default function PayrollControlPage() {
  const [anomalies, setAnomalies] = useState<PayrollAnomaly[]>(mockAnomalies);
  const [selectedAnomaly, setSelectedAnomaly] = useState<PayrollAnomaly | null>(
    null,
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const filteredAnomalies = anomalies.filter((anomaly) => {
    if (selectedStatus !== "all" && anomaly.status !== selectedStatus)
      return false;
    if (selectedSeverity !== "all" && anomaly.severity !== selectedSeverity)
      return false;
    if (selectedType !== "all" && anomaly.type !== selectedType) return false;
    return true;
  });

  const handleViewDetails = (anomaly: PayrollAnomaly) => {
    setSelectedAnomaly(anomaly);
    setIsDetailsModalOpen(true);
  };

  const handleResolve = (anomaly: PayrollAnomaly) => {
    setSelectedAnomaly(anomaly);
    setIsResolveModalOpen(true);
  };

  const confirmResolve = (notes: string) => {
    if (selectedAnomaly) {
      setAnomalies(
        anomalies.map((a) =>
          a.id === selectedAnomaly.id
            ? {
                ...a,
                status: "resolved",
                resolvedBy: "Admin",
                resolvedAt: new Date(),
                notes,
                updatedAt: new Date(),
              }
            : a,
        ),
      );
      setIsResolveModalOpen(false);
      setSelectedAnomaly(null);
    }
  };

  const handleDismiss = (anomaly: PayrollAnomaly) => {
    setAnomalies(
      anomalies.map((a) =>
        a.id === anomaly.id
          ? {
              ...a,
              status: "dismissed",
              resolvedBy: "Admin",
              resolvedAt: new Date(),
              updatedAt: new Date(),
            }
          : a,
      ),
    );
  };

  const columns: ColumnDef<PayrollAnomaly>[] = [
    {
      key: "employee",
      label: "Employé",
      icon: Users,
      sortable: true,
      sortValue: (anomaly) => anomaly.employeeName,
      render: (anomaly) => (
        <div>
          <div className="font-medium">{anomaly.employeeName}</div>
          <div className="text-sm text-muted-foreground">
            {anomaly.employeeId}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type d'anomalie",
      sortable: true,
      render: (anomaly) => (
        <Badge variant="outline">{anomalyTypeLabels[anomaly.type]}</Badge>
      ),
    },
    {
      key: "severity",
      label: "Sévérité",
      sortable: true,
      render: (anomaly) => (
        <Badge className={severityColors[anomaly.severity]}>
          {anomaly.severity === "low"
            ? "Faible"
            : anomaly.severity === "medium"
              ? "Moyen"
              : anomaly.severity === "high"
                ? "Élevé"
                : "Critique"}
        </Badge>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (anomaly) => (
        <span className="text-sm">{anomaly.description}</span>
      ),
    },
    {
      key: "period",
      label: "Période",
      sortable: true,
      render: (anomaly) => <span className="text-sm">{anomaly.period}</span>,
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (anomaly) => (
        <Badge
          variant={
            anomaly.status === "resolved"
              ? "default"
              : anomaly.status === "investigating"
                ? "secondary"
                : anomaly.status === "dismissed"
                  ? "outline"
                  : "destructive"
          }
        >
          {statusLabels[anomaly.status]}
        </Badge>
      ),
    },
  ];

  const stats = {
    total: anomalies.length,
    open: anomalies.filter((a) => a.status === "open").length,
    investigating: anomalies.filter((a) => a.status === "investigating").length,
    resolved: anomalies.filter((a) => a.status === "resolved").length,
    critical: anomalies.filter((a) => a.severity === "critical").length,
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            Contrôle de paie
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Détection et résolution des anomalies de paie
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Analyser
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Rapport
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total anomalies
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ouvertes</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.open}</div>
            <p className="text-xs text-muted-foreground">
              Nécessitent attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <RefreshCw className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.investigating}
            </div>
            <p className="text-xs text-muted-foreground">En investigation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résolues</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.resolved}
            </div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critiques</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.critical}
            </div>
            <p className="text-xs text-muted-foreground">Priorité haute</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtres</span>
            </div>
            <div className="flex gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="open">Ouvert</SelectItem>
                    <SelectItem value="investigating">En cours</SelectItem>
                    <SelectItem value="resolved">Résolu</SelectItem>
                    <SelectItem value="dismissed">Rejeté</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Sévérité</Label>
                <Select
                  value={selectedSeverity}
                  onValueChange={setSelectedSeverity}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyen</SelectItem>
                    <SelectItem value="high">Élevé</SelectItem>
                    <SelectItem value="critical">Critique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    {Object.entries(anomalyTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Anomalies Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Anomalies détectées</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredAnomalies}
            columns={columns}
            searchKeys={["employeeName", "description"]}
            getSearchValue={(anomaly) =>
              `${anomaly.employeeName} ${anomaly.description}`
            }
            searchPlaceholder="Rechercher par employé ou description..."
            getRowId={(anomaly) => anomaly.id}
            actions={(anomaly) => (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleViewDetails(anomaly)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                {anomaly.status === "open" && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleResolve(anomaly)}
                      className="text-green-600"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDismiss(anomaly)}
                      className="text-red-600"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Modal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        type="details"
        title="Détails de l'anomalie"
        size="lg"
      >
        {selectedAnomaly && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Employé</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedAnomaly.employeeName} ({selectedAnomaly.employeeId})
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Type</Label>
                <p className="text-sm text-muted-foreground">
                  {anomalyTypeLabels[selectedAnomaly.type]}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Sévérité</Label>
                <Badge className={severityColors[selectedAnomaly.severity]}>
                  {selectedAnomaly.severity === "low"
                    ? "Faible"
                    : selectedAnomaly.severity === "medium"
                      ? "Moyen"
                      : selectedAnomaly.severity === "high"
                        ? "Élevé"
                        : "Critique"}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">Statut</Label>
                <Badge
                  variant={
                    selectedAnomaly.status === "resolved"
                      ? "default"
                      : selectedAnomaly.status === "investigating"
                        ? "secondary"
                        : selectedAnomaly.status === "dismissed"
                          ? "outline"
                          : "destructive"
                  }
                >
                  {statusLabels[selectedAnomaly.status]}
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedAnomaly.description}
              </p>
            </div>

            {(selectedAnomaly.expectedValue || selectedAnomaly.actualValue) && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Valeur attendue</Label>
                  <p className="text-sm font-mono">
                    {selectedAnomaly.expectedValue}
                    {selectedAnomaly.currency && ` ${selectedAnomaly.currency}`}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Valeur actuelle</Label>
                  <p className="text-sm font-mono">
                    {selectedAnomaly.actualValue}
                    {selectedAnomaly.currency && ` ${selectedAnomaly.currency}`}
                  </p>
                </div>
              </div>
            )}

            {selectedAnomaly.notes && (
              <div>
                <Label className="text-sm font-medium">Notes</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedAnomaly.notes}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div>
                Créée le {selectedAnomaly.createdAt.toLocaleDateString("fr-FR")}
              </div>
              <div>
                Modifiée le{" "}
                {selectedAnomaly.updatedAt.toLocaleDateString("fr-FR")}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Resolve Modal */}
      <Modal
        open={isResolveModalOpen}
        onOpenChange={setIsResolveModalOpen}
        type="form"
        title="Résoudre l'anomalie"
        actions={{
          secondary: {
            label: "Annuler",
            onClick: () => setIsResolveModalOpen(false),
            variant: "outline",
          },
          primary: {
            label: "Résoudre",
            onClick: () => {
              const notes =
                (
                  document.getElementById(
                    "resolve-notes",
                  ) as HTMLTextAreaElement
                )?.value || "";
              confirmResolve(notes);
            },
          },
        }}
      >
        {selectedAnomaly && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium">{selectedAnomaly.employeeName}</h4>
              <p className="text-sm text-muted-foreground">
                {selectedAnomaly.description}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolve-notes">Notes de résolution</Label>
              <Textarea
                id="resolve-notes"
                placeholder="Décrivez la résolution apportée..."
                rows={3}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
