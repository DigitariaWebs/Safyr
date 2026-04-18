/**
 * Billing quotes (devis) types & mock data
 * - Provides a minimal structure for "Devis" (quotes/estimates)
 * - Used by the billing module for demo / UI
 */

export type QuoteUnit = "h" | "Nbre";
export type QuoteStatus = "Brouillon" | "Envoyé" | "Accepté" | "Refusé";

export interface QuoteLine {
  id: string;
  serviceId?: string; // optional link to catalog service
  description: string;
  date?: string;
  qty: number;
  unit: QuoteUnit;
  priceHT: number;
  vatRate: number;
  amountHT: number;
  amountTTC: number;
  notes?: string;
}

export interface BillingQuote {
  id: string;
  quoteNumber: string;
  clientId: string;
  clientName: string;
  date: string;
  validUntil: string;
  message?: string;
  lines: QuoteLine[];
  subtotal: number; // total HT
  vatAmount: number;
  total: number; // TTC
  status: QuoteStatus;
  createdAt: string;
  updatedAt?: string;
}

/** Helper to compute TTC from HT + TVA */
export function computePriceTTC(priceHT: number, vatRate: number) {
  const ttc = priceHT + (priceHT * vatRate) / 100;
  return Math.round(ttc * 100) / 100;
}

/** Example mock quotes */
export const mockBillingQuotes: BillingQuote[] = [
  {
    id: "Q-2025-013",
    quoteNumber: "DEV-2025-013",
    clientId: "1",
    clientName: "Centre Commercial Rosny 2",
    date: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    message: "Proposition de prestation annuelle - SSIAP & Rondes",
    lines: [
      {
        id: "QL-001",
        serviceId: "S-001",
        description: "SSIAP1 - Intervention (tarif horaire)",
        date: new Date().toISOString().split("T")[0],
        qty: 120,
        unit: "h",
        priceHT: 20.0,
        vatRate: 20,
        amountHT: Math.round(120 * 20.0 * 100) / 100,
        amountTTC: Math.round(computePriceTTC(120 * 20.0, 20) * 100) / 100,
      },
      {
        id: "QL-002",
        serviceId: "S-002",
        description: "Accueil - Heures complémentaires",
        date: new Date().toISOString().split("T")[0],
        qty: 80,
        unit: "h",
        priceHT: 18.0,
        vatRate: 20,
        amountHT: Math.round(80 * 18.0 * 100) / 100,
        amountTTC: Math.round(computePriceTTC(80 * 18.0, 20) * 100) / 100,
      },
    ],
    subtotal: Math.round((120 * 20.0 + 80 * 18.0) * 100) / 100,
    vatAmount: Math.round((120 * 20.0 * 20 + 80 * 18.0 * 20) / 100) / 100,
    total:
      Math.round(
        (computePriceTTC(120 * 20.0, 20) + computePriceTTC(80 * 18.0, 20)) *
          100,
      ) / 100,
    status: "Brouillon",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "Q-2025-012",
    quoteNumber: "DEV-2025-012",
    clientId: "3",
    clientName: "Entrepôt Logistique Gennevilliers",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    message: "Devis intervention ponctuelle - sécurité évènementielle",
    lines: [
      {
        id: "QL-010",
        description: "Intervention - déplacement et prestation (forfait)",
        qty: 1,
        unit: "Nbre",
        priceHT: 1500,
        vatRate: 20,
        amountHT: 1500,
        amountTTC: computePriceTTC(1500, 20),
      },
      {
        id: "QL-011",
        description: "Achat matériel consommable",
        qty: 3,
        unit: "Nbre",
        priceHT: 45.0,
        vatRate: 20,
        amountHT: Math.round(3 * 45.0 * 100) / 100,
        amountTTC: Math.round(computePriceTTC(3 * 45.0, 20) * 100) / 100,
      },
    ],
    subtotal: Math.round((1500 + 3 * 45) * 100) / 100,
    vatAmount: Math.round((1500 * 0.2 + 3 * 45 * 0.2) * 100) / 100,
    total:
      Math.round(
        (computePriceTTC(1500, 20) + computePriceTTC(3 * 45, 20)) * 100,
      ) / 100,
    status: "Envoyé",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
