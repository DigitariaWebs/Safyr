import { IndemniteType, IndemniteApplication } from "@/lib/types.d";

// Mock indemnité types
export const mockIndemniteTypes: IndemniteType[] = [
  // Transport
  {
    id: "ind-001",
    code: "TRANSPORT",
    name: "Indemnité de transport",
    category: "transport",
    taxable: false,
    subjectToContributions: false,
    defaultAmount: 75,
    calculationMethod: "fixed",
    isActive: true,
    description:
      "Prise en charge obligatoire de 50% des frais de transport en commun",
  },
  {
    id: "ind-002",
    code: "FRAIS_KM",
    name: "Indemnité kilométrique",
    category: "transport",
    taxable: false,
    subjectToContributions: false,
    defaultAmount: 0.603,
    calculationMethod: "custom",
    isActive: true,
    description: "Barème fiscal kilométrique pour véhicule personnel",
  },
  {
    id: "ind-003",
    code: "MOBILITE_DURABLE",
    name: "Forfait mobilités durables",
    category: "transport",
    taxable: false,
    subjectToContributions: false,
    defaultAmount: 700,
    calculationMethod: "fixed",
    isActive: true,
    description:
      "Vélo, covoiturage, trottinette électrique, etc. (max 700€/an)",
  },

  // Repas
  {
    id: "ind-004",
    code: "PANIER_JOUR",
    name: "Prime de panier (jour)",
    category: "repas",
    taxable: false,
    subjectToContributions: false,
    defaultAmount: 7.3,
    calculationMethod: "per_day",
    isActive: true,
    description: "Indemnité repas travail de jour (limite URSSAF 2024: 7.30€)",
  },
  {
    id: "ind-005",
    code: "PANIER_NUIT",
    name: "Prime de panier (nuit)",
    category: "repas",
    taxable: false,
    subjectToContributions: false,
    defaultAmount: 7.3,
    calculationMethod: "per_day",
    isActive: true,
    description:
      "Indemnité repas travail de nuit (limite URSSAF 2024: 7.30€)",
  },
  {
    id: "ind-006",
    code: "TICKET_RESTO",
    name: "Titre-restaurant (part employeur)",
    category: "repas",
    taxable: false,
    subjectToContributions: false,
    defaultAmount: 7.18,
    calculationMethod: "per_day",
    isActive: true,
    description:
      "Part employeur des titres-restaurant (max exonéré 2024: 7.18€)",
  },

  // Logement
  {
    id: "ind-007",
    code: "LOGEMENT",
    name: "Indemnité de logement",
    category: "logement",
    taxable: true,
    subjectToContributions: true,
    defaultAmount: 0,
    calculationMethod: "fixed",
    isActive: true,
    description: "Aide au logement (avantage en nature si dépassement)",
  },

  // Habillement
  {
    id: "ind-008",
    code: "HABILLAGE",
    name: "Prime d'habillage/déshabillage",
    category: "habillement",
    taxable: true,
    subjectToContributions: true,
    defaultAmount: 0,
    calculationMethod: "per_day",
    isActive: true,
    description:
      "Compensation pour temps habillage/déshabillage obligatoire sur lieu de travail",
  },
  {
    id: "ind-009",
    code: "VETEMENTS",
    name: "Indemnité vestimentaire",
    category: "habillement",
    taxable: false,
    subjectToContributions: false,
    defaultAmount: 15,
    calculationMethod: "fixed",
    isActive: true,
    description: "Entretien uniforme/tenue de travail obligatoire",
  },

  // Outillage
  {
    id: "ind-010",
    code: "OUTILLAGE",
    name: "Indemnité d'outillage",
    category: "outillage",
    taxable: false,
    subjectToContributions: false,
    defaultAmount: 0,
    calculationMethod: "fixed",
    isActive: true,
    description: "Outils personnels utilisés pour le travail",
  },
  {
    id: "ind-011",
    code: "TELEPHONE",
    name: "Indemnité téléphone",
    category: "outillage",
    taxable: false,
    subjectToContributions: false,
    defaultAmount: 30,
    calculationMethod: "fixed",
    isActive: true,
    description: "Utilisation téléphone personnel à des fins professionnelles",
  },

  // Ancienneté
  {
    id: "ind-012",
    code: "ANCIENNETE",
    name: "Prime d'ancienneté",
    category: "anciennete",
    taxable: true,
    subjectToContributions: true,
    defaultAmount: 0,
    calculationMethod: "percentage",
    isActive: true,
    description:
      "Majoration selon ancienneté (convention collective prévention-sécurité)",
  },

  // Risque
  {
    id: "ind-013",
    code: "RISQUE",
    name: "Prime de risque",
    category: "risque",
    taxable: true,
    subjectToContributions: true,
    defaultAmount: 0,
    calculationMethod: "fixed",
    isActive: true,
    description: "Compensation pour travail en conditions dangereuses",
  },
  {
    id: "ind-014",
    code: "ASTREINTE",
    name: "Indemnité d'astreinte",
    category: "risque",
    taxable: true,
    subjectToContributions: true,
    defaultAmount: 0,
    calculationMethod: "per_day",
    isActive: true,
    description: "Compensation pour période d'astreinte",
  },
  {
    id: "ind-015",
    code: "CHIEN",
    name: "Prime maître-chien",
    category: "risque",
    taxable: true,
    subjectToContributions: true,
    defaultAmount: 150,
    calculationMethod: "fixed",
    isActive: true,
    description: "Prime mensuelle pour agents cynophiles",
  },

  // Other
  {
    id: "ind-016",
    code: "TELETRAVAIL",
    name: "Indemnité télétravail",
    category: "other",
    taxable: false,
    subjectToContributions: false,
    defaultAmount: 2.7,
    calculationMethod: "per_day",
    isActive: true,
    description:
      "Allocation forfaitaire télétravail (max exonéré: 2.70€/jour, 59.40€/mois)",
  },
  {
    id: "ind-017",
    code: "DEPLACEMENT",
    name: "Indemnité de grand déplacement",
    category: "other",
    taxable: false,
    subjectToContributions: false,
    defaultAmount: 0,
    calculationMethod: "per_day",
    isActive: true,
    description: "Repas et hébergement lors de déplacements professionnels",
  },
  {
    id: "ind-018",
    code: "SALISSURE",
    name: "Prime de salissure",
    category: "other",
    taxable: false,
    subjectToContributions: false,
    defaultAmount: 0,
    calculationMethod: "fixed",
    isActive: true,
    description: "Compensation pour travaux salissants",
  },
  {
    id: "ind-019",
    code: "13EME_MOIS",
    name: "13ème mois",
    category: "other",
    taxable: true,
    subjectToContributions: true,
    defaultAmount: 0,
    calculationMethod: "percentage",
    isActive: true,
    description: "Prime annuelle équivalente à un mois de salaire",
  },
  {
    id: "ind-020",
    code: "INTERESSEMENT",
    name: "Intéressement",
    category: "other",
    taxable: false,
    subjectToContributions: false,
    defaultAmount: 0,
    calculationMethod: "fixed",
    isActive: true,
    description: "Prime liée aux résultats de l'entreprise",
  },
  {
    id: "ind-021",
    code: "PARTICIPATION",
    name: "Participation",
    category: "other",
    taxable: false,
    subjectToContributions: false,
    defaultAmount: 0,
    calculationMethod: "fixed",
    isActive: true,
    description: "Partage des bénéfices de l'entreprise",
  },
  {
    id: "ind-022",
    code: "EXCEPTIONNELLE",
    name: "Prime exceptionnelle",
    category: "other",
    taxable: true,
    subjectToContributions: true,
    defaultAmount: 0,
    calculationMethod: "fixed",
    isActive: true,
    description: "Prime ponctuelle (performance, événement, etc.)",
  },
];

// URSSAF limits for 2024
export const URSSAF_LIMITS_2024 = {
  panierJour: 7.3,
  panierNuit: 7.3,
  ticketRestaurant: 7.18,
  teletravailJour: 2.7,
  teletravailMois: 59.4,
  mobiliteDurable: 700,
  transport50: 0.5, // 50% of subscription
};

// Helper functions
export function getIndemniteTypes(): IndemniteType[] {
  return mockIndemniteTypes.filter((type) => type.isActive);
}

export function getIndemniteTypeByCode(code: string): IndemniteType | undefined {
  return mockIndemniteTypes.find((type) => type.code === code && type.isActive);
}

export function getIndemniteTypesByCategory(
  category: IndemniteType["category"]
): IndemniteType[] {
  return mockIndemniteTypes.filter(
    (type) => type.category === category && type.isActive
  );
}

export function getTaxableIndemniteTypes(): IndemniteType[] {
  return mockIndemniteTypes.filter((type) => type.taxable && type.isActive);
}

export function getNonTaxableIndemniteTypes(): IndemniteType[] {
  return mockIndemniteTypes.filter((type) => !type.taxable && type.isActive);
}

// Calculate indemnité application
export function calculateIndemniteApplication(
  typeCode: string,
  quantity?: number,
  customAmount?: number
): IndemniteApplication | null {
  const type = getIndemniteTypeByCode(typeCode);
  if (!type) return null;

  let amount = 0;
  let rate: number | undefined;
  let qty: number | undefined;

  switch (type.calculationMethod) {
    case "fixed":
      amount = customAmount ?? type.defaultAmount ?? 0;
      break;

    case "per_day":
      qty = quantity ?? 0;
      rate = customAmount ?? type.defaultAmount ?? 0;
      amount = qty * rate;
      break;

    case "per_hour":
      qty = quantity ?? 0;
      rate = customAmount ?? type.defaultAmount ?? 0;
      amount = qty * rate;
      break;

    case "percentage":
      // Percentage calculations need a base amount passed as customAmount
      amount = customAmount ?? 0;
      break;

    case "custom":
      amount = customAmount ?? 0;
      qty = quantity;
      break;
  }

  return {
    typeId: type.id,
    typeName: type.name,
    typeCode: type.code,
    category: type.category,
    quantity: qty,
    rate,
    amount,
    taxable: type.taxable,
    subjectToContributions: type.subjectToContributions,
  };
}

// Calculate multiple indemnités
export function calculateIndemnites(
  indemnites: { code: string; quantity?: number; amount?: number }[]
): IndemniteApplication[] {
  const applications: IndemniteApplication[] = [];

  for (const ind of indemnites) {
    const application = calculateIndemniteApplication(
      ind.code,
      ind.quantity,
      ind.amount
    );
    if (application && application.amount > 0) {
      applications.push(application);
    }
  }

  return applications;
}

// Get totals
export function getIndemnitesTotals(applications: IndemniteApplication[]): {
  totalTaxable: number;
  totalNonTaxable: number;
  totalSubjectToContributions: number;
  total: number;
} {
  return applications.reduce(
    (acc, app) => ({
      totalTaxable: acc.totalTaxable + (app.taxable ? app.amount : 0),
      totalNonTaxable: acc.totalNonTaxable + (!app.taxable ? app.amount : 0),
      totalSubjectToContributions:
        acc.totalSubjectToContributions +
        (app.subjectToContributions ? app.amount : 0),
      total: acc.total + app.amount,
    }),
    {
      totalTaxable: 0,
      totalNonTaxable: 0,
      totalSubjectToContributions: 0,
      total: 0,
    }
  );
}

// Category labels
export const indemniteCategoryLabels: Record<IndemniteType["category"], string> = {
  transport: "Transport",
  repas: "Repas",
  logement: "Logement",
  habillement: "Habillement",
  outillage: "Outillage",
  anciennete: "Ancienneté",
  risque: "Risque",
  other: "Autres",
};
