/**
 * Légifrance API Integration Service
 *
 * This service handles fetching collective bargaining agreements (conventions collectives)
 * from the official French government API (Légifrance/DILA).
 *
 * API Documentation: https://api.gouv.fr/documentation/api-conventions-collectives
 * Base URL: https://www.data.gouv.fr/api/1/datasets/
 */

import { PayrollConvention } from "@/data/payroll-conventions";

// API Configuration
const LEGIFRANCE_API_BASE = "https://www.data.gouv.fr/fr/datasets/r/";
const CONVENTIONS_DATASET_ID = "0835fb0e-6f0c-4e24-b02e-451f6e6b3c3e"; // IDCC dataset

// Alternative API: Convention Collective API
const CC_API_BASE = "https://siret2idcc.fabrique.social.gouv.fr/api/v2";

interface LegifranceConvention {
  idcc: string;
  titre: string;
  nature: string;
  etat: string;
  debut: string;
  fin?: string;
  url?: string;
}

interface ConventionDetails {
  idcc: string;
  title: string;
  shortTitle?: string;
  brochureJO?: string;
  sector?: string;
  minimumWage?: number;
  effectiveDate?: string;
  status: "Active" | "En révision" | "Inactive";
  url?: string;
}

/**
 * Fetch conventions from open data API
 */
export async function fetchConventionsFromAPI(): Promise<LegifranceConvention[]> {
  try {
    const response = await fetch(
      `${LEGIFRANCE_API_BASE}${CONVENTIONS_DATASET_ID}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching conventions from Légifrance:", error);
    throw error;
  }
}

/**
 * Search convention by IDCC using alternative API
 */
export async function searchConventionByIDCC(idcc: string): Promise<ConventionDetails | null> {
  try {
    const response = await fetch(`${CC_API_BASE}/idcc/${idcc}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();

    return {
      idcc: data.idcc || idcc,
      title: data.title || data.titre || "Convention non trouvée",
      shortTitle: data.shortTitle || data.titre_court,
      brochureJO: extractBrochureNumber(data.url || ""),
      sector: data.nature || "Non spécifié",
      effectiveDate: data.debut || data.date_debut,
      status: determineStatus(data.etat),
      url: data.url,
    };
  } catch (error) {
    console.error(`Error fetching convention IDCC ${idcc}:`, error);
    return null;
  }
}

/**
 * Extract brochure JO number from URL or metadata
 */
function extractBrochureNumber(url: string): string | undefined {
  // Try to extract from URL like: .../brochure/3196/...
  const match = url.match(/brochure[\/:](\d+)/i);
  return match ? match[1] : undefined;
}

/**
 * Determine convention status
 */
function determineStatus(etat?: string): "Active" | "En révision" | "Inactive" {
  if (!etat) return "Active";

  const etatLower = etat.toLowerCase();

  if (etatLower.includes("vigueur") || etatLower.includes("active")) {
    return "Active";
  }
  if (etatLower.includes("révision") || etatLower.includes("revision")) {
    return "En révision";
  }
  return "Inactive";
}

/**
 * Enhanced convention search with fallback to multiple sources
 */
export async function getConventionDetails(idcc: string): Promise<PayrollConvention | null> {
  try {
    // First, try the official API
    const details = await searchConventionByIDCC(idcc);

    if (!details) {
      return null;
    }

    // Map to internal PayrollConvention format
    const convention: PayrollConvention = {
      id: `api-${idcc}`,
      idcc: details.idcc,
      brochureJO: details.brochureJO,
      name: details.title,
      sector: details.sector || "Non spécifié",
      lastUpdate: details.effectiveDate || new Date().toISOString().split('T')[0],
      minimumWage: details.minimumWage || 11.65, // SMIC as fallback
      nightBonus: 0, // These need to be fetched from convention text
      sundayBonus: 0,
      holidayBonus: 0,
      overtimeRate: 25, // Legal minimum
      maxAmplitude: 12,
      accidentRate: 2.5,
      status: details.status,
    };

    // Try to enrich with known parameters for specific IDCCs
    const enriched = enrichWithKnownParameters(convention);

    return enriched;
  } catch (error) {
    console.error(`Error getting convention details for IDCC ${idcc}:`, error);
    return null;
  }
}

/**
 * Enrich convention with known parameters from our database
 * This acts as a fallback when API doesn't provide all details
 */
function enrichWithKnownParameters(convention: PayrollConvention): PayrollConvention {
  const knownParameters: Record<string, Partial<PayrollConvention>> = {
    "1351": {
      brochureJO: "3196",
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
      panierAmount: 8.0,
      habillageDeshabillageDuration: 10,
      habillageDeshabillagePay: 0.5,
      ancienneteRates: {
        threeYears: 2,
        fiveYears: 4,
        tenYears: 6,
        fifteenYears: 8,
      },
      accidentRate: 2.57,
    },
    "3199": {
      brochureJO: "3199",
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
      panierAmount: 7.5,
      ancienneteRates: {
        threeYears: 3,
        fiveYears: 5,
        tenYears: 7,
        fifteenYears: 9,
      },
      accidentRate: 2.5,
    },
    "4127": {
      brochureJO: "4127",
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
      panierAmount: 8.5,
      ancienneteRates: {
        threeYears: 2,
        fiveYears: 4,
        tenYears: 6,
        fifteenYears: 8,
      },
      accidentRate: 2.2,
    },
  };

  const params = knownParameters[convention.idcc];
  if (params) {
    return { ...convention, ...params };
  }

  return convention;
}

/**
 * Batch fetch multiple conventions
 */
export async function fetchMultipleConventions(idccs: string[]): Promise<Map<string, PayrollConvention>> {
  const results = new Map<string, PayrollConvention>();

  const promises = idccs.map(async (idcc) => {
    const convention = await getConventionDetails(idcc);
    if (convention) {
      results.set(idcc, convention);
    }
  });

  await Promise.allSettled(promises);
  return results;
}

/**
 * Search conventions by keyword
 */
export async function searchConventionsByKeyword(keyword: string): Promise<ConventionDetails[]> {
  try {
    // This would need to be implemented with a proper search API
    // For now, return empty array as placeholder
    console.warn("Search by keyword not yet implemented");
    return [];
  } catch (error) {
    console.error("Error searching conventions:", error);
    return [];
  }
}

/**
 * Validate IDCC format
 */
export function isValidIDCC(idcc: string): boolean {
  // IDCC is typically 4 digits
  return /^\d{4}$/.test(idcc);
}

/**
 * Get convention URL on Légifrance
 */
export function getLegifranceURL(idcc: string, brochureJO?: string): string {
  if (brochureJO) {
    return `https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000005635185?idConteneur=KALICONT000005635185`;
  }
  return `https://www.legifrance.gouv.fr/recherche/juri?tab_selection=juri&searchField=ALL&query=IDCC+${idcc}`;
}

/**
 * Cache for API responses
 */
class ConventionCache {
  private cache = new Map<string, { data: PayrollConvention; timestamp: number }>();
  private readonly TTL = 24 * 60 * 60 * 1000; // 24 hours

  get(idcc: string): PayrollConvention | null {
    const cached = this.cache.get(idcc);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.TTL;
    if (isExpired) {
      this.cache.delete(idcc);
      return null;
    }

    return cached.data;
  }

  set(idcc: string, data: PayrollConvention): void {
    this.cache.set(idcc, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const conventionCache = new ConventionCache();

/**
 * Get convention with caching
 */
export async function getConventionWithCache(idcc: string): Promise<PayrollConvention | null> {
  // Check cache first
  const cached = conventionCache.get(idcc);
  if (cached) {
    return cached;
  }

  // Fetch from API
  const convention = await getConventionDetails(idcc);
  if (convention) {
    conventionCache.set(idcc, convention);
  }

  return convention;
}
