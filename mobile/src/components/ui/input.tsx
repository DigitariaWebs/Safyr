import * as React from "react";
import { TextInput, type TextInputProps, Animated } from "react-native";
import { cn } from "@/lib/cn";
import { useTheme } from "@/theme";
import { getBodyFont } from "@/utils/fonts";

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

    const handleFocus = (
      e: Parameters<NonNullable<TextInputProps["onFocus"]>>[0],
    ) => {
      setIsFocused(true);
      // JS driver required — scale and shadow share the same Animated.View
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.01,
          tension: 200,
          friction: 3,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
      onFocus?.(e);
    };

    const handleBlur = (
      e: Parameters<NonNullable<TextInputProps["onBlur"]>>[0],
    ) => {
      setIsFocused(false);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 200,
          friction: 3,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
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
        colors.primary,
      ],
    });

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: glowOpacity,
          shadowRadius: 6,
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
            borderWidth: 1,
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
            style={[{ fontFamily: getBodyFont("400") }, props.style]}
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
