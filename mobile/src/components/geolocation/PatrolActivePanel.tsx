import React from "react";
import { Pressable, Text, View, ScrollView, StyleSheet } from "react-native";
import { Check, X, QrCode, Navigation } from "lucide-react-native";
import type {
  CheckpointScan,
  PatrolRoute,
} from "@/features/geolocation/patrol.types";
import { CHECKPOINT_TYPE_CONFIG } from "@/features/geolocation/patrol.types";
import { useTheme } from "@/theme";
import { getBodyFont, getHeadingFont } from "@/utils/fonts";

interface PatrolActivePanelProps {
  route: PatrolRoute;
  scans: CheckpointScan[];
  elapsedSeconds: number;
  completionRate: number;
  checkpointDistances: Map<string, number>;
  nextCheckpointId: string | null;
  onValidate: (checkpointId: string) => void;
  onScanQr: () => void;
  onEnd: () => void;
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const SCAN_STATUS_COLORS = {
  pending: "#64748b",
  scanned: "#34d399",
  missed: "#ef4444",
} as const;

const SCAN_STATUS_LABELS = {
  pending: "En attente",
  scanned: "Validé",
  missed: "Manqué",
} as const;

export function PatrolActivePanel({
  route,
  scans,
  elapsedSeconds,
  completionRate,
  checkpointDistances,
  nextCheckpointId,
  onValidate,
  onScanQr,
  onEnd,
}: PatrolActivePanelProps) {
  const { colors } = useTheme();
  const scannedCount = scans.filter((s) => s.status === "scanned").length;
  const totalCount = scans.length;
  const scanMap = new Map(scans.map((s) => [s.checkpointId, s]));

  return (
    <View style={{ gap: 10 }}>
      {/* Timer + progress */}
      <View style={styles.timerRow}>
        <Text
          style={{
            fontSize: 28,
            fontFamily: getHeadingFont(),
            color: colors.foreground,
          }}
        >
          {formatTimer(elapsedSeconds)}
        </Text>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: getBodyFont("600"),
              color: colors.foreground,
            }}
          >
            {scannedCount}/{totalCount}
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontFamily: getBodyFont("400"),
              color: colors.mutedForeground,
            }}
          >
            points de contrôle
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.primary,
              width: `${completionRate}%`,
            },
          ]}
        />
      </View>

      {/* Next checkpoint indicator */}
      {nextCheckpointId &&
        (() => {
          const nextCp = route.checkpoints.find(
            (c) => c.id === nextCheckpointId,
          );
          const dist = checkpointDistances.get(nextCheckpointId);
          if (!nextCp) return null;
          return (
            <View
              style={[
                styles.nextCpBar,
                { backgroundColor: `${colors.primary}15` },
              ]}
            >
              <Navigation size={14} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 12,
                    fontFamily: getBodyFont("600"),
                    color: colors.primary,
                  }}
                >
                  {nextCp.name}
                </Text>
              </View>
              {dist != null && (
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: getHeadingFont(),
                    color: colors.primary,
                  }}
                >
                  {dist < 1000
                    ? `${Math.round(dist)}m`
                    : `${(dist / 1000).toFixed(1)}km`}
                </Text>
              )}
            </View>
          );
        })()}

      {/* Checkpoint list */}
      <ScrollView style={{ maxHeight: 160 }} showsVerticalScrollIndicator>
        <View style={{ gap: 4 }}>
          {route.checkpoints
            .sort((a, b) => a.order - b.order)
            .map((cp) => {
              const scan = scanMap.get(cp.id);
              const status = scan?.status ?? "pending";
              const statusColor = SCAN_STATUS_COLORS[status];
              const dist = checkpointDistances.get(cp.id);
              const isNext = cp.id === nextCheckpointId;
              const typeConf = CHECKPOINT_TYPE_CONFIG[cp.type];

              return (
                <View
                  key={cp.id}
                  style={[
                    styles.cpRow,
                    {
                      backgroundColor: isNext
                        ? `${colors.primary}12`
                        : `${colors.muted}60`,
                      borderColor: isNext ? colors.primary : "transparent",
                      borderWidth: isNext ? 1 : 0,
                    },
                  ]}
                >
                  {/* Status icon */}
                  <View
                    style={[styles.statusDot, { backgroundColor: statusColor }]}
                  >
                    {status === "scanned" ? (
                      <Check size={10} color="#fff" />
                    ) : status === "missed" ? (
                      <X size={10} color="#fff" />
                    ) : (
                      <Text style={styles.orderText}>{cp.order}</Text>
                    )}
                  </View>

                  {/* Info */}
                  <View style={{ flex: 1 }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        fontFamily: getBodyFont("500"),
                        color: colors.foreground,
                      }}
                    >
                      {cp.name}
                    </Text>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <Text
                        style={{
                          fontSize: 10,
                          fontFamily: getBodyFont("400"),
                          color: statusColor,
                        }}
                      >
                        {SCAN_STATUS_LABELS[status]}
                      </Text>
                      {dist != null && status === "pending" && (
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: getBodyFont("400"),
                            color: colors.mutedForeground,
                          }}
                        >
                          {dist < 1000
                            ? `${Math.round(dist)}m`
                            : `${(dist / 1000).toFixed(1)}km`}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Validate / QR button for pending next checkpoint */}
                  {isNext && status === "pending" && (
                    <View style={{ flexDirection: "row", gap: 6 }}>
                      {(cp.type === "QR" || cp.type === "NFC") && (
                        <Pressable
                          onPress={onScanQr}
                          style={[
                            styles.actionBtn,
                            { backgroundColor: `${typeConf.color}20` },
                          ]}
                        >
                          <QrCode size={14} color={typeConf.color} />
                        </Pressable>
                      )}
                      <Pressable
                        onPress={() => onValidate(cp.id)}
                        style={[
                          styles.actionBtn,
                          { backgroundColor: `${colors.success}20` },
                        ]}
                      >
                        <Check size={14} color={colors.success} />
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })}
        </View>
      </ScrollView>

      {/* End patrol button */}
      <Pressable onPress={onEnd} style={styles.endBtn}>
        <Text
          style={{
            fontSize: 12,
            fontFamily: getBodyFont("500"),
            color: colors.destructive,
            textAlign: "center",
          }}
        >
          Terminer la ronde
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  cpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  statusDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  orderText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ffffff",
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  endBtn: {
    paddingVertical: 8,
  },
  nextCpBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});
