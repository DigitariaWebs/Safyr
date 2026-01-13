export interface Equipment {
  id: string;
  sku: string;
  category: "Uniform" | "EPI" | "Matériel" | "Badge" | "Consommable";
  name: string;
  brand: string;
  serialNumber?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  supplier: string;
  status: "En stock" | "Attribué" | "Perdu" | "HS" | "Réformé";
  lastUpdate: string;
}

export const mockEquipment: Equipment[] = [
  {
    id: "1",
    sku: "UNI-VEST-001",
    category: "Uniform",
    name: "Veste Agent Sécurité",
    brand: "SecuriWear",
    size: "L",
    quantity: 25,
    unitPrice: 45.99,
    supplier: "Fournisseur A",
    status: "En stock",
    lastUpdate: "2024-01-15",
  },
  {
    id: "2",
    sku: "EPI-GAN-001",
    category: "EPI",
    name: "Gants de Protection",
    brand: "SafeHands",
    quantity: 100,
    unitPrice: 8.5,
    supplier: "Fournisseur B",
    status: "En stock",
    lastUpdate: "2024-01-10",
  },
  {
    id: "3",
    sku: "MAT-RAD-001",
    category: "Matériel",
    name: "Radio Talkie-Walkie",
    brand: "Motorola",
    serialNumber: "MOT-2024-001",
    quantity: 15,
    unitPrice: 125.0,
    supplier: "Fournisseur C",
    status: "Attribué",
    lastUpdate: "2024-01-20",
  },
  {
    id: "4",
    sku: "BAD-ACC-001",
    category: "Badge",
    name: "Badge d'accès RFID",
    brand: "AccessPro",
    quantity: 50,
    unitPrice: 12.0,
    supplier: "Fournisseur D",
    status: "En stock",
    lastUpdate: "2024-01-12",
  },
  {
    id: "5",
    sku: "CON-PIL-001",
    category: "Consommable",
    name: "Piles AA (pack de 10)",
    brand: "Duracell",
    quantity: 200,
    unitPrice: 5.5,
    supplier: "Fournisseur E",
    status: "En stock",
    lastUpdate: "2024-01-18",
  },
];
