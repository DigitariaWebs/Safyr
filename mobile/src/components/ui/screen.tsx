import * as React from "react";
import { View, type ViewProps, Animated } from "react-native";
import { cn } from "@/lib/cn";
import { useTheme } from "@/theme";
import { colors as defaultColors } from "@/theme/colors";

export type ScreenProps = ViewProps & {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

export function Screen({ className, contentClassName, children, ...props }: ScreenProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  // Get theme colors with fallback
  let themeColors;
  try {
    const theme = useTheme();
    themeColors = theme.colors;
  } catch (error) {
    themeColors = defaultColors.dark; // Default to dark theme
  }

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{ 
        flex: 1,
        backgroundColor: themeColors.background,
        opacity: fadeAnim,
      }}
      className={cn(className)}
    >
      <View
        className={cn("flex-1", contentClassName)}
        {...props}
      >
        {children}
      </View>
    </Animated.View>
  );
}
