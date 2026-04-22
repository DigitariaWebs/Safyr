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
  Calendar,
  Users,
  Shield,
  FileBarChart,
  FileText,
} from "lucide-react";

const navItems: NavItem[] = [
  {
    label: "Événements",
    icon: BookOpen,
    href: "/dashboard/logbook/events",
  },
  {
    label: "Validation",
    icon: CheckCircle,
    href: "/dashboard/logbook/validation",
  },
  {
    label: "Alertes",
    icon: AlertTriangle,
    href: "/dashboard/logbook/alerts",
  },
  {
    label: "Planning & RH",
    icon: Calendar,
    href: "/dashboard/logbook/planning-rh",
  },
  {
    label: "Portails",
    icon: Users,
    children: [
      {
        label: "Portail Clients",
        href: "/dashboard/logbook/client-portal",
      },
      {
        label: "Portail Agents",
        href: "/dashboard/logbook/agent-portal",
      },
    ],
  },
  {
    label: "Gestion",
    icon: FileText,
    children: [
      {
        label: "Démarque Inconnue (DI)",
        href: "/dashboard/logbook/unknown-losses",
      },
      {
        label: "Fiches d'Interpellation",
        href: "/dashboard/logbook/interpellation-archives",
      },
    ],
  },
  {
    label: "Rapports",
    icon: FileBarChart,
    href: "/dashboard/logbook/exports",
  },
  {
    label: "Sécurité",
    icon: Shield,
    href: "/dashboard/logbook/security",
  },
];

interface LogbookNavigationBarProps {
  showNav?: boolean;
}

export function LogbookNavigationBar({
  showNav = true,
}: LogbookNavigationBarProps) {
  return (
    <ModuleNavigationBar
      moduleIcon={BookOpen}
      dashboardHref="/dashboard/logbook"
      navItems={navItems}
      showNav={showNav}
    />
  );
}
