export function haversineMeters(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
) {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * (sinDLon * sinDLon);
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Sum of haversine distances between consecutive trail points (meters). */
export function computeTrailDistance(
  trail: { coords: [number, number] }[],
): number {
  let total = 0;
  for (let i = 0; i < trail.length - 1; i++) {
    const [lngA, latA] = trail[i].coords;
    const [lngB, latB] = trail[i + 1].coords;
    total += haversineMeters(
      { latitude: latA, longitude: lngA },
      { latitude: latB, longitude: lngB },
    );
  }
  return total;
}
