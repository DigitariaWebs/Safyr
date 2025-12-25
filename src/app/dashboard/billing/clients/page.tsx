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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { mockBillingClients, BillingClient } from "@/data/billing-clients";

export default function BillingClientsPage() {
  const [clients, setClients] = useState<BillingClient[]>(mockBillingClients);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<BillingClient | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<BillingClient>>({});

  const columns: ColumnDef<BillingClient>[] = [
    {
      key: "name",
      label: "Client",
      sortable: true,
    },
    {
      key: "siret",
      label: "SIRET",
    },
    {
      key: "contractType",
      label: "Type Contrat",
      render: (client) => (
        <Badge variant="secondary">{client.contractType}</Badge>
      ),
    },
    {
      key: "sites",
      label: "Sites",
    },
    {
      key: "hourlyRate",
      label: "Taux Horaire",
      render: (client) => `${client.hourlyRate} €/h`,
    },
    {
      key: "paymentTerm",
      label: "Délai Paiement",
      render: (client) => `${client.paymentTerm} jours`,
    },
    {
      key: "status",
      label: "Statut",
      render: (client) => (
        <Badge
          variant={
            client.status === "Actif"
              ? "default"
              : client.status === "Suspendu"
                ? "secondary"
                : "outline"
          }
        >
          {client.status}
        </Badge>
      ),
    },
  ];

  const handleCreate = () => {
    setFormData({
      contractType: "Mensuel",
      serviceType: "Gardiennage",
      contractStartDate: new Date().toISOString().split("T")[0],
      sites: 1,
      hourlyRate: 25,
      nightBonus: 15,
      sundayBonus: 30,
      holidayBonus: 50,
      status: "Actif",
      billingDay: 1,
      paymentTerm: 30,
    });
    setIsCreateModalOpen(true);
  };

  const handleSave = () => {
    if (formData.id) {
      setClients(
        clients.map((c) => (c.id === formData.id ? { ...c, ...formData } : c))
      );
    } else {
      const newClient: BillingClient = {
        id: (clients.length + 1).toString(),
        name: formData.name || "",
        siret: formData.siret || "",
        contractType: formData.contractType || "Mensuel",
        serviceType: formData.serviceType || "Gardiennage",
        contractStartDate: formData.contractStartDate || new Date().toISOString().split("T")[0],
        contractEndDate: formData.contractEndDate,
        monthlyHours: formData.monthlyHours,
        sites: formData.sites || 1,
        hourlyRate: formData.hourlyRate || 25,
        nightBonus: formData.nightBonus || 15,
        sundayBonus: formData.sundayBonus || 30,
        holidayBonus: formData.holidayBonus || 50,
        indexationRate: formData.indexationRate,
        status: formData.status || "Actif",
        billingDay: formData.billingDay || 1,
        paymentTerm: formData.paymentTerm || 30,
        lastInvoice: new Date().toISOString().split("T")[0],
        agentTypes: formData.agentTypes,
        planningVolumes: formData.planningVolumes,
      };
      setClients([...clients, newClient]);
    }
    setIsCreateModalOpen(false);
    setFormData({});
  };

  const handleRowClick = (client: BillingClient) => {
    setSelectedClient(client);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Référentiel Clients</h1>
          <p className="text-muted-foreground">
            Gestion des contrats et des conditions de facturation
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Client
        </Button>
      </div>

      <DataTable
        data={clients}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Rechercher un client..."
        onRowClick={handleRowClick}
      />

      {/* Create/Edit Modal */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        type="form"
        title={formData.id ? "Modifier le client" : "Nouveau client"}
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
              <Label htmlFor="name">Nom du client</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Centre Commercial..."
              />
            </div>

            <div>
              <Label htmlFor="siret">SIRET</Label>
              <Input
                id="siret"
                value={formData.siret || ""}
                onChange={(e) =>
                  setFormData({ ...formData, siret: e.target.value })
                }
                placeholder="12345678901234"
              />
            </div>

            <div>
              <Label htmlFor="contractType">Type de contrat</Label>
              <Select
                value={formData.contractType}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    contractType: value as BillingClient["contractType"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mensuel">Mensuel</SelectItem>
                  <SelectItem value="Forfaitaire">Forfaitaire</SelectItem>
                  <SelectItem value="Heure réelle">Heure réelle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="serviceType">Type de prestation</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    serviceType: value as BillingClient["serviceType"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gardiennage">Gardiennage</SelectItem>
                  <SelectItem value="Rondes">Rondes</SelectItem>
                  <SelectItem value="Événementiel">Événementiel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contractStartDate">Date début contrat</Label>
              <Input
                id="contractStartDate"
                type="date"
                value={formData.contractStartDate || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contractStartDate: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="contractEndDate">Date fin contrat (optionnel)</Label>
              <Input
                id="contractEndDate"
                type="date"
                value={formData.contractEndDate || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contractEndDate: e.target.value || undefined,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="monthlyHours">Volumes horaires mensuels (h)</Label>
              <Input
                id="monthlyHours"
                type="number"
                value={formData.monthlyHours || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monthlyHours: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="720"
              />
            </div>

            <div>
              <Label htmlFor="indexationRate">Indexation contractuelle (%)</Label>
              <Input
                id="indexationRate"
                type="number"
                step="0.1"
                value={formData.indexationRate || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    indexationRate: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                placeholder="2.5"
              />
            </div>

            <div>
              <Label htmlFor="sites">Nombre de sites</Label>
              <Input
                id="sites"
                type="number"
                value={formData.sites || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sites: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="hourlyRate">Taux horaire (€/h)</Label>
              <Input
                id="hourlyRate"
                type="number"
                step="0.01"
                value={formData.hourlyRate || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hourlyRate: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="nightBonus">Prime nuit (%)</Label>
              <Input
                id="nightBonus"
                type="number"
                value={formData.nightBonus || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nightBonus: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="sundayBonus">Prime dimanche (%)</Label>
              <Input
                id="sundayBonus"
                type="number"
                value={formData.sundayBonus || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sundayBonus: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="holidayBonus">Prime jours fériés (%)</Label>
              <Input
                id="holidayBonus"
                type="number"
                value={formData.holidayBonus || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    holidayBonus: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="billingDay">Jour facturation</Label>
              <Input
                id="billingDay"
                type="number"
                min="1"
                max="31"
                value={formData.billingDay || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    billingDay: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="paymentTerm">Délai paiement (jours)</Label>
              <Input
                id="paymentTerm"
                type="number"
                value={formData.paymentTerm || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentTerm: parseInt(e.target.value),
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
                    status: value as BillingClient["status"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Suspendu">Suspendu</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 border-t pt-4">
              <Label className="text-base font-semibold mb-2 block">
                Connexion RH : Typologie des agents affectés
              </Label>
              <div className="space-y-2">
                {["Agent de sécurité", "Chef de poste", "Rondier", "Agent événementiel", "Superviseur"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`agentType-${type}`}
                      checked={formData.agentTypes?.includes(type) || false}
                      onChange={(e) => {
                        const current = formData.agentTypes || [];
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            agentTypes: [...current, type],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            agentTypes: current.filter((t) => t !== type),
                          });
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={`agentType-${type}`} className="text-sm font-normal cursor-pointer">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-2 border-t pt-4">
              <Label className="text-base font-semibold mb-2 block">
                Connexion Planning : Volumes contractuels par site
              </Label>
              <div className="space-y-2">
                {Array.from({ length: formData.sites || 1 }).map((_, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder={`Nom du site ${index + 1}`}
                      value={formData.planningVolumes?.[index]?.site || ""}
                      onChange={(e) => {
                        const volumes = formData.planningVolumes || [];
                        volumes[index] = {
                          ...volumes[index],
                          site: e.target.value,
                          monthlyHours: volumes[index]?.monthlyHours || 0,
                        };
                        setFormData({ ...formData, planningVolumes: volumes });
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Heures mensuelles"
                      value={formData.planningVolumes?.[index]?.monthlyHours || ""}
                      onChange={(e) => {
                        const volumes = formData.planningVolumes || [];
                        volumes[index] = {
                          ...volumes[index],
                          site: volumes[index]?.site || `Site ${index + 1}`,
                          monthlyHours: parseInt(e.target.value) || 0,
                        };
                        setFormData({ ...formData, planningVolumes: volumes });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails du client"
        size="lg"
        actions={{
          secondary: {
            label: "Fermer",
            onClick: () => setIsViewModalOpen(false),
          },
        }}
      >
        {selectedClient && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Client</Label>
                <p className="text-sm font-medium">{selectedClient.name}</p>
              </div>

              <div>
                <Label>SIRET</Label>
                <p className="text-sm font-medium">{selectedClient.siret}</p>
              </div>

              <div>
                <Label>Type de contrat</Label>
                <Badge variant="secondary">{selectedClient.contractType}</Badge>
              </div>

              <div>
                <Label>Type de prestation</Label>
                <Badge variant="outline">{selectedClient.serviceType}</Badge>
              </div>

              <div>
                <Label>Date début contrat</Label>
                <p className="text-sm font-medium">
                  {selectedClient.contractStartDate
                    ? new Date(selectedClient.contractStartDate).toLocaleDateString("fr-FR")
                    : "-"}
                </p>
              </div>

              <div>
                <Label>Date fin contrat</Label>
                <p className="text-sm font-medium">
                  {selectedClient.contractEndDate
                    ? new Date(selectedClient.contractEndDate).toLocaleDateString("fr-FR")
                    : "Non définie"}
                </p>
              </div>

              {selectedClient.monthlyHours && (
                <div>
                  <Label>Volumes horaires mensuels</Label>
                  <p className="text-sm font-medium">{selectedClient.monthlyHours} h</p>
                </div>
              )}

              {selectedClient.indexationRate && (
                <div>
                  <Label>Indexation contractuelle</Label>
                  <p className="text-sm font-medium">{selectedClient.indexationRate}%</p>
                </div>
              )}

              <div>
                <Label>Nombre de sites</Label>
                <p className="text-sm font-medium">{selectedClient.sites}</p>
              </div>

              <div>
                <Label>Taux horaire</Label>
                <p className="text-sm font-medium">
                  {selectedClient.hourlyRate} €/h
                </p>
              </div>

              <div>
                <Label>Prime nuit</Label>
                <p className="text-sm font-medium">
                  {selectedClient.nightBonus}%
                </p>
              </div>

              <div>
                <Label>Prime dimanche</Label>
                <p className="text-sm font-medium">
                  {selectedClient.sundayBonus}%
                </p>
              </div>

              <div>
                <Label>Prime jours fériés</Label>
                <p className="text-sm font-medium">
                  {selectedClient.holidayBonus}%
                </p>
              </div>

              <div>
                <Label>Jour de facturation</Label>
                <p className="text-sm font-medium">
                  {selectedClient.billingDay} du mois
                </p>
              </div>

              <div>
                <Label>Délai de paiement</Label>
                <p className="text-sm font-medium">
                  {selectedClient.paymentTerm} jours
                </p>
              </div>

              <div>
                <Label>Statut</Label>
                <Badge
                  variant={
                    selectedClient.status === "Actif" ? "default" : "outline"
                  }
                >
                  {selectedClient.status}
                </Badge>
              </div>

              <div>
                <Label>Dernière facture</Label>
                <p className="text-sm font-medium">
                  {new Date(selectedClient.lastInvoice).toLocaleDateString("fr-FR")}
                </p>
              </div>

              {selectedClient.agentTypes && selectedClient.agentTypes.length > 0 && (
                <div className="col-span-2 border-t pt-4">
                  <Label className="text-base font-semibold mb-2 block">
                    Connexion RH : Typologie des agents affectés
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedClient.agentTypes.map((type) => (
                      <Badge key={type} variant="outline">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedClient.planningVolumes && selectedClient.planningVolumes.length > 0 && (
                <div className="col-span-2 border-t pt-4">
                  <Label className="text-base font-semibold mb-2 block">
                    Connexion Planning : Volumes contractuels par site
                  </Label>
                  <div className="space-y-2">
                    {selectedClient.planningVolumes.map((volume, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="text-sm font-medium">{volume.site}</span>
                        <span className="text-sm">{volume.monthlyHours} h/mois</span>
                      </div>
                    ))}
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

