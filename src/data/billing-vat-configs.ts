export interface VATConfig {
  id: string;
  clientId?: string;
  clientName?: string;
  serviceType?: string;
  vatRate: number;
  electronicInvoice: boolean;
  status: "Actif" | "Inactif";
  createdAt?: string;
  updatedAt?: string;
}

export const mockVATConfigs: VATConfig[] = [
  {
    id: "1",
    clientId: "1",
    clientName: "Centre Commercial Rosny 2",
    serviceType: "Gardiennage",
    vatRate: 20,
    electronicInvoice: true,
    status: "Actif",
    createdAt: "2024-01-15T10:00:00",
    updatedAt: "2024-01-15T10:00:00",
  },
  {
    id: "2",
    clientId: "2",
    clientName: "Siège Social La Défense",
    serviceType: "Rondes",
    vatRate: 20,
    electronicInvoice: true,
    status: "Actif",
    createdAt: "2024-01-15T10:00:00",
    updatedAt: "2024-01-15T10:00:00",
  },
  {
    id: "3",
    clientId: "3",
    clientName: "Entrepôt Logistique Gennevilliers",
    serviceType: "Événementiel",
    vatRate: 10,
    electronicInvoice: false,
    status: "Actif",
    createdAt: "2024-01-15T10:00:00",
    updatedAt: "2024-01-15T10:00:00",
  },
  {
    id: "4",
    clientId: "4",
    clientName: "Hôpital Saint-Antoine",
    serviceType: "Gardiennage",
    vatRate: 5.5,
    electronicInvoice: true,
    status: "Actif",
    createdAt: "2024-01-15T10:00:00",
    updatedAt: "2024-01-15T10:00:00",
  },
  {
    id: "5",
    clientId: "5",
    clientName: "Aéroport Charles de Gaulle",
    serviceType: "Gardiennage",
    vatRate: 20,
    electronicInvoice: true,
    status: "Actif",
    createdAt: "2024-01-15T10:00:00",
    updatedAt: "2024-01-15T10:00:00",
  },
  {
    id: "6",
    clientId: undefined,
    clientName: undefined,
    serviceType: undefined,
    vatRate: 20,
    electronicInvoice: true,
    status: "Actif",
    createdAt: "2024-01-01T10:00:00",
    updatedAt: "2024-01-01T10:00:00",
  },
];

