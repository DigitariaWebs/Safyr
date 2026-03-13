"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Briefcase,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ShieldCheck,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  Moon,
  RotateCcw,
  MapPin,
  ClipboardList,
  Wrench,
  Phone,
  CalendarClock,
  ChevronRight,
} from "lucide-react";
import type { Poste, PosteType, PosteFormData } from "@/lib/types";
import { mockPostes, mockSites } from "@/data/sites";

const POSTE_TYPE_LABELS: Record<string, string> = {
  agent_securite: "Agent de Sécurité",
  ssiap1: "SSIAP 1",
  ssiap2: "SSIAP 2",
  ssiap3: "SSIAP 3",
  operateur_video: "Opérateur Vidéo",
  accueil: "Accueil",
  manager: "Manager",
  rh: "RH",
  comptable: "Comptable",
};

const DEFAULT_FORM: PosteFormData = {
  name: "",
  type: "agent_securite" as PosteType,
  description: "",
  requiredCertifications: [],
  requiredQualifications: [],
  defaultShiftDuration: 8,
  breakDuration: 30,
  nightShift: false,
  weekendWork: false,
  rotatingShift: false,
  minAgents: 1,
  maxAgents: 1,
  duties: "",
  procedures: "",
  equipment: "",
  emergencyContact: "",
  status: "active",
  priority: "medium",
  vacationStart: "08:00",
  vacationEnd: "16:00",
};

export default function PostesPage() {
  const searchParams = useSearchParams();
  const [postes, setPostes] = useState<Poste[]>(mockPostes);
  const [selectedPoste, setSelectedPoste] = useState<Poste | null>(null);
  const [posteToDelete, setPosteToDelete] = useState<Poste | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [createSiteId, setCreateSiteId] = useState<string>("");
  const [formData, setFormData] = useState<PosteFormData>(DEFAULT_FORM);
  const showCreateFromUrl = searchParams.get("create") === "true";

  const totalPostes = postes.length;
  const activePostes = postes.filter((p) => p.status === "active").length;
  const criticalPostes = postes.filter((p) => p.priority === "critical").length;
  const nightShiftPostes = postes.filter((p) => p.schedule.nightShift).length;

  const getStatusBadge = (status: Poste["status"]) =>
    status === "active" ? (
      <Badge variant="default">Actif</Badge>
    ) : (
      <Badge variant="secondary">Inactif</Badge>
    );

  const getPriorityBadge = (priority: Poste["priority"]) => {
    const map = {
      low: { variant: "secondary" as const, label: "Faible" },
      medium: { variant: "outline" as const, label: "Moyen" },
      high: { variant: "default" as const, label: "Élevé" },
      critical: { variant: "destructive" as const, label: "Critique" },
    };
    const c = map[priority];
    return <Badge variant={c.variant}>{c.label}</Badge>;
  };

  const getSiteNameById = (siteId: string) =>
    mockSites.find((s) => s.id === siteId)?.name ?? siteId;

  const columns: ColumnDef<Poste>[] = [
    {
      key: "name",
      label: "Poste",
      sortable: true,
      render: (p) => (
        <div>
          <p className="font-medium text-sm">{p.name}</p>
          <p className="text-xs text-muted-foreground">
            {POSTE_TYPE_LABELS[p.type]}
          </p>
        </div>
      ),
    },
    {
      key: "siteId",
      label: "Site",
      render: (p) => (
        <div className="flex items-center gap-1.5 text-sm">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          {getSiteNameById(p.siteId)}
        </div>
      ),
    },
    {
      key: "priority",
      label: "Priorité",
      render: (p) => getPriorityBadge(p.priority),
    },
    {
      key: "status",
      label: "Statut",
      render: (p) => getStatusBadge(p.status),
    },
    {
      key: "capacity",
      label: "Capacité",
      render: (p) => (
        <div className="flex items-center gap-1.5 text-sm">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span>
            {p.capacity.currentAgents ?? 0}/{p.capacity.maxAgents}
          </span>
        </div>
      ),
    },
    {
      key: "schedule",
      label: "Planning",
      render: (p) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {p.schedule.defaultShiftDuration}h
          </div>
          {p.schedule.nightShift && (
            <Moon className="h-3.5 w-3.5 text-indigo-500" />
          )}
          {p.schedule.rotatingShift && (
            <RotateCcw className="h-3.5 w-3.5 text-amber-500" />
          )}
        </div>
      ),
    },
    {
      key: "requirements",
      label: "Certifications",
      render: (p) => (
        <div className="flex flex-wrap gap-1">
          {p.requirements.requiredCertifications.slice(0, 2).map((c) => (
            <Badge key={c} variant="outline" className="text-xs">
              {c}
            </Badge>
          ))}
          {p.requirements.requiredCertifications.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{p.requirements.requiredCertifications.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (s) => (
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleView(s)}>
                <Eye className="h-4 w-4 mr-2" /> Voir
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(s)}>
                <Pencil className="h-4 w-4 mr-2" /> Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDeleteClick(s)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const handleView = (p: Poste) => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedPoste(p);
    setIsViewModalOpen(true);
  };

  const handleEdit = (p: Poste) => {
    setIsViewModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedPoste(p);
    setFormData({
      name: p.name,
      type: p.type,
      description: p.description ?? "",
      requiredCertifications: p.requirements.requiredCertifications,
      requiredQualifications: p.requirements.requiredQualifications ?? [],
      defaultShiftDuration: p.schedule.defaultShiftDuration,
      breakDuration: p.schedule.breakDuration ?? 30,
      nightShift: p.schedule.nightShift,
      weekendWork: p.schedule.weekendWork,
      rotatingShift: p.schedule.rotatingShift,
      minAgents: p.capacity.minAgents,
      maxAgents: p.capacity.maxAgents,
      duties: p.instructions?.duties.join("\n") ?? "",
      procedures: p.instructions?.procedures ?? "",
      equipment: p.instructions?.equipment?.join(", ") ?? "",
      emergencyContact: p.instructions?.emergencyContact ?? "",
      status: p.status,
      priority: p.priority,
      vacationStart:
        ((p.schedule as Record<string, unknown>).vacationStart as string) ??
        "08:00",
      vacationEnd:
        ((p.schedule as Record<string, unknown>).vacationEnd as string) ??
        "16:00",
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (p: Poste) => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setPosteToDelete(p);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!posteToDelete) return;
    setPostes((prev) => prev.filter((p) => p.id !== posteToDelete.id));
    setIsDeleteModalOpen(false);
    setPosteToDelete(null);
  };

  const handleOpenCreate = () => {
    setFormData({ ...DEFAULT_FORM });
    setCreateSiteId(mockSites[0]?.id ?? "");
    setIsCreateModalOpen(true);
  };

  const handleSave = (isEdit: boolean) => {
    if (isEdit && selectedPoste) {
      setPostes((prev) =>
        prev.map((p) =>
          p.id === selectedPoste.id
            ? {
                ...p,
                name: formData.name,
                type: formData.type,
                description: formData.description,
                requirements: {
                  requiredCertifications: formData.requiredCertifications,
                  requiredQualifications: formData.requiredQualifications,
                },
                schedule: {
                  defaultShiftDuration: formData.defaultShiftDuration,
                  breakDuration: formData.breakDuration,
                  nightShift: formData.nightShift,
                  weekendWork: formData.weekendWork,
                  rotatingShift: formData.rotatingShift,
                  vacationStart: formData.vacationStart,
                  vacationEnd: formData.vacationEnd,
                },
                capacity: {
                  minAgents: formData.minAgents,
                  maxAgents: formData.maxAgents,
                  currentAgents: p.capacity.currentAgents,
                },
                instructions: {
                  duties: formData.duties
                    ? formData.duties.split("\n").filter(Boolean)
                    : [],
                  procedures: formData.procedures,
                  equipment: formData.equipment
                    ? formData.equipment
                        .split(",")
                        .map((e) => e.trim())
                        .filter(Boolean)
                    : [],
                  emergencyContact: formData.emergencyContact,
                },
                status: formData.status,
                priority: formData.priority,
                updatedAt: new Date(),
              }
            : p,
        ),
      );
      setIsEditModalOpen(false);
    } else {
      const newPoste: Poste = {
        id: `poste-${Date.now()}`,
        siteId: createSiteId,
        name: formData.name,
        type: formData.type,
        description: formData.description,
        requirements: {
          requiredCertifications: formData.requiredCertifications,
          requiredQualifications: formData.requiredQualifications,
        },
        schedule: {
          defaultShiftDuration: formData.defaultShiftDuration,
          breakDuration: formData.breakDuration,
          nightShift: formData.nightShift,
          weekendWork: formData.weekendWork,
          rotatingShift: formData.rotatingShift,
          vacationStart: formData.vacationStart,
          vacationEnd: formData.vacationEnd,
        },
        capacity: {
          minAgents: formData.minAgents,
          maxAgents: formData.maxAgents,
          currentAgents: 0,
        },
        instructions: {
          duties: formData.duties
            ? formData.duties.split("\n").filter(Boolean)
            : [],
          procedures: formData.procedures,
          equipment: formData.equipment
            ? formData.equipment
                .split(",")
                .map((e) => e.trim())
                .filter(Boolean)
            : [],
          emergencyContact: formData.emergencyContact,
        },
        status: formData.status,
        priority: formData.priority,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setPostes((prev) => [...prev, newPoste]);
      setIsCreateModalOpen(false);
    }
  };

  const posteForm = (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="general" className="gap-2">
          <Briefcase className="h-4 w-4" />
          Général
        </TabsTrigger>
        <TabsTrigger value="planning" className="gap-2">
          <CalendarClock className="h-4 w-4" />
          Planning
        </TabsTrigger>
        <TabsTrigger value="instructions" className="gap-2">
          <ClipboardList className="h-4 w-4" />
          Instructions
        </TabsTrigger>
      </TabsList>

      {/* ── General ── */}
      <TabsContent value="general" className="space-y-5 mt-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 col-span-2">
            <Label className="text-base font-semibold">Nom du poste</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((f) => ({ ...f, name: e.target.value }))
              }
              placeholder="Ex: Agent de surveillance principale"
              className="text-base"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-base font-semibold">Type de poste</Label>
            <Select
              value={formData.type}
              onValueChange={(v) =>
                setFormData((f) => ({ ...f, type: v as PosteType }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(POSTE_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-base font-semibold">Priorité</Label>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  { value: "low", label: "Faible", color: "bg-slate-500" },
                  { value: "medium", label: "Moyen", color: "bg-blue-500" },
                  { value: "high", label: "Élevé", color: "bg-amber-500" },
                  { value: "critical", label: "Critique", color: "bg-red-500" },
                ] as {
                  value: Poste["priority"];
                  label: string;
                  color: string;
                }[]
              ).map(({ value, label, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setFormData((f) => ({ ...f, priority: value }))
                  }
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 text-xs font-medium transition-all ${
                    formData.priority === value
                      ? "border-foreground shadow-sm"
                      : "border-border hover:border-foreground/40"
                  }`}
                >
                  <span className={`h-3 w-3 rounded-full ${color}`} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 col-span-2">
            <Label className="text-base font-semibold">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Description du poste..."
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-base font-semibold">Statut</Label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { value: "active", label: "Actif" },
                  { value: "inactive", label: "Inactif" },
                ] as { value: "active" | "inactive"; label: string }[]
              ).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData((f) => ({ ...f, status: value }))}
                  className={`p-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                    formData.status === value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Certifications requises
          </Label>
          <Input
            value={formData.requiredCertifications.join(", ")}
            onChange={(e) =>
              setFormData((f) => ({
                ...f,
                requiredCertifications: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              }))
            }
            placeholder="Ex: CQP APS, SSIAP 1"
          />
          {formData.requiredCertifications.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {formData.requiredCertifications.map((c) => (
                <Badge key={c} variant="outline" className="gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {c}
                </Badge>
              ))}
            </div>
          )}
          <Input
            value={(formData.requiredQualifications ?? []).join(", ")}
            onChange={(e) =>
              setFormData((f) => ({
                ...f,
                requiredQualifications: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              }))
            }
            placeholder="Qualifications — Ex: Permis B, Habilitation électrique"
          />
        </div>
      </TabsContent>

      {/* ── Planning ── */}
      <TabsContent value="planning" className="space-y-5 mt-0">
        <div>
          <Label className="text-base font-semibold mb-3 block">
            Durée de vacation
          </Label>
          <div className="flex gap-2 flex-wrap">
            {[4, 6, 8, 10, 12].map((h) => (
              <Button
                key={h}
                type="button"
                variant={
                  formData.defaultShiftDuration === h ? "default" : "outline"
                }
                onClick={() =>
                  setFormData((f) => ({ ...f, defaultShiftDuration: h }))
                }
                className="flex-1 min-w-14"
              >
                {h}h
              </Button>
            ))}
            <div className="flex items-center gap-2 flex-1 min-w-20">
              <Input
                type="number"
                min={1}
                max={24}
                value={formData.defaultShiftDuration}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    defaultShiftDuration: Number(e.target.value),
                  }))
                }
                className="text-base"
              />
              <span className="text-sm text-muted-foreground shrink-0">h</span>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-base font-semibold mb-3 block">
            Durée de pause
          </Label>
          <div className="flex gap-2 flex-wrap">
            {[0, 15, 30, 45, 60].map((min) => (
              <Button
                key={min}
                type="button"
                variant={formData.breakDuration === min ? "default" : "outline"}
                onClick={() =>
                  setFormData((f) => ({ ...f, breakDuration: min }))
                }
                className="flex-1 min-w-16"
              >
                {min === 0 ? "Aucune" : `${min} min`}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm">Début de vacation</Label>
            <Input
              type="time"
              value={formData.vacationStart}
              onChange={(e) =>
                setFormData({ ...formData, vacationStart: e.target.value })
              }
            />
          </div>
          <div>
            <Label className="text-sm">Fin de vacation</Label>
            <Input
              type="time"
              value={formData.vacationEnd}
              onChange={(e) =>
                setFormData({ ...formData, vacationEnd: e.target.value })
              }
            />
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-base font-semibold mb-3 block">
            Capacité agents
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm">Minimum requis</Label>
              <Input
                type="number"
                min={1}
                value={formData.minAgents}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    minAgents: Number(e.target.value),
                  }))
                }
                className="text-base"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Maximum autorisé</Label>
              <Input
                type="number"
                min={1}
                value={formData.maxAgents}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    maxAgents: Number(e.target.value),
                  }))
                }
                className="text-base"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <Label className="text-base font-semibold mb-3 block">
            Contraintes horaires
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                { key: "nightShift", label: "Shift de nuit", icon: Moon },
                { key: "weekendWork", label: "Week-end", icon: Users },
                { key: "rotatingShift", label: "Tournant", icon: RotateCcw },
              ] as {
                key: keyof PosteFormData;
                label: string;
                icon: React.ElementType;
              }[]
            ).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setFormData((f) => ({ ...f, [key]: !f[key] }))}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  formData[key]
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${formData[key] ? "text-primary" : "text-muted-foreground"}`}
                />
                {label}
              </button>
            ))}
          </div>
        </div>
      </TabsContent>

      {/* ── Instructions ── */}
      <TabsContent value="instructions" className="space-y-5 mt-0">
        <div className="space-y-1.5">
          <Label className="text-base font-semibold">Tâches & missions</Label>
          <Textarea
            value={formData.duties ?? ""}
            onChange={(e) =>
              setFormData((f) => ({ ...f, duties: e.target.value }))
            }
            placeholder="Une tâche par ligne..."
            rows={5}
          />
          <p className="text-xs text-muted-foreground">Une tâche par ligne</p>
        </div>

        <div className="space-y-1.5">
          <Label className="text-base font-semibold">
            Équipements nécessaires
          </Label>
          <Input
            value={formData.equipment ?? ""}
            onChange={(e) =>
              setFormData((f) => ({ ...f, equipment: e.target.value }))
            }
            placeholder="Ex: Radio, Lampe torche, Gilet pare-balles"
          />
          {formData.equipment && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {formData.equipment
                .split(",")
                .map((e) => e.trim())
                .filter(Boolean)
                .map((eq) => (
                  <Badge key={eq} variant="outline" className="gap-1 text-xs">
                    <Wrench className="h-3 w-3" />
                    {eq}
                  </Badge>
                ))}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-base font-semibold">
            Procédures spécifiques
          </Label>
          <Textarea
            value={formData.procedures ?? ""}
            onChange={(e) =>
              setFormData((f) => ({ ...f, procedures: e.target.value }))
            }
            placeholder="Procédures à suivre en cas d'incident..."
            rows={4}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-base font-semibold">
            Contact d&apos;urgence
          </Label>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              value={formData.emergencyContact ?? ""}
              onChange={(e) =>
                setFormData((f) => ({
                  ...f,
                  emergencyContact: e.target.value,
                }))
              }
              placeholder="Ex: Responsable sécurité — 06 00 00 00 00"
              className="text-base"
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Briefcase className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-serif text-3xl font-light tracking-tight">
              Gestion des Postes
            </h1>
            <p className="mt-1 text-sm font-light text-muted-foreground">
              Création et gestion des différents postes de sécurité
            </p>
          </div>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau poste
        </Button>
      </div>

      {/* Stats */}
      <InfoCardContainer>
        <InfoCard
          icon={Briefcase}
          title="Total postes"
          value={totalPostes}
          color="blue"
        />
        <InfoCard
          icon={CheckCircle}
          title="Postes actifs"
          value={activePostes}
          subtext={`${totalPostes - activePostes} inactif(s)`}
          color="green"
        />
        <InfoCard
          icon={AlertCircle}
          title="Priorité critique"
          value={criticalPostes}
          color="red"
        />
        <InfoCard
          icon={Moon}
          title="Shifts de nuit"
          value={nightShiftPostes}
          color="indigo"
        />
      </InfoCardContainer>

      {/* Table */}
      <DataTable
        data={postes}
        columns={columns}
        searchKeys={["name", "type", "siteId"] as (keyof Poste)[]}
        getSearchValue={(p) =>
          `${p.name} ${POSTE_TYPE_LABELS[p.type]} ${getSiteNameById(p.siteId)}`
        }
        searchPlaceholder="Rechercher un poste..."
        filters={[
          {
            key: "status",
            label: "Statut",
            options: [
              { value: "active", label: "Actif" },
              { value: "inactive", label: "Inactif" },
            ],
          },
          {
            key: "priority",
            label: "Priorité",
            options: [
              { value: "low", label: "Faible" },
              { value: "medium", label: "Moyen" },
              { value: "high", label: "Élevé" },
              { value: "critical", label: "Critique" },
            ],
          },
          {
            key: "type",
            label: "Type",
            options: (Object.keys(POSTE_TYPE_LABELS) as PosteType[]).map(
              (t) => ({ value: t, label: POSTE_TYPE_LABELS[t] }),
            ),
          },
        ]}
        groupBy="siteId"
        groupByLabel={(v) => getSiteNameById(v as string)}
        groupByOptions={mockSites.map((s) => ({ value: s.id, label: s.name }))}
        getRowId={(p) => p.id}
        onRowClick={handleView}
        itemsPerPage={20}
      />

      {/* Create Modal */}
      <Modal
        open={showCreateFromUrl || isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (!open) {
            window.history.pushState({}, "", window.location.pathname);
          }
        }}
        type="form"
        size="xl"
        title="Nouveau poste"
        description="Définissez les caractéristiques du poste de sécurité"
        actions={{
          primary: {
            label: "Créer le poste",
            onClick: () => handleSave(false),
            disabled: !formData.name,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsCreateModalOpen(false),
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Site *</Label>
            <Select value={createSiteId} onValueChange={setCreateSiteId}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un site" />
              </SelectTrigger>
              <SelectContent>
                {mockSites.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {posteForm}
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        type="details"
        size="xl"
        title="Modifier le poste"
        description={selectedPoste?.name}
        actions={{
          primary: {
            label: "Enregistrer",
            onClick: () => handleSave(true),
            disabled: !formData.name,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsEditModalOpen(false),
            variant: "outline",
          },
        }}
      >
        {posteForm}
      </Modal>

      {/* View Modal */}
      {selectedPoste && (
        <Modal
          open={isViewModalOpen}
          onOpenChange={setIsViewModalOpen}
          type="details"
          size="xl"
          title={selectedPoste.name}
          description={`${POSTE_TYPE_LABELS[selectedPoste.type]} — ${getSiteNameById(selectedPoste.siteId)}`}
          actions={{
            primary: {
              label: "Modifier",
              onClick: () => {
                setIsViewModalOpen(false);
                handleEdit(selectedPoste);
              },
            },
            secondary: {
              label: "Fermer",
              onClick: () => setIsViewModalOpen(false),
              variant: "outline",
            },
          }}
        >
          <div className="space-y-5 text-sm">
            {/* Hero header */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/40 border border-border/50">
              <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {getStatusBadge(selectedPoste.status)}
                  {getPriorityBadge(selectedPoste.priority)}
                  <Badge variant="secondary">
                    {POSTE_TYPE_LABELS[selectedPoste.type]}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                    <MapPin className="h-3.5 w-3.5" />
                    {getSiteNameById(selectedPoste.siteId)}
                  </div>
                </div>
                {selectedPoste.description && (
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {selectedPoste.description}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Planning card */}
              <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarClock className="h-3.5 w-3.5" /> Planning
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vacation</span>
                    <span className="font-semibold">
                      {selectedPoste.schedule.defaultShiftDuration}h
                    </span>
                  </div>
                  {!!selectedPoste.schedule.breakDuration && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pause</span>
                      <span>{selectedPoste.schedule.breakDuration} min</span>
                    </div>
                  )}
                  <Separator className="my-1" />
                  <div className="flex flex-col gap-1.5">
                    {selectedPoste.schedule.nightShift && (
                      <span className="flex items-center gap-1.5 text-indigo-500">
                        <Moon className="h-3.5 w-3.5" /> Nuit
                      </span>
                    )}
                    {selectedPoste.schedule.weekendWork && (
                      <span className="flex items-center gap-1.5 text-amber-500">
                        <Users className="h-3.5 w-3.5" /> Week-end
                      </span>
                    )}
                    {selectedPoste.schedule.rotatingShift && (
                      <span className="flex items-center gap-1.5 text-emerald-500">
                        <RotateCcw className="h-3.5 w-3.5" /> Tournant
                      </span>
                    )}
                    {!selectedPoste.schedule.nightShift &&
                      !selectedPoste.schedule.weekendWork &&
                      !selectedPoste.schedule.rotatingShift && (
                        <span className="text-muted-foreground text-xs">
                          Standard
                        </span>
                      )}
                  </div>
                </div>
              </div>

              {/* Capacité card */}
              <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> Capacité
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Actuels</span>
                    <span className="font-semibold">
                      {selectedPoste.capacity.currentAgents ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min</span>
                    <span>{selectedPoste.capacity.minAgents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max</span>
                    <span>{selectedPoste.capacity.maxAgents}</span>
                  </div>
                  <Separator className="my-1" />
                  <div className="w-full bg-border rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          ((selectedPoste.capacity.currentAgents ?? 0) /
                            selectedPoste.capacity.maxAgents) *
                            100,
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {selectedPoste.capacity.currentAgents ?? 0} /{" "}
                    {selectedPoste.capacity.maxAgents} agents
                  </p>
                </div>
              </div>

              {/* Exigences card */}
              <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> Exigences
                </p>
                <div className="space-y-2">
                  {(selectedPoste.requirements.minimumExperience ?? 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Exp. min.</span>
                      <span>
                        {selectedPoste.requirements.minimumExperience} mois
                      </span>
                    </div>
                  )}
                  {selectedPoste.requirements.physicalRequirements && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {selectedPoste.requirements.physicalRequirements}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {selectedPoste.requirements.requiredCertifications.map(
                      (c) => (
                        <Badge
                          key={c}
                          variant="outline"
                          className="text-xs gap-1"
                        >
                          <ShieldCheck className="h-3 w-3" />
                          {c}
                        </Badge>
                      ),
                    )}
                    {(
                      selectedPoste.requirements.requiredQualifications ?? []
                    ).map((q) => (
                      <Badge key={q} variant="secondary" className="text-xs">
                        {q}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            {selectedPoste.instructions &&
              (() => {
                const { duties, equipment, procedures, emergencyContact } =
                  selectedPoste.instructions;
                const hasDuties = duties.length > 0;
                const hasEquipment = equipment && equipment.length > 0;
                const hasAnything =
                  hasDuties || hasEquipment || procedures || emergencyContact;
                if (!hasAnything) return null;
                return (
                  <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <ClipboardList className="h-3.5 w-3.5" /> Instructions
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {hasDuties && (
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">
                            Tâches & missions
                          </p>
                          <ul className="space-y-1">
                            {duties.map((d, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-xs"
                              >
                                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="space-y-3">
                        {hasEquipment && (
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                              <Wrench className="h-3.5 w-3.5" /> Équipements
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {equipment!.map((eq) => (
                                <Badge
                                  key={eq}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {eq}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {emergencyContact && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5" /> Contact urgence
                            </p>
                            <p className="text-xs">{emergencyContact}</p>
                          </div>
                        )}
                        {procedures && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                              Procédures
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {procedures}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
          </div>
        </Modal>
      )}

      {/* Delete confirmation */}
      <Modal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        type="warning"
        title="Supprimer le poste"
        description={`Êtes-vous sûr de vouloir supprimer le poste "${posteToDelete?.name}" ? Cette action est irréversible.`}
        actions={{
          primary: {
            label: "Supprimer",
            onClick: handleConfirmDelete,
            variant: "destructive",
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsDeleteModalOpen(false),
            variant: "outline",
          },
        }}
      >
        <div />
      </Modal>
    </div>
  );
}
