"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import {
  BillingService,
  mockBillingServices,
  computePriceTTC,
  ServiceUnit,
  ServiceType,
  PriceBase,
} from "@/data/billing-services";

export default function BillingServicesPage() {
  const [services, setServices] =
    useState<BillingService[]>(mockBillingServices);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingService, setViewingService] = useState<BillingService | null>(
    null,
  );
  const [formData, setFormData] = useState<Partial<BillingService>>({});

  const columns: ColumnDef<BillingService>[] = useMemo(
    () => [
      {
        key: "name",
        label: "Service",
        render: (s) => <span className="font-medium">{s.name}</span>,
      },
      {
        key: "serviceType",
        label: "Type",
        render: (s) => <Badge variant="outline">{s.serviceType}</Badge>,
      },
      {
        key: "unit",
        label: "Unité",
        render: (s) => s.unit,
      },
      {
        key: "priceHT",
        label: "Prix HT",
        render: (s) => `${s.priceHT.toLocaleString("fr-FR")} €`,
      },
      {
        key: "vatRate",
        label: "TVA",
        render: (s) => `${s.vatRate}%`,
      },
      {
        key: "priceTTC",
        label: "Prix TTC",
        render: (s) => `${s.priceTTC.toLocaleString("fr-FR")} €`,
      },
    ],
    [],
  );

  const handleCreate = () => {
    setFormData({
      name: "",
      serviceType: "Service" as ServiceType,
      comment: "",
      unit: "h" as ServiceUnit,
      priceBase: "Prix HT" as PriceBase,
      priceHT: 0,
      vatRate: 20,
      priceTTC: 0,
    });
    setIsCreateModalOpen(true);
  };

  const handleSave = () => {
    const vatRate = Number(formData.vatRate || 0);
    let priceHT = 0;
    if (formData.priceBase === "Prix TTC") {
      const priceTTCInput = Number(formData.priceTTC || 0);
      priceHT = Math.round((priceTTCInput / (1 + vatRate / 100)) * 100) / 100;
    } else {
      priceHT = Number(formData.priceHT || 0);
    }
    const priceTTC = computePriceTTC(priceHT, vatRate);

    if (formData.id) {
      setServices(
        services.map((s) =>
          s.id === formData.id
            ? {
                ...s,
                ...formData,
                priceHT,
                vatRate,
                priceTTC,
                updatedAt: new Date().toISOString(),
              }
            : s,
        ),
      );
    } else {
      const newService: BillingService = {
        id: `S-${String(services.length + 1).padStart(3, "0")}`,
        code: formData.code || undefined,
        name: formData.name || "",
        serviceType: (formData.serviceType as ServiceType) || "Service",
        comment: formData.comment,
        unit: (formData.unit as ServiceUnit) || "h",
        priceBase: (formData.priceBase as PriceBase) || "Prix HT",
        priceHT,
        vatRate,
        priceTTC,
        createdAt: new Date().toISOString(),
      };
      setServices([...services, newService]);
    }

    setIsCreateModalOpen(false);
    setFormData({});
  };

  const handleRowClick = (service: BillingService) => {
    setViewingService(service);
    setIsViewModalOpen(true);
  };

  const openEditFromView = () => {
    if (!viewingService) return;
    setFormData({
      ...viewingService,
    });
    setIsViewModalOpen(false);
    setIsCreateModalOpen(true);
  };

  const computedTTC = useMemo(() => {
    const vat = Number(formData.vatRate || 0);
    if (formData.priceBase === "Prix TTC") {
      return Number(formData.priceTTC || 0);
    }
    return computePriceTTC(Number(formData.priceHT || 0), vat);
  }, [
    formData.priceHT,
    formData.priceTTC,
    formData.vatRate,
    formData.priceBase,
  ]);

  const computedHT = useMemo(() => {
    const vat = Number(formData.vatRate || 0);
    if (formData.priceBase === "Prix HT") {
      return Number(formData.priceHT || 0);
    }
    const priceTTC = Number(formData.priceTTC || 0);
    const ht = vat >= 0 ? priceTTC / (1 + vat / 100) : 0;
    return Math.round(ht * 100) / 100;
  }, [
    formData.priceHT,
    formData.priceTTC,
    formData.vatRate,
    formData.priceBase,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-muted-foreground">
            Gestion du catalogue de services (tarifs, TVA, unités)
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Service
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catalogue</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={services}
            columns={columns}
            searchKey="name"
            searchPlaceholder="Rechercher un service..."
            onRowClick={(s) => handleRowClick(s)}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        type="form"
        title={formData.id ? "Modifier le service" : "Nouveau service"}
        size="lg"
        actions={{
          primary: {
            label: formData.id ? "Modifier" : "Créer",
            onClick: handleSave,
          },
          secondary: {
            label: "Annuler",
            onClick: () => {
              setIsCreateModalOpen(false);
              setFormData({});
            },
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Nom</Label>
              <Input
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="SSIAP1, Accueil, Frais dossier..."
              />
            </div>

            <div>
              <Label>Type de service</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    serviceType: value as ServiceType,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Service">Service</SelectItem>
                  <SelectItem value="Produit">Produit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Unité</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) =>
                  setFormData({ ...formData, unit: value as ServiceUnit })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h">h</SelectItem>
                  <SelectItem value="Nbre">Nbre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label>Commentaire</Label>
              <Textarea
                value={formData.comment || ""}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                placeholder="Description optionnelle..."
                rows={4}
              />
            </div>

            <div>
              <Label>Prix basé sur</Label>
              <Select
                value={formData.priceBase}
                onValueChange={(value) =>
                  setFormData({ ...formData, priceBase: value as PriceBase })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Prix HT">Prix HT</SelectItem>
                  <SelectItem value="Prix TTC">Prix TTC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.priceBase === "Prix HT" ? (
              <div>
                <Label>Prix HT</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.priceHT ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priceHT: e.target.value ? parseFloat(e.target.value) : 0,
                    })
                  }
                />
              </div>
            ) : (
              <div>
                <Label>Prix TTC</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.priceTTC ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priceTTC: e.target.value ? parseFloat(e.target.value) : 0,
                    })
                  }
                />
              </div>
            )}

            <div>
              <Label>TVA (%)</Label>
              <Select
                value={String(formData.vatRate ?? 20)}
                onValueChange={(value) =>
                  setFormData({ ...formData, vatRate: parseFloat(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20 %</SelectItem>
                  <SelectItem value="10">10 %</SelectItem>
                  <SelectItem value="5.5">5.5 %</SelectItem>
                  <SelectItem value="0">0 %</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>
                {formData.priceBase === "Prix HT"
                  ? "Prix TTC (calculé)"
                  : "Prix HT (calculé)"}
              </Label>
              <p className="text-lg font-medium">
                {formData.priceBase === "Prix HT"
                  ? computedTTC.toLocaleString("fr-FR")
                  : computedHT.toLocaleString("fr-FR")}{" "}
                €
              </p>
            </div>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails du service"
        size="md"
        actions={{
          primary: {
            label: "Modifier",
            onClick: openEditFromView,
          },
          secondary: {
            label: "Fermer",
            onClick: () => setIsViewModalOpen(false),
          },
        }}
      >
        {viewingService && (
          <div className="space-y-4">
            <div>
              <Label>Nom</Label>
              <p className="text-sm font-medium">{viewingService.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Badge variant="outline">{viewingService.serviceType}</Badge>
              </div>
              <div>
                <Label>Unité</Label>
                <p className="text-sm">{viewingService.unit}</p>
              </div>
              <div>
                <Label>Prix HT</Label>
                <p className="text-sm">
                  {viewingService.priceHT.toLocaleString("fr-FR")} €
                </p>
              </div>
              <div>
                <Label>TVA</Label>
                <p className="text-sm">{viewingService.vatRate}%</p>
              </div>
              <div>
                <Label>Prix TTC</Label>
                <p className="text-sm">
                  {viewingService.priceTTC.toLocaleString("fr-FR")} €
                </p>
              </div>
            </div>

            {viewingService.comment && (
              <div>
                <Label>Commentaire</Label>
                <p className="text-sm whitespace-pre-wrap">
                  {viewingService.comment}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
