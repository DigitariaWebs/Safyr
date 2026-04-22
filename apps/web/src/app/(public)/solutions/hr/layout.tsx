import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Module Ressources Humaines - Safyr | Gestion RH Sécurité Privée",
  description:
    "Gérez l'ensemble de vos processus RH pour société de sécurité privée : dossiers agents, formations SSIAP SST H0B0, conformité CNAPS, médecine du travail, paie, planning et offboarding. Automatisez vos déclarations et restez conforme.",
  keywords: [
    "gestion RH sécurité privée",
    "logiciel RH agent de sécurité",
    "suivi certifications SSIAP",
    "conformité CNAPS",
    "gestion paie sécurité",
    "médecine du travail sécurité",
    "DUERP sécurité privée",
    "module RH Safyr",
  ],
  openGraph: {
    title: "Module Ressources Humaines - Safyr | Gestion RH Sécurité Privée",
    description:
      "Gérez l'ensemble de vos processus RH pour société de sécurité privée : dossiers agents, formations, conformité CNAPS, médecine du travail et paie.",
    type: "website",
  },
};

export default function HrLayout({ children }: { children: React.ReactNode }) {
  return children;
}
