"use client";

import * as React from "react";
import {
  ModuleNavigationBar,
  NavItem,
} from "@/components/ui/module-navigation-bar";
import {
  BookOpen,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Settings,
} from "lucide-react";

const navItems: NavItem[] = [
  {
    label: "Événements",
    icon: BookOpen,
    children: [
      {
        label: "Tous les événements",
        href: "/dashboard/logbook/events",
      },
    ],
  },
  {
    label: "Validation",
    icon: CheckCircle,
    children: [
      {
        label: "En attente validation",
        href: "/dashboard/logbook/validation",
      },
    ],
  },
  {
    label: "Alertes",
    icon: AlertTriangle,
    children: [
      {
        label: "Alertes actives",
        href: "/dashboard/logbook/alerts",
      },
    ],
  },
  {
    label: "Rapports",
    icon: BarChart3,
    children: [
      {
        label: "Statistiques",
        href: "/dashboard/logbook/statistics",
      },
    ],
  },
  {
    label: "Paramètres",
    icon: Settings,
    href: "/dashboard/logbook/settings",
    disabled: true,
  },
];

interface LogbookNavigationBarProps {
  isCollapsed: boolean;
  showNav?: boolean;
}

export function LogbookNavigationBar({
  isCollapsed,
  showNav = true,
}: LogbookNavigationBarProps) {
  return (
    <ModuleNavigationBar
      moduleIcon={BookOpen}
      dashboardHref="/dashboard/logbook"
      navItems={navItems}
      isCollapsed={isCollapsed}
      showNav={showNav}
    />
  );
}

