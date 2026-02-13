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

  // Dark blue background with light blue border for all cards
  const cardBackgroundColor = scheme === "dark" 
    ? colors.surface  // Dark blue surface (220 30% 12%)
    : colors.card;
  
  const cardBorderColor = scheme === "dark"
    ? colors.primary  // Cyan-blue border (195 85% 65%)
    : colors.border;

  return (
    <Animated.View
      className={cn("rounded-2xl p-5", className)}
      style={[
        {
          backgroundColor: cardBackgroundColor,
          borderWidth: 1.5,
          borderColor: cardBorderColor,
          // Enhanced glow effect with primary cyan-blue color
          shadowColor: scheme === "dark" ? colors.primary : "#000",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: scheme === "dark" ? 0.6 : 0.08,
          shadowRadius: scheme === "dark" ? 20 : 4,
          elevation: scheme === "dark" ? 10 : 2,
        },
        cardStyle,
        style,
      ]}
      {...props}
    />
  );
}
