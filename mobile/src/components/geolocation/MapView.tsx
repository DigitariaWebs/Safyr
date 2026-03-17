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
};

interface MapViewProps {
  location: Location.LocationObject | null;
  className?: string;
  style?: ViewStyle;
  zone?: WorkZone;
  zones?: WorkZone[];
  zoneStatuses?: Map<string, ZoneStatus>;
  selectedZoneId?: string | null;
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

/** Compute [sw, ne] bounds that fit the zone circle(s) + user location with padding. */
function computeBounds(
  location: Location.LocationObject | null,
  zones: WorkZone[],
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

export const MapView = React.forwardRef<MapViewHandle, MapViewProps>(
  function MapView(
    { location, className, style, zone, zones, zoneStatuses, selectedZoneId },
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
      () => computeBounds(location, allZones),
      [location, allZones],
    );

    useImperativeHandle(ref, () => ({
      flyTo(coords: [number, number], duration = 1500) {
        cameraRef.current?.setCamera({
          centerCoordinate: coords,
          zoomLevel: 15,
          animationDuration: duration,
          animationMode: "flyTo",
        });
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
