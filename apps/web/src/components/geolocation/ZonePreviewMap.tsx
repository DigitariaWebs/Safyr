"use client";

import { useMemo } from "react";
import Map, { Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { circleToPolygon, ensureClosedRing } from "@/data/geolocation-zones";
import type { ZoneShape } from "@/data/geolocation-zones";
import { cn } from "@/lib/utils";

// ── Helpers ──────────────────────────────────────────────────────────

function getZoneBounds(shape: ZoneShape): [[number, number], [number, number]] {
  const points: [number, number][] =
    shape.kind === "circle"
      ? circleToPolygon(shape.center, shape.radius, 32)
      : shape.vertices;
  const lngs = points.map((p) => p[0]);
  const lats = points.map((p) => p[1]);
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
}

// ── Component ────────────────────────────────────────────────────────

interface ZonePreviewMapProps {
  shape: ZoneShape;
  color: string;
  height?: number;
  className?: string;
}

export function ZonePreviewMap({
  shape,
  color,
  height = 200,
  className,
}: ZonePreviewMapProps) {
  const geoJson = useMemo(() => {
    const coordinates =
      shape.kind === "circle"
        ? [circleToPolygon(shape.center, shape.radius)]
        : [ensureClosedRing(shape.vertices)];

    return {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          properties: { color },
          geometry: { type: "Polygon" as const, coordinates },
        },
      ],
    };
  }, [shape, color]);

  const bounds = useMemo(() => getZoneBounds(shape), [shape]);

  const initialViewState = useMemo(() => {
    const centerLng = (bounds[0][0] + bounds[1][0]) / 2;
    const centerLat = (bounds[0][1] + bounds[1][1]) / 2;
    return { longitude: centerLng, latitude: centerLat, zoom: 14 };
  }, [bounds]);

  return (
    <div
      className={cn(
        "rounded-lg border border-border/50 overflow-hidden",
        className,
      )}
      style={{ height }}
    >
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={initialViewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        interactive={false}
        scrollZoom={false}
        dragPan={false}
        onLoad={(evt) => {
          evt.target.fitBounds(bounds, { padding: 40, duration: 0 });
        }}
      >
        <Source type="geojson" data={geoJson}>
          <Layer
            id="zone-preview-fill"
            type="fill"
            paint={{ "fill-color": ["get", "color"], "fill-opacity": 0.2 }}
          />
          <Layer
            id="zone-preview-line"
            type="line"
            paint={{
              "line-color": ["get", "color"],
              "line-width": 2,
              "line-opacity": 0.8,
            }}
          />
        </Source>
      </Map>
    </div>
  );
}
