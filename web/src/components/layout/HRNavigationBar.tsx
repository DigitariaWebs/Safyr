"use client";

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
} from "lucide-react";

const navItems: NavItem[] = [
  {
    label: "Organisme Social",
    icon: Building2,
    children: [
      {
        label: "Information Organisme Social",
        href: "/dashboard/hr/entreprise",
      },
      {
        label: "Sous-traitants",
        href: "/dashboard/hr/entreprise/sous-traitants",
      },
      { label: "Clients", href: "/dashboard/hr/entreprise/clients" },
      { label: "Impôt SIE", href: "/dashboard/hr/entreprise/impot-sie" },
      {
        label: "Divers Documents",
        href: "/dashboard/hr/entreprise/divers-documents",
      },
    ],
  },
  {
    label: "Salariés",
    icon: Users,
    children: [
      { label: "Dossiers salariés", href: "/dashboard/hr/employees" },
      { label: "AKTO", href: "/dashboard/hr/employees/akto-opco" },
      { label: "Archives BS", href: "/dashboard/hr/employees/archives" },
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
      { label: "Absences", href: "/dashboard/hr/time-management" },
      {
        label: "Heures travaillées",
        href: "/dashboard/hr/time-management/worked-hours",
      },
      {
        label: "Heures CSE",
        href: "/dashboard/hr/time-management/cse-hours",
      },
      {
        label: "Compteur heures supplémentaires",
        href: "/dashboard/hr/time-management/overtime-counter",
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
        label: "Notes de frais",
        href: "/dashboard/hr/payroll/expenses",
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
        label: "SSIAP",
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
    href: "/dashboard/hr/interviews",
  },
  {
    label: "Médecine",
    icon: Stethoscope,
    href: "/dashboard/hr/occupational-medicine",
  },
  {
    label: "Offboarding",
    icon: UserX,
    href: "/dashboard/hr/offboarding",
  },
  {
    label: "Registres",
    icon: BookOpen,
    children: [
      {
        label: "Registre du personnel",
        href: "/dashboard/hr/legal-registers/personnel",
      },
      { label: "DUERP", href: "/dashboard/hr/legal-registers/duerp" },
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
        label: "Demande de documents",
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
    href: "/dashboard/hr/social-report",
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
