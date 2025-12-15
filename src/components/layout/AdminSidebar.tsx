"use client";

import Link from "next/link";
import {
  Home,
  Users,
  ClipboardList,
  Wallet,
  Shield,
  Settings,
  Mail,
} from "lucide-react";

import { GenericSidebar, MenuSection } from "@/components/ui/generic-sidebar";
import Image from "next/image";

const navigationSections: MenuSection[] = [
  {
    label: "Tableau de bord",
    items: [
      {
        title: "Vue d'ensemble",
        url: "/admin/dashboard",
        icon: Home,
      },
    ],
  },
  {
    label: "Gestion du Personnel",
    items: [
      {
        title: "Salariés",
        url: "/admin/employees",
        icon: Users,
      },
      {
        title: "Contrats",
        url: "/admin/dashboard/contracts",
        icon: ClipboardList,
        disabled: true,
      },
      {
        title: "Documents",
        url: "/admin/dashboard/documents",
        icon: Shield,
        disabled: true,
      },
    ],
  },
  {
    label: "Temps & Absences",
    items: [
      {
        title: "Demandes d'absence",
        url: "/admin/time-management",
        icon: Calendar,
      },
      {
        title: "Heures travaillées",
        url: "/admin/time-management/worked-hours",
        icon: Clock,
        disabled: true,
      },
      {
        title: "Heures CSE",
        url: "/admin/time-management/cse-hours",
        icon: ClipboardList,
        disabled: true,
      },
    ],
  },
  {
    label: "Communication RH",
    items: [
      {
        title: "Modèles d'emails",
        url: "/admin/dashboard/communication/templates",
        icon: Mail,
      },
    ],
  },
  {
    label: "Paie & Finance",
    items: [
      {
        title: "Préparation paie",
        url: "/admin/dashboard/payroll",
        icon: Wallet,
        disabled: true,
      },
      {
        title: "Notes de frais",
        url: "/admin/dashboard/expenses",
        icon: ClipboardList,
        disabled: true,
      },
    ],
  },
  {
    label: "Formations & Habilitations",
    items: [
      {
        title: "SSIAP / SST",
        url: "/admin/dashboard/certifications",
        icon: Shield,
        disabled: true,
      },
      {
        title: "Plan de formation",
        url: "/admin/dashboard/training-plan",
        icon: ClipboardList,
        disabled: true,
      },
    ],
  },
  {
    label: "Recrutement & Discipline",
    items: [
      {
        title: "Candidatures",
        url: "/admin/dashboard/recruitment",
        icon: Users,
        disabled: true,
      },
      {
        title: "Sanctions",
        url: "/admin/dashboard/sanctions",
        icon: Shield,
        disabled: true,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        title: "Registres légaux",
        url: "/admin/dashboard/legal-registers",
        icon: ClipboardList,
        disabled: true,
      },
      {
        title: "Paramètres",
        url: "/admin/dashboard/settings",
        icon: Settings,
        disabled: true,
      },
    ],
  },
];

const logoContent = (
  <Link href="/admin/dashboard">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg">
      <Image src="/favicon.png" alt="Safyr Logo" width={256} height={256} />
    </div>
  </Link>
);

const headerContent = (
  <Link
    href="/admin/dashboard"
    className="flex items-center gap-2 transition-all duration-200"
  >
    <Image
      src="/logo.png"
      className="w-12"
      alt="Safyr Logo"
      width={256}
      height={256}
    />
  </Link>
);

export function AdminSidebar() {
  const handleLogout = () => {
    // Logout logic here
    console.log("Logout clicked");
  };

  return (
    <GenericSidebar
      logo={logoContent}
      headerContent={headerContent}
      menuSections={navigationSections}
      onLogout={handleLogout}
    />
  );
}
