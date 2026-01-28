"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Download,
  Eye,
  Trash2,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  ExternalLink,
  AlertCircle,
  Clock,
  XCircle,
} from "lucide-react";
import type {
  Employee,
  Document,
  Certification,
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
    {
      id: "5",
      name: "DPAE",
      type: "dpae",
      fileUrl: "/documents/dpae.pdf",
      uploadedAt: new Date("2020-01-14"),
      uploadedBy: "rh@safyr.com",
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
            <ImageIcon className="h-5 w-5 text-primary" />
          ) : doc.type === "dpae" || doc.type === "due" ? (
            <FileText className="h-5 w-5 text-green-600" />
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

  const [cnapsData] = useState<CNAPSAccess | null>({
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
      {/* DPAE/DUE Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            DPAE / DUE
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Déclaration Préalable À l&apos;Embauche / Déclaration Unique
            d&apos;Embauche
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {documents.filter((doc) => doc.type === "dpae" || doc.type === "due")
            .length > 0 ? (
            <div className="space-y-3">
              {documents
                .filter((doc) => doc.type === "dpae" || doc.type === "due")
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{doc.name}</p>
                          {doc.verified && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Ajouté le {doc.uploadedAt.toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        Voir
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground mb-4">
                Aucune DPAE/DUE enregistrée
              </p>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Ajouter une DPAE/DUE
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Documents</CardTitle>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Ajouter un document
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={documents.filter(
              (doc) => doc.type !== "dpae" && doc.type !== "due",
            )}
            columns={documentColumns}
            searchKeys={["name", "type"]}
            searchPlaceholder="Rechercher un document..."
            actions={(doc) => (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>

      {/* Diplomas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Diplômes</CardTitle>
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

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique</CardTitle>
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
    </div>
  );
}
