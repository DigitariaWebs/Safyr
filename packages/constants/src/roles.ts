export const SAFYR_ROLES = {
  OWNER: "owner",
} as const;

export type SafyrRole = (typeof SAFYR_ROLES)[keyof typeof SAFYR_ROLES];
