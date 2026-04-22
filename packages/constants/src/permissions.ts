export const SAFYR_PERMISSIONS = {
  employee: ["create", "read", "update", "delete"],
  payroll: ["read", "generate", "approve"],
  planning: ["read", "write", "publish"],
  billing: ["read", "write"],
  accounting: ["read", "write"],
  geolocation: ["read"],
  logbook: ["read", "write"],
  organization: ["update", "delete"],
} as const;

export type SafyrPermissionResource = keyof typeof SAFYR_PERMISSIONS;
