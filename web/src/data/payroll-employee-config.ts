export interface EmployeeContract {
  id: string;
  employeeId: string;
  employeeName: string;
  contractType: "CDI" | "CDD" | "Intérim" | "Apprentissage";
  startDate: string;
  endDate?: string;
  position: string;
  category: "Agent" | "Chef équipe" | "Cadre" | "Administratif";
  hourlyRate: number;
  monthlyGrossSalary: number;
  weeklyHours: number;
  status: "Actif" | "Suspendu" | "Terminé";
}

export interface ContractHistory {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  type: "Avenant" | "Modification" | "Renouvellement" | "Rupture";
  description: string;
  previousValue?: string;
  newValue?: string;
  validatedBy: string;
}

export interface EmploymentDeclaration {
  id: string;
  employeeId: string;
  employeeName: string;
  declarationType: "DPAE" | "DUE";
  declarationDate: string;
  status: "En attente" | "Envoyée" | "Validée" | "Rejetée";
  reference?: string;
}

export interface EmployeeAssignment {
  id: string;
  employeeId: string;
  employeeName: string;
  siteId: string;
  siteName: string;
  clientName: string;
  startDate: string;
  endDate?: string;
  position: string;
  weeklyHours: number;
  status: "Actif" | "Terminé" | "Suspendu";
}

export interface EmployeeQualification {
  id: string;
  employeeId: string;
  employeeName: string;
  qualificationType: "CQP" | "Carte Pro" | "SST" | "SSIAP" | "Autre";
  qualificationName: string;
  number: string;
  issueDate: string;
  expiryDate?: string;
  status: "Valide" | "Expire bientôt" | "Expiré";
}

export interface AbsenceImportConfig {
  id: string;
  absenceType:
    | "Maladie"
    | "AT/MP"
    | "Congés Payés"
    | "Congé Sans Solde"
    | "Autre";
  sourceModule: "Module RH" | "Planning" | "Externe";
  autoImport: boolean;
  importFrequency: "Temps réel" | "Quotidien" | "Hebdomadaire" | "Manuel";
  lastImport?: string;
  status: "Actif" | "Inactif";
}

export const mockEmployeeContracts: EmployeeContract[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "Dubois Marie",
    contractType: "CDI",
    startDate: "2020-01-15",
    position: "Chef d'équipe",
    category: "Chef équipe",
    hourlyRate: 15.5,
    monthlyGrossSalary: 2387.5,
    weeklyHours: 35,
    status: "Actif",
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Martin Pierre",
    contractType: "CDI",
    startDate: "2019-06-01",
    position: "Agent de Sécurité",
    category: "Agent",
    hourlyRate: 12.8,
    monthlyGrossSalary: 1971.2,
    weeklyHours: 35,
    status: "Actif",
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "Bernard Sophie",
    contractType: "CDD",
    startDate: "2024-11-01",
    endDate: "2025-04-30",
    position: "Agent de Sécurité",
    category: "Agent",
    hourlyRate: 12.5,
    monthlyGrossSalary: 1925,
    weeklyHours: 35,
    status: "Actif",
  },
  {
    id: "4",
    employeeId: "EMP004",
    employeeName: "Lefebvre Jean",
    contractType: "CDI",
    startDate: "2021-03-15",
    position: "Responsable d'Exploitation",
    category: "Cadre",
    hourlyRate: 22.5,
    monthlyGrossSalary: 3900,
    weeklyHours: 39,
    status: "Actif",
  },
  {
    id: "5",
    employeeId: "EMP005",
    employeeName: "Moreau Lucas",
    contractType: "CDI",
    startDate: "2022-09-01",
    position: "Agent de Sécurité",
    category: "Agent",
    hourlyRate: 12.5,
    monthlyGrossSalary: 1925,
    weeklyHours: 35,
    status: "Actif",
  },
];

export const mockContractHistory: ContractHistory[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "Dubois Marie",
    date: "2024-01-01",
    type: "Avenant",
    description: "Augmentation salariale",
    previousValue: "14.50 €/h",
    newValue: "15.50 €/h",
    validatedBy: "Direction RH",
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Martin Pierre",
    date: "2023-06-01",
    type: "Avenant",
    description: "Passage à temps partiel",
    previousValue: "35h/semaine",
    newValue: "28h/semaine",
    validatedBy: "Direction RH",
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "Bernard Sophie",
    date: "2024-11-01",
    type: "Modification",
    description: "Création contrat CDD",
    previousValue: "-",
    newValue: "CDD 6 mois",
    validatedBy: "Direction",
  },
  {
    id: "4",
    employeeId: "EMP004",
    employeeName: "Lefebvre Jean",
    date: "2024-03-15",
    type: "Avenant",
    description: "Promotion",
    previousValue: "Chef d'équipe",
    newValue: "Responsable d'Exploitation",
    validatedBy: "Direction",
  },
  {
    id: "5",
    employeeId: "EMP005",
    employeeName: "Moreau Lucas",
    date: "2023-09-01",
    type: "Avenant",
    description: "Augmentation conventionnelle",
    previousValue: "11.80 €/h",
    newValue: "12.50 €/h",
    validatedBy: "Direction RH",
  },
];

export const mockEmploymentDeclarations: EmploymentDeclaration[] = [
  {
    id: "1",
    employeeId: "EMP003",
    employeeName: "Bernard Sophie",
    declarationType: "DPAE",
    declarationDate: "2024-10-28",
    status: "Validée",
    reference: "DPAE-2024-10-001",
  },
  {
    id: "2",
    employeeId: "EMP005",
    employeeName: "Moreau Lucas",
    declarationType: "DPAE",
    declarationDate: "2022-08-25",
    status: "Validée",
    reference: "DPAE-2022-08-015",
  },
  {
    id: "3",
    employeeId: "EMP001",
    employeeName: "Dubois Marie",
    declarationType: "DPAE",
    declarationDate: "2020-01-10",
    status: "Validée",
    reference: "DPAE-2020-01-003",
  },
  {
    id: "4",
    employeeId: "EMP006",
    employeeName: "Nouveau Employé",
    declarationType: "DPAE",
    declarationDate: "2025-02-15",
    status: "En attente",
  },
];

export const mockEmployeeAssignments: EmployeeAssignment[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "Dubois Marie",
    siteId: "SITE001",
    siteName: "Centre Commercial Beaugrenelle",
    clientName: "Unibail-Rodamco",
    startDate: "2023-01-01",
    position: "Chef d'équipe",
    weeklyHours: 35,
    status: "Actif",
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Martin Pierre",
    siteId: "SITE002",
    siteName: "Siège BNP Paribas",
    clientName: "BNP Paribas",
    startDate: "2022-06-01",
    position: "Agent de Sécurité",
    weeklyHours: 35,
    status: "Actif",
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "Bernard Sophie",
    siteId: "SITE003",
    siteName: "Aéroport CDG Terminal 2",
    clientName: "ADP",
    startDate: "2024-11-01",
    endDate: "2025-04-30",
    position: "Agent de Sécurité",
    weeklyHours: 35,
    status: "Actif",
  },
  {
    id: "4",
    employeeId: "EMP004",
    employeeName: "Lefebvre Jean",
    siteId: "SITE001",
    siteName: "Centre Commercial Beaugrenelle",
    clientName: "Unibail-Rodamco",
    startDate: "2024-03-15",
    position: "Responsable d'Exploitation",
    weeklyHours: 39,
    status: "Actif",
  },
  {
    id: "5",
    employeeId: "EMP005",
    employeeName: "Moreau Lucas",
    siteId: "SITE004",
    siteName: "Musée du Louvre",
    clientName: "Établissement Public Musée du Louvre",
    startDate: "2022-09-01",
    position: "Agent de Sécurité",
    weeklyHours: 35,
    status: "Actif",
  },
];

export const mockEmployeeQualifications: EmployeeQualification[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "Dubois Marie",
    qualificationType: "Carte Pro",
    qualificationName: "Carte Professionnelle",
    number: "FOR-075-2024-12-00123",
    issueDate: "2024-01-15",
    expiryDate: "2029-01-15",
    status: "Valide",
  },
  {
    id: "2",
    employeeId: "EMP001",
    employeeName: "Dubois Marie",
    qualificationType: "CQP",
    qualificationName: "CQP Agent de Prévention et de Sécurité",
    number: "CQP-2019-456",
    issueDate: "2019-11-20",
    status: "Valide",
  },
  {
    id: "3",
    employeeId: "EMP002",
    employeeName: "Martin Pierre",
    qualificationType: "Carte Pro",
    qualificationName: "Carte Professionnelle",
    number: "FOR-075-2023-08-00089",
    issueDate: "2019-05-10",
    expiryDate: "2024-05-10",
    status: "Expiré",
  },
  {
    id: "4",
    employeeId: "EMP002",
    employeeName: "Martin Pierre",
    qualificationType: "SST",
    qualificationName: "Sauveteur Secouriste du Travail",
    number: "SST-2023-789",
    issueDate: "2023-03-15",
    expiryDate: "2025-03-15",
    status: "Valide",
  },
  {
    id: "5",
    employeeId: "EMP003",
    employeeName: "Bernard Sophie",
    qualificationType: "Carte Pro",
    qualificationName: "Carte Professionnelle",
    number: "FOR-075-2024-10-00234",
    issueDate: "2024-10-20",
    expiryDate: "2029-10-20",
    status: "Valide",
  },
  {
    id: "6",
    employeeId: "EMP004",
    employeeName: "Lefebvre Jean",
    qualificationType: "SSIAP",
    qualificationName: "SSIAP 2",
    number: "SSIAP2-2021-345",
    issueDate: "2021-02-10",
    expiryDate: "2025-04-15",
    status: "Expire bientôt",
  },
  {
    id: "7",
    employeeId: "EMP005",
    employeeName: "Moreau Lucas",
    qualificationType: "Carte Pro",
    qualificationName: "Carte Professionnelle",
    number: "FOR-075-2024-08-00198",
    issueDate: "2022-08-20",
    expiryDate: "2027-08-20",
    status: "Valide",
  },
];

export const mockAbsenceImportConfigs: AbsenceImportConfig[] = [
  {
    id: "1",
    absenceType: "Maladie",
    sourceModule: "Module RH",
    autoImport: true,
    importFrequency: "Temps réel",
    lastImport: "2025-02-10 14:30",
    status: "Actif",
  },
  {
    id: "2",
    absenceType: "AT/MP",
    sourceModule: "Module RH",
    autoImport: true,
    importFrequency: "Temps réel",
    lastImport: "2025-01-28 09:15",
    status: "Actif",
  },
  {
    id: "3",
    absenceType: "Congés Payés",
    sourceModule: "Planning",
    autoImport: true,
    importFrequency: "Quotidien",
    lastImport: "2025-02-10 08:00",
    status: "Actif",
  },
  {
    id: "4",
    absenceType: "Congé Sans Solde",
    sourceModule: "Module RH",
    autoImport: false,
    importFrequency: "Manuel",
    lastImport: "2025-01-15 16:45",
    status: "Actif",
  },
  {
    id: "5",
    absenceType: "Autre",
    sourceModule: "Externe",
    autoImport: false,
    importFrequency: "Manuel",
    status: "Inactif",
  },
];
