import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { useTheme } from "@/theme";
import { getBodyFont } from "@/utils/fonts";

type MapMode = "zones" | "patrol";

interface PatrolModeSelectorProps {
  value: MapMode;
  onChange: (mode: MapMode) => void;
}

export function PatrolModeSelector({
  value,
  onChange,
}: PatrolModeSelectorProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: `${colors.muted}80` }]}>
      <ModePill
        label="Zones"
        active={value === "zones"}
        colors={colors}
        onPress={() => onChange("zones")}
      />
      <ModePill
        label="Ronde"
        active={value === "patrol"}
        colors={colors}
        onPress={() => onChange("patrol")}
      />
    </View>
  );
}

function ModePill({
  label,
  active,
  colors,
  onPress,
}: {
  label: string;
  active: boolean;
  colors: ReturnType<typeof useTheme>["colors"];
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        {
          backgroundColor: active ? colors.primary : "transparent",
        },
      ]}
    >
      <Text
        style={{
          fontSize: 12,
          fontFamily: getBodyFont("600"),
          color: active ? colors.primaryForeground : colors.mutedForeground,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  pill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: 8,
  },
});
