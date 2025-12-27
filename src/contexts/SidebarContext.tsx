"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

type SidebarMode = "expanded" | "collapsed";

interface SidebarContextType {
  sidebarMode: SidebarMode;
  setSidebarMode: (mode: SidebarMode) => void;
  isHidden: boolean;
  setIsHidden: (hidden: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("collapsed");
  const [isHidden, setIsHidden] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    const savedMode = localStorage.getItem("dashboardSidebarMode");
    const savedHidden = localStorage.getItem("dashboardSidebarHidden");

    if (savedMode === "expanded" || savedMode === "collapsed") {
      setSidebarMode(savedMode);
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    if (savedHidden === "true") {
      setIsHidden(true);
    }
  }, []);

  useEffect(() => {
    if (mountedRef.current) {
      localStorage.setItem("dashboardSidebarMode", sidebarMode);
      localStorage.setItem("dashboardSidebarHidden", String(isHidden));
    }
  }, [sidebarMode, isHidden]);

  return (
    <SidebarContext.Provider
      value={{ sidebarMode, setSidebarMode, isHidden, setIsHidden }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
