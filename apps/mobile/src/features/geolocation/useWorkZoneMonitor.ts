import { useEffect, useRef, useState } from "react";
import type { LocationObject } from "expo-location";
import type { WorkZone } from "./workZone";
import { haversineMeters } from "./geo.utils";

export function useWorkZoneMonitor(input: {
  enabled: boolean;
  location: LocationObject | null;
  zone: WorkZone;
  prolongedOutsideMs?: number;
  onProlongedOutside?: (ctx: {
    outsideMs: number;
    distanceMeters: number;
  }) => void;
}) {
  const { enabled, location, zone, onProlongedOutside } = input;
  const prolongedOutsideMs = input.prolongedOutsideMs ?? 5 * 60 * 1000;
  const [outside, setOutside] = useState(false);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const outsideSinceRef = useRef<number | null>(null);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setOutside(false);
      setDistanceMeters(null);
      outsideSinceRef.current = null;
      notifiedRef.current = false;
      return;
    }
    const coords = location?.coords;
    if (!coords) return;

    const dist = haversineMeters(
      { latitude: coords.latitude, longitude: coords.longitude },
      zone.center,
    );
    setDistanceMeters(dist);

    const isOutside = dist > zone.radiusMeters;
    setOutside(isOutside);

    const now = Date.now();
    if (isOutside) {
      if (!outsideSinceRef.current) outsideSinceRef.current = now;
      const outsideMs = now - outsideSinceRef.current;
      if (!notifiedRef.current && outsideMs >= prolongedOutsideMs) {
        notifiedRef.current = true;
        onProlongedOutside?.({ outsideMs, distanceMeters: dist });
      }
    } else {
      outsideSinceRef.current = null;
      notifiedRef.current = false;
    }
  }, [
    enabled,
    location,
    zone.center,
    zone.radiusMeters,
    prolongedOutsideMs,
    onProlongedOutside,
  ]);

  return {
    outside,
    distanceMeters,
    outsideSinceMs: outsideSinceRef.current,
  };
}
