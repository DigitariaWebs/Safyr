import * as React from "react";
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from "react-native";

export type TextProps = RNTextProps & {
  className?: string;
};

// Map font weights to Montserrat font family names
const getFontFamily = (fontWeight?: string | number): string => {
  const weight = typeof fontWeight === "string" ? fontWeight : String(fontWeight);
  
  // Map common font weights to Montserrat variants
  if (weight === "700" || weight === "bold") {
    return "Montserrat-Bold";
  }
  if (weight === "600" || weight === "semibold") {
    return "Montserrat-SemiBold";
  }
  if (weight === "500" || weight === "medium") {
    return "Montserrat-Medium";
  }
  // Default to Regular
  return "Montserrat-Regular";
};

export const Text = React.forwardRef<RNText, TextProps>(
  ({ style, className, ...props }, ref) => {
    // Extract fontWeight from style to determine which Montserrat variant to use
    const flattenedStyle = StyleSheet.flatten(style);
    const fontWeight = flattenedStyle?.fontWeight;
    const fontFamily = getFontFamily(fontWeight);
    
    // Merge styles to ensure fontFamily is applied
    const mergedStyle = StyleSheet.flatten([
      { fontFamily },
      style,
    ]);

    return <RNText ref={ref} style={mergedStyle} {...props} />;
  }
);

Text.displayName = "Text";
