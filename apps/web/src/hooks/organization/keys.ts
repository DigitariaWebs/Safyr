export const organizationKeys = {
  all: ["organization"] as const,
  active: () => [...organizationKeys.all, "active"] as const,
  compliance: () => [...organizationKeys.all, "compliance"] as const,
};
