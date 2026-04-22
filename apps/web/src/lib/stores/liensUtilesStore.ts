import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface UsefulLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  category: "government" | "business" | "social" | "custom";
  description?: string;
  isCustom?: boolean;
}

const defaultLinks: UsefulLink[] = [
  {
    id: "1",
    name: "Impots.gouv.fr",
    url: "https://www.impots.gouv.fr",
    icon: "FileText",
    category: "government",
    description: "Service des impôts",
  },
  {
    id: "2",
    name: "URSSAF",
    url: "https://www.urssaf.fr",
    icon: "Building2",
    category: "government",
    description: "Cotisations sociales",
  },
  {
    id: "3",
    name: "Net-entreprises",
    url: "https://www.net-entreprises.fr",
    icon: "Briefcase",
    category: "government",
    description: "Déclarations sociales",
  },
  {
    id: "4",
    name: "Infogreffe",
    url: "https://www.infogreffe.fr",
    icon: "FileText",
    category: "government",
    description: "Registre du commerce",
  },
  {
    id: "5",
    name: "AKTO",
    url: "https://www.akto.fr",
    icon: "Users",
    category: "business",
    description: "Formation professionnelle",
  },
  {
    id: "6",
    name: "ANCV",
    url: "https://www.ancv.com",
    icon: "Briefcase",
    category: "business",
    description: "Chèques vacances",
  },
  {
    id: "7",
    name: "Légifrance",
    url: "https://www.legifrance.gouv.fr",
    icon: "FileText",
    category: "government",
    description: "Service public de la diffusion du droit",
  },
  {
    id: "8",
    name: "France Travail",
    url: "https://www.francetravail.fr",
    icon: "Users",
    category: "government",
    description: "Emploi et formation",
  },
  {
    id: "9",
    name: "DRAC",
    url: "https://www.culture.gouv.fr/Regions",
    icon: "Building2",
    category: "government",
    description: "Direction régionale des affaires culturelles",
  },
];

interface LiensUtilesStore {
  // Persisted
  customLinks: UsefulLink[];

  // Transient
  isOpen: boolean;

  // Derived
  links: UsefulLink[];

  // Actions
  openLiensUtiles: () => void;
  closeLiensUtiles: () => void;
  addLink: (link: Omit<UsefulLink, "id">) => void;
  updateLink: (id: string, updates: Partial<UsefulLink>) => void;
  deleteLink: (id: string) => void;
}

const deriveLinks = (customLinks: UsefulLink[]): UsefulLink[] => [
  ...defaultLinks,
  ...customLinks,
];

export const useLiensUtilesStore = create<LiensUtilesStore>()(
  persist(
    (set) => ({
      customLinks: [],

      isOpen: false,

      links: deriveLinks([]),

      openLiensUtiles: () => set({ isOpen: true }),
      closeLiensUtiles: () => set({ isOpen: false }),

      addLink: (linkData) =>
        set((state) => {
          const customLinks = [
            ...state.customLinks,
            {
              ...linkData,
              id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
              isCustom: true,
            },
          ];
          return { customLinks, links: deriveLinks(customLinks) };
        }),

      updateLink: (id, updates) =>
        set((state) => {
          const customLinks = state.customLinks.map((link) =>
            link.id === id ? { ...link, ...updates } : link,
          );
          return { customLinks, links: deriveLinks(customLinks) };
        }),

      deleteLink: (id) =>
        set((state) => {
          const customLinks = state.customLinks.filter(
            (link) => link.id !== id,
          );
          return { customLinks, links: deriveLinks(customLinks) };
        }),
    }),
    {
      name: "liens-utiles-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        customLinks: state.customLinks,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.links = deriveLinks(state.customLinks);
        }
      },
    },
  ),
);
