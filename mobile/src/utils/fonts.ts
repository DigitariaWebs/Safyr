/**
 * Helper function to get the correct Montserrat font family based on font weight
 * Use this when you need to apply Montserrat to Text components
 */
export function getMontserratFont(fontWeight?: string | number): string {
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
}

/**
 * Default style object with Montserrat font family
 * Use this as a base style for Text components
 */
export const montserratStyle = {
  fontFamily: "Montserrat-Regular",
} as const;
