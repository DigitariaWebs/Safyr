"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Calculator,
  Clock,
  TrendingUp,
  CheckCircle,
  Trash2,
  Pencil,
  Eye,
  ChevronDown,
  FileText,
  FileSpreadsheet,
  FileCheck,
} from "lucide-react";
import {
  mockSimulations,
  Simulation,
  SimulationShiftNeed,
  SimulationService,
  availableServices,
} from "@/data/billing-simulations";

const DAY_LABELS: Record<number, string> = {
  0: "Dim",
  1: "Lun",
  2: "Mar",
  3: "Mer",
  4: "Jeu",
  5: "Ven",
  6: "Sam",
};

const MONTH_LABELS: Record<number, string> = {
  1: "Janvier",
  2: "Février",
  3: "Mars",
  4: "Avril",
  5: "Mai",
  6: "Juin",
  7: "Juillet",
  8: "Août",
  9: "Septembre",
  10: "Octobre",
  11: "Novembre",
  12: "Décembre",
};

const POST_TYPES = [
  "Agent de Sécurité",
  "SSIAP 1",
  "SSIAP 2",
  "SSIAP 3",
  "Opérateur Vidéo",
  "Accueil",
  "Chef de poste",
  "Rondier",
  "Agent Cynophile",
  "Agent événementiel",
];

function parseTime(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h + m / 60;
}

function calculateShiftHours(startTime: string, endTime: string): number {
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  if (end > start) return end - start;
  return 24 - start + end; // overnight shift
}

function isNightHour(hour: number): boolean {
  return hour >= 21 || hour < 6;
}

function calculateNightHours(startTime: string, endTime: string): number {
  const start = parseTime(startTime);
  let nightHours = 0;
  const totalHours = calculateShiftHours(startTime, endTime);
  const steps = Math.ceil(totalHours * 2);
  for (let i = 0; i < steps; i++) {
    const hour = (start + i * 0.5) % 24;
    if (isNightHour(Math.floor(hour))) {
      nightHours += 0.5;
    }
  }
  return nightHours;
}

function calculateDayHours(startTime: string, endTime: string): number {
  return (
    calculateShiftHours(startTime, endTime) -
    calculateNightHours(startTime, endTime)
  );
}

interface CostBreakdown {
  postType: string;
  needId: string;
  type: "fixe" | "variable";
  daysPerWeek: number;
  hoursPerShift: number;
  dayHoursPerShift: number;
  nightHoursPerShift: number;
  quantity: number;
  weeksPerYear: number;
  annualDayHours: number;
  annualNightHours: number;
  annualSundayDayHours: number;
  annualSundayNightHours: number;
  baseCost: number;
  nightSurchargeCost: number;
  sundaySurchargeCost: number;
  sundayNightSurchargeCost: number;
  totalCost: number;
  label: string;
}

function computeCostBreakdown(sim: Simulation): {
  shiftBreakdowns: CostBreakdown[];
  totalShiftCost: number;
  totalServicesCost: number;
  grandTotal: number;
} {
  const shiftBreakdowns: CostBreakdown[] = [];

  for (const need of sim.shiftNeeds) {
    const hoursPerShift = calculateShiftHours(need.startTime, need.endTime);
    const dayHoursPerShift = calculateDayHours(need.startTime, need.endTime);
    const nightHoursPerShift = calculateNightHours(
      need.startTime,
      need.endTime,
    );
    const days =
      need.type === "fixe" ? need.daysOfWeek || [] : need.specificDays || [];
    const daysPerWeek = days.length;
    const isSunday = (day: number) => day === 0;
    const sundayDays = days.filter(isSunday).length;
    const nonSundayDays = daysPerWeek - sundayDays;

    let weeksPerYear: number;
    if (need.type === "variable" && need.startMonth && need.endMonth) {
      const months =
        need.endMonth >= need.startMonth
          ? need.endMonth - need.startMonth + 1
          : 12 - need.startMonth + 1 + need.endMonth;
      weeksPerYear = months * 4.33;
    } else {
      weeksPerYear = 52;
    }

    const annualDayHoursNonSunday =
      nonSundayDays * dayHoursPerShift * weeksPerYear * need.quantity;
    const annualNightHoursNonSunday =
      nonSundayDays * nightHoursPerShift * weeksPerYear * need.quantity;
    const annualSundayDayHours =
      sundayDays * dayHoursPerShift * weeksPerYear * need.quantity;
    const annualSundayNightHours =
      sundayDays * nightHoursPerShift * weeksPerYear * need.quantity;

    const baseCost =
      (annualDayHoursNonSunday +
        annualNightHoursNonSunday +
        annualSundayDayHours +
        annualSundayNightHours) *
      sim.hourlyRate;
    const nightSurchargeCost =
      annualNightHoursNonSunday *
      sim.hourlyRate *
      (sim.nightSurchargePercent / 100);
    const sundaySurchargeCost =
      annualSundayDayHours *
      sim.hourlyRate *
      (sim.sundaySurchargePercent / 100);
    const sundayNightSurchargeCost =
      annualSundayNightHours *
      sim.hourlyRate *
      (sim.sundayNightSurchargePercent / 100);
    const totalCost =
      baseCost +
      nightSurchargeCost +
      sundaySurchargeCost +
      sundayNightSurchargeCost;

    const daysLabel = days.map((d) => DAY_LABELS[d]).join(", ");
    let label = `${need.postType} × ${need.quantity} — ${need.startTime}-${need.endTime} (${daysLabel})`;
    if (need.type === "variable") {
      label += ` [${MONTH_LABELS[need.startMonth || 1]}-${MONTH_LABELS[need.endMonth || 12]}]`;
    }

    shiftBreakdowns.push({
      postType: need.postType,
      needId: need.id,
      type: need.type,
      daysPerWeek,
      hoursPerShift,
      dayHoursPerShift,
      nightHoursPerShift,
      quantity: need.quantity,
      weeksPerYear,
      annualDayHours: annualDayHoursNonSunday,
      annualNightHours: annualNightHoursNonSunday,
      annualSundayDayHours,
      annualSundayNightHours,
      baseCost,
      nightSurchargeCost,
      sundaySurchargeCost,
      sundayNightSurchargeCost,
      totalCost,
      label,
    });
  }

  const totalShiftCost = shiftBreakdowns.reduce(
    (acc, b) => acc + b.totalCost,
    0,
  );
  const totalServicesCost = sim.additionalServices.reduce(
    (acc, svc) => acc + svc.unitPrice * svc.quantity * 12,
    0,
  );
  const grandTotal = totalShiftCost + totalServicesCost;

  return { shiftBreakdowns, totalShiftCost, totalServicesCost, grandTotal };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

const emptySimulation = (): Partial<Simulation> => ({
  clientName: "",
  siteName: "",
  siteAddress: "",
  status: "Brouillon",
  shiftNeeds: [],
  additionalServices: [],
  hourlyRate: 22.5,
  nightSurchargePercent: 10,
  sundaySurchargePercent: 10,
  holidaySurchargePercent: 100,
  sundayNightSurchargePercent: 110,
  holidayNightSurchargePercent: 110,
  notes: "",
});

const emptyShiftNeed = (): Partial<SimulationShiftNeed> => ({
  postType: "Agent de Sécurité",
  type: "fixe",
  daysOfWeek: [],
  startTime: "06:00",
  endTime: "14:00",
  quantity: 1,
  startMonth: 1,
  endMonth: 12,
  specificDays: [],
});

const emptyService = (): Partial<SimulationService> => ({
  name: "",
  unitPrice: 0,
  quantity: 1,
  description: "",
});

export default function BillingSimulationPage() {
  const [simulations, setSimulations] = useState<Simulation[]>(mockSimulations);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSimulation, setSelectedSimulation] =
    useState<Simulation | null>(null);
  const [formData, setFormData] =
    useState<Partial<Simulation>>(emptySimulation());
  const [currentNeed, setCurrentNeed] =
    useState<Partial<SimulationShiftNeed>>(emptyShiftNeed());
  const [editingNeedIndex, setEditingNeedIndex] = useState<number | null>(null);
  const [currentService, setCurrentService] =
    useState<Partial<SimulationService>>(emptyService());
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("general");

  // Stats
  const totalSimulations = simulations.length;
  const enCoursCount = simulations.filter(
    (s) => s.status === "En cours",
  ).length;
  const convertiesCount = simulations.filter(
    (s) => s.status === "Convertie",
  ).length;
  const totalEstimation = simulations.reduce(
    (acc, s) => acc + (s.totalEstimate || 0),
    0,
  );

  const columns: ColumnDef<Simulation>[] = [
    {
      key: "clientName",
      label: "Client",
      sortable: true,
    },
    {
      key: "siteName",
      label: "Site",
      sortable: true,
    },
    {
      key: "status",
      label: "Statut",
      render: (sim) => (
        <Badge
          variant={
            sim.status === "En cours"
              ? "cyan"
              : sim.status === "Terminée"
                ? "default"
                : sim.status === "Convertie"
                  ? "secondary"
                  : "muted"
          }
        >
          {sim.status}
        </Badge>
      ),
    },
    {
      key: "shiftNeeds",
      label: "Nb Postes",
      render: (sim) => (
        <span>{sim.shiftNeeds.reduce((acc, n) => acc + n.quantity, 0)}</span>
      ),
    },
    {
      key: "totalEstimate",
      label: "Estimation",
      sortable: true,
      render: (sim) => (
        <span className="font-medium">
          {sim.totalEstimate ? formatCurrency(sim.totalEstimate) : "—"}
        </span>
      ),
    },
    {
      key: "updatedAt",
      label: "Date",
      sortable: true,
      render: (sim) => new Date(sim.updatedAt).toLocaleDateString("fr-FR"),
    },
    {
      key: "id",
      label: "Actions",
      render: (sim) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleView(sim)}
            title="Voir"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(sim)}
            title="Modifier"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(sim)}
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  const handleCreate = () => {
    setFormData(emptySimulation());
    setCurrentNeed(emptyShiftNeed());
    setCurrentService(emptyService());
    setEditingNeedIndex(null);
    setEditingServiceIndex(null);
    setActiveTab("general");
    setIsCreateModalOpen(true);
  };

  const handleEdit = (sim: Simulation) => {
    setFormData({ ...sim });
    setCurrentNeed(emptyShiftNeed());
    setCurrentService(emptyService());
    setEditingNeedIndex(null);
    setEditingServiceIndex(null);
    setActiveTab("general");
    setIsCreateModalOpen(true);
  };

  const handleView = (sim: Simulation) => {
    setSelectedSimulation(sim);
    setIsViewModalOpen(true);
  };

  const handleDelete = (sim: Simulation) => {
    setSimulations((prev) => prev.filter((s) => s.id !== sim.id));
  };

  const handleRowClick = (sim: Simulation) => {
    handleView(sim);
  };

  const handleSave = () => {
    const now = new Date().toISOString().split("T")[0];
    if (formData.id) {
      // Edit
      setSimulations((prev) =>
        prev.map((s) =>
          s.id === formData.id
            ? ({
                ...s,
                ...formData,
                updatedAt: now,
                totalEstimate: computeCostBreakdown(formData as Simulation)
                  .grandTotal,
              } as Simulation)
            : s,
        ),
      );
    } else {
      // Create
      const newSim: Simulation = {
        ...(formData as Simulation),
        id: `sim-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        shiftNeeds: formData.shiftNeeds || [],
        additionalServices: formData.additionalServices || [],
        status: (formData.status as Simulation["status"]) || "Brouillon",
        hourlyRate: formData.hourlyRate || 22.5,
        nightSurchargePercent: formData.nightSurchargePercent ?? 10,
        sundaySurchargePercent: formData.sundaySurchargePercent ?? 10,
        holidaySurchargePercent: formData.holidaySurchargePercent ?? 100,
        sundayNightSurchargePercent:
          formData.sundayNightSurchargePercent ?? 110,
        holidayNightSurchargePercent:
          formData.holidayNightSurchargePercent ?? 110,
      };
      newSim.totalEstimate = computeCostBreakdown(newSim).grandTotal;
      setSimulations((prev) => [...prev, newSim]);
    }
    setIsCreateModalOpen(false);
  };

  // Shift needs management
  const handleAddNeed = () => {
    const need: SimulationShiftNeed = {
      id: `need-${Date.now()}`,
      postType: currentNeed.postType || "Agent de Sécurité",
      type: currentNeed.type || "fixe",
      daysOfWeek:
        currentNeed.type === "fixe" ? currentNeed.daysOfWeek : undefined,
      startTime: currentNeed.startTime || "06:00",
      endTime: currentNeed.endTime || "14:00",
      quantity: currentNeed.quantity || 1,
      startMonth:
        currentNeed.type === "variable" ? currentNeed.startMonth : undefined,
      endMonth:
        currentNeed.type === "variable" ? currentNeed.endMonth : undefined,
      specificDays:
        currentNeed.type === "variable" ? currentNeed.specificDays : undefined,
    };
    if (editingNeedIndex !== null) {
      const needs = [...(formData.shiftNeeds || [])];
      needs[editingNeedIndex] = need;
      setFormData({ ...formData, shiftNeeds: needs });
      setEditingNeedIndex(null);
    } else {
      setFormData({
        ...formData,
        shiftNeeds: [...(formData.shiftNeeds || []), need],
      });
    }
    setCurrentNeed(emptyShiftNeed());
  };

  const handleEditNeed = (index: number) => {
    const need = formData.shiftNeeds?.[index];
    if (need) {
      setCurrentNeed({ ...need });
      setEditingNeedIndex(index);
    }
  };

  const handleDeleteNeed = (index: number) => {
    const needs = [...(formData.shiftNeeds || [])];
    needs.splice(index, 1);
    setFormData({ ...formData, shiftNeeds: needs });
  };

  const toggleDay = (day: number, field: "daysOfWeek" | "specificDays") => {
    const days = [...(currentNeed[field] || [])];
    const idx = days.indexOf(day);
    if (idx >= 0) {
      days.splice(idx, 1);
    } else {
      days.push(day);
    }
    setCurrentNeed({ ...currentNeed, [field]: days });
  };

  // Services management
  const handleAddService = () => {
    const svc: SimulationService = {
      id: `svc-${Date.now()}`,
      name: currentService.name || "",
      unitPrice: currentService.unitPrice || 0,
      quantity: currentService.quantity || 1,
      description: currentService.description,
    };
    if (!svc.name) return;
    if (editingServiceIndex !== null) {
      const services = [...(formData.additionalServices || [])];
      services[editingServiceIndex] = svc;
      setFormData({ ...formData, additionalServices: services });
      setEditingServiceIndex(null);
    } else {
      setFormData({
        ...formData,
        additionalServices: [...(formData.additionalServices || []), svc],
      });
    }
    setCurrentService(emptyService());
  };

  const handleEditService = (index: number) => {
    const svc = formData.additionalServices?.[index];
    if (svc) {
      setCurrentService({ ...svc });
      setEditingServiceIndex(index);
    }
  };

  const handleDeleteService = (index: number) => {
    const services = [...(formData.additionalServices || [])];
    services.splice(index, 1);
    setFormData({ ...formData, additionalServices: services });
  };

  const handleConvertToQuote = (type: string) => {
    const labels: Record<string, string> = {
      base: "Devis base",
      complet: "Devis complet",
      detaille: "Devis détaillé",
    };
    alert(`${labels[type] || "Devis"} généré avec succès`);
  };

  // View modal cost breakdown
  const viewBreakdown = useMemo(() => {
    if (!selectedSimulation) return null;
    return computeCostBreakdown(selectedSimulation);
  }, [selectedSimulation]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Simulation</h1>
          <p className="text-muted-foreground">
            Simulez les coûts de vos prestations de sécurité
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Simulation
        </Button>
      </div>

      {/* Stats Cards */}
      <InfoCardContainer>
        <InfoCard
          icon={Calculator}
          title="Total simulations"
          value={totalSimulations}
          color="blue"
        />
        <InfoCard
          icon={Clock}
          title="En cours"
          value={enCoursCount}
          color="cyan"
        />
        <InfoCard
          icon={TrendingUp}
          title="Estimation totale"
          value={formatCurrency(totalEstimation)}
          color="green"
        />
        <InfoCard
          icon={CheckCircle}
          title="Converties"
          value={convertiesCount}
          color="purple"
        />
      </InfoCardContainer>

      {/* DataTable */}
      <DataTable
        data={simulations}
        columns={columns}
        searchKey="clientName"
        searchPlaceholder="Rechercher une simulation..."
        onRowClick={handleRowClick}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        type="form"
        title={formData.id ? "Modifier la simulation" : "Nouvelle simulation"}
        size="xl"
        actions={{
          primary: {
            label: formData.id ? "Enregistrer" : "Créer",
            onClick: handleSave,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsCreateModalOpen(false),
            variant: "outline",
          },
        }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="besoins">Besoins</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="tarification">Tarification</TabsTrigger>
          </TabsList>

          {/* Tab: Général */}
          <TabsContent value="general" className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Nom du client</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                    placeholder="Ex: Carrefour France"
                  />
                </div>
                <div>
                  <Label htmlFor="siteName">Nom du site</Label>
                  <Input
                    id="siteName"
                    value={formData.siteName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, siteName: e.target.value })
                    }
                    placeholder="Ex: Centre Commercial Rosny"
                  />
                </div>
                <div>
                  <Label htmlFor="siteAddress">Adresse du site</Label>
                  <Input
                    id="siteAddress"
                    value={formData.siteAddress || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, siteAddress: e.target.value })
                    }
                    placeholder="Ex: Rosny-sous-Bois"
                  />
                </div>
                <div>
                  <Label htmlFor="hourlyRate">Taux horaire (€/h)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    step="0.5"
                    value={formData.hourlyRate ?? 22.5}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hourlyRate: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={formData.status || "Brouillon"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        status: value as Simulation["status"],
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Brouillon">Brouillon</SelectItem>
                      <SelectItem value="En cours">En cours</SelectItem>
                      <SelectItem value="Terminée">Terminée</SelectItem>
                      <SelectItem value="Convertie">Convertie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Notes ou commentaires..."
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab: Besoins */}
          <TabsContent value="besoins" className="p-4">
            <div className="space-y-6">
              {/* Add need form */}
              <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
                <h3 className="text-sm font-semibold">
                  {editingNeedIndex !== null
                    ? "Modifier le besoin"
                    : "Ajouter un besoin"}
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label>Type de poste</Label>
                    <Select
                      value={currentNeed.postType || "Agent de Sécurité"}
                      onValueChange={(value) =>
                        setCurrentNeed({ ...currentNeed, postType: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {POST_TYPES.map((pt) => (
                          <SelectItem key={pt} value={pt}>
                            {pt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Type de besoin</Label>
                    <Select
                      value={currentNeed.type || "fixe"}
                      onValueChange={(value) =>
                        setCurrentNeed({
                          ...currentNeed,
                          type: value as "fixe" | "variable",
                        })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixe">Fixe</SelectItem>
                        <SelectItem value="variable">Variable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Heure début</Label>
                    <Input
                      type="time"
                      value={currentNeed.startTime || "06:00"}
                      onChange={(e) =>
                        setCurrentNeed({
                          ...currentNeed,
                          startTime: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Heure fin</Label>
                    <Input
                      type="time"
                      value={currentNeed.endTime || "14:00"}
                      onChange={(e) =>
                        setCurrentNeed({
                          ...currentNeed,
                          endTime: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Days of week */}
                <div>
                  <Label>
                    {currentNeed.type === "fixe"
                      ? "Jours de la semaine"
                      : "Jours spécifiques"}
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                      const field =
                        currentNeed.type === "fixe"
                          ? "daysOfWeek"
                          : "specificDays";
                      const selected = (currentNeed[field] || []).includes(day);
                      return (
                        <Button
                          key={day}
                          type="button"
                          variant={selected ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleDay(day, field)}
                        >
                          {DAY_LABELS[day]}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Variable: months */}
                {currentNeed.type === "variable" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Mois de début</Label>
                      <Select
                        value={String(currentNeed.startMonth || 1)}
                        onValueChange={(value) =>
                          setCurrentNeed({
                            ...currentNeed,
                            startMonth: parseInt(value),
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(
                            (m) => (
                              <SelectItem key={m} value={String(m)}>
                                {MONTH_LABELS[m]}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Mois de fin</Label>
                      <Select
                        value={String(currentNeed.endMonth || 12)}
                        onValueChange={(value) =>
                          setCurrentNeed({
                            ...currentNeed,
                            endMonth: parseInt(value),
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(
                            (m) => (
                              <SelectItem key={m} value={String(m)}>
                                {MONTH_LABELS[m]}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="flex items-end gap-4">
                  <div>
                    <Label>Quantité (agents)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={currentNeed.quantity || 1}
                      onChange={(e) =>
                        setCurrentNeed({
                          ...currentNeed,
                          quantity: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-24"
                    />
                  </div>
                  <Button onClick={handleAddNeed} type="button">
                    {editingNeedIndex !== null ? (
                      <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Modifier
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter
                      </>
                    )}
                  </Button>
                  {editingNeedIndex !== null && (
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setEditingNeedIndex(null);
                        setCurrentNeed(emptyShiftNeed());
                      }}
                    >
                      Annuler
                    </Button>
                  )}
                </div>
              </div>

              {/* List of needs */}
              {(formData.shiftNeeds || []).length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">
                    Besoins configurés ({formData.shiftNeeds?.length})
                  </h3>
                  <div className="space-y-2">
                    {(formData.shiftNeeds || []).map((need, index) => {
                      const days =
                        need.type === "fixe"
                          ? need.daysOfWeek || []
                          : need.specificDays || [];
                      const daysLabel = days
                        .map((d) => DAY_LABELS[d])
                        .join(", ");
                      return (
                        <div
                          key={need.id}
                          className="flex items-center justify-between p-3 border rounded-lg bg-muted/10"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  need.type === "fixe" ? "default" : "cyan"
                                }
                              >
                                {need.type === "fixe" ? "Fixe" : "Variable"}
                              </Badge>
                              <span className="font-medium">
                                {need.postType}
                              </span>
                              <span className="text-muted-foreground">
                                × {need.quantity}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {need.startTime} - {need.endTime} | {daysLabel}
                              {need.type === "variable" &&
                                need.startMonth &&
                                need.endMonth && (
                                  <>
                                    {" "}
                                    | {MONTH_LABELS[need.startMonth]} →{" "}
                                    {MONTH_LABELS[need.endMonth]}
                                  </>
                                )}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditNeed(index)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNeed(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {(formData.shiftNeeds || []).length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Aucun besoin configuré. Utilisez le formulaire ci-dessus pour
                  ajouter des besoins.
                </p>
              )}
            </div>
          </TabsContent>

          {/* Tab: Services */}
          <TabsContent value="services" className="p-4">
            <div className="space-y-6">
              {/* Add service form */}
              <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
                <h3 className="text-sm font-semibold">
                  {editingServiceIndex !== null
                    ? "Modifier le service"
                    : "Ajouter un service"}
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label>Service</Label>
                    <Select
                      value={currentService.name || ""}
                      onValueChange={(value) =>
                        setCurrentService({ ...currentService, name: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir un service..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableServices.map((svc) => (
                          <SelectItem key={svc} value={svc}>
                            {svc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Prix unitaire (€/mois)</Label>
                    <Input
                      type="number"
                      step="5"
                      value={currentService.unitPrice || ""}
                      onChange={(e) =>
                        setCurrentService({
                          ...currentService,
                          unitPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Quantité</Label>
                    <Input
                      type="number"
                      min={1}
                      value={currentService.quantity || 1}
                      onChange={(e) =>
                        setCurrentService({
                          ...currentService,
                          quantity: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={currentService.description || ""}
                      onChange={(e) =>
                        setCurrentService({
                          ...currentService,
                          description: e.target.value,
                        })
                      }
                      placeholder="Optionnel"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddService} type="button">
                    {editingServiceIndex !== null ? (
                      <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Modifier
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter
                      </>
                    )}
                  </Button>
                  {editingServiceIndex !== null && (
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setEditingServiceIndex(null);
                        setCurrentService(emptyService());
                      }}
                    >
                      Annuler
                    </Button>
                  )}
                </div>
              </div>

              {/* List of services */}
              {(formData.additionalServices || []).length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">
                    Services configurés ({formData.additionalServices?.length})
                  </h3>
                  <div className="space-y-2">
                    {(formData.additionalServices || []).map((svc, index) => (
                      <div
                        key={svc.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-muted/10"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{svc.name}</span>
                            <Badge variant="muted">
                              {formatCurrency(svc.unitPrice)} × {svc.quantity}
                            </Badge>
                          </div>
                          {svc.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {svc.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">
                            {formatCurrency(svc.unitPrice * svc.quantity)}/mois
                          </span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditService(index)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteService(index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(formData.additionalServices || []).length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Aucun service additionnel. Utilisez le formulaire ci-dessus
                  pour ajouter des services.
                </p>
              )}
            </div>
          </TabsContent>

          {/* Tab: Tarification */}
          <TabsContent value="tarification" className="p-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Configurez les majorations appliquées aux heures de nuit,
                dimanches et jours fériés.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hourlyRateTab">
                    Taux horaire de base (€/h)
                  </Label>
                  <Input
                    id="hourlyRateTab"
                    type="number"
                    step="0.5"
                    value={formData.hourlyRate ?? 22.5}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hourlyRate: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="nightSurcharge">Majoration nuit (%)</Label>
                  <Input
                    id="nightSurcharge"
                    type="number"
                    step="5"
                    value={formData.nightSurchargePercent ?? 10}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nightSurchargePercent: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Heures entre 21h et 6h
                  </p>
                </div>
                <div>
                  <Label htmlFor="sundaySurcharge">
                    Majoration dimanche (%)
                  </Label>
                  <Input
                    id="sundaySurcharge"
                    type="number"
                    step="5"
                    value={formData.sundaySurchargePercent ?? 10}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sundaySurchargePercent: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Heures de jour le dimanche
                  </p>
                </div>
                <div>
                  <Label htmlFor="holidaySurcharge">
                    Majoration jours fériés (%)
                  </Label>
                  <Input
                    id="holidaySurcharge"
                    type="number"
                    step="5"
                    value={formData.holidaySurchargePercent ?? 100}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        holidaySurchargePercent:
                          parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Heures de jour les jours fériés
                  </p>
                </div>
                <div>
                  <Label htmlFor="sundayNightSurcharge">
                    Majoration dimanche nuit (%)
                  </Label>
                  <Input
                    id="sundayNightSurcharge"
                    type="number"
                    step="5"
                    value={formData.sundayNightSurchargePercent ?? 110}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sundayNightSurchargePercent:
                          parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Heures de nuit le dimanche
                  </p>
                </div>
                <div>
                  <Label htmlFor="holidayNightSurcharge">
                    Majoration fériés nuit (%)
                  </Label>
                  <Input
                    id="holidayNightSurcharge"
                    type="number"
                    step="5"
                    value={formData.holidayNightSurchargePercent ?? 110}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        holidayNightSurchargePercent:
                          parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Heures de nuit les jours fériés
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Modal>

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détail de la simulation"
        size="xl"
        actions={{
          primary: {
            label: "Modifier",
            onClick: () => {
              setIsViewModalOpen(false);
              if (selectedSimulation) handleEdit(selectedSimulation);
            },
          },
          secondary: {
            label: "Fermer",
            onClick: () => setIsViewModalOpen(false),
            variant: "outline",
          },
        }}
      >
        {selectedSimulation && viewBreakdown && (
          <div className="space-y-6">
            {/* General info */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label>Client</Label>
                <p className="text-sm font-medium">
                  {selectedSimulation.clientName}
                </p>
              </div>
              <div>
                <Label>Site</Label>
                <p className="text-sm font-medium">
                  {selectedSimulation.siteName}
                </p>
              </div>
              <div>
                <Label>Adresse</Label>
                <p className="text-sm font-medium">
                  {selectedSimulation.siteAddress || "—"}
                </p>
              </div>
              <div>
                <Label>Statut</Label>
                <Badge
                  variant={
                    selectedSimulation.status === "En cours"
                      ? "cyan"
                      : selectedSimulation.status === "Terminée"
                        ? "default"
                        : selectedSimulation.status === "Convertie"
                          ? "secondary"
                          : "muted"
                  }
                >
                  {selectedSimulation.status}
                </Badge>
              </div>
              <div>
                <Label>Taux horaire</Label>
                <p className="text-sm font-medium">
                  {selectedSimulation.hourlyRate} €/h
                </p>
              </div>
              <div>
                <Label>Créé le</Label>
                <p className="text-sm font-medium">
                  {new Date(selectedSimulation.createdAt).toLocaleDateString(
                    "fr-FR",
                  )}
                </p>
              </div>
              <div>
                <Label>Mis à jour le</Label>
                <p className="text-sm font-medium">
                  {new Date(selectedSimulation.updatedAt).toLocaleDateString(
                    "fr-FR",
                  )}
                </p>
              </div>
              {selectedSimulation.notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="text-sm">{selectedSimulation.notes}</p>
                </div>
              )}
            </div>

            {/* Surcharges summary */}
            <div className="border rounded-lg p-4 bg-muted/10">
              <h3 className="text-sm font-semibold mb-2">
                Majorations appliquées
              </h3>
              <div className="flex flex-wrap gap-3 text-sm">
                <span>
                  Nuit :{" "}
                  <strong>+{selectedSimulation.nightSurchargePercent}%</strong>
                </span>
                <span>|</span>
                <span>
                  Dimanche :{" "}
                  <strong>+{selectedSimulation.sundaySurchargePercent}%</strong>
                </span>
                <span>|</span>
                <span>
                  Fériés :{" "}
                  <strong>
                    +{selectedSimulation.holidaySurchargePercent}%
                  </strong>
                </span>
                <span>|</span>
                <span>
                  Dim. nuit :{" "}
                  <strong>
                    +{selectedSimulation.sundayNightSurchargePercent}%
                  </strong>
                </span>
                <span>|</span>
                <span>
                  Fériés nuit :{" "}
                  <strong>
                    +{selectedSimulation.holidayNightSurchargePercent}%
                  </strong>
                </span>
              </div>
            </div>

            {/* Cost breakdown per shift need */}
            {viewBreakdown.shiftBreakdowns.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">
                  Détail des coûts par besoin
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-2 pr-4 font-medium">Poste</th>
                        <th className="py-2 pr-4 font-medium text-right">
                          Heures/shift
                        </th>
                        <th className="py-2 pr-4 font-medium text-right">
                          Jours/sem.
                        </th>
                        <th className="py-2 pr-4 font-medium text-right">
                          Sem./an
                        </th>
                        <th className="py-2 pr-4 font-medium text-right">
                          Coût base
                        </th>
                        <th className="py-2 pr-4 font-medium text-right">
                          Maj. nuit
                        </th>
                        <th className="py-2 pr-4 font-medium text-right">
                          Maj. dim.
                        </th>
                        <th className="py-2 pr-4 font-medium text-right">
                          Maj. dim. nuit
                        </th>
                        <th className="py-2 font-medium text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewBreakdown.shiftBreakdowns.map((b) => (
                        <tr
                          key={b.needId}
                          className="border-b border-border/50"
                        >
                          <td className="py-2 pr-4">
                            <div>
                              <span className="font-medium">{b.postType}</span>
                              <span className="text-muted-foreground">
                                {" "}
                                × {b.quantity}
                              </span>
                            </div>
                            <Badge
                              variant={b.type === "fixe" ? "default" : "cyan"}
                              className="mt-1"
                            >
                              {b.type === "fixe" ? "Fixe" : "Variable"}
                            </Badge>
                          </td>
                          <td className="py-2 pr-4 text-right">
                            {formatNumber(b.hoursPerShift, 1)}h
                          </td>
                          <td className="py-2 pr-4 text-right">
                            {b.daysPerWeek}j
                          </td>
                          <td className="py-2 pr-4 text-right">
                            {formatNumber(b.weeksPerYear, 1)}
                          </td>
                          <td className="py-2 pr-4 text-right">
                            {formatCurrency(b.baseCost)}
                          </td>
                          <td className="py-2 pr-4 text-right">
                            {b.nightSurchargeCost > 0
                              ? formatCurrency(b.nightSurchargeCost)
                              : "—"}
                          </td>
                          <td className="py-2 pr-4 text-right">
                            {b.sundaySurchargeCost > 0
                              ? formatCurrency(b.sundaySurchargeCost)
                              : "—"}
                          </td>
                          <td className="py-2 pr-4 text-right">
                            {b.sundayNightSurchargeCost > 0
                              ? formatCurrency(b.sundayNightSurchargeCost)
                              : "—"}
                          </td>
                          <td className="py-2 text-right font-medium">
                            {formatCurrency(b.totalCost)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 font-semibold">
                        <td className="py-2 pr-4" colSpan={8}>
                          Total prestations
                        </td>
                        <td className="py-2 text-right">
                          {formatCurrency(viewBreakdown.totalShiftCost)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* Additional services */}
            {selectedSimulation.additionalServices.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Services additionnels</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-2 pr-4 font-medium">Service</th>
                        <th className="py-2 pr-4 font-medium">Description</th>
                        <th className="py-2 pr-4 font-medium text-right">
                          Prix unit. /mois
                        </th>
                        <th className="py-2 pr-4 font-medium text-right">
                          Qté
                        </th>
                        <th className="py-2 pr-4 font-medium text-right">
                          Coût /mois
                        </th>
                        <th className="py-2 font-medium text-right">
                          Coût /an
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSimulation.additionalServices.map((svc) => (
                        <tr key={svc.id} className="border-b border-border/50">
                          <td className="py-2 pr-4 font-medium">{svc.name}</td>
                          <td className="py-2 pr-4 text-muted-foreground">
                            {svc.description || "—"}
                          </td>
                          <td className="py-2 pr-4 text-right">
                            {formatCurrency(svc.unitPrice)}
                          </td>
                          <td className="py-2 pr-4 text-right">
                            {svc.quantity}
                          </td>
                          <td className="py-2 pr-4 text-right">
                            {formatCurrency(svc.unitPrice * svc.quantity)}
                          </td>
                          <td className="py-2 text-right font-medium">
                            {formatCurrency(svc.unitPrice * svc.quantity * 12)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 font-semibold">
                        <td className="py-2 pr-4" colSpan={5}>
                          Total services /an
                        </td>
                        <td className="py-2 text-right">
                          {formatCurrency(viewBreakdown.totalServicesCost)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {/* Grand total */}
            <div className="border-t-2 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Total annuel estimé</h3>
                  <p className="text-sm text-muted-foreground">
                    Soit {formatCurrency(viewBreakdown.grandTotal / 12)} /mois
                  </p>
                </div>
                <span className="text-2xl font-bold">
                  {formatCurrency(viewBreakdown.grandTotal)}
                </span>
              </div>
            </div>

            {/* Convert to Quote */}
            <div className="flex justify-end pt-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Convertir en Devis
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Type de devis</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleConvertToQuote("base")}
                  >
                    <FileCheck className="h-4 w-4 mr-2" />
                    Devis base
                    <span className="ml-2 text-xs text-muted-foreground">
                      Postes avec totaux
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleConvertToQuote("complet")}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Devis complet
                    <span className="ml-2 text-xs text-muted-foreground">
                      Majorations par poste
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleConvertToQuote("detaille")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Devis détaillé
                    <span className="ml-2 text-xs text-muted-foreground">
                      Jour par jour
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
