import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { CheckpointType } from "@/features/geolocation/patrol.types";
import { CHECKPOINT_TYPE_CONFIG } from "@/features/geolocation/patrol.types";

const STATUS_COLORS = {
  pending: "#64748b",
  scanned: "#34d399",
  missed: "#ef4444",
} as const;

interface CheckpointMarkerProps {
  order: number;
  status: "pending" | "scanned" | "missed";
  type: CheckpointType;
  isNext?: boolean;
}

export const CheckpointMarker = React.memo(function CheckpointMarker({
  order,
  status,
  type,
  isNext,
}: CheckpointMarkerProps) {
  const color = STATUS_COLORS[status];
  const typeColor = CHECKPOINT_TYPE_CONFIG[type].color;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.circle,
          {
            backgroundColor: color,
            borderColor: isNext ? "#22d3ee" : "transparent",
            borderWidth: isNext ? 3 : 0,
          },
        ]}
      >
        <Text style={styles.orderText}>{order}</Text>
      </View>
      {/* Type badge */}
      <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
        <Text style={styles.typeText}>{type}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  orderText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  typeBadge: {
    position: "absolute",
    bottom: 0,
    right: -2,
    borderRadius: 6,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  typeText: {
    fontSize: 7,
    fontWeight: "700",
    color: "#ffffff",
  },
});
