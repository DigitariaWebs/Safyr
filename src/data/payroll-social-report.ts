import { PayrollSocialReport } from "@/lib/types";

export const mockPayrollSocialReport2024: PayrollSocialReport = {
  period: {
    year: 2024,
    label: "Année 2024",
  },
  generatedAt: new Date("2024-12-20"),
  generatedBy: "Marie Dubois",

  masses: {
    grossTotal: 4850000,
    netTotal: 3720000,
    netTaxable: 3680000,
    employerContributions: 2135000,
    employeeContributions: 1130000,
    totalEmployerCost: 6985000,
  },

  costAnalysis: {
    averageGrossSalary: 2425,
    averageNetSalary: 1860,
    averageEmployerCost: 3492.5,
    averageHourlyCost: 22.5,
    hourlyCostByCategory: [
      {
        category: "Agent de sécurité",
        cost: 18.5,
        hoursWorked: 180000,
      },
      {
        category: "Chef de poste",
        cost: 24.8,
        hoursWorked: 25000,
      },
      {
        category: "Superviseur",
        cost: 32.5,
        hoursWorked: 15000,
      },
      {
        category: "Administratif",
        cost: 28.0,
        hoursWorked: 12000,
      },
      {
        category: "Cadre",
        cost: 45.0,
        hoursWorked: 8000,
      },
    ],
    hourlyCostBySite: [
      {
        siteId: "site-1",
        siteName: "Paris La Défense",
        cost: 24.2,
        hoursWorked: 85000,
      },
      {
        siteId: "site-2",
        siteName: "Lyon Confluence",
        cost: 21.5,
        hoursWorked: 62000,
      },
      {
        siteId: "site-3",
        siteName: "Marseille Vieux Port",
        cost: 20.8,
        hoursWorked: 48000,
      },
      {
        siteId: "site-4",
        siteName: "Toulouse Blagnac",
        cost: 19.5,
        hoursWorked: 45000,
      },
    ],
    hourlyCostByTeam: [
      {
        teamId: "team-1",
        teamName: "Équipe Alpha",
        cost: 22.8,
        hoursWorked: 65000,
      },
      {
        teamId: "team-2",
        teamName: "Équipe Bravo",
        cost: 21.2,
        hoursWorked: 58000,
      },
      {
        teamId: "team-3",
        teamName: "Équipe Charlie",
        cost: 23.5,
        hoursWorked: 52000,
      },
      {
        teamId: "team-4",
        teamName: "Équipe Delta",
        cost: 22.0,
        hoursWorked: 65000,
      },
    ],
  },

  demographics: {
    total: 156,
    byGender: {
      male: 118,
      female: 38,
    },
    byAge: [
      { range: "18-25", count: 24 },
      { range: "26-35", count: 52 },
      { range: "36-45", count: 38 },
      { range: "46-55", count: 28 },
      { range: "56+", count: 14 },
    ],
    bySeniority: [
      { range: "0-1 an", count: 35 },
      { range: "1-3 ans", count: 42 },
      { range: "3-5 ans", count: 28 },
      { range: "5-10 ans", count: 32 },
      { range: "10+ ans", count: 19 },
    ],
    byContractType: {
      cdi: 98,
      cdd: 42,
      apprentices: 12,
      interim: 4,
    },
    byStatus: {
      agent: 125,
      administrative: 18,
      manager: 13,
    },
  },

  turnover: {
    entries: 38,
    exits: 32,
    globalRate: 20.5,
    bySite: [
      {
        siteId: "site-1",
        siteName: "Paris La Défense",
        entries: 12,
        exits: 8,
        rate: 18.2,
      },
      {
        siteId: "site-2",
        siteName: "Lyon Confluence",
        entries: 10,
        exits: 9,
        rate: 21.5,
      },
      {
        siteId: "site-3",
        siteName: "Marseille Vieux Port",
        entries: 9,
        exits: 8,
        rate: 22.8,
      },
      {
        siteId: "site-4",
        siteName: "Toulouse Blagnac",
        entries: 7,
        exits: 7,
        rate: 19.5,
      },
    ],
    byContractType: [
      {
        contractType: "CDI",
        entries: 18,
        exits: 12,
        rate: 12.2,
      },
      {
        contractType: "CDD",
        entries: 15,
        exits: 16,
        rate: 38.1,
      },
      {
        contractType: "Apprentissage",
        entries: 5,
        exits: 4,
        rate: 33.3,
      },
    ],
    exitReasons: [
      { reason: "Fin de CDD", count: 12, percentage: 37.5 },
      { reason: "Démission", count: 8, percentage: 25.0 },
      { reason: "Licenciement", count: 4, percentage: 12.5 },
      { reason: "Rupture conventionnelle", count: 3, percentage: 9.4 },
      { reason: "Fin période d'essai", count: 3, percentage: 9.4 },
      { reason: "Retraite", count: 2, percentage: 6.2 },
    ],
  },

  contracts: {
    cdiCount: 98,
    cddCount: 42,
    cddRenewed: 18,
    averageCddDuration: 6.8,
    durationDistribution: [
      { range: "1-3 mois", count: 8 },
      { range: "3-6 mois", count: 14 },
      { range: "6-12 mois", count: 12 },
      { range: "12-18 mois", count: 6 },
      { range: "18+ mois", count: 2 },
    ],
  },

  absences: {
    totalDays: 1842,
    globalRate: 4.2,
    byType: [
      {
        type: "sickness",
        label: "Maladie",
        days: 782,
        rate: 1.8,
        cost: 125000,
      },
      {
        type: "workAccident",
        label: "Accident du travail",
        days: 324,
        rate: 0.74,
        cost: 78000,
      },
      {
        type: "paidLeave",
        label: "Congés payés",
        days: 658,
        rate: 1.5,
        cost: 95000,
      },
      {
        type: "unpaidLeave",
        label: "Congés sans solde",
        days: 42,
        rate: 0.096,
        cost: 0,
      },
      {
        type: "other",
        label: "Autres",
        days: 36,
        rate: 0.082,
        cost: 8500,
      },
    ],
    averageDuration: 5.8,
    directCost: 306500,
    indirectCost: 128000,
    totalCost: 434500,
  },

  workAccidents: {
    total: 18,
    withStoppage: 12,
    withoutStoppage: 6,
    averageStoppageDays: 27,
    frequencyRate: 7.5,
    gravityRate: 0.42,
    cost: 85000,
  },

  genderEquality: {
    averageMaleGross: 2480,
    averageFemaleGross: 2250,
    gap: 230,
    gapPercentage: 9.3,
    bySalaryCategory: [
      {
        category: "Agent de sécurité",
        maleAverage: 2150,
        femaleAverage: 2080,
        gap: 70,
        gapPercentage: 3.3,
      },
      {
        category: "Chef de poste",
        maleAverage: 2850,
        femaleAverage: 2720,
        gap: 130,
        gapPercentage: 4.6,
      },
      {
        category: "Superviseur",
        maleAverage: 3650,
        femaleAverage: 3420,
        gap: 230,
        gapPercentage: 6.3,
      },
      {
        category: "Administratif",
        maleAverage: 2980,
        femaleAverage: 2850,
        gap: 130,
        gapPercentage: 4.4,
      },
      {
        category: "Cadre",
        maleAverage: 4850,
        femaleAverage: 4420,
        gap: 430,
        gapPercentage: 8.9,
      },
    ],
  },

  comparison: {
    currentYear: 2024,
    previousYear: 2023,
    grossMassEvolution: 285000,
    grossMassEvolutionPercentage: 6.2,
    employerContributionsEvolution: 128000,
    employerContributionsEvolutionPercentage: 6.4,
    employeeContributionsEvolution: 65000,
    employeeContributionsEvolutionPercentage: 6.1,
    totalCostEvolution: 413000,
    totalCostEvolutionPercentage: 6.3,
    hourlyCostEvolution: 1.2,
    hourlyCostEvolutionPercentage: 5.6,
    headcountEvolution: 8,
    headcountEvolutionPercentage: 5.4,
  },
};

export const mockPayrollSocialReport202412: PayrollSocialReport = {
  period: {
    year: 2024,
    month: 12,
    label: "Décembre 2024",
  },
  generatedAt: new Date("2024-12-20"),
  generatedBy: "Marie Dubois",

  masses: {
    grossTotal: 412000,
    netTotal: 316000,
    netTaxable: 312000,
    employerContributions: 181000,
    employeeContributions: 96000,
    totalEmployerCost: 593000,
  },

  costAnalysis: {
    averageGrossSalary: 2641,
    averageNetSalary: 2026,
    averageEmployerCost: 3801,
    averageHourlyCost: 23.2,
    hourlyCostByCategory: [
      {
        category: "Agent de sécurité",
        cost: 19.2,
        hoursWorked: 15200,
      },
      {
        category: "Chef de poste",
        cost: 25.5,
        hoursWorked: 2150,
      },
      {
        category: "Superviseur",
        cost: 33.8,
        hoursWorked: 1280,
      },
      {
        category: "Administratif",
        cost: 28.8,
        hoursWorked: 1050,
      },
      {
        category: "Cadre",
        cost: 46.5,
        hoursWorked: 680,
      },
    ],
    hourlyCostBySite: [
      {
        siteId: "site-1",
        siteName: "Paris La Défense",
        cost: 25.0,
        hoursWorked: 7200,
      },
      {
        siteId: "site-2",
        siteName: "Lyon Confluence",
        cost: 22.2,
        hoursWorked: 5280,
      },
      {
        siteId: "site-3",
        siteName: "Marseille Vieux Port",
        cost: 21.5,
        hoursWorked: 4100,
      },
      {
        siteId: "site-4",
        siteName: "Toulouse Blagnac",
        cost: 20.1,
        hoursWorked: 3780,
      },
    ],
    hourlyCostByTeam: [
      {
        teamId: "team-1",
        teamName: "Équipe Alpha",
        cost: 23.5,
        hoursWorked: 5500,
      },
      {
        teamId: "team-2",
        teamName: "Équipe Bravo",
        cost: 21.8,
        hoursWorked: 4920,
      },
      {
        teamId: "team-3",
        teamName: "Équipe Charlie",
        cost: 24.2,
        hoursWorked: 4420,
      },
      {
        teamId: "team-4",
        teamName: "Équipe Delta",
        cost: 22.6,
        hoursWorked: 5520,
      },
    ],
  },

  demographics: {
    total: 156,
    byGender: {
      male: 118,
      female: 38,
    },
    byAge: [
      { range: "18-25", count: 24 },
      { range: "26-35", count: 52 },
      { range: "36-45", count: 38 },
      { range: "46-55", count: 28 },
      { range: "56+", count: 14 },
    ],
    bySeniority: [
      { range: "0-1 an", count: 35 },
      { range: "1-3 ans", count: 42 },
      { range: "3-5 ans", count: 28 },
      { range: "5-10 ans", count: 32 },
      { range: "10+ ans", count: 19 },
    ],
    byContractType: {
      cdi: 98,
      cdd: 42,
      apprentices: 12,
      interim: 4,
    },
    byStatus: {
      agent: 125,
      administrative: 18,
      manager: 13,
    },
  },

  turnover: {
    entries: 4,
    exits: 3,
    globalRate: 2.2,
    bySite: [
      {
        siteId: "site-1",
        siteName: "Paris La Défense",
        entries: 2,
        exits: 1,
        rate: 2.3,
      },
      {
        siteId: "site-2",
        siteName: "Lyon Confluence",
        entries: 1,
        exits: 1,
        rate: 2.1,
      },
      {
        siteId: "site-3",
        siteName: "Marseille Vieux Port",
        entries: 1,
        exits: 1,
        rate: 2.5,
      },
      {
        siteId: "site-4",
        siteName: "Toulouse Blagnac",
        entries: 0,
        exits: 0,
        rate: 0,
      },
    ],
    byContractType: [
      {
        contractType: "CDI",
        entries: 2,
        exits: 1,
        rate: 1.0,
      },
      {
        contractType: "CDD",
        entries: 2,
        exits: 2,
        rate: 4.8,
      },
      {
        contractType: "Apprentissage",
        entries: 0,
        exits: 0,
        rate: 0,
      },
    ],
    exitReasons: [
      { reason: "Fin de CDD", count: 2, percentage: 66.7 },
      { reason: "Démission", count: 1, percentage: 33.3 },
    ],
  },

  contracts: {
    cdiCount: 98,
    cddCount: 42,
    cddRenewed: 2,
    averageCddDuration: 6.8,
    durationDistribution: [
      { range: "1-3 mois", count: 8 },
      { range: "3-6 mois", count: 14 },
      { range: "6-12 mois", count: 12 },
      { range: "12-18 mois", count: 6 },
      { range: "18+ mois", count: 2 },
    ],
  },

  absences: {
    totalDays: 168,
    globalRate: 4.5,
    byType: [
      {
        type: "sickness",
        label: "Maladie",
        days: 72,
        rate: 1.9,
        cost: 11500,
      },
      {
        type: "workAccident",
        label: "Accident du travail",
        days: 28,
        rate: 0.75,
        cost: 6800,
      },
      {
        type: "paidLeave",
        label: "Congés payés",
        days: 62,
        rate: 1.7,
        cost: 9200,
      },
      {
        type: "unpaidLeave",
        label: "Congés sans solde",
        days: 4,
        rate: 0.11,
        cost: 0,
      },
      {
        type: "other",
        label: "Autres",
        days: 2,
        rate: 0.05,
        cost: 500,
      },
    ],
    averageDuration: 5.6,
    directCost: 28000,
    indirectCost: 11500,
    totalCost: 39500,
  },

  workAccidents: {
    total: 2,
    withStoppage: 1,
    withoutStoppage: 1,
    averageStoppageDays: 28,
    frequencyRate: 8.2,
    gravityRate: 0.45,
    cost: 7500,
  },

  genderEquality: {
    averageMaleGross: 2680,
    averageFemaleGross: 2420,
    gap: 260,
    gapPercentage: 9.7,
    bySalaryCategory: [
      {
        category: "Agent de sécurité",
        maleAverage: 2180,
        femaleAverage: 2105,
        gap: 75,
        gapPercentage: 3.4,
      },
      {
        category: "Chef de poste",
        maleAverage: 2920,
        femaleAverage: 2780,
        gap: 140,
        gapPercentage: 4.8,
      },
      {
        category: "Superviseur",
        maleAverage: 3720,
        femaleAverage: 3480,
        gap: 240,
        gapPercentage: 6.5,
      },
      {
        category: "Administratif",
        maleAverage: 3050,
        femaleAverage: 2910,
        gap: 140,
        gapPercentage: 4.6,
      },
      {
        category: "Cadre",
        maleAverage: 4980,
        femaleAverage: 4520,
        gap: 460,
        gapPercentage: 9.2,
      },
    ],
  },

  comparison: {
    currentYear: 2024,
    previousYear: 2023,
    grossMassEvolution: 24000,
    grossMassEvolutionPercentage: 6.2,
    employerContributionsEvolution: 10500,
    employerContributionsEvolutionPercentage: 6.2,
    employeeContributionsEvolution: 5500,
    employeeContributionsEvolutionPercentage: 6.1,
    totalCostEvolution: 34500,
    totalCostEvolutionPercentage: 6.2,
    hourlyCostEvolution: 1.2,
    hourlyCostEvolutionPercentage: 5.5,
    headcountEvolution: 1,
    headcountEvolutionPercentage: 0.6,
  },
};

export function getPayrollSocialReport(
  year: number,
  month?: number,
): PayrollSocialReport {
  if (month === 12 && year === 2024) {
    return mockPayrollSocialReport202412;
  }
  if (year === 2024 && !month) {
    return mockPayrollSocialReport2024;
  }

  // Default fallback
  return mockPayrollSocialReport2024;
}
