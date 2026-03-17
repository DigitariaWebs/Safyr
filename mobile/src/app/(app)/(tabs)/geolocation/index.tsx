import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { BlurView } from "expo-blur";
import { Crosshair } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MapView, type MapViewHandle } from "@/components/geolocation/MapView";
import { Toggle } from "@/components/ui";
import { useAgentLocation } from "@/features/geolocation/useAgentLocation";
import { useWorkZoneMonitor } from "@/features/geolocation/useWorkZoneMonitor";
import { defaultWorkZone } from "@/features/geolocation/workZone";
import { useTheme } from "@/theme";
import { getBodyFont, getHeadingFont } from "@/utils/fonts";

export default function GeolocationScreen() {
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapViewHandle>(null);

  // Tab bar height: paddingTop(6) + icon(20) + gap(3) + label(~12) + paddingBottom(safeArea)
  // Matches the TabBar component layout
  const tabBarHeight = 42 + Math.max(insets.bottom, 8);

  const [enabled, setEnabled] = useState(false);
  const { permission, location, error } = useAgentLocation(enabled);
  const { outside, distanceMeters } = useWorkZoneMonitor({
    enabled,
    location,
    zone: defaultWorkZone,
  });

  const coords = location?.coords;
  const hasLocation = !!coords;
  const isActive = enabled && permission === "granted" && hasLocation;
  const isDenied = enabled && permission === "denied";
  const blurTint = colorScheme === "dark" ? "dark" : "light";

  // Overlay fade-in animation
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 400,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, [overlayOpacity]);

  // Pulsing dot animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!isActive) {
      pulseAnim.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [isActive, pulseAnim]);

  function handleCenter() {
    if (!coords) return;
    mapRef.current?.flyTo([coords.longitude, coords.latitude]);
  }

  // Status
  const statusColor = isDenied
    ? colors.error
    : isActive
      ? colors.success
      : colors.mutedForeground;
  const statusText = isDenied
    ? "Permission refusée"
    : isActive
      ? "En service"
      : "Hors service";

  // Zone
  const zoneColor =
    !isActive || distanceMeters == null
      ? colors.mutedForeground
      : outside
        ? colors.warning
        : colors.success;
  const zoneText =
    !isActive || distanceMeters == null
      ? "—"
      : outside
        ? `Hors zone · ${Math.round(distanceMeters)}m`
        : `Dans la zone · ${Math.round(distanceMeters)}m`;

  return (
    <View style={styles.container}>
      {/* Full-bleed map */}
      <MapView
        ref={mapRef}
        location={location}
        zone={defaultWorkZone}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Overlays */}
      <Animated.View
        style={[styles.overlayContainer, { opacity: overlayOpacity }]}
        pointerEvents="box-none"
      >
        {/* Top-left: status overlay */}
        <View
          style={[
            styles.glassOuter,
            { top: insets.top + 8, left: 16, borderRadius: 14 },
          ]}
        >
          <BlurView intensity={50} tint={blurTint} style={styles.blurFill}>
            <View
              style={[
                styles.glassInner,
                {
                  backgroundColor: `${colors.background}CC`,
                  borderColor: colors.borderSubtle,
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: colors.foreground,
                  fontFamily: getHeadingFont(),
                  marginBottom: 3,
                }}
              >
                Géolocalisation
              </Text>
              <View style={styles.statusRow}>
                <Animated.View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: statusColor,
                      opacity: isActive ? pulseAnim : 1,
                    },
                  ]}
                />
                <Text
                  style={{
                    fontSize: 11,
                    color: statusColor,
                    fontFamily: getBodyFont("500"),
                  }}
                >
                  {statusText}
                </Text>
              </View>
            </View>
          </BlurView>
        </View>

        {/* Top-right: zone pill */}
        <View
          style={[
            styles.glassOuter,
            { top: insets.top + 8, right: 16, borderRadius: 20 },
          ]}
        >
          <BlurView intensity={50} tint={blurTint} style={styles.blurFill}>
            <View
              style={[
                styles.glassInner,
                {
                  backgroundColor: `${colors.background}CC`,
                  borderColor: colors.borderSubtle,
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                },
              ]}
            >
              <View
                style={[styles.statusDot, { backgroundColor: zoneColor }]}
              />
              <Text
                style={{
                  fontSize: 11,
                  color: zoneColor,
                  fontFamily: getBodyFont("500"),
                }}
              >
                {zoneText}
              </Text>
            </View>
          </BlurView>
        </View>

        {/* Centrer FAB */}
        <View
          style={[
            styles.glassOuter,
            {
              right: 16,
              bottom: tabBarHeight + 160,
              borderRadius: 22,
              width: 44,
              height: 44,
            },
          ]}
        >
          <BlurView intensity={50} tint={blurTint} style={styles.blurFill}>
            <Pressable
              onPress={handleCenter}
              disabled={!hasLocation}
              style={[
                styles.glassInner,
                {
                  backgroundColor: `${colors.background}CC`,
                  borderColor: colors.borderSubtle,
                  borderRadius: 22,
                  width: 44,
                  height: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: hasLocation ? 1 : 0.4,
                },
              ]}
              accessibilityLabel="Centrer la carte"
              accessibilityRole="button"
            >
              <Crosshair size={18} color={colors.primary} />
            </Pressable>
          </BlurView>
        </View>

        {/* Bottom info card — flush with tab bar */}
        <View
          style={[
            styles.glassOuter,
            {
              bottom: tabBarHeight,
              left: 0,
              right: 0,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
          ]}
        >
          <BlurView intensity={50} tint={blurTint} style={styles.blurFill}>
            <View
              style={[
                styles.glassInner,
                {
                  backgroundColor: `${colors.background}CC`,
                  borderColor: colors.borderSubtle,
                  borderBottomWidth: 0,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  paddingHorizontal: 20,
                  paddingTop: 16,
                  paddingBottom: 12,
                  gap: 10,
                },
              ]}
            >
              {/* Toggle */}
              <Toggle
                value={enabled}
                onValueChange={setEnabled}
                size="sm"
                enabledLabel="En service"
                disabledLabel="Hors service"
              />

              {/* Error */}
              {error ? (
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.error,
                    fontFamily: getBodyFont("400"),
                    textAlign: "center",
                  }}
                >
                  {error}
                </Text>
              ) : null}

              {/* Coordinates */}
              {hasLocation ? (
                <View style={styles.coordsContainer}>
                  <View style={styles.coordRow}>
                    <Text
                      style={[
                        styles.coordLabel,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      Lat
                    </Text>
                    <Text
                      style={[styles.coordValue, { color: colors.foreground }]}
                    >
                      {coords.latitude.toFixed(6)}°
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.coordDivider,
                      { backgroundColor: colors.borderSubtle },
                    ]}
                  />
                  <View style={styles.coordRow}>
                    <Text
                      style={[
                        styles.coordLabel,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      Lon
                    </Text>
                    <Text
                      style={[styles.coordValue, { color: colors.foreground }]}
                    >
                      {coords.longitude.toFixed(6)}°
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.coordDivider,
                      { backgroundColor: colors.borderSubtle },
                    ]}
                  />
                  <View style={styles.coordRow}>
                    <Text
                      style={[
                        styles.coordLabel,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      Préc
                    </Text>
                    <Text
                      style={[styles.coordValue, { color: colors.foreground }]}
                    >
                      ±{Math.round(coords.accuracy ?? 0)}m
                    </Text>
                  </View>
                </View>
              ) : null}

              {/* Zone label */}
              {isActive ? (
                <Text
                  style={{
                    fontSize: 11,
                    color: colors.mutedForeground,
                    fontFamily: getBodyFont("400"),
                    textAlign: "center",
                  }}
                >
                  {defaultWorkZone.label} · {defaultWorkZone.radiusMeters}m
                </Text>
              ) : null}
            </View>
          </BlurView>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  glassOuter: {
    position: "absolute",
    overflow: "hidden",
  },
  blurFill: {
    flex: 1,
  },
  glassInner: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  coordsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  coordRow: {
    alignItems: "center",
    gap: 2,
  },
  coordLabel: {
    fontSize: 10,
    fontFamily: getBodyFont("500"),
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  coordValue: {
    fontSize: 13,
    fontFamily: getBodyFont("600"),
  },
  coordDivider: {
    width: 1,
    height: 24,
  },
});
