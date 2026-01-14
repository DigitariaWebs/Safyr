import { useEffect, useRef, useState } from "react";
import type { LocationObject, LocationSubscription } from "expo-location";
import * as Location from "expo-location";

export function useAgentLocation(enabled: boolean) {
  const [permission, setPermission] = useState<"unknown" | "granted" | "denied">(
    "unknown",
  );
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const subRef = useRef<LocationSubscription | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!enabled) return;
      const res = await Location.requestForegroundPermissionsAsync();
      if (!mounted) return;
      if (res.status !== "granted") {
        setPermission("denied");
        setError("Permission localisation refusée.");
        return;
      }
      setPermission("granted");
      setError(null);
      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      if (!mounted) return;
      setLocation(current);
      subRef.current?.remove();
      subRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10_000,
          distanceInterval: 20,
        },
        (loc) => {
          setLocation(loc);
        },
      );
    })();
    return () => {
      mounted = false;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      subRef.current?.remove();
      subRef.current = null;
    }
  }, [enabled]);

  useEffect(() => {
    return () => {
      subRef.current?.remove();
      subRef.current = null;
    };
  }, []);

  return { permission, location, error };
}

