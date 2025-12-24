"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type SidebarMode = "expanded" | "collapsed";

interface SidebarContextType {
  sidebarMode: SidebarMode;
  setSidebarMode: (mode: SidebarMode) => void;
  isHidden: boolean;
  setIsHidden: (hidden: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("dashboardSidebarMode");
      if (savedMode === "expanded" || savedMode === "collapsed") {
        return savedMode;
      }
    }
    return "collapsed";
  });
  
  const [isHidden, setIsHidden] = useState(() => {
    if (typeof window !== "undefined") {
      const savedHidden = localStorage.getItem("dashboardSidebarHidden");
      return savedHidden === "true";
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
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
