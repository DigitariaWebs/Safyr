"use client";

import { ModuleNavigationBar, NavItem } from "@/components/ui/module-navigation-bar";
import { MapPin, Navigation, Square, CheckCircle, FileText } from "lucide-react";

const navItems: NavItem[] = [
  {
    label: "Live Tracking",
    href: "/dashboard/geolocation/live",
    icon: MapPin,
  },
  {
    label: "Zones Géo-fencées",
    href: "/dashboard/geolocation/zones",
    icon: Square,
    disabled: true,
  },
  {
    label: "Contrôle Présence",
    href: "/dashboard/geolocation/presence",
    icon: CheckCircle,
    disabled: true,
  },
  {
    label: "Rondes",
    href: "/dashboard/geolocation/rounds",
    icon: Navigation,
    disabled: true,
  },
  {
    label: "Rapports",
    href: "/dashboard/geolocation/reports",
    icon: FileText,
    disabled: true,
  },
];

interface GeolocationNavigationBarProps {
  isCollapsed: boolean;
  showNav?: boolean;
}

export function GeolocationNavigationBar({
  isCollapsed,
  showNav = true,
}: GeolocationNavigationBarProps) {
  return (
    <ModuleNavigationBar
      moduleIcon={MapPin}
      dashboardHref="/dashboard/geolocation"
      navItems={navItems}
      isCollapsed={isCollapsed}
      showNav={showNav}
    />
  );
}

