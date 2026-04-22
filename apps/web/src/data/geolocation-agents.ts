export interface GeolocationAgent {
  id: string;
  name: string;
  site: string;
  zone?: string;
  status: "En poste" | "En déplacement" | "Hors ligne";
  lastUpdate: string;
  latitude: number;
  longitude: number;
  speed: number; // km/h
  direction: number; // degrees (0 = North, 90 = East, 180 = South, 270 = West)
  battery: number; // percentage
  shiftStart: string; // HH:mm
  shiftEnd: string; // HH:mm
}

export const mockGeolocationAgents: GeolocationAgent[] = [
  {
    id: "1",
    name: "Jean Dupont",
    site: "Centre Commercial Rosny 2",
    zone: "Zone Nord",
    status: "En poste",
    lastUpdate: "2026-03-17T10:00:00Z",
    latitude: 48.8566,
    longitude: 2.3522,
    speed: 0,
    direction: 0,
    battery: 85,
    shiftStart: "06:00",
    shiftEnd: "14:00",
  },
  {
    id: "2",
    name: "Marie Martin",
    site: "Siège Social La Défense",
    zone: "Zone Ouest",
    status: "En déplacement",
    lastUpdate: "2026-03-17T09:55:00Z",
    latitude: 48.8922,
    longitude: 2.2365,
    speed: 35,
    direction: 45,
    battery: 60,
    shiftStart: "14:00",
    shiftEnd: "22:00",
  },
  {
    id: "3",
    name: "Pierre Bernard",
    site: "Entrepôt Logistique Gennevilliers",
    zone: "Zone Nord",
    status: "En poste",
    lastUpdate: "2026-03-17T09:58:00Z",
    latitude: 48.9333,
    longitude: 2.2978,
    speed: 0,
    direction: 0,
    battery: 92,
    shiftStart: "06:00",
    shiftEnd: "14:00",
  },
  {
    id: "4",
    name: "Sophie Dubois",
    site: "Entrepôt Logistique Gennevilliers",
    zone: "Zone Sud",
    status: "Hors ligne",
    // Last known position near 13th arrondissement — NOT (0,0)
    lastUpdate: "2026-03-17T09:30:00Z",
    latitude: 48.8355,
    longitude: 2.3219,
    speed: 0,
    direction: 0,
    battery: 12,
    shiftStart: "22:00",
    shiftEnd: "06:00",
  },
  {
    id: "5",
    name: "Lucas Moreau",
    site: "Centre Commercial Rosny 2",
    zone: "Zone Nord",
    status: "En déplacement",
    lastUpdate: "2026-03-17T09:59:00Z",
    latitude: 48.8615,
    longitude: 2.3475,
    speed: 12,
    direction: 270,
    battery: 74,
    shiftStart: "14:00",
    shiftEnd: "22:00",
  },
  {
    id: "6",
    name: "Camille Leroy",
    site: "Siège Social La Défense",
    zone: "Zone Ouest",
    status: "En poste",
    lastUpdate: "2026-03-17T09:57:00Z",
    latitude: 48.8953,
    longitude: 2.2312,
    speed: 0,
    direction: 180,
    battery: 48,
    shiftStart: "06:00",
    shiftEnd: "14:00",
  },
];
