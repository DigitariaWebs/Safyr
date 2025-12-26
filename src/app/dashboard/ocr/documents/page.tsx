"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { mockOCRDocuments, OCRDocument } from "@/data/ocr-documents";

export default function OCRDocumentsPage() {
  const [documents, setDocuments] = useState<OCRDocument[]>(mockOCRDocuments);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<OCRDocument | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<OCRDocument>>({});

  const columns: ColumnDef<OCRDocument>[] = [
    {
      key: "type",
      label: "Type de document",
      sortable: true,
    },
    {
      key: "fileName",
      label: "Fichier",
      render: (doc) => (
        <span className="font-mono text-sm">{doc.fileName}</span>
      ),
    },
    {
      key: "status",
      label: "Statut",
      render: (doc) => {
        const variant =
          doc.status === "Traité"
            ? "default"
            : doc.status === "En traitement"
              ? "secondary"
              : doc.status === "Erreur"
                ? "destructive"
                : "outline";
        return <Badge variant={variant}>{doc.status}</Badge>;
      },
    },
    {
      key: "confidence",
      label: "Confiance",
      render: (doc) => (
        <span className={doc.confidence >= 90 ? "text-green-600" : doc.confidence >= 70 ? "text-orange-600" : "text-red-600"}>
          {doc.confidence > 0 ? `${doc.confidence}%` : "-"}
        </span>
      ),
    },
    {
      key: "assignedTo",
      label: "Module",
      render: (doc) => (
        <Badge variant="outline">{doc.assignedTo || "Non assigné"}</Badge>
      ),
    },
    {
      key: "uploadDate",
      label: "Date",
      render: (doc) =>
        new Date(doc.uploadDate).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
  ];

  const handleCreate = () => {
    setFormData({
      status: "En attente",
      confidence: 0,
    });
    setIsCreateModalOpen(true);
  };

  const handleSave = () => {
    if (formData.id) {
      setDocuments(
        documents.map((d) =>
          d.id === formData.id ? { ...d, ...formData } : d
        )
      );
    } else {
      const newDocument: OCRDocument = {
        id: (documents.length + 1).toString(),
        type: formData.type || "Facture fournisseur",
        fileName: formData.fileName || "",
        uploadDate: new Date().toISOString(),
        status: formData.status || "En attente",
        confidence: formData.confidence || 0,
        extractedData: formData.extractedData,
        assignedTo: formData.assignedTo,
      };
      setDocuments([...documents, newDocument]);
    }
    setIsCreateModalOpen(false);
    setFormData({});
  };

  const handleRowClick = (document: OCRDocument) => {
    setSelectedDocument(document);
    setIsViewModalOpen(true);
  };

  const documentTypes: OCRDocument["type"][] = [
    "Facture fournisseur",
    "Avoir",
    "Dépense diverse",
    "Note de frais",
    "Devis / Contrat client",
    "Relevé bancaire",
    "Justificatif de paiement",
    "Bordereau",
    "Arrêt maladie",
    "Justificatif d'absence",
    "Fiche mutuelle / prévoyance",
    "Contrat / Avenant",
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Types de Documents</h1>
          <p className="text-muted-foreground">
            Gestion des types de documents pris en charge par l&apos;OCR
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Document
        </Button>
      </div>

      <DataTable
        data={documents}
        columns={columns}
        searchKey="fileName"
        searchPlaceholder="Rechercher un document..."
        onRowClick={handleRowClick}
      />

      {/* Create/Edit Modal */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        type="form"
        title={formData.id ? "Modifier le document" : "Nouveau document OCR"}
        size="lg"
        actions={{
          primary: {
            label: formData.id ? "Modifier" : "Créer",
            onClick: handleSave,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsCreateModalOpen(false),
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="type">Type de document</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    type: value as OCRDocument["type"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="fileName">Nom du fichier</Label>
              <Input
                id="fileName"
                value={formData.fileName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fileName: e.target.value })
                }
                placeholder="document.pdf"
              />
            </div>

            <div>
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as OCRDocument["status"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="En traitement">En traitement</SelectItem>
                  <SelectItem value="Traité">Traité</SelectItem>
                  <SelectItem value="Erreur">Erreur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="confidence">Confiance (%)</Label>
              <Input
                id="confidence"
                type="number"
                min="0"
                max="100"
                value={formData.confidence || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confidence: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="assignedTo">Module destination</Label>
              <Select
                value={formData.assignedTo}
                onValueChange={(value) =>
                  setFormData({ ...formData, assignedTo: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Comptabilité">Comptabilité</SelectItem>
                  <SelectItem value="Banque">Banque</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                  <SelectItem value="Facturation">Facturation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails du document OCR"
        size="lg"
        actions={{
          secondary: {
            label: "Fermer",
            onClick: () => setIsViewModalOpen(false),
          },
        }}
      >
        {selectedDocument && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Type de document</Label>
                <p className="text-sm font-medium">{selectedDocument.type}</p>
              </div>

              <div className="col-span-2">
                <Label>Nom du fichier</Label>
                <p className="text-sm font-mono">{selectedDocument.fileName}</p>
              </div>

              <div>
                <Label>Statut</Label>
                <Badge
                  variant={
                    selectedDocument.status === "Traité"
                      ? "default"
                      : selectedDocument.status === "En traitement"
                        ? "secondary"
                        : selectedDocument.status === "Erreur"
                          ? "destructive"
                          : "outline"
                  }
                >
                  {selectedDocument.status}
                </Badge>
              </div>

              <div>
                <Label>Confiance</Label>
                <p
                  className={`text-sm font-medium ${
                    selectedDocument.confidence >= 90
                      ? "text-green-600"
                      : selectedDocument.confidence >= 70
                        ? "text-orange-600"
                        : "text-red-600"
                  }`}
                >
                  {selectedDocument.confidence > 0
                    ? `${selectedDocument.confidence}%`
                    : "Non calculé"}
                </p>
              </div>

              <div>
                <Label>Module destination</Label>
                <Badge variant="outline">
                  {selectedDocument.assignedTo || "Non assigné"}
                </Badge>
              </div>

              <div>
                <Label>Date de téléversement</Label>
                <p className="text-sm font-medium">
                  {new Date(selectedDocument.uploadDate).toLocaleString("fr-FR")}
                </p>
              </div>

              {selectedDocument.extractedData && (
                <div className="col-span-2 border-t pt-4">
                  <Label className="text-base font-semibold">
                    Données extraites
                  </Label>
                  <div className="mt-2 space-y-2">
                    {selectedDocument.extractedData.amount && (
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Montant:{" "}
                        </span>
                        <span className="text-sm font-medium">
                          {selectedDocument.extractedData.amount.toLocaleString(
                            "fr-FR"
                          )}{" "}
                          €
                        </span>
                      </div>
                    )}
                    {selectedDocument.extractedData.date && (
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Date:{" "}
                        </span>
                        <span className="text-sm font-medium">
                          {selectedDocument.extractedData.date}
                        </span>
                      </div>
                    )}
                    {selectedDocument.extractedData.supplier && (
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Fournisseur:{" "}
                        </span>
                        <span className="text-sm font-medium">
                          {selectedDocument.extractedData.supplier}
                        </span>
                      </div>
                    )}
                    {selectedDocument.extractedData.account && (
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Compte:{" "}
                        </span>
                        <span className="text-sm font-medium">
                          {selectedDocument.extractedData.account}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}


