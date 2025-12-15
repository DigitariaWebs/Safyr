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
  Image,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import type { Employee, Document, Certification } from "@/lib/types";

interface EmployeeDocumentsTabProps {
  employee: Employee;
}

export function EmployeeDocumentsTab({}: EmployeeDocumentsTabProps) {
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

  const getStatusBadge = (status: Certification["status"]) => {
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

  const handleCNAPSAccess = () => {
    // Open CNAPS DRACAR system
    window.open(
      "https://www.cnaps-securite.fr/service-dracar/",
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="space-y-6">
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
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {doc.type === "id-card" || doc.type === "health-card" ? (
                      <Image className="h-5 w-5 text-primary" />
                    ) : (
                      <FileText className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{doc.name}</h4>
                      {doc.verified && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>
                        Ajouté le {doc.uploadedAt.toLocaleDateString("fr-FR")}
                      </span>
                      {doc.expiresAt && (
                        <>
                          <span>•</span>
                          <span>
                            Expire le{" "}
                            {doc.expiresAt.toLocaleDateString("fr-FR")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CNAPS Access */}
      <Card>
        <CardHeader>
          <CardTitle>Accès CNAPS DRACAR</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold">Vérification CNAPS</h4>
                <p className="text-sm text-muted-foreground">
                  Accéder au système DRACAR pour vérifier la validité de la
                  carte professionnelle
                </p>
              </div>
            </div>
            <Button onClick={handleCNAPSAccess}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Accéder à DRACAR
            </Button>
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
          <div className="space-y-4">
            {certifications.map((cert) => {
              const statusConfig = getStatusBadge(cert.status);
              const daysUntilExpiry = Math.ceil(
                (cert.expiryDate.getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24),
              );

              return (
                <div
                  key={cert.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${statusConfig.color}`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">
                          {getCertificationLabel(cert.type)}
                        </h4>
                        <Badge variant={statusConfig.variant}>
                          {statusConfig.label}
                        </Badge>
                        {cert.verified && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>N° {cert.number}</span>
                        <span>•</span>
                        <span>Émis par {cert.issuer}</span>
                        <span>•</span>
                        <span>
                          Expire le{" "}
                          {cert.expiryDate.toLocaleDateString("fr-FR")}
                        </span>
                        {cert.status !== "expired" && daysUntilExpiry <= 90 && (
                          <>
                            <span>•</span>
                            <span className="text-orange-600 font-medium">
                              {daysUntilExpiry} jours restants
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
