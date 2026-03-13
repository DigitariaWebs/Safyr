"use client";

import {
  ModuleNavigationBar,
  NavItem,
} from "@/components/ui/module-navigation-bar";
import {
  Users,
  Calendar,
  MapPin,
  RotateCcw,
  Settings,
  Briefcase,
} from "lucide-react";

const navItems: NavItem[] = [
  {
    label: "Agents",
    href: "/dashboard/planning/agents",
    icon: Users,
  },
  {
    label: "Postes",
    href: "/dashboard/planning/postes",
    icon: Briefcase,
  },
  {
    label: "Sites",
    href: "/dashboard/planning/sites",
    icon: MapPin,
  },
  {
    label: "Shift",
    href: "/dashboard/planning/shifts",
    icon: RotateCcw,
  },
  {
    label: "Planning",
    href: "/dashboard/planning/schedule",
    icon: Calendar,
  },
  {
    label: "Paramètres",
    href: "/dashboard/planning/settings",
    icon: Settings,
  },
];

interface PlanningNavigationBarProps {
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
