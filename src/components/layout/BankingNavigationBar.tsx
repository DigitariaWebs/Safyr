"use client";

import { ModuleNavigationBar, NavItem } from "@/components/ui/module-navigation-bar";
import { Building2, ArrowLeftRight, FileCheck, TrendingUp, Settings } from "lucide-react";

const navItems: NavItem[] = [
  {
    label: "Comptes Bancaires",
    href: "/dashboard/banking/accounts",
    icon: Building2,
  },
  {
    label: "Flux Bancaires",
    href: "/dashboard/banking/transactions",
    icon: ArrowLeftRight,
    disabled: true,
  },
  {
    label: "Rapprochement",
    href: "/dashboard/banking/reconciliation",
    icon: FileCheck,
    disabled: true,
  },
  {
    label: "KPI",
    href: "/dashboard/banking/kpi",
    icon: TrendingUp,
    disabled: true,
  },
  {
    label: "Configuration",
    href: "/dashboard/banking/settings",
    icon: Settings,
    disabled: true,
  },
];

interface BankingNavigationBarProps {
  isCollapsed: boolean;
  showNav?: boolean;
}

export function BankingNavigationBar({
  isCollapsed,
  showNav = true,
}: BankingNavigationBarProps) {
  return (
    <ModuleNavigationBar
      moduleIcon={Building2}
      dashboardHref="/dashboard/banking"
      navItems={navItems}
      isCollapsed={isCollapsed}
      showNav={showNav}
    />
  );
}

