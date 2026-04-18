"use client";

import {
  ModuleNavigationBar,
  NavItem,
} from "@/components/ui/module-navigation-bar";
import {
  Building2,
  Users,
  Calendar,
  Wallet,
  Award,
  UserCog,
  ShieldCheck,
  Workflow,
} from "lucide-react";

const navItems: NavItem[] = [
  {
    label: "Organisation",
    icon: Building2,
    children: [
      { label: "Mon entreprise", href: "/dashboard/hr/entreprise" },
      {
        label: "Sous-traitants",
        href: "/dashboard/hr/entreprise/sous-traitants",
      },
      { label: "Clients", href: "/dashboard/hr/entreprise/clients" },
      { label: "Impôts", href: "/dashboard/hr/entreprise/impot-sie" },
      {
        label: "Divers documents administratifs",
        href: "/dashboard/hr/entreprise/divers-documents",
      },
    ],
  },
  {
    label: "Salariés",
    icon: Users,
    children: [
      { label: "Dossiers salariés", href: "/dashboard/hr/employees" },
      { label: "Dossiers AKTO", href: "/dashboard/hr/employees/akto-opco" },
      {
        label: "Archives bulletins de salaire",
        href: "/dashboard/hr/employees/archives",
      },
      {
        label: "Registre du personnel",
        href: "/dashboard/hr/employees/personnel-register",
      },
    ],
  },
  {
    label: "Temps & Absences",
    icon: Calendar,
    children: [
      {
        label: "Heures travaillées",
        href: "/dashboard/hr/time-management/worked-hours",
      },
      { label: "Absences", href: "/dashboard/hr/time-management" },
      {
        label: "Heures CSE",
        href: "/dashboard/hr/time-management/cse-hours",
      },
      {
        label: "Compteurs heures supplémentaires",
        href: "/dashboard/hr/time-management/overtime-counter",
      },
      {
        label: "Suivi congés payés",
        href: "/dashboard/hr/time-management/paid-leave-tracking",
      },
    ],
  },
  {
    label: "Paie & Coûts",
    icon: Wallet,
    children: [
      { label: "Variables de paie", href: "/dashboard/hr/payroll/variables" },
      { label: "Contrôles de paie", href: "/dashboard/hr/payroll/control" },
      {
        label: "Maintien de salaire",
        href: "/dashboard/hr/payroll/maintenance-analysis",
      },
      { label: "Notes de frais", href: "/dashboard/hr/payroll/expenses" },
      {
        label: "Coût salarié / heure",
        href: "/dashboard/hr/payroll/cost-per-hour",
      },
      {
        label: "Exports Silae / Sage",
        href: "/dashboard/hr/payroll/export-config",
      },
    ],
  },
  {
    label: "Formation",
    icon: Award,
    children: [
      { label: "SSIAP", href: "/dashboard/hr/training/ssiap" },
      { label: "SST & recyclages", href: "/dashboard/hr/training/sst" },
      {
        label: "Habilitations H0B0",
        href: "/dashboard/hr/training/h0b0",
      },
      {
        label: "Plan & budget de formation",
        href: "/dashboard/hr/training/plan",
      },
      { label: "Alertes d'expiration", href: "/dashboard/hr/training/alerts" },
      {
        label: "Formations",
        href: "/dashboard/hr/training/history",
      },
    ],
  },
  {
    label: "Cycle de vie salarié",
    icon: UserCog,
    children: [
      {
        label: "Candidatures",
        href: "/dashboard/hr/lifecycle/recruitment/applications",
      },
      {
        label: "Vérifications réglementaires",
        href: "/dashboard/hr/lifecycle/recruitment/verifications",
      },
      {
        label: "Création contrat & signature électronique",
        href: "/dashboard/hr/lifecycle/recruitment/contracts",
      },
      {
        label: "Parcours d'intégration",
        href: "/dashboard/hr/lifecycle/recruitment/onboarding",
      },
      { label: "Entretiens", href: "/dashboard/hr/lifecycle/interviews" },
      { label: "Discipline", href: "/dashboard/hr/lifecycle/discipline" },
      { label: "Offboarding", href: "/dashboard/hr/lifecycle/offboarding" },
    ],
  },
  {
    label: "Conformité & Registres",
    icon: ShieldCheck,
    children: [
      { label: "DUERP", href: "/dashboard/hr/compliance/duerp" },
      {
        label: "Accidents du travail",
        href: "/dashboard/hr/compliance/work-accidents",
      },
      { label: "Suivi CDD", href: "/dashboard/hr/compliance/cdd" },
      {
        label: "Médecine du travail",
        href: "/dashboard/hr/compliance/occupational-medicine",
      },
      {
        label: "Exports réglementaires",
        href: "/dashboard/hr/compliance",
      },
      {
        label: "Registres réglementaires",
        href: "/dashboard/hr/compliance/registers",
      },
    ],
  },
  {
    label: "Workflows & Pilotage",
    icon: Workflow,
    children: [
      {
        label: "Vue d'ensemble workflows",
        href: "/dashboard/hr/workflows/requests",
        section: "Workflows",
      },
      {
        label: "Demandes de documents",
        href: "/dashboard/hr/workflows/document",
        section: "Workflows",
      },
      {
        label: "Changements d'informations",
        href: "/dashboard/hr/workflows/bank-details",
        section: "Workflows",
      },
      {
        label: "Signature électronique",
        href: "/dashboard/hr/workflows/signatures/all",
        section: "Workflows",
      },
      {
        label: "Automatisation RH",
        href: "/dashboard/hr/workflows/automation",
        section: "Workflows",
      },
      {
        label: "Tableaux de bord RH",
        href: "/dashboard/hr/pilotage/dashboards",
        section: "Pilotage",
      },
      {
        label: "Modèles d'emails",
        href: "/dashboard/hr/pilotage/communication/templates",
        section: "Pilotage",
      },
      {
        label: "Envois emails",
        href: "/dashboard/hr/pilotage/communication/send-email",
        section: "Pilotage",
      },
      {
        label: "Notifications & SMS",
        href: "/dashboard/hr/pilotage/communication/notifications",
        section: "Pilotage",
      },
      {
        label: "Archives",
        href: "/dashboard/hr/pilotage/communication/archives",
        section: "Pilotage",
      },
      {
        label: "Marketing RH",
        href: "/dashboard/hr/business/marketing",
        section: "Business",
      },
      {
        label: "Appels d'offres",
        href: "/dashboard/hr/business/tenders",
        section: "Business",
      },
    ],
  },
];

interface HRNavigationBarProps {
  showNav?: boolean;
}

export function HRNavigationBar({ showNav = true }: HRNavigationBarProps) {
  return (
    <ModuleNavigationBar
      moduleIcon={Users}
      dashboardHref="/dashboard/hr"
      navItems={navItems}
      showNav={showNav}
    />
  );
}
