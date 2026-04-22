import { useEffect, useRef, useState } from "react";
import type { LocationObject } from "expo-location";
import type { WorkZone } from "./workZone";
import { haversineMeters } from "./geo.utils";

export type ZoneStatus = {
  zoneId: string;
  zone: WorkZone;
  outside: boolean;
  distanceMeters: number | null;
  outsideSinceMs: number | null;
};

export type ZoneTransition = {
  zoneId: string;
  zone: WorkZone;
  type: "entered" | "exited";
};

type ZoneTracking = {
  outsideSince: number | null;
  notified: boolean;
  wasOutside: boolean | null;
};

export function useMultiZoneMonitor(input: {
  enabled: boolean;
  location: LocationObject | null;
  zones: WorkZone[];
  prolongedOutsideMs?: number;
  onProlongedOutside?: (ctx: {
    zone: WorkZone;
    outsideMs: number;
    distanceMeters: number;
  }) => void;
  onTransition?: (transition: ZoneTransition) => void;
}): { statuses: Map<string, ZoneStatus> } {
  const { enabled, location, zones, onProlongedOutside, onTransition } = input;
  const prolongedOutsideMs = input.prolongedOutsideMs ?? 5 * 60 * 1000;
  const [statuses, setStatuses] = useState<Map<string, ZoneStatus>>(new Map());
  const trackingRef = useRef<Map<string, ZoneTracking>>(new Map());

  useEffect(() => {
    if (!enabled) {
      setStatuses(new Map());
      trackingRef.current = new Map();
      return;
    }

    const coords = location?.coords;
    if (!coords) return;

    const now = Date.now();
    const nextStatuses = new Map<string, ZoneStatus>();

    for (const zone of zones) {
      const dist = haversineMeters(
        { latitude: coords.latitude, longitude: coords.longitude },
        zone.center,
      );
      const isOutside = dist > zone.radiusMeters;

      // Get or initialize tracking state for this zone
      let tracking = trackingRef.current.get(zone.id);
      if (!tracking) {
        tracking = { outsideSince: null, notified: false, wasOutside: null };
        trackingRef.current.set(zone.id, tracking);
      }

      // Detect transitions (skip first measurement per zone)
      if (tracking.wasOutside !== null && tracking.wasOutside !== isOutside) {
        onTransition?.({
          zoneId: zone.id,
          zone,
          type: isOutside ? "exited" : "entered",
        });
      }

      // Prolonged outside logic
      if (isOutside) {
        if (!tracking.outsideSince) tracking.outsideSince = now;
        const outsideMs = now - tracking.outsideSince;
        if (!tracking.notified && outsideMs >= prolongedOutsideMs) {
          tracking.notified = true;
          onProlongedOutside?.({ zone, outsideMs, distanceMeters: dist });
        }
      } else {
        tracking.outsideSince = null;
        tracking.notified = false;
      }

      tracking.wasOutside = isOutside;

      nextStatuses.set(zone.id, {
        zoneId: zone.id,
        zone,
        outside: isOutside,
        distanceMeters: dist,
        outsideSinceMs: tracking.outsideSince,
      });
    }

    // Clean up tracking for zones that were removed
    const zoneIds = new Set(zones.map((z) => z.id));
    for (const id of trackingRef.current.keys()) {
      if (!zoneIds.has(id)) {
        trackingRef.current.delete(id);
      }
    }

    setStatuses(nextStatuses);
  }, [
    enabled,
    location,
    zones,
    prolongedOutsideMs,
    onProlongedOutside,
    onTransition,
  ]);

  return { statuses };
}
