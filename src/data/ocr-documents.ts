export interface OCRDocument {
  id: string;
  type: 
    | "Facture fournisseur"
    | "Avoir"
    | "Dépense diverse"
    | "Note de frais"
    | "Devis / Contrat client"
    | "Relevé bancaire"
    | "Justificatif de paiement"
    | "Bordereau"
    | "Arrêt maladie"
    | "Justificatif d'absence"
    | "Fiche mutuelle / prévoyance"
    | "Contrat / Avenant";
  fileName: string;
  uploadDate: string;
  status: "En attente" | "En traitement" | "Traité" | "Erreur";
  confidence: number; // 0-100
  extractedData?: {
    amount?: number;
    date?: string;
    supplier?: string;
    account?: string;
  };
  assignedTo?: string; // Module destination
}

export const mockOCRDocuments: OCRDocument[] = [
  {
    id: "1",
    type: "Facture fournisseur",
    fileName: "facture_fournisseur_001.pdf",
    uploadDate: "2024-01-20T10:30:00",
    status: "Traité",
    confidence: 95,
    extractedData: {
      amount: 1250.50,
      date: "2024-01-15",
      supplier: "Fournisseur A",
    },
    assignedTo: "Comptabilité",
  },
  {
    id: "2",
    type: "Note de frais",
    fileName: "note_frais_agent_123.pdf",
    uploadDate: "2024-01-19T14:20:00",
    status: "Traité",
    confidence: 88,
    extractedData: {
      amount: 45.30,
      date: "2024-01-18",
    },
    assignedTo: "RH",
  },
  {
    id: "3",
    type: "Relevé bancaire",
    fileName: "releve_bnp_janvier.pdf",
    uploadDate: "2024-01-18T09:15:00",
    status: "En traitement",
    confidence: 0,
    assignedTo: "Banque",
  },
  {
    id: "4",
    type: "Arrêt maladie",
    fileName: "arret_maladie_agent_456.pdf",
    uploadDate: "2024-01-17T16:45:00",
    status: "Traité",
    confidence: 92,
    extractedData: {
      date: "2024-01-16",
    },
    assignedTo: "RH",
  },
  {
    id: "5",
    type: "Avoir",
    fileName: "avoir_fournisseur_002.pdf",
    uploadDate: "2024-01-16T11:00:00",
    status: "Traité",
    confidence: 90,
    extractedData: {
      amount: -150.00,
      date: "2024-01-10",
      supplier: "Fournisseur B",
    },
    assignedTo: "Comptabilité",
  },
];

