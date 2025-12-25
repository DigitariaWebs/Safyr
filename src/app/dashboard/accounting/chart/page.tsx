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
import {
  mockAccountingPlans,
  AccountingPlan,
} from "@/data/accounting-plans";

export default function AccountingChartPage() {
  const [plans, setPlans] = useState<AccountingPlan[]>(mockAccountingPlans);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<AccountingPlan | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<AccountingPlan>>({});

  const columns: ColumnDef<AccountingPlan>[] = [
    {
      key: "code",
      label: "Code",
      sortable: true,
    },
    {
      key: "label",
      label: "Libellé",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      render: (plan) => (
        <Badge
          variant={
            plan.type === "Actif"
              ? "default"
              : plan.type === "Passif"
                ? "secondary"
                : plan.type === "Charge"
                  ? "outline"
                  : "default"
          }
        >
          {plan.type}
        </Badge>
      ),
    },
    {
      key: "class",
      label: "Classe",
    },
    {
      key: "analytique",
      label: "Analytique",
      render: (plan) => (plan.analytique ? "Oui" : "Non"),
    },
    {
      key: "status",
      label: "Statut",
      render: (plan) => (
        <Badge variant={plan.status === "Actif" ? "default" : "outline"}>
          {plan.status}
        </Badge>
      ),
    },
  ];

  const handleCreate = () => {
    setFormData({
      status: "Actif",
      analytique: false,
    });
    setIsCreateModalOpen(true);
  };

  const handleSave = () => {
    if (formData.id) {
      setPlans(
        plans.map((p) => (p.id === formData.id ? { ...p, ...formData } : p))
      );
    } else {
      const newPlan: AccountingPlan = {
        id: (plans.length + 1).toString(),
        code: formData.code || "",
        label: formData.label || "",
        type: formData.type || "Actif",
        class: formData.class || "",
        analytique: formData.analytique || false,
        status: formData.status || "Actif",
        lastUpdate: new Date().toISOString().split("T")[0],
      };
      setPlans([...plans, newPlan]);
    }
    setIsCreateModalOpen(false);
    setFormData({});
  };

  const handleRowClick = (plan: AccountingPlan) => {
    setSelectedPlan(plan);
    setIsViewModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Plan Comptable</h1>
          <p className="text-muted-foreground">
            Gestion du plan comptable et des comptes analytiques
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Compte
        </Button>
      </div>

      <DataTable
        data={plans}
        columns={columns}
        searchKey="code"
        searchPlaceholder="Rechercher un compte..."
        onRowClick={handleRowClick}
      />

      {/* Create/Edit Modal */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        type="form"
        title={formData.id ? "Modifier le compte" : "Nouveau compte"}
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
              <Label htmlFor="code">Code comptable</Label>
              <Input
                id="code"
                value={formData.code || ""}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="401000"
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    type: value as AccountingPlan["type"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Passif">Passif</SelectItem>
                  <SelectItem value="Charge">Charge</SelectItem>
                  <SelectItem value="Produit">Produit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="label">Libellé</Label>
              <Input
                id="label"
                value={formData.label || ""}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                placeholder="Fournisseurs"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="class">Classe comptable</Label>
              <Input
                id="class"
                value={formData.class || ""}
                onChange={(e) =>
                  setFormData({ ...formData, class: e.target.value })
                }
                placeholder="4 - Comptes de tiers"
              />
            </div>

            <div>
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as AccountingPlan["status"],
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

            <div className="flex items-center space-x-2">
              <Checkbox
                id="analytique"
                checked={formData.analytique}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, analytique: checked as boolean })
                }
              />
              <Label
                htmlFor="analytique"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Compte analytique
              </Label>
            </div>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails du compte"
        size="lg"
        actions={{
          secondary: {
            label: "Fermer",
            onClick: () => setIsViewModalOpen(false),
          },
        }}
      >
        {selectedPlan && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Code</Label>
                <p className="text-sm font-medium">{selectedPlan.code}</p>
              </div>

              <div>
                <Label>Type</Label>
                <Badge variant="default">{selectedPlan.type}</Badge>
              </div>

              <div className="col-span-2">
                <Label>Libellé</Label>
                <p className="text-sm font-medium">{selectedPlan.label}</p>
              </div>

              <div className="col-span-2">
                <Label>Classe comptable</Label>
                <p className="text-sm font-medium">{selectedPlan.class}</p>
              </div>

              <div>
                <Label>Statut</Label>
                <Badge
                  variant={
                    selectedPlan.status === "Actif" ? "default" : "outline"
                  }
                >
                  {selectedPlan.status}
                </Badge>
              </div>

              <div>
                <Label>Compte analytique</Label>
                <p className="text-sm font-medium">
                  {selectedPlan.analytique ? "Oui" : "Non"}
                </p>
              </div>

              <div>
                <Label>Dernière mise à jour</Label>
                <p className="text-sm font-medium">
                  {new Date(selectedPlan.lastUpdate).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

