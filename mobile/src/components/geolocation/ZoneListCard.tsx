import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/theme";
import { getBodyFont, getHeadingFont } from "@/utils/fonts";
import type { ZoneStatus } from "@/features/geolocation/useMultiZoneMonitor";
import type { WorkZone } from "@/features/geolocation/workZone";

interface ZoneListCardProps {
  statuses: Map<string, ZoneStatus>;
  onZonePress: (zone: WorkZone) => void;
  isActive: boolean;
}

export function ZoneListCard({
  statuses,
  onZonePress,
  isActive,
}: ZoneListCardProps) {
  const { colors } = useTheme();

  // Force re-render every 60s so "Hors zone depuis X min" stays current
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!isActive) return;
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, [isActive]);

  const zones = useMemo(() => [...statuses.values()], [statuses]);
  const showPlaceholder = !isActive || zones.length === 0;

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          { color: colors.foreground, fontFamily: getHeadingFont() },
        ]}
      >
        Mes zones
      </Text>

      {showPlaceholder ? (
        <Text
          style={[
            styles.placeholder,
            { color: colors.mutedForeground, fontFamily: getBodyFont("400") },
          ]}
        >
          —
        </Text>
      ) : (
        zones.map((status, index) => {
          const isLast = index === zones.length - 1;
          const distText =
            status.distanceMeters != null
              ? `${Math.round(status.distanceMeters)}m`
              : "—";

          const outsideMinutes =
            status.outside && status.outsideSinceMs != null
              ? Math.floor((Date.now() - status.outsideSinceMs) / 60_000)
              : null;

          return (
            <React.Fragment key={status.zoneId}>
              <Pressable
                onPress={() => onZonePress(status.zone)}
                style={({ pressed }) => [
                  styles.row,
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Text
                  style={[
                    styles.label,
                    {
                      color: colors.foreground,
                      fontFamily: getBodyFont("500"),
                    },
                  ]}
                  numberOfLines={1}
                >
                  {status.zone.label}
                </Text>

                <Text
                  style={[
                    styles.distance,
                    {
                      color: colors.mutedForeground,
                      fontFamily: getBodyFont("400"),
                    },
                  ]}
                >
                  {distText}
                </Text>

                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: status.outside
                          ? colors.warning
                          : colors.success,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: status.outside ? colors.warning : colors.success,
                        fontFamily: getBodyFont("400"),
                      },
                    ]}
                  >
                    {status.outside ? "Dehors" : "Dedans"}
                  </Text>
                </View>
              </Pressable>

              {outsideMinutes != null && outsideMinutes >= 1 && (
                <Text
                  style={[
                    styles.outsideSince,
                    { color: colors.warning, fontFamily: getBodyFont("400") },
                  ]}
                >
                  Hors zone depuis {outsideMinutes} min
                </Text>
              )}

              {!isLast && (
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: colors.borderSubtle },
                  ]}
                />
              )}
            </React.Fragment>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    fontSize: 13,
  },
  placeholder: {
    fontSize: 12,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
  },
  label: {
    fontSize: 12,
    flex: 1,
  },
  distance: {
    fontSize: 11,
    marginHorizontal: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
  },
  outsideSince: {
    fontSize: 10,
    paddingTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
