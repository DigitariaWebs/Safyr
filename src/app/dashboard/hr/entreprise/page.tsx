"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  FileText,
  Upload,
  Download,
  AlertTriangle,
  ExternalLink,
  Euro,
  CreditCard,
  FileCheck,
  Edit3,
  Archive,
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  expiryDate?: string;
  status: "valid" | "expiring" | "expired";
  required: boolean;
}

interface CompanyInfo {
  name: string;
  siret: string;
  address: string;
  capitalSocial: string;
  numeroAutorisation: string;
  dirigeant: string;
  email: string;
  telephone: string;
}

const requiredDocuments = [
  { type: "cni_dirigeant", name: "CNI du dirigeant", category: "dirigeant" },
  {
    type: "carte_pro_dirigeant",
    name: "Carte pro CNAPS du dirigeant",
    category: "dirigeant",
  },
  {
    type: "carte_pro_entreprise",
    name: "Carte pro CNAPS de l'entreprise",
    category: "entreprise",
  },
  { type: "kbis", name: "Kbis", category: "entreprise" },
  {
    type: "urssaf",
    name: "Attestation de vigilance URSSAF",
    category: "attestations",
  },
  {
    type: "fiscale",
    name: "Attestation de régularité Fiscale",
    category: "attestations",
  },
  {
    type: "assurance_rc",
    name: "Attestation d'assurance RC PRO",
    category: "attestations",
  },
  { type: "rib", name: "RIB", category: "bancaire" },
];

const optionalDocuments = [
  { type: "statuts", name: "Statuts", category: "juridique" },
  { type: "pv_ag", name: "PV Assemblée Générale", category: "juridique" },
];

export default function InformationEntreprisePage() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "Safyr Security",
    siret: "12345678901234",
    address: "123 Rue de la Sécurité, 75001 Paris",
    capitalSocial: "50000",
    numeroAutorisation: "AUT-123456-CNAPS",
    dirigeant: "Jean Dupont",
    email: "contact@safyr-security.fr",
    telephone: "01 23 45 67 89",
  });

  const [documents] = useState<Document[]>([
    {
      id: "1",
      name: "CNI Jean Dupont",
      type: "cni_dirigeant",
      uploadDate: "2024-11-15",
      expiryDate: "2029-11-15",
      status: "valid",
      required: true,
    },
    {
      id: "2",
      name: "Carte Pro CNAPS - Jean Dupont",
      type: "carte_pro_dirigeant",
      uploadDate: "2024-08-10",
      expiryDate: "2025-02-15",
      status: "expiring",
      required: true,
    },
    {
      id: "3",
      name: "Attestation URSSAF",
      type: "urssaf",
      uploadDate: "2024-10-01",
      expiryDate: "2025-04-01",
      status: "expiring",
      required: true,
    },
  ]);

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const getStatusText = (status: string) => {
    switch (status) {
      case "valid":
        return "Valide";
      case "expiring":
        return "Expire bientôt";
      case "expired":
        return "Expiré";
      default:
        return "Inconnu";
    }
  };

  const handleExportPdf = (includeOptional = false) => {
    const docsToExport = documents.filter(
      (doc) => doc.required || (includeOptional && !doc.required),
    );
    console.log("Exporting PDF with documents:", docsToExport);
    // Logique d'export PDF
  };

  const handleDocumentUpload = (type: string) => {
    console.log("Uploading document for type:", type);
    // Logique d'upload
  };

  const handleBulkDownload = () => {
    const selectedDocs = documents.filter((doc) =>
      selectedDocuments.includes(doc.id),
    );
    console.log("Downloading documents:", selectedDocs);
    // Logique de téléchargement en lot
    alert(`Téléchargement de ${selectedDocs.length} document(s) en cours...`);
  };

  const toggleDocumentSelection = (docId: string) => {
    setSelectedDocuments((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId],
    );
  };

  const toggleSelectAll = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(documents.map((doc) => doc.id));
    }
  };

  const quickLinks = [
    { name: "URSSAF", url: "https://urssaf.fr", icon: ExternalLink },
    { name: "Impôts", url: "https://impots.gouv.fr", icon: ExternalLink },
    { name: "Infogreffe", url: "https://infogreffe.fr", icon: ExternalLink },
  ];

  return (
    <div className="container mx-auto p-3 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Information Entreprise</h1>
          <p className="text-muted-foreground">
            Gestion des informations et documents administratifs de
            l&apos;entreprise
          </p>
        </div>
        <div className="flex gap-2"></div>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 rounded-xl">
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="documents">Documents </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <CardTitle>Informations de l&apos;entreprise</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  {isEditing ? "Annuler" : "Modifier"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l&apos;entreprise</Label>
                  <Input
                    id="name"
                    value={companyInfo.name}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siret">SIRET</Label>
                  <Input
                    id="siret"
                    value={companyInfo.siret}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, siret: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  value={companyInfo.address}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setCompanyInfo({ ...companyInfo, address: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capital" className="flex items-center gap-2">
                    <Euro className="h-4 w-4" />
                    Capital Social (€)
                  </Label>
                  <Input
                    id="capital"
                    value={companyInfo.capitalSocial}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        capitalSocial: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="autorisation"
                    className="flex items-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    N° Autorisation CNAPS
                  </Label>
                  <Input
                    id="autorisation"
                    value={companyInfo.numeroAutorisation}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        numeroAutorisation: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dirigeant">Dirigeant</Label>
                  <Input
                    id="dirigeant"
                    value={companyInfo.dirigeant}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setCompanyInfo({
                        ...companyInfo,
                        dirigeant: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={companyInfo.email}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  value={companyInfo.telephone}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setCompanyInfo({
                      ...companyInfo,
                      telephone: e.target.value,
                    })
                  }
                />
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={() => setIsEditing(false)}>
                    Sauvegarder
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Annuler
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <div className="space-y-6">
            {/* Export Actions */}
            <div className="flex gap-2 justify-end">
              {selectedDocuments.length > 0 && (
                <Button
                  variant="default"
                  onClick={handleBulkDownload}
                  className="flex items-center gap-2"
                >
                  <Archive className="h-4 w-4" />
                  Télécharger ({selectedDocuments.length})
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => handleExportPdf(false)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exporter PDF (Documents requis)
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExportPdf(true)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exporter PDF (Tous documents)
              </Button>
            </div>
            {/* Alertes de renouvellement */}
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="h-5 w-5" />
                  Documents à Renouveler Prochainement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between py-2 px-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">
                        Cartes Pro CNAPS - Dirigeant
                      </p>
                      <p className="text-xs text-destructive">
                        Expiré le 15/02/2025
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() =>
                      window.open("https://cnaps-securite.fr", "_blank")
                    }
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Renouveler
                  </Button>
                </div>

                <div className="flex items-center justify-between py-2 px-3 bg-warning/10 border border-warning/20 rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">Kbis</p>
                      <p className="text-xs text-warning-foreground">
                        Expire le 15/04/2025
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() =>
                      window.open("https://infogreffe.fr", "_blank")
                    }
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Télécharger
                  </Button>
                </div>

                <div className="flex items-center justify-between py-2 px-3 bg-info/10 border border-info/20 rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-info rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">
                        Attestations URSSAF et Fiscales
                      </p>
                      <p className="text-xs text-info-foreground">
                        Prochaine échéance: 01/04/2025
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => window.open("https://urssaf.fr", "_blank")}
                    >
                      URSSAF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() =>
                        window.open("https://impots.gouv.fr", "_blank")
                      }
                    >
                      Impôts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liens rapides */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <ExternalLink className="h-4 w-4" />
                  Liens Rapides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {quickLinks.map((link) => (
                    <Button
                      key={link.name}
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      onClick={() => window.open(link.url, "_blank")}
                    >
                      {link.name}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Documents requis */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5" />
                    Documents Administratifs Requis
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={selectedDocuments.length === documents.length}
                      onCheckedChange={toggleSelectAll}
                    />
                    <Label htmlFor="select-all" className="text-sm">
                      Tout sélectionner
                    </Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {requiredDocuments.map((docType) => {
                    const existingDoc = documents.find(
                      (d) => d.type === docType.type,
                    );

                    // Check if document is expiring soon (within 30 days) or expired
                    const isExpiring =
                      existingDoc?.expiryDate &&
                      new Date(existingDoc.expiryDate) <=
                        new Date(Date() + 30 * 24 * 60 * 60 * 1000);
                    const isExpired =
                      existingDoc?.expiryDate &&
                      new Date(existingDoc.expiryDate) < new Date();

                    return (
                      <div
                        key={docType.type}
                        className={`flex items-center justify-between py-3 px-3 border rounded-md ${
                          isExpired
                            ? "border-destructive/20 bg-destructive/10"
                            : isExpiring
                              ? "border-warning/20 bg-warning/10"
                              : "hover:bg-accent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedDocuments.includes(
                              existingDoc?.id || "",
                            )}
                            onCheckedChange={() =>
                              toggleDocumentSelection(existingDoc?.id || "")
                            }
                            disabled={!existingDoc}
                          />
                          {isExpired || isExpiring ? (
                            <div
                              className={`w-2 h-2 rounded-full ${isExpired ? "bg-destructive" : "bg-warning"}`}
                            ></div>
                          ) : (
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div>
                            <p className="font-medium text-sm">
                              {docType.name}
                            </p>
                            {existingDoc && (
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge
                                  variant={
                                    isExpired
                                      ? "destructive"
                                      : isExpiring
                                        ? "secondary"
                                        : "default"
                                  }
                                  className="text-xs h-5"
                                >
                                  {isExpired
                                    ? "Expiré"
                                    : isExpiring
                                      ? "Expire bientôt"
                                      : getStatusText(existingDoc.status)}
                                </Badge>
                                {existingDoc.expiryDate && (
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(
                                      existingDoc.expiryDate,
                                    ).toLocaleDateString("fr-FR")}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {existingDoc && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          )}
                          {(isExpiring || isExpired) &&
                            docType.type === "kbis" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={() =>
                                  window.open("https://infogreffe.fr", "_blank")
                                }
                              >
                                Renouveler
                              </Button>
                            )}
                          {(isExpiring || isExpired) &&
                            docType.type === "urssaf" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={() =>
                                  window.open("https://urssaf.fr", "_blank")
                                }
                              >
                                URSSAF
                              </Button>
                            )}
                          {(isExpiring || isExpired) &&
                            docType.type === "fiscal" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={() =>
                                  window.open(
                                    "https://impots.gouv.fr",
                                    "_blank",
                                  )
                                }
                              >
                                Impôts
                              </Button>
                            )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleDocumentUpload(docType.type)}
                          >
                            <Upload className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Documents optionnels */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents Juridiques (Optionnels)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {optionalDocuments.map((docType) => {
                    const existingDoc = documents.find(
                      (d) => d.type === docType.type,
                    );
                    return (
                      <div
                        key={docType.type}
                        className="flex items-center justify-between py-3 px-3 border rounded-md hover:bg-accent"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">
                              {docType.name}
                            </p>
                            {existingDoc && (
                              <span className="text-xs text-muted-foreground">
                                Uploadé le{" "}
                                {new Date(
                                  existingDoc.uploadDate,
                                ).toLocaleDateString("fr-FR")}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {existingDoc && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                              >
                                Export PDF
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleDocumentUpload(docType.type)}
                          >
                            <Upload className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
