export const employeeKeys = {
  all: ["employees"] as const,
  list: () => [...employeeKeys.all, "list"] as const,
  stats: () => [...employeeKeys.all, "stats"] as const,
  detail: (id: string) => [...employeeKeys.all, "detail", id] as const,
  compliance: (id: string) => [...employeeKeys.all, "compliance", id] as const,
  create: () => [...employeeKeys.all, "create"] as const,
  delete: () => [...employeeKeys.all, "delete"] as const,
};
