import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import {
  CheckCircle,
  XCircle,
  Clock,
  Ruler,
  Target,
} from "lucide-react-native";
import type { CheckpointScan } from "@/features/geolocation/patrol.types";
import { useTheme } from "@/theme";
import { getBodyFont, getHeadingFont } from "@/utils/fonts";
import { computeTrailDistance } from "@/features/geolocation/geo.utils";

interface PatrolSummaryProps {
  routeName: string;
  site: string;
  scans: CheckpointScan[];
  elapsedSeconds: number;
  gpsTrail: { coords: [number, number]; timestamp: string }[];
  completionRate: number;
  onSave: () => void;
}

export function PatrolSummary({
  routeName,
  site,
  scans,
  elapsedSeconds,
  gpsTrail,
  completionRate,
  onSave,
}: PatrolSummaryProps) {
  const { colors } = useTheme();
  const scannedCount = scans.filter((s) => s.status === "scanned").length;
  const totalCount = scans.length;
  const isComplete = scannedCount === totalCount;
  const distance = computeTrailDistance(gpsTrail);
  const durationMin = Math.floor(elapsedSeconds / 60);

  return (
    <View style={{ gap: 12 }}>
      {/* Status badge */}
      <View style={styles.statusRow}>
        {isComplete ? (
          <CheckCircle size={24} color={colors.success} />
        ) : (
          <XCircle size={24} color={colors.warning} />
        )}
        <View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: getHeadingFont(),
              color: isComplete ? colors.success : colors.warning,
            }}
          >
            {isComplete ? "Ronde complète" : "Ronde incomplète"}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: getBodyFont("400"),
              color: colors.mutedForeground,
            }}
          >
            {routeName} — {site}
          </Text>
        </View>
      </View>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        <View
          style={[styles.statCard, { backgroundColor: `${colors.muted}80` }]}
        >
          <Clock size={14} color={colors.primary} />
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {durationMin} min
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            Durée
          </Text>
        </View>
        <View
          style={[styles.statCard, { backgroundColor: `${colors.muted}80` }]}
        >
          <Ruler size={14} color={colors.primary} />
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {distance < 1000
              ? `${Math.round(distance)}m`
              : `${(distance / 1000).toFixed(1)}km`}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            Distance
          </Text>
        </View>
        <View
          style={[styles.statCard, { backgroundColor: `${colors.muted}80` }]}
        >
          <Target size={14} color={colors.primary} />
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {scannedCount}/{totalCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
            Validés
          </Text>
        </View>
      </View>

      {/* Completion rate */}
      <View style={{ alignItems: "center", gap: 4 }}>
        <Text
          style={{
            fontSize: 32,
            fontFamily: getHeadingFont(),
            color: isComplete ? colors.success : colors.warning,
          }}
        >
          {completionRate}%
        </Text>
        <Text
          style={{
            fontSize: 11,
            fontFamily: getBodyFont("400"),
            color: colors.mutedForeground,
          }}
        >
          Taux de complétion
        </Text>
      </View>

      {/* Save button */}
      <Pressable
        onPress={onSave}
        style={[styles.saveBtn, { backgroundColor: colors.primary }]}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: getBodyFont("600"),
            color: colors.primaryForeground,
          }}
        >
          Enregistrer
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 8,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  statValue: {
    fontSize: 15,
    fontFamily: "Aldrich_400Regular",
  },
  statLabel: {
    fontSize: 10,
    fontFamily: "SpaceGrotesk_400Regular",
  },
  saveBtn: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 12,
  },
});
