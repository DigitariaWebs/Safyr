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
import {
  mockPayrollConventions,
  PayrollConvention,
} from "@/data/payroll-conventions";

export default function PayrollConfigurationPage() {
  const [conventions, setConventions] = useState<PayrollConvention[]>(
    mockPayrollConventions
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedConvention, setSelectedConvention] =
    useState<PayrollConvention | null>(null);
  const [formData, setFormData] = useState<Partial<PayrollConvention>>({});

  const columns: ColumnDef<PayrollConvention>[] = [
    {
      key: "idcc",
      label: "IDCC",
      sortable: true,
    },
    {
      key: "name",
      label: "Convention",
      sortable: true,
    },
    {
      key: "sector",
      label: "Secteur",
    },
    {
      key: "minimumWage",
      label: "Salaire Min.",
      render: (conv) => `${conv.minimumWage} €/h`,
    },
    {
      key: "nightBonus",
      label: "Prime Nuit",
      render: (conv) => `${conv.nightBonus}%`,
    },
    {
      key: "sundayBonus",
      label: "Prime Dimanche",
      render: (conv) => `${conv.sundayBonus}%`,
    },
    {
      key: "status",
      label: "Statut",
      render: (conv) => (
        <Badge
          variant={
            conv.status === "Active"
              ? "default"
              : conv.status === "En révision"
                ? "secondary"
                : "outline"
          }
        >
          {conv.status}
        </Badge>
      ),
    },
  ];

  const handleCreate = () => {
    setFormData({
      status: "Active",
      nightBonus: 10,
      sundayBonus: 25,
      holidayBonus: 50,
      overtimeRate: 25,
      maxAmplitude: 12,
      accidentRate: 3.0,
    });
    setIsCreateModalOpen(true);
  };

  const handleSave = () => {
    if (formData.id) {
      setConventions(
        conventions.map((c) =>
          c.id === formData.id ? { ...c, ...formData } : c
        )
      );
    } else {
      const newConvention: PayrollConvention = {
        id: (conventions.length + 1).toString(),
        idcc: formData.idcc || "",
        name: formData.name || "",
        sector: formData.sector || "",
        lastUpdate: new Date().toISOString().split("T")[0],
        minimumWage: formData.minimumWage || 11.5,
        nightBonus: formData.nightBonus || 10,
        sundayBonus: formData.sundayBonus || 25,
        holidayBonus: formData.holidayBonus || 50,
        overtimeRate: formData.overtimeRate || 25,
        maxAmplitude: formData.maxAmplitude || 12,
        accidentRate: formData.accidentRate || 3.0,
        status: formData.status || "Active",
      };
      setConventions([...conventions, newConvention]);
    }
    setIsCreateModalOpen(false);
    setFormData({});
  };

  const handleRowClick = (convention: PayrollConvention) => {
    setSelectedConvention(convention);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Paramétrage Légal & Conventionnel
          </h1>
          <p className="text-muted-foreground">
            Configuration des conventions collectives et paramètres de paie
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Convention
        </Button>
      </div>

      <DataTable
        data={conventions}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Rechercher une convention..."
        onRowClick={handleRowClick}
      />

      {/* Create/Edit Modal */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        type="form"
        title={formData.id ? "Modifier la convention" : "Nouvelle convention"}
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
              <Label htmlFor="idcc">IDCC</Label>
              <Input
                id="idcc"
                value={formData.idcc || ""}
                onChange={(e) =>
                  setFormData({ ...formData, idcc: e.target.value })
                }
                placeholder="1351"
              />
            </div>

            <div>
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as PayrollConvention["status"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="En révision">En révision</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="name">Nom de la convention</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Convention Collective..."
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="sector">Secteur</Label>
              <Input
                id="sector"
                value={formData.sector || ""}
                onChange={(e) =>
                  setFormData({ ...formData, sector: e.target.value })
                }
                placeholder="Sécurité Privée"
              />
            </div>

            <div>
              <Label htmlFor="minimumWage">Salaire minimum (€/h)</Label>
              <Input
                id="minimumWage"
                type="number"
                step="0.01"
                value={formData.minimumWage || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minimumWage: parseFloat(e.target.value),
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
              <Label htmlFor="overtimeRate">Heures sup. (%)</Label>
              <Input
                id="overtimeRate"
                type="number"
                value={formData.overtimeRate || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    overtimeRate: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="maxAmplitude">Amplitude max (h)</Label>
              <Input
                id="maxAmplitude"
                type="number"
                value={formData.maxAmplitude || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxAmplitude: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="accidentRate">Taux AT/MP (%)</Label>
              <Input
                id="accidentRate"
                type="number"
                step="0.1"
                value={formData.accidentRate || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    accidentRate: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails de la convention"
        size="lg"
        actions={{
          secondary: {
            label: "Fermer",
            onClick: () => setIsViewModalOpen(false),
          },
        }}
      >
        {selectedConvention && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>IDCC</Label>
                <p className="text-sm font-medium">{selectedConvention.idcc}</p>
              </div>

              <div>
                <Label>Statut</Label>
                <Badge variant="default">{selectedConvention.status}</Badge>
              </div>

              <div className="col-span-2">
                <Label>Nom de la convention</Label>
                <p className="text-sm font-medium">{selectedConvention.name}</p>
              </div>

              <div className="col-span-2">
                <Label>Secteur</Label>
                <p className="text-sm font-medium">
                  {selectedConvention.sector}
                </p>
              </div>

              <div>
                <Label>Salaire minimum</Label>
                <p className="text-sm font-medium">
                  {selectedConvention.minimumWage} €/h
                </p>
              </div>

              <div>
                <Label>Prime nuit</Label>
                <p className="text-sm font-medium">
                  {selectedConvention.nightBonus}%
                </p>
              </div>

              <div>
                <Label>Prime dimanche</Label>
                <p className="text-sm font-medium">
                  {selectedConvention.sundayBonus}%
                </p>
              </div>

              <div>
                <Label>Prime jours fériés</Label>
                <p className="text-sm font-medium">
                  {selectedConvention.holidayBonus}%
                </p>
              </div>

              <div>
                <Label>Heures supplémentaires</Label>
                <p className="text-sm font-medium">
                  {selectedConvention.overtimeRate}%
                </p>
              </div>

              <div>
                <Label>Amplitude maximale</Label>
                <p className="text-sm font-medium">
                  {selectedConvention.maxAmplitude}h
                </p>
              </div>

              <div>
                <Label>Taux AT/MP</Label>
                <p className="text-sm font-medium">
                  {selectedConvention.accidentRate}%
                </p>
              </div>

              <div>
                <Label>Dernière mise à jour</Label>
                <p className="text-sm font-medium">
                  {new Date(selectedConvention.lastUpdate).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

