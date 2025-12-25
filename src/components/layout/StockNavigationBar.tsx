"use client";

import { ModuleNavigationBar, NavItem } from "@/components/ui/module-navigation-bar";
import { Package, Users, TrendingUp, FileText, Settings } from "lucide-react";

const navItems: NavItem[] = [
  {
    label: "Équipements",
    href: "/dashboard/stock/equipment",
    icon: Package,
  },
  {
    label: "Dotations",
    href: "/dashboard/stock/assignments",
    icon: Users,
    disabled: true,
  },
  {
    label: "Cycle de Vie",
    href: "/dashboard/stock/lifecycle",
    icon: TrendingUp,
    disabled: true,
  },
  {
    label: "Inventaires",
    href: "/dashboard/stock/inventory",
    icon: FileText,
    disabled: true,
  },
  {
    label: "Configuration",
    href: "/dashboard/stock/settings",
    icon: Settings,
    disabled: true,
  },
];

interface StockNavigationBarProps {
  isCollapsed: boolean;
  showNav?: boolean;
}

export function StockNavigationBar({
  isCollapsed,
  showNav = true,
}: StockNavigationBarProps) {
  return (
    <ModuleNavigationBar
      moduleIcon={Package}
      dashboardHref="/dashboard/stock"
      navItems={navItems}
      isCollapsed={isCollapsed}
      showNav={showNav}
    />
  );
}

