import * as React from "react";
import { TextInput, View, type TextInputProps, Animated } from "react-native";
import { cn } from "@/lib/cn";
import { useTheme } from "@/theme";

export type InputProps = TextInputProps & {
  className?: string;
  containerClassName?: string;
};

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, containerClassName, onFocus, onBlur, ...props }, ref) => {
    const { colors, scheme } = useTheme();
    const [isFocused, setIsFocused] = React.useState(false);
    const glowAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handleFocus = (e: any) => {
      setIsFocused(true);
      // Use non-native driver for all animations since shadowOpacity requires it
      Animated.parallel([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.01,
          tension: 200,
          friction: 3,
          useNativeDriver: false, // Changed to false to avoid conflict with shadowOpacity
        }),
      ]).start();
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      // Use non-native driver for all animations since shadowOpacity requires it
      Animated.parallel([
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 200,
          friction: 3,
          useNativeDriver: false, // Changed to false to avoid conflict with shadowOpacity
        }),
      ]).start();
      onBlur?.(e);
    };

    const glowOpacity = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, scheme === "dark" ? 0.4 : 0.2],
    });

    const borderColor = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [
        scheme === "dark" ? colors.border : colors.border,
        scheme === "dark" ? colors.borderPrimary : colors.primary,
      ],
    });

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: glowOpacity,
          shadowRadius: 12,
          elevation: isFocused ? 6 : 0,
        }}
      >
        <Animated.View
          className={cn(
            "h-12 flex-row items-center rounded-xl border bg-background px-4",
            containerClassName,
          )}
          style={{
            borderColor,
            borderWidth: 1.5,
          }}
        >
                      <TextInput
                        ref={ref}
                        placeholderTextColor={colors.placeholder}
                        className={cn(
                          "flex-1 text-base text-foreground",
                          "leading-5",
                          className,
                        )}
                        style={[
                          { fontFamily: "Montserrat-Regular" },
                          props.style,
                        ]}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        {...props}
                      />
        </Animated.View>
      </Animated.View>
    );
  },
);
Input.displayName = "Input";
