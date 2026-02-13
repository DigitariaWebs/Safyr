import React, { useEffect } from "react";
import { StyleSheet, View, useColorScheme, Text } from "react-native";
import * as Location from "expo-location";
import { useTheme } from "@/theme";
import type { WorkZone } from "@/features/geolocation/workZone";

// Conditional import for Mapbox
let Mapbox: any = null;
let MAPBOX_ACCESS_TOKEN: string | undefined;
let MAPBOX_THEME: { dark: string; streets: string } | undefined;

try {
    Mapbox = require("@rnmapbox/maps").default;
    const mapboxConstants = require("@/constants/mapbox");
    MAPBOX_ACCESS_TOKEN = mapboxConstants.MAPBOX_ACCESS_TOKEN;
    MAPBOX_THEME = mapboxConstants.MAPBOX_THEME;
} catch (e) {
    console.warn("@rnmapbox/maps not available:", e);
}

interface MapViewProps {
    location: Location.LocationObject | null;
    className?: string;
    zone?: WorkZone;
}

function circlePolygon(center: { latitude: number; longitude: number }, radiusMeters: number, steps = 64) {
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
            Math.sin(lat) * Math.cos(d) + Math.cos(lat) * Math.sin(d) * Math.cos(brng),
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

export function MapView({ location, className, zone }: MapViewProps) {
    const colorScheme = useColorScheme();
    const { colors } = useTheme();

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
            <View className={`flex-1 overflow-hidden rounded-xl items-center justify-center bg-muted ${className}`}>
                <Text className="text-sm text-muted-foreground text-center px-4">
                    Carte non disponible.{"\n"}
                    Rebuild requis pour activer Mapbox.
                </Text>
            </View>
        );
    }

    // Style URL based on theme
    const styleURL = colorScheme === "dark" ? MAPBOX_THEME.dark : MAPBOX_THEME.streets;

    return (
        <View className={`flex-1 overflow-hidden rounded-xl ${className}`}>
            <Mapbox.MapView
                style={styles.map}
                styleURL={styleURL}
                logoEnabled={false}
                attributionEnabled={false}
            >
                <Mapbox.Camera
                    zoomLevel={15}
                    centerCoordinate={
                        location
                            ? [location.coords.longitude, location.coords.latitude]
                            : [2.3522, 48.8566] // Default to Paris
                    }
                    animationMode="flyTo"
                    animationDuration={2000}
                />

                <Mapbox.UserLocation
                    visible={true}
                    showsUserHeadingIndicator={true}
                    androidRenderMode="gps"
                />

                {/* Work zone (circle) */}
                {zone ? (
                    <Mapbox.ShapeSource
                        id="workZone"
                        shape={circlePolygon(zone.center, zone.radiusMeters)}
                    >
                        <Mapbox.FillLayer
                            id="workZoneFill"
                            style={{ fillColor: colors.primary, fillOpacity: 0.12 }}
                        />
                        <Mapbox.LineLayer
                            id="workZoneLine"
                            style={{ lineColor: colors.primary, lineWidth: 2 }}
                        />
                    </Mapbox.ShapeSource>
                ) : null}

                {location && (
                    <Mapbox.PointAnnotation
                        id="userLocation"
                        coordinate={[location.coords.longitude, location.coords.latitude]}
                    >
                        <View
                            style={{
                                height: 20,
                                width: 20,
                                backgroundColor: colors.primary,
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: "#fff",
                            }}
                        />
                    </Mapbox.PointAnnotation>
                )}
            </Mapbox.MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
});
