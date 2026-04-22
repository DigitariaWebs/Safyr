export interface LegalConvention {
  id: string;
  code: string;
  name: string;
  idcc: string;
  hourlyRate: number;
  overtime50: number;
  overtime100: number;
  nightBonus: number;
  sundayBonus: number;
  holidayBonus: number;
  status: "Actif" | "Inactif";
}

export interface CompanyStructure {
  id: string;
  code: string;
  name: string;
  type: "société" | "établissement" | "service";
  parentId?: string;
  siret?: string;
  address?: string;
  status: "Actif" | "Inactif";
}

export interface CostCenter {
  id: string;
  code: string;
  name: string;
  type: "Analytique" | "Opérationnel";
  companyStructureId: string;
  budget?: number;
  status: "Actif" | "Inactif";
}

export interface InternalRule {
  id: string;
  code: string;
  name: string;
  type: "Prime" | "Indemnité";
  amount?: number;
  percentage?: number;
  calculationBasis: "Fixe" | "% Salaire" | "% Heures";
  frequency: "Mensuelle" | "Trimestrielle" | "Annuelle" | "Ponctuelle";
  eligibleCategories: string[];
  status: "Actif" | "Inactif";
}

export interface MonthlyClosing {
  id: string;
  month: string;
  year: number;
  closingDate: string;
  closedBy: string;
  status: "Ouvert" | "Clôturé" | "Validé";
  payrollAmount: number;
  employeeCount: number;
}

export interface AccountingTransfer {
  id: string;
  name: string;
  transferType: "Paie" | "Charges" | "Provisions";
  accountPrefix: string;
  analyticalAxis?: string;
  automaticTransfer: boolean;
  status: "Actif" | "Inactif";
}

export const mockLegalConventions: LegalConvention[] = [
  {
    id: "1",
    code: "CONV-3016",
    name: "Convention Collective Nationale des Entreprises de Prévention et de Sécurité",
    idcc: "3016",
    hourlyRate: 11.65,
    overtime50: 25,
    overtime100: 50,
    nightBonus: 15,
    sundayBonus: 40,
    holidayBonus: 100,
    status: "Actif",
  },
  {
    id: "2",
    code: "CONV-1351",
    name: "Convention Collective Nationale des Hôtels, Cafés, Restaurants",
    idcc: "1351",
    hourlyRate: 11.52,
    overtime50: 25,
    overtime100: 50,
    nightBonus: 10,
    sundayBonus: 30,
    holidayBonus: 50,
    status: "Inactif",
  },
  {
    id: "3",
    code: "CONV-3043",
    name: "Convention Collective Nationale des Entreprises de Propreté",
    idcc: "3043",
    hourlyRate: 11.48,
    overtime50: 25,
    overtime100: 50,
    nightBonus: 12,
    sundayBonus: 35,
    holidayBonus: 60,
    status: "Inactif",
  },
];

export const mockCompanyStructures: CompanyStructure[] = [
  {
    id: "1",
    code: "SAFYR-HQ",
    name: "Safyr Security - Siège",
    type: "société",
    siret: "12345678901234",
    address: "123 Rue de la Sécurité, 75001 Paris",
    status: "Actif",
  },
  {
    id: "2",
    code: "SAFYR-IDF",
    name: "Établissement Île-de-France",
    type: "établissement",
    parentId: "1",
    siret: "12345678901235",
    address: "45 Avenue Hoche, 92100 Boulogne",
    status: "Actif",
  },
  {
    id: "3",
    code: "SAFYR-PACA",
    name: "Établissement PACA",
    type: "établissement",
    parentId: "1",
    siret: "12345678901236",
    address: "78 Boulevard Longchamp, 13001 Marseille",
    status: "Actif",
  },
  {
    id: "4",
    code: "SAFYR-RH",
    name: "Service Ressources Humaines",
    type: "service",
    parentId: "1",
    status: "Actif",
  },
  {
    id: "5",
    code: "SAFYR-OPS",
    name: "Service Opérationnel",
    type: "service",
    parentId: "2",
    status: "Actif",
  },
];

export const mockCostCenters: CostCenter[] = [
  {
    id: "1",
    code: "CC-ADM",
    name: "Administration",
    type: "Analytique",
    companyStructureId: "1",
    budget: 250000,
    status: "Actif",
  },
  {
    id: "2",
    code: "CC-OPS-IDF",
    name: "Opérations Île-de-France",
    type: "Opérationnel",
    companyStructureId: "2",
    budget: 850000,
    status: "Actif",
  },
  {
    id: "3",
    code: "CC-OPS-PACA",
    name: "Opérations PACA",
    type: "Opérationnel",
    companyStructureId: "3",
    budget: 650000,
    status: "Actif",
  },
  {
    id: "4",
    code: "CC-FORM",
    name: "Formation",
    type: "Analytique",
    companyStructureId: "1",
    budget: 120000,
    status: "Actif",
  },
  {
    id: "5",
    code: "CC-RH",
    name: "Ressources Humaines",
    type: "Analytique",
    companyStructureId: "4",
    budget: 180000,
    status: "Actif",
  },
];

export const mockInternalRules: InternalRule[] = [
  {
    id: "1",
    code: "PRIME-PANIER",
    name: "Prime de Panier",
    type: "Prime",
    amount: 6.5,
    calculationBasis: "Fixe",
    frequency: "Mensuelle",
    eligibleCategories: ["Agent", "Chef d'équipe"],
    status: "Actif",
  },
  {
    id: "2",
    code: "IND-TRANSPORT",
    name: "Indemnité de Transport",
    type: "Indemnité",
    amount: 50,
    calculationBasis: "Fixe",
    frequency: "Mensuelle",
    eligibleCategories: ["Agent", "Chef d'équipe", "Cadre"],
    status: "Actif",
  },
  {
    id: "3",
    code: "PRIME-ANCIENNETE",
    name: "Prime d'Ancienneté",
    type: "Prime",
    percentage: 3,
    calculationBasis: "% Salaire",
    frequency: "Mensuelle",
    eligibleCategories: ["Agent", "Chef d'équipe", "Cadre"],
    status: "Actif",
  },
  {
    id: "4",
    code: "PRIME-ASTREINTE",
    name: "Prime d'Astreinte",
    type: "Prime",
    amount: 150,
    calculationBasis: "Fixe",
    frequency: "Ponctuelle",
    eligibleCategories: ["Chef d'équipe", "Cadre"],
    status: "Actif",
  },
  {
    id: "5",
    code: "IND-KILOMETRIQUE",
    name: "Indemnité Kilométrique",
    type: "Indemnité",
    amount: 0.42,
    calculationBasis: "Fixe",
    frequency: "Mensuelle",
    eligibleCategories: ["Agent", "Chef d'équipe", "Cadre"],
    status: "Actif",
  },
];

export const mockMonthlyClosings: MonthlyClosing[] = [
  {
    id: "1",
    month: "Décembre",
    year: 2024,
    closingDate: "2024-12-31",
    closedBy: "Marie Dubois",
    status: "Validé",
    payrollAmount: 485000,
    employeeCount: 48,
  },
  {
    id: "2",
    month: "Janvier",
    year: 2025,
    closingDate: "2025-01-31",
    closedBy: "Marie Dubois",
    status: "Clôturé",
    payrollAmount: 492000,
    employeeCount: 50,
  },
  {
    id: "3",
    month: "Février",
    year: 2025,
    closingDate: "2025-02-28",
    closedBy: "En cours",
    status: "Ouvert",
    payrollAmount: 0,
    employeeCount: 51,
  },
];

export const mockAccountingTransfers: AccountingTransfer[] = [
  {
    id: "1",
    name: "Transfert Salaires",
    transferType: "Paie",
    accountPrefix: "641",
    analyticalAxis: "CC",
    automaticTransfer: true,
    status: "Actif",
  },
  {
    id: "2",
    name: "Transfert Charges Sociales",
    transferType: "Charges",
    accountPrefix: "645",
    analyticalAxis: "CC",
    automaticTransfer: true,
    status: "Actif",
  },
  {
    id: "3",
    name: "Provisions Congés Payés",
    transferType: "Provisions",
    accountPrefix: "438",
    analyticalAxis: "CC",
    automaticTransfer: false,
    status: "Actif",
  },
  {
    id: "4",
    name: "Transfert Primes",
    transferType: "Paie",
    accountPrefix: "641",
    analyticalAxis: "CC",
    automaticTransfer: true,
    status: "Actif",
  },
];
