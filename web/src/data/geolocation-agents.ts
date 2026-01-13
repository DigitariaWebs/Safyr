export interface GeolocationAgent {
  id: string;
  name: string;
  site: string;
  status: "En poste" | "En déplacement" | "Hors ligne";
  lastUpdate: string;
  latitude: number;
  longitude: number;
  speed: number; // km/h
  direction: number; // degrees
  battery: number; // percentage
}

export const mockGeolocationAgents: GeolocationAgent[] = [
  {
    id: "1",
    name: "Jean Dupont",
    site: "Centre Commercial Rosny 2",
    status: "En poste",
    lastUpdate: new Date().toISOString(),
    latitude: 48.8566,
    longitude: 2.3522,
    speed: 0,
    direction: 0,
    battery: 85,
  },
  {
    id: "2",
    name: "Marie Martin",
    site: "Siège Social La Défense",
    status: "En déplacement",
    lastUpdate: new Date(Date.now() - 5 * 60000).toISOString(),
    latitude: 48.8922,
    longitude: 2.2365,
    speed: 35,
    direction: 45,
    battery: 60,
  },
  {
    id: "3",
    name: "Pierre Bernard",
    site: "Entrepôt Logistique Gennevilliers",
    status: "En poste",
    lastUpdate: new Date(Date.now() - 2 * 60000).toISOString(),
    latitude: 48.9333,
    longitude: 2.2978,
    speed: 0,
    direction: 0,
    battery: 92,
  },
  {
    id: "4",
    name: "Sophie Dubois",
    site: "Hors ligne",
    status: "Hors ligne",
    lastUpdate: new Date(Date.now() - 30 * 60000).toISOString(),
    latitude: 0,
    longitude: 0,
    speed: 0,
    direction: 0,
    battery: 0,
  },
];
