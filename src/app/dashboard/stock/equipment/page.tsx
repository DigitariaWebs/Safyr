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
import { mockEquipment, Equipment } from "@/data/stock-equipment";

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<Equipment>>({});

  const columns: ColumnDef<Equipment>[] = [
    {
      key: "sku",
      label: "SKU",
      sortable: true,
    },
    {
      key: "name",
      label: "Nom",
      sortable: true,
    },
    {
      key: "category",
      label: "Catégorie",
      render: (equip) => (
        <Badge variant="secondary">{equip.category}</Badge>
      ),
    },
    {
      key: "brand",
      label: "Marque",
    },
    {
      key: "quantity",
      label: "Quantité",
      render: (equip) => (
        <span
          className={
            equip.quantity < 20
              ? "text-red-600 font-semibold"
              : "font-semibold"
          }
        >
          {equip.quantity}
        </span>
      ),
    },
    {
      key: "unitPrice",
      label: "Prix Unit.",
      render: (equip) => `${equip.unitPrice.toFixed(2)} €`,
    },
    {
      key: "status",
      label: "Statut",
      render: (equip) => (
        <Badge
          variant={
            equip.status === "En stock"
              ? "default"
              : equip.status === "Attribué"
                ? "secondary"
                : "outline"
          }
        >
          {equip.status}
        </Badge>
      ),
    },
  ];

  const handleCreate = () => {
    setFormData({
      status: "En stock",
      quantity: 0,
      unitPrice: 0,
    });
    setIsCreateModalOpen(true);
  };

  const handleSave = () => {
    if (formData.id) {
      setEquipment(
        equipment.map((e) => (e.id === formData.id ? { ...e, ...formData } : e))
      );
    } else {
      const newEquipment: Equipment = {
        id: (equipment.length + 1).toString(),
        sku: formData.sku || "",
        category: formData.category || "Matériel",
        name: formData.name || "",
        brand: formData.brand || "",
        serialNumber: formData.serialNumber,
        size: formData.size,
        quantity: formData.quantity || 0,
        unitPrice: formData.unitPrice || 0,
        supplier: formData.supplier || "",
        status: formData.status || "En stock",
        lastUpdate: new Date().toISOString().split("T")[0],
      };
      setEquipment([...equipment, newEquipment]);
    }
    setIsCreateModalOpen(false);
    setFormData({});
  };

  const handleRowClick = (equip: Equipment) => {
    setSelectedEquipment(equip);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Référentiel Équipements</h1>
          <p className="text-muted-foreground">
            Gestion du catalogue d&apos;équipements et du stock
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Équipement
        </Button>
      </div>

      <DataTable
        data={equipment}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Rechercher un équipement..."
        onRowClick={handleRowClick}
      />

      {/* Create/Edit Modal */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        type="form"
        title={formData.id ? "Modifier l'équipement" : "Nouvel équipement"}
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
            <div>
              <Label htmlFor="sku">SKU / Code article</Label>
              <Input
                id="sku"
                value={formData.sku || ""}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                placeholder="UNI-VEST-001"
              />
            </div>

            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    category: value as Equipment["category"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Uniform">Uniform</SelectItem>
                  <SelectItem value="EPI">EPI</SelectItem>
                  <SelectItem value="Matériel">Matériel</SelectItem>
                  <SelectItem value="Badge">Badge</SelectItem>
                  <SelectItem value="Consommable">Consommable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="name">Nom de l&apos;équipement</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Veste Agent Sécurité"
              />
            </div>

            <div>
              <Label htmlFor="brand">Marque</Label>
              <Input
                id="brand"
                value={formData.brand || ""}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                placeholder="SecuriWear"
              />
            </div>

            <div>
              <Label htmlFor="supplier">Fournisseur</Label>
              <Input
                id="supplier"
                value={formData.supplier || ""}
                onChange={(e) =>
                  setFormData({ ...formData, supplier: e.target.value })
                }
                placeholder="Fournisseur A"
              />
            </div>

            <div>
              <Label htmlFor="serialNumber">Numéro de série (optionnel)</Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, serialNumber: e.target.value })
                }
                placeholder="SN-2024-001"
              />
            </div>

            <div>
              <Label htmlFor="size">Taille (optionnel)</Label>
              <Input
                id="size"
                value={formData.size || ""}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
                placeholder="L"
              />
            </div>

            <div>
              <Label htmlFor="quantity">Quantité</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="unitPrice">Prix unitaire (€)</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                value={formData.unitPrice || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unitPrice: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as Equipment["status"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En stock">En stock</SelectItem>
                  <SelectItem value="Attribué">Attribué</SelectItem>
                  <SelectItem value="Perdu">Perdu</SelectItem>
                  <SelectItem value="HS">HS</SelectItem>
                  <SelectItem value="Réformé">Réformé</SelectItem>
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
        title="Détails de l'équipement"
        size="lg"
        actions={{
          secondary: {
            label: "Fermer",
            onClick: () => setIsViewModalOpen(false),
          },
        }}
      >
        {selectedEquipment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>SKU</Label>
                <p className="text-sm font-medium">{selectedEquipment.sku}</p>
              </div>

              <div>
                <Label>Catégorie</Label>
                <Badge variant="secondary">{selectedEquipment.category}</Badge>
              </div>

              <div className="col-span-2">
                <Label>Nom</Label>
                <p className="text-sm font-medium">{selectedEquipment.name}</p>
              </div>

              <div>
                <Label>Marque</Label>
                <p className="text-sm font-medium">{selectedEquipment.brand}</p>
              </div>

              <div>
                <Label>Fournisseur</Label>
                <p className="text-sm font-medium">
                  {selectedEquipment.supplier}
                </p>
              </div>

              {selectedEquipment.serialNumber && (
                <div>
                  <Label>Numéro de série</Label>
                  <p className="text-sm font-medium">
                    {selectedEquipment.serialNumber}
                  </p>
                </div>
              )}

              {selectedEquipment.size && (
                <div>
                  <Label>Taille</Label>
                  <p className="text-sm font-medium">
                    {selectedEquipment.size}
                  </p>
                </div>
              )}

              <div>
                <Label>Quantité</Label>
                <p className="text-sm font-medium">
                  {selectedEquipment.quantity}
                </p>
              </div>

              <div>
                <Label>Prix unitaire</Label>
                <p className="text-sm font-medium">
                  {selectedEquipment.unitPrice.toFixed(2)} €
                </p>
              </div>

              <div>
                <Label>Valeur totale</Label>
                <p className="text-sm font-medium">
                  {(
                    selectedEquipment.quantity * selectedEquipment.unitPrice
                  ).toFixed(2)}{" "}
                  €
                </p>
              </div>

              <div>
                <Label>Statut</Label>
                <Badge
                  variant={
                    selectedEquipment.status === "En stock"
                      ? "default"
                      : "secondary"
                  }
                >
                  {selectedEquipment.status}
                </Badge>
              </div>

              <div>
                <Label>Dernière mise à jour</Label>
                <p className="text-sm font-medium">
                  {new Date(selectedEquipment.lastUpdate).toLocaleDateString(
                    "fr-FR"
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

