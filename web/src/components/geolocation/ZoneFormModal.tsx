"use client";

import { useState, useEffect, useRef } from "react";
import { Circle, Pentagon } from "lucide-react";
import { ZonePreviewMap } from "@/components/geolocation/ZonePreviewMap";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type {
  GeoZone,
  ZoneShape,
  ZoneType,
  ZoneAlertRules,
} from "@/data/geolocation-zones";
import { ZONE_TYPES, ALERT_LABELS } from "@/data/geolocation-zones";

// ── Constants ───────────────────────────────────────────────────────

const PRESET_COLORS = [
  "#22d3ee",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#10b981",
  "#3b82f6",
];

const SITES = [
  "Centre Commercial Rosny 2",
  "Siège Social La Défense",
  "Entrepôt Logistique Gennevilliers",
];

// ── Props ───────────────────────────────────────────────────────────

interface ZoneFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zone: GeoZone | null;
  pendingShape: ZoneShape | null;
  onSave: (data: Omit<GeoZone, "id" | "createdAt">) => void;
  onStartDrawing: (mode: "circle" | "polygon") => void;
}

// ── Component ───────────────────────────────────────────────────────

export function ZoneFormModal({
  open,
  onOpenChange,
  zone,
  pendingShape,
  onSave,
  onStartDrawing,
}: ZoneFormModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ZoneType>("Site client");
  const [site, setSite] = useState("");
  const [color, setColor] = useState("#22d3ee");
  const [shape, setShape] = useState<ZoneShape | null>(null);
  const [alerts, setAlerts] = useState<ZoneAlertRules>({
    entry: true,
    exit: true,
    absence: false,
    parking: false,
  });

  // Track whether the modal was closed for drawing (to preserve form state)
  const isDrawingRef = useRef(false);

  // Pre-populate in edit mode
  useEffect(() => {
    if (open && zone) {
      setName(zone.name);
      setType(zone.type);
      setSite(zone.site);
      setColor(zone.color);
      setShape(zone.shape);
      setAlerts(zone.alerts);
    }
  }, [zone?.id, open]);

  // Merge pending shape from map drawing
  useEffect(() => {
    if (pendingShape) {
      setShape(pendingShape);
    }
  }, [pendingShape]);

  // Reset form on create-mode dismiss (but not when closing for drawing)
  useEffect(() => {
    if (!open && !zone && !isDrawingRef.current) {
      setName("");
      setType("Site client");
      setSite("");
      setColor("#22d3ee");
      setShape(null);
      setAlerts({ entry: true, exit: true, absence: false, parking: false });
    }
    if (open) {
      isDrawingRef.current = false;
    }
  }, [open, zone]);

  const handleStartDrawing = (mode: "circle" | "polygon") => {
    isDrawingRef.current = true;
    onStartDrawing(mode);
  };

  const handleSave = () => {
    if (!name || !shape) return;
    onSave({ name, type, site, color, shape, alerts });
  };

  const toggleAlert = (key: keyof ZoneAlertRules) => {
    setAlerts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ── Shape summary ───────────────────────────────────────────────

  const renderShapeSummary = () => {
    if (!shape) return null;

    if (shape.kind === "circle") {
      return (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Cercle &mdash; rayon: {Math.round(shape.radius)}m
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="radius">Rayon (m)</Label>
            <Input
              id="radius"
              type="number"
              min={1}
              value={shape.radius}
              onChange={(e) => {
                const r = Number(e.target.value);
                if (r > 0) {
                  setShape({ ...shape, radius: r });
                }
              }}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStartDrawing("circle")}
          >
            Redessiner
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Polygone &mdash; {shape.vertices.length} sommets
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStartDrawing("polygon")}
        >
          Redessiner
        </Button>
      </div>
    );
  };

  // ── Render ──────────────────────────────────────────────────────

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      type="form"
      size="lg"
      title={zone ? "Modifier la zone" : "Nouvelle zone"}
      actions={{
        primary: {
          label: "Enregistrer",
          onClick: handleSave,
          disabled: !name || !shape,
        },
        secondary: {
          label: "Annuler",
          onClick: () => onOpenChange(false),
        },
      }}
    >
      <div className="space-y-6">
        {/* Nom de la zone */}
        <div className="space-y-1.5">
          <Label htmlFor="zone-name">Nom de la zone</Label>
          <Input
            id="zone-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex : Zone Nord — Rosny 2"
          />
        </div>

        {/* Type de zone */}
        <div className="space-y-1.5">
          <Label>Type de zone</Label>
          <Select
            value={type}
            onValueChange={(v) => setType(v as ZoneType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ZONE_TYPES.map((zt) => (
                <SelectItem key={zt} value={zt}>
                  {zt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Site / Client associé */}
        <div className="space-y-1.5">
          <Label>Site / Client associé</Label>
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

        {/* Couleur */}
        <div className="space-y-1.5">
          <Label>Couleur</Label>
          <div className="flex items-center gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={cn(
                  "h-8 w-8 rounded-full transition-all",
                  color === c
                    ? "ring-2 ring-offset-2 ring-offset-background"
                    : "hover:scale-110",
                )}
                style={{
                  backgroundColor: c,
                  ...(color === c
                    ? ({ "--tw-ring-color": c } as React.CSSProperties)
                    : {}),
                }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        {/* Forme de la zone */}
        <div className="space-y-2">
          <Label>Forme de la zone</Label>
          {shape ? (
            <>
              {renderShapeSummary()}
              <ZonePreviewMap shape={shape} color={color} height={180} />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handleStartDrawing("circle")}
              >
                <Circle className="size-4" />
                Cercle
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStartDrawing("polygon")}
              >
                <Pentagon className="size-4" />
                Polygone
              </Button>
            </div>
          )}
        </div>

        {/* Règles d'alerte */}
        <div className="space-y-3">
          <Label>Règles d&apos;alerte</Label>
          {ALERT_LABELS.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between"
            >
              <Label className="font-normal">{label}</Label>
              <Switch
                checked={alerts[key]}
                onCheckedChange={() => toggleAlert(key)}
              />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
