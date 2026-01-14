import type { MainCouranteEvent } from "./types";

export const mockMainCourante: MainCouranteEvent[] = [
  {
    id: "mc_001",
    title: "Ronde effectuée - Site A",
    description: "Contrôle des accès et vérification des issues. Rien à signaler.",
    siteName: "Siège • Paris",
    createdAtIso: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    priority: "low",
    status: "open",
  },
  {
    id: "mc_002",
    title: "Alarme technique",
    description: "Déclenchement alarme zone stockage. Contrôle effectué, cause: maintenance.",
    siteName: "Entrepôt • Vitry",
    createdAtIso: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    priority: "medium",
    status: "open",
  },
  {
    id: "mc_003",
    title: "Incident mineur",
    description: "Discussion verbale à l’accueil, situation apaisée. Compte rendu au chef de poste.",
    siteName: "Accueil • Lyon",
    createdAtIso: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    priority: "high",
    status: "closed",
  },
];

