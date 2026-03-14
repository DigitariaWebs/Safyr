"use client";

import { useMemo } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import Link from "next/link";
import { AlertTriangle, ExternalLink, MapPinOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  circleToPolygon,
  ensureClosedRing,
} from "@/data/geolocation-zones";
import type { GeoZone, ZoneShape } from "@/data/geolocation-zones";
import type { PresenceRecord } from "@/data/geolocation-presence";
import { PRESENCE_STATUS_CONFIG } from "@/data/geolocation-presence";
import { cn, getInitials } from "@/lib/utils";

// ── Helpers ──────────────────────────────────────────────────────────

function getBounds(
  shape: ZoneShape,
  agentPoint?: [number, number] | null,
): [[number, number], [number, number]] {
  const points: [number, number][] =
    shape.kind === "circle"
      ? circleToPolygon(shape.center, shape.radius, 32)
      : [...shape.vertices];
  if (agentPoint) points.push(agentPoint);
  const lngs = points.map((p) => p[0]);
  const lats = points.map((p) => p[1]);
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
}

// ── Component ────────────────────────────────────────────────────────

interface PresenceDetailPanelProps {
  record: PresenceRecord;
  zone?: GeoZone;
}

export function PresenceDetailPanel({
  record,
  zone,
}: PresenceDetailPanelProps) {
  const statusConfig = PRESENCE_STATUS_CONFIG[record.status];
  const hasGps = record.lastLatitude !== null && record.lastLongitude !== null;
  const agentPoint = useMemo<[number, number] | null>(
    () =>
      hasGps ? [record.lastLongitude!, record.lastLatitude!] : null,
    [hasGps, record.lastLongitude, record.lastLatitude],
  );

  const geoJson = useMemo(() => {
    if (!zone) return null;
    const coordinates =
      zone.shape.kind === "circle"
        ? [circleToPolygon(zone.shape.center, zone.shape.radius)]
        : [ensureClosedRing(zone.shape.vertices)];
    return {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: { color: zone.color },
          geometry: { type: "Polygon" as const, coordinates },
        },
      ],
    };
  }, [zone]);

  const bounds = useMemo(() => {
    if (!zone) return null;
    return getBounds(zone.shape, agentPoint);
  }, [zone, agentPoint]);

  const initialViewState = useMemo(() => {
    if (bounds) {
      return {
        longitude: (bounds[0][0] + bounds[1][0]) / 2,
        latitude: (bounds[0][1] + bounds[1][1]) / 2,
        zoom: 14,
      };
    }
    if (agentPoint) {
      return { longitude: agentPoint[0], latitude: agentPoint[1], zoom: 14 };
    }
    return { longitude: 2.3522, latitude: 48.8566, zoom: 10 };
  }, [bounds, agentPoint]);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Left column — Agent info */}
      <div className="flex-1 space-y-3">
        {/* Agent identity */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold ring-2",
              statusConfig.avatarClass,
              statusConfig.ringClass,
            )}
          >
            {getInitials(record.agentName)}
          </div>
          <div>
            <p className="text-sm font-semibold">{record.agentName}</p>
            <p className="text-xs text-muted-foreground">{record.siteName}</p>
          </div>
        </div>

        {/* Shift + status */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Vacation :</span>
          <span className="font-medium">
            {record.shiftStart} – {record.shiftEnd}
          </span>
          <Badge
            variant={statusConfig.badgeVariant}
            className={statusConfig.badgeClassName}
          >
            {statusConfig.label}
          </Badge>
        </div>

        {/* Last seen */}
        {record.lastSeenAt && (
          <div className="text-xs text-muted-foreground">
            Dernière position :{" "}
            <span className="text-foreground">
              {new Date(record.lastSeenAt).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}

        {/* Distance from zone */}
        {record.distanceFromZone !== null && record.distanceFromZone > 0 && (
          <div className="text-xs text-orange-400">
            Distance de la zone : {record.distanceFromZone} m
          </div>
        )}

        {/* Anomalies */}
        {record.anomalies.length > 0 && (
          <div className="space-y-1">
            {record.anomalies.map((anomaly, i) => (
              <div
                key={i}
                className="flex items-start gap-1.5 text-xs text-amber-400"
              >
                <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>{anomaly}</span>
              </div>
            ))}
          </div>
        )}

        {/* Link to live */}
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/geolocation/live?agent=${record.agentId}`}>
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
            Voir en temps réel
          </Link>
        </Button>
      </div>

      {/* Right column — Mini map */}
      <div className="w-full lg:w-[320px] shrink-0">
        {hasGps && zone ? (
          <div className="rounded-lg border border-border/50 overflow-hidden h-[200px]">
            <Map
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
              initialViewState={initialViewState}
              style={{ width: "100%", height: "100%" }}
              mapStyle="mapbox://styles/mapbox/dark-v11"
              interactive={false}
              scrollZoom={false}
              dragPan={false}
              onLoad={(evt) => {
                if (bounds) {
                  evt.target.fitBounds(bounds, { padding: 40, duration: 0 });
                }
              }}
            >
              {geoJson && (
                <Source type="geojson" data={geoJson}>
                  <Layer
                    id={`presence-zone-fill-${record.id}`}
                    type="fill"
                    paint={{
                      "fill-color": ["get", "color"],
                      "fill-opacity": 0.15,
                    }}
                  />
                  <Layer
                    id={`presence-zone-line-${record.id}`}
                    type="line"
                    paint={{
                      "line-color": ["get", "color"],
                      "line-width": 2,
                      "line-opacity": 0.7,
                    }}
                  />
                </Source>
              )}
              {agentPoint && (
                <Marker
                  longitude={agentPoint[0]}
                  latitude={agentPoint[1]}
                  anchor="center"
                >
                  <div
                    className="h-4 w-4 rounded-full border-2 border-white shadow-lg"
                    style={{
                      backgroundColor: statusConfig.color,
                    }}
                  />
                </Marker>
              )}
            </Map>
          </div>
        ) : (
          <div className="rounded-lg border border-border/50 bg-muted/20 h-[200px] flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <MapPinOff className="h-8 w-8" />
            <span className="text-xs">Aucun signal GPS</span>
          </div>
        )}
      </div>
    </div>
  );
}
