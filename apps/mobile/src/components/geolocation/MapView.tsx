import React, { useEffect, useImperativeHandle, useMemo, useRef } from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  useColorScheme,
  Text,
} from "react-native";
import * as Location from "expo-location";
import { useTheme } from "@/theme";
import type { WorkZone } from "@/features/geolocation/workZone";
import type { ZoneStatus } from "@/features/geolocation/useMultiZoneMonitor";
import type {
  CheckpointScan,
  PatrolRoute,
} from "@/features/geolocation/patrol.types";
import { CheckpointMarker } from "./CheckpointMarker";

// Conditional import for Mapbox
let Mapbox: any = null;
let MAPBOX_ACCESS_TOKEN: string | undefined;
let MAPBOX_THEME: { dark: string; streets: string } | undefined;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Mapbox = require("@rnmapbox/maps").default;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mapboxConstants = require("@/constants/mapbox");
  MAPBOX_ACCESS_TOKEN = mapboxConstants.MAPBOX_ACCESS_TOKEN;
  MAPBOX_THEME = mapboxConstants.MAPBOX_THEME;
} catch (e) {
  console.warn("@rnmapbox/maps not available:", e);
}

export type MapViewHandle = {
  flyTo: (coords: [number, number], duration?: number) => void;
  fitToPatrolRoute: (
    route: PatrolRoute,
    location?: Location.LocationObject | null,
  ) => void;
};

interface MapViewProps {
  location: Location.LocationObject | null;
  className?: string;
  style?: ViewStyle;
  zone?: WorkZone;
  zones?: WorkZone[];
  zoneStatuses?: Map<string, ZoneStatus>;
  selectedZoneId?: string | null;
  /** Patrol route to display (checkpoints + route line) */
  patrolRoute?: PatrolRoute;
  /** Scan statuses for patrol checkpoint coloring */
  patrolScans?: CheckpointScan[];
  /** Live GPS trail of the patrol */
  patrolTrail?: { coords: [number, number]; timestamp: string }[];
  /** ID of the next pending checkpoint (for highlight ring) */
  nextCheckpointId?: string | null;
}

function circlePolygon(
  center: { latitude: number; longitude: number },
  radiusMeters: number,
  steps = 64,
) {
  const coords: number[][] = [];
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;
  const R = 6371e3;
  const lat = toRad(center.latitude);
  const lon = toRad(center.longitude);
  const d = radiusMeters / R;

  for (let i = 0; i <= steps; i++) {
    const brng = (i * 2 * Math.PI) / steps;
    const lat2 = Math.asin(
      Math.sin(lat) * Math.cos(d) +
        Math.cos(lat) * Math.sin(d) * Math.cos(brng),
    );
    const lon2 =
      lon +
      Math.atan2(
        Math.sin(brng) * Math.sin(d) * Math.cos(lat),
        Math.cos(d) - Math.sin(lat) * Math.sin(lat2),
      );
    coords.push([toDeg(lon2), toDeg(lat2)]);
  }
  return {
    type: "Feature" as const,
    properties: {},
    geometry: { type: "Polygon" as const, coordinates: [coords] },
  };
}

/** Compute [sw, ne] bounds that fit the zone circle(s) + user location + optional patrol checkpoints. */
function computeBounds(
  location: Location.LocationObject | null,
  zones: WorkZone[],
  patrolRoute?: PatrolRoute,
): { sw: [number, number]; ne: [number, number] } | null {
  const points: { lat: number; lon: number }[] = [];

  if (location) {
    points.push({
      lat: location.coords.latitude,
      lon: location.coords.longitude,
    });
  }

  for (const z of zones) {
    const latOffset = z.radiusMeters / 111_320;
    const lonOffset =
      z.radiusMeters /
      (111_320 * Math.cos((z.center.latitude * Math.PI) / 180));
    points.push(
      {
        lat: z.center.latitude + latOffset,
        lon: z.center.longitude + lonOffset,
      },
      {
        lat: z.center.latitude - latOffset,
        lon: z.center.longitude - lonOffset,
      },
    );
  }

  // Include patrol checkpoint coords in bounds
  if (patrolRoute) {
    for (const cp of patrolRoute.checkpoints) {
      points.push({ lat: cp.coords[1], lon: cp.coords[0] });
    }
  }

  if (points.length === 0) return null;

  let minLat = points[0].lat;
  let maxLat = points[0].lat;
  let minLon = points[0].lon;
  let maxLon = points[0].lon;
  for (const p of points) {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lon < minLon) minLon = p.lon;
    if (p.lon > maxLon) maxLon = p.lon;
  }

  return {
    sw: [minLon, minLat],
    ne: [maxLon, maxLat],
  };
}

/** Memoized zone shape to avoid recalculating circlePolygon on every render. */
const ZoneShape = React.memo(function ZoneShape({
  zone,
  fillColor,
  isSelected,
}: {
  zone: WorkZone;
  fillColor: string;
  isSelected: boolean;
}) {
  const shape = useMemo(
    () => circlePolygon(zone.center, zone.radiusMeters),
    [zone.center, zone.radiusMeters],
  );
  return (
    <Mapbox.ShapeSource id={`zone-${zone.id}`} shape={shape}>
      <Mapbox.FillLayer
        id={`zone-${zone.id}-fill`}
        style={{ fillColor, fillOpacity: isSelected ? 0.25 : 0.12 }}
      />
      <Mapbox.LineLayer
        id={`zone-${zone.id}-line`}
        style={{ lineColor: fillColor, lineWidth: isSelected ? 3 : 2 }}
      />
    </Mapbox.ShapeSource>
  );
});

const BOUNDS_PADDING = {
  paddingTop: 100,
  paddingBottom: 200,
  paddingLeft: 60,
  paddingRight: 60,
};

/** Memoized patrol route line connecting checkpoints in order. */
const PatrolRouteLine = React.memo(function PatrolRouteLine({
  route,
}: {
  route: PatrolRoute;
}) {
  const shape = useMemo(
    () => ({
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates: route.checkpoints
          .sort((a, b) => a.order - b.order)
          .map((cp) => cp.coords),
      },
    }),
    [route.checkpoints],
  );
  return (
    <Mapbox.ShapeSource id="patrol-route-line" shape={shape}>
      <Mapbox.LineLayer
        id="patrol-route-line-layer"
        style={{
          lineColor: "#64748b",
          lineWidth: 2,
          lineDasharray: [4, 3],
          lineOpacity: 0.7,
        }}
      />
    </Mapbox.ShapeSource>
  );
});

/** Memoized GPS trail polyline. */
const PatrolTrailLine = React.memo(function PatrolTrailLine({
  trail,
}: {
  trail: { coords: [number, number] }[];
}) {
  const shape = useMemo(
    () => ({
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "LineString" as const,
        coordinates: trail.map((t) => t.coords),
      },
    }),
    [trail],
  );
  if (trail.length < 2) return null;
  return (
    <Mapbox.ShapeSource id="patrol-trail" shape={shape}>
      <Mapbox.LineLayer
        id="patrol-trail-layer"
        style={{
          lineColor: "#22d3ee",
          lineWidth: 3,
          lineOpacity: 0.85,
        }}
      />
    </Mapbox.ShapeSource>
  );
});

export const MapView = React.forwardRef<MapViewHandle, MapViewProps>(
  function MapView(
    {
      location,
      className,
      style,
      zone,
      zones,
      zoneStatuses,
      selectedZoneId,
      patrolRoute,
      patrolScans,
      patrolTrail,
      nextCheckpointId,
    },
    ref,
  ) {
    const colorScheme = useColorScheme();
    const { colors } = useTheme();
    const cameraRef = useRef<any>(null);

    const allZones = useMemo(
      () => zones ?? (zone ? [zone] : []),
      [zones, zone],
    );

    const bounds = useMemo(
      () => computeBounds(location, allZones, patrolRoute),
      [location, allZones, patrolRoute],
    );

    const scanStatusMap = useMemo(() => {
      const map = new Map<string, "pending" | "scanned" | "missed">();
      if (patrolScans) {
        for (const s of patrolScans) map.set(s.checkpointId, s.status);
      }
      return map;
    }, [patrolScans]);

    useImperativeHandle(ref, () => ({
      flyTo(coords: [number, number], duration = 1500) {
        cameraRef.current?.setCamera({
          centerCoordinate: coords,
          zoomLevel: 15,
          animationDuration: duration,
          animationMode: "flyTo",
        });
      },
      fitToPatrolRoute(
        route: PatrolRoute,
        loc?: Location.LocationObject | null,
      ) {
        const routeBounds = computeBounds(loc ?? null, [], route);
        if (routeBounds) {
          cameraRef.current?.setCamera({
            bounds: {
              ne: routeBounds.ne,
              sw: routeBounds.sw,
              ...BOUNDS_PADDING,
            },
            animationDuration: 1500,
            animationMode: "flyTo",
          });
        }
      },
    }));

    // Set the access token when component mounts
    useEffect(() => {
      if (Mapbox && MAPBOX_ACCESS_TOKEN) {
        try {
          Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
        } catch (error) {
          console.error("Failed to set Mapbox access token:", error);
        }
      }
    }, []);

    // If Mapbox is not available, show fallback UI
    if (!Mapbox || !MAPBOX_THEME) {
      return (
        <View
          style={[
            style,
            {
              flex: 1,
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.muted,
            },
          ]}
        >
          <Text
            style={{
              fontSize: 14,
              color: colors.mutedForeground,
              textAlign: "center",
              paddingHorizontal: 16,
            }}
          >
            Carte non disponible.{"\n"}
            Rebuild requis pour activer Mapbox.
          </Text>
        </View>
      );
    }

    // Warn if Mapbox token is missing or placeholder
    const hasValidToken =
      MAPBOX_ACCESS_TOKEN &&
      !MAPBOX_ACCESS_TOKEN.includes("PLACEHOLDER") &&
      MAPBOX_ACCESS_TOKEN.startsWith("pk.");

    if (!hasValidToken) {
      return (
        <View
          style={[
            style,
            {
              flex: 1,
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.muted,
            },
          ]}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: colors.warning,
              textAlign: "center",
              paddingHorizontal: 24,
              marginBottom: 8,
            }}
          >
            EXPO_PUBLIC_MAPBOX_PUBLIC_TOKEN manquant
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.mutedForeground,
              textAlign: "center",
              paddingHorizontal: 24,
            }}
          >
            Ajoutez un token Mapbox valide dans votre fichier .env pour activer
            la carte.
          </Text>
        </View>
      );
    }

    // Style URL based on theme
    const styleURL =
      colorScheme === "dark" ? MAPBOX_THEME.dark : MAPBOX_THEME.streets;

    return (
      <View
        style={style}
        className={`flex-1 overflow-hidden ${className ?? ""}`}
      >
        <Mapbox.MapView
          style={styles.map}
          styleURL={styleURL}
          logoEnabled={false}
          attributionEnabled={false}
          scaleBarEnabled={false}
          compassEnabled={false}
        >
          <Mapbox.Camera
            ref={cameraRef}
            {...(bounds
              ? {
                  bounds: {
                    ne: bounds.ne,
                    sw: bounds.sw,
                    ...BOUNDS_PADDING,
                  },
                }
              : {
                  zoomLevel: 13,
                  centerCoordinate: [2.3522, 48.8566], // Default to Paris
                })}
            animationMode="flyTo"
            animationDuration={2000}
          />

          <Mapbox.UserLocation
            visible={true}
            showsUserHeadingIndicator={true}
            androidRenderMode="gps"
          />

          {/* Work zones (circles) */}
          {allZones.map((z) => {
            const status = zoneStatuses?.get(z.id);
            const isInside = status ? !status.outside : undefined;
            const fillColor =
              isInside === true
                ? colors.success
                : isInside === false
                  ? colors.error
                  : colors.primary;
            const isSelected = selectedZoneId === z.id;
            return (
              <ZoneShape
                key={z.id}
                zone={z}
                fillColor={fillColor}
                isSelected={isSelected}
              />
            );
          })}

          {/* Patrol route line (dashed) */}
          {patrolRoute && <PatrolRouteLine route={patrolRoute} />}

          {/* Patrol GPS trail (solid cyan) */}
          {patrolTrail && patrolTrail.length >= 2 && (
            <PatrolTrailLine trail={patrolTrail} />
          )}

          {/* Guide line: agent → next checkpoint */}
          {location &&
            nextCheckpointId &&
            patrolRoute &&
            (() => {
              const nextCp = patrolRoute.checkpoints.find(
                (cp) => cp.id === nextCheckpointId,
              );
              if (!nextCp) return null;
              const guideLine = {
                type: "Feature" as const,
                properties: {},
                geometry: {
                  type: "LineString" as const,
                  coordinates: [
                    [location.coords.longitude, location.coords.latitude],
                    nextCp.coords,
                  ],
                },
              };
              return (
                <Mapbox.ShapeSource id="patrol-guide-line" shape={guideLine}>
                  <Mapbox.LineLayer
                    id="patrol-guide-line-layer"
                    style={{
                      lineColor: "#22d3ee",
                      lineWidth: 2,
                      lineDasharray: [2, 4],
                      lineOpacity: 0.5,
                    }}
                  />
                </Mapbox.ShapeSource>
              );
            })()}

          {/* Patrol checkpoint markers */}
          {patrolRoute?.checkpoints.map((cp) => {
            const status = scanStatusMap.get(cp.id) ?? "pending";
            const isDone = status === "scanned" || status === "missed";
            return (
              <Mapbox.MarkerView
                key={cp.id}
                id={`checkpoint-${cp.id}`}
                coordinate={cp.coords}
              >
                <View style={{ opacity: isDone ? 0.4 : 1 }}>
                  <CheckpointMarker
                    order={cp.order}
                    status={status}
                    type={cp.type}
                    isNext={nextCheckpointId === cp.id}
                  />
                </View>
              </Mapbox.MarkerView>
            );
          })}
        </Mapbox.MapView>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
