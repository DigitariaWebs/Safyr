/**
 * Get the heading font family (Aldrich)
 */
export function getHeadingFont(): string {
  return "Aldrich-Regular";
}

/**
 * Get the body font family (Space Grotesk) based on weight
 */
export function getBodyFont(fontWeight?: string | number): string {
  const weight = typeof fontWeight === "string" ? fontWeight : String(fontWeight);

  if (weight === "700" || weight === "bold") {
    return "SpaceGrotesk-Bold";
  }
  if (weight === "600" || weight === "semibold") {
    return "SpaceGrotesk-SemiBold";
  }
  if (weight === "500" || weight === "medium") {
    return "SpaceGrotesk-Medium";
  }
  return "SpaceGrotesk-Regular";
}
