import React from "react";
import { Pressable, Text, View, ScrollView, StyleSheet } from "react-native";
import { ArrowLeft, MapPin, Clock, Ruler, Play } from "lucide-react-native";
import type { PatrolRoute } from "@/features/geolocation/patrol.types";
import { CHECKPOINT_TYPE_CONFIG } from "@/features/geolocation/patrol.types";
import { useTheme } from "@/theme";
import { getBodyFont, getHeadingFont } from "@/utils/fonts";

interface PatrolRoutePreviewProps {
  route: PatrolRoute;
  onStart: () => void;
  onBack: () => void;
}

export function PatrolRoutePreview({
  route,
  onStart,
  onBack,
}: PatrolRoutePreviewProps) {
  const { colors } = useTheme();

  return (
    <View style={{ gap: 10 }}>
      {/* Back + Title */}
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={8}>
          <ArrowLeft size={18} color={colors.foreground} />
        </Pressable>
        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            fontSize: 15,
            fontFamily: getHeadingFont(),
            color: colors.foreground,
          }}
        >
          {route.name}
        </Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <MapPin size={12} color={colors.mutedForeground} />
          <Text style={[styles.statText, { color: colors.mutedForeground }]}>
            {route.site}
          </Text>
        </View>
        <View style={styles.stat}>
          <Clock size={12} color={colors.mutedForeground} />
          <Text style={[styles.statText, { color: colors.mutedForeground }]}>
            ~{route.estimatedDurationMinutes} min
          </Text>
        </View>
        <View style={styles.stat}>
          <Ruler size={12} color={colors.mutedForeground} />
          <Text style={[styles.statText, { color: colors.mutedForeground }]}>
            {Math.round(route.distanceMeters)}m
          </Text>
        </View>
      </View>

      {/* Checkpoint list */}
      <ScrollView style={{ maxHeight: 140 }} showsVerticalScrollIndicator>
        <View style={{ gap: 4 }}>
          {route.checkpoints
            .sort((a, b) => a.order - b.order)
            .map((cp) => {
              const typeConf = CHECKPOINT_TYPE_CONFIG[cp.type];
              return (
                <View
                  key={cp.id}
                  style={[
                    styles.cpRow,
                    { backgroundColor: `${colors.muted}60` },
                  ]}
                >
                  <View
                    style={[
                      styles.orderBadge,
                      { backgroundColor: `${colors.primary}25` },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontFamily: getBodyFont("700"),
                        color: colors.primary,
                      }}
                    >
                      {cp.order}
                    </Text>
                  </View>
                  <Text
                    numberOfLines={1}
                    style={{
                      flex: 1,
                      fontSize: 12,
                      fontFamily: getBodyFont("500"),
                      color: colors.foreground,
                    }}
                  >
                    {cp.name}
                  </Text>
                  <View
                    style={[
                      styles.typePill,
                      { backgroundColor: `${typeConf.color}20` },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 9,
                        fontFamily: getBodyFont("600"),
                        color: typeConf.color,
                      }}
                    >
                      {typeConf.label}
                    </Text>
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>

      {/* Start button */}
      <Pressable
        onPress={onStart}
        style={[styles.startBtn, { backgroundColor: colors.primary }]}
      >
        <Play size={16} color={colors.primaryForeground} />
        <Text
          style={{
            fontSize: 14,
            fontFamily: getBodyFont("600"),
            color: colors.primaryForeground,
          }}
        >
          Commencer la ronde
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 11,
    fontFamily: "SpaceGrotesk_400Regular",
  },
  cpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  orderBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  typePill: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
    paddingVertical: 12,
  },
});
