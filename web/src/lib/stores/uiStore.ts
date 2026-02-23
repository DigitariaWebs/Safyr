import { create } from "zustand";

interface UiStore {
  mobileMenuOpen: boolean;
  contactFormSubmitted: boolean;
  activeSection: string;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  setContactFormSubmitted: (value: boolean) => void;
  setActiveSection: (section: string) => void;
}

export const useUiStore = create<UiStore>()((set) => ({
  mobileMenuOpen: false,
  contactFormSubmitted: false,
  activeSection: "hero",

  toggleMobileMenu: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  setContactFormSubmitted: (value) => set({ contactFormSubmitted: value }),
  setActiveSection: (section) => set({ activeSection: section }),
}));
