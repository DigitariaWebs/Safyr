"use client";

import {
  ModuleNavigationBar,
  NavItem,
} from "@/components/ui/module-navigation-bar";
import {
  MapPin,
  Navigation,
  Square,
  CheckCircle,
  FileText,
} from "lucide-react";

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
  },
  {
    label: "Contrôle Présence",
    href: "/dashboard/geolocation/presence",
    icon: CheckCircle,
  },
  {
    label: "Rondes",
    href: "/dashboard/geolocation/rounds",
    icon: Navigation,
  },
  {
    label: "Rapports",
    href: "/dashboard/geolocation/reports",
    icon: FileText,
  },
];

interface GeolocationNavigationBarProps {
  showNav?: boolean;
}

export function GeolocationNavigationBar({
  showNav = true,
}: GeolocationNavigationBarProps) {
  return (
    <ModuleNavigationBar
      moduleIcon={MapPin}
      dashboardHref="/dashboard/geolocation"
      navItems={navItems}
      showNav={showNav}
    />
  );
}
