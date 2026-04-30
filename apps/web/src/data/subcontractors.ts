export interface Subcontractor {
  id: string;
  name: string;
  siret?: string;
  email?: string;
  telephone?: string;
}

export const mockSubcontractors: Subcontractor[] = [
  {
    id: "st-1",
    name: "Gardiennage Plus",
    siret: "12345678901234",
    email: "contact@gardiennage-plus.fr",
    telephone: "04 78 12 34 56",
  },
  {
    id: "st-2",
    name: "SecuriTech Solutions",
    siret: "98765432109876",
    email: "info@securitech.fr",
    telephone: "04 91 23 45 67",
  },
  {
    id: "st-3",
    name: "Protection Services",
    siret: "11223344556677",
    email: "contact@protection-services.fr",
    telephone: "05 56 78 90 12",
  },
];
