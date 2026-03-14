import * as React from "react";
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from "react-native";
import { getBodyFont } from "@/utils/fonts";

export type TextProps = RNTextProps & {
  className?: string;
};

export const Text = React.forwardRef<RNText, TextProps>(
  ({ style, className, ...props }, ref) => {
    const flattenedStyle = StyleSheet.flatten(style);
    const fontFamily = getBodyFont(flattenedStyle?.fontWeight);

    const mergedStyle = StyleSheet.flatten([
      { fontFamily },
      style,
    ]);

    return <RNText ref={ref} style={mergedStyle} {...props} />;
  }
);

Text.displayName = "Text";
