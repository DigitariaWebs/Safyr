"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/PhoneInput";
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import { Modal } from "@/components/ui/modal";
import {
  Users,
  CheckCircle,
  Calendar,
  AlertTriangle,
  Shield,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { PlanningAgent } from "@/data/planning-agents";
import { mockEmployees } from "@/data/employees";
import type { Employee } from "@/lib/types";

// Convert Employee to PlanningAgent
function employeeToPlanningAgent(employee: Employee): PlanningAgent {
  // Extract contract info from active contract
  const activeContract = employee.contracts.find((c) => c.status === "active");
  const contractType =
    activeContract?.type === "INTERIM"
      ? "Intérim"
      : activeContract?.type === "CDD"
        ? "CDD"
        : "CDI";
  const contractHours = activeContract?.workingHours || 35;

  // Extract qualifications from documents
  const qualifications: string[] = [];
  if (employee.documents.cqpAps) qualifications.push("CQP APS");
  if (employee.documents.ssiap) {
    const ssiapType = employee.documents.ssiap.type;
    if (ssiapType === "SSIAP1") qualifications.push("SSIAP 1");
    else if (ssiapType === "SSIAP2") qualifications.push("SSIAP 2");
    else if (ssiapType === "SSIAP3") qualifications.push("SSIAP 3");
    else qualifications.push("SSIAP");
  }
  if (employee.documents.sst) qualifications.push("SST");
  if (employee.documents.proCard) qualifications.push("Carte Professionnelle");

  return {
    id: employee.id,
    name: `${employee.firstName} ${employee.lastName}`,
    contractType,
    contractHours,
    qualifications,
    availabilityStatus: employee.status === "active" ? "Disponible" : "Absent",
    weeklyHours: contractHours,
    maxAmplitude: 12,
    lastActivity: employee.updatedAt.toISOString().split("T")[0],
    phone: employee.phone,
    email: employee.email,
  };
}

export default function PlanningAgentsPage() {
  const [agents, setAgents] = useState<PlanningAgent[]>(() =>
    mockEmployees.map(employeeToPlanningAgent),
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<PlanningAgent | null>(
    null,
  );
  const [agentToDelete, setAgentToDelete] = useState<PlanningAgent | null>(
    null,
  );
  const [formData, setFormData] = useState<
    Omit<Partial<PlanningAgent>, "qualifications"> & {
      qualifications?: string;
      hasCqpAps?: boolean;
      hasSsiap?: boolean;
      ssiapLevel?: "1" | "2" | "3";
      hasSst?: boolean;
      hasProCard?: boolean;
    }
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
    {
      key: "actions",
      label: "Actions",
      render: (agent) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleView(agent)}>
              <Eye className="h-4 w-4 mr-2" />
              Voir
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditFromDropdown(agent)}>
              <Pencil className="h-4 w-4 mr-2" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteClick(agent)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleSave = () => {
    // Build qualifications array from toggles
    const qualifications: string[] = [];
    if (formData.hasCqpAps) qualifications.push("CQP APS");
    if (formData.hasSsiap && formData.ssiapLevel) {
      qualifications.push(`SSIAP ${formData.ssiapLevel}`);
    }
    if (formData.hasSst) qualifications.push("SST");
    if (formData.hasProCard) qualifications.push("Carte Professionnelle");

    if (formData.id) {
      // Edit
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { qualifications: _qualifications, ...rest } = formData;
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

  const handleView = (agent: PlanningAgent) => {
    setSelectedAgent(agent);
    setIsViewModalOpen(true);
  };

  const handleRowClick = (agent: PlanningAgent) => {
    handleView(agent);
  };

  const handleEditFromDropdown = (agent: PlanningAgent) => {
    setSelectedAgent(agent);
    const hasCqpAps = agent.qualifications.some((q) => q.includes("CQP APS"));
    const ssiapQual = agent.qualifications.find((q) => q.includes("SSIAP"));
    const hasSsiap = !!ssiapQual;
    const ssiapLevel = ssiapQual
      ? (ssiapQual.match(/\d+/)?.[0] as "1" | "2" | "3") || "1"
      : "1";
    const hasSst = agent.qualifications.some((q) => q.includes("SST"));
    const hasProCard = agent.qualifications.some((q) =>
      q.includes("Carte Professionnelle"),
    );

    setFormData({
      ...agent,
      qualifications: agent.qualifications.join(", "),
      hasCqpAps,
      hasSsiap,
      ssiapLevel,
      hasSst,
      hasProCard,
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = () => {
    if (selectedAgent) {
      // Parse qualifications back to toggle states
      const hasCqpAps = selectedAgent.qualifications.some((q) =>
        q.includes("CQP APS"),
      );
      const ssiapQual = selectedAgent.qualifications.find((q) =>
        q.includes("SSIAP"),
      );
      const hasSsiap = !!ssiapQual;
      const ssiapLevel = ssiapQual
        ? (ssiapQual.match(/\d+/)?.[0] as "1" | "2" | "3") || "1"
        : "1";
      const hasSst = selectedAgent.qualifications.some((q) =>
        q.includes("SST"),
      );
      const hasProCard = selectedAgent.qualifications.some((q) =>
        q.includes("Carte Professionnelle"),
      );

      setFormData({
        ...selectedAgent,
        qualifications: selectedAgent.qualifications.join(", "),
        hasCqpAps,
        hasSsiap,
        ssiapLevel,
        hasSst,
        hasProCard,
      });
      setIsViewModalOpen(false);
      setIsCreateModalOpen(true);
    }
  };

  const handleDeleteClick = (agent: PlanningAgent) => {
    setAgentToDelete(agent);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (agentToDelete) {
      setAgents(agents.filter((a) => a.id !== agentToDelete.id));
      setAgentToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Calculate statistics
  const totalAgents = agents.length;
  const availableAgents = agents.filter(
    (a) => a.availabilityStatus === "Disponible",
  ).length;
  const onMission = agents.filter(
    (a) => a.availabilityStatus === "En mission",
  ).length;
  const onLeave = agents.filter((a) => a.availabilityStatus === "Congé").length;
  const cdiAgents = agents.filter((a) => a.contractType === "CDI").length;
  const qualifiedAgents = agents.filter(
    (a) => a.qualifications.length > 0,
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion des Agents</h1>
        <p className="text-muted-foreground">
          Consultation et gestion des fiches agents
        </p>
      </div>

      <InfoCardContainer className="lg:grid-cols-3">
        <InfoCard
          icon={Users}
          title="Total Agents"
          value={totalAgents}
          subtext="Agents dans le système"
          color="slate"
        />
        <InfoCard
          icon={CheckCircle}
          title="Agents Disponibles"
          value={availableAgents}
          subtext="Prêts pour affectation"
          color="green"
        />
        <InfoCard
          icon={Calendar}
          title="En Mission"
          value={onMission}
          subtext="Actuellement affectés"
          color="blue"
        />
        <InfoCard
          icon={AlertTriangle}
          title="En Congé"
          value={onLeave}
          subtext="Indisponibles"
          color="orange"
        />
        <InfoCard
          icon={Shield}
          title="Contrats CDI"
          value={cdiAgents}
          subtext={`${((cdiAgents / totalAgents) * 100).toFixed(0)}% du total`}
          color="purple"
        />
        <InfoCard
          icon={CheckCircle}
          title="Qualifiés"
          value={qualifiedAgents}
          subtext="Avec certifications"
          color="teal"
        />
      </InfoCardContainer>

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
                type="text"
                value={formData.contractHours || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(",", ".");
                  const parsed = parseFloat(value);
                  setFormData({
                    ...formData,
                    contractHours: isNaN(parsed) ? undefined : parsed,
                  });
                }}
                placeholder="151,67"
              />
            </div>

            <div>
              <Label htmlFor="weeklyHours">Heures hebdomadaires</Label>
              <Input
                id="weeklyHours"
                type="text"
                value={formData.weeklyHours || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(",", ".");
                  const parsed = parseFloat(value);
                  setFormData({
                    ...formData,
                    weeklyHours: isNaN(parsed) ? undefined : parsed,
                  });
                }}
                placeholder="35"
              />
            </div>

            <div>
              <Label htmlFor="maxAmplitude">Amplitude maximale (h)</Label>
              <Input
                id="maxAmplitude"
                type="text"
                value={formData.maxAmplitude || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(",", ".");
                  const parsed = parseFloat(value);
                  setFormData({
                    ...formData,
                    maxAmplitude: isNaN(parsed) ? undefined : parsed,
                  });
                }}
                placeholder="12"
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
              <Label>Qualifications</Label>
              <div className="space-y-4 mt-3 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cqpAps" className="cursor-pointer">
                    CQP APS
                  </Label>
                  <Switch
                    id="cqpAps"
                    checked={formData.hasCqpAps || false}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, hasCqpAps: checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ssiap" className="cursor-pointer">
                      SSIAP
                    </Label>
                    <Switch
                      id="ssiap"
                      checked={formData.hasSsiap || false}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, hasSsiap: checked })
                      }
                    />
                  </div>
                  {formData.hasSsiap && (
                    <div className="ml-4">
                      <Select
                        value={formData.ssiapLevel || "1"}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            ssiapLevel: value as "1" | "2" | "3",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Niveau SSIAP" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">SSIAP 1</SelectItem>
                          <SelectItem value="2">SSIAP 2</SelectItem>
                          <SelectItem value="3">SSIAP 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sst" className="cursor-pointer">
                    SST (Sauveteur Secouriste du Travail)
                  </Label>
                  <Switch
                    id="sst"
                    checked={formData.hasSst || false}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, hasSst: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="proCard" className="cursor-pointer">
                    Carte Professionnelle
                  </Label>
                  <Switch
                    id="proCard"
                    checked={formData.hasProCard || false}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, hasProCard: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <PhoneInput
                id="phone"
                value={formData.phone || ""}
                onChange={(value) => setFormData({ ...formData, phone: value })}
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

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        type="warning"
        title="Confirmer la suppression"
        description={`Êtes-vous sûr de vouloir supprimer l'agent ${agentToDelete?.name} ? Cette action est irréversible.`}
        actions={{
          primary: {
            label: "Supprimer",
            onClick: handleDeleteConfirm,
            variant: "destructive",
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsDeleteDialogOpen(false),
            variant: "outline",
          },
        }}
        closable={false}
      >
        <div className="text-sm text-muted-foreground">
          Cette action supprimera définitivement toutes les données associées à
          cet agent.
        </div>
      </Modal>
    </div>
  );
}
