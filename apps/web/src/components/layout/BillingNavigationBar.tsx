"use client";

import {
  ModuleNavigationBar,
  NavItem,
} from "@/components/ui/module-navigation-bar";
import {
  Users,
  FileText,
  FilePlus,
  CreditCard,
  Receipt,
  Wallet,
  Calculator,
  TrendingUp,
  Settings,
  ClipboardList,
} from "lucide-react";

const navItems: NavItem[] = [
  {
    label: "Simulation",
    href: "/dashboard/billing/simulation",
    icon: Calculator,
  },
  {
    label: "Clients",
    href: "/dashboard/billing/clients",
    icon: Users,
  },
  {
    label: "Services",
    href: "/dashboard/billing/services",
    icon: Receipt,
  },
  {
    label: "Factures",
    href: "/dashboard/billing/invoices",
    icon: FileText,
  },
  {
    label: "Devis",
    href: "/dashboard/billing/quotes",
    icon: FilePlus,
  },
  {
    label: "Bon de commande",
    href: "/dashboard/billing/purchase-orders",
    icon: ClipboardList,
  },
  {
    label: "Ajustements",
    href: "/dashboard/billing/adjustments",
    icon: Settings,
  },
  {
    label: "Avoirs",
    href: "/dashboard/billing/credits",
    icon: CreditCard,
  },
  {
    label: "TVA",
    href: "/dashboard/billing/vat",
    icon: Receipt,
  },
  {
    label: "Paie",
    href: "/dashboard/billing/payroll",
    icon: Wallet,
  },
  {
    label: "Comptabilité",
    href: "/dashboard/billing/accounting",
    icon: Calculator,
  },
  {
    label: "KPI",
    href: "/dashboard/billing/kpi",
    icon: TrendingUp,
  },
];

interface BillingNavigationBarProps {
  showNav?: boolean;
}

export function BillingNavigationBar({
  showNav = true,
}: BillingNavigationBarProps) {
  return (
    <ModuleNavigationBar
      moduleIcon={FileText}
      dashboardHref="/dashboard/billing"
      navItems={navItems}
      showNav={showNav}
    />
  );
}
