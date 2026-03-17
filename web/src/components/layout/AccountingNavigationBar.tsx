"use client";

import {
  ModuleNavigationBar,
  NavItem,
} from "@/components/ui/module-navigation-bar";
import { BookOpen, FileText, CreditCard, Building2 } from "lucide-react";

const navItems: NavItem[] = [
  {
    label: "Plan Comptable",
    href: "/dashboard/accounting/chart",
    icon: BookOpen,
  },
  {
    label: "Écritures",
    href: "/dashboard/accounting/entries",
    icon: FileText,
  },
  {
    label: "Journaux",
    href: "/dashboard/accounting/journals",
    icon: CreditCard,
  },
  {
    label: "Banque",
    href: "/dashboard/accounting/bank",
    icon: Building2,
  },
];

interface AccountingNavigationBarProps {
  showNav?: boolean;
}

export function AccountingNavigationBar({
  showNav = true,
}: AccountingNavigationBarProps) {
  return (
    <ModuleNavigationBar
      moduleIcon={BookOpen}
      dashboardHref="/dashboard/accounting"
      navItems={navItems}
      showNav={showNav}
    />
  );
}
