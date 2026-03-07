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
  const getInitialMode = (): SidebarMode => {
    if (typeof window === "undefined") return "collapsed";
    const saved = localStorage.getItem("dashboardSidebarMode");
    return saved === "expanded" || saved === "collapsed" ? saved : "collapsed";
  };

  const getInitialHidden = (): boolean => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("dashboardSidebarHidden") === "true";
  };

  const [sidebarMode, setSidebarMode] = useState<SidebarMode>(getInitialMode);
  const [isHidden, setIsHidden] = useState(getInitialHidden);

  useEffect(() => {
    localStorage.setItem("dashboardSidebarMode", sidebarMode);
    localStorage.setItem("dashboardSidebarHidden", String(isHidden));
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
