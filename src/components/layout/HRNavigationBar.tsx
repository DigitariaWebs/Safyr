"use client";

import {
  ModuleNavigationBar,
  NavItem,
} from "@/components/ui/module-navigation-bar";
import {
  Users,
  Calendar,
  Wallet,
  UserCheck,
  Scale,
  MessageSquare,
  Stethoscope,
  UserX,
  BookOpen,
  GitBranch,
  Bell,
  Settings,
  Award,
  BarChart3,
  Mail,
} from "lucide-react";

const navItems: NavItem[] = [
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
        label: "Indemnités et frais",
        href: "/dashboard/hr/payroll/expenses",
        disabled: true,
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
        label: "Exports paie",
        href: "/dashboard/hr/payroll/exports",
        disabled: true,
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
        disabled: false,
      },
      {
        label: "Vérifications réglementaires",
        href: "/dashboard/hr/recruitment/verifications",
        disabled: false,
      },
      {
        label: "Création & signature",
        href: "/dashboard/hr/recruitment/contracts",
        disabled: false,
      },
      {
        label: "Parcours d'intégration",
        href: "/dashboard/hr/recruitment/onboarding",
        disabled: false,
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
        disabled: false,
      },
      {
        label: "Suspensions",
        href: "/dashboard/hr/discipline/suspensions",
        disabled: false,
      },
      {
        label: "Procédures disciplinaires",
        href: "/dashboard/hr/discipline/disciplinary-procedures",
        disabled: false,
      },
      {
        label: "Registre des sanctions",
        href: "/dashboard/hr/discipline/sanctions-register",
        disabled: false,
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
        disabled: true,
      },
      {
        label: "Entretiens professionnels",
        href: "/dashboard/hr/interviews/professional",
        disabled: true,
      },
      {
        label: "Objectifs & évolution",
        href: "/dashboard/hr/interviews/objectives",
        disabled: true,
      },
    ],
  },
  {
    label: "Médecine",
    icon: Stethoscope,
    children: [
      {
        label: "Visites médicales",
        href: "/dashboard/hr/occupational-health/visits",
        disabled: true,
      },
      {
        label: "Fiches d'aptitude",
        href: "/dashboard/hr/occupational-health/aptitude",
        disabled: true,
      },
      {
        label: "Alertes",
        href: "/dashboard/hr/occupational-health/alerts",
        disabled: true,
      },
    ],
  },
  {
    label: "Offboarding",
    icon: UserX,
    children: [
      {
        label: "Préavis",
        href: "/dashboard/hr/offboarding/notice",
        disabled: true,
      },
      {
        label: "Restitution matériel",
        href: "/dashboard/hr/offboarding/equipment",
        disabled: true,
      },
      {
        label: "Documents de fin",
        href: "/dashboard/hr/offboarding/documents",
        disabled: true,
      },
      {
        label: "Archivage",
        href: "/dashboard/hr/offboarding/archive",
        disabled: true,
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
        disabled: true,
      },
      {
        label: "Accidents du travail",
        href: "/dashboard/hr/legal-registers/accidents",
        disabled: true,
      },
      {
        label: "Formations",
        href: "/dashboard/hr/legal-registers/trainings",
        disabled: true,
      },
      {
        label: "Exports réglementaires",
        href: "/dashboard/hr/legal-registers/exports",
        disabled: true,
      },
    ],
  },
  {
    label: "Workflows",
    icon: GitBranch,
    children: [
      {
        label: "Demandes RH",
        href: "/dashboard/hr/workflows/requests",
        disabled: true,
      },
      {
        label: "Dématérialisation",
        href: "/dashboard/hr/workflows/digitalization",
        disabled: true,
      },
      {
        label: "Signatures électroniques",
        href: "/dashboard/hr/workflows/signatures",
        disabled: true,
      },
    ],
  },
  {
    label: "Pilotage",
    icon: BarChart3,
    children: [
      { label: "KPI RH", href: "/dashboard/hr/kpi/hr", disabled: true },
      {
        label: "Conformité CNAPS",
        href: "/dashboard/hr/kpi/cnaps",
        disabled: true,
      },
      { label: "Turnover", href: "/dashboard/hr/kpi/turnover", disabled: true },
      {
        label: "Absentéisme",
        href: "/dashboard/hr/kpi/absenteeism",
        disabled: true,
      },
      {
        label: "Masse salariale",
        href: "/dashboard/hr/kpi/payroll-mass",
        disabled: true,
      },
      {
        label: "Prévisionnel RH",
        href: "/dashboard/hr/kpi/forecast",
        disabled: true,
      },
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
    ],
  },
  {
    label: "Notifications",
    icon: Bell,
    href: "/dashboard/hr/notifications/hr",
    disabled: true,
  },
  {
    label: "Paramètres",
    icon: Settings,
    href: "/dashboard/hr/settings",
    disabled: true,
  },
];

interface HRNavigationBarProps {
  onProfileClick: () => void;
}

export function HRNavigationBar({ onProfileClick }: HRNavigationBarProps) {
  return (
    <ModuleNavigationBar
      moduleTitle="Ressources Humaines"
      moduleIcon={Users}
      dashboardHref="/dashboard/hr"
      navItems={navItems}
      onProfileClick={onProfileClick}
      userInitials="JD"
      userAvatar="/avatars/admin.jpg"
      showConteurs={true}
      collapsible={true}
    />
  );
}
