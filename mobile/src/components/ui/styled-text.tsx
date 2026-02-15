import * as React from "react";
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from "react-native";
import { getMontserratFont } from "@/utils/text-style";

export type StyledTextProps = RNTextProps & {
  className?: string;
};

/**
 * Styled Text component that automatically applies Montserrat font
 * Use this instead of Text from react-native to ensure Montserrat is applied
 */
export const StyledText = React.forwardRef<RNText, StyledTextProps>(
  ({ style, className, ...props }, ref) => {
    // Extract fontWeight from style to determine which Montserrat variant to use
    const flattenedStyle = StyleSheet.flatten(style);
    const fontWeight = flattenedStyle?.fontWeight;
    const fontFamily = getMontserratFont(fontWeight);
    
    // Merge styles to ensure fontFamily is applied
    const mergedStyle = StyleSheet.flatten([
      { fontFamily },
      style,
    ]);

    return <RNText ref={ref} style={mergedStyle} {...props} />;
  }
);

StyledText.displayName = "StyledText";
