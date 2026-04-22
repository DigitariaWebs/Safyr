"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  DollarSign,
  FileText,
  CheckCircle,
  Clock,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import Image from "next/image";

interface UnknownLoss {
  id: string;
  siteId: string;
  siteName: string;
  category: string;
  description: string;
  estimatedAmount: number;
  photo?: string;
  createdAt: string;
  createdBy: string;
  status: "pending" | "validated" | "resolved";
}

const mockUnknownLosses: UnknownLoss[] = [
  {
    id: "DI-001",
    siteId: "SITE-001",
    siteName: "Centre Commercial Atlantis",
    category: "Vol",
    description: "Disparition de matériel de sécurité dans la zone parking",
    estimatedAmount: 250.0,
    photo: "/logbook/di-001.jpg",
    createdAt: "2024-12-24T10:30:00Z",
    createdBy: "Jean Dupont",
    status: "pending",
  },
  {
    id: "DI-002",
    siteId: "SITE-002",
    siteName: "Tour de Bureaux Skyline",
    category: "Dégradation",
    description: "Dégradation de mobilier urbain à l'entrée principale",
    estimatedAmount: 150.0,
    createdAt: "2024-12-23T14:15:00Z",
    createdBy: "Marie Martin",
    status: "validated",
  },
  {
    id: "DI-003",
    siteId: "SITE-001",
    siteName: "Centre Commercial Atlantis",
    category: "Perte",
    description: "Perte de matériel de communication",
    estimatedAmount: 85.0,
    photo: "/logbook/di-003.jpg",
    createdAt: "2024-12-22T08:45:00Z",
    createdBy: "Pierre Durand",
    status: "resolved",
  },
];

const categories = ["Vol", "Dégradation", "Perte", "Casse", "Autre"];

export default function UnknownLossesPage() {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewingLoss, setViewingLoss] = useState<UnknownLoss | null>(null);
  const [deletingLoss, setDeletingLoss] = useState<UnknownLoss | null>(null);
  const [formData, setFormData] = useState({
    siteId: "",
    category: "",
    description: "",
    estimatedAmount: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);

  const columns: ColumnDef<UnknownLoss>[] = [
    {
      key: "id",
      label: "ID",
      render: (loss) => <span className="font-mono text-xs">{loss.id}</span>,
    },
    {
      key: "siteName",
      label: "Site",
      render: (loss) => <span className="font-medium">{loss.siteName}</span>,
    },
    {
      key: "category",
      label: "Catégorie",
      render: (loss) => <Badge variant="outline">{loss.category}</Badge>,
    },
    {
      key: "description",
      label: "Description",
      render: (loss) => (
        <span className="text-sm line-clamp-2">{loss.description}</span>
      ),
    },
    {
      key: "estimatedAmount",
      label: "Montant estimé",
      render: (loss) => (
        <span className="font-medium">{loss.estimatedAmount.toFixed(2)} €</span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (loss) => new Date(loss.createdAt).toLocaleDateString("fr-FR"),
    },
    {
      key: "status",
      label: "Statut",
      render: (loss) => {
        const variants: Record<
          string,
          "default" | "secondary" | "outline" | "destructive"
        > = {
          pending: "outline",
          validated: "secondary",
          resolved: "default",
        };
        const labels: Record<string, string> = {
          pending: "En attente",
          validated: "Validé",
          resolved: "Résolu",
        };
        return (
          <Badge variant={variants[loss.status]}>{labels[loss.status]}</Badge>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (loss) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setViewingLoss(loss);
              setIsViewModalOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setFormData({
                siteId: loss.siteId,
                category: loss.category,
                description: loss.description,
                estimatedAmount: loss.estimatedAmount.toString(),
              });
              setIsEditModalOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setDeletingLoss(loss);
              setIsDeleteModalOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const handleCreate = () => {
    setFormData({
      siteId: "",
      category: "",
      description: "",
      estimatedAmount: "",
    });
    setPhoto(null);
    setIsNewModalOpen(true);
  };

  const handleSave = () => {
    alert("Démarque inconnue créée avec succès!");
    setIsNewModalOpen(false);
  };

  const handleEdit = () => {
    alert("Démarque inconnue modifiée avec succès!");
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    alert("Démarque inconnue supprimée avec succès!");
    setIsDeleteModalOpen(false);
    setDeletingLoss(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            Gestion de la Démarque Inconnue (DI)
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Suivi des démarques inconnues par site avec catégorisation et photos
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle DI
        </Button>
      </div>

      {/* Statistics */}
      <InfoCardContainer>
        <InfoCard
          icon={FileText}
          title="Total DI"
          value={mockUnknownLosses.length}
          color="blue"
        />
        <InfoCard
          icon={DollarSign}
          title="Montant total"
          value={`${mockUnknownLosses.reduce((sum, loss) => sum + loss.estimatedAmount, 0).toFixed(2)} €`}
          color="green"
        />
        <InfoCard
          icon={Clock}
          title="En attente"
          value={mockUnknownLosses.filter((l) => l.status === "pending").length}
          color="orange"
        />
        <InfoCard
          icon={CheckCircle}
          title="Résolues"
          value={
            mockUnknownLosses.filter((l) => l.status === "resolved").length
          }
          color="green"
        />
      </InfoCardContainer>

      {/* Table */}
      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-light">
            Liste des démarques inconnues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockUnknownLosses}
            columns={columns}
            searchKey="description"
            searchPlaceholder="Rechercher une DI..."
          />
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Modal
        open={isNewModalOpen}
        onOpenChange={setIsNewModalOpen}
        type="form"
        title="Nouvelle démarque inconnue"
        size="lg"
        actions={{
          primary: {
            label: "Créer",
            onClick: handleSave,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsNewModalOpen(false),
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="site">Site</Label>
            <Select
              value={formData.siteId}
              onValueChange={(value) =>
                setFormData({ ...formData, siteId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SITE-001">
                  Centre Commercial Atlantis
                </SelectItem>
                <SelectItem value="SITE-002">
                  Tour de Bureaux Skyline
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Catégorisation</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description détaillée de la démarque inconnue..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="amount">Montant estimé (€)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.estimatedAmount}
              onChange={(e) =>
                setFormData({ ...formData, estimatedAmount: e.target.value })
              }
              placeholder="0.00"
            />
          </div>

          <div>
            <Label>Photo</Label>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setPhoto(file);
                }}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              {photo && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Fichier sélectionné: {photo.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails de la démarque inconnue"
        size="lg"
        actions={{
          secondary: {
            label: "Fermer",
            onClick: () => setIsViewModalOpen(false),
          },
        }}
      >
        {viewingLoss && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ID</Label>
                <p className="text-sm font-mono">{viewingLoss.id}</p>
              </div>
              <div>
                <Label>Site</Label>
                <p className="text-sm font-medium">{viewingLoss.siteName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Catégorie</Label>
                <Badge variant="outline">{viewingLoss.category}</Badge>
              </div>
              <div>
                <Label>Statut</Label>
                <Badge
                  variant={
                    viewingLoss.status === "pending"
                      ? "outline"
                      : viewingLoss.status === "validated"
                        ? "secondary"
                        : "default"
                  }
                >
                  {viewingLoss.status === "pending"
                    ? "En attente"
                    : viewingLoss.status === "validated"
                      ? "Validé"
                      : "Résolu"}
                </Badge>
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <p className="text-sm whitespace-pre-wrap">
                {viewingLoss.description}
              </p>
            </div>

            <div>
              <Label>Montant estimé</Label>
              <p className="font-medium text-lg">
                {viewingLoss.estimatedAmount.toFixed(2)} €
              </p>
            </div>

            {viewingLoss.photo && (
              <div>
                <Label>Photo</Label>
                <div className="mt-2">
                  <Image
                    src={viewingLoss.photo}
                    alt="Photo DI"
                    width={400}
                    height={300}
                    className="rounded-lg border"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Créé le</Label>
                <p className="text-sm">
                  {new Date(viewingLoss.createdAt).toLocaleString("fr-FR")}
                </p>
              </div>
              <div>
                <Label>Créé par</Label>
                <p className="text-sm">{viewingLoss.createdBy}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        type="form"
        title="Modifier la démarque inconnue"
        size="lg"
        actions={{
          primary: {
            label: "Enregistrer",
            onClick: handleEdit,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsEditModalOpen(false),
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-site">Site</Label>
            <Select
              value={formData.siteId}
              onValueChange={(value) =>
                setFormData({ ...formData, siteId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SITE-001">
                  Centre Commercial Atlantis
                </SelectItem>
                <SelectItem value="SITE-002">
                  Tour de Bureaux Skyline
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="edit-category">Catégorisation</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description détaillée de la démarque inconnue..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="edit-amount">Montant estimé (€)</Label>
            <Input
              id="edit-amount"
              type="number"
              step="0.01"
              value={formData.estimatedAmount}
              onChange={(e) =>
                setFormData({ ...formData, estimatedAmount: e.target.value })
              }
              placeholder="0.00"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        type="warning"
        title="Supprimer la démarque inconnue"
        description="Êtes-vous sûr de vouloir supprimer cette démarque inconnue ? Cette action est irréversible."
        size="sm"
        actions={{
          primary: {
            label: "Supprimer",
            onClick: handleDelete,
            variant: "destructive",
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsDeleteModalOpen(false),
            variant: "outline",
          },
        }}
      >
        {deletingLoss && (
          <div className="space-y-2">
            <p className="text-sm">
              <strong>ID:</strong> {deletingLoss.id}
            </p>
            <p className="text-sm">
              <strong>Site:</strong> {deletingLoss.siteName}
            </p>
            <p className="text-sm">
              <strong>Catégorie:</strong> {deletingLoss.category}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
