export const EXPIRING_WINDOW_DAYS = 30;

export function computeExpiryStatus(
  expiryDate: Date | null | undefined,
): string {
  if (!expiryDate) return "valid";
  const now = Date.now();
  const expiry = expiryDate.getTime();
  if (expiry < now) return "expired";
  if (expiry < now + EXPIRING_WINDOW_DAYS * 24 * 60 * 60 * 1000)
    return "expiring";
  return "valid";
}
