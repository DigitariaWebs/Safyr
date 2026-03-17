"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  computeRouteDistance,
} from "@/data/geolocation-patrols";

// ── Constants ───────────────────────────────────────────────────────

const SITES = [
  "Centre Commercial Rosny 2",
  "Siège Social La Défense",
  "Entrepôt Logistique Gennevilliers",
];

const CHECKPOINT_TYPES: CheckpointType[] = ["GPS", "QR", "NFC"];

// ── Props ───────────────────────────────────────────────────────────

interface PatrolRouteFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRoute: PatrolRoute | null;
  onSave: (route: PatrolRoute) => void;
}

// ── Default checkpoint factory ──────────────────────────────────────

function createEmptyCheckpoint(order: number): PatrolCheckpoint {
  return {
    id: crypto.randomUUID(),
    name: "",
    coords: [2.35, 48.86],
    type: "GPS",
    expectedMinutes: 0,
    toleranceMinutes: 2,
    order,
  };
}

// ── Component ───────────────────────────────────────────────────────

export function PatrolRouteFormModal({
  open,
  onOpenChange,
  editingRoute,
  onSave,
}: PatrolRouteFormModalProps) {
  const [name, setName] = useState(editingRoute?.name ?? "");
  const [site, setSite] = useState(editingRoute?.site ?? "");
  const [frequency, setFrequency] = useState<PatrolFrequency>(
    editingRoute?.frequency ?? "Quotidienne",
  );
  const [checkpoints, setCheckpoints] = useState<PatrolCheckpoint[]>(
    editingRoute?.checkpoints ?? [createEmptyCheckpoint(1)],
  );

  // ── Derived-state resets (React "storing previous props" pattern) ──
  const [prevRouteId, setPrevRouteId] = useState<string | null | undefined>(
    editingRoute?.id,
  );
  const [prevOpen, setPrevOpen] = useState(open);

  if (editingRoute?.id !== prevRouteId || open !== prevOpen) {
    setPrevRouteId(editingRoute?.id);
    setPrevOpen(open);

    if (open && editingRoute) {
      setName(editingRoute.name);
      setSite(editingRoute.site);
      setFrequency(editingRoute.frequency);
      setCheckpoints(editingRoute.checkpoints);
    } else if (open && !editingRoute) {
      setName("");
      setSite("");
      setFrequency("Quotidienne");
      setCheckpoints([createEmptyCheckpoint(1)]);
    }
  }

  // ── Checkpoint handlers ───────────────────────────────────────────

  const updateCheckpoint = (
    index: number,
    updates: Partial<PatrolCheckpoint>,
  ) => {
    setCheckpoints((prev) =>
      prev.map((cp, i) => (i === index ? { ...cp, ...updates } : cp)),
    );
  };

  const addCheckpoint = () => {
    setCheckpoints((prev) => [...prev, createEmptyCheckpoint(prev.length + 1)]);
  };

  const removeCheckpoint = (index: number) => {
    setCheckpoints((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((cp, i) => ({ ...cp, order: i + 1 })),
    );
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

  // ── Render ────────────────────────────────────────────────────────

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      type="form"
      size="xl"
      title={editingRoute ? "Modifier l'itinéraire" : "Nouvel itinéraire"}
      actions={{
        primary: {
          label: "Enregistrer",
          onClick: handleSave,
          disabled: !name || checkpoints.length === 0,
        },
        secondary: {
          label: "Annuler",
          onClick: () => onOpenChange(false),
        },
      }}
    >
      <div className="space-y-5">
        {/* Nom */}
        <div className="space-y-1.5">
          <Label htmlFor="route-name">Nom</Label>
          <Input
            id="route-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex : Ronde Extérieure Rosny 2"
          />
        </div>

        {/* Site */}
        <div className="space-y-1.5">
          <Label>Site</Label>
          <Select value={site} onValueChange={setSite}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un site" />
            </SelectTrigger>
            <SelectContent>
              {SITES.map((s) => (
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
            <SelectTrigger className="w-full">
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

        {/* Checkpoints */}
        <div className="space-y-3">
          <Label>Points de contrôle</Label>

          {checkpoints.map((cp, index) => (
            <div
              key={cp.id}
              className="relative rounded-lg border border-border/50 bg-muted/20 p-3 space-y-2"
            >
              {/* Remove button */}
              {checkpoints.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCheckpoint(index)}
                  className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label={`Supprimer le point ${cp.order}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}

              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold shrink-0">
                  {index + 1}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  Point {index + 1}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Name */}
                <div className="col-span-2 space-y-1">
                  <Label className="text-[10px]">Nom</Label>
                  <Input
                    value={cp.name}
                    onChange={(e) =>
                      updateCheckpoint(index, { name: e.target.value })
                    }
                    placeholder="Nom du point"
                    className="h-8 text-xs"
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
                  <Label className="text-[10px]">Temps estimé (min)</Label>
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

                {/* Longitude */}
                <div className="space-y-1">
                  <Label className="text-[10px]">Longitude</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={cp.coords[0]}
                    onChange={(e) =>
                      updateCheckpoint(index, {
                        coords: [Number(e.target.value), cp.coords[1]],
                      })
                    }
                    className="h-8 text-xs"
                  />
                </div>

                {/* Latitude */}
                <div className="space-y-1">
                  <Label className="text-[10px]">Latitude</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={cp.coords[1]}
                    onChange={(e) =>
                      updateCheckpoint(index, {
                        coords: [cp.coords[0], Number(e.target.value)],
                      })
                    }
                    className="h-8 text-xs"
                  />
                </div>

                {/* Tolérance */}
                <div className="space-y-1">
                  <Label className="text-[10px]">Tolérance (min)</Label>
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
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={addCheckpoint}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Ajouter un point de contrôle
          </Button>
        </div>
      </div>
    </Modal>
  );
}
