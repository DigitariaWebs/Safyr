import * as React from "react";
import { View, type ViewProps, Animated } from "react-native";
import { cn } from "@/lib/cn";
import { useTheme } from "@/theme";

export type CardProps = ViewProps & {
  className?: string;
  animated?: boolean;
};

export function Card({ className, style, animated = true, ...props }: CardProps) {
  const { scheme, colors } = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.98)).current;

  React.useEffect(() => {
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
  }, [animated]);

  const cardStyle = animated
    ? {
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }
    : {};

  // Modern card styling with cyan accents
  const cardBackgroundColor = scheme === "dark" 
    ? colors.surface  // Modern dark blue-cyan surface
    : colors.card;
  
  const cardBorderColor = scheme === "dark"
    ? colors.borderPrimary  // Vibrant cyan border
    : colors.borderPrimary;  // Cyan border for light theme too

  return (
    <Animated.View
      className={cn(
        "rounded-2xl p-5",
        className
      )}
      style={[
        {
          backgroundColor: cardBackgroundColor,
          borderWidth: 2,
          borderColor: cardBorderColor,
          // Modern glow effect with vibrant cyan
          shadowColor: scheme === "dark" ? colors.primary : colors.primary,
          shadowOffset: { width: 0, height: scheme === "dark" ? 4 : 2 },
          shadowOpacity: scheme === "dark" ? 0.7 : 0.15,
          shadowRadius: scheme === "dark" ? 24 : 8,
          elevation: scheme === "dark" ? 12 : 4,
        },
        cardStyle,
        style,
      ]}
      {...props}
    />
  );
}
