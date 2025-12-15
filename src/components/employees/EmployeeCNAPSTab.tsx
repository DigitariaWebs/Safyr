"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import {
  Shield,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Download,
  Eye,
  Clock,
} from "lucide-react";
import type { Employee, CNAPSAccess } from "@/lib/types";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";

interface EmployeeCNAPSTabProps {
  employee: Employee;
}

export function EmployeeCNAPSTab({ employee }: EmployeeCNAPSTabProps) {
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

  const getStatusBadge = (status: CNAPSAccess["status"]) => {
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

  const statusConfig = cnapsData ? getStatusBadge(cnapsData.status) : null;

  const verificationColumns: ColumnDef<(typeof verificationHistory)[0]>[] = [
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (verification) => {
        const config = getStatusBadge(verification.status);
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
                  {statusConfig && (
                    <>
                      <statusConfig.icon
                        className={`h-5 w-5 text-${statusConfig.color.split("-")[1]}-600`}
                      />
                      <Badge variant={statusConfig.variant}>
                        {statusConfig.label}
                      </Badge>
                    </>
                  )}
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
