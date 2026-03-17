"use client";

import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { ZonePreviewMap } from "@/components/geolocation/ZonePreviewMap";
import {
  GeoZone,
  ZONE_TYPE_BADGE,
  ALERT_LABELS,
  computeZoneArea,
  computeZonePerimeter,
  formatArea,
  formatPerimeter,
} from "@/data/geolocation-zones";
import { cn } from "@/lib/utils";

// ── Props ───────────────────────────────────────────────────────────

interface ZoneDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zone: GeoZone | null;
  onEdit: (zone: GeoZone) => void;
  onDelete: (zone: GeoZone) => void;
}

// ── Shape description ───────────────────────────────────────────────

function describeShape(shape: GeoZone["shape"]): string {
  if (shape.kind === "circle") {
    return `Cercle (rayon: ${Math.round(shape.radius)}m)`;
  }
  return `Polygone (${shape.vertices.length} sommets)`;
}

// ── Component ───────────────────────────────────────────────────────

export function ZoneDetailModal({
  open,
  onOpenChange,
  zone,
  onEdit,
  onDelete,
}: ZoneDetailModalProps) {
  if (!zone) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      type="details"
      size="lg"
      title={zone.name}
      actions={{
        primary: {
          label: "Modifier",
          onClick: () => onEdit(zone),
        },
        tertiary: {
          label: "Supprimer",
          variant: "destructive",
          onClick: () => onDelete(zone),
        },
      }}
    >
      <div className="space-y-4">
        {/* Type + Site row */}
        <div className="flex items-center gap-2">
          <Badge variant={ZONE_TYPE_BADGE[zone.type]}>{zone.type}</Badge>
          <span className="text-sm text-muted-foreground">{zone.site}</span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Superficie
            </div>
            <div className="text-sm font-semibold">
              {formatArea(computeZoneArea(zone.shape))}
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Périmètre
            </div>
            <div className="text-sm font-semibold">
              {formatPerimeter(computeZonePerimeter(zone.shape))}
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Forme
            </div>
            <div className="text-sm font-semibold">
              {describeShape(zone.shape)}
            </div>
          </div>
        </div>

        {/* Mini-map */}
        <ZonePreviewMap shape={zone.shape} color={zone.color} height={200} />

        {/* Alertes section */}
        <div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
            Règles d&apos;alerte
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ALERT_LABELS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    zone.alerts[key]
                      ? "bg-emerald-500"
                      : "bg-muted-foreground/40",
                  )}
                />
                <span className="text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metadata footer */}
        <div className="text-[10px] text-muted-foreground">
          Créée le{" "}
          {new Date(zone.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>
    </Modal>
  );
}
