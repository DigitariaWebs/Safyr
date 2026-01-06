"use client";

import { useState, useEffect, useReducer, useRef } from "react";
import { rectSortingStrategy } from "@dnd-kit/sortable";
import {
  Users,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Award,
  MapPin,
  Settings,
  GripVertical,
  FileText,
  BarChart3,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { mockEmployees } from "@/data/employees";

// Convert Employee to agent stats
function getAgentStats() {
  const activeEmployees = mockEmployees.filter((e) => e.status === "active");

  const available = activeEmployees.filter((e) => e.status === "active").length;
  const cdiCount = activeEmployees.filter(
    (e) => e.contracts.find((c) => c.status === "active")?.type === "CDI",
  ).length;
  const cddCount = activeEmployees.filter(
    (e) => e.contracts.find((c) => c.status === "active")?.type === "CDD",
  ).length;
  const interimCount = activeEmployees.filter(
    (e) => e.contracts.find((c) => c.status === "active")?.type === "INTERIM",
  ).length;

  const qualified = activeEmployees.filter(
    (e) =>
      e.documents.cqpAps ||
      e.documents.ssiap ||
      e.documents.sst ||
      e.documents.proCard,
  ).length;

  return {
    total: activeEmployees.length,
    available,
    onMission: 0, // Would come from mission data
    onLeave: 0, // Would come from leave data
    cdi: cdiCount,
    cdd: cddCount,
    interim: interimCount,
    qualified,
  };
}

function AgentStatsWidget({ isLoading }: { isLoading: boolean }) {
  const stats = getAgentStats();

  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Effectif Agents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <span className="text-4xl font-light tracking-tight">
              {stats.total}
            </span>
            <span className="ml-2 text-sm text-muted-foreground">agents</span>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">CDI</p>
              <p className="text-xl font-light">{stats.cdi}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">CDD</p>
              <p className="text-xl font-light">{stats.cdd}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Intérim</p>
              <p className="text-xl font-light">{stats.interim}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AvailabilityWidget({ isLoading }: { isLoading: boolean }) {
  const stats = getAgentStats();

  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-48 mb-4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          Disponibilité
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <span className="text-4xl font-light tracking-tight text-green-600">
              {stats.available}
            </span>
            <span className="ml-2 text-sm text-muted-foreground">
              disponibles
            </span>
          </div>
          <Progress
            value={(stats.available / stats.total) * 100}
            className="h-2"
          />
          <p className="text-xs text-muted-foreground">
            {((stats.available / stats.total) * 100).toFixed(0)}% de
            l&apos;effectif
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function MissionStatusWidget({ isLoading }: { isLoading: boolean }) {
  const stats = getAgentStats();
  const onMission = 45; // Mock data
  const missionRate = (onMission / stats.total) * 100;

  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-48" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-600" />
          En Mission
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <span className="text-4xl font-light tracking-tight text-blue-600">
              {onMission}
            </span>
            <span className="ml-2 text-sm text-muted-foreground">agents</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Taux d&apos;affectation
            </span>
            <span className="font-medium">{missionRate.toFixed(0)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QualificationsWidget({ isLoading }: { isLoading: boolean }) {
  const stats = getAgentStats();
  const qualifications = [
    { name: "CQP APS", count: 67, color: "bg-blue-500" },
    { name: "SSIAP", count: 34, color: "bg-green-500" },
    { name: "SST", count: 45, color: "bg-yellow-500" },
    { name: "Carte Pro", count: 72, color: "bg-purple-500" },
  ];

  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Award className="h-4 w-4 text-teal-600" />
          Qualifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {qualifications.map((qual) => (
            <div key={qual.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{qual.name}</span>
                <span className="font-medium">{qual.count}</span>
              </div>
              <Progress
                value={(qual.count / stats.total) * 100}
                className={cn("h-1.5", qual.color)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ContractTypesWidget({ isLoading }: { isLoading: boolean }) {
  const stats = getAgentStats();

  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <FileText className="h-4 w-4 text-purple-600" />
          Types de Contrat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">CDI</span>
            </div>
            <span className="text-2xl font-light">{stats.cdi}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm">CDD</span>
            </div>
            <span className="text-2xl font-light">{stats.cdd}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm">Intérim</span>
            </div>
            <span className="text-2xl font-light">{stats.interim}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WeeklyHoursWidget({ isLoading }: { isLoading: boolean }) {
  const totalHours = 1456; // Mock data
  const plannedHours = 1320;
  const utilizationRate = (plannedHours / totalHours) * 100;

  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-48" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-amber-600" />
          Heures Hebdomadaires
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <span className="text-4xl font-light tracking-tight">
              {plannedHours}
            </span>
            <span className="ml-2 text-sm text-muted-foreground">
              / {totalHours}h
            </span>
          </div>
          <Progress value={utilizationRate} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Taux d&apos;utilisation: {utilizationRate.toFixed(0)}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingMissionsWidget({ isLoading }: { isLoading: boolean }) {
  const missions = [
    { site: "Centre Commercial Rosny", agents: 4, date: "Lun 23 Déc" },
    { site: "Tour La Défense", agents: 6, date: "Mar 24 Déc" },
    { site: "Hôpital Saint-Louis", agents: 3, date: "Mer 25 Déc" },
  ];

  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4 text-red-600" />
          Missions à Venir
        </CardTitle>
        <Link href="/dashboard/planning/missions">
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            Voir tout
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {missions.map((mission, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">{mission.site}</p>
                <p className="text-xs text-muted-foreground">{mission.date}</p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Users className="h-3 w-3" />
                <span>{mission.agents}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AlertsWidget({ isLoading }: { isLoading: boolean }) {
  const alerts = [
    {
      type: "warning",
      message: "5 agents sans certification à jour",
      count: 5,
    },
    { type: "info", message: "12 demandes de congé en attente", count: 12 },
    { type: "urgent", message: "3 postes non pourvus cette semaine", count: 3 },
  ];

  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          Alertes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-start gap-2 p-2 rounded-lg",
                alert.type === "urgent" && "bg-red-500/10",
                alert.type === "warning" && "bg-orange-500/10",
                alert.type === "info" && "bg-blue-500/10",
              )}
            >
              <AlertTriangle
                className={cn(
                  "h-4 w-4 mt-0.5",
                  alert.type === "urgent" && "text-red-600",
                  alert.type === "warning" && "text-orange-600",
                  alert.type === "info" && "text-blue-600",
                )}
              />
              <p className="text-xs flex-1">{alert.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionsWidget({ isLoading }: { isLoading: boolean }) {
  const actions = [
    {
      label: "Nouvel Agent",
      href: "/dashboard/planning/agents",
      icon: Users,
    },
    {
      label: "Planifier Mission",
      href: "/dashboard/planning/missions",
      icon: Calendar,
    },
    {
      label: "Voir Planning",
      href: "/dashboard/planning/schedule",
      icon: Clock,
    },
    {
      label: "Rapports",
      href: "/dashboard/planning/reports",
      icon: BarChart3,
    },
  ];

  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Actions Rapides
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-auto flex flex-col items-center gap-2 p-4"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{action.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

type WidgetConfig = {
  id: string;
  name: string;
  component: React.ComponentType<{ isLoading: boolean }>;
  visible: boolean;
  span?: number;
};

type SavedWidgetConfig = Pick<WidgetConfig, "id" | "name" | "visible" | "span">;

function SortableItem({
  config,
  index,
  toggleVisibility,
  moveUp,
  moveDown,
  total,
}: {
  config: WidgetConfig;
  index: number;
  toggleVisibility: (id: string) => void;
  moveUp: (index: number) => void;
  moveDown: (index: number) => void;
  total: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: config.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between"
    >
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          {...attributes}
          {...listeners}
          className="cursor-grab"
        >
          <GripVertical className="h-4 w-4" />
        </Button>
        <Checkbox
          id={config.id}
          checked={config.visible}
          onCheckedChange={() => toggleVisibility(config.id)}
        />
        <label htmlFor={config.id} className="text-sm">
          {config.name}
        </label>
      </div>
      <div className="flex space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => moveUp(index)}
          disabled={index === 0}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => moveDown(index)}
          disabled={index === total - 1}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function SortableWidget({
  config,
  isLoading,
  isEditMode,
  toggleVisibility,
}: {
  config: WidgetConfig;
  isLoading: boolean;
  isEditMode: boolean;
  toggleVisibility: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: config.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Component = config.component;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("relative group", config.span)}
    >
      {isEditMode && (
        <div className="absolute -top-2 -right-2 z-10 flex gap-1">
          <Button
            variant="secondary"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => toggleVisibility(config.id)}
          >
            ✕
          </Button>
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing bg-primary text-primary-foreground rounded-md p-1 h-6 w-6 flex items-center justify-center"
          >
            <GripVertical className="h-4 w-4" />
          </div>
        </div>
      )}
      <Component isLoading={isLoading} />
    </div>
  );
}

const defaultWidgetConfigs: WidgetConfig[] = [
  {
    id: "agent-stats",
    name: "Effectif Agents",
    component: AgentStatsWidget,
    visible: true,
  },
  {
    id: "availability",
    name: "Disponibilité",
    component: AvailabilityWidget,
    visible: true,
  },
  {
    id: "mission-status",
    name: "En Mission",
    component: MissionStatusWidget,
    visible: true,
  },
  {
    id: "qualifications",
    name: "Qualifications",
    component: QualificationsWidget,
    visible: true,
  },
  {
    id: "contract-types",
    name: "Types de Contrat",
    component: ContractTypesWidget,
    visible: true,
  },
  {
    id: "weekly-hours",
    name: "Heures Hebdomadaires",
    component: WeeklyHoursWidget,
    visible: true,
  },
  {
    id: "upcoming-missions",
    name: "Missions à Venir",
    component: UpcomingMissionsWidget,
    visible: true,
    span: 2,
  },
  {
    id: "alerts",
    name: "Alertes",
    component: AlertsWidget,
    visible: true,
  },
  {
    id: "quick-actions",
    name: "Actions Rapides",
    component: QuickActionsWidget,
    visible: true,
  },
];

type WidgetAction =
  | { type: "TOGGLE_VISIBILITY"; payload: string }
  | { type: "REORDER"; payload: { activeId: string; overId: string } }
  | { type: "LOAD"; payload: SavedWidgetConfig[] };

function widgetReducer(
  state: WidgetConfig[],
  action: WidgetAction,
): WidgetConfig[] {
  switch (action.type) {
    case "TOGGLE_VISIBILITY": {
      return state.map((widget) =>
        widget.id === action.payload
          ? { ...widget, visible: !widget.visible }
          : widget,
      );
    }
    case "REORDER": {
      const { activeId, overId } = action.payload;
      const oldIndex = state.findIndex((w) => w.id === activeId);
      const newIndex = state.findIndex((w) => w.id === overId);
      return arrayMove(state, oldIndex, newIndex);
    }
    case "LOAD": {
      const saved = action.payload as unknown as WidgetConfig[];
      return saved;
    }
    default:
      return state;
  }
}

export default function PlanningDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [widgetConfigs, dispatch] = useReducer(
    widgetReducer,
    defaultWidgetConfigs,
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const gridSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasLoadedRef.current) {
      const saved = localStorage.getItem("planning-dashboard-config");
      if (saved) {
        try {
          const savedConfigs: SavedWidgetConfig[] = JSON.parse(saved);
          let loadedConfigs = savedConfigs
            .map((saved: SavedWidgetConfig) => {
              const defaultConfig = defaultWidgetConfigs.find(
                (d: WidgetConfig) => d.id === saved.id,
              );
              return defaultConfig ? { ...defaultConfig, ...saved } : null;
            })
            .filter(Boolean) as WidgetConfig[];
          const missingDefaults = defaultWidgetConfigs.filter(
            (defaultConfig: WidgetConfig) =>
              savedConfigs.every(
                (saved: SavedWidgetConfig) => saved.id !== defaultConfig.id,
              ),
          );
          loadedConfigs = [...loadedConfigs, ...missingDefaults];
          dispatch({ type: "LOAD", payload: loadedConfigs });
        } catch (e) {
          console.error("Error loading dashboard config:", e);
        }
      }
      hasLoadedRef.current = true;
    }
  }, []);

  useEffect(() => {
    const toSave: SavedWidgetConfig[] = widgetConfigs.map((config) => ({
      id: config.id,
      name: config.name,
      visible: config.visible,
      span: config.span,
    }));
    localStorage.setItem("planning-dashboard-config", JSON.stringify(toSave));
  }, [widgetConfigs]);

  const toggleVisibility = (id: string) => {
    dispatch({ type: "TOGGLE_VISIBILITY", payload: id });
  };

  const moveUp = (index: number) => {
    if (index > 0) {
      const activeId = widgetConfigs[index].id;
      const overId = widgetConfigs[index - 1].id;
      dispatch({ type: "REORDER", payload: { activeId, overId } });
    }
  };

  const moveDown = (index: number) => {
    if (index < widgetConfigs.length - 1) {
      const activeId = widgetConfigs[index].id;
      const overId = widgetConfigs[index + 1].id;
      dispatch({ type: "REORDER", payload: { activeId, overId } });
    }
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      dispatch({
        type: "REORDER",
        payload: { activeId: active.id as string, overId: over.id as string },
      });
    }
  }

  function handleGridDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeConfig = widgetConfigs.find((w) => w.id === activeId);
    const overConfig = widgetConfigs.find((w) => w.id === overId);

    if (!activeConfig || !overConfig) return;

    const isActiveVisible = activeConfig.visible;
    const isOverVisible = overConfig.visible;

    if (isActiveVisible && isOverVisible) {
      dispatch({ type: "REORDER", payload: { activeId, overId } });
    } else if (isActiveVisible && !isOverVisible) {
      dispatch({ type: "REORDER", payload: { activeId, overId } });
    } else if (!isActiveVisible && isOverVisible) {
      dispatch({ type: "REORDER", payload: { activeId, overId } });
    }
  }

  const visibleWidgets = widgetConfigs.filter((w) => w.visible);
  const hiddenWidgets = widgetConfigs.filter((w) => !w.visible);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            Tableau de bord Planning
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Gestion des agents, planification et affectations
          </p>
        </div>
        <div className="flex gap-2">
          {isEditMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditMode(false)}
            >
              Quitter Édition
            </Button>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Personnaliser
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Personnaliser le tableau de bord</DialogTitle>
              </DialogHeader>
              <Button
                variant={isEditMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsEditMode(!isEditMode);
                  setIsDialogOpen(false);
                }}
                className="mb-4"
              >
                <GripVertical className="h-4 w-4 mr-2" />
                {isEditMode ? "Quitter Édition" : "Mode Édition"}
              </Button>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={widgetConfigs.map((w) => w.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {widgetConfigs.map(
                      (config: WidgetConfig, index: number) => (
                        <SortableItem
                          key={config.id}
                          config={config}
                          index={index}
                          toggleVisibility={toggleVisibility}
                          moveUp={moveUp}
                          moveDown={moveDown}
                          total={widgetConfigs.length}
                        />
                      ),
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isEditMode ? (
        <DndContext
          sensors={gridSensors}
          collisionDetection={closestCenter}
          onDragStart={(event) => setActiveId(event.active.id as string)}
          onDragEnd={(event) => {
            setActiveId(null);
            handleGridDragEnd(event);
          }}
        >
          <SortableContext
            items={visibleWidgets.map((config) => config.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleWidgets.map((config: WidgetConfig) => (
                <SortableWidget
                  key={config.id}
                  config={config}
                  isLoading={isLoading}
                  isEditMode={isEditMode}
                  toggleVisibility={toggleVisibility}
                />
              ))}
            </div>
          </SortableContext>

          {hiddenWidgets.length > 0 && (
            <>
              <Separator className="my-6" />
              <div>
                <h2 className="text-sm font-light text-muted-foreground mb-4">
                  Widgets masqués
                </h2>
                <SortableContext
                  items={hiddenWidgets.map((config) => config.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hiddenWidgets.map((config: WidgetConfig) => (
                      <SortableWidget
                        key={config.id}
                        config={config}
                        isLoading={isLoading}
                        isEditMode={isEditMode}
                        toggleVisibility={toggleVisibility}
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>
            </>
          )}
          <DragOverlay>
            {activeId ? (
              <div className="rotate-3 opacity-90">
                <SortableWidget
                  config={widgetConfigs.find((c) => c.id === activeId)!}
                  isLoading={isLoading}
                  isEditMode={isEditMode}
                  toggleVisibility={toggleVisibility}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <div className="space-y-6">
          {/* Top Row - Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleWidgets
              .filter((config) =>
                ["agent-stats", "availability", "mission-status"].includes(
                  config.id,
                ),
              )
              .map((config: WidgetConfig) => {
                const Component = config.component;
                return (
                  <div key={config.id} className="h-full">
                    <Component isLoading={isLoading} />
                  </div>
                );
              })}
          </div>

          {/* Second Row - Qualifications & Contracts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleWidgets
              .filter((config) =>
                ["qualifications", "contract-types", "weekly-hours"].includes(
                  config.id,
                ),
              )
              .map((config: WidgetConfig) => {
                const Component = config.component;
                return (
                  <div key={config.id} className="h-full">
                    <Component isLoading={isLoading} />
                  </div>
                );
              })}
          </div>

          {/* Third Row - Missions & Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleWidgets
              .filter((config) =>
                ["upcoming-missions", "alerts"].includes(config.id),
              )
              .map((config: WidgetConfig) => {
                const Component = config.component;
                return (
                  <div
                    key={config.id}
                    className={cn(
                      config.id === "upcoming-missions" && "md:col-span-2",
                      "h-full",
                    )}
                  >
                    <Component isLoading={isLoading} />
                  </div>
                );
              })}
          </div>

          {/* Bottom Row - Quick Actions */}
          {visibleWidgets.filter((config) => config.id === "quick-actions")
            .length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              {visibleWidgets
                .filter((config) => config.id === "quick-actions")
                .map((config: WidgetConfig) => {
                  const Component = config.component;
                  return (
                    <div key={config.id} className="h-full">
                      <Component isLoading={isLoading} />
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
