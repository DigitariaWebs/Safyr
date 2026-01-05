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
  Calendar,
  Users,
  Shield,
  Download,
  FileText,
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
    label: "Planning & RH",
    icon: Calendar,
    children: [
      {
        label: "Connexion Planning & RH",
        href: "/dashboard/logbook/planning-rh",
      },
    ],
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
    label: "Rapports",
    icon: BarChart3,
    children: [
      {
        label: "Statistiques & KPIs",
        href: "/dashboard/logbook/statistics",
      },
    ],
  },
  {
    label: "Sécurité",
    icon: Shield,
    children: [
      {
        label: "Sécurité & Technique",
        href: "/dashboard/logbook/security",
      },
    ],
  },
  {
    label: "Exports",
    icon: Download,
    children: [
      {
        label: "Export & Archivage",
        href: "/dashboard/logbook/exports",
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
