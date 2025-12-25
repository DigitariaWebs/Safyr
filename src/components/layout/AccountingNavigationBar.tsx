"use client";

import { ModuleNavigationBar, NavItem } from "@/components/ui/module-navigation-bar";
import { BookOpen, FileText, CreditCard, Building2, TrendingUp } from "lucide-react";

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
    disabled: true,
  },
  {
    label: "Journaux",
    href: "/dashboard/accounting/journals",
    icon: CreditCard,
    disabled: true,
  },
  {
    label: "Banque",
    href: "/dashboard/accounting/bank",
    icon: Building2,
    disabled: true,
  },
  {
    label: "KPI",
    href: "/dashboard/accounting/kpi",
    icon: TrendingUp,
    disabled: true,
  },
];

interface AccountingNavigationBarProps {
  isCollapsed: boolean;
  showNav?: boolean;
}

export function AccountingNavigationBar({
  isCollapsed,
  showNav = true,
}: AccountingNavigationBarProps) {
  return (
    <ModuleNavigationBar
      moduleIcon={BookOpen}
      dashboardHref="/dashboard/accounting"
      navItems={navItems}
      isCollapsed={isCollapsed}
      showNav={showNav}
    />
  );
}

