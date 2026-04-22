/**
 * Billing services mock data and types
 * - Used by the billing "Services" module
 * - Fields are localized to French where appropriate
 */

export type ServiceUnit = "h" | "Nbre";
export type ServiceType = "Service" | "Produit";
export type PriceBase = "Prix HT" | "Prix TTC";

export interface BillingService {
  id: string;
  code?: string;
  name: string;
  serviceType: ServiceType;
  comment?: string;
  unit: ServiceUnit;
  priceBase?: PriceBase;
  priceHT: number;
  vatRate: number; // % TVA
  priceTTC: number;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Helper to compute TTC from HT + TVA
 */
export function computePriceTTC(priceHT: number, vatRate: number) {
  const ttc = priceHT + (priceHT * vatRate) / 100;
  // round to 2 decimals
  return Math.round(ttc * 100) / 100;
}

/**
 * Mock services used in the demo UI
 */
export const mockBillingServices: BillingService[] = [
  {
    id: "S-001",
    code: "SS1",
    name: "SSIAP1",
    serviceType: "Service",
    comment: "Prestation SSIAP niveau 1 (heure)",
    unit: "h",
    priceBase: "Prix HT",
    priceHT: 20.0,
    vatRate: 20,
    priceTTC: computePriceTTC(20.0, 20),
    createdAt: new Date().toISOString(),
  },
  {
    id: "S-002",
    code: "ACC-H",
    name: "Accueil - Poste horaire",
    serviceType: "Service",
    comment: "Prestation d'accueil (tarif horaire)",
    unit: "h",
    priceBase: "Prix HT",
    priceHT: 18.0,
    vatRate: 20,
    priceTTC: computePriceTTC(18.0, 20),
    createdAt: new Date().toISOString(),
  },
  {
    id: "S-003",
    code: "INT-H",
    name: "Intervention - Heure",
    serviceType: "Service",
    comment: "Intervention ponctuelle au tarif horaire",
    unit: "h",
    priceBase: "Prix HT",
    priceHT: 35.0,
    vatRate: 20,
    priceTTC: computePriceTTC(35.0, 20),
    createdAt: new Date().toISOString(),
  },
  {
    id: "S-004",
    code: "AST-N",
    name: "Astreinte - Nombre",
    serviceType: "Service",
    comment: "Astreinte forfaitaire (par unité)",
    unit: "Nbre",
    priceBase: "Prix HT",
    priceHT: 120.0,
    vatRate: 20,
    priceTTC: computePriceTTC(120.0, 20),
    createdAt: new Date().toISOString(),
  },
  {
    id: "S-005",
    code: "FRAIS",
    name: "Frais de dossier",
    serviceType: "Service",
    comment: "Frais administratifs par dossier",
    unit: "Nbre",
    priceBase: "Prix HT",
    priceHT: 10.0,
    vatRate: 20,
    priceTTC: computePriceTTC(10.0, 20),
    createdAt: new Date().toISOString(),
  },
];
