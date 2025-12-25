"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Download } from "lucide-react";
import { mockBillingClients } from "@/data/billing-clients";
import { mockVATConfigs, VATConfig } from "@/data/billing-vat-configs";

export default function BillingVATPage() {
  const [configs, setConfigs] = useState<VATConfig[]>(mockVATConfigs);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<VATConfig | null>(null);
  const [formData, setFormData] = useState<Partial<VATConfig>>({});

  const columns: ColumnDef<VATConfig>[] = [
    {
      key: "clientName",
      label: "Client",
      render: (config) => config.clientName || "Configuration générale",
    },
    {
      key: "serviceType",
      label: "Type de prestation",
      render: (config) => config.serviceType || "Tous",
    },
    {
      key: "vatRate",
      label: "Taux TVA",
      render: (config) => (
        <span className="font-semibold">{config.vatRate}%</span>
      ),
    },
    {
      key: "electronicInvoice",
      label: "Facture électronique",
      render: (config) => (
        <Badge variant={config.electronicInvoice ? "default" : "outline"}>
          {config.electronicInvoice ? "Activée" : "Désactivée"}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Statut",
      render: (config) => (
        <Badge variant={config.status === "Actif" ? "default" : "outline"}>
          {config.status}
        </Badge>
      ),
    },
  ];

  const handleCreate = () => {
    setFormData({
      vatRate: 20,
      electronicInvoice: false,
      status: "Actif",
    });
    setIsCreateModalOpen(true);
  };

  const handleSave = () => {
    if (formData.id) {
      setConfigs(
        configs.map((c) => (c.id === formData.id ? { ...c, ...formData } : c))
      );
    } else {
      const client = mockBillingClients.find((c) => c.id === formData.clientId);
      const newConfig: VATConfig = {
        id: (configs.length + 1).toString(),
        clientId: formData.clientId,
        clientName: client?.name,
        serviceType: formData.serviceType,
        vatRate: formData.vatRate || 20,
        electronicInvoice: formData.electronicInvoice || false,
        status: formData.status || "Actif",
      };
      setConfigs([...configs, newConfig]);
    }
    setIsCreateModalOpen(false);
    setFormData({});
  };

  const handleRowClick = (config: VATConfig) => {
    setSelectedConfig(config);
    setIsViewModalOpen(true);
  };

  const handleExport = () => {
    // Simulate export
    alert("Export fiscal en cours...");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion de la TVA & Conformité Fiscale</h1>
          <p className="text-muted-foreground">
            Paramétrage TVA par client/prestation, gestion multi-taux, conformité facturation électronique
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Fiscaux
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Configuration
          </Button>
        </div>
      </div>

      <DataTable
        data={configs}
        columns={columns}
        searchKey="clientName"
        searchPlaceholder="Rechercher une configuration..."
        onRowClick={handleRowClick}
      />

      {/* Create/Edit Modal */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        type="form"
        title={formData.id ? "Modifier la configuration" : "Nouvelle configuration TVA"}
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
              <Label htmlFor="clientId">Client (optionnel - pour configuration générale, laisser vide)</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => {
                  const client = mockBillingClients.find((c) => c.id === value);
                  setFormData({
                    ...formData,
                    clientId: value,
                    clientName: client?.name,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Configuration générale" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Configuration générale</SelectItem>
                  {mockBillingClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="serviceType">Type de prestation (optionnel)</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) =>
                  setFormData({ ...formData, serviceType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  <SelectItem value="Gardiennage">Gardiennage</SelectItem>
                  <SelectItem value="Rondes">Rondes</SelectItem>
                  <SelectItem value="Événementiel">Événementiel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vatRate">Taux TVA (%)</Label>
              <Select
                value={formData.vatRate?.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, vatRate: parseFloat(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5.5">5.5% (Réduit)</SelectItem>
                  <SelectItem value="10">10% (Intermédiaire)</SelectItem>
                  <SelectItem value="20">20% (Normal)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 flex items-center space-x-2">
              <Checkbox
                id="electronicInvoice"
                checked={formData.electronicInvoice}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, electronicInvoice: checked as boolean })
                }
              />
              <Label
                htmlFor="electronicInvoice"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Facturation électronique conforme (nouvelle réglementation)
              </Label>
            </div>

            <div>
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as VATConfig["status"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
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
        title="Détails de la configuration TVA"
        size="lg"
        actions={{
          secondary: {
            label: "Fermer",
            onClick: () => setIsViewModalOpen(false),
          },
        }}
      >
        {selectedConfig && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Client</Label>
                <p className="text-sm font-medium">
                  {selectedConfig.clientName || "Configuration générale"}
                </p>
              </div>

              <div>
                <Label>Type de prestation</Label>
                <p className="text-sm font-medium">
                  {selectedConfig.serviceType || "Tous"}
                </p>
              </div>

              <div>
                <Label>Taux TVA</Label>
                <p className="text-sm font-semibold">{selectedConfig.vatRate}%</p>
              </div>

              <div>
                <Label>Facture électronique</Label>
                <Badge variant={selectedConfig.electronicInvoice ? "default" : "outline"}>
                  {selectedConfig.electronicInvoice ? "Activée" : "Désactivée"}
                </Badge>
              </div>

              <div>
                <Label>Statut</Label>
                <Badge variant={selectedConfig.status === "Actif" ? "default" : "outline"}>
                  {selectedConfig.status}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

