import React from "react";
import { Pressable, Text, View, ScrollView, StyleSheet } from "react-native";
import { MapPin, Clock, Footprints } from "lucide-react-native";
import type { PatrolRoute } from "@/features/geolocation/patrol.types";
import { useTheme } from "@/theme";
import { getBodyFont, getHeadingFont } from "@/utils/fonts";

interface PatrolRouteListProps {
  routes: PatrolRoute[];
  onSelect: (route: PatrolRoute) => void;
}

export function PatrolRouteList({ routes, onSelect }: PatrolRouteListProps) {
  const { colors } = useTheme();

  if (routes.length === 0) {
    return (
      <View style={styles.empty}>
        <Text
          style={{
            fontSize: 13,
            color: colors.mutedForeground,
            fontFamily: getBodyFont("400"),
            textAlign: "center",
          }}
        >
          Aucune ronde assignée
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ maxHeight: 220 }} showsVerticalScrollIndicator={true}>
      <View style={{ gap: 8 }}>
        {routes.map((route) => (
          <Pressable
            key={route.id}
            onPress={() => onSelect(route)}
            style={[
              styles.card,
              {
                backgroundColor: `${colors.muted}60`,
                borderColor: colors.borderSubtle,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <Footprints size={14} color={colors.primary} />
              <Text
                numberOfLines={1}
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontFamily: getHeadingFont(),
                  color: colors.foreground,
                }}
              >
                {route.name}
              </Text>
            </View>

            <View style={styles.cardMeta}>
              <View style={styles.metaItem}>
                <MapPin size={11} color={colors.mutedForeground} />
                <Text
                  style={[styles.metaText, { color: colors.mutedForeground }]}
                >
                  {route.site}
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Clock size={11} color={colors.mutedForeground} />
                <Text
                  style={[styles.metaText, { color: colors.mutedForeground }]}
                >
                  {route.estimatedDurationMinutes} min
                </Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: `${colors.primary}20` },
                ]}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: getBodyFont("600"),
                    color: colors.primary,
                  }}
                >
                  {route.checkpoints.length} points
                </Text>
              </View>
              <View
                style={[styles.badge, { backgroundColor: `${colors.muted}` }]}
              >
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: getBodyFont("500"),
                    color: colors.mutedForeground,
                  }}
                >
                  {route.frequency}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: getBodyFont("400"),
                  color: colors.mutedForeground,
                  marginLeft: "auto",
                }}
              >
                {Math.round(route.distanceMeters)}m
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  empty: {
    paddingVertical: 24,
    alignItems: "center",
  },
  card: {
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    gap: 6,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardMeta: {
    flexDirection: "row",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontFamily: "SpaceGrotesk_400Regular",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
