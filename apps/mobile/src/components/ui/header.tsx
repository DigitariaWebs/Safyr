import * as React from "react";
import { Text, View, type ViewProps, Platform, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/cn";
import { useTheme } from "@/theme";
import { getHeadingFont, getBodyFont } from "@/utils/fonts";

export type HeaderProps = ViewProps & {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  left?: React.ReactNode;
  className?: string;
};

export function Header({
  title,
  subtitle,
  right,
  left,
  className,
  ...props
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const paddingTop = Math.max(insets.top + 8, Platform.OS === "ios" ? 12 : 16);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(-10)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <Animated.View
      accessibilityRole="header"
      className={cn(
        "flex-row items-center justify-between px-4 pb-3",
        "border-b",
        className,
      )}
      style={{
        paddingTop,
        backgroundColor: colors.background,
        borderBottomColor: colors.border,
        borderBottomWidth: 1,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
      }}
      {...props}
    >
      <View className="flex-row items-center gap-3 flex-1">
        {left}
        <View className="flex-1">
          <Text
            className="text-2xl font-bold"
            style={{ color: colors.foreground, fontFamily: getHeadingFont() }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              className="mt-0.5 text-sm"
              style={{
                color: colors.foreground,
                fontFamily: getBodyFont("400"),
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {right ? <View className="ml-3">{right}</View> : null}
    </Animated.View>
  );
}
