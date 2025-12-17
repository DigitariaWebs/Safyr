"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  MoreVertical,
} from "lucide-react";
import { Suspension } from "@/lib/types";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";
import { Combobox } from "@/components/ui/combobox";

// Mock employees for selection
const mockEmployees = [
  { id: "1", name: "Marie Dupont" },
  { id: "2", name: "Jean Martin" },
  { id: "3", name: "Sophie Leroy" },
  { id: "4", name: "Pierre Durand" },
];

const employeeOptions = mockEmployees.map((employee) => ({
  value: employee.id,
  label: employee.name,
}));

// Mock data - replace with API call
const mockSuspensions: Suspension[] = [
  {
    id: "1",
    employeeId: "1",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-01-20"),
    reason: "Comportement inapproprié",
    description: "Incident grave avec un client",
    issuedBy: "Alice Dubois",
    status: "active",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    employeeId: "2",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-05"),
    reason: "Violation des règles de sécurité",
    description: "Non-respect des protocoles de sécurité",
    issuedBy: "Alice Dubois",
    status: "completed",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-05"),
  },
];

const statusLabels = {
  active: "En cours",
  completed: "Terminée",
};

const statusColors = {
  active: "destructive",
  completed: "secondary",
} as const;

export default function SuspensionsPage() {
  const [suspensions, setSuspensions] = useState<Suspension[]>(mockSuspensions);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingSuspension, setEditingSuspension] = useState<Suspension | null>(
    null,
  );
  const [viewingSuspension, setViewingSuspension] = useState<Suspension | null>(
    null,
  );
  const [formData, setFormData] = useState({
    employeeId: "",
    startDate: "",
    endDate: "",
    reason: "",
    description: "",
    issuedBy: "Alice Dubois", // Mock current user
    status: "active" as "active" | "completed",
  });

  const handleCreate = () => {
    setEditingSuspension(null);
    setFormData({
      employeeId: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      reason: "",
      description: "",
      issuedBy: "Alice Dubois",
      status: "active",
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (suspension: Suspension) => {
    setEditingSuspension(suspension);
    setFormData({
      employeeId: suspension.employeeId,
      startDate: suspension.startDate.toISOString().split("T")[0],
      endDate: suspension.endDate.toISOString().split("T")[0],
      reason: suspension.reason,
      description: suspension.description,
      issuedBy: suspension.issuedBy,
      status: suspension.status,
    });
    setIsCreateModalOpen(true);
  };

  const handleView = (suspension: Suspension) => {
    setViewingSuspension(suspension);
    setIsViewModalOpen(true);
  };

  const handleDelete = (suspensionId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette suspension ?")) {
      setSuspensions(suspensions.filter((s) => s.id !== suspensionId));
    }
  };

  const handleSave = () => {
    const suspensionData = {
      employeeId: formData.employeeId,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      reason: formData.reason,
      description: formData.description,
      issuedBy: formData.issuedBy,
      status: formData.status,
    };

    if (editingSuspension) {
      setSuspensions(
        suspensions.map((s) =>
          s.id === editingSuspension.id
            ? { ...s, ...suspensionData, updatedAt: new Date() }
            : s,
        ),
      );
    } else {
      const newSuspension: Suspension = {
        id: Date.now().toString(),
        ...suspensionData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setSuspensions([...suspensions, newSuspension]);
    }
    setIsCreateModalOpen(false);
  };

  const handleStatusChange = (
    suspensionId: string,
    newStatus: Suspension["status"],
  ) => {
    setSuspensions(
      suspensions.map((s) =>
        s.id === suspensionId
          ? { ...s, status: newStatus, updatedAt: new Date() }
          : s,
      ),
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid =
    formData.employeeId &&
    formData.startDate &&
    formData.endDate &&
    formData.reason &&
    formData.description &&
    new Date(formData.startDate) <= new Date(formData.endDate);

  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find((e) => e.id === employeeId);
    return employee ? employee.name : "Employé inconnu";
  };

  const columns: ColumnDef<Suspension>[] = [
    {
      key: "employeeId",
      label: "Employé",
      render: (suspension: Suspension) => (
        <div>
          <div className="font-medium">
            <Link
              href={`/dashboard/hr/employees/${suspension.employeeId}`}
              className="text-primary hover:underline"
            >
              {getEmployeeName(suspension.employeeId)}
            </Link>
          </div>
        </div>
      ),
    },
    {
      key: "startDate",
      label: "Début",
      render: (suspension: Suspension) =>
        suspension.startDate.toLocaleDateString("fr-FR"),
    },
    {
      key: "endDate",
      label: "Fin",
      render: (suspension: Suspension) =>
        suspension.endDate.toLocaleDateString("fr-FR"),
    },
    {
      key: "reason",
      label: "Motif",
      render: (suspension: Suspension) => suspension.reason,
    },
    {
      key: "status",
      label: "Statut",
      render: (suspension: Suspension) => (
        <Badge variant={statusColors[suspension.status]}>
          {statusLabels[suspension.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (suspension: Suspension) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleView(suspension)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Voir
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleEdit(suspension)}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            {suspension.status === "active" && (
              <DropdownMenuItem
                onClick={() => handleStatusChange(suspension.id, "completed")}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4 text-green-600" />
                Marquer terminée
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => handleDelete(suspension.id)}
              className="gap-2 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suspensions</h1>
          <p className="text-muted-foreground">
            Gestion des suspensions disciplinaires
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle suspension
        </Button>
      </div>

      {/* Suspensions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Suspensions ({suspensions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={suspensions}
            columns={columns}
            searchKeys={["reason", "description"]}
            searchPlaceholder="Rechercher des suspensions..."
          />
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        type="form"
        title={
          editingSuspension ? "Modifier la suspension" : "Nouvelle suspension"
        }
        description="Ajoutez ou modifiez les informations de la suspension."
        size="lg"
        actions={{
          secondary: {
            label: "Annuler",
            onClick: () => setIsCreateModalOpen(false),
            variant: "outline",
          },
          primary: {
            label: editingSuspension ? "Enregistrer" : "Créer",
            onClick: handleSave,
            disabled: !isFormValid,
          },
        }}
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employé *</Label>
              <Combobox
                options={employeeOptions}
                value={formData.employeeId}
                onValueChange={(value) =>
                  handleInputChange("employeeId", value)
                }
                placeholder="Sélectionner un employé"
                searchPlaceholder="Rechercher un employé..."
                emptyMessage="Aucun employé trouvé."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Motif *</Label>
              <Input
                id="reason"
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                placeholder="Ex: Violation des règles"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "completed") =>
                  handleInputChange("status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">En cours</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Détails de la suspension..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuedBy">Émis par</Label>
            <Input
              id="issuedBy"
              value={formData.issuedBy}
              onChange={(e) => handleInputChange("issuedBy", e.target.value)}
              placeholder="Nom de l'émetteur"
            />
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails de la suspension"
        description={
          viewingSuspension
            ? `${getEmployeeName(viewingSuspension.employeeId)} - ${viewingSuspension.reason}`
            : ""
        }
        actions={{
          primary: {
            label: "Fermer",
            onClick: () => setIsViewModalOpen(false),
          },
        }}
      >
        {viewingSuspension && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Employé</Label>
                <p className="text-sm font-medium">
                  {getEmployeeName(viewingSuspension.employeeId)}
                </p>
              </div>
              <div>
                <Label>Date de début</Label>
                <p className="text-sm font-medium">
                  {viewingSuspension.startDate.toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div>
                <Label>Date de fin</Label>
                <p className="text-sm font-medium">
                  {viewingSuspension.endDate.toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div>
                <Label>Motif</Label>
                <p className="text-sm font-medium">
                  {viewingSuspension.reason}
                </p>
              </div>
              <div>
                <Label>Statut</Label>
                <Badge variant={statusColors[viewingSuspension.status]}>
                  {statusLabels[viewingSuspension.status]}
                </Badge>
              </div>
              <div>
                <Label>Émis par</Label>
                <p className="text-sm font-medium">
                  {viewingSuspension.issuedBy}
                </p>
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={viewingSuspension.description}
                readOnly
                className="min-h-20"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
