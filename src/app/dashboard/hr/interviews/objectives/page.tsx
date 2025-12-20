"use client";

import { useState } from "react";
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
  Target,
  MoreVertical,
  TrendingUp,
  Trophy,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { Objective } from "@/lib/types";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";
import { Combobox } from "@/components/ui/combobox";
import { Progress } from "@/components/ui/progress";

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
const mockObjectives: Objective[] = [
  {
    id: "1",
    employeeId: "1",
    title: "Obtenir le SSIAP 2",
    description:
      "Formation pour passer le diplôme SSIAP niveau 2 afin d'évoluer vers un poste de chef d'équipe sécurité incendie",
    category: "skills",
    targetDate: new Date("2025-06-30"),
    progress: 35,
    status: "active",
    relatedInterviewId: "1",
    notes: "Inscription à la formation prévue pour mars 2025. Budget validé.",
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-12-10"),
  },
  {
    id: "2",
    employeeId: "1",
    title: "Développer compétences en management",
    description:
      "Suivre une formation en management d'équipe et gestion de conflit",
    category: "development",
    targetDate: new Date("2025-09-30"),
    progress: 0,
    status: "active",
    notes: "",
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-15"),
  },
  {
    id: "3",
    employeeId: "2",
    title: "Devenir formateur interne SST",
    description:
      "Obtenir la certification de formateur SST pour former les nouveaux agents",
    category: "career",
    targetDate: new Date("2025-12-31"),
    progress: 100,
    status: "completed",
    notes: "Formation terminée avec succès. Certificat obtenu le 15/11/2024.",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-11-15"),
  },
];

const statusLabels = {
  active: "En cours",
  completed: "Terminé",
  cancelled: "Annulé",
};

const statusColors = {
  active: "default",
  completed: "secondary",
  cancelled: "destructive",
} as const;

const categoryLabels = {
  performance: "Performance",
  development: "Développement",
  career: "Carrière",
  skills: "Compétences",
};

const categoryIcons = {
  performance: Trophy,
  development: TrendingUp,
  career: Briefcase,
  skills: GraduationCap,
};

export default function ObjectivesPage() {
  const [objectives, setObjectives] = useState<Objective[]>(mockObjectives);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(
    null,
  );
  const [viewingObjective, setViewingObjective] = useState<Objective | null>(
    null,
  );
  const [formData, setFormData] = useState({
    employeeId: "",
    title: "",
    description: "",
    category: "performance" as "performance" | "development" | "career" | "skills",
    targetDate: "",
    progress: 0,
    status: "active" as "active" | "completed" | "cancelled",
    notes: "",
  });

  const handleCreate = () => {
    setEditingObjective(null);
    setFormData({
      employeeId: "",
      title: "",
      description: "",
      category: "performance",
      targetDate: "",
      progress: 0,
      status: "active",
      notes: "",
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (objective: Objective) => {
    setEditingObjective(objective);
    setFormData({
      employeeId: objective.employeeId,
      title: objective.title,
      description: objective.description,
      category: objective.category,
      targetDate: objective.targetDate.toISOString().split("T")[0],
      progress: objective.progress,
      status: objective.status,
      notes: objective.notes,
    });
    setIsCreateModalOpen(true);
  };

  const handleView = (objective: Objective) => {
    setViewingObjective(objective);
    setIsViewModalOpen(true);
  };

  const handleDelete = (objectiveId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet objectif ?")) {
      setObjectives(objectives.filter((o) => o.id !== objectiveId));
    }
  };

  const handleSave = () => {
    const objectiveData = {
      employeeId: formData.employeeId,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      targetDate: new Date(formData.targetDate),
      progress: formData.progress,
      status: formData.status,
      notes: formData.notes,
    };

    if (editingObjective) {
      setObjectives(
        objectives.map((objective) =>
          objective.id === editingObjective.id
            ? {
                ...objective,
                ...objectiveData,
                updatedAt: new Date(),
              }
            : objective,
        ),
      );
    } else {
      const newObjective: Objective = {
        id: Date.now().toString(),
        ...objectiveData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setObjectives([...objectives, newObjective]);
    }

    setIsCreateModalOpen(false);
  };

  const columns: ColumnDef<Objective>[] = [
    {
      key: "employeeId",
      label: "Employé",
      render: (objective: Objective) => {
        const employee = mockEmployees.find(
          (e) => e.id === objective.employeeId,
        );
        return employee?.name || "N/A";
      },
    },
    {
      key: "title",
      label: "Objectif",
      render: (objective: Objective) => objective.title,
    },
    {
      key: "category",
      label: "Catégorie",
      render: (objective: Objective) => {
        const Icon = categoryIcons[objective.category];
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span>{categoryLabels[objective.category]}</span>
          </div>
        );
      },
    },
    {
      key: "targetDate",
      label: "Date cible",
      render: (objective: Objective) => objective.targetDate.toLocaleDateString("fr-FR"),
    },
    {
      key: "progress",
      label: "Progression",
      render: (objective: Objective) => (
        <div className="flex items-center gap-2">
          <Progress value={objective.progress} className="w-20" />
          <span className="text-sm text-muted-foreground">
            {objective.progress}%
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Statut",
      render: (objective: Objective) => (
        <Badge variant={statusColors[objective.status]}>
          {statusLabels[objective.status]}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (objective: Objective) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(objective)}>
              <Eye className="mr-2 h-4 w-4" />
              Voir
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(objective)}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(objective.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Calculate stats
  const activeObjectives = objectives.filter((o) => o.status === "active");
  const completedObjectives = objectives.filter((o) => o.status === "completed");
  const averageProgress = activeObjectives.length > 0
    ? Math.round(
        activeObjectives.reduce((sum, o) => sum + o.progress, 0) /
          activeObjectives.length,
      )
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Objectifs & Évolution Interne</h1>
          <p className="text-muted-foreground">
            Suivi des objectifs professionnels et perspectives d&apos;évolution
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel objectif
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Objectifs actifs
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeObjectives.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminés</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedObjectives.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Progression moyenne
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProgress}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de réussite
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {objectives.length > 0
                ? Math.round(
                    (completedObjectives.length / objectives.length) * 100,
                  )
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des objectifs</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={objectives} />
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        type="form"
        title={editingObjective ? "Modifier l'objectif" : "Nouvel objectif"}
        size="lg"
        actions={{
          primary: {
            label: editingObjective ? "Modifier" : "Créer",
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
          <div>
            <Label htmlFor="employeeId">Employé *</Label>
            <Combobox
              options={employeeOptions}
              value={formData.employeeId}
              onValueChange={(value) =>
                setFormData({ ...formData, employeeId: value })
              }
              placeholder="Sélectionner un employé"
              searchPlaceholder="Rechercher un employé..."
              emptyMessage="Aucun employé trouvé"
            />
          </div>

          <div>
            <Label htmlFor="title">Titre de l&apos;objectif *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Ex: Obtenir le SSIAP 2"
            />
          </div>

          <div>
            <Label htmlFor="category">Catégorie *</Label>
            <Select
              value={formData.category}
              onValueChange={(
                value: "performance" | "development" | "career" | "skills",
              ) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Performance
                  </div>
                </SelectItem>
                <SelectItem value="development">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Développement
                  </div>
                </SelectItem>
                <SelectItem value="career">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Carrière
                  </div>
                </SelectItem>
                <SelectItem value="skills">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Compétences
                  </div>
                </SelectItem>
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
              placeholder="Détails de l'objectif..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="targetDate">Date cible *</Label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) =>
                setFormData({ ...formData, targetDate: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="progress">
              Progression ({formData.progress}%)
            </Label>
            <Input
              id="progress"
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.progress}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  progress: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
            <Progress value={formData.progress} className="mt-2" />
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "completed" | "cancelled") =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes et suivi</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Notes sur l'avancement, actions prises..."
              rows={3}
            />
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails de l'objectif"
        size="lg"
      >
        {viewingObjective && (
          <div className="space-y-4">
            <div>
              <Label>Employé</Label>
              <p className="text-sm">
                {mockEmployees.find((e) => e.id === viewingObjective.employeeId)
                  ?.name || "N/A"}
              </p>
            </div>

            <div>
              <Label>Titre</Label>
              <p className="text-sm font-medium">{viewingObjective.title}</p>
            </div>

            <div>
              <Label>Catégorie</Label>
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = categoryIcons[viewingObjective.category];
                  return <Icon className="h-4 w-4 text-muted-foreground" />;
                })()}
                <span className="text-sm">
                  {categoryLabels[viewingObjective.category]}
                </span>
              </div>
            </div>

            {viewingObjective.description && (
              <div>
                <Label>Description</Label>
                <p className="text-sm">{viewingObjective.description}</p>
              </div>
            )}

            <div>
              <Label>Date cible</Label>
              <p className="text-sm">
                {viewingObjective.targetDate.toLocaleDateString("fr-FR")}
              </p>
            </div>

            <div>
              <Label>Progression</Label>
              <div className="space-y-2">
                <Progress value={viewingObjective.progress} />
                <p className="text-sm text-muted-foreground">
                  {viewingObjective.progress}% complété
                </p>
              </div>
            </div>

            <div>
              <Label>Statut</Label>
              <Badge variant={statusColors[viewingObjective.status]}>
                {statusLabels[viewingObjective.status]}
              </Badge>
            </div>

            {viewingObjective.notes && (
              <div>
                <Label>Notes</Label>
                <p className="text-sm whitespace-pre-wrap">
                  {viewingObjective.notes}
                </p>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              <p>Créé le {viewingObjective.createdAt.toLocaleDateString("fr-FR")}</p>
              <p>
                Mis à jour le {viewingObjective.updatedAt.toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
