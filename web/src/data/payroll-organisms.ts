import { OrganismRule } from "@/lib/types.d";

// French social security ceiling 2024
export const PLAFOND_SS_MENSUEL_2024 = 3864;
export const PLAFOND_SS_ANNUEL_2024 = 46368;

// Organism rules - cotisations sociales
export const mockOrganismRules: OrganismRule[] = [
  // URSSAF - Health
  {
    id: "org-001",
    code: "MALADIE",
    name: "Assurance maladie",
    organism: "URSSAF",
    category: "health",
    appliesTo: "employer",
    rateEmployer: 13.0,
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "Cotisation maladie employeur sur totalité du salaire",
  },
  {
    id: "org-002",
    code: "MALADIE_ALSACE",
    name: "Assurance maladie Alsace-Moselle",
    organism: "URSSAF",
    category: "health",
    appliesTo: "employee",
    rateEmployee: 1.3,
    isActive: true,
    effectiveDate: "2024-01-01",
    description:
      "Cotisation supplémentaire salarié pour Alsace-Moselle uniquement",
  },

  // URSSAF - Family
  {
    id: "org-003",
    code: "FAMILLE",
    name: "Allocations familiales",
    organism: "URSSAF",
    category: "family",
    appliesTo: "employer",
    rateEmployer: 5.25,
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "Taux normal, 3.45% si salaire <= 3.5 SMIC",
  },
  {
    id: "org-004",
    code: "FAMILLE_REDUIT",
    name: "Allocations familiales (taux réduit)",
    organism: "URSSAF",
    category: "family",
    appliesTo: "employer",
    rateEmployer: 3.45,
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "Taux réduit pour salaires <= 3.5 SMIC",
  },

  // URSSAF - Work accident
  {
    id: "org-005",
    code: "AT_MP",
    name: "Accidents du travail / Maladies professionnelles",
    organism: "URSSAF",
    category: "accident",
    appliesTo: "employer",
    rateEmployer: 1.8,
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "Taux variable selon secteur d'activité (1.8% pour sécurité)",
  },

  // Retirement - Tranche A
  {
    id: "org-006",
    code: "VIEILLESSE_TA_SAL",
    name: "Assurance vieillesse plafonnée",
    organism: "URSSAF",
    category: "retirement",
    appliesTo: "both",
    rateEmployee: 6.9,
    rateEmployer: 8.55,
    ceiling: PLAFOND_SS_MENSUEL_2024,
    tranche: "A",
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "Retraite de base sur tranche A (jusqu'au plafond SS)",
  },
  {
    id: "org-007",
    code: "VIEILLESSE_DEPLAF",
    name: "Assurance vieillesse déplafonnée",
    organism: "URSSAF",
    category: "retirement",
    appliesTo: "both",
    rateEmployee: 0.4,
    rateEmployer: 1.9,
    tranche: "all",
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "Retraite de base sur totalité du salaire",
  },

  // Complementary Retirement - AGIRC-ARRCO
  {
    id: "org-008",
    code: "AGIRC_ARRCO_T1",
    name: "Retraite complémentaire Tranche 1",
    organism: "AGIRC-ARRCO",
    category: "retirement",
    appliesTo: "both",
    rateEmployee: 3.15,
    rateEmployer: 4.72,
    ceiling: PLAFOND_SS_MENSUEL_2024,
    tranche: "A",
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "Retraite complémentaire sur tranche 1 (jusqu'au plafond SS)",
  },
  {
    id: "org-009",
    code: "AGIRC_ARRCO_T2",
    name: "Retraite complémentaire Tranche 2",
    organism: "AGIRC-ARRCO",
    category: "retirement",
    appliesTo: "both",
    rateEmployee: 8.64,
    rateEmployer: 12.95,
    ceiling: PLAFOND_SS_MENSUEL_2024 * 8,
    tranche: "B",
    isActive: true,
    effectiveDate: "2024-01-01",
    description:
      "Retraite complémentaire sur tranche 2 (entre 1 et 8 plafonds SS)",
  },

  // CEG - Contribution d'équilibre général
  {
    id: "org-010",
    code: "CEG_T1",
    name: "Contribution équilibre général T1",
    organism: "AGIRC-ARRCO",
    category: "retirement",
    appliesTo: "both",
    rateEmployee: 0.86,
    rateEmployer: 1.29,
    ceiling: PLAFOND_SS_MENSUEL_2024,
    tranche: "A",
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "CEG tranche 1",
  },
  {
    id: "org-011",
    code: "CEG_T2",
    name: "Contribution équilibre général T2",
    organism: "AGIRC-ARRCO",
    category: "retirement",
    appliesTo: "both",
    rateEmployee: 1.08,
    rateEmployer: 1.62,
    ceiling: PLAFOND_SS_MENSUEL_2024 * 8,
    tranche: "B",
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "CEG tranche 2",
  },

  // Unemployment
  {
    id: "org-012",
    code: "CHOMAGE",
    name: "Assurance chômage",
    organism: "URSSAF",
    category: "unemployment",
    appliesTo: "employer",
    rateEmployer: 4.05,
    ceiling: PLAFOND_SS_MENSUEL_2024 * 4,
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "Cotisation chômage employeur uniquement depuis 2019",
  },
  {
    id: "org-013",
    code: "AGS",
    name: "AGS (Garantie des salaires)",
    organism: "URSSAF",
    category: "unemployment",
    appliesTo: "employer",
    rateEmployer: 0.15,
    ceiling: PLAFOND_SS_MENSUEL_2024 * 4,
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "Association pour la gestion du régime de garantie des créances des salariés",
  },

  // CSG/CRDS
  {
    id: "org-014",
    code: "CSG_DEDUCTIBLE",
    name: "CSG déductible",
    organism: "URSSAF",
    category: "csg",
    appliesTo: "employee",
    rateEmployee: 6.8,
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "CSG déductible sur 98.25% du salaire brut",
  },
  {
    id: "org-015",
    code: "CSG_NON_DEDUCTIBLE",
    name: "CSG non déductible",
    organism: "URSSAF",
    category: "csg",
    appliesTo: "employee",
    rateEmployee: 2.4,
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "CSG non déductible sur 98.25% du salaire brut",
  },
  {
    id: "org-016",
    code: "CRDS",
    name: "CRDS",
    organism: "URSSAF",
    category: "crds",
    appliesTo: "employee",
    rateEmployee: 0.5,
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "CRDS sur 98.25% du salaire brut",
  },

  // Other contributions
  {
    id: "org-017",
    code: "FNAL_PLAF",
    name: "FNAL plafonné",
    organism: "URSSAF",
    category: "other",
    appliesTo: "employer",
    rateEmployer: 0.1,
    ceiling: PLAFOND_SS_MENSUEL_2024,
    tranche: "A",
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "Fonds National d'Aide au Logement (entreprises < 50 salariés)",
  },
  {
    id: "org-018",
    code: "FNAL_DEPLAF",
    name: "FNAL déplafonné",
    organism: "URSSAF",
    category: "other",
    appliesTo: "employer",
    rateEmployer: 0.5,
    isActive: true,
    effectiveDate: "2024-01-01",
    description:
      "Fonds National d'Aide au Logement (entreprises >= 50 salariés)",
  },
  {
    id: "org-019",
    code: "FORMATION",
    name: "Contribution formation professionnelle",
    organism: "URSSAF",
    category: "other",
    appliesTo: "employer",
    rateEmployer: 1.0,
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "Formation professionnelle (entreprises >= 11 salariés)",
  },
  {
    id: "org-020",
    code: "APPRENTISSAGE",
    name: "Taxe d'apprentissage",
    organism: "URSSAF",
    category: "other",
    appliesTo: "employer",
    rateEmployer: 0.68,
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "Taxe d'apprentissage (partie principale)",
  },
  {
    id: "org-021",
    code: "TRANSPORT",
    name: "Versement mobilité",
    organism: "URSSAF",
    category: "other",
    appliesTo: "employer",
    rateEmployer: 2.95,
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "Versement mobilité (taux variable selon zone géographique)",
  },
  {
    id: "org-022",
    code: "PREVOYANCE",
    name: "Prévoyance cadres",
    organism: "Organisme prévoyance",
    category: "other",
    appliesTo: "employer",
    rateEmployer: 1.5,
    ceiling: PLAFOND_SS_MENSUEL_2024,
    tranche: "A",
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "Prévoyance obligatoire cadres (minimum 1.5% TA)",
  },
  {
    id: "org-023",
    code: "MUTUELLE",
    name: "Mutuelle obligatoire",
    organism: "Organisme mutuelle",
    category: "health",
    appliesTo: "both",
    rateEmployee: 0.5,
    rateEmployer: 0.5,
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "Part employeur minimum 50%",
  },
];

// Organisms list
export const organisms = [
  { id: "urssaf", name: "URSSAF", description: "Union de Recouvrement des cotisations de Sécurité Sociale et d'Allocations Familiales" },
  { id: "agirc-arrco", name: "AGIRC-ARRCO", description: "Retraite complémentaire des salariés" },
  { id: "prevoyance", name: "Organisme prévoyance", description: "Prévoyance complémentaire" },
  { id: "mutuelle", name: "Organisme mutuelle", description: "Complémentaire santé" },
];

// Helper functions
export function getOrganismRules(): OrganismRule[] {
  return mockOrganismRules.filter((rule) => rule.isActive);
}

export function getOrganismRulesByOrganism(organism: string): OrganismRule[] {
  return mockOrganismRules.filter(
    (rule) => rule.organism === organism && rule.isActive
  );
}

export function getOrganismRulesByCategory(
  category: OrganismRule["category"]
): OrganismRule[] {
  return mockOrganismRules.filter(
    (rule) => rule.category === category && rule.isActive
  );
}

export function getEmployeeRules(): OrganismRule[] {
  return mockOrganismRules.filter(
    (rule) =>
      (rule.appliesTo === "employee" || rule.appliesTo === "both") &&
      rule.isActive
  );
}

export function getEmployerRules(): OrganismRule[] {
  return mockOrganismRules.filter(
    (rule) =>
      (rule.appliesTo === "employer" || rule.appliesTo === "both") &&
      rule.isActive
  );
}

export function calculateOrganismDeductions(
  grossSalary: number,
  rules: OrganismRule[],
  type: "employee" | "employer"
): { ruleId: string; ruleName: string; ruleCode: string; organism: string; category: OrganismRule["category"]; baseAmount: number; rate: number; amount: number; ceiling?: number; tranche?: "A" | "B" | "C" }[] {
  const plafondSS = PLAFOND_SS_MENSUEL_2024;
  const results: { ruleId: string; ruleName: string; ruleCode: string; organism: string; category: OrganismRule["category"]; baseAmount: number; rate: number; amount: number; ceiling?: number; tranche?: "A" | "B" | "C" }[] = [];

  for (const rule of rules) {
    if (
      !rule.isActive ||
      (rule.appliesTo !== "both" && rule.appliesTo !== type)
    ) {
      continue;
    }

    const rate = type === "employee" ? rule.rateEmployee : rule.rateEmployer;
    if (!rate) continue;

    let baseAmount = grossSalary;
    let tranche: "A" | "B" | "C" | undefined;

    // Handle CSG/CRDS special base (98.25% of gross)
    if (rule.category === "csg" || rule.category === "crds") {
      baseAmount = grossSalary * 0.9825;
    }
    // Handle tranche calculations
    else if (rule.tranche === "A") {
      baseAmount = Math.min(grossSalary, plafondSS);
      tranche = "A";
    } else if (rule.tranche === "B") {
      baseAmount = Math.max(0, Math.min(grossSalary, (rule.ceiling || plafondSS * 8)) - plafondSS);
      tranche = "B";
      if (baseAmount === 0) continue; // Skip if no tranche B
    } else if (rule.ceiling) {
      baseAmount = Math.min(grossSalary, rule.ceiling);
    }

    const amount = baseAmount * (rate / 100);

    results.push({
      ruleId: rule.id,
      ruleName: rule.name,
      ruleCode: rule.code,
      organism: rule.organism,
      category: rule.category,
      baseAmount,
      rate,
      amount,
      ceiling: rule.ceiling,
      tranche,
    });
  }

  return results;
}
