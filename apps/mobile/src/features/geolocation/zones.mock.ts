import type { WorkZone } from "./workZone";

export const mockWorkZones: WorkZone[] = [
  {
    id: "zone_opera",
    label: "Site Opéra",
    center: { latitude: 48.87, longitude: 2.3319 },
    radiusMeters: 300,
  },
  {
    id: "zone_defense",
    label: "La Défense",
    center: { latitude: 48.892, longitude: 2.236 },
    radiusMeters: 500,
  },
  {
    id: "zone_bastille",
    label: "Bastille",
    center: { latitude: 48.8533, longitude: 2.3694 },
    radiusMeters: 200,
  },
];
