"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Radio,
  Key,
  Shield,
  Car,
  FileSignature,
} from "lucide-react";
import type { Employee, Equipment } from "@/lib/types";

interface EmployeeEquipmentTabProps {
  employee: Employee;
}

export function EmployeeEquipmentTab({}: EmployeeEquipmentTabProps) {
  const [equipment] = useState<Equipment[]>([
    {
      id: "1",
      name: "Gilet pare-balles",
      type: "PPE",
      serialNumber: "PPE-2024-001234",
      description: "Gilet pare-balles niveau IIIA",
      assignedAt: new Date("2024-01-15"),
      assignedBy: "admin@safyr.com",
      issuanceSignature: {
        signedAt: new Date("2024-01-15T10:30:00"),
        signedBy: "Jean Dupont",
        signatureData: "base64_signature_data",
        ipAddress: "192.168.1.100",
      },
      condition: "good",
      status: "assigned",
      notes: "Contrôle annuel prévu en janvier 2025",
    },
    {
      id: "2",
      name: "Radio Motorola",
      type: "RADIO",
      serialNumber: "MTR-2023-567890",
      description: "Radio portable Motorola DP4400e",
      assignedAt: new Date("2023-06-01"),
      assignedBy: "admin@safyr.com",
      issuanceSignature: {
        signedAt: new Date("2023-06-01T14:20:00"),
        signedBy: "Jean Dupont",
        signatureData: "base64_signature_data",
      },
      condition: "good",
      status: "assigned",
    },
    {
      id: "3",
      name: "Trousseau de clés - Bâtiment A",
      type: "KEYS",
      serialNumber: "KEY-A-123",
      description: "Accès principal, accès technique, bureau sécurité",
      assignedAt: new Date("2024-01-15"),
      assignedBy: "admin@safyr.com",
      issuanceSignature: {
        signedAt: new Date("2024-01-15T10:35:00"),
        signedBy: "Jean Dupont",
        signatureData: "base64_signature_data",
      },
      condition: "good",
      status: "assigned",
    },
    {
      id: "4",
      name: "Uniforme complet",
      type: "UNIFORM",
      description: "Veste, pantalon, chemise (x3)",
      assignedAt: new Date("2024-01-15"),
      assignedBy: "admin@safyr.com",
      issuanceSignature: {
        signedAt: new Date("2024-01-15T10:40:00"),
        signedBy: "Jean Dupont",
        signatureData: "base64_signature_data",
      },
      condition: "good",
      status: "assigned",
    },
    {
      id: "5",
      name: "Badge d'accès",
      type: "BADGE",
      serialNumber: "BADGE-001234",
      description: "Badge RFID multi-sites",
      assignedAt: new Date("2023-03-10"),
      assignedBy: "admin@safyr.com",
      returnedAt: new Date("2023-12-20"),
      returnedBy: "admin@safyr.com",
      issuanceSignature: {
        signedAt: new Date("2023-03-10T09:00:00"),
        signedBy: "Jean Dupont",
        signatureData: "base64_signature_data",
      },
      returnSignature: {
        signedAt: new Date("2023-12-20T17:30:00"),
        signedBy: "Jean Dupont",
        signatureData: "base64_signature_data",
      },
      condition: "good",
      status: "returned",
      notes: "Remplacé par nouveau badge le 20/12/2023",
    },
  ]);

  const getEquipmentIcon = (type: Equipment["type"]) => {
    const icons = {
      PPE: Shield,
      RADIO: Radio,
      KEYS: Key,
      UNIFORM: Package,
      BADGE: FileSignature,
      VEHICLE: Car,
      OTHER: Package,
    };
    return icons[type] || Package;
  };

  const getEquipmentTypeLabel = (type: Equipment["type"]) => {
    const labels = {
      PPE: "EPI",
      RADIO: "Radio",
      KEYS: "Clés",
      UNIFORM: "Uniforme",
      BADGE: "Badge",
      VEHICLE: "Véhicule",
      OTHER: "Autre",
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: Equipment["status"]) => {
    const config = {
      assigned: {
        variant: "default" as const,
        label: "Assigné",
        icon: CheckCircle,
        color: "text-green-600",
      },
      returned: {
        variant: "secondary" as const,
        label: "Retourné",
        icon: CheckCircle,
        color: "text-blue-600",
      },
      lost: {
        variant: "destructive" as const,
        label: "Perdu",
        icon: XCircle,
        color: "text-red-600",
      },
      damaged: {
        variant: "destructive" as const,
        label: "Endommagé",
        icon: AlertCircle,
        color: "text-orange-600",
      },
    };
    return config[status];
  };

  const getConditionLabel = (condition: Equipment["condition"]) => {
    const labels = {
      new: "Neuf",
      good: "Bon état",
      fair: "État moyen",
      poor: "Mauvais état",
      damaged: "Endommagé",
    };
    return labels[condition] || condition;
  };

  const assignedEquipment = equipment.filter((eq) => eq.status === "assigned");
  const returnedEquipment = equipment.filter((eq) => eq.status === "returned");

  return (
    <div className="space-y-6">
      {/* Equipment Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Équipements assignés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedEquipment.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Total historique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipment.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Signatures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {equipment.filter((eq) => eq.issuanceSignature).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Equipment */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Équipements actuellement assignés</CardTitle>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Assigner équipement
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignedEquipment.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun équipement assigné
              </div>
            ) : (
              assignedEquipment.map((item) => {
                const Icon = getEquipmentIcon(item.type);
                const statusConfig = getStatusBadge(item.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={item.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <Badge variant="outline">
                            {getEquipmentTypeLabel(item.type)}
                          </Badge>
                          <Badge variant={statusConfig.variant}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig.label}
                          </Badge>
                        </div>
                        {item.serialNumber && (
                          <p className="text-sm text-muted-foreground mb-1">
                            N° série: {item.serialNumber}
                          </p>
                        )}
                        {item.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.description}
                          </p>
                        )}
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>
                            Assigné le{" "}
                            {item.assignedAt.toLocaleDateString("fr-FR")}
                          </span>
                          <span>•</span>
                          <span>État: {getConditionLabel(item.condition)}</span>
                          {item.issuanceSignature && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <FileSignature className="h-3 w-3" />
                                Signé numériquement
                              </span>
                            </>
                          )}
                        </div>
                        {item.notes && (
                          <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                            📝 {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Détails
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileSignature className="mr-2 h-4 w-4" />
                        Retour
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Returned Equipment History */}
      {returnedEquipment.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des équipements retournés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {returnedEquipment.map((item) => {
                const Icon = getEquipmentIcon(item.type);
                const statusConfig = getStatusBadge(item.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30"
                  >
                    <div className="p-2 bg-muted rounded-lg">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <Badge variant="outline">
                          {getEquipmentTypeLabel(item.type)}
                        </Badge>
                        <Badge variant={statusConfig.variant}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>
                          Assigné: {item.assignedAt.toLocaleDateString("fr-FR")}
                        </span>
                        <span>•</span>
                        <span>
                          Retourné:{" "}
                          {item.returnedAt?.toLocaleDateString("fr-FR")}
                        </span>
                        {item.returnSignature && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <FileSignature className="h-3 w-3" />
                              Retour signé
                            </span>
                          </>
                        )}
                      </div>
                      {item.notes && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {item.notes}
                        </p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Digital Signature Info */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <FileSignature className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Signature électronique des équipements
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Chaque attribution et retour d&apos;équipement est signé
                numériquement par l&apos;employé. Les signatures sont horodatées
                et sécurisées pour garantir la traçabilité complète.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
