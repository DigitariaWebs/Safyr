"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import {
  Upload,
  Download,
  Eye,
  Trash2,
  FileText,
  Image,
  CheckCircle,
  ExternalLink,
  AlertTriangle,
  AlertCircle,
  Clock,
  FileWarning,
  Bell,
  BellOff,
  Shield,
  RefreshCw,
  XCircle,
  Search,
} from "lucide-react";
import type {
  Employee,
  Document,
  Certification,
  ExpirationAlert,
  CNAPSAccess,
} from "@/lib/types";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";

interface EmployeeDocumentsTabProps {
  employee: Employee;
}

export function EmployeeDocumentsTab({ employee }: EmployeeDocumentsTabProps) {
  const [documents] = useState<Document[]>([
    {
      id: "1",
      name: "Carte d'identité",
      type: "id-card",
      fileUrl: "/documents/id-card.pdf",
      uploadedAt: new Date("2024-01-15"),
      uploadedBy: "admin@safyr.com",
      expiresAt: new Date("2029-01-15"),
      verified: true,
    },
    {
      id: "2",
      name: "Carte Vitale",
      type: "health-card",
      fileUrl: "/documents/health-card.pdf",
      uploadedAt: new Date("2024-02-01"),
      uploadedBy: "admin@safyr.com",
      verified: true,
    },
    {
      id: "3",
      name: "CV",
      type: "cv",
      fileUrl: "/documents/cv.pdf",
      uploadedAt: new Date("2020-01-10"),
      uploadedBy: "jean.dupont@safyr.com",
      verified: true,
    },
    {
      id: "4",
      name: "Justificatif de domicile",
      type: "proof-address",
      fileUrl: "/documents/proof-address.pdf",
      uploadedAt: new Date("2024-11-01"),
      uploadedBy: "admin@safyr.com",
      expiresAt: new Date("2025-11-01"),
      verified: true,
    },
  ]);

  const [certifications] = useState<Certification[]>([
    {
      id: "1",
      type: "CQP_APS",
      number: "CQP-2019-12345",
      issueDate: new Date("2019-06-15"),
      expiryDate: new Date("2029-06-15"),
      fileUrl: "/documents/cqp-aps.pdf",
      issuer: "CPNEFP Sécurité Privée",
      verified: true,
      status: "valid",
    },
    {
      id: "2",
      type: "CNAPS",
      number: "CNP-75-2020-001-23456",
      issueDate: new Date("2020-01-10"),
      expiryDate: new Date("2025-01-10"),
      fileUrl: "/documents/cnaps.pdf",
      issuer: "CNAPS",
      verified: true,
      status: "expiring-soon",
    },
    {
      id: "3",
      type: "SSIAP1",
      number: "SSIAP1-2021-456",
      issueDate: new Date("2021-03-20"),
      expiryDate: new Date("2024-03-20"),
      fileUrl: "/documents/ssiap1.pdf",
      issuer: "Centre de Formation Sécurité",
      verified: true,
      status: "expired",
    },
    {
      id: "4",
      type: "SST",
      number: "SST-2023-789",
      issueDate: new Date("2023-05-15"),
      expiryDate: new Date("2025-05-15"),
      fileUrl: "/documents/sst.pdf",
      issuer: "INRS",
      verified: true,
      status: "valid",
    },
  ]);

  const getCertificationStatusBadge = (status: Certification["status"]) => {
    const config = {
      valid: {
        variant: "default" as const,
        label: "Valide",
        color: "bg-green-500",
      },
      expired: {
        variant: "destructive" as const,
        label: "Expiré",
        color: "bg-red-500",
      },
      "expiring-soon": {
        variant: "secondary" as const,
        label: "Expire bientôt",
        color: "bg-orange-500",
      },
      "pending-renewal": {
        variant: "outline" as const,
        label: "À renouveler",
        color: "bg-yellow-500",
      },
    };
    return config[status];
  };

  const getCertificationLabel = (type: Certification["type"]) => {
    const labels = {
      CQP_APS: "CQP/APS",
      CNAPS: "Carte Professionnelle CNAPS",
      SSIAP1: "SSIAP 1",
      SSIAP2: "SSIAP 2",
      SSIAP3: "SSIAP 3",
      SST: "SST",
      VM: "Visite Médicale",
      H0B0: "H0B0",
      FIRE: "Habilitation Incendie",
    };
    return labels[type] || type;
  };

  const documentColumns: ColumnDef<Document>[] = [
    {
      key: "icon",
      label: "",
      render: (doc) => (
        <div className="p-2 bg-primary/10 rounded-lg">
          {doc.type === "id-card" || doc.type === "health-card" ? (
            <Image className="h-5 w-5 text-primary" />
          ) : (
            <FileText className="h-5 w-5 text-primary" />
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Document",
      sortable: true,
      render: (doc) => (
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold truncate">{doc.name}</span>
          {doc.verified && (
            <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
          )}
        </div>
      ),
    },
    {
      key: "uploadedAt",
      label: "Date d'ajout",
      sortable: true,
      render: (doc) => doc.uploadedAt.toLocaleDateString("fr-FR"),
    },
    {
      key: "expiresAt",
      label: "Date d'expiration",
      sortable: true,
      render: (doc) =>
        doc.expiresAt ? doc.expiresAt.toLocaleDateString("fr-FR") : "-",
    },
  ];

  const certificationColumns: ColumnDef<Certification>[] = [
    {
      key: "status",
      label: "Statut",
      render: (cert) => {
        const statusConfig = getCertificationStatusBadge(cert.status);
        return <div className={`w-3 h-3 rounded-full ${statusConfig.color}`} />;
      },
    },
    {
      key: "type",
      label: "Certification",
      sortable: true,
      render: (cert) => (
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold truncate">
            {getCertificationLabel(cert.type)}
          </span>
          {cert.verified && (
            <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
          )}
        </div>
      ),
    },
    {
      key: "number",
      label: "Numéro",
      render: (cert) => <span className="truncate">{cert.number}</span>,
    },
    {
      key: "issuer",
      label: "Émetteur",
      render: (cert) => <span className="truncate">{cert.issuer}</span>,
    },
    {
      key: "expiryDate",
      label: "Date d'expiration",
      sortable: true,
      render: (cert) => {
        const statusConfig = getCertificationStatusBadge(cert.status);
        const daysUntilExpiry = Math.ceil(
          (cert.expiryDate.getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        );
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span>{cert.expiryDate.toLocaleDateString("fr-FR")}</span>
              <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
            </div>
            {cert.status !== "expired" && daysUntilExpiry <= 90 && (
              <span className="text-xs text-orange-600 font-medium">
                {daysUntilExpiry} jours restants
              </span>
            )}
          </div>
        );
      },
    },
  ];

  const [alerts] = useState<ExpirationAlert[]>([
    {
      id: "1",
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      type: "pro-card",
      documentName: "Carte Professionnelle CNAPS",
      expiryDate: new Date("2025-01-10"),
      daysUntilExpiry: 26,
      severity: "high",
      status: "pending",
    },
    {
      id: "2",
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      type: "ssiap",
      documentName: "SSIAP 1",
      expiryDate: new Date("2024-03-20"),
      daysUntilExpiry: -270,
      severity: "critical",
      status: "pending",
    },
    {
      id: "3",
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      type: "sst",
      documentName: "SST (Sauveteur Secouriste du Travail)",
      expiryDate: new Date("2025-05-15"),
      daysUntilExpiry: 151,
      severity: "medium",
      status: "acknowledged",
      acknowledgedAt: new Date("2024-12-01"),
      acknowledgedBy: "admin@safyr.com",
    },
    {
      id: "4",
      employeeId: employee.id,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      type: "vm",
      documentName: "Visite Médicale",
      expiryDate: new Date("2025-02-28"),
      daysUntilExpiry: 75,
      severity: "medium",
      status: "pending",
    },
  ]);

  const [isVerifying, setIsVerifying] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [cnapsData, setCnapsData] = useState<CNAPSAccess | null>({
    employeeId: employee.id,
    cnapsNumber: "CNAPS-2024-001234",
    lastChecked: new Date("2024-12-15T10:30:00"),
    status: "valid",
    dracarLink: `https://dracar.cnaps-securite.fr/employee/${employee.id}`,
  });

  const [verificationHistory] = useState([
    {
      id: "1",
      date: new Date("2024-12-15T10:30:00"),
      status: "valid" as const,
      checkedBy: "admin@safyr.com",
      notes: "Carte professionnelle valide jusqu'au 10/01/2025",
    },
    {
      id: "2",
      date: new Date("2024-11-15T09:15:00"),
      status: "valid" as const,
      checkedBy: "admin@safyr.com",
      notes: "Vérification mensuelle - Tout est en ordre",
    },
    {
      id: "3",
      date: new Date("2024-10-15T14:20:00"),
      status: "valid" as const,
      checkedBy: "admin@safyr.com",
      notes: "Renouvellement de la carte effectué",
    },
  ]);

  const getSeverityConfig = (severity: ExpirationAlert["severity"]) => {
    const config = {
      critical: {
        icon: AlertTriangle,
        color: "text-red-600",
        bgColor: "bg-red-50 dark:bg-red-950/20",
        borderColor: "border-red-200 dark:border-red-900",
        label: "Critique",
        badgeVariant: "destructive" as const,
      },
      high: {
        icon: AlertCircle,
        color: "text-orange-600",
        bgColor: "bg-orange-50 dark:bg-orange-950/20",
        borderColor: "border-orange-200 dark:border-orange-900",
        label: "Urgent",
        badgeVariant: "secondary" as const,
      },
      medium: {
        icon: FileWarning,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
        borderColor: "border-yellow-200 dark:border-yellow-900",
        label: "Attention",
        badgeVariant: "outline" as const,
      },
      low: {
        icon: Clock,
        color: "text-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-950/20",
        borderColor: "border-blue-200 dark:border-blue-900",
        label: "Information",
        badgeVariant: "outline" as const,
      },
    };
    return config[severity];
  };

  const getAlertStatusBadge = (status: ExpirationAlert["status"]) => {
    const config = {
      pending: {
        variant: "destructive" as const,
        label: "En attente",
        icon: Bell,
      },
      acknowledged: {
        variant: "secondary" as const,
        label: "Pris en compte",
        icon: BellOff,
      },
      resolved: {
        variant: "default" as const,
        label: "Résolu",
        icon: CheckCircle,
      },
    };
    return config[status];
  };

  const formatDaysRemaining = (days: number) => {
    if (days < 0) {
      return `Expiré depuis ${Math.abs(days)} jours`;
    } else if (days === 0) {
      return "Expire aujourd'hui";
    } else if (days === 1) {
      return "Expire demain";
    } else {
      return `${days} jours restants`;
    }
  };

  const getCNAPSStatusBadge = (status: CNAPSAccess["status"]) => {
    const variants = {
      valid: {
        variant: "default" as const,
        label: "Valide",
        color: "bg-green-500",
        icon: CheckCircle,
      },
      invalid: {
        variant: "destructive" as const,
        label: "Invalide",
        color: "bg-red-500",
        icon: XCircle,
      },
      pending: {
        variant: "secondary" as const,
        label: "En attente",
        color: "bg-yellow-500",
        icon: Clock,
      },
      error: {
        variant: "outline" as const,
        label: "Erreur",
        color: "bg-gray-500",
        icon: AlertCircle,
      },
    };
    return variants[status];
  };

  const handleVerifyCNAPS = async () => {
    setIsVerifying(true);
    setShowVerificationModal(true);

    // Simulate API call to CNAPS DRACAR
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsVerifying(false);
    setCnapsData((prev) =>
      prev
        ? {
            ...prev,
            lastChecked: new Date(),
            status: "valid",
          }
        : null,
    );
  };

  const handleOpenDRACAR = () => {
    if (cnapsData?.dracarLink) {
      window.open(cnapsData.dracarLink, "_blank", "noopener,noreferrer");
    } else {
      window.open(
        "https://www.cnaps-securite.fr/service-dracar/",
        "_blank",
        "noopener,noreferrer",
      );
    }
  };

  const criticalAlerts = alerts.filter((a) => a.severity === "critical");
  const highAlerts = alerts.filter((a) => a.severity === "high");
  const pendingAlerts = alerts.filter((a) => a.status === "pending");

  const alertColumns: ColumnDef<ExpirationAlert>[] = [
    {
      key: "severity",
      label: "Gravité",
      sortable: true,
      render: (alert) => {
        const severityConfig = getSeverityConfig(alert.severity);
        const SeverityIcon = severityConfig.icon;
        return (
          <div className="flex items-center gap-2">
            <div
              className={`p-2 bg-white dark:bg-gray-900 rounded-lg ${severityConfig.color}`}
            >
              <SeverityIcon className="h-5 w-5" />
            </div>
            <Badge variant={severityConfig.badgeVariant}>
              {severityConfig.label}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "documentName",
      label: "Document",
      sortable: true,
      render: (alert) => {
        const statusConfig = getAlertStatusBadge(alert.status);
        const StatusIcon = statusConfig.icon;
        return (
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold truncate">
                {alert.documentName}
              </span>
              <Badge variant={statusConfig.variant} className="shrink-0">
                <StatusIcon className="mr-1 h-3 w-3" />
                {statusConfig.label}
              </Badge>
            </div>
          </div>
        );
      },
    },
    {
      key: "expiryDate",
      label: "Date d'expiration",
      sortable: true,
      render: (alert) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{alert.expiryDate.toLocaleDateString("fr-FR")}</span>
        </div>
      ),
    },
    {
      key: "daysUntilExpiry",
      label: "Temps restant",
      sortable: true,
      render: (alert) => (
        <div
          className={`flex items-center gap-2 ${
            alert.daysUntilExpiry < 0
              ? "text-red-600 font-semibold"
              : alert.daysUntilExpiry < 30
                ? "text-orange-600 font-semibold"
                : ""
          }`}
        >
          <Clock className="h-4 w-4" />
          {formatDaysRemaining(alert.daysUntilExpiry)}
        </div>
      ),
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (alert) => (
        <div className="text-xs text-muted-foreground">
          {alert.status === "acknowledged" && alert.acknowledgedAt && (
            <div>
              Pris en compte le{" "}
              {alert.acknowledgedAt.toLocaleDateString("fr-FR")}
              <br />
              par {alert.acknowledgedBy}
            </div>
          )}
        </div>
      ),
    },
  ];

  const verificationColumns: ColumnDef<(typeof verificationHistory)[0]>[] = [
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (verification) => {
        const config = getCNAPSStatusBadge(verification.status);
        return (
          <div className="flex items-center gap-2">
            <config.icon
              className={`h-5 w-5 text-${config.color.split("-")[1]}-600`}
            />
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
        );
      },
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (verification) => (
        <span className="text-sm">
          {verification.date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "notes",
      label: "Notes",
      render: (verification) => (
        <span className="text-sm truncate block max-w-md">
          {verification.notes}
        </span>
      ),
    },
    {
      key: "checkedBy",
      label: "Vérifié par",
      render: (verification) => (
        <span className="text-xs text-muted-foreground">
          {verification.checkedBy}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Alert Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Alertes critiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {criticalAlerts.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Documents expirés ou critiques
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              Alertes urgentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {highAlerts.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Expirent dans moins de 30 jours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4" />
              En attente d&apos;action
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              Alertes non traitées
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Alertes d&apos;expiration</CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Aucune alerte active
              </h3>
              <p className="text-sm text-muted-foreground">
                Tous les documents sont à jour
              </p>
            </div>
          ) : (
            <DataTable
              data={alerts}
              columns={alertColumns}
              searchKeys={["documentName", "type"]}
              searchPlaceholder="Rechercher une alerte..."
              itemsPerPage={10}
              filters={[
                {
                  key: "severity",
                  label: "Gravité",
                  options: [
                    { value: "all", label: "Tous" },
                    { value: "critical", label: "Critique" },
                    { value: "high", label: "Urgent" },
                    { value: "medium", label: "Attention" },
                    { value: "low", label: "Information" },
                  ],
                },
                {
                  key: "status",
                  label: "Statut",
                  options: [
                    { value: "all", label: "Tous" },
                    { value: "pending", label: "En attente" },
                    { value: "acknowledged", label: "Pris en compte" },
                    { value: "resolved", label: "Résolu" },
                  ],
                },
              ]}
              actions={(alert) => (
                <div className="flex gap-2">
                  {alert.status === "pending" && (
                    <Button variant="outline" size="sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Accuser réception
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Renouveler
                  </Button>
                </div>
              )}
              rowClassName={(alert) => {
                const severityConfig = getSeverityConfig(alert.severity);
                return `${severityConfig.bgColor} ${severityConfig.borderColor}`;
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Alert Settings Info */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Alertes automatiques
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Les alertes sont générées automatiquement selon les délais
                suivants :
              </p>
              <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1 list-disc list-inside">
                <li>
                  Critique: Document expiré ou expire dans moins de 7 jours
                </li>
                <li>Urgent: Expire dans moins de 30 jours</li>
                <li>Attention: Expire dans moins de 90 jours</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Files Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Documents administratifs</CardTitle>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Ajouter un document
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={documents}
            columns={documentColumns}
            searchKeys={["name", "type"]}
            searchPlaceholder="Rechercher un document..."
            itemsPerPage={10}
            actions={() => (
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* CNAPS Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Statut CNAPS DRACAR
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cnapsData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {(() => {
                    const statusConfig = getCNAPSStatusBadge(cnapsData.status);
                    return (
                      <>
                        <statusConfig.icon
                          className={`h-5 w-5 text-${statusConfig.color.split("-")[1]}-600`}
                        />
                        <Badge variant={statusConfig.variant}>
                          {statusConfig.label}
                        </Badge>
                      </>
                    );
                  })()}
                  <span className="text-sm text-muted-foreground">
                    Dernière vérification:{" "}
                    {cnapsData.lastChecked?.toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleVerifyCNAPS}
                    disabled={isVerifying}
                  >
                    <RefreshCw
                      className={`mr-2 h-4 w-4 ${isVerifying ? "animate-spin" : ""}`}
                    />
                    {isVerifying ? "Vérification..." : "Vérifier"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenDRACAR}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ouvrir DRACAR
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm font-medium">Numéro CNAPS</Label>
                  <p className="text-lg font-mono">{cnapsData.cnapsNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Statut de la carte
                  </Label>
                  <p className="text-lg">Professionnelle active</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Aucune donnée CNAPS trouvée pour cet employé
              </p>
              <Button
                className="mt-4"
                onClick={handleVerifyCNAPS}
                disabled={isVerifying}
              >
                <Search className="mr-2 h-4 w-4" />
                {isVerifying ? "Recherche..." : "Rechercher dans DRACAR"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Professional Card Details */}
      {cnapsData && (
        <Card>
          <CardHeader>
            <CardTitle>Carte Professionnelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Type d&apos;agent
                </Label>
                <p className="font-medium">Agent de sécurité</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Catégorie
                </Label>
                <p className="font-medium">A - Surveillance humaine</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Date de délivrance
                </Label>
                <p className="font-medium">15/01/2024</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Date d&apos;expiration
                </Label>
                <p className="font-medium">10/01/2025</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Qualifications</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">SSIAP 1</Badge>
                <Badge variant="outline">SST</Badge>
                <Badge variant="outline">H0B0</Badge>
                <Badge variant="outline">Permis B</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des vérifications</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={verificationHistory}
            columns={verificationColumns}
            searchKeys={["notes", "checkedBy"]}
            searchPlaceholder="Rechercher dans l'historique..."
            itemsPerPage={10}
            filters={[
              {
                key: "status",
                label: "Statut",
                options: [
                  { value: "all", label: "Tous" },
                  { value: "valid", label: "Valide" },
                  { value: "invalid", label: "Invalide" },
                  { value: "pending", label: "En attente" },
                  { value: "error", label: "Erreur" },
                ],
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Direct DRACAR Access */}
      <Card>
        <CardHeader>
          <CardTitle>Accès Direct DRACAR</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Accédez directement au système CNAPS DRACAR pour consulter ou
              mettre à jour les informations de cet employé.
            </p>

            <div className="flex gap-2">
              <Button onClick={handleOpenDRACAR}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Ouvrir DRACAR
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Télécharger attestation
              </Button>
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Voir carte numérique
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diplomas and Certifications Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Diplômes et certifications</CardTitle>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Ajouter une certification
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={certifications}
            columns={certificationColumns}
            searchKeys={["type", "number", "issuer"]}
            searchPlaceholder="Rechercher une certification..."
            itemsPerPage={10}
            filters={[
              {
                key: "status",
                label: "Statut",
                options: [
                  { value: "all", label: "Tous" },
                  { value: "valid", label: "Valide" },
                  { value: "expiring-soon", label: "Expire bientôt" },
                  { value: "expired", label: "Expiré" },
                  { value: "pending-renewal", label: "À renouveler" },
                ],
              },
            ]}
            actions={() => (
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Verification Modal */}
      <Modal
        open={showVerificationModal}
        onOpenChange={setShowVerificationModal}
        type="details"
        title="Vérification CNAPS en cours"
        description="Connexion au système DRACAR pour vérifier la validité de la carte professionnelle"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
            <div>
              <p className="font-medium">Vérification en cours...</p>
              <p className="text-sm text-muted-foreground">
                Recherche dans la base CNAPS DRACAR
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Connexion à DRACAR</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex justify-between text-sm">
              <span>Recherche du numéro CNAPS</span>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex justify-between text-sm">
              <span>Vérification de la validité</span>
              {isVerifying ? (
                <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
            </div>
          </div>

          {!isVerifying && (
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="font-medium text-green-800 dark:text-green-200">
                  Vérification terminée avec succès
                </p>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                La carte professionnelle CNAPS-2024-001234 est valide
                jusqu&apos;au 10/01/2025.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
