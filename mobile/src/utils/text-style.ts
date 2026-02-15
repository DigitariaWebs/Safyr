import { TextStyle } from "react-native";

/**
 * Helper function to get Montserrat font family based on font weight
 */
export function getMontserratFont(fontWeight?: string | number): string {
  const weight = typeof fontWeight === "string" ? fontWeight : String(fontWeight);
  
  if (weight === "700" || weight === "bold") {
    return "Montserrat-Bold";
  }
  if (weight === "600" || weight === "semibold") {
    return "Montserrat-SemiBold";
  }
  if (weight === "500" || weight === "medium") {
    return "Montserrat-Medium";
  }
  return "Montserrat-Regular";
}

/**
 * Apply Montserrat font to a style object
 */
export function applyMontserrat(style?: TextStyle | TextStyle[]): TextStyle | TextStyle[] {
  if (!style) {
    return { fontFamily: "Montserrat-Regular" };
  }
  
  if (Array.isArray(style)) {
    const flattened = style.reduce((acc, s) => ({ ...acc, ...s }), {});
    const fontWeight = flattened.fontWeight;
    return [
      ...style,
      { fontFamily: getMontserratFont(fontWeight) },
    ];
  }
  
  const fontWeight = style.fontWeight;
  return {
    ...style,
    fontFamily: getMontserratFont(fontWeight),
  };
}
