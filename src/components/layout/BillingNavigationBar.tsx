"use client";

import { ModuleNavigationBar, NavItem } from "@/components/ui/module-navigation-bar";
import { Users, FileText, DollarSign, TrendingUp, Settings } from "lucide-react";

const navItems: NavItem[] = [
  {
    label: "Clients",
    href: "/dashboard/billing/clients",
    icon: Users,
  },
  {
    label: "Factures",
    href: "/dashboard/billing/invoices",
    icon: FileText,
    disabled: true,
  },
  {
    label: "TVA",
    href: "/dashboard/billing/vat",
    icon: DollarSign,
    disabled: true,
  },
  {
    label: "KPI",
    href: "/dashboard/billing/kpi",
    icon: TrendingUp,
    disabled: true,
  },
  {
    label: "Configuration",
    href: "/dashboard/billing/settings",
    icon: Settings,
    disabled: true,
  },
];

interface BillingNavigationBarProps {
  isCollapsed: boolean;
  showNav?: boolean;
}

export function BillingNavigationBar({
  isCollapsed,
  showNav = true,
}: BillingNavigationBarProps) {
  return (
    <ModuleNavigationBar
      moduleIcon={FileText}
      dashboardHref="/dashboard/billing"
      navItems={navItems}
      isCollapsed={isCollapsed}
      showNav={showNav}
    />
  );
}

