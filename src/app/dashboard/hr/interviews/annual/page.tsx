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
  MoreVertical,
  FileText,
} from "lucide-react";
import { Interview } from "@/lib/types";
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
const mockInterviews: Interview[] = [
  {
    id: "1",
    employeeId: "1",
    type: "annual",
    date: new Date("2024-12-15"),
    interviewer: "Alice Dubois",
    notes: "Excellente performance cette année. Objectifs atteints.",
    objectives: [
      "Améliorer les compétences en leadership",
      "Suivre formation management",
    ],
    status: "completed",
    documents: ["/files/entretien_marie_2024.pdf"],
    createdAt: new Date("2024-11-15"),
    updatedAt: new Date("2024-12-15"),
  },
  {
    id: "2",
    employeeId: "2",
    type: "annual",
    date: new Date("2025-01-20"),
    interviewer: "Alice Dubois",
    notes: "",
    objectives: [],
    status: "scheduled",
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-01"),
  },
];

const statusLabels = {
  scheduled: "Planifié",
  completed: "Terminé",
  cancelled: "Annulé",
};

const statusColors = {
  scheduled: "default",
  completed: "secondary",
  cancelled: "destructive",
} as const;

export default function AnnualInterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(
    null,
  );
  const [viewingInterview, setViewingInterview] = useState<Interview | null>(
    null,
  );
  const [formData, setFormData] = useState({
    employeeId: "",
    date: "",
    interviewer: "",
    notes: "",
    objectives: [""],
    status: "scheduled" as "scheduled" | "completed" | "cancelled",
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const handleCreate = () => {
    setEditingInterview(null);
    setFormData({
      employeeId: "",
      date: new Date().toISOString().split("T")[0],
      interviewer: "",
      notes: "",
      objectives: [""],
      status: "scheduled",
    });
    setDocumentFile(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (interview: Interview) => {
    setEditingInterview(interview);
    setFormData({
      employeeId: interview.employeeId,
      date: interview.date.toISOString().split("T")[0],
      interviewer: interview.interviewer,
      notes: interview.notes,
      objectives: interview.objectives.length > 0 ? interview.objectives : [""],
      status: interview.status,
    });
    setDocumentFile(null);
    setIsCreateModalOpen(true);
  };

  const handleView = (interview: Interview) => {
    setViewingInterview(interview);
    setIsViewModalOpen(true);
  };

  const handleDelete = (interviewId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet entretien annuel ?")) {
      setInterviews(interviews.filter((i) => i.id !== interviewId));
    }
  };

  const handleSave = () => {
    const interviewData = {
      employeeId: formData.employeeId,
      type: "annual" as const,
      date: new Date(formData.date),
      interviewer: formData.interviewer,
      notes: formData.notes,
      objectives: formData.objectives.filter((obj) => obj.trim() !== ""),
      status: formData.status,
      documents: documentFile ? [`/files/interview_${Date.now()}.pdf`] : [],
    };

    if (editingInterview) {
      setInterviews(
        interviews.map((interview) =>
          interview.id === editingInterview.id
            ? {
                ...interview,
                ...interviewData,
                updatedAt: new Date(),
              }
            : interview,
        ),
      );
    } else {
      const newInterview: Interview = {
        id: Date.now().toString(),
        ...interviewData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setInterviews([...interviews, newInterview]);
    }

    setIsCreateModalOpen(false);
  };

  const addObjective = () => {
    setFormData({
      ...formData,
      objectives: [...formData.objectives, ""],
    });
  };

  const removeObjective = (index: number) => {
    setFormData({
      ...formData,
      objectives: formData.objectives.filter((_, i) => i !== index),
    });
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData({
      ...formData,
      objectives: newObjectives,
    });
  };

  const columns: ColumnDef<Interview>[] = [
    {
      key: "employeeId",
      label: "Employé",
      render: (interview: Interview) => {
        const employee = mockEmployees.find(
          (e) => e.id === interview.employeeId,
        );
        return employee?.name || "N/A";
      },
    },
    {
      key: "date",
      label: "Date",
      render: (interview: Interview) =>
        interview.date.toLocaleDateString("fr-FR"),
    },
    {
      key: "interviewer",
      label: "Responsable",
      render: (interview: Interview) => interview.interviewer,
    },
    {
      key: "status",
      label: "Statut",
      render: (interview: Interview) => (
        <Badge variant={statusColors[interview.status]}>
          {statusLabels[interview.status]}
        </Badge>
      ),
    },
    {
      key: "objectives",
      label: "Objectifs",
      render: (interview: Interview) =>
        `${interview.objectives.length} objectif(s)`,
    },
    {
      key: "actions",
      label: "Actions",
      render: (interview: Interview) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(interview)}>
              <Eye className="mr-2 h-4 w-4" />
              Voir
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(interview)}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(interview.id)}
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Entretiens Annuels</h1>
          <p className="text-muted-foreground">
            Gestion des entretiens annuels d&apos;évaluation
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel entretien
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des entretiens annuels</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={interviews} />
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        type="form"
        title={
          editingInterview
            ? "Modifier l'entretien annuel"
            : "Nouvel entretien annuel"
        }
        size="lg"
        actions={{
          primary: {
            label: editingInterview ? "Modifier" : "Créer",
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
            <Label htmlFor="date">Date de l&apos;entretien *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="interviewer">
              Responsable de l&apos;entretien *
            </Label>
            <Input
              id="interviewer"
              value={formData.interviewer}
              onChange={(e) =>
                setFormData({ ...formData, interviewer: e.target.value })
              }
              placeholder="Nom du responsable"
            />
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "scheduled" | "completed" | "cancelled") =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Planifié</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Objectifs pour l&apos;année suivante</Label>
            <div className="space-y-2">
              {formData.objectives.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={objective}
                    onChange={(e) => updateObjective(index, e.target.value)}
                    placeholder="Objectif"
                  />
                  {formData.objectives.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeObjective(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addObjective}
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un objectif
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes et commentaires</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Notes sur la performance, compétences, évolution..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="document">Document (PDF)</Label>
            <Input
              id="document"
              type="file"
              accept=".pdf"
              onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails de l'entretien annuel"
        size="lg"
      >
        {viewingInterview && (
          <div className="space-y-4">
            <div>
              <Label>Employé</Label>
              <p className="text-sm">
                {mockEmployees.find((e) => e.id === viewingInterview.employeeId)
                  ?.name || "N/A"}
              </p>
            </div>

            <div>
              <Label>Date de l&apos;entretien</Label>
              <p className="text-sm">
                {viewingInterview.date.toLocaleDateString("fr-FR")}
              </p>
            </div>

            <div>
              <Label>Responsable</Label>
              <p className="text-sm">{viewingInterview.interviewer}</p>
            </div>

            <div>
              <Label>Statut</Label>
              <Badge variant={statusColors[viewingInterview.status]}>
                {statusLabels[viewingInterview.status]}
              </Badge>
            </div>

            {viewingInterview.objectives.length > 0 && (
              <div>
                <Label>Objectifs</Label>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {viewingInterview.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
            )}

            {viewingInterview.notes && (
              <div>
                <Label>Notes</Label>
                <p className="text-sm whitespace-pre-wrap">
                  {viewingInterview.notes}
                </p>
              </div>
            )}

            {viewingInterview.documents &&
              viewingInterview.documents.length > 0 && (
                <div>
                  <Label>Documents</Label>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <a
                      href={viewingInterview.documents[0]}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Voir le document
                    </a>
                  </div>
                </div>
              )}
          </div>
        )}
      </Modal>
    </div>
  );
}
