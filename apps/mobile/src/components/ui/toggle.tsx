import * as React from "react";
import { Pressable, Text, View, Animated } from "react-native";
import { cn } from "@/lib/cn";
import { useTheme } from "@/theme";
import { getBodyFont } from "@/utils/fonts";
import { CheckCircle, XCircle } from "lucide-react-native";

export type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  enabledLabel?: string;
  disabledLabel?: string;
  enabledIcon?: React.ComponentType<{ size: number; color: string }>;
  disabledIcon?: React.ComponentType<{ size: number; color: string }>;
  className?: string;
  size?: "sm" | "default" | "lg";
};

const SIZE_CONFIG = {
  sm: { container: "h-10 px-4", text: "text-sm", icon: 16 },
  default: { container: "h-12 px-5", text: "text-sm", icon: 18 },
  lg: { container: "h-14 px-6", text: "text-base", icon: 20 },
} as const;

export function Toggle({
  value,
  onValueChange,
  enabledLabel = "En service",
  disabledLabel = "Hors service",
  enabledIcon: EnabledIcon = CheckCircle,
  disabledIcon: DisabledIcon = XCircle,
  className,
  size = "default",
}: ToggleProps) {
  const { colors } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();
    onValueChange(!value);
  };

  const s = SIZE_CONFIG[size];

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={value ? enabledLabel : disabledLabel}
      className={cn(
        "flex-row items-center rounded-full overflow-hidden",
        s.container,
        className,
      )}
      style={{
        backgroundColor: value ? colors.success : colors.destructive,
        shadowColor: value ? colors.success : colors.destructive,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8,
      }}
    >
      <Animated.View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          transform: [{ scale: scaleAnim }],
        }}
      >
        <View className="flex-row items-center gap-2">
          {value ? (
            <EnabledIcon size={s.icon} color={colors.primaryForeground} />
          ) : (
            <DisabledIcon size={s.icon} color={colors.primaryForeground} />
          )}
          <Text
            className={cn("font-semibold", s.text)}
            style={{
              color: colors.primaryForeground,
              fontFamily: getBodyFont("600"),
            }}
          >
            {value ? enabledLabel : disabledLabel}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}
