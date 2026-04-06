"use client";

import { useState, useEffect, useRef } from "react";
import { AlertTriangle, MapPin, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type {
  PatrolRoute,
  PatrolCheckpoint,
  CheckpointType,
  PatrolFrequency,
} from "@/data/geolocation-patrols";
import {
  PATROL_FREQUENCIES,
  CHECKPOINT_TYPE_CONFIG,
  computeRouteDistance,
} from "@/data/geolocation-patrols";
import { cn } from "@/lib/utils";

// ── Constants ───────────────────────────────────────────────────────

export const PATROL_SITES = [
  "Centre Commercial Rosny 2",
  "Siège Social La Défense",
  "Entrepôt Logistique Gennevilliers",
];

const SITE_CENTER_COORDS: Record<string, [number, number]> = {
  "Centre Commercial Rosny 2": [2.352, 48.857],
  "Siège Social La Défense": [2.236, 48.893],
  "Entrepôt Logistique Gennevilliers": [2.298, 48.933],
};

const CHECKPOINT_TYPES: CheckpointType[] = ["GPS", "QR", "NFC"];

// ── Props ───────────────────────────────────────────────────────────

interface PatrolRouteFormPanelProps {
  editingRoute: PatrolRoute | null;
  site: string;
  onSiteChange: (site: string) => void;
  checkpoints: PatrolCheckpoint[];
  selectedCheckpointId: string | null;
  checkpointWarnings: Set<string>;
  onCheckpointsChange: (checkpoints: PatrolCheckpoint[]) => void;
  onSelectedCheckpointChange: (id: string | null) => void;
  onSave: (route: PatrolRoute) => void;
  onCancel: () => void;
}

// ── Component ───────────────────────────────────────────────────────

export function PatrolRouteFormPanel({
  editingRoute,
  site,
  onSiteChange,
  checkpoints,
  selectedCheckpointId,
  checkpointWarnings,
  onCheckpointsChange,
  onSelectedCheckpointChange,
  onSave,
  onCancel,
}: PatrolRouteFormPanelProps) {
  const [name, setName] = useState(editingRoute?.name ?? "");
  const [frequency, setFrequency] = useState<PatrolFrequency>(
    editingRoute?.frequency ?? "Quotidienne",
  );

  // ── Derived-state resets (React "storing previous props" pattern) ──
  const [prevRouteId, setPrevRouteId] = useState<string | null | undefined>(
    editingRoute?.id,
  );

  if (editingRoute?.id !== prevRouteId) {
    setPrevRouteId(editingRoute?.id);
    if (editingRoute) {
      setName(editingRoute.name);
      setFrequency(editingRoute.frequency);
    } else {
      setName("");
      setFrequency("Quotidienne");
    }
  }

  // ── Refs for scroll-to-checkpoint ──────────────────────────────────
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (!selectedCheckpointId) return;
    const el = cardRefs.current.get(selectedCheckpointId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedCheckpointId]);

  // ── Checkpoint handlers ───────────────────────────────────────────

  const updateCheckpoint = (
    index: number,
    updates: Partial<PatrolCheckpoint>,
  ) => {
    onCheckpointsChange(
      checkpoints.map((cp, i) => (i === index ? { ...cp, ...updates } : cp)),
    );
  };

  const removeCheckpoint = (index: number) => {
    const updated = checkpoints
      .filter((_, i) => i !== index)
      .map((cp, i) => ({ ...cp, order: i + 1 }));
    onCheckpointsChange(updated);
    if (checkpoints[index]?.id === selectedCheckpointId) {
      onSelectedCheckpointChange(null);
    }
  };

  // ── Add point handler ─────────────────────────────────────────────

  const handleAddPoint = () => {
    const lastCp = checkpoints[checkpoints.length - 1];
    const baseCoords: [number, number] = lastCp
      ? [lastCp.coords[0] + 0.0005, lastCp.coords[1] + 0.0003]
      : (SITE_CENTER_COORDS[site] ?? [2.35, 48.86]);

    const newCp: PatrolCheckpoint = {
      id: crypto.randomUUID(),
      name: "",
      coords: baseCoords,
      type: "GPS",
      expectedMinutes: lastCp ? lastCp.expectedMinutes + 8 : 0,
      toleranceMinutes: 2,
      order: checkpoints.length + 1,
    };

    onCheckpointsChange([...checkpoints, newCp]);
    onSelectedCheckpointChange(newCp.id);
  };

  // ── Save handler ──────────────────────────────────────────────────

  const handleSave = () => {
    if (!name || checkpoints.length === 0) return;

    const route: PatrolRoute = {
      id: editingRoute?.id ?? crypto.randomUUID(),
      name,
      site,
      frequency,
      checkpoints,
      estimatedDurationMinutes:
        checkpoints.length > 0
          ? Math.max(...checkpoints.map((cp) => cp.expectedMinutes))
          : 0,
      distanceMeters: Math.round(computeRouteDistance(checkpoints)),
      createdAt: editingRoute?.createdAt ?? new Date().toISOString(),
    };

    onSave(route);
  };

  const hasSite = site !== "";
  const warningCount = checkpointWarnings.size;

  // ── Render ────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Nom */}
        <div className="space-y-1.5">
          <Label htmlFor="route-name">Nom</Label>
          <Input
            id="route-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex : Ronde Extérieure Rosny 2"
            className="h-8 text-xs"
          />
        </div>

        {/* Site */}
        <div className="space-y-1.5">
          <Label>Site</Label>
          <Select value={site} onValueChange={onSiteChange}>
            <SelectTrigger className="h-8 text-xs w-full">
              <SelectValue placeholder="Sélectionner un site" />
            </SelectTrigger>
            <SelectContent>
              {PATROL_SITES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fréquence */}
        <div className="space-y-1.5">
          <Label>Fréquence</Label>
          <Select
            value={frequency}
            onValueChange={(v) => setFrequency(v as PatrolFrequency)}
          >
            <SelectTrigger className="h-8 text-xs w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PATROL_FREQUENCIES.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Points de contrôle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Points de contrôle</Label>
            {warningCount > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-amber-400">
                <AlertTriangle className="h-3 w-3" />
                {warningCount} hors zone
              </span>
            )}
          </div>

          {!hasSite ? (
            /* ── No site selected: locked state ── */
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/50 py-8 text-center">
              <MapPin className="h-6 w-6 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">
                Sélectionnez d&apos;abord un site pour placer des points
              </p>
            </div>
          ) : (
            <>
              {/* Instruction banner */}
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-cyan-500/30 bg-cyan-500/5 p-2.5">
                <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
                <p className="text-[11px] text-muted-foreground">
                  Cliquez sur la carte pour ajouter un point de contrôle
                </p>
              </div>

              {/* Checkpoint cards */}
              {checkpoints.map((cp, index) => {
                const isExpanded = selectedCheckpointId === cp.id;
                const typeConfig = CHECKPOINT_TYPE_CONFIG[cp.type];
                const hasWarning = checkpointWarnings.has(cp.id);

                return (
                  <div
                    key={cp.id}
                    ref={(el) => {
                      if (el) cardRefs.current.set(cp.id, el);
                      else cardRefs.current.delete(cp.id);
                    }}
                    data-checkpoint-id={cp.id}
                    className={cn(
                      "relative rounded-lg border transition-all duration-150",
                      isExpanded
                        ? hasWarning
                          ? "border-amber-500/40 bg-amber-500/5"
                          : "border-cyan-500/40 bg-cyan-500/5"
                        : "border-border/50 bg-muted/20 hover:border-border hover:bg-muted/30 cursor-pointer",
                    )}
                    onClick={() => {
                      if (!isExpanded) onSelectedCheckpointChange(cp.id);
                    }}
                  >
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCheckpoint(index);
                      }}
                      className="absolute top-2 right-2 h-5 w-5 flex items-center justify-center rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors z-10"
                      aria-label={`Supprimer le point ${cp.order}`}
                    >
                      <X className="h-3 w-3" />
                    </button>

                    {isExpanded ? (
                      /* ── Expanded card ── */
                      <div className="p-3 space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shrink-0"
                            style={{ backgroundColor: typeConfig.color }}
                          >
                            {cp.order}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground">
                            Point {cp.order}
                          </span>
                          {hasWarning && (
                            <span className="ml-auto flex items-center gap-1 text-[10px] text-amber-400 pr-6">
                              <AlertTriangle className="h-3 w-3" />
                              Hors zone du site
                            </span>
                          )}
                        </div>

                        {hasWarning && (
                          <div className="flex items-start gap-2 rounded-md bg-amber-500/10 border border-amber-500/20 p-2">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-amber-300/90 leading-relaxed">
                              Ce point est en dehors des zones définies pour{" "}
                              <span className="font-medium">{site}</span>.
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                          {/* Name */}
                          <div className="col-span-2 space-y-1">
                            <Label className="text-[10px]">Nom</Label>
                            <Input
                              value={cp.name}
                              onChange={(e) =>
                                updateCheckpoint(index, {
                                  name: e.target.value,
                                })
                              }
                              placeholder="Nom du point"
                              className="h-8 text-xs"
                              autoFocus
                            />
                          </div>

                          {/* Type */}
                          <div className="space-y-1">
                            <Label className="text-[10px]">Type</Label>
                            <Select
                              value={cp.type}
                              onValueChange={(v) =>
                                updateCheckpoint(index, {
                                  type: v as CheckpointType,
                                })
                              }
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CHECKPOINT_TYPES.map((t) => (
                                  <SelectItem key={t} value={t}>
                                    {t}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Temps estimé */}
                          <div className="space-y-1">
                            <Label className="text-[10px]">
                              Temps estimé (min)
                            </Label>
                            <Input
                              type="number"
                              min={0}
                              value={cp.expectedMinutes}
                              onChange={(e) =>
                                updateCheckpoint(index, {
                                  expectedMinutes: Number(e.target.value),
                                })
                              }
                              className="h-8 text-xs"
                            />
                          </div>

                          {/* Tolérance */}
                          <div className="space-y-1">
                            <Label className="text-[10px]">
                              Tolérance (min)
                            </Label>
                            <Input
                              type="number"
                              min={0}
                              value={cp.toleranceMinutes}
                              onChange={(e) =>
                                updateCheckpoint(index, {
                                  toleranceMinutes: Number(e.target.value),
                                })
                              }
                              className="h-8 text-xs"
                            />
                          </div>

                          {/* Coords (read-only) */}
                          <div className="col-span-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span>
                              {cp.coords[1].toFixed(5)},{" "}
                              {cp.coords[0].toFixed(5)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* ── Collapsed card ── */
                      <div className="flex items-center gap-2.5 p-2 pr-8">
                        <span
                          className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shrink-0"
                          style={{ backgroundColor: typeConfig.color }}
                        >
                          {cp.order}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">
                            {cp.name || "Sans nom"}
                          </p>
                        </div>
                        {hasWarning && (
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        )}
                        <Badge
                          variant="muted"
                          className="text-[9px] px-1.5 py-0 shrink-0"
                          style={{
                            borderColor: `${typeConfig.color}40`,
                            color: typeConfig.color,
                          }}
                        >
                          {typeConfig.label}
                        </Badge>
                      </div>
                    )}
                  </div>
                );
              })}

              {checkpoints.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MapPin className="h-6 w-6 text-muted-foreground/30 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Aucun point ajouté
                  </p>
                </div>
              )}

              {/* Add point button */}
              <button
                type="button"
                onClick={handleAddPoint}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 py-2 text-xs text-muted-foreground hover:border-cyan-500/40 hover:text-cyan-400 hover:bg-cyan-500/5 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Ajouter un point
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="shrink-0 p-3 border-t border-border/50 flex gap-2">
        <Button
          size="sm"
          className="flex-1"
          onClick={handleSave}
          disabled={!name || !hasSite || checkpoints.length === 0}
        >
          Enregistrer
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          Annuler
        </Button>
      </div>
    </div>
  );
}
