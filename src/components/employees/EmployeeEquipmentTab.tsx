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
import { DataTable, ColumnDef } from "@/components/ui/DataTable";

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

  const equipmentColumns: ColumnDef<Equipment>[] = [
    {
      key: "icon",
      label: "",
      render: (item) => {
        const Icon = getEquipmentIcon(item.type);
        return (
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        );
      },
    },
    {
      key: "name",
      label: "Équipement",
      sortable: true,
      render: (item) => {
        const statusConfig = getStatusBadge(item.status);
        const StatusIcon = statusConfig.icon;
        return (
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              <span className="font-semibold truncate">{item.name}</span>
              <Badge variant="outline" className="shrink-0">
                {getEquipmentTypeLabel(item.type)}
              </Badge>
              <Badge variant={statusConfig.variant} className="shrink-0">
                <StatusIcon className="mr-1 h-3 w-3" />
                {statusConfig.label}
              </Badge>
            </div>
            {item.serialNumber && (
              <p className="text-sm text-muted-foreground truncate">
                N° série: {item.serialNumber}
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: "description",
      label: "Description",
      render: (item) => (
        <span className="text-sm text-muted-foreground truncate block max-w-xs">
          {item.description || "-"}
        </span>
      ),
    },
    {
      key: "assignedAt",
      label: "Date d'assignation",
      sortable: true,
      render: (item) => (
        <span className="text-sm">
          {item.assignedAt.toLocaleDateString("fr-FR")}
        </span>
      ),
    },
    {
      key: "condition",
      label: "État",
      sortable: true,
      render: (item) => (
        <div className="space-y-1">
          <span className="text-sm">{getConditionLabel(item.condition)}</span>
          {item.issuanceSignature && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <FileSignature className="h-3 w-3" />
              Signé
            </div>
          )}
        </div>
      ),
    },
  ];

  const returnedEquipmentColumns: ColumnDef<Equipment>[] = [
    {
      key: "icon",
      label: "",
      render: (item) => {
        const Icon = getEquipmentIcon(item.type);
        return (
          <div className="p-2 bg-muted rounded-lg">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
        );
      },
    },
    {
      key: "name",
      label: "Équipement",
      sortable: true,
      render: (item) => {
        const statusConfig = getStatusBadge(item.status);
        const StatusIcon = statusConfig.icon;
        return (
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className="font-semibold truncate">{item.name}</span>
            <Badge variant="outline" className="shrink-0">
              {getEquipmentTypeLabel(item.type)}
            </Badge>
            <Badge variant={statusConfig.variant} className="shrink-0">
              <StatusIcon className="mr-1 h-3 w-3" />
              {statusConfig.label}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "assignedAt",
      label: "Période",
      render: (item) => (
        <div className="text-xs text-muted-foreground">
          {item.assignedAt.toLocaleDateString("fr-FR")} →{" "}
          {item.returnedAt?.toLocaleDateString("fr-FR")}
        </div>
      ),
    },
    {
      key: "returnSignature",
      label: "Retour",
      render: (item) => (
        <>
          {item.returnSignature && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <FileSignature className="h-3 w-3" />
              Retour signé
            </div>
          )}
        </>
      ),
    },
  ];

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
          {assignedEquipment.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun équipement assigné
            </div>
          ) : (
            <DataTable
              data={assignedEquipment}
              columns={equipmentColumns}
              searchKeys={["name", "serialNumber", "description"]}
              searchPlaceholder="Rechercher un équipement..."
              itemsPerPage={10}
              filters={[
                {
                  key: "type",
                  label: "Type",
                  options: [
                    { value: "all", label: "Tous" },
                    { value: "PPE", label: "EPI" },
                    { value: "RADIO", label: "Radio" },
                    { value: "KEYS", label: "Clés" },
                    { value: "UNIFORM", label: "Uniforme" },
                    { value: "BADGE", label: "Badge" },
                    { value: "VEHICLE", label: "Véhicule" },
                  ],
                },
                {
                  key: "condition",
                  label: "État",
                  options: [
                    { value: "all", label: "Tous" },
                    { value: "new", label: "Neuf" },
                    { value: "good", label: "Bon état" },
                    { value: "fair", label: "État moyen" },
                    { value: "poor", label: "Mauvais état" },
                    { value: "damaged", label: "Endommagé" },
                  ],
                },
              ]}
              actions={() => (
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
              )}
            />
          )}
        </CardContent>
      </Card>

      {/* Returned Equipment History */}
      {returnedEquipment.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des équipements retournés</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={returnedEquipment}
              columns={returnedEquipmentColumns}
              searchKeys={["name", "serialNumber"]}
              searchPlaceholder="Rechercher dans l'historique..."
              itemsPerPage={10}
              actions={() => (
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              )}
            />
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
