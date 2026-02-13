export type WorkZone = {
  id: string;
  label: string;
  center: { latitude: number; longitude: number };
  radiusMeters: number;
};

// MVP: zone fixe (Paris). Étape suivante: récupérer la zone depuis backend / profil agent.
export const defaultWorkZone: WorkZone = {
  id: "zone_paris_demo",
  label: "Zone de travail • Paris",
  center: { latitude: 48.8566, longitude: 2.3522 },
  radiusMeters: 450,
};

