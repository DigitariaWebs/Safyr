"use client";

import * as React from "react";

interface NavigationContextType {
  isNavExpanded: boolean;
  setIsNavExpanded: (expanded: boolean) => void;
  toggleNavExpanded: () => void;
}

const NavigationContext = React.createContext<NavigationContextType | undefined>(
  undefined
);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isNavExpanded, setIsNavExpanded] = React.useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("globalNavExpanded");
      return saved === "true";
    }
    return false;
  });

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("globalNavExpanded", String(isNavExpanded));
    }
  }, [isNavExpanded]);

  const toggleNavExpanded = React.useCallback(() => {
    setIsNavExpanded((prev) => !prev);
  }, []);

  return (
    <NavigationContext.Provider
      value={{ isNavExpanded, setIsNavExpanded, toggleNavExpanded }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = React.useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
