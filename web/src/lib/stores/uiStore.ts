import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SidebarMode = "expanded" | "collapsed";

interface UiStore {
  // Public site
  mobileMenuOpen: boolean;
  contactFormSubmitted: boolean;
  activeSection: string;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  setContactFormSubmitted: (value: boolean) => void;
  setActiveSection: (section: string) => void;

  // Dashboard sidebar
  sidebarMode: SidebarMode;
  sidebarHidden: boolean;
  setSidebarMode: (mode: SidebarMode) => void;
  setIsHidden: (hidden: boolean) => void;
  toggleSidebar: () => void;

  // Dashboard navigation
  isNavExpanded: boolean;
  setIsNavExpanded: (expanded: boolean) => void;
  toggleNavExpanded: () => void;
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      // Public site
      mobileMenuOpen: false,
      contactFormSubmitted: false,
      activeSection: "hero",

      toggleMobileMenu: () =>
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      closeMobileMenu: () => set({ mobileMenuOpen: false }),
      setContactFormSubmitted: (value) => set({ contactFormSubmitted: value }),
      setActiveSection: (section) => set({ activeSection: section }),

      // Dashboard sidebar
      sidebarMode: "collapsed",
      sidebarHidden: false,
      setSidebarMode: (mode) => set({ sidebarMode: mode }),
      setIsHidden: (hidden) => set({ sidebarHidden: hidden }),
      toggleSidebar: () =>
        set((state) => ({
          sidebarMode:
            state.sidebarMode === "expanded" ? "collapsed" : "expanded",
        })),

      // Dashboard navigation
      isNavExpanded: true,
      setIsNavExpanded: (expanded) => set({ isNavExpanded: expanded }),
      toggleNavExpanded: () =>
        set((state) => ({ isNavExpanded: !state.isNavExpanded })),
    }),
    {
      name: "ui-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebarMode: state.sidebarMode,
        sidebarHidden: state.sidebarHidden,
        isNavExpanded: state.isNavExpanded,
      }),
    },
  ),
);
