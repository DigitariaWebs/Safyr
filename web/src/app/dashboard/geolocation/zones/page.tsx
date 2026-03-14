"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { ZoneMap } from "@/components/geolocation/ZoneMap";
import { ZoneListSidebar } from "@/components/geolocation/ZoneListSidebar";
import { ZoneFormModal } from "@/components/geolocation/ZoneFormModal";
import { ZoneDetailModal } from "@/components/geolocation/ZoneDetailModal";
import {
  GeoZone,
  ZoneShape,
  ZONE_TYPES,
  ZONE_TYPE_COLORS,
  mockGeolocationZones,
} from "@/data/geolocation-zones";

export default function ZonesPage() {
  const [zones, setZones] = useState<GeoZone[]>(mockGeolocationZones);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<GeoZone | null>(null);
  const [drawingMode, setDrawingMode] = useState<
    "none" | "circle" | "polygon"
  >("none");
  const [pendingShape, setPendingShape] = useState<ZoneShape | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GeoZone | null>(null);
  const [detailZone, setDetailZone] = useState<GeoZone | null>(null);

  // ── Filtering ──────────────────────────────────────────────────────

  const filteredZones = useMemo(() => {
    return zones.filter((z) => {
      if (typeFilter !== "all" && z.type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !z.name.toLowerCase().includes(q) &&
          !z.site.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [zones, typeFilter, search]);

  const typeCounts = useMemo(() => {
    return zones.reduce(
      (acc, z) => ({ ...acc, [z.type]: (acc[z.type] || 0) + 1 }),
      {} as Record<string, number>,
    );
  }, [zones]);

  // ── Drawing flow ───────────────────────────────────────────────────

  const handleStartDrawing = (mode: "circle" | "polygon") => {
    setIsFormOpen(false);
    setDrawingMode(mode);
  };

  const handleDrawComplete = (shape: ZoneShape) => {
    setPendingShape(shape);
    setDrawingMode("none");
    setIsFormOpen(true);
  };

  const handleDrawCancel = () => {
    setDrawingMode("none");
    setIsFormOpen(true);
  };

  // ── CRUD ───────────────────────────────────────────────────────────

  const handleCreateZone = () => {
    setEditingZone(null);
    setPendingShape(null);
    setIsFormOpen(true);
  };

  const handleEditZone = (zone: GeoZone) => {
    setEditingZone(zone);
    setPendingShape(zone.shape);
    setIsFormOpen(true);
  };

  const handleSave = (data: Omit<GeoZone, "id" | "createdAt">) => {
    if (editingZone) {
      setZones((prev) =>
        prev.map((z) => (z.id === editingZone.id ? { ...z, ...data } : z)),
      );
    } else {
      setZones((prev) => [
        ...prev,
        { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
      ]);
    }
    setIsFormOpen(false);
    setEditingZone(null);
    setPendingShape(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setZones((prev) => prev.filter((z) => z.id !== deleteTarget.id));
    if (selectedZoneId === deleteTarget.id) setSelectedZoneId(null);
    setDeleteTarget(null);
  };

  const handleZoneClick = (zone: GeoZone) => {
    setSelectedZoneId(zone.id);
  };

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Zones Géo-fencées
          </h1>
          <p className="text-sm text-muted-foreground">
            {filteredZones.length} zone
            {filteredZones.length > 1 ? "s" : ""} configurée
            {filteredZones.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Toolbar: type filter pills */}
      <div
        className="flex items-center gap-2 flex-wrap"
        role="toolbar"
        aria-label="Filtres"
      >
        <div
          className="flex gap-1"
          role="group"
          aria-label="Filtrer par type"
        >
          <button
            onClick={() => setTypeFilter("all")}
            aria-pressed={typeFilter === "all"}
            className={cn(
              "h-8 px-3 text-xs rounded-md border transition-colors",
              typeFilter === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-input text-muted-foreground hover:bg-accent",
            )}
          >
            Tous{" "}
            <span
              className="ml-1 opacity-60 tabular-nums"
              aria-hidden="true"
            >
              {zones.length}
            </span>
          </button>
          {ZONE_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              aria-pressed={typeFilter === type}
              className={cn(
                "h-8 px-3 text-xs rounded-md border transition-colors flex items-center gap-1.5",
                typeFilter === type
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input text-muted-foreground hover:bg-accent",
              )}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: ZONE_TYPE_COLORS[type] }}
                aria-hidden="true"
              />
              {type}
              <span className="opacity-60 tabular-nums" aria-hidden="true">
                {typeCounts[type] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid: 60/40 split */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 flex-1 min-h-0">
        <ZoneMap
          zones={filteredZones}
          selectedZoneId={selectedZoneId}
          onZoneClick={handleZoneClick}
          drawingMode={drawingMode}
          onDrawComplete={handleDrawComplete}
          onDrawCancel={handleDrawCancel}
          className="col-span-1 lg:col-span-3 min-h-[40vh] lg:min-h-0"
        />
        <ZoneListSidebar
          zones={filteredZones}
          selectedZoneId={selectedZoneId}
          onZoneSelect={handleZoneClick}
          onZoneEdit={handleEditZone}
          onZoneDelete={setDeleteTarget}
          onZoneDetails={setDetailZone}
          onCreateZone={handleCreateZone}
          search={search}
          onSearchChange={setSearch}
          className="col-span-1 lg:col-span-2"
        />
      </div>

      {/* Zone detail modal */}
      <ZoneDetailModal
        open={!!detailZone}
        onOpenChange={(open) => !open && setDetailZone(null)}
        zone={detailZone}
        onEdit={(zone) => {
          setDetailZone(null);
          handleEditZone(zone);
        }}
        onDelete={(zone) => {
          setDetailZone(null);
          setDeleteTarget(zone);
        }}
      />

      {/* Zone form modal */}
      <ZoneFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        zone={editingZone}
        pendingShape={pendingShape}
        onSave={handleSave}
        onStartDrawing={handleStartDrawing}
      />

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        type="warning"
        title="Supprimer la zone"
        description={`Voulez-vous vraiment supprimer la zone "${deleteTarget?.name}" ? Cette action est irréversible.`}
        actions={{
          primary: {
            label: "Supprimer",
            onClick: handleDelete,
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
