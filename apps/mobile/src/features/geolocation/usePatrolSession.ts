import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LocationObject } from "expo-location";
import { haversineMeters } from "./geo.utils";
import type {
  CheckpointScan,
  PatrolCheckpoint,
  PatrolPhase,
  PatrolRoute,
} from "./patrol.types";
import type { MainCouranteEvent } from "@/features/mainCourante/types";

interface UsePatrolSessionInput {
  enabled: boolean;
  location: LocationObject | null;
  proximityThresholdMeters?: number;
  onCheckpointValidated?: (checkpoint: PatrolCheckpoint) => void;
}

export interface PatrolSessionState {
  phase: PatrolPhase;
  selectedRoute: PatrolRoute | null;
  checkpointScans: CheckpointScan[];
  gpsTrail: { coords: [number, number]; timestamp: string }[];
  elapsedSeconds: number;
  nextCheckpoint: PatrolCheckpoint | null;
  completionRate: number;
  /** Distance in meters from current location to each checkpoint */
  checkpointDistances: Map<string, number>;
}

export interface PatrolSessionActions {
  selectRoute: (route: PatrolRoute) => void;
  startPatrol: () => void;
  validateCheckpoint: (checkpointId: string) => void;
  scanQrCheckpoint: (qrData: string) => void;
  endPatrol: () => void;
  dismissSummary: () => void;
  clearSelection: () => void;
  buildMainCouranteEvent: () => MainCouranteEvent | null;
}

export function usePatrolSession(
  input: UsePatrolSessionInput,
): PatrolSessionState & PatrolSessionActions {
  const {
    enabled,
    location,
    proximityThresholdMeters = 30,
    onCheckpointValidated,
  } = input;

  const [phase, setPhase] = useState<PatrolPhase>("idle");
  const [selectedRoute, setSelectedRoute] = useState<PatrolRoute | null>(null);
  const [checkpointScans, setCheckpointScans] = useState<CheckpointScan[]>([]);
  const [gpsTrail, setGpsTrail] = useState<
    { coords: [number, number]; timestamp: string }[]
  >([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startTimeRef = useRef<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCheckpointValidatedRef = useRef(onCheckpointValidated);
  onCheckpointValidatedRef.current = onCheckpointValidated;

  // ── Actions ──────────────────────────────────────────────────────

  const selectRoute = useCallback((route: PatrolRoute) => {
    setSelectedRoute(route);
    setPhase("previewing");
  }, []);

  const startPatrol = useCallback(() => {
    if (!selectedRoute) return;
    const scans: CheckpointScan[] = selectedRoute.checkpoints.map((cp) => ({
      checkpointId: cp.id,
      scannedAt: null,
      status: "pending",
    }));
    setCheckpointScans(scans);
    setGpsTrail([]);
    setElapsedSeconds(0);
    startTimeRef.current = new Date();
    setPhase("active");
  }, [selectedRoute]);

  const validateCheckpoint = useCallback(
    (checkpointId: string) => {
      setCheckpointScans((prev) =>
        prev.map((s) =>
          s.checkpointId === checkpointId && s.status === "pending"
            ? { ...s, status: "scanned", scannedAt: new Date().toISOString() }
            : s,
        ),
      );
      const cp = selectedRoute?.checkpoints.find((c) => c.id === checkpointId);
      if (cp) onCheckpointValidatedRef.current?.(cp);
    },
    [selectedRoute],
  );

  const scanQrCheckpoint = useCallback(
    (qrData: string) => {
      // QR payload format: "safyr:checkpoint:<checkpointId>"
      const match = qrData.match(/^safyr:checkpoint:(.+)$/);
      const cpId = match?.[1] ?? qrData;
      const exists = selectedRoute?.checkpoints.some((c) => c.id === cpId);
      if (exists) validateCheckpoint(cpId);
    },
    [selectedRoute, validateCheckpoint],
  );

  const endPatrol = useCallback(() => {
    setCheckpointScans((prev) =>
      prev.map((s) =>
        s.status === "pending" ? { ...s, status: "missed" } : s,
      ),
    );
    setPhase("summary");
  }, []);

  const dismissSummary = useCallback(() => {
    setPhase("idle");
    setSelectedRoute(null);
    setCheckpointScans([]);
    setGpsTrail([]);
    setElapsedSeconds(0);
    startTimeRef.current = null;
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRoute(null);
    setPhase("selecting");
  }, []);

  // ── Timer ────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase === "active") {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [phase]);

  // ── Trail recording ──────────────────────────────────────────────

  useEffect(() => {
    if (phase !== "active" || !location) return;
    const { longitude, latitude } = location.coords;
    setGpsTrail((prev) => [
      ...prev,
      { coords: [longitude, latitude], timestamp: new Date().toISOString() },
    ]);
  }, [phase, location]);

  // ── GPS proximity auto-validation ────────────────────────────────

  useEffect(() => {
    if (phase !== "active" || !location || !selectedRoute) return;

    const coords = location.coords;
    for (const cp of selectedRoute.checkpoints) {
      const scan = checkpointScans.find((s) => s.checkpointId === cp.id);
      if (scan?.status !== "pending") continue;
      if (cp.type !== "GPS") continue;

      const dist = haversineMeters(
        { latitude: coords.latitude, longitude: coords.longitude },
        { latitude: cp.coords[1], longitude: cp.coords[0] },
      );
      if (dist <= proximityThresholdMeters) {
        validateCheckpoint(cp.id);
      }
    }
  }, [
    phase,
    location,
    selectedRoute,
    checkpointScans,
    proximityThresholdMeters,
    validateCheckpoint,
  ]);

  // ── Auto-complete when all checkpoints resolved ──────────────────

  useEffect(() => {
    if (phase !== "active" || checkpointScans.length === 0) return;
    const allResolved = checkpointScans.every((s) => s.status !== "pending");
    if (allResolved) setPhase("summary");
  }, [phase, checkpointScans]);

  // ── Reset on disable ─────────────────────────────────────────────

  useEffect(() => {
    if (!enabled && phase !== "idle") {
      dismissSummary();
    }
  }, [enabled, phase, dismissSummary]);

  // ── Derived state ────────────────────────────────────────────────

  const nextCheckpoint = useMemo(() => {
    if (!selectedRoute || phase !== "active") return null;
    const pendingIds = new Set(
      checkpointScans
        .filter((s) => s.status === "pending")
        .map((s) => s.checkpointId),
    );
    return (
      selectedRoute.checkpoints
        .sort((a, b) => a.order - b.order)
        .find((cp) => pendingIds.has(cp.id)) ?? null
    );
  }, [selectedRoute, checkpointScans, phase]);

  const completionRate = useMemo(() => {
    if (checkpointScans.length === 0) return 0;
    const scanned = checkpointScans.filter(
      (s) => s.status === "scanned",
    ).length;
    return Math.round((scanned / checkpointScans.length) * 100);
  }, [checkpointScans]);

  const checkpointDistances = useMemo(() => {
    const map = new Map<string, number>();
    if (!location || !selectedRoute) return map;
    const { latitude, longitude } = location.coords;
    for (const cp of selectedRoute.checkpoints) {
      map.set(
        cp.id,
        haversineMeters(
          { latitude, longitude },
          { latitude: cp.coords[1], longitude: cp.coords[0] },
        ),
      );
    }
    return map;
  }, [location, selectedRoute]);

  // ── Main Courante event builder ──────────────────────────────────

  const buildMainCouranteEvent = useCallback((): MainCouranteEvent | null => {
    if (!selectedRoute || checkpointScans.length === 0) return null;
    const scanned = checkpointScans.filter(
      (s) => s.status === "scanned",
    ).length;
    const total = checkpointScans.length;
    const isComplete = scanned === total;

    return {
      id: `mc-patrol-${Date.now()}`,
      title: isComplete
        ? `Ronde terminée : ${selectedRoute.name}`
        : `Ronde incomplète : ${selectedRoute.name}`,
      description: `${scanned}/${total} points de contrôle validés — Durée: ${Math.floor(elapsedSeconds / 60)} min — Taux: ${completionRate}%`,
      siteName: selectedRoute.site,
      createdAtIso: new Date().toISOString(),
      priority: isComplete ? "low" : "medium",
      status: "closed",
    };
  }, [selectedRoute, checkpointScans, elapsedSeconds, completionRate]);

  return {
    phase,
    selectedRoute,
    checkpointScans,
    gpsTrail,
    elapsedSeconds,
    nextCheckpoint,
    completionRate,
    checkpointDistances,
    selectRoute,
    startPatrol,
    validateCheckpoint,
    scanQrCheckpoint,
    endPatrol,
    dismissSummary,
    clearSelection,
    buildMainCouranteEvent,
  };
}
