"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { PanelRight, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatrolMap } from "@/components/geolocation/PatrolMap";
import { PatrolRouteSidebar } from "@/components/geolocation/PatrolRouteSidebar";
import { PatrolRouteFormModal } from "@/components/geolocation/PatrolRouteFormModal";
import { PatrolExecutionSidebar } from "@/components/geolocation/PatrolExecutionSidebar";
import { PatrolHistoryPanel } from "@/components/geolocation/PatrolHistoryPanel";
import type { PatrolRoute, PatrolExecution } from "@/data/geolocation-patrols";
import {
  mockPatrolRoutes,
  mockPatrolExecutions,
  getRouteById,
} from "@/data/geolocation-patrols";
import { mockGeolocationZones } from "@/data/geolocation-zones";

// ── Tab type ────────────────────────────────────────────────────────

type PatrolTab = "itineraires" | "en-cours" | "historique";

// ── Page component ──────────────────────────────────────────────────

export default function RoundsPage() {
  // ── Data state ──────────────────────────────────────────────────
  const [routes, setRoutes] = useState<PatrolRoute[]>(mockPatrolRoutes);
  const [executions] = useState<PatrolExecution[]>(mockPatrolExecutions);

  // ── Tab & selection state ───────────────────────────────────────
  const [activeTab, setActiveTab] = useState<PatrolTab>("itineraires");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(
    null,
  );
  const [sidebarView, setSidebarView] = useState<"list" | "detail">("list");

  // ── Form state ──────────────────────────────────────────────────
  const [formOpen, setFormOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<PatrolRoute | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PatrolRoute | null>(null);

  // ── UI state ────────────────────────────────────────────────────
  const [showSidebar, setShowSidebar] = useState(true);
  const [showNav, setShowNav] = useState(true);
  const [showZones, setShowZones] = useState(false);

  // ── Replay state ────────────────────────────────────────────────
  const [replayProgress, setReplayProgress] = useState(0);
  const [isReplaying, setIsReplaying] = useState(false);
  const replayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Replay timer ────────────────────────────────────────────────
  useEffect(() => {
    if (isReplaying) {
      replayRef.current = setInterval(() => {
        setReplayProgress((prev) => {
          if (prev >= 1) {
            setIsReplaying(false);
            return 1;
          }
          return Math.min(prev + 0.005, 1);
        });
      }, 50);
    } else if (replayRef.current) {
      clearInterval(replayRef.current);
      replayRef.current = null;
    }
    return () => {
      if (replayRef.current) clearInterval(replayRef.current);
    };
  }, [isReplaying]);

  // ── Derived data ────────────────────────────────────────────────

  const selectedRoute = useMemo(
    () =>
      selectedRouteId ? (getRouteById(routes, selectedRouteId) ?? null) : null,
    [routes, selectedRouteId],
  );

  const selectedExecution = useMemo(
    () =>
      selectedExecutionId
        ? (executions.find((e) => e.id === selectedExecutionId) ?? null)
        : null,
    [executions, selectedExecutionId],
  );

  const selectedExecutionRoute = useMemo(
    () =>
      selectedExecution
        ? (getRouteById(routes, selectedExecution.routeId) ?? null)
        : null,
    [selectedExecution, routes],
  );

  // ── Handlers ────────────────────────────────────────────────────

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab as PatrolTab);
    setSidebarView("list");
    setSelectedRouteId(null);
    setSelectedExecutionId(null);
    setReplayProgress(0);
    setIsReplaying(false);
  }, []);

  const handleCreateRoute = useCallback(() => {
    setEditingRoute(null);
    setFormOpen(true);
  }, []);

  const handleEditRoute = useCallback((route: PatrolRoute) => {
    setEditingRoute(route);
    setFormOpen(true);
  }, []);

  const handleViewRouteDetail = useCallback((route: PatrolRoute) => {
    setSelectedRouteId(route.id);
    setSidebarView("detail");
  }, []);

  const handleSaveRoute = useCallback(
    (route: PatrolRoute) => {
      if (editingRoute) {
        setRoutes((prev) => prev.map((r) => (r.id === route.id ? route : r)));
      } else {
        setRoutes((prev) => [...prev, route]);
      }
      setFormOpen(false);
      setEditingRoute(null);
    },
    [editingRoute],
  );

  const handleDeleteRoute = useCallback(() => {
    if (!deleteTarget) return;
    setRoutes((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    if (selectedRouteId === deleteTarget.id) {
      setSelectedRouteId(null);
      setSidebarView("list");
    }
    setDeleteTarget(null);
  }, [deleteTarget, selectedRouteId]);

  const handleSelectExecution = useCallback(
    (id: string) => {
      if (!id) {
        // Back from detail
        setSelectedExecutionId(null);
        setSidebarView("list");
        setReplayProgress(0);
        setIsReplaying(false);
        return;
      }
      setSelectedExecutionId(id);
      setSidebarView("detail");
      if (activeTab === "historique") {
        setReplayProgress(0);
        setIsReplaying(false);
      }
    },
    [activeTab],
  );

  const handleToggleReplay = useCallback(() => {
    setIsReplaying((prev) => {
      if (!prev && replayProgress >= 1) {
        setReplayProgress(0);
      }
      return !prev;
    });
  }, [replayProgress]);

  // ── Map props based on active tab ──────────────────────────────

  const mapProps = useMemo(() => {
    if (activeTab === "itineraires" && selectedRoute) {
      return {
        routeCheckpoints: selectedRoute.checkpoints,
        route: selectedRoute,
      };
    }
    if (activeTab === "en-cours" && selectedExecution) {
      return {
        execution: selectedExecution,
        route: selectedExecutionRoute,
        routeCheckpoints: selectedExecutionRoute?.checkpoints,
      };
    }
    if (activeTab === "historique" && selectedExecution) {
      return {
        execution: selectedExecution,
        route: selectedExecutionRoute,
        routeCheckpoints: selectedExecutionRoute?.checkpoints,
        replayProgress,
      };
    }
    return {};
  }, [
    activeTab,
    selectedRoute,
    selectedExecution,
    selectedExecutionRoute,
    replayProgress,
  ]);

  // ── Sidebar content renderer ──────────────────────────────────

  const renderSidebarContent = () => {
    if (activeTab === "itineraires") {
      return (
        <PatrolRouteSidebar
          routes={routes}
          selectedRouteId={selectedRouteId}
          onSelectRoute={(id) => {
            setSelectedRouteId(id);
            setSidebarView("list");
          }}
          onCreateRoute={handleCreateRoute}
          onEditRoute={handleEditRoute}
          onDeleteRoute={setDeleteTarget}
          onViewDetail={handleViewRouteDetail}
          sidebarView={sidebarView}
          onBackToList={() => setSidebarView("list")}
        />
      );
    }

    if (activeTab === "en-cours") {
      return (
        <PatrolExecutionSidebar
          executions={executions}
          selectedExecutionId={selectedExecutionId}
          onSelectExecution={handleSelectExecution}
          sidebarView={sidebarView}
          onBackToList={() => {
            setSelectedExecutionId(null);
            setSidebarView("list");
          }}
        />
      );
    }

    if (activeTab === "historique") {
      return (
        <PatrolHistoryPanel
          executions={executions}
          selectedExecutionId={selectedExecutionId}
          onSelectExecution={handleSelectExecution}
          replayProgress={replayProgress}
          onReplayProgressChange={setReplayProgress}
          isReplaying={isReplaying}
          onToggleReplay={handleToggleReplay}
        />
      );
    }

    return null;
  };

  // ── Sidebar label ─────────────────────────────────────────────

  const sidebarLabel =
    activeTab === "itineraires"
      ? "Itinéraires"
      : activeTab === "en-cours"
        ? "En cours"
        : "Historique";

  // ── Sidebar width ─────────────────────────────────────────────

  const sidebarWidth =
    activeTab === "historique" && !selectedExecutionId ? "w-[540px]" : "w-96";

  // ── Render ──────────────────────────────────────────────────────

  return (
    <div className="relative h-full">
      {/* Full-page map */}
      <PatrolMap
        className="absolute inset-0"
        {...mapProps}
        allRoutes={routes}
        zones={mockGeolocationZones}
        showZones={showZones}
        onToggleZones={() => setShowZones((prev) => !prev)}
      />

      {/* ── Top-left: tab selector overlay ──────────────────────── */}
      {showNav && (
        <div className="absolute top-3 left-3 z-10 bg-background/80 backdrop-blur-md border border-border/50 rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="itineraires">Itinéraires</TabsTrigger>
                <TabsTrigger value="en-cours">En cours</TabsTrigger>
                <TabsTrigger value="historique">Historique</TabsTrigger>
              </TabsList>
            </Tabs>
            <button
              onClick={() => setShowNav(false)}
              className="ml-2 h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground"
              aria-label="Masquer les onglets"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Nav toggle (when nav is hidden) */}
      {!showNav && (
        <button
          onClick={() => setShowNav(true)}
          className="absolute top-3 left-3 z-10 bg-background/80 backdrop-blur-md border border-border/50 rounded-xl p-2.5 shadow-lg"
          aria-label="Afficher les onglets"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      )}

      {/* ── Desktop sidebar (right side) ──────────────────────── */}
      {showSidebar && (
        <div
          className={cn(
            "hidden lg:flex absolute top-3 right-3 bottom-3 z-10 flex-col bg-background/80 backdrop-blur-md border border-border/50 rounded-xl shadow-lg overflow-hidden transition-all",
            sidebarWidth,
          )}
        >
          {/* Sidebar header with dismiss */}
          <div className="flex items-center justify-between px-3 pt-2.5 pb-1 shrink-0">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {sidebarLabel}
            </span>
            <button
              onClick={() => setShowSidebar(false)}
              className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground"
              aria-label="Masquer le panneau"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          {renderSidebarContent()}
        </div>
      )}

      {/* Sidebar toggle (desktop, when sidebar is hidden) */}
      {!showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          className="hidden lg:flex absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-md border border-border/50 rounded-xl p-2.5 shadow-lg"
          aria-label="Afficher le panneau"
        >
          <PanelRight className="h-4 w-4" />
        </button>
      )}

      {/* ── Mobile sidebar (Sheet) ────────────────────────────── */}
      <Sheet>
        <SheetTrigger asChild>
          <button className="lg:hidden absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-md border border-border/50 rounded-xl p-2.5 shadow-lg">
            <PanelRight className="h-4 w-4" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-96 p-0">
          {renderSidebarContent()}
        </SheetContent>
      </Sheet>

      {/* ── Route form modal ──────────────────────────────────── */}
      <PatrolRouteFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        editingRoute={editingRoute}
        onSave={handleSaveRoute}
      />

      {/* ── Delete confirmation modal ─────────────────────────── */}
      <Modal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        type="warning"
        title="Supprimer l'itinéraire"
        description={`Voulez-vous vraiment supprimer l'itinéraire "${deleteTarget?.name}" ? Cette action est irréversible.`}
        actions={{
          primary: {
            label: "Supprimer",
            onClick: handleDeleteRoute,
            variant: "destructive",
          },
          secondary: {
            label: "Annuler",
            onClick: () => setDeleteTarget(null),
          },
        }}
      >
        <div />
      </Modal>
    </div>
  );
}
