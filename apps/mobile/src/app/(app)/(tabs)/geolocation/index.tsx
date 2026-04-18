import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { Crosshair } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MapView, type MapViewHandle } from "@/components/geolocation/MapView";
import {
  ZoneAlertBanner,
  type ZoneAlertBannerHandle,
} from "@/components/geolocation/ZoneAlertBanner";
import { ZoneListCard } from "@/components/geolocation/ZoneListCard";
import { BottomSheet } from "@/components/geolocation/BottomSheet";
import { PatrolModeSelector } from "@/components/geolocation/PatrolModeSelector";
import { PatrolRouteList } from "@/components/geolocation/PatrolRouteList";
import { PatrolRoutePreview } from "@/components/geolocation/PatrolRoutePreview";
import { PatrolActivePanel } from "@/components/geolocation/PatrolActivePanel";
import { PatrolSummary } from "@/components/geolocation/PatrolSummary";
import { PatrolQrScanner } from "@/components/geolocation/PatrolQrScanner";
import { Toggle } from "@/components/ui";
import { useAgentLocation } from "@/features/geolocation/useAgentLocation";
import {
  useMultiZoneMonitor,
  type ZoneTransition,
} from "@/features/geolocation/useMultiZoneMonitor";
import { usePatrolSession } from "@/features/geolocation/usePatrolSession";
import type { WorkZone } from "@/features/geolocation/workZone";
import { mockWorkZones } from "@/features/geolocation/zones.mock";
import { mockPatrolRoutes } from "@/features/geolocation/patrol.mock";
import { useNotifications } from "@/features/notifications/NotificationsContext";
import { useTheme } from "@/theme";
import { getBodyFont, getHeadingFont } from "@/utils/fonts";

const SHEET_MIN_HEIGHT = 100; // collapsed: handle + toggle + mode selector
const SHEET_MAX_RATIO = 0.55; // expanded: 55% of screen

export default function GeolocationScreen() {
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const mapRef = useRef<MapViewHandle>(null);

  const tabBarHeight = 42 + Math.max(insets.bottom, 8);
  const sheetMaxHeight = Math.round(screenHeight * SHEET_MAX_RATIO);

  const [enabled, setEnabled] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<"zones" | "patrol">("zones");
  const [qrScannerVisible, setQrScannerVisible] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const { permission, location, error } = useAgentLocation(enabled);
  const { push } = useNotifications();
  const bannerRef = useRef<ZoneAlertBannerHandle>(null);

  // ── Zone monitoring ──────────────────────────────────────────────

  const handleProlongedOutside = useCallback(
    ({ zone, outsideMs }: { zone: WorkZone; outsideMs: number }) => {
      push({
        title: "Hors zone prolongé",
        message: `Hors zone depuis ${Math.round(outsideMs / 60000)} min — ${zone.label}`,
        level: "warning",
        source: "geolocation",
      });
    },
    [push],
  );

  const handleTransition = useCallback(
    ({ zone, type }: ZoneTransition) => {
      if (type === "exited") {
        bannerRef.current?.show(
          `Vous avez quitté la zone : ${zone.label}`,
          colors.warning,
        );
      } else {
        bannerRef.current?.show(
          `Zone atteinte : ${zone.label}`,
          colors.success,
        );
      }
    },
    [colors.warning, colors.success],
  );

  const { statuses } = useMultiZoneMonitor({
    enabled,
    location,
    zones: mockWorkZones,
    onProlongedOutside: handleProlongedOutside,
    onTransition: handleTransition,
  });

  // ── Patrol session ───────────────────────────────────────────────

  const handleCheckpointValidated = useCallback(
    (cp: { name: string }) => {
      bannerRef.current?.show(`Point validé : ${cp.name}`, colors.success);
    },
    [colors.success],
  );

  const patrol = usePatrolSession({
    enabled,
    location,
    onCheckpointValidated: handleCheckpointValidated,
  });

  // ── Derived ──────────────────────────────────────────────────────

  const coords = location?.coords;
  const hasLocation = !!coords;
  const isActive = enabled && permission === "granted" && hasLocation;
  const isDenied = enabled && permission === "denied";
  const blurTint = colorScheme === "dark" ? "dark" : "light";
  const patrolIsActive = patrol.phase === "active";

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
    if (!isActive && !patrolIsActive) {
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
  }, [isActive, patrolIsActive, pulseAnim]);

  function handleCenter() {
    if (!coords) return;
    mapRef.current?.flyTo([coords.longitude, coords.latitude]);
  }

  // Status overlay text
  const statusColor = patrolIsActive
    ? colors.primary
    : isDenied
      ? colors.error
      : isActive
        ? colors.success
        : colors.mutedForeground;
  const statusText = patrolIsActive
    ? "Ronde en cours"
    : isDenied
      ? "Permission refusée"
      : isActive
        ? "En service"
        : "Hors service";

  // Zone summary
  const { zonePillColor, zonePillText } = useMemo(() => {
    const inside = [...statuses.values()].filter((s) => !s.outside).length;
    const total = statuses.size;
    const hasOutside = inside < total;
    return {
      zonePillColor:
        !isActive || total === 0
          ? colors.mutedForeground
          : hasOutside
            ? colors.warning
            : colors.success,
      zonePillText:
        !isActive || total === 0
          ? "—"
          : hasOutside
            ? `${total - inside} hors zone`
            : "Toutes OK",
    };
  }, [
    statuses,
    isActive,
    colors.mutedForeground,
    colors.warning,
    colors.success,
  ]);

  // ── Patrol save handler ──────────────────────────────────────────

  const handlePatrolSave = useCallback(() => {
    const event = patrol.buildMainCouranteEvent();
    if (event) {
      push({
        title: event.title,
        message: event.description,
        level: event.priority === "low" ? "success" : "warning",
        source: "geolocation",
      });
    }
    patrol.dismissSummary();
  }, [patrol, push]);

  // ── Render ───────────────────────────────────────────────────────

  const showPatrolOnMap =
    patrol.phase === "previewing" ||
    patrol.phase === "active" ||
    patrol.phase === "summary";

  return (
    <View style={styles.container}>
      {/* Full-bleed map */}
      <MapView
        ref={mapRef}
        location={location}
        zones={mockWorkZones}
        zoneStatuses={statuses}
        selectedZoneId={selectedZoneId}
        patrolRoute={
          showPatrolOnMap ? (patrol.selectedRoute ?? undefined) : undefined
        }
        patrolScans={showPatrolOnMap ? patrol.checkpointScans : undefined}
        patrolTrail={
          patrol.phase === "active" || patrol.phase === "summary"
            ? patrol.gpsTrail
            : undefined
        }
        nextCheckpointId={patrol.nextCheckpoint?.id ?? null}
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
                {patrolIsActive ? "Ronde" : "Géolocalisation"}
              </Text>
              <View style={styles.statusRow}>
                <Animated.View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: statusColor,
                      opacity: isActive || patrolIsActive ? pulseAnim : 1,
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

        {/* Top-right: zone pill (hidden during active patrol) */}
        {!patrolIsActive && (
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
                  style={[styles.statusDot, { backgroundColor: zonePillColor }]}
                />
                <Text
                  style={{
                    fontSize: 11,
                    color: zonePillColor,
                    fontFamily: getBodyFont("500"),
                  }}
                >
                  {zonePillText}
                </Text>
              </View>
            </BlurView>
          </View>
        )}

        {/* Centrer FAB */}
        <View
          style={[
            styles.glassOuter,
            {
              right: 16,
              bottom: tabBarHeight + SHEET_MIN_HEIGHT + 16,
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

        {/* Zone alert banner */}
        <ZoneAlertBanner ref={bannerRef} />
      </Animated.View>

      {/* Swipable bottom sheet */}
      <BottomSheet
        minHeight={SHEET_MIN_HEIGHT}
        maxHeight={sheetMaxHeight}
        bottomOffset={tabBarHeight}
        expanded={sheetExpanded}
        onStateChange={setSheetExpanded}
        header={
          <View style={{ gap: 10 }}>
            {/* Toggle */}
            <Toggle
              value={enabled}
              onValueChange={setEnabled}
              size="sm"
              enabledLabel="En service"
              disabledLabel="Hors service"
            />

            {/* Mode selector */}
            <PatrolModeSelector
              value={mapMode}
              onChange={(mode) => {
                setMapMode(mode);
                setSheetExpanded(true);
                if (mode === "patrol" && patrol.phase === "idle") {
                  patrol.selectRoute(mockPatrolRoutes[0]);
                  patrol.clearSelection();
                }
              }}
            />
          </View>
        }
      >
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

        {/* Divider */}
        <View
          style={{
            backgroundColor: colors.borderSubtle,
            height: StyleSheet.hairlineWidth,
            marginBottom: 10,
          }}
        />

        {/* Content area based on mode */}
        {mapMode === "zones" ? (
          <>
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
                    {coords!.latitude.toFixed(6)}°
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
                    {coords!.longitude.toFixed(6)}°
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
                    ±{Math.round(coords!.accuracy ?? 0)}m
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Zone list */}
            {isActive ? (
              <ScrollView
                style={{ flex: 1, marginTop: 8 }}
                showsVerticalScrollIndicator={true}
              >
                <ZoneListCard
                  statuses={statuses}
                  onZonePress={(zone) => {
                    setSelectedZoneId((prev) =>
                      prev === zone.id ? null : zone.id,
                    );
                    mapRef.current?.flyTo([
                      zone.center.longitude,
                      zone.center.latitude,
                    ]);
                  }}
                  isActive={isActive}
                />
              </ScrollView>
            ) : null}
          </>
        ) : (
          /* Patrol mode content */
          <>
            {(patrol.phase === "idle" || patrol.phase === "selecting") && (
              <PatrolRouteList
                routes={mockPatrolRoutes}
                onSelect={(route) => {
                  patrol.selectRoute(route);
                  mapRef.current?.fitToPatrolRoute(route, location);
                }}
              />
            )}

            {patrol.phase === "previewing" && patrol.selectedRoute && (
              <PatrolRoutePreview
                route={patrol.selectedRoute}
                onStart={() => {
                  patrol.startPatrol();
                  if (patrol.selectedRoute) {
                    mapRef.current?.fitToPatrolRoute(
                      patrol.selectedRoute,
                      location,
                    );
                  }
                }}
                onBack={patrol.clearSelection}
              />
            )}

            {patrol.phase === "active" && patrol.selectedRoute && (
              <PatrolActivePanel
                route={patrol.selectedRoute}
                scans={patrol.checkpointScans}
                elapsedSeconds={patrol.elapsedSeconds}
                completionRate={patrol.completionRate}
                checkpointDistances={patrol.checkpointDistances}
                nextCheckpointId={patrol.nextCheckpoint?.id ?? null}
                onValidate={patrol.validateCheckpoint}
                onScanQr={() => setQrScannerVisible(true)}
                onEnd={patrol.endPatrol}
              />
            )}

            {patrol.phase === "summary" && patrol.selectedRoute && (
              <PatrolSummary
                routeName={patrol.selectedRoute.name}
                site={patrol.selectedRoute.site}
                scans={patrol.checkpointScans}
                elapsedSeconds={patrol.elapsedSeconds}
                gpsTrail={patrol.gpsTrail}
                completionRate={patrol.completionRate}
                onSave={handlePatrolSave}
              />
            )}
          </>
        )}
      </BottomSheet>

      {/* QR Scanner modal */}
      <PatrolQrScanner
        visible={qrScannerVisible}
        onScan={patrol.scanQrCheckpoint}
        onClose={() => setQrScannerVisible(false)}
      />
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
