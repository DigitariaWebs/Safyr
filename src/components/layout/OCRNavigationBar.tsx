"use client";

import { ModuleNavigationBar, NavItem } from "@/components/ui/module-navigation-bar";
import { FileText, Upload, CheckCircle, Settings, TrendingUp } from "lucide-react";

const navItems: NavItem[] = [
  {
    label: "Types de Documents",
    href: "/dashboard/ocr/documents",
    icon: FileText,
  },
  {
    label: "Téléversement",
    href: "/dashboard/ocr/upload",
    icon: Upload,
    disabled: true,
  },
  {
    label: "Validation",
    href: "/dashboard/ocr/validation",
    icon: CheckCircle,
    disabled: true,
  },
  {
    label: "Statistiques",
    href: "/dashboard/ocr/statistics",
    icon: TrendingUp,
    disabled: true,
  },
  {
    label: "Configuration",
    href: "/dashboard/ocr/settings",
    icon: Settings,
    disabled: true,
  },
];

interface OCRNavigationBarProps {
  isCollapsed: boolean;
  showNav?: boolean;
}

export function OCRNavigationBar({
  isCollapsed,
  showNav = true,
}: OCRNavigationBarProps) {
  return (
    <ModuleNavigationBar
      moduleIcon={FileText}
      dashboardHref="/dashboard/ocr"
      navItems={navItems}
      isCollapsed={isCollapsed}
      showNav={showNav}
    />
  );
}

