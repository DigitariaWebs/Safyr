"use client";

import {
  ModuleNavigationBar,
  NavItem,
} from "@/components/ui/module-navigation-bar";
import {
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  MapPin,
} from "lucide-react";

const navItems: NavItem[] = [
  {
    label: "Agents",
    href: "/dashboard/planning/agents",
    icon: Users,
  },
  {
    label: "Sites & Postes",
    href: "/dashboard/planning/sites",
    icon: MapPin,
  },
  {
    label: "Planning",
    href: "/dashboard/planning/schedule",
    icon: Calendar,
  },
  {
    label: "Validation",
    href: "/dashboard/planning/validation",
    icon: CheckCircle,
    disabled: true,
  },
  {
    label: "Alertes",
    href: "/dashboard/planning/alerts",
    icon: AlertCircle,
    disabled: true,
  },
];

interface PlanningNavigationBarProps {
  isCollapsed: boolean;
  showNav?: boolean;
}

export function PlanningNavigationBar({
  showNav = true,
}: PlanningNavigationBarProps) {
  return (
    <ModuleNavigationBar
      moduleIcon={Calendar}
      dashboardHref="/dashboard/planning"
      navItems={navItems}
      showNav={showNav}
    />
  );
}
