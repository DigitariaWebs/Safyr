"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Textarea } from "@/components/ui/textarea";
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
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  MapPin,
  Building2,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Users,
  DollarSign,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { Site, Poste, SiteFormData, PosteFormData } from "@/lib/types";
import { mockSites, mockSiteStats, mockPostes } from "@/data/sites";

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>(mockSites);
  const [postes, setPostes] = useState<Poste[]>(mockPostes);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [isCreateSiteModalOpen, setIsCreateSiteModalOpen] = useState(false);
  const [isEditSiteModalOpen, setIsEditSiteModalOpen] = useState(false);
  const [isViewSiteModalOpen, setIsViewSiteModalOpen] = useState(false);
  const [isDeleteSiteModalOpen, setIsDeleteSiteModalOpen] = useState(false);
  const [isCreatePosteModalOpen, setIsCreatePosteModalOpen] = useState(false);
  const [isEditPosteModalOpen, setIsEditPosteModalOpen] = useState(false);
  const [isViewPosteModalOpen, setIsViewPosteModalOpen] = useState(false);
  const [isDeletePosteModalOpen, setIsDeletePosteModalOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);
  const [selectedPoste, setSelectedPoste] = useState<Poste | null>(null);
  const [posteToDelete, setPosteToDelete] = useState<Poste | null>(null);
  const [expandedSites, setExpandedSites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"sites" | "postes">("sites");

  const [siteFormData, setSiteFormData] = useState<SiteFormData>({
    name: "",
    clientId: "",
    street: "",
    city: "",
    postalCode: "",
    country: "France",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    contactPosition: "",
    mandatoryHours: "",
    requiredCertifications: [],
    accessInstructions: "",
    specialRequirements: "",
    hourlyRate: 0,
    overtimeRate: 0,
    nightRate: 0,
    weekendRate: 0,
    holidayRate: 0,
    status: "active",
    contractStartDate: "",
    contractEndDate: "",
    notes: "",
  });

  const [posteFormData, setPosteFormData] = useState<PosteFormData>({
    name: "",
    type: "surveillance",
    description: "",
    minimumExperience: 0,
    requiredCertifications: [],
    requiredQualifications: [],
    physicalRequirements: "",
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
  });

  const getStatusBadge = (status: Site["status"]) => {
    const variants = {
      active: { variant: "default" as const, label: "Actif" },
      inactive: { variant: "secondary" as const, label: "Inactif" },
      suspended: { variant: "destructive" as const, label: "Suspendu" },
    };
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: Poste["priority"]) => {
    const variants = {
      low: { variant: "secondary" as const, label: "Basse" },
      medium: { variant: "default" as const, label: "Moyenne" },
      high: { variant: "default" as const, label: "Haute" },
      critical: { variant: "destructive" as const, label: "Critique" },
    };
    const config = variants[priority];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPosteTypeLabel = (type: Poste["type"]) => {
    const labels = {
      rondier: "Rondier",
      pc_securite: "PC Sécurité",
      controle_acces: "Contrôle d'accès",
      surveillance: "Surveillance",
      agent_cynophile: "Agent Cynophile",
      agent_ssiap: "Agent SSIAP",
      chef_equipe: "Chef d'équipe",
      other: "Autre",
    };
    return labels[type];
  };

  const toggleSiteExpansion = (siteId: string) => {
    const newExpanded = new Set(expandedSites);
    if (newExpanded.has(siteId)) {
      newExpanded.delete(siteId);
    } else {
      newExpanded.add(siteId);
    }
    setExpandedSites(newExpanded);
  };

  const handleViewSite = (site: Site) => {
    setSelectedSite(site);
    setIsViewSiteModalOpen(true);
  };

  const handleEditSite = (site: Site) => {
    setSelectedSite(site);
    setSiteFormData({
      name: site.name,
      clientId: site.clientId,
      street: site.address.street,
      city: site.address.city,
      postalCode: site.address.postalCode,
      country: site.address.country,
      contactName: site.contact.name,
      contactPhone: site.contact.phone,
      contactEmail: site.contact.email,
      contactPosition: site.contact.position || "",
      mandatoryHours: site.constraints.mandatoryHours?.join(", ") || "",
      requiredCertifications: site.constraints.requiredCertifications,
      accessInstructions: site.constraints.accessInstructions || "",
      specialRequirements: site.constraints.specialRequirements || "",
      hourlyRate: site.billing.hourlyRate,
      overtimeRate: site.billing.overtimeRate || 0,
      nightRate: site.billing.nightRate || 0,
      weekendRate: site.billing.weekendRate || 0,
      holidayRate: site.billing.holidayRate || 0,
      status: site.status,
      contractStartDate: site.contractStartDate.toISOString().split("T")[0],
      contractEndDate: site.contractEndDate
        ? site.contractEndDate.toISOString().split("T")[0]
        : "",
      notes: site.notes || "",
    });
    setIsEditSiteModalOpen(true);
  };

  const handleSaveSite = () => {
    if (selectedSite) {
      // Update existing site
      setSites(
        sites.map((s) =>
          s.id === selectedSite.id
            ? {
                ...s,
                name: siteFormData.name,
                clientId: siteFormData.clientId,
                clientName: siteFormData.clientId, // In real app, fetch from clients
                address: {
                  street: siteFormData.street,
                  city: siteFormData.city,
                  postalCode: siteFormData.postalCode,
                  country: siteFormData.country,
                },
                contact: {
                  name: siteFormData.contactName,
                  phone: siteFormData.contactPhone,
                  email: siteFormData.contactEmail,
                  position: siteFormData.contactPosition,
                },
                constraints: {
                  mandatoryHours: siteFormData.mandatoryHours
                    ? [siteFormData.mandatoryHours]
                    : [],
                  requiredCertifications: siteFormData.requiredCertifications,
                  accessInstructions: siteFormData.accessInstructions,
                  specialRequirements: siteFormData.specialRequirements,
                },
                billing: {
                  hourlyRate: siteFormData.hourlyRate,
                  overtimeRate: siteFormData.overtimeRate,
                  nightRate: siteFormData.nightRate,
                  weekendRate: siteFormData.weekendRate,
                  holidayRate: siteFormData.holidayRate,
                },
                status: siteFormData.status,
                contractStartDate: new Date(siteFormData.contractStartDate),
                contractEndDate: siteFormData.contractEndDate
                  ? new Date(siteFormData.contractEndDate)
                  : undefined,
                notes: siteFormData.notes,
                updatedAt: new Date(),
              }
            : s,
        ),
      );
      setIsEditSiteModalOpen(false);
    } else {
      // Create new site
      const newSite: Site = {
        id: `site-${Date.now()}`,
        name: siteFormData.name,
        clientId: siteFormData.clientId,
        clientName: siteFormData.clientId, // In real app, fetch from clients
        address: {
          street: siteFormData.street,
          city: siteFormData.city,
          postalCode: siteFormData.postalCode,
          country: siteFormData.country,
        },
        contact: {
          name: siteFormData.contactName,
          phone: siteFormData.contactPhone,
          email: siteFormData.contactEmail,
          position: siteFormData.contactPosition,
        },
        constraints: {
          mandatoryHours: siteFormData.mandatoryHours
            ? [siteFormData.mandatoryHours]
            : [],
          requiredCertifications: siteFormData.requiredCertifications,
          accessInstructions: siteFormData.accessInstructions,
          specialRequirements: siteFormData.specialRequirements,
        },
        billing: {
          hourlyRate: siteFormData.hourlyRate,
          overtimeRate: siteFormData.overtimeRate,
          nightRate: siteFormData.nightRate,
          weekendRate: siteFormData.weekendRate,
          holidayRate: siteFormData.holidayRate,
        },
        status: siteFormData.status,
        contractStartDate: new Date(siteFormData.contractStartDate),
        contractEndDate: siteFormData.contractEndDate
          ? new Date(siteFormData.contractEndDate)
          : undefined,
        postes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: siteFormData.notes,
      };
      setSites([...sites, newSite]);
      setIsCreateSiteModalOpen(false);
    }
    setSelectedSite(null);
  };

  const handleDeleteSite = (site: Site) => {
    setSiteToDelete(site);
    setIsDeleteSiteModalOpen(true);
  };

  const confirmDeleteSite = () => {
    if (siteToDelete) {
      setSites(sites.filter((s) => s.id !== siteToDelete.id));
      setPostes(postes.filter((p) => p.siteId !== siteToDelete.id));
      setIsDeleteSiteModalOpen(false);
      setSiteToDelete(null);
    }
  };

  const handleViewPoste = (poste: Poste) => {
    setSelectedPoste(poste);
    setIsViewPosteModalOpen(true);
  };

  const handleEditPoste = (poste: Poste) => {
    setSelectedPoste(poste);
    setPosteFormData({
      name: poste.name,
      type: poste.type,
      description: poste.description || "",
      minimumExperience: poste.requirements.minimumExperience || 0,
      requiredCertifications: poste.requirements.requiredCertifications,
      requiredQualifications: poste.requirements.requiredQualifications || [],
      physicalRequirements: poste.requirements.physicalRequirements || "",
      defaultShiftDuration: poste.schedule.defaultShiftDuration,
      breakDuration: poste.schedule.breakDuration || 30,
      nightShift: poste.schedule.nightShift,
      weekendWork: poste.schedule.weekendWork,
      rotatingShift: poste.schedule.rotatingShift,
      minAgents: poste.capacity.minAgents,
      maxAgents: poste.capacity.maxAgents,
      duties: poste.instructions?.duties.join("\n") || "",
      procedures: poste.instructions?.procedures || "",
      equipment: poste.instructions?.equipment?.join(", ") || "",
      emergencyContact: poste.instructions?.emergencyContact || "",
      status: poste.status,
      priority: poste.priority,
    });
    setIsEditPosteModalOpen(true);
  };

  const handleSavePoste = () => {
    if (selectedPoste) {
      // Update existing poste
      setPostes(
        postes.map((p) =>
          p.id === selectedPoste.id
            ? {
                ...p,
                name: posteFormData.name,
                type: posteFormData.type,
                description: posteFormData.description,
                requirements: {
                  minimumExperience: posteFormData.minimumExperience,
                  requiredCertifications: posteFormData.requiredCertifications,
                  requiredQualifications: posteFormData.requiredQualifications,
                  physicalRequirements: posteFormData.physicalRequirements,
                },
                schedule: {
                  defaultShiftDuration: posteFormData.defaultShiftDuration,
                  breakDuration: posteFormData.breakDuration,
                  nightShift: posteFormData.nightShift,
                  weekendWork: posteFormData.weekendWork,
                  rotatingShift: posteFormData.rotatingShift,
                },
                capacity: {
                  minAgents: posteFormData.minAgents,
                  maxAgents: posteFormData.maxAgents,
                  currentAgents: p.capacity.currentAgents,
                },
                instructions: {
                  duties: (posteFormData.duties || "")
                    .split("\n")
                    .filter((d) => d.trim()),
                  procedures: posteFormData.procedures,
                  equipment: (posteFormData.equipment || "")
                    .split(",")
                    .map((e) => e.trim())
                    .filter((e) => e),
                  emergencyContact: posteFormData.emergencyContact,
                },
                status: posteFormData.status,
                priority: posteFormData.priority,
                updatedAt: new Date(),
              }
            : p,
        ),
      );
      setIsEditPosteModalOpen(false);
    } else if (selectedSite) {
      // Create new poste
      const newPoste: Poste = {
        id: `poste-${Date.now()}`,
        siteId: selectedSite.id,
        name: posteFormData.name,
        type: posteFormData.type,
        description: posteFormData.description,
        requirements: {
          minimumExperience: posteFormData.minimumExperience,
          requiredCertifications: posteFormData.requiredCertifications,
          requiredQualifications: posteFormData.requiredQualifications,
          physicalRequirements: posteFormData.physicalRequirements,
        },
        schedule: {
          defaultShiftDuration: posteFormData.defaultShiftDuration,
          breakDuration: posteFormData.breakDuration,
          nightShift: posteFormData.nightShift,
          weekendWork: posteFormData.weekendWork,
          rotatingShift: posteFormData.rotatingShift,
        },
        capacity: {
          minAgents: posteFormData.minAgents,
          maxAgents: posteFormData.maxAgents,
          currentAgents: 0,
        },
        instructions: {
          duties: (posteFormData.duties || "")
            .split("\n")
            .filter((d) => d.trim()),
          procedures: posteFormData.procedures,
          equipment: (posteFormData.equipment || "")
            .split(",")
            .map((e) => e.trim())
            .filter((e) => e),
          emergencyContact: posteFormData.emergencyContact,
        },
        status: posteFormData.status,
        priority: posteFormData.priority,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setPostes([...postes, newPoste]);
      setIsCreatePosteModalOpen(false);
    }
    setSelectedPoste(null);
    setSelectedSite(null);
  };

  const handleDeletePoste = (poste: Poste) => {
    setPosteToDelete(poste);
    setIsDeletePosteModalOpen(true);
  };

  const confirmDeletePoste = () => {
    if (posteToDelete) {
      setPostes(postes.filter((p) => p.id !== posteToDelete.id));
      setIsDeletePosteModalOpen(false);
      setPosteToDelete(null);
    }
  };

  const handleCreatePoste = (siteId: string) => {
    const site = sites.find((s) => s.id === siteId);
    setSelectedSite(site || null);
    setPosteFormData({
      name: "",
      type: "surveillance",
      description: "",
      minimumExperience: 0,
      requiredCertifications: [],
      requiredQualifications: [],
      physicalRequirements: "",
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
    });
    setIsCreatePosteModalOpen(true);
  };

  const resetPosteForm = () => {
    setPosteFormData({
      name: "",
      type: "surveillance",
      description: "",
      minimumExperience: 0,
      requiredCertifications: [],
      requiredQualifications: [],
      physicalRequirements: "",
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
    });
  };

  const resetSiteForm = () => {
    setSiteFormData({
      name: "",
      clientId: "",
      street: "",
      city: "",
      postalCode: "",
      country: "France",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      contactPosition: "",
      mandatoryHours: "",
      requiredCertifications: [],
      accessInstructions: "",
      specialRequirements: "",
      hourlyRate: 0,
      overtimeRate: 0,
      nightRate: 0,
      weekendRate: 0,
      holidayRate: 0,
      status: "active",
      contractStartDate: "",
      contractEndDate: "",
      notes: "",
    });
  };

  const siteColumns: ColumnDef<Site>[] = [
    {
      key: "name",
      label: "Nom du site",
      render: (site) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSiteExpansion(site.id)}
            className="h-6 w-6 p-0"
          >
            {expandedSites.has(site.id) ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <div>
            <div className="font-medium">{site.name}</div>
            <div className="text-xs text-muted-foreground">
              {site.address.city}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "clientName",
      label: "Client",
      render: (site) => site.clientName,
    },
    {
      key: "postes",
      label: "Postes",
      render: (site) => {
        const postesCount = site.postes.length;
        const activePostes = site.postes.filter(
          (p: Poste) => p.status === "active",
        ).length;
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {activePostes}/{postesCount}
            </span>
          </div>
        );
      },
    },
    {
      key: "billing",
      label: "Tarif horaire",
      render: (site) => (
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span>{site.billing.hourlyRate.toFixed(2)} €</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Statut",
      render: (site) => getStatusBadge(site.status),
    },
    {
      key: "actions",
      label: "Actions",
      render: (site) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewSite(site)}>
              <Eye className="mr-2 h-4 w-4" />
              Voir détails
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditSite(site)}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreatePoste(site.id)}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un poste
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteSite(site)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const posteColumns: ColumnDef<Poste>[] = [
    {
      key: "name",
      label: "Nom du poste",
      render: (poste) => (
        <div>
          <div className="font-medium">{poste.name}</div>
          <div className="text-xs text-muted-foreground">
            {getPosteTypeLabel(poste.type)}
          </div>
        </div>
      ),
    },
    {
      key: "siteId",
      label: "Site",
      render: (poste) => {
        const site = sites.find((s) => s.id === poste.siteId);
        return site?.name || "-";
      },
    },
    {
      key: "capacity",
      label: "Capacité",
      render: (poste) => (
        <div>
          {poste.capacity.currentAgents || 0}/{poste.capacity.maxAgents}
        </div>
      ),
    },
    {
      key: "schedule",
      label: "Horaires",
      render: (poste) => (
        <div className="flex flex-col gap-1 text-xs">
          <div>{poste.schedule.defaultShiftDuration}h</div>
          {poste.schedule.nightShift && (
            <Badge variant="secondary" className="w-fit">
              Nuit
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "priority",
      label: "Priorité",
      render: (poste) => getPriorityBadge(poste.priority),
    },
    {
      key: "status",
      label: "Statut",
      render: (poste) => getStatusBadge(poste.status),
    },
    {
      key: "actions",
      label: "Actions",
      render: (poste) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewPoste(poste)}>
              <Eye className="mr-2 h-4 w-4" />
              Voir détails
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditPoste(poste)}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeletePoste(poste)}
              className="text-destructive"
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
      {/* Stats */}
      <InfoCardContainer>
        <InfoCard
          title="Sites totaux"
          value={mockSiteStats.total}
          icon={MapPin}
          color="blue"
        />
        <InfoCard
          title="Sites actifs"
          value={mockSiteStats.active}
          icon={Building2}
          color="green"
        />
        <InfoCard
          title="Postes créés"
          value={mockSiteStats.totalPostes}
          icon={Users}
          color="blue"
        />
        <InfoCard
          title="Taux de couverture"
          value={`${mockSiteStats.coverageRate.toFixed(1)}%`}
          icon={ShieldCheck}
          color="blue"
        />
      </InfoCardContainer>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "sites" | "postes")}
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="sites">Sites clients</TabsTrigger>
            <TabsTrigger value="postes">Tous les postes</TabsTrigger>
          </TabsList>
          <Button
            onClick={() => {
              if (activeTab === "sites") {
                resetSiteForm();
                setSelectedSite(null);
                setIsCreateSiteModalOpen(true);
              } else {
                resetPosteForm();
                setSelectedPoste(null);
                setSelectedSite(null);
                setIsCreatePosteModalOpen(true);
              }
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {activeTab === "sites" ? "Nouveau site" : "Nouveau poste"}
          </Button>
        </div>

        <TabsContent value="sites" className="space-y-4">
          <DataTable<Site> columns={siteColumns} data={sites} />

          {/* Expanded site details */}
          {Array.from(expandedSites).map((siteId) => {
            const site = sites.find((s) => s.id === siteId);
            if (!site) return null;

            const sitePostes = postes.filter((p) => p.siteId === siteId);

            return (
              <div
                key={siteId}
                className="ml-8 rounded-lg border bg-muted/50 p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Postes de {site.name}
                  </h3>
                  <Button size="sm" onClick={() => handleCreatePoste(siteId)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un poste
                  </Button>
                </div>

                {sitePostes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucun poste créé pour ce site
                  </p>
                ) : (
                  <div className="space-y-2">
                    {sitePostes.map((poste) => (
                      <div
                        key={poste.id}
                        className="flex items-center justify-between rounded-md border bg-background p-3"
                      >
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="font-medium">{poste.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {getPosteTypeLabel(poste.type)} •{" "}
                              {poste.schedule.defaultShiftDuration}h
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {getPriorityBadge(poste.priority)}
                            {getStatusBadge(poste.status)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewPoste(poste)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPoste(poste)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePoste(poste)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="postes">
          <DataTable<Poste> columns={posteColumns} data={postes} />
        </TabsContent>
      </Tabs>

      {/* Create Site Modal */}
      <Modal
        open={isCreateSiteModalOpen}
        onOpenChange={setIsCreateSiteModalOpen}
        title="Créer un nouveau site"
        description="Ajoutez un nouveau site client"
        size="xl"
        type="form"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-4">
            <h4 className="font-medium">Informations générales</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Nom du site *</Label>
                <Input
                  id="name"
                  value={siteFormData.name}
                  onChange={(e) =>
                    setSiteFormData({ ...siteFormData, name: e.target.value })
                  }
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="clientId">Client *</Label>
                <Input
                  id="clientId"
                  value={siteFormData.clientId}
                  onChange={(e) =>
                    setSiteFormData({
                      ...siteFormData,
                      clientId: e.target.value,
                    })
                  }
                  placeholder="ID ou nom du client"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Adresse</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="street">Rue *</Label>
                <Input
                  id="street"
                  value={siteFormData.street}
                  onChange={(e) =>
                    setSiteFormData({ ...siteFormData, street: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  value={siteFormData.city}
                  onChange={(e) =>
                    setSiteFormData({ ...siteFormData, city: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="postalCode">Code postal *</Label>
                <Input
                  id="postalCode"
                  value={siteFormData.postalCode}
                  onChange={(e) =>
                    setSiteFormData({
                      ...siteFormData,
                      postalCode: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Contact sur site</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName">Nom du contact *</Label>
                <Input
                  id="contactName"
                  value={siteFormData.contactName}
                  onChange={(e) =>
                    setSiteFormData({
                      ...siteFormData,
                      contactName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="contactPosition">Fonction</Label>
                <Input
                  id="contactPosition"
                  value={siteFormData.contactPosition}
                  onChange={(e) =>
                    setSiteFormData({
                      ...siteFormData,
                      contactPosition: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Téléphone *</Label>
                <PhoneInput
                  id="contactPhone"
                  value={siteFormData.contactPhone}
                  onChange={(value) =>
                    setSiteFormData({ ...siteFormData, contactPhone: value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={siteFormData.contactEmail}
                  onChange={(e) =>
                    setSiteFormData({
                      ...siteFormData,
                      contactEmail: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Contraintes</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="mandatoryHours">Horaires obligatoires</Label>
                <Input
                  id="mandatoryHours"
                  value={siteFormData.mandatoryHours}
                  onChange={(e) =>
                    setSiteFormData({
                      ...siteFormData,
                      mandatoryHours: e.target.value,
                    })
                  }
                  placeholder="Ex: 08:00-18:00"
                />
              </div>
              <div>
                <Label htmlFor="accessInstructions">
                  Instructions d&apos;accès
                </Label>
                <Textarea
                  id="accessInstructions"
                  value={siteFormData.accessInstructions}
                  onChange={(e) =>
                    setSiteFormData({
                      ...siteFormData,
                      accessInstructions: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="specialRequirements">Exigences spéciales</Label>
                <Textarea
                  id="specialRequirements"
                  value={siteFormData.specialRequirements}
                  onChange={(e) =>
                    setSiteFormData({
                      ...siteFormData,
                      specialRequirements: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Facturation</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hourlyRate">Taux horaire (€) *</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  value={siteFormData.hourlyRate}
                  onChange={(e) =>
                    setSiteFormData({
                      ...siteFormData,
                      hourlyRate: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="overtimeRate">Taux HS (€)</Label>
                <Input
                  id="overtimeRate"
                  type="number"
                  step="0.01"
                  value={siteFormData.overtimeRate}
                  onChange={(e) =>
                    setSiteFormData({
                      ...siteFormData,
                      overtimeRate: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="nightRate">Taux nuit (€)</Label>
                <Input
                  id="nightRate"
                  type="number"
                  step="0.01"
                  value={siteFormData.nightRate}
                  onChange={(e) =>
                    setSiteFormData({
                      ...siteFormData,
                      nightRate: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="weekendRate">Taux weekend (€)</Label>
                <Input
                  id="weekendRate"
                  type="number"
                  step="0.01"
                  value={siteFormData.weekendRate}
                  onChange={(e) =>
                    setSiteFormData({
                      ...siteFormData,
                      weekendRate: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="holidayRate">Taux férié (€)</Label>
                <Input
                  id="holidayRate"
                  type="number"
                  step="0.01"
                  value={siteFormData.holidayRate}
                  onChange={(e) =>
                    setSiteFormData({
                      ...siteFormData,
                      holidayRate: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Contrat</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contractStartDate">Date de début *</Label>
                <Input
                  id="contractStartDate"
                  type="date"
                  value={siteFormData.contractStartDate}
                  onChange={(e) =>
                    setSiteFormData({
                      ...siteFormData,
                      contractStartDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="contractEndDate">Date de fin</Label>
                <Input
                  id="contractEndDate"
                  type="date"
                  value={siteFormData.contractEndDate}
                  onChange={(e) =>
                    setSiteFormData({
                      ...siteFormData,
                      contractEndDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="status">Statut *</Label>
                <Select
                  value={siteFormData.status}
                  onValueChange={(value: "active" | "inactive" | "suspended") =>
                    setSiteFormData({ ...siteFormData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="suspended">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={siteFormData.notes}
              onChange={(e) =>
                setSiteFormData({ ...siteFormData, notes: e.target.value })
              }
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              setIsCreateSiteModalOpen(false);
              setSelectedSite(null);
            }}
          >
            Annuler
          </Button>
          <Button onClick={handleSaveSite}>Créer le site</Button>
        </div>
      </Modal>

      {/* Edit Site Modal */}
      {selectedSite && (
        <Modal
          open={isEditSiteModalOpen}
          onOpenChange={setIsEditSiteModalOpen}
          title="Modifier le site"
          description="Modifiez les informations du site"
          size="xl"
          type="form"
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-4">
              <h4 className="font-medium">Informations générales</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="edit-name">Nom du site *</Label>
                  <Input
                    id="edit-name"
                    value={siteFormData.name}
                    onChange={(e) =>
                      setSiteFormData({ ...siteFormData, name: e.target.value })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-clientId">Client *</Label>
                  <Input
                    id="edit-clientId"
                    value={siteFormData.clientId}
                    onChange={(e) =>
                      setSiteFormData({
                        ...siteFormData,
                        clientId: e.target.value,
                      })
                    }
                    placeholder="ID ou nom du client"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Adresse</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="edit-street">Rue *</Label>
                  <Input
                    id="edit-street"
                    value={siteFormData.street}
                    onChange={(e) =>
                      setSiteFormData({
                        ...siteFormData,
                        street: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-city">Ville *</Label>
                  <Input
                    id="edit-city"
                    value={siteFormData.city}
                    onChange={(e) =>
                      setSiteFormData({ ...siteFormData, city: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-postalCode">Code postal *</Label>
                  <Input
                    id="edit-postalCode"
                    value={siteFormData.postalCode}
                    onChange={(e) =>
                      setSiteFormData({
                        ...siteFormData,
                        postalCode: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Contact sur site</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-contactName">Nom du contact *</Label>
                  <Input
                    id="edit-contactName"
                    value={siteFormData.contactName}
                    onChange={(e) =>
                      setSiteFormData({
                        ...siteFormData,
                        contactName: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-contactPosition">Fonction</Label>
                  <Input
                    id="edit-contactPosition"
                    value={siteFormData.contactPosition}
                    onChange={(e) =>
                      setSiteFormData({
                        ...siteFormData,
                        contactPosition: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-contactPhone">Téléphone *</Label>
                  <PhoneInput
                    id="edit-contactPhone"
                    value={siteFormData.contactPhone}
                    onChange={(value) =>
                      setSiteFormData({ ...siteFormData, contactPhone: value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-contactEmail">Email *</Label>
                  <Input
                    id="edit-contactEmail"
                    type="email"
                    value={siteFormData.contactEmail}
                    onChange={(e) =>
                      setSiteFormData({
                        ...siteFormData,
                        contactEmail: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Facturation</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-hourlyRate">Taux horaire (€) *</Label>
                  <Input
                    id="edit-hourlyRate"
                    type="number"
                    step="0.01"
                    value={siteFormData.hourlyRate}
                    onChange={(e) =>
                      setSiteFormData({
                        ...siteFormData,
                        hourlyRate: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-overtimeRate">Taux HS (€)</Label>
                  <Input
                    id="edit-overtimeRate"
                    type="number"
                    step="0.01"
                    value={siteFormData.overtimeRate}
                    onChange={(e) =>
                      setSiteFormData({
                        ...siteFormData,
                        overtimeRate: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-nightRate">Taux nuit (€)</Label>
                  <Input
                    id="edit-nightRate"
                    type="number"
                    step="0.01"
                    value={siteFormData.nightRate}
                    onChange={(e) =>
                      setSiteFormData({
                        ...siteFormData,
                        nightRate: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">Statut *</Label>
                  <Select
                    value={siteFormData.status}
                    onValueChange={(
                      value: "active" | "inactive" | "suspended",
                    ) => setSiteFormData({ ...siteFormData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                      <SelectItem value="suspended">Suspendu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditSiteModalOpen(false);
                setSelectedSite(null);
              }}
            >
              Annuler
            </Button>
            <Button onClick={handleSaveSite}>Enregistrer</Button>
          </div>
        </Modal>
      )}

      {/* View Site Modal */}
      {selectedSite && (
        <Modal
          open={isViewSiteModalOpen}
          onOpenChange={setIsViewSiteModalOpen}
          title={selectedSite.name}
          description={selectedSite.clientName}
          size="xl"
          type="details"
        >
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Status and Contract Info */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Statut</div>
                  <div className="mt-1">
                    {getStatusBadge(selectedSite.status)}
                  </div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div>
                  <div className="text-sm text-muted-foreground">Contrat</div>
                  <div className="mt-1 text-sm font-medium">
                    {selectedSite.contractStartDate.toLocaleDateString("fr-FR")}
                    {selectedSite.contractEndDate && (
                      <>
                        {" "}
                        →{" "}
                        {selectedSite.contractEndDate.toLocaleDateString(
                          "fr-FR",
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div>
                  <div className="text-sm text-muted-foreground">Postes</div>
                  <div className="mt-1 text-sm font-medium">
                    {selectedSite.postes.length} poste
                    {selectedSite.postes.length > 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-semibold">Adresse</h4>
                  </div>
                  <div className="pl-6 space-y-1 text-sm">
                    <p>{selectedSite.address.street}</p>
                    <p className="text-muted-foreground">
                      {selectedSite.address.postalCode}{" "}
                      {selectedSite.address.city}
                    </p>
                    <p className="text-muted-foreground">
                      {selectedSite.address.country}
                    </p>
                  </div>
                </div>

                {selectedSite.constraints.accessInstructions && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-semibold">
                        Instructions d&apos;accès
                      </h4>
                    </div>
                    <p className="pl-6 text-sm text-muted-foreground">
                      {selectedSite.constraints.accessInstructions}
                    </p>
                  </div>
                )}

                {selectedSite.constraints.specialRequirements && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <h4 className="font-semibold">Exigences spéciales</h4>
                    </div>
                    <p className="pl-6 text-sm text-muted-foreground">
                      {selectedSite.constraints.specialRequirements}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-semibold">Contact sur site</h4>
                  </div>
                  <div className="pl-6 space-y-2 text-sm">
                    <div>
                      <p className="font-medium">{selectedSite.contact.name}</p>
                      {selectedSite.contact.position && (
                        <p className="text-xs text-muted-foreground">
                          {selectedSite.contact.position}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1 text-muted-foreground">
                      <p>{selectedSite.contact.phone}</p>
                      <p>{selectedSite.contact.email}</p>
                    </div>
                  </div>
                </div>

                {selectedSite.constraints.mandatoryHours &&
                  selectedSite.constraints.mandatoryHours.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-semibold">Horaires obligatoires</h4>
                      </div>
                      <div className="pl-6">
                        <Badge variant="outline">
                          {selectedSite.constraints.mandatoryHours[0]}
                        </Badge>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Certifications */}
            {selectedSite.constraints.requiredCertifications.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-semibold">Certifications requises</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedSite.constraints.requiredCertifications.map(
                    (cert) => (
                      <Badge
                        key={cert}
                        variant="secondary"
                        className="font-normal"
                      >
                        {cert}
                      </Badge>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Billing */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold">Tarification</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-xs text-muted-foreground mb-1">
                    Taux horaire
                  </div>
                  <div className="text-lg font-semibold">
                    {selectedSite.billing.hourlyRate.toFixed(2)} €
                  </div>
                </div>
                {selectedSite.billing.overtimeRate &&
                  selectedSite.billing.overtimeRate > 0 && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-xs text-muted-foreground mb-1">
                        Heures sup.
                      </div>
                      <div className="text-lg font-semibold">
                        {selectedSite.billing.overtimeRate.toFixed(2)} €
                      </div>
                    </div>
                  )}
                {selectedSite.billing.nightRate &&
                  selectedSite.billing.nightRate > 0 && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-xs text-muted-foreground mb-1">
                        Taux nuit
                      </div>
                      <div className="text-lg font-semibold">
                        {selectedSite.billing.nightRate.toFixed(2)} €
                      </div>
                    </div>
                  )}
                {selectedSite.billing.weekendRate &&
                  selectedSite.billing.weekendRate > 0 && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-xs text-muted-foreground mb-1">
                        Taux weekend
                      </div>
                      <div className="text-lg font-semibold">
                        {selectedSite.billing.weekendRate.toFixed(2)} €
                      </div>
                    </div>
                  )}
                {selectedSite.billing.holidayRate &&
                  selectedSite.billing.holidayRate > 0 && (
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="text-xs text-muted-foreground mb-1">
                        Taux férié
                      </div>
                      <div className="text-lg font-semibold">
                        {selectedSite.billing.holidayRate.toFixed(2)} €
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Postes */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold">
                  Postes de sécurité ({selectedSite.postes.length})
                </h4>
              </div>
              {selectedSite.postes.length > 0 ? (
                <div className="space-y-2">
                  {selectedSite.postes.map((poste) => (
                    <div
                      key={poste.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-primary/10">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{poste.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {getPosteTypeLabel(poste.type)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              •
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {poste.schedule.defaultShiftDuration}h
                            </span>
                            {poste.schedule.nightShift && (
                              <>
                                <span className="text-xs text-muted-foreground">
                                  •
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  Nuit
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(poste.priority)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPoste(poste)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8 border rounded-lg">
                  Aucun poste créé pour ce site
                </p>
              )}
            </div>

            {/* Notes */}
            {selectedSite.notes && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold">Notes</h4>
                </div>
                <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
                  {selectedSite.notes}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Delete Site Modal */}
      <Modal
        open={isDeleteSiteModalOpen}
        onOpenChange={setIsDeleteSiteModalOpen}
        title="Supprimer le site"
        description="Êtes-vous sûr de vouloir supprimer ce site ?"
        type="confirmation"
      >
        <p className="text-sm text-muted-foreground mb-4">
          Cette action supprimera également tous les postes associés. Cette
          action est irréversible.
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsDeleteSiteModalOpen(false)}
          >
            Annuler
          </Button>
          <Button variant="destructive" onClick={confirmDeleteSite}>
            Supprimer
          </Button>
        </div>
      </Modal>

      {/* View Poste Modal */}
      {selectedPoste && (
        <Modal
          open={isViewPosteModalOpen}
          onOpenChange={setIsViewPosteModalOpen}
          title={selectedPoste.name}
          description={getPosteTypeLabel(selectedPoste.type)}
          size="xl"
          type="details"
        >
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Status Bar */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Statut</div>
                  <div className="mt-1">
                    {getStatusBadge(selectedPoste.status)}
                  </div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div>
                  <div className="text-sm text-muted-foreground">Priorité</div>
                  <div className="mt-1">
                    {getPriorityBadge(selectedPoste.priority)}
                  </div>
                </div>
                <div className="h-10 w-px bg-border" />
                <div>
                  <div className="text-sm text-muted-foreground">Site</div>
                  <div className="mt-1 text-sm font-medium">
                    {sites.find((s) => s.id === selectedPoste.siteId)?.name ||
                      "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedPoste.description && (
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
                  {selectedPoste.description}
                </p>
              </div>
            )}

            {/* Schedule and Capacity */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-semibold">Horaires</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">
                      Durée de vacation
                    </span>
                    <span className="font-semibold">
                      {selectedPoste.schedule.defaultShiftDuration}h
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-muted-foreground">Pause</span>
                    <span className="font-semibold">
                      {selectedPoste.schedule.breakDuration} min
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedPoste.schedule.nightShift && (
                      <Badge variant="secondary">🌙 Travail de nuit</Badge>
                    )}
                    {selectedPoste.schedule.weekendWork && (
                      <Badge variant="secondary">📅 Weekend</Badge>
                    )}
                    {selectedPoste.schedule.rotatingShift && (
                      <Badge variant="secondary">🔄 Roulement</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-semibold">Capacité</h4>
                </div>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Agents requis
                      </span>
                      <span className="font-semibold">
                        {selectedPoste.capacity.minAgents} -{" "}
                        {selectedPoste.capacity.maxAgents}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Agents actuels
                      </span>
                      <span
                        className={`font-semibold ${
                          (selectedPoste.capacity.currentAgents || 0) >=
                          selectedPoste.capacity.minAgents
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}
                      >
                        {selectedPoste.capacity.currentAgents || 0}
                      </span>
                    </div>
                  </div>
                  {selectedPoste.requirements.minimumExperience &&
                    selectedPoste.requirements.minimumExperience > 0 && (
                      <div className="p-3 rounded-lg bg-muted/50">
                        <div className="text-xs text-muted-foreground mb-1">
                          Expérience minimum
                        </div>
                        <div className="font-semibold">
                          {selectedPoste.requirements.minimumExperience} mois
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Requirements */}
            {(selectedPoste.requirements.requiredCertifications.length > 0 ||
              selectedPoste.requirements.physicalRequirements) && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-semibold">Exigences</h4>
                </div>
                <div className="space-y-3">
                  {selectedPoste.requirements.requiredCertifications.length >
                    0 && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Certifications
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedPoste.requirements.requiredCertifications.map(
                          (cert) => (
                            <Badge
                              key={cert}
                              variant="secondary"
                              className="font-normal"
                            >
                              {cert}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                  {selectedPoste.requirements.physicalRequirements && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Exigences physiques
                      </div>
                      <p className="text-sm p-3 rounded-lg bg-muted/50">
                        {selectedPoste.requirements.physicalRequirements}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Instructions */}
            {selectedPoste.instructions && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-semibold">Instructions</h4>
                </div>
                <div className="space-y-4">
                  {selectedPoste.instructions.duties &&
                    selectedPoste.instructions.duties.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">
                          Tâches à effectuer
                        </div>
                        <ul className="space-y-2">
                          {selectedPoste.instructions.duties.map(
                            (duty, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm"
                              >
                                <span className="text-primary mt-0.5">•</span>
                                <span>{duty}</span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  {selectedPoste.instructions.procedures && (
                    <div>
                      <div className="text-sm font-medium mb-2">Procédures</div>
                      <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
                        {selectedPoste.instructions.procedures}
                      </p>
                    </div>
                  )}
                  {selectedPoste.instructions.equipment &&
                    selectedPoste.instructions.equipment.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">
                          Équipement nécessaire
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedPoste.instructions.equipment.map(
                            (item, idx) => (
                              <Badge key={idx} variant="outline">
                                {item}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  {selectedPoste.instructions.emergencyContact && (
                    <div>
                      <div className="text-sm font-medium mb-2">
                        Contact d&apos;urgence
                      </div>
                      <p className="text-sm font-mono p-3 rounded-lg bg-muted/50">
                        {selectedPoste.instructions.emergencyContact}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Delete Poste Modal */}
      <Modal
        open={isDeletePosteModalOpen}
        onOpenChange={setIsDeletePosteModalOpen}
        title="Supprimer le poste"
        description="Êtes-vous sûr de vouloir supprimer ce poste ?"
        type="confirmation"
      >
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsDeletePosteModalOpen(false)}
          >
            Annuler
          </Button>
          <Button variant="destructive" onClick={confirmDeletePoste}>
            Supprimer
          </Button>
        </div>
      </Modal>

      {/* Create Poste Modal */}
      <Modal
        open={isCreatePosteModalOpen}
        onOpenChange={setIsCreatePosteModalOpen}
        title="Créer un nouveau poste"
        description={
          selectedSite
            ? `Ajouter un poste pour ${selectedSite.name}`
            : "Ajoutez un nouveau poste de sécurité"
        }
        size="xl"
        type="form"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <Label htmlFor="poste-site">Site *</Label>
            <Select
              value={selectedSite?.id || ""}
              onValueChange={(siteId: string) => {
                const site = sites.find((s) => s.id === siteId);
                setSelectedSite(site || null);
              }}
              disabled={!!selectedSite}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un site" />
              </SelectTrigger>
              <SelectContent>
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Informations générales</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="poste-name">Nom du poste *</Label>
                <Input
                  id="poste-name"
                  value={posteFormData.name}
                  onChange={(e) =>
                    setPosteFormData({ ...posteFormData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="poste-type">Type *</Label>
                <Select
                  value={posteFormData.type}
                  onValueChange={(value) =>
                    setPosteFormData({
                      ...posteFormData,
                      type: value as PosteFormData["type"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rondier">Rondier</SelectItem>
                    <SelectItem value="pc_securite">PC Sécurité</SelectItem>
                    <SelectItem value="controle_acces">
                      Contrôle d&apos;accès
                    </SelectItem>
                    <SelectItem value="surveillance">Surveillance</SelectItem>
                    <SelectItem value="agent_cynophile">
                      Agent Cynophile
                    </SelectItem>
                    <SelectItem value="agent_ssiap">Agent SSIAP</SelectItem>
                    <SelectItem value="chef_equipe">
                      Chef d&apos;équipe
                    </SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="poste-priority">Priorité *</Label>
                <Select
                  value={posteFormData.priority}
                  onValueChange={(value) =>
                    setPosteFormData({
                      ...posteFormData,
                      priority: value as PosteFormData["priority"],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                    <SelectItem value="critical">Critique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="poste-description">Description</Label>
                <Textarea
                  id="poste-description"
                  value={posteFormData.description}
                  onChange={(e) =>
                    setPosteFormData({
                      ...posteFormData,
                      description: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Horaires et planning</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="poste-shift">Durée vacation (heures) *</Label>
                <Input
                  id="poste-shift"
                  type="number"
                  value={posteFormData.defaultShiftDuration}
                  onChange={(e) =>
                    setPosteFormData({
                      ...posteFormData,
                      defaultShiftDuration: parseInt(e.target.value) || 8,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="poste-break">Pause (minutes)</Label>
                <Input
                  id="poste-break"
                  type="number"
                  value={posteFormData.breakDuration}
                  onChange={(e) =>
                    setPosteFormData({
                      ...posteFormData,
                      breakDuration: parseInt(e.target.value) || 30,
                    })
                  }
                />
              </div>
              <div className="col-span-2 flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="poste-night"
                    checked={posteFormData.nightShift}
                    onChange={(e) =>
                      setPosteFormData({
                        ...posteFormData,
                        nightShift: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <Label htmlFor="poste-night" className="font-normal">
                    Travail de nuit
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="poste-weekend"
                    checked={posteFormData.weekendWork}
                    onChange={(e) =>
                      setPosteFormData({
                        ...posteFormData,
                        weekendWork: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <Label htmlFor="poste-weekend" className="font-normal">
                    Travail weekend
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="poste-rotating"
                    checked={posteFormData.rotatingShift}
                    onChange={(e) =>
                      setPosteFormData({
                        ...posteFormData,
                        rotatingShift: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <Label htmlFor="poste-rotating" className="font-normal">
                    Roulement
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Capacité</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="poste-min">Agents minimum *</Label>
                <Input
                  id="poste-min"
                  type="number"
                  value={posteFormData.minAgents}
                  onChange={(e) =>
                    setPosteFormData({
                      ...posteFormData,
                      minAgents: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="poste-max">Agents maximum *</Label>
                <Input
                  id="poste-max"
                  type="number"
                  value={posteFormData.maxAgents}
                  onChange={(e) =>
                    setPosteFormData({
                      ...posteFormData,
                      maxAgents: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Exigences</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="poste-exp">Expérience minimum (mois)</Label>
                <Input
                  id="poste-exp"
                  type="number"
                  value={posteFormData.minimumExperience}
                  onChange={(e) =>
                    setPosteFormData({
                      ...posteFormData,
                      minimumExperience: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="poste-physical">Exigences physiques</Label>
                <Textarea
                  id="poste-physical"
                  value={posteFormData.physicalRequirements}
                  onChange={(e) =>
                    setPosteFormData({
                      ...posteFormData,
                      physicalRequirements: e.target.value,
                    })
                  }
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Instructions</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="poste-duties">Tâches (une par ligne)</Label>
                <Textarea
                  id="poste-duties"
                  value={posteFormData.duties}
                  onChange={(e) =>
                    setPosteFormData({
                      ...posteFormData,
                      duties: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Effectuer les rondes&#10;Contrôler les accès&#10;..."
                />
              </div>
              <div>
                <Label htmlFor="poste-equipment">
                  Équipement (séparé par des virgules)
                </Label>
                <Input
                  id="poste-equipment"
                  value={posteFormData.equipment}
                  onChange={(e) =>
                    setPosteFormData({
                      ...posteFormData,
                      equipment: e.target.value,
                    })
                  }
                  placeholder="Radio, Lampe torche, Badge"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              setIsCreatePosteModalOpen(false);
              setSelectedSite(null);
            }}
          >
            Annuler
          </Button>
          <Button onClick={handleSavePoste} disabled={!selectedSite}>
            Créer le poste
          </Button>
        </div>
      </Modal>

      {/* Edit Poste Modal */}
      {selectedPoste && (
        <Modal
          open={isEditPosteModalOpen}
          onOpenChange={setIsEditPosteModalOpen}
          title="Modifier le poste"
          description="Modifiez les informations du poste"
          size="xl"
          type="form"
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-4">
              <h4 className="font-medium">Informations générales</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="edit-poste-name">Nom du poste *</Label>
                  <Input
                    id="edit-poste-name"
                    value={posteFormData.name}
                    onChange={(e) =>
                      setPosteFormData({
                        ...posteFormData,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-poste-type">Type *</Label>
                  <Select
                    value={posteFormData.type}
                    onValueChange={(value) =>
                      setPosteFormData({
                        ...posteFormData,
                        type: value as PosteFormData["type"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rondier">Rondier</SelectItem>
                      <SelectItem value="pc_securite">PC Sécurité</SelectItem>
                      <SelectItem value="controle_acces">
                        Contrôle d&apos;accès
                      </SelectItem>
                      <SelectItem value="surveillance">Surveillance</SelectItem>
                      <SelectItem value="agent_cynophile">
                        Agent Cynophile
                      </SelectItem>
                      <SelectItem value="agent_ssiap">Agent SSIAP</SelectItem>
                      <SelectItem value="chef_equipe">
                        Chef d&apos;équipe
                      </SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-poste-priority">Priorité *</Label>
                  <Select
                    value={posteFormData.priority}
                    onValueChange={(value) =>
                      setPosteFormData({
                        ...posteFormData,
                        priority: value as PosteFormData["priority"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Basse</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Haute</SelectItem>
                      <SelectItem value="critical">Critique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Horaires</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-poste-shift">
                    Durée vacation (heures) *
                  </Label>
                  <Input
                    id="edit-poste-shift"
                    type="number"
                    value={posteFormData.defaultShiftDuration}
                    onChange={(e) =>
                      setPosteFormData({
                        ...posteFormData,
                        defaultShiftDuration: parseInt(e.target.value) || 8,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-poste-break">Pause (minutes)</Label>
                  <Input
                    id="edit-poste-break"
                    type="number"
                    value={posteFormData.breakDuration}
                    onChange={(e) =>
                      setPosteFormData({
                        ...posteFormData,
                        breakDuration: parseInt(e.target.value) || 30,
                      })
                    }
                  />
                </div>
                <div className="col-span-2 flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-poste-night"
                      checked={posteFormData.nightShift}
                      onChange={(e) =>
                        setPosteFormData({
                          ...posteFormData,
                          nightShift: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    <Label htmlFor="edit-poste-night" className="font-normal">
                      Travail de nuit
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-poste-weekend"
                      checked={posteFormData.weekendWork}
                      onChange={(e) =>
                        setPosteFormData({
                          ...posteFormData,
                          weekendWork: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    <Label htmlFor="edit-poste-weekend" className="font-normal">
                      Travail weekend
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Capacité</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-poste-min">Agents minimum *</Label>
                  <Input
                    id="edit-poste-min"
                    type="number"
                    value={posteFormData.minAgents}
                    onChange={(e) =>
                      setPosteFormData({
                        ...posteFormData,
                        minAgents: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-poste-max">Agents maximum *</Label>
                  <Input
                    id="edit-poste-max"
                    type="number"
                    value={posteFormData.maxAgents}
                    onChange={(e) =>
                      setPosteFormData({
                        ...posteFormData,
                        maxAgents: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-poste-status">Statut *</Label>
                  <Select
                    value={posteFormData.status}
                    onValueChange={(value: "active" | "inactive") =>
                      setPosteFormData({ ...posteFormData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditPosteModalOpen(false);
                setSelectedPoste(null);
              }}
            >
              Annuler
            </Button>
            <Button onClick={handleSavePoste}>Enregistrer</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
