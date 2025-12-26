export interface Tender {
  id: string;
  reference: string;
  title: string;
  client: string;
  source: "BOAMP" | "Marchés Publics" | "Autre";
  sourceUrl: string;
  publicationDate: string;
  deadline: string;
  status: "À créer" | "En cours" | "Soumis" | "Gagné" | "Perdu" | "Annulé";
  dossierCreated: boolean;
  documents: string[];
  estimatedValue?: number;
  actualValue?: number;
  createdAt?: string;
  submittedAt?: string;
  wonAt?: string;
  lostAt?: string;
  notes?: string;
}

export const mockTenders: Tender[] = [
  {
    id: "TEN-001",
    reference: "AO-2024-001",
    title: "Prestation de sécurité - Centre Commercial",
    client: "Centre Commercial Rosny 2",
    source: "BOAMP",
    sourceUrl: "https://www.boamp.fr/avis/detail/123456",
    publicationDate: "2024-12-01",
    deadline: "2025-01-15",
    status: "En cours",
    dossierCreated: true,
    documents: ["dossier_technique.pdf", "dossier_financier.pdf", "cv_equipe.pdf"],
    estimatedValue: 150000,
    notes: "Appel d'offres important. Dossier technique en cours de finalisation.",
    createdAt: "2024-12-05",
  },
  {
    id: "TEN-002",
    reference: "AO-2024-002",
    title: "Gardiennage Siège Social",
    client: "Entreprise XYZ",
    source: "Marchés Publics",
    sourceUrl: "https://www.marche-public.fr/123456",
    publicationDate: "2024-11-20",
    deadline: "2024-12-20",
    status: "Soumis",
    dossierCreated: true,
    documents: ["dossier_complet.pdf", "annexe_technique.pdf"],
    estimatedValue: 80000,
    submittedAt: "2024-12-18",
    notes: "Dossier soumis dans les temps. Réponse attendue fin janvier.",
    createdAt: "2024-11-25",
  },
  {
    id: "TEN-003",
    reference: "AO-2024-003",
    title: "Sécurité Événementielle",
    client: "Mairie de Paris",
    source: "BOAMP",
    sourceUrl: "https://www.boamp.fr/avis/detail/789012",
    publicationDate: "2024-12-10",
    deadline: "2025-01-30",
    status: "À créer",
    dossierCreated: false,
    documents: [],
    estimatedValue: 200000,
    notes: "Appel d'offres pour événements municipaux. Dossier à créer.",
    createdAt: "2024-12-10",
  },
  {
    id: "TEN-004",
    reference: "AO-2024-004",
    title: "Surveillance et sécurité - Hôpital",
    client: "CHU Paris Nord",
    source: "BOAMP",
    sourceUrl: "https://www.boamp.fr/avis/detail/345678",
    publicationDate: "2024-11-15",
    deadline: "2024-12-10",
    status: "Gagné",
    dossierCreated: true,
    documents: ["dossier_gagnant.pdf"],
    estimatedValue: 300000,
    actualValue: 285000,
    createdAt: "2024-11-18",
    submittedAt: "2024-12-08",
    wonAt: "2024-12-15",
    notes: "Marché remporté! Démarrage prévu en février 2025.",
  },
  {
    id: "TEN-005",
    reference: "AO-2024-005",
    title: "Sécurité Site Industriel",
    client: "Industrie Tech SA",
    source: "Autre",
    sourceUrl: "https://www.industrie-tech.fr/appels-offres/2024-005",
    publicationDate: "2024-10-20",
    deadline: "2024-11-15",
    status: "Perdu",
    dossierCreated: true,
    documents: ["dossier_soumis.pdf"],
    estimatedValue: 120000,
    createdAt: "2024-10-25",
    submittedAt: "2024-11-12",
    lostAt: "2024-11-20",
    notes: "Marché attribué à un concurrent. Analyse des raisons en cours.",
  },
  {
    id: "TEN-006",
    reference: "AO-2024-006",
    title: "Gardiennage Bureaux - Quartier d'affaires",
    client: "Immobilier Pro",
    source: "Marchés Publics",
    sourceUrl: "https://www.marche-public.fr/789012",
    publicationDate: "2024-12-15",
    deadline: "2025-02-01",
    status: "En cours",
    dossierCreated: true,
    documents: ["dossier_technique.pdf"],
    estimatedValue: 180000,
    notes: "Dossier financier en préparation.",
    createdAt: "2024-12-18",
  },
];

