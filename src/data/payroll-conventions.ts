export interface PayrollConvention {
  id: string;
  idcc: string;
  name: string;
  sector: string;
  lastUpdate: string;
  minimumWage: number;
  nightBonus: number; // %
  sundayBonus: number; // %
  holidayBonus: number; // %
  overtimeRate: number; // %
  maxAmplitude: number; // hours
  accidentRate: number; // %
  status: "Active" | "En révision" | "Inactive";
}

export const mockPayrollConventions: PayrollConvention[] = [
  {
    id: "1",
    idcc: "1351",
    name: "Convention Collective Prévention-Sécurité",
    sector: "Sécurité Privée",
    lastUpdate: "2024-01-01",
    minimumWage: 11.65,
    nightBonus: 10,
    sundayBonus: 25,
    holidayBonus: 50,
    overtimeRate: 25,
    maxAmplitude: 12,
    accidentRate: 3.2,
    status: "Active",
  },
  {
    id: "2",
    idcc: "3199",
    name: "Convention Collective Gardiennage",
    sector: "Gardiennage et Surveillance",
    lastUpdate: "2024-01-01",
    minimumWage: 11.52,
    nightBonus: 12,
    sundayBonus: 20,
    holidayBonus: 45,
    overtimeRate: 25,
    maxAmplitude: 12,
    accidentRate: 2.8,
    status: "Active",
  },
  {
    id: "3",
    idcc: "4127",
    name: "Convention Collective Agents de Sûreté Aéroportuaire",
    sector: "Sûreté Aéroportuaire",
    lastUpdate: "2024-01-01",
    minimumWage: 12.1,
    nightBonus: 15,
    sundayBonus: 30,
    holidayBonus: 55,
    overtimeRate: 25,
    maxAmplitude: 10,
    accidentRate: 2.5,
    status: "Active",
  },
];
