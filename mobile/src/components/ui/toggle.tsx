import * as React from "react";
import { Pressable, Text, View, Animated } from "react-native";
import { cn } from "@/lib/cn";
import { useTheme } from "@/theme";
import { getMontserratFont } from "@/utils/text-style";
import { Ionicons } from "@expo/vector-icons";

export type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  enabledLabel?: string;
  disabledLabel?: string;
  enabledIcon?: keyof typeof Ionicons.glyphMap;
  disabledIcon?: keyof typeof Ionicons.glyphMap;
  className?: string;
  size?: "sm" | "default" | "lg";
};

export function Toggle({
  value,
  onValueChange,
  enabledLabel = "En service",
  disabledLabel = "Hors service",
  enabledIcon = "checkmark-circle",
  disabledIcon = "close-circle",
  className,
  size = "default",
}: ToggleProps) {
  const { colors, scheme } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const slideAnim = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: value ? 1 : 0,
      tension: 200,
      friction: 20,
      useNativeDriver: true,
    }).start();
  }, [value]);

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

  const sizeClasses = {
    sm: { container: "h-10 px-4", text: "text-sm", icon: 16 },
    default: { container: "h-12 px-5", text: "text-sm", icon: 18 },
    lg: { container: "h-14 px-6", text: "text-base", icon: 20 },
  };

  const s = sizeClasses[size];

  const backgroundColor = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.destructive, colors.success],
  });

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Pressable
      onPress={handlePress}
      className={cn(
        "flex-row items-center rounded-full overflow-hidden",
        s.container,
        className
      )}
      style={{
        backgroundColor: value ? colors.success : colors.destructive,
        shadowColor: value ? colors.success : colors.destructive,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
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
          <Ionicons
            name={value ? enabledIcon : disabledIcon}
            size={s.icon}
            color={colors.primaryForeground}
          />
          <Text
            className={cn("font-semibold", s.text)}
            style={{
              color: colors.primaryForeground,
              fontFamily: getMontserratFont("600"),
            }}
          >
            {value ? enabledLabel : disabledLabel}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}
