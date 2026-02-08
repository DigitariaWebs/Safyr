"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
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
import { Modal } from "@/components/ui/modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import {
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Sparkles,
  Copy,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import type {
  Assignment,
  AssignmentFormData,
  ScheduleView,
  ScheduleGroupBy,
  ScheduleAlert,
  ScheduleTemplate,
} from "@/lib/types";
import {
  mockAssignments,
  mockScheduleAlerts,
  mockScheduleStats,
  mockScheduleTemplates,
} from "@/data/assignments";
import { mockSites } from "@/data/sites";
import { mockEmployees } from "@/data/employees";

export default function SchedulePage() {
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [alerts] = useState<ScheduleAlert[]>(mockScheduleAlerts);
  const [scheduleView, setScheduleView] = useState<ScheduleView>("weekly");
  const [groupBy, setGroupBy] = useState<ScheduleGroupBy>("site");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filterSiteId, setFilterSiteId] = useState<string>("all");
  const [filterAgentId] = useState<string>("all");
  const [showConflictsOnly, setShowConflictsOnly] = useState(false);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isAutoScheduleModalOpen, setIsAutoScheduleModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  // Calculate date range based on view
  const dateRange = useMemo(() => {
    const start = new Date(selectedDate);
    const end = new Date(selectedDate);

    if (scheduleView === "daily") {
      // Same day
    } else if (scheduleView === "weekly") {
      // Start of week (Monday)
      const day = start.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      start.setDate(start.getDate() + diff);
      end.setDate(start.getDate() + 6);
    } else if (scheduleView === "monthly") {
      start.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    }

    return { start, end };
  }, [selectedDate, scheduleView]);

  // Filter assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      // Date range filter
      const assignmentDate = new Date(assignment.startDate);
      if (assignmentDate < dateRange.start || assignmentDate > dateRange.end) {
        return false;
      }

      // Site filter
      if (filterSiteId !== "all" && assignment.siteId !== filterSiteId) {
        return false;
      }

      // Agent filter
      if (filterAgentId !== "all" && assignment.agentId !== filterAgentId) {
        return false;
      }

      // Conflicts filter
      if (showConflictsOnly && !assignment.hasConflicts) {
        return false;
      }

      return true;
    });
  }, [assignments, dateRange, filterSiteId, filterAgentId, showConflictsOnly]);

  // Group assignments
  const groupedAssignments = useMemo(() => {
    const groups: Record<string, Assignment[]> = {};

    filteredAssignments.forEach((assignment) => {
      let key: string;
      if (groupBy === "agent") {
        key = assignment.agentId;
      } else if (groupBy === "site") {
        key = assignment.siteId;
      } else {
        key = assignment.posteId;
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(assignment);
    });

    return groups;
  }, [filteredAssignments, groupBy]);

  // Navigation
  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (scheduleView === "daily") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (scheduleView === "weekly") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Format date range display
  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    if (scheduleView === "daily") {
      return dateRange.start.toLocaleDateString("fr-FR", options);
    } else if (scheduleView === "weekly") {
      return `${dateRange.start.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} - ${dateRange.end.toLocaleDateString("fr-FR", options)}`;
    } else {
      return dateRange.start.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      });
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      scheduled: { variant: "default", label: "Planifié" },
      confirmed: { variant: "outline", label: "Confirmé" },
      in_progress: { variant: "secondary", label: "En cours" },
      completed: { variant: "outline", label: "Terminé" },
      cancelled: { variant: "destructive", label: "Annulé" },
      no_show: { variant: "destructive", label: "Absent" },
    };
    const config = variants[status] || variants.scheduled;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Handle assignment creation
  const handleCreateAssignment = (data: AssignmentFormData) => {
    const site = mockSites.find((s) => s.id === data.siteId);
    const poste = site?.postes.find((p) => p.id === data.posteId);
    const agent = mockEmployees.find((e) => e.id === data.agentId);

    if (!site || !poste || !agent) return;

    const [startHour, startMin] = data.startTime.split(":").map(Number);
    const [endHour, endMin] = data.endTime.split(":").map(Number);
    const plannedHours = endHour - startHour + (endMin - startMin) / 60;

    const newAssignment: Assignment = {
      id: `ASG-${Date.now()}`,
      agentId: agent.id,
      agentName: `${agent.firstName} ${agent.lastName}`,
      siteId: site.id,
      siteName: site.name,
      posteId: poste.id,
      posteName: poste.name,
      startDate: new Date(data.date),
      endDate: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      plannedHours,
      breakDuration: data.breakDuration,
      status: "scheduled",
      confirmedByAgent: false,
      conflicts: [],
      hasConflicts: false,
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "current-user",
    };

    setAssignments([...assignments, newAssignment]);
    setIsCreateModalOpen(false);
  };

  // Handle assignment update
  const handleUpdateAssignment = (data: AssignmentFormData) => {
    if (!selectedAssignment) return;

    const site = mockSites.find((s) => s.id === data.siteId);
    const poste = site?.postes.find((p) => p.id === data.posteId);
    const agent = mockEmployees.find((e) => e.id === data.agentId);

    if (!site || !poste || !agent) return;

    const [startHour, startMin] = data.startTime.split(":").map(Number);
    const [endHour, endMin] = data.endTime.split(":").map(Number);
    const plannedHours = endHour - startHour + (endMin - startMin) / 60;

    const updatedAssignment: Assignment = {
      ...selectedAssignment,
      agentId: agent.id,
      agentName: `${agent.firstName} ${agent.lastName}`,
      siteId: site.id,
      siteName: site.name,
      posteId: poste.id,
      posteName: poste.name,
      startDate: new Date(data.date),
      endDate: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      plannedHours,
      breakDuration: data.breakDuration,
      notes: data.notes,
      updatedAt: new Date(),
      modifiedBy: "current-user",
    };

    setAssignments(
      assignments.map((a) =>
        a.id === selectedAssignment.id ? updatedAssignment : a,
      ),
    );
    setIsEditModalOpen(false);
    setSelectedAssignment(null);
  };

  // Handle assignment deletion
  const handleDeleteAssignment = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette affectation ?")) {
      setAssignments(assignments.filter((a) => a.id !== id));
      setIsViewModalOpen(false);
      setSelectedAssignment(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Construction du Planning
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez les affectations et visualisez le planning en temps réel
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsTemplateModalOpen(true)}
          >
            <Copy className="mr-2 h-4 w-4" />
            Templates
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsAutoScheduleModalOpen(true)}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Auto-planning
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle affectation
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Affectations
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockScheduleStats.totalAssignments}
            </div>
            <p className="text-xs text-muted-foreground">sur la période</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockScheduleStats.confirmed}
            </div>
            <p className="text-xs text-muted-foreground">
              +
              {Math.round(
                (mockScheduleStats.confirmed /
                  mockScheduleStats.totalAssignments) *
                  100,
              )}
              % du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockScheduleStats.pending}
            </div>
            <p className="text-xs text-muted-foreground">à confirmer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conflits</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockScheduleStats.conflicts}
            </div>
            <p className="text-xs text-muted-foreground">à résoudre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Agents assignés
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockScheduleStats.agentsAssigned}
            </div>
            <p className="text-xs text-muted-foreground">agents actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Heures totales
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {mockScheduleStats.totalHours}h
            </div>
            <p className="text-xs text-muted-foreground">planifiées</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {alerts.filter((a) => !a.resolved).length > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <CardTitle className="text-red-900">
                  Alertes actives ({alerts.filter((a) => !a.resolved).length})
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-700 hover:text-red-900"
              >
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[180px]">
              <div className="space-y-3 pr-4">
                {alerts
                  .filter((a) => !a.resolved)
                  .map((alert) => (
                    <Card key={alert.id} className="border-red-100">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-red-900">
                              {alert.title}
                            </p>
                            <p className="text-sm text-red-700 mt-1">
                              {alert.message}
                            </p>
                          </div>
                          <Badge
                            variant={
                              alert.severity === "critical"
                                ? "destructive"
                                : "secondary"
                            }
                            className="flex-shrink-0"
                          >
                            {alert.severity === "critical"
                              ? "Critique"
                              : "Avertissement"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Main Content with Tabs */}
      <Tabs defaultValue="schedule" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="schedule" className="gap-2">
              <Calendar className="h-4 w-4" />
              Planning
            </TabsTrigger>
            <TabsTrigger value="by-agent" className="gap-2">
              <Users className="h-4 w-4" />
              Par Agent
            </TabsTrigger>
            <TabsTrigger value="by-site" className="gap-2">
              <MapPin className="h-4 w-4" />
              Par Site
            </TabsTrigger>
            <TabsTrigger value="by-poste" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Par Poste
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Filters Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center gap-1 border rounded-lg p-1 bg-muted/50">
                <Button
                  size="sm"
                  variant={scheduleView === "daily" ? "default" : "ghost"}
                  onClick={() => setScheduleView("daily")}
                >
                  Jour
                </Button>
                <Button
                  size="sm"
                  variant={scheduleView === "weekly" ? "default" : "ghost"}
                  onClick={() => setScheduleView("weekly")}
                >
                  Semaine
                </Button>
                <Button
                  size="sm"
                  variant={scheduleView === "monthly" ? "default" : "ghost"}
                  onClick={() => setScheduleView("monthly")}
                >
                  Mois
                </Button>
              </div>

              <Separator orientation="vertical" className="h-8" />

              {/* Group By */}
              <Select
                value={groupBy}
                onValueChange={(v) => setGroupBy(v as ScheduleGroupBy)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">Par agent</SelectItem>
                  <SelectItem value="site">Par site</SelectItem>
                  <SelectItem value="poste">Par poste</SelectItem>
                </SelectContent>
              </Select>

              {/* Site Filter */}
              <Select value={filterSiteId} onValueChange={setFilterSiteId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Tous les sites" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les sites</SelectItem>
                  {mockSites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Conflicts Filter */}
              <Button
                variant={showConflictsOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowConflictsOnly(!showConflictsOnly)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Conflits uniquement
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Date Navigation */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("prev")}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Précédent
              </Button>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">{formatDateRange()}</h2>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Aujourd&apos;hui
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate("next")}
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Schedule View */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Planning{" "}
                {groupBy === "agent"
                  ? "par agent"
                  : groupBy === "site"
                    ? "par site"
                    : "par poste"}
              </CardTitle>
              <CardDescription>
                {Object.keys(groupedAssignments).length} groupe(s) •{" "}
                {filteredAssignments.length} affectation(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {Object.keys(groupedAssignments).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Calendar className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-1">
                      Aucune affectation
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Aucune affectation trouvée pour cette période
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedAssignments).map(
                      ([key, groupAssignments]) => {
                        const name =
                          groupBy === "agent"
                            ? groupAssignments[0].agentName
                            : groupBy === "site"
                              ? groupAssignments[0].siteName
                              : groupAssignments[0].posteName;

                        return (
                          <div key={key}>
                            <div className="flex items-center gap-2 mb-4">
                              <h4 className="text-lg font-semibold">{name}</h4>
                              <Badge variant="secondary">
                                {groupAssignments.length}
                              </Badge>
                              {groupAssignments.some((a) => a.hasConflicts) && (
                                <Badge variant="destructive" className="gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Conflits
                                </Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                              {groupAssignments.map((assignment) => (
                                <Card
                                  key={assignment.id}
                                  className={`cursor-pointer transition-all hover:shadow-md ${
                                    assignment.hasConflicts
                                      ? "border-red-300 bg-red-50/50"
                                      : "hover:border-primary"
                                  }`}
                                  onClick={() => {
                                    setSelectedAssignment(assignment);
                                    setIsViewModalOpen(true);
                                  }}
                                >
                                  <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1 min-w-0">
                                        <CardTitle className="text-sm line-clamp-1">
                                          {groupBy !== "agent"
                                            ? assignment.agentName
                                            : assignment.siteName}
                                        </CardTitle>
                                        {groupBy === "agent" && (
                                          <CardDescription className="text-xs line-clamp-1">
                                            {assignment.posteName}
                                          </CardDescription>
                                        )}
                                      </div>
                                      {getStatusBadge(assignment.status)}
                                    </div>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Calendar className="h-3 w-3 flex-shrink-0" />
                                      <span>
                                        {new Date(
                                          assignment.startDate,
                                        ).toLocaleDateString("fr-FR", {
                                          weekday: "short",
                                          day: "numeric",
                                          month: "short",
                                        })}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Clock className="h-3 w-3 flex-shrink-0" />
                                      <span>
                                        {assignment.startTime} -{" "}
                                        {assignment.endTime}
                                      </span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="font-medium">
                                        {assignment.plannedHours}h
                                      </span>
                                      {assignment.breakDuration && (
                                        <span className="text-muted-foreground">
                                          Pause {assignment.breakDuration}min
                                        </span>
                                      )}
                                    </div>

                                    {assignment.hasConflicts && (
                                      <>
                                        <Separator className="my-2 bg-red-200" />
                                        <div className="flex items-start gap-1 text-xs text-red-600">
                                          <AlertTriangle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                                          <span className="font-medium line-clamp-2">
                                            {assignment.conflicts[0]?.message}
                                          </span>
                                        </div>
                                      </>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                            <Separator className="mt-6" />
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-agent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vue par Agent</CardTitle>
              <CardDescription>
                Organisation des affectations par agent de sécurité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {(() => {
                  // Group assignments by agent
                  const agentGroups: Record<
                    string,
                    {
                      assignments: Assignment[];
                      agentName: string;
                      sites: Set<string>;
                    }
                  > = {};

                  filteredAssignments.forEach((assignment) => {
                    if (!agentGroups[assignment.agentId]) {
                      agentGroups[assignment.agentId] = {
                        assignments: [],
                        agentName: assignment.agentName,
                        sites: new Set(),
                      };
                    }
                    agentGroups[assignment.agentId].assignments.push(
                      assignment,
                    );
                    agentGroups[assignment.agentId].sites.add(
                      assignment.siteName,
                    );
                  });

                  return Object.keys(agentGroups).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-semibold mb-1">
                        Aucun agent
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Aucun agent avec affectations pour cette période
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(agentGroups).map(
                        ([agentId, agentData]) => {
                          const totalHours = agentData.assignments.reduce(
                            (sum, a) => sum + a.plannedHours,
                            0,
                          );
                          const conflicts = agentData.assignments.filter(
                            (a) => a.hasConflicts,
                          ).length;
                          const confirmedCount = agentData.assignments.filter(
                            (a) =>
                              a.status === "confirmed" ||
                              a.status === "in_progress" ||
                              a.status === "completed",
                          ).length;

                          // Calculate average hours per day
                          const daysWorked = new Set(
                            agentData.assignments.map((a) =>
                              new Date(a.startDate).toDateString(),
                            ),
                          ).size;

                          // Group by date for timeline
                          const dateGroups: Record<string, Assignment[]> = {};
                          agentData.assignments.forEach((assignment) => {
                            const dateKey = new Date(
                              assignment.startDate,
                            ).toLocaleDateString("fr-FR");
                            if (!dateGroups[dateKey]) {
                              dateGroups[dateKey] = [];
                            }
                            dateGroups[dateKey].push(assignment);
                          });

                          return (
                            <Card key={agentId}>
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <CardTitle className="flex items-center gap-2">
                                      <Users className="h-5 w-5 text-primary" />
                                      {agentData.agentName}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                      {agentData.sites.size} site(s) •{" "}
                                      {agentData.assignments.length}{" "}
                                      affectation(s)
                                    </CardDescription>
                                  </div>
                                  <div className="flex gap-2">
                                    <Badge variant="secondary">
                                      {totalHours}h totales
                                    </Badge>
                                    {conflicts > 0 && (
                                      <Badge variant="destructive">
                                        {conflicts} conflits
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {/* Agent Stats */}
                                <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Heures totales
                                    </p>
                                    <p className="text-xl font-bold">
                                      {totalHours}h
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Jours travaillés
                                    </p>
                                    <p className="text-xl font-bold">
                                      {daysWorked}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Moyenne/jour
                                    </p>
                                    <p className="text-xl font-bold">
                                      {(totalHours / daysWorked).toFixed(1)}h
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Confirmées
                                    </p>
                                    <p className="text-xl font-bold text-green-600">
                                      {confirmedCount}/
                                      {agentData.assignments.length}
                                    </p>
                                  </div>
                                </div>

                                <Separator />

                                {/* Timeline by Date */}
                                <div className="space-y-4">
                                  <h4 className="font-medium text-sm text-muted-foreground">
                                    Planning chronologique
                                  </h4>
                                  {Object.entries(dateGroups)
                                    .sort(
                                      ([dateA], [dateB]) =>
                                        new Date(
                                          dateA.split("/").reverse().join("-"),
                                        ).getTime() -
                                        new Date(
                                          dateB.split("/").reverse().join("-"),
                                        ).getTime(),
                                    )
                                    .map(([dateKey, assignments]) => {
                                      const dayHours = assignments.reduce(
                                        (sum, a) => sum + a.plannedHours,
                                        0,
                                      );

                                      return (
                                        <div key={dateKey}>
                                          <div className="flex items-center gap-2 mb-3">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <h5 className="font-medium">
                                              {new Date(
                                                assignments[0].startDate,
                                              ).toLocaleDateString("fr-FR", {
                                                weekday: "long",
                                                day: "numeric",
                                                month: "long",
                                              })}
                                            </h5>
                                            <Badge variant="outline">
                                              {assignments.length} mission(s)
                                            </Badge>
                                            <Badge variant="secondary">
                                              {dayHours}h
                                            </Badge>
                                          </div>

                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-6">
                                            {assignments.map((assignment) => (
                                              <Card
                                                key={assignment.id}
                                                className={`cursor-pointer transition-all hover:shadow-md ${
                                                  assignment.hasConflicts
                                                    ? "border-red-300 bg-red-50/50"
                                                    : "hover:border-primary"
                                                }`}
                                                onClick={() => {
                                                  setSelectedAssignment(
                                                    assignment,
                                                  );
                                                  setIsViewModalOpen(true);
                                                }}
                                              >
                                                <CardHeader className="pb-3">
                                                  <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                      <CardTitle className="text-sm line-clamp-1 flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {assignment.siteName}
                                                      </CardTitle>
                                                      <CardDescription className="text-xs line-clamp-1 flex items-center gap-1 mt-1">
                                                        <Briefcase className="h-3 w-3" />
                                                        {assignment.posteName}
                                                      </CardDescription>
                                                    </div>
                                                    {getStatusBadge(
                                                      assignment.status,
                                                    )}
                                                  </div>
                                                </CardHeader>
                                                <CardContent className="space-y-2">
                                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3 shrink-0" />
                                                    <span>
                                                      {assignment.startTime} -{" "}
                                                      {assignment.endTime}
                                                    </span>
                                                  </div>
                                                  <Separator className="my-2" />
                                                  <div className="flex items-center justify-between text-xs">
                                                    <span className="font-medium">
                                                      {assignment.plannedHours}h
                                                    </span>
                                                    {assignment.breakDuration && (
                                                      <span className="text-muted-foreground">
                                                        Pause{" "}
                                                        {
                                                          assignment.breakDuration
                                                        }
                                                        min
                                                      </span>
                                                    )}
                                                  </div>

                                                  {assignment.hasConflicts && (
                                                    <>
                                                      <Separator className="my-2 bg-red-200" />
                                                      <div className="flex items-start gap-1 text-xs text-red-600">
                                                        <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
                                                        <span className="font-medium line-clamp-2">
                                                          {
                                                            assignment
                                                              .conflicts[0]
                                                              ?.message
                                                          }
                                                        </span>
                                                      </div>
                                                    </>
                                                  )}
                                                </CardContent>
                                              </Card>
                                            ))}
                                          </div>
                                        </div>
                                      );
                                    })}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        },
                      )}
                    </div>
                  );
                })()}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-site" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vue par Site</CardTitle>
              <CardDescription>
                Organisation des affectations par site client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {mockSites
                  .filter((site) => {
                    // Filter sites that have assignments in the current period
                    return filteredAssignments.some(
                      (a) => a.siteId === site.id,
                    );
                  })
                  .map((site) => {
                    const siteAssignments = filteredAssignments.filter(
                      (a) => a.siteId === site.id,
                    );
                    const totalHours = siteAssignments.reduce(
                      (sum, a) => sum + a.plannedHours,
                      0,
                    );
                    const activeAgents = new Set(
                      siteAssignments.map((a) => a.agentId),
                    ).size;
                    const conflicts = siteAssignments.filter(
                      (a) => a.hasConflicts,
                    ).length;

                    // Group by poste within site
                    const posteGroups: Record<string, Assignment[]> = {};
                    siteAssignments.forEach((assignment) => {
                      if (!posteGroups[assignment.posteId]) {
                        posteGroups[assignment.posteId] = [];
                      }
                      posteGroups[assignment.posteId].push(assignment);
                    });

                    return (
                      <Card key={site.id} className="mb-4">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                {site.name}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {site.address.city} • {site.clientName}
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="secondary">
                                {siteAssignments.length} affectations
                              </Badge>
                              {conflicts > 0 && (
                                <Badge variant="destructive">
                                  {conflicts} conflits
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Site Stats */}
                          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Heures totales
                              </p>
                              <p className="text-xl font-bold">{totalHours}h</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Agents actifs
                              </p>
                              <p className="text-xl font-bold">
                                {activeAgents}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Postes
                              </p>
                              <p className="text-xl font-bold">
                                {Object.keys(posteGroups).length}
                              </p>
                            </div>
                          </div>

                          <Separator />

                          {/* Postes within Site */}
                          <div className="space-y-4">
                            {Object.entries(posteGroups).map(
                              ([posteId, assignments]) => (
                                <div key={posteId}>
                                  <div className="flex items-center gap-2 mb-3">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    <h4 className="font-medium">
                                      {assignments[0].posteName}
                                    </h4>
                                    <Badge variant="outline">
                                      {assignments.length}
                                    </Badge>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {assignments.map((assignment) => (
                                      <Card
                                        key={assignment.id}
                                        className={`cursor-pointer transition-all hover:shadow-md ${
                                          assignment.hasConflicts
                                            ? "border-red-300 bg-red-50/50"
                                            : "hover:border-primary"
                                        }`}
                                        onClick={() => {
                                          setSelectedAssignment(assignment);
                                          setIsViewModalOpen(true);
                                        }}
                                      >
                                        <CardHeader className="pb-3">
                                          <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                              <CardTitle className="text-sm line-clamp-1">
                                                {assignment.agentName}
                                              </CardTitle>
                                            </div>
                                            {getStatusBadge(assignment.status)}
                                          </div>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3 shrink-0" />
                                            <span>
                                              {new Date(
                                                assignment.startDate,
                                              ).toLocaleDateString("fr-FR", {
                                                weekday: "short",
                                                day: "numeric",
                                                month: "short",
                                              })}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3 shrink-0" />
                                            <span>
                                              {assignment.startTime} -{" "}
                                              {assignment.endTime}
                                            </span>
                                          </div>
                                          <Separator className="my-2" />
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="font-medium">
                                              {assignment.plannedHours}h
                                            </span>
                                            {assignment.breakDuration && (
                                              <span className="text-muted-foreground">
                                                Pause {assignment.breakDuration}
                                                min
                                              </span>
                                            )}
                                          </div>

                                          {assignment.hasConflicts && (
                                            <>
                                              <Separator className="my-2 bg-red-200" />
                                              <div className="flex items-start gap-1 text-xs text-red-600">
                                                <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
                                                <span className="font-medium line-clamp-2">
                                                  {
                                                    assignment.conflicts[0]
                                                      ?.message
                                                  }
                                                </span>
                                              </div>
                                            </>
                                          )}
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                {mockSites.filter((site) =>
                  filteredAssignments.some((a) => a.siteId === site.id),
                ).length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MapPin className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-1">Aucun site</h3>
                    <p className="text-sm text-muted-foreground">
                      Aucun site avec affectations pour cette période
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-poste" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vue par Poste</CardTitle>
              <CardDescription>
                Organisation des affectations par type de poste
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {(() => {
                  // Group assignments by poste
                  const posteGroups: Record<
                    string,
                    {
                      assignments: Assignment[];
                      posteName: string;
                      sites: Set<string>;
                    }
                  > = {};

                  filteredAssignments.forEach((assignment) => {
                    if (!posteGroups[assignment.posteId]) {
                      posteGroups[assignment.posteId] = {
                        assignments: [],
                        posteName: assignment.posteName,
                        sites: new Set(),
                      };
                    }
                    posteGroups[assignment.posteId].assignments.push(
                      assignment,
                    );
                    posteGroups[assignment.posteId].sites.add(
                      assignment.siteName,
                    );
                  });

                  return Object.keys(posteGroups).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Briefcase className="h-16 w-16 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-semibold mb-1">
                        Aucun poste
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Aucun poste avec affectations pour cette période
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(posteGroups).map(
                        ([posteId, posteData]) => {
                          const totalHours = posteData.assignments.reduce(
                            (sum, a) => sum + a.plannedHours,
                            0,
                          );
                          const activeAgents = new Set(
                            posteData.assignments.map((a) => a.agentId),
                          ).size;
                          const conflicts = posteData.assignments.filter(
                            (a) => a.hasConflicts,
                          ).length;

                          // Group by date for timeline view
                          const dateGroups: Record<string, Assignment[]> = {};
                          posteData.assignments.forEach((assignment) => {
                            const dateKey = new Date(
                              assignment.startDate,
                            ).toLocaleDateString("fr-FR");
                            if (!dateGroups[dateKey]) {
                              dateGroups[dateKey] = [];
                            }
                            dateGroups[dateKey].push(assignment);
                          });

                          return (
                            <Card key={posteId}>
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <CardTitle className="flex items-center gap-2">
                                      <Briefcase className="h-5 w-5 text-primary" />
                                      {posteData.posteName}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                      {posteData.sites.size} site(s) •{" "}
                                      {posteData.assignments.length}{" "}
                                      affectation(s)
                                    </CardDescription>
                                  </div>
                                  <div className="flex gap-2">
                                    <Badge variant="secondary">
                                      {activeAgents} agents
                                    </Badge>
                                    {conflicts > 0 && (
                                      <Badge variant="destructive">
                                        {conflicts} conflits
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {/* Poste Stats */}
                                <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Heures totales
                                    </p>
                                    <p className="text-xl font-bold">
                                      {totalHours}h
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Agents
                                    </p>
                                    <p className="text-xl font-bold">
                                      {activeAgents}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Sites
                                    </p>
                                    <p className="text-xl font-bold">
                                      {posteData.sites.size}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground">
                                      Moyenne/jour
                                    </p>
                                    <p className="text-xl font-bold">
                                      {(
                                        totalHours /
                                        Object.keys(dateGroups).length
                                      ).toFixed(1)}
                                      h
                                    </p>
                                  </div>
                                </div>

                                <Separator />

                                {/* Timeline by Date */}
                                <div className="space-y-4">
                                  <h4 className="font-medium text-sm text-muted-foreground">
                                    Planning chronologique
                                  </h4>
                                  {Object.entries(dateGroups)
                                    .sort(
                                      ([dateA], [dateB]) =>
                                        new Date(
                                          dateA.split("/").reverse().join("-"),
                                        ).getTime() -
                                        new Date(
                                          dateB.split("/").reverse().join("-"),
                                        ).getTime(),
                                    )
                                    .map(([dateKey, assignments]) => (
                                      <div key={dateKey}>
                                        <div className="flex items-center gap-2 mb-3">
                                          <Calendar className="h-4 w-4 text-muted-foreground" />
                                          <h5 className="font-medium">
                                            {new Date(
                                              assignments[0].startDate,
                                            ).toLocaleDateString("fr-FR", {
                                              weekday: "long",
                                              day: "numeric",
                                              month: "long",
                                            })}
                                          </h5>
                                          <Badge variant="outline">
                                            {assignments.length}
                                          </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-6">
                                          {assignments.map((assignment) => (
                                            <Card
                                              key={assignment.id}
                                              className={`cursor-pointer transition-all hover:shadow-md ${
                                                assignment.hasConflicts
                                                  ? "border-red-300 bg-red-50/50"
                                                  : "hover:border-primary"
                                              }`}
                                              onClick={() => {
                                                setSelectedAssignment(
                                                  assignment,
                                                );
                                                setIsViewModalOpen(true);
                                              }}
                                            >
                                              <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between gap-2">
                                                  <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-sm line-clamp-1 flex items-center gap-1">
                                                      <Users className="h-3 w-3" />
                                                      {assignment.agentName}
                                                    </CardTitle>
                                                    <CardDescription className="text-xs line-clamp-1 flex items-center gap-1 mt-1">
                                                      <MapPin className="h-3 w-3" />
                                                      {assignment.siteName}
                                                    </CardDescription>
                                                  </div>
                                                  {getStatusBadge(
                                                    assignment.status,
                                                  )}
                                                </div>
                                              </CardHeader>
                                              <CardContent className="space-y-2">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                  <Clock className="h-3 w-3 shrink-0" />
                                                  <span>
                                                    {assignment.startTime} -{" "}
                                                    {assignment.endTime}
                                                  </span>
                                                </div>
                                                <Separator className="my-2" />
                                                <div className="flex items-center justify-between text-xs">
                                                  <span className="font-medium">
                                                    {assignment.plannedHours}h
                                                  </span>
                                                  {assignment.breakDuration && (
                                                    <span className="text-muted-foreground">
                                                      Pause{" "}
                                                      {assignment.breakDuration}
                                                      min
                                                    </span>
                                                  )}
                                                </div>

                                                {assignment.hasConflicts && (
                                                  <>
                                                    <Separator className="my-2 bg-red-200" />
                                                    <div className="flex items-start gap-1 text-xs text-red-600">
                                                      <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
                                                      <span className="font-medium line-clamp-2">
                                                        {
                                                          assignment
                                                            .conflicts[0]
                                                            ?.message
                                                        }
                                                      </span>
                                                    </div>
                                                  </>
                                                )}
                                              </CardContent>
                                            </Card>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        },
                      )}
                    </div>
                  );
                })()}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Assignment Modal */}
      {selectedAssignment && (
        <AssignmentViewModal
          open={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedAssignment(null);
          }}
          assignment={selectedAssignment}
          onEdit={() => {
            setIsViewModalOpen(false);
            setIsEditModalOpen(true);
          }}
          onDelete={() => handleDeleteAssignment(selectedAssignment.id)}
        />
      )}

      {/* Create Assignment Modal */}
      <AssignmentFormModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateAssignment}
        title="Nouvelle affectation"
      />

      {/* Edit Assignment Modal */}
      {selectedAssignment && (
        <AssignmentFormModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedAssignment(null);
          }}
          onSave={handleUpdateAssignment}
          title="Modifier l'affectation"
          initialData={{
            agentId: selectedAssignment.agentId,
            siteId: selectedAssignment.siteId,
            posteId: selectedAssignment.posteId,
            date: selectedAssignment.startDate.toISOString().split("T")[0],
            startTime: selectedAssignment.startTime,
            endTime: selectedAssignment.endTime,
            breakDuration: selectedAssignment.breakDuration,
            notes: selectedAssignment.notes,
          }}
        />
      )}

      {/* Template Modal */}
      <TemplateModal
        open={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        templates={mockScheduleTemplates}
      />

      {/* Auto Schedule Modal */}
      <AutoScheduleModal
        open={isAutoScheduleModalOpen}
        onClose={() => setIsAutoScheduleModalOpen(false)}
      />
    </div>
  );
}

// Assignment View Modal Component
function AssignmentViewModal({
  open,
  onClose,
  assignment,
  onEdit,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  assignment: Assignment;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title="Détails de l'affectation"
      type="details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Status Bar */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Statut</p>
              <div className="mt-1">
                {assignment.status === "scheduled" && (
                  <Badge variant="default">Planifié</Badge>
                )}
                {assignment.status === "confirmed" && (
                  <Badge variant="outline">Confirmé</Badge>
                )}
                {assignment.status === "in_progress" && (
                  <Badge variant="secondary">En cours</Badge>
                )}
                {assignment.status === "completed" && (
                  <Badge variant="outline">Terminé</Badge>
                )}
                {assignment.status === "cancelled" && (
                  <Badge variant="destructive">Annulé</Badge>
                )}
                {assignment.status === "no_show" && (
                  <Badge variant="destructive">Absent</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-1" />
              Modifier
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="text-muted-foreground">Agent</Label>
            <p className="font-medium">{assignment.agentName}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Site</Label>
            <p className="font-medium">{assignment.siteName}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Poste</Label>
            <p className="font-medium">{assignment.posteName}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Date</Label>
            <p className="font-medium">
              {new Date(assignment.startDate).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground">Horaires</Label>
            <p className="font-medium">
              {assignment.startTime} - {assignment.endTime}
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground">Durée</Label>
            <p className="font-medium">
              {assignment.plannedHours}h
              {assignment.breakDuration &&
                ` (pause ${assignment.breakDuration}min)`}
            </p>
          </div>
        </div>

        {/* Confirmation Status */}
        {assignment.confirmedByAgent && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Confirmé par l&apos;agent le{" "}
              {assignment.confirmedAt?.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        )}

        {/* Conflicts */}
        {assignment.hasConflicts && (
          <div className="space-y-2">
            <Label>Conflits détectés</Label>
            {assignment.conflicts.map((conflict, idx) => (
              <div
                key={idx}
                className="p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-sm text-red-800 font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {conflict.message}
                </p>
                {conflict.details && (
                  <p className="text-xs text-red-600 mt-1">
                    {conflict.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Notes */}
        {assignment.notes && (
          <div>
            <Label className="text-muted-foreground">Notes</Label>
            <p className="text-sm mt-1">{assignment.notes}</p>
          </div>
        )}

        {/* Metadata */}
        <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
          <p>
            Créé le {assignment.createdAt.toLocaleDateString("fr-FR")} par{" "}
            {assignment.createdBy}
          </p>
          {assignment.modifiedBy && (
            <p>
              Modifié le {assignment.updatedAt.toLocaleDateString("fr-FR")} par{" "}
              {assignment.modifiedBy}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}

// Assignment Form Modal Component
function AssignmentFormModal({
  open,
  onClose,
  onSave,
  title,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: AssignmentFormData) => void;
  title: string;
  initialData?: Partial<AssignmentFormData>;
}) {
  const [formData, setFormData] = useState<AssignmentFormData>({
    agentId: initialData?.agentId || "",
    siteId: initialData?.siteId || "",
    posteId: initialData?.posteId || "",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    startTime: initialData?.startTime || "08:00",
    endTime: initialData?.endTime || "16:00",
    breakDuration: initialData?.breakDuration || 30,
    notes: initialData?.notes || "",
  });

  const selectedSite = mockSites.find((s) => s.id === formData.siteId);
  const availablePostes = selectedSite?.postes || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title={title}
      type="form"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label htmlFor="agentId">Agent *</Label>
            <Select
              value={formData.agentId}
              onValueChange={(value) =>
                setFormData({ ...formData, agentId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un agent" />
              </SelectTrigger>
              <SelectContent>
                {mockEmployees.slice(0, 20).map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label htmlFor="siteId">Site *</Label>
            <Select
              value={formData.siteId}
              onValueChange={(value) =>
                setFormData({ ...formData, siteId: value, posteId: "" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un site" />
              </SelectTrigger>
              <SelectContent>
                {mockSites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label htmlFor="posteId">Poste *</Label>
            <Select
              value={formData.posteId}
              onValueChange={(value) =>
                setFormData({ ...formData, posteId: value })
              }
              disabled={!formData.siteId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un poste" />
              </SelectTrigger>
              <SelectContent>
                {availablePostes.map((poste) => (
                  <SelectItem key={poste.id} value={poste.id}>
                    {poste.name} ({poste.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="startTime">Heure de début *</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="endTime">Heure de fin *</Label>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
              required
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="breakDuration">Pause (minutes)</Label>
            <Input
              id="breakDuration"
              type="number"
              min="0"
              value={formData.breakDuration || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  breakDuration: parseInt(e.target.value) || undefined,
                })
              }
              placeholder="30"
            />
          </div>

          <div className="col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Notes ou instructions spéciales"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={
              !formData.agentId || !formData.siteId || !formData.posteId
            }
          >
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// Template Modal Component
function TemplateModal({
  open,
  onClose,
  templates,
}: {
  open: boolean;
  onClose: () => void;
  templates: ScheduleTemplate[];
}) {
  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title="Templates de planning"
      type="details"
      size="lg"
    >
      <div className="space-y-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="p-4 border rounded-lg hover:border-primary transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold">{template.name}</h4>
                {template.description && (
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                )}
              </div>
              <Badge variant={template.active ? "outline" : "default"}>
                {template.active ? "Actif" : "Inactif"}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                Récurrence:{" "}
                {template.recurrence === "daily"
                  ? "Quotidien"
                  : template.recurrence === "weekly"
                    ? "Hebdomadaire"
                    : "Mensuel"}
              </span>
              <span>•</span>
              <span>{template.assignments.length} affectation(s)</span>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline">
                <Eye className="h-3 w-3 mr-1" />
                Voir
              </Button>
              <Button size="sm" variant="outline">
                <Copy className="h-3 w-3 mr-1" />
                Appliquer
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

// Auto Schedule Modal Component
function AutoScheduleModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split("T")[0];
  });

  return (
    <Modal
      open={open}
      onOpenChange={onClose}
      title="Génération automatique de planning"
      type="form"
      size="lg"
    >
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <Sparkles className="h-4 w-4 inline mr-1" />
            L&apos;algorithme va générer un planning optimisé en tenant compte
            des qualifications, disponibilités et contraintes horaires.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Date de début *</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="endDate">Date de fin *</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Options</Label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span className="text-sm">Prioriser les qualifications</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span className="text-sm">
                Prioriser le coût (agents juniors)
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span className="text-sm">
                Autoriser les heures supplémentaires
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="button">
            <Sparkles className="mr-2 h-4 w-4" />
            Générer le planning
          </Button>
        </div>
      </div>
    </Modal>
  );
}
