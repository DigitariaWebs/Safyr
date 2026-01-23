import { StateHelp, StateHelpApplication } from "@/lib/types.d";

// Mock state help / employer reductions
export const mockStateHelps: StateHelp[] = [
  {
    id: "sh-001",
    code: "FILLON",
    name: "Réduction générale (Fillon)",
    type: "reduction",
    calculationMethod: "formula",
    formula: "T × (1.6 × SMIC annuel / rémunération annuelle brute - 1)",
    conditions: [
      "Salaire inférieur à 1.6 SMIC",
      "Applicable à tous les employeurs",
      "Applicable aux CDI et CDD",
    ],
    maxAmount: undefined, // Calculated based on formula
    isActive: true,
    effectiveDate: "2024-01-01",
    description:
      "Réduction des cotisations patronales pour les salaires inférieurs à 1.6 SMIC. Le coefficient T est de 0.3194 pour les entreprises de moins de 50 salariés et 0.3234 pour les autres.",
  },
  {
    id: "sh-002",
    code: "EMBAUCHE_ZRR",
    name: "Exonération ZRR",
    type: "exoneration",
    calculationMethod: "percentage",
    rate: 100,
    conditions: [
      "Entreprise située en Zone de Revitalisation Rurale",
      "Embauche en CDI ou CDD de 12 mois minimum",
      "Salaire jusqu'à 1.5 SMIC",
    ],
    maxAmount: undefined,
    isActive: true,
    effectiveDate: "2024-01-01",
    description:
      "Exonération totale des cotisations patronales de sécurité sociale pour les embauches en ZRR.",
  },
  {
    id: "sh-003",
    code: "APPRENTI",
    name: "Aide à l'embauche d'un apprenti",
    type: "credit",
    calculationMethod: "fixed",
    amount: 6000,
    conditions: [
      "Contrat d'apprentissage",
      "Apprenti de moins de 30 ans",
      "Préparant un diplôme jusqu'au niveau Bac+5",
    ],
    maxAmount: 6000,
    isActive: true,
    effectiveDate: "2024-01-01",
    description:
      "Aide unique à l'embauche d'un apprenti de 6000€ pour la première année.",
  },
  {
    id: "sh-004",
    code: "JEI",
    name: "Exonération JEI",
    type: "exoneration",
    calculationMethod: "percentage",
    rate: 100,
    conditions: [
      "Statut Jeune Entreprise Innovante",
      "Personnel affecté à la R&D",
      "Dans la limite de 4.5 SMIC",
    ],
    maxAmount: undefined,
    isActive: true,
    effectiveDate: "2024-01-01",
    description:
      "Exonération des cotisations patronales pour les salariés affectés à la R&D dans les JEI.",
  },
  {
    id: "sh-005",
    code: "LODEOM",
    name: "Exonération LODEOM",
    type: "exoneration",
    calculationMethod: "percentage",
    rate: 100,
    conditions: [
      "Entreprise située en Outre-mer",
      "Secteurs éligibles",
      "Salaire jusqu'à un certain seuil selon barème",
    ],
    maxAmount: undefined,
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "Exonération de cotisations pour les entreprises d'Outre-mer.",
  },
  {
    id: "sh-006",
    code: "HEURES_SUP",
    name: "Réduction cotisations heures supplémentaires",
    type: "reduction",
    calculationMethod: "percentage",
    rate: 1.5,
    conditions: [
      "Heures supplémentaires effectuées",
      "Applicable à tous les employeurs",
    ],
    maxAmount: undefined,
    isActive: true,
    effectiveDate: "2024-01-01",
    description:
      "Déduction forfaitaire de cotisations patronales sur les heures supplémentaires (1.50€ par heure pour les entreprises de moins de 20 salariés, 0.50€ pour les autres).",
  },
  {
    id: "sh-007",
    code: "EMPLOI_FRANC",
    name: "Aide Emploi franc",
    type: "credit",
    calculationMethod: "fixed",
    amount: 5000,
    conditions: [
      "Recrutement d'un demandeur d'emploi",
      "Résidant en Quartier Prioritaire de la Ville",
      "CDI ou CDD de 6 mois minimum",
    ],
    maxAmount: 15000,
    isActive: true,
    effectiveDate: "2024-01-01",
    description:
      "Aide de 5000€/an pendant 3 ans pour un CDI ou 2500€/an pendant 2 ans pour un CDD.",
  },
  {
    id: "sh-008",
    code: "CONTRAT_PRO",
    name: "Aide contrat de professionnalisation",
    type: "credit",
    calculationMethod: "fixed",
    amount: 6000,
    conditions: [
      "Contrat de professionnalisation",
      "Salarié de moins de 30 ans",
      "Préparation d'un diplôme ou titre professionnel",
    ],
    maxAmount: 6000,
    isActive: true,
    effectiveDate: "2024-01-01",
    description:
      "Aide exceptionnelle à l'embauche en contrat de professionnalisation.",
  },
  {
    id: "sh-009",
    code: "SENIOR",
    name: "CDD Senior",
    type: "reduction",
    calculationMethod: "percentage",
    rate: 50,
    conditions: [
      "Salarié de plus de 57 ans",
      "Inscrit comme demandeur d'emploi depuis plus de 3 mois",
      "CDD de 18 mois renouvelable une fois",
    ],
    maxAmount: undefined,
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "Aide à l'embauche des seniors en CDD.",
  },
  {
    id: "sh-010",
    code: "HANDICAP",
    name: "Aide à l'emploi des travailleurs handicapés",
    type: "credit",
    calculationMethod: "fixed",
    amount: 4000,
    conditions: [
      "Recrutement d'un travailleur handicapé",
      "CDI ou CDD de 6 mois minimum",
      "Temps de travail minimum 24h/semaine",
    ],
    maxAmount: 4000,
    isActive: true,
    effectiveDate: "2024-01-01",
    description: "Aide AGEFIPH à l'embauche de travailleurs handicapés.",
  },
];

// SMIC values for 2024
export const SMIC_HORAIRE_2024 = 11.65;
export const SMIC_MENSUEL_2024 = 1766.92;
export const SMIC_ANNUEL_2024 = 21203.04;

// Fillon coefficient T values
export const COEF_T_MOINS_50 = 0.3194; // Entreprises < 50 salariés
export const COEF_T_PLUS_50 = 0.3234; // Entreprises >= 50 salariés

// Helper functions
export function getStateHelps(): StateHelp[] {
  return mockStateHelps.filter((help) => help.isActive);
}

export function getStateHelpByCode(code: string): StateHelp | undefined {
  return mockStateHelps.find((help) => help.code === code && help.isActive);
}

export function getStateHelpsByType(
  type: StateHelp["type"]
): StateHelp[] {
  return mockStateHelps.filter(
    (help) => help.type === type && help.isActive
  );
}

// Calculate Fillon reduction
export function calculateFillonReduction(
  annualGrossSalary: number,
  isLessThan50Employees: boolean = true
): number {
  const T = isLessThan50Employees ? COEF_T_MOINS_50 : COEF_T_PLUS_50;
  const maxSalary = 1.6 * SMIC_ANNUEL_2024;

  if (annualGrossSalary >= maxSalary) {
    return 0;
  }

  // Coefficient de réduction = T × (1.6 × SMIC annuel / rémunération annuelle brute - 1)
  let coefficient = T * ((1.6 * SMIC_ANNUEL_2024) / annualGrossSalary - 1);

  // Le coefficient ne peut pas être négatif ni supérieur à T
  coefficient = Math.max(0, Math.min(coefficient, T));

  // La réduction s'applique sur le salaire brut
  return annualGrossSalary * coefficient;
}

// Calculate monthly Fillon reduction
export function calculateMonthlyFillonReduction(
  monthlyGrossSalary: number,
  isLessThan50Employees: boolean = true
): number {
  const annualEquivalent = monthlyGrossSalary * 12;
  const annualReduction = calculateFillonReduction(
    annualEquivalent,
    isLessThan50Employees
  );
  return annualReduction / 12;
}

// Calculate state help applications for an employee
export function calculateStateHelpApplications(
  monthlyGrossSalary: number,
  overtimeHours: number = 0,
  eligibleHelps: string[] = ["FILLON", "HEURES_SUP"],
  isLessThan50Employees: boolean = true
): StateHelpApplication[] {
  const applications: StateHelpApplication[] = [];

  for (const helpCode of eligibleHelps) {
    const help = getStateHelpByCode(helpCode);
    if (!help) continue;

    let calculatedAmount = 0;
    let appliedAmount = 0;

    switch (help.code) {
      case "FILLON":
        calculatedAmount = calculateMonthlyFillonReduction(
          monthlyGrossSalary,
          isLessThan50Employees
        );
        appliedAmount = help.maxAmount
          ? Math.min(calculatedAmount, help.maxAmount)
          : calculatedAmount;
        break;

      case "HEURES_SUP":
        // 1.50€ per overtime hour for companies < 20 employees
        // 0.50€ per overtime hour for companies >= 20 employees
        const ratePerHour = isLessThan50Employees ? 1.5 : 0.5;
        calculatedAmount = overtimeHours * ratePerHour;
        appliedAmount = calculatedAmount;
        break;

      case "APPRENTI":
      case "EMPLOI_FRANC":
      case "CONTRAT_PRO":
      case "HANDICAP":
        // Fixed amount helps - divide by 12 for monthly
        calculatedAmount = (help.amount || 0) / 12;
        appliedAmount = calculatedAmount;
        break;

      default:
        // For percentage-based helps
        if (help.calculationMethod === "percentage" && help.rate) {
          calculatedAmount = monthlyGrossSalary * (help.rate / 100);
          appliedAmount = help.maxAmount
            ? Math.min(calculatedAmount, help.maxAmount / 12)
            : calculatedAmount;
        }
    }

    if (appliedAmount > 0) {
      applications.push({
        helpId: help.id,
        helpName: help.name,
        helpCode: help.code,
        type: help.type,
        baseAmount: monthlyGrossSalary,
        calculatedAmount,
        appliedAmount,
      });
    }
  }

  return applications;
}

// Get total state help amount
export function getTotalStateHelp(
  applications: StateHelpApplication[]
): number {
  return applications.reduce((total, app) => total + app.appliedAmount, 0);
}
