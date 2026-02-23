"use client";

import {
  ModuleNavigationBar,
  NavItem,
} from "@/components/ui/module-navigation-bar";
import {
  Users,
  Calendar,
  MapPin,
  Briefcase,
  RotateCcw,
  Settings,
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
    label: "Poste",
    href: "/dashboard/planning/postes",
    icon: Briefcase,
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
