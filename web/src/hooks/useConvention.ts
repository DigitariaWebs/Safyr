"use client";

import { useState, useEffect, useCallback } from "react";
import { PayrollConvention } from "@/data/payroll-conventions";
import {
  getConventionWithCache,
  isValidIDCC,
  getLegifranceURL,
} from "@/services/legifrance-api";

interface UseConventionResult {
  convention: PayrollConvention | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  legifranceUrl: string | null;
}

/**
 * Hook to fetch convention details by IDCC
 */
export function useConvention(idcc: string | null): UseConventionResult {
  const [convention, setConvention] = useState<PayrollConvention | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConvention = useCallback(async () => {
    if (!idcc || !isValidIDCC(idcc)) {
      setConvention(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getConventionWithCache(idcc);
      if (result) {
        setConvention(result);
      } else {
        setError("Convention non trouvée");
        setConvention(null);
      }
    } catch (err) {
      setError("Erreur lors de la récupération de la convention");
      setConvention(null);
      console.error("Convention fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [idcc]);

  useEffect(() => {
    fetchConvention();
  }, [fetchConvention]);

  const legifranceUrl = convention
    ? getLegifranceURL(convention.idcc, convention.brochureJO)
    : null;

  return {
    convention,
    loading,
    error,
    refetch: fetchConvention,
    legifranceUrl,
  };
}

interface UseConventionSearchResult {
  search: (idcc: string) => Promise<PayrollConvention | null>;
  searching: boolean;
  searchError: string | null;
}

/**
 * Hook for searching conventions on demand
 */
export function useConventionSearch(): UseConventionSearchResult {
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const search = useCallback(
    async (idcc: string): Promise<PayrollConvention | null> => {
      if (!idcc || !isValidIDCC(idcc)) {
        setSearchError("IDCC invalide (format attendu: 4 chiffres)");
        return null;
      }

      setSearching(true);
      setSearchError(null);

      try {
        const result = await getConventionWithCache(idcc);
        if (!result) {
          setSearchError("Convention non trouvée dans la base officielle");
        }
        return result;
      } catch (err) {
        setSearchError("Erreur lors de la recherche");
        console.error("Convention search error:", err);
        return null;
      } finally {
        setSearching(false);
      }
    },
    [],
  );

  return {
    search,
    searching,
    searchError,
  };
}

interface UseConventionAutoPopulateResult {
  autoPopulate: (idcc: string) => Promise<Partial<PayrollConvention> | null>;
  populating: boolean;
  populateError: string | null;
}

/**
 * Hook for auto-populating form with convention data
 */
export function useConventionAutoPopulate(): UseConventionAutoPopulateResult {
  const [populating, setPopulating] = useState(false);
  const [populateError, setPopulateError] = useState<string | null>(null);

  const autoPopulate = useCallback(
    async (idcc: string): Promise<Partial<PayrollConvention> | null> => {
      if (!idcc || !isValidIDCC(idcc)) {
        return null;
      }

      setPopulating(true);
      setPopulateError(null);

      try {
        const convention = await getConventionWithCache(idcc);
        if (convention) {
          return {
            idcc: convention.idcc,
            name: convention.name,
            brochureJO: convention.brochureJO,
            sector: convention.sector,
            minimumWage: convention.minimumWage,
            hourlyRateByCategory: convention.hourlyRateByCategory,
            nightBonus: convention.nightBonus,
            sundayBonus: convention.sundayBonus,
            holidayBonus: convention.holidayBonus,
            overtimeRate: convention.overtimeRate,
            panierAmount: convention.panierAmount,
            habillageDeshabillageDuration:
              convention.habillageDeshabillageDuration,
            habillageDeshabillagePay: convention.habillageDeshabillagePay,
            ancienneteRates: convention.ancienneteRates,
            accidentRate: convention.accidentRate,
          };
        }
        return null;
      } catch (err) {
        setPopulateError("Erreur lors de la récupération des données");
        console.error("Auto-populate error:", err);
        return null;
      } finally {
        setPopulating(false);
      }
    },
    [],
  );

  return {
    autoPopulate,
    populating,
    populateError,
  };
}
