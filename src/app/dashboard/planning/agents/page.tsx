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
import { mockPlanningAgents, PlanningAgent } from "@/data/planning-agents";

export default function PlanningAgentsPage() {
  const [agents, setAgents] = useState<PlanningAgent[]>(mockPlanningAgents);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<PlanningAgent | null>(
    null,
  );
  const [formData, setFormData] = useState<
    Omit<Partial<PlanningAgent>, "qualifications"> & { qualifications?: string }
  >({});

  const columns: ColumnDef<PlanningAgent>[] = [
    {
      key: "name",
      label: "Nom",
      sortable: true,
    },
    {
      key: "contractType",
      label: "Type Contrat",
      render: (agent) => (
        <Badge
          variant={
            agent.contractType === "CDI"
              ? "default"
              : agent.contractType === "CDD"
                ? "secondary"
                : "outline"
          }
        >
          {agent.contractType}
        </Badge>
      ),
    },
    {
      key: "contractHours",
      label: "Heures Contrat",
      render: (agent) => `${agent.contractHours}h`,
    },
    {
      key: "availabilityStatus",
      label: "Disponibilité",
      render: (agent) => (
        <Badge
          variant={
            agent.availabilityStatus === "Disponible"
              ? "default"
              : agent.availabilityStatus === "En mission"
                ? "secondary"
                : "outline"
          }
        >
          {agent.availabilityStatus}
        </Badge>
      ),
    },
    {
      key: "weeklyHours",
      label: "Heures Semaine",
      render: (agent) => `${agent.weeklyHours}h`,
    },
    {
      key: "qualifications",
      label: "Qualifications",
      render: (agent) => (
        <div className="flex flex-wrap gap-1">
          {agent.qualifications.slice(0, 2).map((qual, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {qual}
            </Badge>
          ))}
          {agent.qualifications.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{agent.qualifications.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
  ];

  const handleCreate = () => {
    setFormData({
      contractType: "CDI",
      contractHours: 35,
      weeklyHours: 35,
      maxAmplitude: 12,
      qualifications: "",
    });
    setIsCreateModalOpen(true);
  };

  const handleSave = () => {
    const qualifications: string[] = formData.qualifications
      ? formData.qualifications
          .split(",")
          .map((q) => q.trim())
          .filter((q) => q)
      : [];
    if (formData.id) {
      // Edit
      const { qualifications: _, ...rest } = formData;
      setAgents(
        agents.map((a) =>
          a.id === formData.id ? { ...a, ...rest, qualifications } : a,
        ),
      );
    } else {
      // Create
      const newAgent: PlanningAgent = {
        id: (agents.length + 1).toString(),
        name: formData.name || "",
        contractType: formData.contractType || "CDI",
        contractHours: formData.contractHours || 35,
        qualifications,
        availabilityStatus: "Disponible",
        weeklyHours: formData.weeklyHours || 35,
        maxAmplitude: formData.maxAmplitude || 12,
        lastActivity: new Date().toISOString().split("T")[0],
        phone: formData.phone || "",
        email: formData.email || "",
      };
      setAgents([...agents, newAgent]);
    }
    setIsCreateModalOpen(false);
    setFormData({});
  };

  const handleRowClick = (agent: PlanningAgent) => {
    setSelectedAgent(agent);
    setIsViewModalOpen(true);
  };

  const handleEdit = () => {
    if (selectedAgent) {
      setFormData({
        ...selectedAgent,
        qualifications: selectedAgent.qualifications.join(", "),
      });
      setIsViewModalOpen(false);
      setIsCreateModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Agents</h1>
          <p className="text-muted-foreground">
            Consultation et gestion des fiches agents
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Agent
        </Button>
      </div>

      <DataTable
        data={agents}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Rechercher un agent..."
        onRowClick={handleRowClick}
      />

      {/* Create/Edit Modal */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        type="form"
        title={formData.id ? "Modifier l'agent" : "Nouvel agent"}
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
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <Label htmlFor="contractType">Type de contrat</Label>
              <Select
                value={formData.contractType}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    contractType: value as "CDI" | "CDD" | "Intérim",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="CDD">CDD</SelectItem>
                  <SelectItem value="Intérim">Intérim</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contractHours">Heures contractuelles</Label>
              <Input
                id="contractHours"
                type="number"
                value={formData.contractHours || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contractHours: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="weeklyHours">Heures hebdomadaires</Label>
              <Input
                id="weeklyHours"
                type="number"
                value={formData.weeklyHours || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weeklyHours: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="maxAmplitude">Amplitude maximale (h)</Label>
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

            {formData.id && (
              <div>
                <Label htmlFor="availabilityStatus">Disponibilité</Label>
                <Select
                  value={formData.availabilityStatus}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      availabilityStatus:
                        value as PlanningAgent["availabilityStatus"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disponible">Disponible</SelectItem>
                    <SelectItem value="En mission">En mission</SelectItem>
                    <SelectItem value="Congé">Congé</SelectItem>
                    <SelectItem value="Absent">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="col-span-2">
              <Label htmlFor="qualifications">Qualifications</Label>
              <textarea
                id="qualifications"
                value={formData.qualifications || ""}
                onChange={(e) =>
                  setFormData({ ...formData, qualifications: e.target.value })
                }
                placeholder="CQP APS, SSIAP 1, Carte Professionnelle"
                className="w-full min-h-20 p-3 border rounded-lg"
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="06 12 34 56 78"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="agent@example.com"
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
        title="Détails de l'agent"
        size="lg"
        actions={{
          primary: {
            label: "Modifier",
            onClick: handleEdit,
          },
          secondary: {
            label: "Fermer",
            onClick: () => setIsViewModalOpen(false),
          },
        }}
      >
        {selectedAgent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nom</Label>
                <p className="text-sm font-medium">{selectedAgent.name}</p>
              </div>

              <div>
                <Label>Type de contrat</Label>
                <Badge variant="default">{selectedAgent.contractType}</Badge>
              </div>

              <div>
                <Label>Heures contractuelles</Label>
                <p className="text-sm font-medium">
                  {selectedAgent.contractHours}h
                </p>
              </div>

              <div>
                <Label>Heures hebdomadaires</Label>
                <p className="text-sm font-medium">
                  {selectedAgent.weeklyHours}h
                </p>
              </div>

              <div>
                <Label>Amplitude maximale</Label>
                <p className="text-sm font-medium">
                  {selectedAgent.maxAmplitude}h
                </p>
              </div>

              <div>
                <Label>Disponibilité</Label>
                <Badge
                  variant={
                    selectedAgent.availabilityStatus === "Disponible"
                      ? "default"
                      : "secondary"
                  }
                >
                  {selectedAgent.availabilityStatus}
                </Badge>
              </div>

              <div>
                <Label>Téléphone</Label>
                <p className="text-sm font-medium">{selectedAgent.phone}</p>
              </div>

              <div>
                <Label>Email</Label>
                <p className="text-sm font-medium">{selectedAgent.email}</p>
              </div>

              <div className="col-span-2">
                <Label>Qualifications</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedAgent.qualifications.map((qual, idx) => (
                    <Badge key={idx} variant="outline">
                      {qual}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Dernière activité</Label>
                <p className="text-sm font-medium">
                  {new Date(selectedAgent.lastActivity).toLocaleDateString(
                    "fr-FR",
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
