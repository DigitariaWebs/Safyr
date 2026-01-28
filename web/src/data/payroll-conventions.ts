export interface PayrollConvention {
  id: string;
  idcc: string;
  brochureJO?: string; // Numéro de brochure JO
  name: string;
  sector: string;
  lastUpdate: string;
  minimumWage: number;
  hourlyRateByCategory?: {
    agent?: number;
    agentQualifie?: number;
    chefEquipe?: number;
    cadre?: number;
  };
  nightBonus: number; // %
  sundayBonus: number; // %
  holidayBonus: number; // %
  overtimeRate: number; // %
  maxAmplitude: number; // hours
  accidentRate: number; // %
  panierAmount?: number; // € per day
  habillageDeshabillageDuration?: number; // minutes
  habillageDeshabillagePay?: number; // € per day
  ancienneteRates?: {
    threeYears?: number; // %
    fiveYears?: number; // %
    tenYears?: number; // %
    fifteenYears?: number; // %
  };
  status: "Active" | "En révision" | "Inactive";
}

export const mockPayrollConventions: PayrollConvention[] = [
  {
    id: "1",
    idcc: "1351",
    brochureJO: "3196",
    name: "Convention Collective Nationale des Entreprises de Prévention et de Sécurité",
    sector: "Prévention et Sécurité",
    lastUpdate: "2025-01-01",
    minimumWage: 12.0,
    hourlyRateByCategory: {
      agent: 12.0,
      agentQualifie: 12.5,
      chefEquipe: 14.0,
      cadre: 18.0,
    },
    nightBonus: 10,
    sundayBonus: 40,
    holidayBonus: 100,
    overtimeRate: 25,
    maxAmplitude: 12,
    accidentRate: 2.57,
    panierAmount: 8.0,
    habillageDeshabillageDuration: 10,
    habillageDeshabillagePay: 0.0, // Calculated based on convention
    ancienneteRates: {
      threeYears: 2,
      fiveYears: 4,
      tenYears: 6,
      fifteenYears: 8,
    },
    status: "Active",
  },
  {
    id: "2",
    idcc: "3199",
    brochureJO: "3199",
    name: "Convention Collective Gardiennage",
    sector: "Gardiennage et Surveillance",
    lastUpdate: "2025-01-01",
    minimumWage: 11.8,
    hourlyRateByCategory: {
      agent: 11.8,
      agentQualifie: 12.2,
      chefEquipe: 13.5,
      cadre: 17.0,
    },
    nightBonus: 12,
    sundayBonus: 20,
    holidayBonus: 45,
    overtimeRate: 25,
    maxAmplitude: 12,
    accidentRate: 2.5,
    panierAmount: 7.5,
    ancienneteRates: {
      threeYears: 3,
      fiveYears: 5,
      tenYears: 7,
      fifteenYears: 9,
    },
    status: "Active",
  },
  {
    id: "3",
    idcc: "4127",
    brochureJO: "4127",
    name: "Convention Collective Agents de Sûreté Aéroportuaire",
    sector: "Sûreté Aéroportuaire",
    lastUpdate: "2025-01-01",
    minimumWage: 12.3,
    hourlyRateByCategory: {
      agent: 12.3,
      agentQualifie: 12.8,
      chefEquipe: 14.5,
      cadre: 19.0,
    },
    nightBonus: 15,
    sundayBonus: 30,
    holidayBonus: 55,
    overtimeRate: 25,
    maxAmplitude: 10,
    accidentRate: 2.2,
    panierAmount: 8.5,
    ancienneteRates: {
      threeYears: 2,
      fiveYears: 4,
      tenYears: 6,
      fifteenYears: 8,
    },
    status: "Active",
  },
];

// Helper function to get convention parameters by IDCC
export function getConventionByIDCC(
  idcc: string,
): PayrollConvention | undefined {
  return mockPayrollConventions.find((conv) => conv.idcc === idcc);
}

// Helper function to auto-populate convention parameters
export function autoPopulateConventionParameters(
  idcc: string,
): Partial<PayrollConvention> | null {
  const convention = getConventionByIDCC(idcc);
  if (!convention) {
    // Return default structure for unknown conventions
    return {
      idcc,
      status: "Active",
      overtimeRate: 25,
      maxAmplitude: 12,
    };
  }

  // Return all parameters from the found convention
  return { ...convention };
}

/**
 * Fetch convention from API
 * This will be replaced by actual API calls from legifrance-api service
 */
export async function fetchConventionFromAPI(
  idcc: string,
): Promise<PayrollConvention | null> {
  // This is a placeholder that should be replaced with actual API integration
  // Import from @/services/legifrance-api in components that need real-time fetching

  // For now, check local mock data
  const localConvention = getConventionByIDCC(idcc);
  if (localConvention) {
    return localConvention;
  }

  // Return null if not found locally
  // Components should use the legifrance-api service directly for API calls
  return null;
}

/**
 * List of common IDCCs in the security and surveillance sector
 */
export const COMMON_SECURITY_IDCCS = [
  "1351", // Prévention et Sécurité
  "3199", // Gardiennage
  "4127", // Sûreté Aéroportuaire
  "1486", // Bureaux d'études techniques
  "2098", // Personnel des agences générales d'assurances
] as const;

/**
 * Get convention name by IDCC (for quick lookups)
 */
export function getConventionNameByIDCC(idcc: string): string | null {
  const convention = getConventionByIDCC(idcc);
  return convention?.name || null;
}
