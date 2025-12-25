"use client";

import { ModuleNavigationBar, NavItem } from "@/components/ui/module-navigation-bar";
import { Settings, Calculator, FileCheck, TrendingUp, DollarSign } from "lucide-react";

const navItems: NavItem[] = [
  {
    label: "Paramétrage",
    href: "/dashboard/payroll/configuration",
    icon: Settings,
  },
  {
    label: "Calcul Paie",
    href: "/dashboard/payroll/calculation",
    icon: Calculator,
    disabled: true,
  },
  {
    label: "Contrôles",
    href: "/dashboard/payroll/controls",
    icon: FileCheck,
    disabled: true,
  },
  {
    label: "Bilan Social",
    href: "/dashboard/payroll/social-report",
    icon: TrendingUp,
    disabled: true,
  },
  {
    label: "KPI",
    href: "/dashboard/payroll/kpi",
    icon: DollarSign,
    disabled: true,
  },
];

interface PayrollNavigationBarProps {
  isCollapsed: boolean;
  showNav?: boolean;
}

export function PayrollNavigationBar({
  isCollapsed,
  showNav = true,
}: PayrollNavigationBarProps) {
  return (
    <ModuleNavigationBar
      moduleIcon={DollarSign}
      dashboardHref="/dashboard/payroll"
      navItems={navItems}
      isCollapsed={isCollapsed}
      showNav={showNav}
    />
  );
}

