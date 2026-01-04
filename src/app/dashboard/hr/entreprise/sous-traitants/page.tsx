"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal } from "@/components/ui/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  FileText,
  Download,
  AlertTriangle,
  FileCheck,
  Plus,
  Edit3,
  Archive,
  ExternalLink,
  Building2,
  Upload,
} from "lucide-react";

interface SousTraitant {
  id: string;
  name: string;
  siret: string;
  address: string;
  dirigeant: string;
  email: string;
  telephone: string;
  capitalSocial: string;
  numeroAutorisation: string;
  dateDebut: string;
  statut: "actif" | "inactif" | "suspendu";
  prochainRenouvellement: string;
}

interface Document {
  id: string;
  sousTraitantId: string;
  name: string;
  type: string;
  uploadDate: string;
  expiryDate?: string;
  status: "valid" | "expiring" | "expired";
  required: boolean;
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

export default function SousTraitantsPage() {
  const [sousTraitants] = useState<SousTraitant[]>([
    {
      id: "1",
      name: "Gardiennage Plus",
      siret: "12345678901234",
      address: "456 Avenue de la Garde, 69001 Lyon",
      dirigeant: "Marie Martin",
      email: "contact@gardiennage-plus.fr",
      telephone: "04 78 12 34 56",
      capitalSocial: "25000",
      numeroAutorisation: "AUT-654321-CNAPS",
      dateDebut: "2023-01-15",
      statut: "actif",
      prochainRenouvellement: "2025-06-15",
    },
    {
      id: "2",
      name: "SecuriTech Solutions",
      siret: "98765432109876",
      address: "789 Rue de la Sécurité, 13001 Marseille",
      dirigeant: "Pierre Dubois",
      email: "info@securitech.fr",
      telephone: "04 91 23 45 67",
      capitalSocial: "75000",
      numeroAutorisation: "AUT-987654-CNAPS",
      dateDebut: "2022-08-20",
      statut: "actif",
      prochainRenouvellement: "2025-03-20",
    },
    {
      id: "3",
      name: "Protection Services",
      siret: "11223344556677",
      address: "321 Boulevard Sécurité, 33000 Bordeaux",
      dirigeant: "Sophie Bernard",
      email: "contact@protection-services.fr",
      telephone: "05 56 78 90 12",
      capitalSocial: "50000",
      numeroAutorisation: "AUT-112233-CNAPS",
      dateDebut: "2023-03-10",
      statut: "suspendu",
      prochainRenouvellement: "2025-01-10",
    },
  ]);

  const [documents] = useState<Document[]>([
    {
      id: "1",
      sousTraitantId: "1",
      name: "CNI Marie Martin",
      type: "cni_dirigeant",
      uploadDate: "2024-10-15",
      expiryDate: "2029-10-15",
      status: "valid",
      required: true,
    },
    {
      id: "2",
      sousTraitantId: "1",
      name: "Carte Pro CNAPS - Marie Martin",
      type: "carte_pro_dirigeant",
      uploadDate: "2024-08-10",
      expiryDate: "2025-03-15",
      status: "expiring",
      required: true,
    },
    {
      id: "3",
      sousTraitantId: "2",
      name: "Kbis SecuriTech",
      type: "kbis",
      uploadDate: "2024-11-01",
      expiryDate: "2025-02-01",
      status: "expiring",
      required: true,
    },
  ]);

  const [selectedSousTraitant, setSelectedSousTraitant] =
    useState<SousTraitant | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewSousTraitantModalOpen, setIsNewSousTraitantModalOpen] =
    useState(false);
  const [newSousTraitant, setNewSousTraitant] = useState<
    Omit<SousTraitant, "id">
  >({
    name: "",
    siret: "",
    address: "",
    dirigeant: "",
    email: "",
    telephone: "",
    capitalSocial: "",
    numeroAutorisation: "",
    dateDebut: new Date().toISOString().split("T")[0],
    statut: "actif",
    prochainRenouvellement: new Date(Date() + 6 * 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "actif":
        return "bg-success text-success-foreground";
      case "inactif":
        return "bg-neutral text-neutral-foreground";
      case "suspendu":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-neutral text-neutral-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "actif":
        return "Actif";
      case "inactif":
        return "Inactif";
      case "suspendu":
        return "Suspendu";
      default:
        return "Inconnu";
    }
  };

  const handleRowClick = (sousTraitant: SousTraitant) => {
    setSelectedSousTraitant(sousTraitant);
    setSelectedDocuments([]);
    setIsModalOpen(true);
  };

  const handleNewSousTraitantClick = () => {
    setNewSousTraitant({
      name: "",
      siret: "",
      address: "",
      dirigeant: "",
      email: "",
      telephone: "",
      capitalSocial: "",
      numeroAutorisation: "",
      dateDebut: new Date().toISOString().split("T")[0],
      statut: "actif",
      prochainRenouvellement: new Date(
        Date.now() + 6 * 30 * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .split("T")[0],
    });
    setIsNewSousTraitantModalOpen(true);
  };

  const handleSaveNewSousTraitant = () => {
    // Here you would typically save to a database
    console.log("Saving new sous-traitant:", newSousTraitant);
    alert("Sous-traitant créé avec succès!");
    setIsNewSousTraitantModalOpen(false);
  };

  const getSousTraitantDocuments = (sousTraitantId: string) => {
    return documents.filter((doc) => doc.sousTraitantId === sousTraitantId);
  };

  const handleExportPdf = (allDocuments: boolean) => {
    if (!selectedSousTraitant) return;
    const docs = getSousTraitantDocuments(selectedSousTraitant.id);
    const docsToExport = allDocuments
      ? docs
      : docs.filter((doc) => doc.required);
    console.log("Exporting documents:", docsToExport);
  };

  const handleDocumentUpload = (type: string) => {
    console.log("Uploading document for type:", type);
  };

  const handleBulkDownload = () => {
    if (!selectedSousTraitant) return;
    const sousTraitantDocs = getSousTraitantDocuments(selectedSousTraitant.id);
    const selectedDocs = sousTraitantDocs.filter((doc) =>
      selectedDocuments.includes(doc.id),
    );
    console.log("Downloading documents:", selectedDocs);
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
    if (!selectedSousTraitant) return;
    const sousTraitantDocs = getSousTraitantDocuments(selectedSousTraitant.id);
    if (selectedDocuments.length === sousTraitantDocs.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(sousTraitantDocs.map((doc) => doc.id));
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
          <h1 className="text-3xl font-bold">Sous-traitants</h1>
          <p className="text-muted-foreground">
            Gestion des sous-traitants et de leurs documents administratifs
          </p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={handleNewSousTraitantClick}
        >
          <Plus className="h-4 w-4" />
          Nouveau sous-traitant
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Liste des sous-traitants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entreprise</TableHead>
                <TableHead>Dirigeant</TableHead>
                <TableHead>SIRET</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Prochain renouvellement</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sousTraitants.map((sousTraitant) => (
                <TableRow
                  key={sousTraitant.id}
                  onClick={() => handleRowClick(sousTraitant)}
                  className="cursor-pointer hover:bg-accent"
                >
                  <TableCell className="font-medium">
                    <div>
                      <p className="font-semibold">{sousTraitant.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {sousTraitant.address}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{sousTraitant.dirigeant}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {sousTraitant.siret}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(sousTraitant.statut)}>
                      {getStatusText(sousTraitant.statut)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(
                      sousTraitant.prochainRenouvellement,
                    ).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{sousTraitant.email}</p>
                      <p className="text-muted-foreground">
                        {sousTraitant.telephone}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        type="form"
        size="full"
        title={selectedSousTraitant?.name || ""}
        icon={<Building2 className="h-5 w-5" />}
      >
        {selectedSousTraitant && (
          <Tabs defaultValue="info" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 rounded-xl">
              <TabsTrigger value="info">Informations</TabsTrigger>
              <TabsTrigger value="documents">Documents & Alertes</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Informations Entreprise
                    </CardTitle>
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
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nom de l&apos;entreprise</Label>
                        <Input
                          id="name"
                          value={selectedSousTraitant.name}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="siret">SIRET</Label>
                        <Input
                          id="siret"
                          value={selectedSousTraitant.siret}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Adresse</Label>
                        <Input
                          id="address"
                          value={selectedSousTraitant.address}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="capitalSocial">
                          Capital social (€)
                        </Label>
                        <Input
                          id="capitalSocial"
                          value={selectedSousTraitant.capitalSocial}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="numeroAutorisation">
                          N° Autorisation CNAPS
                        </Label>
                        <Input
                          id="numeroAutorisation"
                          value={selectedSousTraitant.numeroAutorisation}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dirigeant">Dirigeant</Label>
                        <Input
                          id="dirigeant"
                          value={selectedSousTraitant.dirigeant}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={selectedSousTraitant.email}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="telephone">Téléphone</Label>
                        <Input
                          id="telephone"
                          value={selectedSousTraitant.telephone}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex gap-2 mt-6">
                      <Button>Sauvegarder</Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
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

                {/* Documents expiring alerts */}
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-orange-700">
                      <AlertTriangle className="h-5 w-5" />
                      Documents à Renouveler Prochainement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {getSousTraitantDocuments(selectedSousTraitant.id)
                      .filter(
                        (doc) =>
                          doc.status === "expiring" || doc.status === "expired",
                      )
                      .map((doc) => (
                        <div
                          key={doc.id}
                          className={`flex items-center justify-between py-2 px-3 border rounded-md ${
                            doc.status === "expired"
                              ? "bg-destructive/10 border-destructive/20"
                              : "bg-warning/10 border-warning/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                doc.status === "expired"
                                  ? "bg-destructive"
                                  : "bg-warning"
                              }`}
                            ></div>
                            <div>
                              <p className="font-medium text-sm">{doc.name}</p>
                              <p className="text-xs">
                                {doc.status === "expired"
                                  ? "Expiré le"
                                  : "Expire le"}{" "}
                                {doc.expiryDate &&
                                  new Date(doc.expiryDate).toLocaleDateString(
                                    "fr-FR",
                                  )}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Renouveler
                          </Button>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                {/* Quick Links */}
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

                {/* Required Documents */}
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
                          checked={
                            selectedDocuments.length ===
                            getSousTraitantDocuments(selectedSousTraitant.id)
                              .length
                          }
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
                        const existingDoc = getSousTraitantDocuments(
                          selectedSousTraitant.id,
                        ).find((d) => d.type === docType.type);

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
                                  className={`w-2 h-2 rounded-full ${
                                    isExpired ? "bg-destructive" : "bg-warning"
                                  }`}
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
                                          : "Valide"}
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
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() =>
                                  handleDocumentUpload(docType.type)
                                }
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

                {/* Optional Documents */}
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
                        const existingDoc = getSousTraitantDocuments(
                          selectedSousTraitant.id,
                        ).find((d) => d.type === docType.type);
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
                                onClick={() =>
                                  handleDocumentUpload(docType.type)
                                }
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
        )}
      </Modal>

      {/* New Sous-traitant Modal */}
      <Modal
        open={isNewSousTraitantModalOpen}
        onOpenChange={setIsNewSousTraitantModalOpen}
        type="form"
        size="xl"
        title="Nouveau sous-traitant"
        icon={<Plus className="h-5 w-5" />}
        actions={{
          primary: {
            label: "Créer",
            onClick: handleSaveNewSousTraitant,
            disabled:
              !newSousTraitant.name ||
              !newSousTraitant.siret ||
              !newSousTraitant.dirigeant,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsNewSousTraitantModalOpen(false),
            variant: "outline",
          },
        }}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-name">Nom de l&apos;entreprise *</Label>
                <Input
                  id="new-name"
                  value={newSousTraitant.name}
                  onChange={(e) =>
                    setNewSousTraitant((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Ex: Gardiennage Plus"
                />
              </div>
              <div>
                <Label htmlFor="new-siret">SIRET *</Label>
                <Input
                  id="new-siret"
                  value={newSousTraitant.siret}
                  onChange={(e) =>
                    setNewSousTraitant((prev) => ({
                      ...prev,
                      siret: e.target.value,
                    }))
                  }
                  placeholder="Ex: 12345678901234"
                />
              </div>
              <div>
                <Label htmlFor="new-address">Adresse</Label>
                <Input
                  id="new-address"
                  value={newSousTraitant.address}
                  onChange={(e) =>
                    setNewSousTraitant((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="Ex: 456 Avenue de la Garde, 69001 Lyon"
                />
              </div>
              <div>
                <Label htmlFor="new-capitalSocial">Capital social (€)</Label>
                <Input
                  id="new-capitalSocial"
                  type="number"
                  value={newSousTraitant.capitalSocial}
                  onChange={(e) =>
                    setNewSousTraitant((prev) => ({
                      ...prev,
                      capitalSocial: e.target.value,
                    }))
                  }
                  placeholder="Ex: 25000"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-dirigeant">Dirigeant *</Label>
                <Input
                  id="new-dirigeant"
                  value={newSousTraitant.dirigeant}
                  onChange={(e) =>
                    setNewSousTraitant((prev) => ({
                      ...prev,
                      dirigeant: e.target.value,
                    }))
                  }
                  placeholder="Ex: Marie Martin"
                />
              </div>
              <div>
                <Label htmlFor="new-numeroAutorisation">
                  N° Autorisation CNAPS
                </Label>
                <Input
                  id="new-numeroAutorisation"
                  value={newSousTraitant.numeroAutorisation}
                  onChange={(e) =>
                    setNewSousTraitant((prev) => ({
                      ...prev,
                      numeroAutorisation: e.target.value,
                    }))
                  }
                  placeholder="Ex: AUT-654321-CNAPS"
                />
              </div>
              <div>
                <Label htmlFor="new-email">Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newSousTraitant.email}
                  onChange={(e) =>
                    setNewSousTraitant((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Ex: contact@gardiennage-plus.fr"
                />
              </div>
              <div>
                <Label htmlFor="new-telephone">Téléphone</Label>
                <Input
                  id="new-telephone"
                  value={newSousTraitant.telephone}
                  onChange={(e) =>
                    setNewSousTraitant((prev) => ({
                      ...prev,
                      telephone: e.target.value,
                    }))
                  }
                  placeholder="Ex: 04 78 12 34 56"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="new-dateDebut">Date de début de contrat</Label>
              <Input
                id="new-dateDebut"
                type="date"
                value={newSousTraitant.dateDebut}
                onChange={(e) =>
                  setNewSousTraitant((prev) => ({
                    ...prev,
                    dateDebut: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="new-prochainRenouvellement">
                Prochain renouvellement
              </Label>
              <Input
                id="new-prochainRenouvellement"
                type="date"
                value={newSousTraitant.prochainRenouvellement}
                onChange={(e) =>
                  setNewSousTraitant((prev) => ({
                    ...prev,
                    prochainRenouvellement: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
