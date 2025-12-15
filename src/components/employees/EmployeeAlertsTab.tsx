"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  FileWarning,
  ExternalLink,
  Bell,
  BellOff,
} from "lucide-react";
import type { Employee, ExpirationAlert } from "@/types/employee";

interface EmployeeAlertsTabProps {
  employee: Employee;
}

export function EmployeeAlertsTab({ employee }: EmployeeAlertsTabProps) {
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

  const getStatusBadge = (status: ExpirationAlert["status"]) => {
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

  const getAlertTypeLabel = (type: ExpirationAlert["type"]) => {
    const labels = {
      "pro-card": "Carte Professionnelle",
      ssiap: "SSIAP",
      vm: "Visite Médicale",
      sst: "SST",
      contract: "Contrat",
      certification: "Certification",
    };
    return labels[type] || type;
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

  const criticalAlerts = alerts.filter((a) => a.severity === "critical");
  const highAlerts = alerts.filter((a) => a.severity === "high");
  const pendingAlerts = alerts.filter((a) => a.status === "pending");

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
              En attente d'action
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
          <CardTitle>Alertes d'expiration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
              alerts
                .sort((a, b) => {
                  // Sort by severity (critical first) then by days until expiry
                  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                  const severityDiff =
                    severityOrder[a.severity] - severityOrder[b.severity];
                  if (severityDiff !== 0) return severityDiff;
                  return a.daysUntilExpiry - b.daysUntilExpiry;
                })
                .map((alert) => {
                  const severityConfig = getSeverityConfig(alert.severity);
                  const statusConfig = getStatusBadge(alert.status);
                  const SeverityIcon = severityConfig.icon;
                  const StatusIcon = statusConfig.icon;

                  return (
                    <div
                      key={alert.id}
                      className={`p-4 border rounded-lg ${severityConfig.bgColor} ${severityConfig.borderColor}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div
                            className={`p-2 bg-white dark:bg-gray-900 rounded-lg ${severityConfig.color}`}
                          >
                            <SeverityIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">
                                {alert.documentName}
                              </h4>
                              <Badge variant={severityConfig.badgeVariant}>
                                {severityConfig.label}
                              </Badge>
                              <Badge variant={statusConfig.variant}>
                                <StatusIcon className="mr-1 h-3 w-3" />
                                {statusConfig.label}
                              </Badge>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">
                                    Expire le:{" "}
                                  </span>
                                  <span className="font-medium">
                                    {alert.expiryDate.toLocaleDateString("fr-FR")}
                                  </span>
                                </div>
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
                              </div>

                              {alert.status === "acknowledged" &&
                                alert.acknowledgedAt && (
                                  <div className="text-xs text-muted-foreground">
                                    Pris en compte le{" "}
                                    {alert.acknowledgedAt.toLocaleDateString(
                                      "fr-FR"
                                    )}{" "}
                                    par {alert.acknowledgedBy}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>

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
                      </div>
                    </div>
                  );
                })
            )}
          </div>
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
                <li>Critique: Document expiré ou expire dans moins de 7 jours</li>
                <li>Urgent: Expire dans moins de 30 jours</li>
                <li>Attention: Expire dans moins de 90 jours</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
