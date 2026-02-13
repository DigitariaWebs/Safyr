import * as React from "react";
import { Pressable, Text, type PressableProps, Animated } from "react-native";
import { cn } from "@/lib/cn";
import { useTheme } from "@/theme";

export type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "warning";

export type ButtonSize = "default" | "sm" | "lg";

export type ButtonProps = Omit<PressableProps, "children"> & {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  textClassName?: string;
};

function getVariantClasses(variant: ButtonVariant) {
  switch (variant) {
    case "default":
    case "primary":
      return {
        container: "bg-primary",
        text: "text-primary-foreground",
      };
    case "secondary":
      return {
        container: "bg-secondary",
        text: "text-secondary-foreground",
      };
    case "outline":
      return {
        container: "border border-border bg-transparent",
        text: "text-foreground",
      };
    case "ghost":
      return {
        container: "bg-transparent",
        text: "text-foreground",
      };
    case "destructive":
      return {
        container: "bg-destructive",
        text: "text-destructive-foreground",
      };
    case "warning":
      return {
        container: "bg-warning",
        text: "text-warning-foreground",
      };
  }
}

function getSizeClasses(size: ButtonSize) {
  switch (size) {
    case "sm":
      return { container: "h-9 px-3 rounded-xl", text: "text-sm" };
    case "lg":
      return { container: "h-12 px-6 rounded-2xl", text: "text-base" };
    case "default":
    default:
      return { container: "h-11 px-5 rounded-xl", text: "text-sm" };
  }
}

export function Button({
  children,
  variant = "default",
  size = "default",
  disabled,
  className,
  textClassName,
  ...props
}: ButtonProps) {
  const v = getVariantClasses(variant);
  const s = getSizeClasses(size);
  const { colors, scheme } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // Enhanced glow effect for primary buttons in dark mode
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [scheme === "dark" ? 0.4 : 0.1, scheme === "dark" ? 0.7 : 0.25],
  });

  const isPrimary = variant === "default" || variant === "primary";

  // Get text color based on variant and theme
  const getTextColor = () => {
    switch (variant) {
      case "default":
      case "primary":
        return colors.primaryForeground; // White text on primary buttons
      case "secondary":
        return colors.secondaryForeground;
      case "outline":
      case "ghost":
        return colors.foreground; // White text in dark mode
      case "destructive":
        return colors.destructiveForeground;
      case "warning":
        return colors.foreground; // White text on warning buttons in dark mode
      default:
        return colors.foreground;
    }
  };

  // Enhanced glow for outline and ghost buttons
  const buttonGlowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [scheme === "dark" ? 0.3 : 0.1, scheme === "dark" ? 0.6 : 0.2],
  });

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        shadowColor: isPrimary ? colors.primary : (variant === "outline" || variant === "ghost" ? colors.primary : "transparent"),
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: isPrimary ? glowOpacity : (variant === "outline" || variant === "ghost" ? buttonGlowOpacity : 0),
        shadowRadius: isPrimary ? 20 : (variant === "outline" || variant === "ghost" ? 16 : 0),
        elevation: isPrimary ? 12 : (variant === "outline" || variant === "ghost" ? 8 : 0),
      }}
    >
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={cn(
          "items-center justify-center",
          v.container,
          s.container,
          disabled ? "opacity-50" : "",
          className,
        )}
        style={{
          opacity: disabled ? 0.5 : 1,
        }}
        {...props}
      >
        <Text 
          className={cn("font-semibold", s.text, textClassName)}
          style={{ color: getTextColor() }}
        >
          {children}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
