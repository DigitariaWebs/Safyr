import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type SavedWidgetConfig = {
  id: string;
  name: string;
  visible: boolean;
  span?: number | string;
};

type DashboardModule = "planning" | "hr" | "payroll";

interface DashboardConfigStore {
  configs: Record<DashboardModule, SavedWidgetConfig[] | null>;
  getConfig: (module: DashboardModule) => SavedWidgetConfig[] | null;
  setConfig: (module: DashboardModule, config: SavedWidgetConfig[]) => void;
}

export const useDashboardConfigStore = create<DashboardConfigStore>()(
  persist(
    (set, get) => ({
      configs: {
        planning: null,
        hr: null,
        payroll: null,
      },

      getConfig: (module) => get().configs[module],

      setConfig: (module, config) =>
        set((state) => ({
          configs: { ...state.configs, [module]: config },
        })),
    }),
    {
      name: "dashboard-configs",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
