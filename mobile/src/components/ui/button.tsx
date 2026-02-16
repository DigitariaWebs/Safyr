import * as React from "react";
import { Pressable, Text, View, type PressableProps, Animated } from "react-native";
import { cn } from "@/lib/cn";
import { useTheme } from "@/theme";
import { getMontserratFont } from "@/utils/text-style";

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
        text: "", // Remove Tailwind text class to avoid conflicts
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
    // Use non-native driver for all animations since shadowOpacity requires it
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: false, // Changed to false to avoid conflict with shadowOpacity
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
    // Use non-native driver for all animations since shadowOpacity requires it
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: false, // Changed to false to avoid conflict with shadowOpacity
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

  // Enhanced glow effect for primary buttons - more vibrant cyan
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [scheme === "dark" ? 0.5 : 0.15, scheme === "dark" ? 0.85 : 0.35],
  });

  const isPrimary = variant === "default" || variant === "primary";

  // Helper function to check if a color is light (brightness > 50%)
  const isLightColor = (hex: string): boolean => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };

  // Get text color based on variant and theme
  const getTextColor = () => {
    switch (variant) {
      case "default":
      case "primary":
        return colors.primaryForeground; // White text on primary buttons
      case "secondary":
        // Secondary buttons always have light background, so always use black text
        return colors.secondaryForeground; // This is now black text
      case "outline":
      case "ghost":
        // Black text in light mode, white text in dark mode
        return scheme === "light" ? colors.text : colors.foreground;
      case "destructive":
        return colors.destructiveForeground;
      case "warning":
        // Check if warning background is light - if so, use black text
        const warningIsLight = isLightColor(colors.warning);
        return warningIsLight ? colors.text : colors.foreground;
      default:
        return scheme === "light" ? colors.text : colors.foreground;
    }
  };

  // Enhanced glow for outline and ghost buttons - modern cyan glow
  const buttonGlowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [scheme === "dark" ? 0.4 : 0.12, scheme === "dark" ? 0.75 : 0.3],
  });

  // Check if children is a simple string
  const isString = typeof children === "string";

  return (
    <Animated.View
      style={{
        // Shadow/glow animation (non-native driver)
        shadowColor: isPrimary ? colors.primary : (variant === "outline" || variant === "ghost" ? colors.primary : "transparent"),
        shadowOffset: { width: 0, height: isPrimary ? 4 : 2 },
        shadowOpacity: isPrimary ? glowOpacity : (variant === "outline" || variant === "ghost" ? buttonGlowOpacity : 0),
        shadowRadius: isPrimary ? 24 : (variant === "outline" || variant === "ghost" ? 18 : 0),
        elevation: isPrimary ? 16 : (variant === "outline" || variant === "ghost" ? 10 : 0),
        transform: [{ scale: scaleAnim }],
      }}
    >
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={cn(
          "items-center justify-center flex-row",
          v.container,
          s.container,
          disabled ? "opacity-50" : "",
          className,
        )}
        style={[
          {
            opacity: disabled ? 0.5 : 1,
            // Force background color for secondary buttons to ensure correct text color
            ...(variant === "secondary" ? { backgroundColor: colors.secondary } : {}),
          },
          props.style,
        ]}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        {...(props as any)}
      >
          {isString ? (
            <Text 
              className={cn("font-semibold", s.text, textClassName)}
              style={{ color: getTextColor(), fontFamily: getMontserratFont("600") }}
            >
              {children}
            </Text>
          ) : (
            <View className="flex-row items-center justify-center">
              {React.Children.map(children, (child, index) => {
                if (React.isValidElement(child)) {
                  const childType = child.type as any;
                  const childProps = child.props as any;
                  
                  // Check if it's a Text component
                  const isTextComponent = 
                    childType === Text ||
                    (childType?.displayName && childType.displayName.includes("Text")) ||
                    (typeof childType === "function" && (childType.name === "Text" || childType.displayName === "Text"));
                  
                  // Check if it's an Ionicons component - Ionicons always have a 'name' prop
                  const isIonicons = childProps && typeof childProps.name === "string";
                  
                  if (isTextComponent) {
                    // Force text color and font family - put it last to override any existing styles
                    const textColor = getTextColor();
                    // Extract fontWeight from existing style to determine Montserrat variant
                    const existingStyle = Array.isArray(childProps.style) 
                      ? childProps.style.reduce((acc, s) => ({ ...acc, ...s }), {})
                      : childProps.style || {};
                    const fontWeight = existingStyle.fontWeight || "600"; // Default to semibold for buttons
                    const fontFamily = getMontserratFont(fontWeight);
                    
                    // Merge styles properly - ensure color and fontFamily are always applied
                    const mergedStyle = Array.isArray(childProps.style)
                      ? [...childProps.style, { color: textColor, fontFamily }]
                      : childProps.style
                        ? [childProps.style, { color: textColor, fontFamily }]
                        : { color: textColor, fontFamily };
                    return React.cloneElement(child as React.ReactElement<any>, {
                      key: `text-${index}`,
                      style: mergedStyle,
                      className: cn("font-semibold", s.text, textClassName, childProps.className),
                    });
                  }
                  
                  // Apply color to Ionicons - always override color for consistency
                  if (isIonicons) {
                    const iconColor = getTextColor();
                    return React.cloneElement(child as React.ReactElement<any>, {
                      key: `icon-${index}`,
                      ...childProps,
                      color: iconColor, // Always override color
                    });
                  }
                }
                return <React.Fragment key={`child-${index}`}>{child}</React.Fragment>;
              })}
            </View>
          )}
        </Pressable>
    </Animated.View>
  );
}
