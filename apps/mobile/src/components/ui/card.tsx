import React, { useRef, useEffect, useMemo } from "react";
import { Animated, ViewProps } from "react-native";
import { useTheme } from "@/theme";
import { cn } from "@/lib/cn";

interface CardProps extends ViewProps {
  className?: string;
  animated?: boolean;
}

export function Card({
  className,
  style,
  animated = true,
  children,
  ...props
}: CardProps) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const scaleAnim = useRef(new Animated.Value(animated ? 0.98 : 1)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animated, fadeAnim, scaleAnim]);

  const cardBackground = useMemo(() => colors.card + "CC", [colors.card]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          borderWidth: 1,
          borderColor: colors.borderSubtle,
          backgroundColor: cardBackground,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 3,
        },
        style,
      ]}
      className={cn("rounded-2xl overflow-hidden", className)}
      {...props}
    >
      {children}
    </Animated.View>
  );
}
