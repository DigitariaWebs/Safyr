"use client";

import * as React from "react";
import {
  ModuleNavigationBar,
  NavItem,
} from "@/components/ui/module-navigation-bar";
import {
  Users,
  Building2,
  Calendar,
  Wallet,
  UserCheck,
  Scale,
  MessageSquare,
  Stethoscope,
  UserX,
  BookOpen,
  GitBranch,
  Award,
  BarChart3,
  Mail,
  Megaphone,
  FileText,
  GraduationCap,
} from "lucide-react";

const navItems: NavItem[] = [
  {
    label: "Entreprise",
    icon: Building2,
    children: [
      { label: "Informations société", href: "/dashboard/hr/entreprise" },
    ],
  },
  {
    label: "Salariés",
    icon: Users,
    children: [
      { label: "Dossiers salariés", href: "/dashboard/hr/employees" },
      {
        label: "Contrats & avenants",
        href: "/dashboard/hr/contracts",
        disabled: true,
      },
      {
        label: "Documents réglementaires",
        href: "/dashboard/hr/regulatory-documents",
        disabled: true,
      },
      {
        label: "Matériel & EPI",
        href: "/dashboard/hr/equipment",
        disabled: true,
      },
    ],
  },
  {
    label: "Temps & Absences",
    icon: Calendar,
    children: [
      { label: "Congés", href: "/dashboard/hr/time-management/leaves" },
      { label: "Absences", href: "/dashboard/hr/time-management" },
      {
        label: "Arrêts maladie",
        href: "/dashboard/hr/time-management/sick-leaves",
        disabled: true,
      },
      {
        label: "Heures travaillées",
        href: "/dashboard/hr/time-management/worked-hours",
      },
      {
        label: "Heures CSE",
        href: "/dashboard/hr/time-management/cse-hours",
      },
    ],
  },
  {
    label: "Paie & Coûts",
    icon: Wallet,
    children: [
      {
        label: "Variables de paie",
        href: "/dashboard/hr/payroll/variables",
      },
      {
        label: "Mes notes de frais",
        href: "/dashboard/hr/payroll/expenses",
      },
      {
        label: "Validation frais",
        href: "/dashboard/hr/payroll/expenses/validation",
      },
      {
        label: "Historique frais",
        href: "/dashboard/hr/payroll/expenses/history",
      },
      {
        label: "Contrôle paie",
        href: "/dashboard/hr/payroll/control",
      },
      {
        label: "Coût salarié / heure",
        href: "/dashboard/hr/payroll/cost-per-hour",
      },
      {
        label: "Maintien de salaire",
        href: "/dashboard/hr/payroll/maintenance-analysis",
      },
      {
        label: "Export Silae/Sage",
        href: "/dashboard/hr/payroll/export-config",
      },
    ],
  },
  {
    label: "Formations",
    icon: Award,
    children: [
      {
        label: "SSIAP 1 / 2 / 3",
        href: "/dashboard/hr/training/ssiap",
      },
      {
        label: "SST & recyclages",
        href: "/dashboard/hr/training/sst",
      },
      {
        label: "Habilitations",
        href: "/dashboard/hr/training/certifications",
      },
      {
        label: "Plan & budget de formation",
        href: "/dashboard/hr/training/plan",
      },
      {
        label: "Alertes d'expiration",
        href: "/dashboard/hr/training/alerts",
      },
    ],
  },
  {
    label: "Recrutement",
    icon: UserCheck,
    children: [
      {
        label: "Candidatures",
        href: "/dashboard/hr/recruitment/applications",
      },
      {
        label: "Vérifications réglementaires",
        href: "/dashboard/hr/recruitment/verifications",
      },
      {
        label: "Création & signature",
        href: "/dashboard/hr/recruitment/contracts",
      },
      {
        label: "Parcours d'intégration",
        href: "/dashboard/hr/recruitment/onboarding",
      },
    ],
  },
  {
    label: "Discipline",
    icon: Scale,
    children: [
      {
        label: "Avertissements",
        href: "/dashboard/hr/discipline/warnings",
      },
      {
        label: "Suspensions",
        href: "/dashboard/hr/discipline/suspensions",
      },
      {
        label: "Procédures disciplinaires",
        href: "/dashboard/hr/discipline/disciplinary-procedures",
      },
      {
        label: "Registre des sanctions",
        href: "/dashboard/hr/discipline/sanctions-register",
      },
    ],
  },
  {
    label: "Entretiens",
    icon: MessageSquare,
    children: [
      {
        label: "Entretiens annuels",
        href: "/dashboard/hr/interviews/annual",
      },
      {
        label: "Entretiens professionnels",
        href: "/dashboard/hr/interviews/professional",
      },
      {
        label: "Objectifs & évolution",
        href: "/dashboard/hr/interviews/objectives",
      },
    ],
  },
  {
    label: "Médecine",
    icon: Stethoscope,
    children: [
      {
        label: "Médecine du travail",
        href: "/dashboard/hr/occupational-medicine",
      },
    ],
  },
  {
    label: "Offboarding",
    icon: UserX,
    children: [
      {
        label: "Fin de contrat",
        href: "/dashboard/hr/offboarding",
      },
    ],
  },
  {
    label: "Registres",
    icon: BookOpen,
    children: [
      {
        label: "Registre du personnel",
        href: "/dashboard/hr/legal-registers/personnel",
      },
      {
        label: "Accidents du travail",
        href: "/dashboard/hr/legal-registers/work-accidents",
      },
      {
        label: "Formations",
        href: "/dashboard/hr/legal-registers/training",
      },
      {
        label: "Entrées/Sorties CDD",
        href: "/dashboard/hr/legal-registers/cdd",
      },
      {
        label: "Exports réglementaires",
        href: "/dashboard/hr/legal-registers",
      },
    ],
  },
  {
    label: "Workflows",
    icon: GitBranch,
    children: [
      {
        label: "Vue d'ensemble",
        href: "/dashboard/hr/workflows/requests",
      },
      {
        label: "Demandes de certificats",
        href: "/dashboard/hr/workflows/certificate",
      },
      {
        label: "Demandes de documents",
        href: "/dashboard/hr/workflows/document",
      },
      {
        label: "Changements d'informations",
        href: "/dashboard/hr/workflows/bank-details",
      },
      {
        label: "Signatures électroniques",
        href: "/dashboard/hr/workflows/signatures",
      },
      {
        label: "Gestion des signatures",
        href: "/dashboard/hr/workflows/signatures/all",
      },
      {
        label: "Automatisation",
        href: "/dashboard/hr/workflows/automation",
      },
    ],
  },
  {
    label: "Pilotage",
    icon: BarChart3,
    children: [
      {
        label: "Bilan social",
        href: "/dashboard/hr/social-report",
      },
      { label: "KPI RH", href: "/dashboard/hr" },
    ],
  },
  {
    label: "Communication",
    icon: Mail,
    children: [
      {
        label: "Modèles d'emails",
        href: "/dashboard/hr/communication/templates",
      },
      {
        label: "Envoi d'emails",
        href: "/dashboard/hr/communication/send-email",
      },
      {
        label: "Archives",
        href: "/dashboard/hr/communication/archives",
      },
      {
        label: "Notifications & SMS",
        href: "/dashboard/hr/communication/notifications",
      },
    ],
  },
  {
    label: "Marketing",
    icon: Megaphone,
    href: "/dashboard/hr/marketing",
  },
  {
    label: "Appels d'Offre",
    icon: FileText,
    href: "/dashboard/hr/tenders",
  },
  {
    label: "AKTO & OPCO",
    icon: GraduationCap,
    href: "/dashboard/hr/akto-opco",
  },
];

interface HRNavigationBarProps {
  isCollapsed: boolean;
  showNav?: boolean;
}

export function HRNavigationBar({
  isCollapsed,
  showNav = true,
}: HRNavigationBarProps) {
  return (
    <ModuleNavigationBar
      moduleIcon={Users}
      dashboardHref="/dashboard/hr"
      navItems={navItems}
      isCollapsed={isCollapsed}
      showNav={showNav}
    />
  );
}
