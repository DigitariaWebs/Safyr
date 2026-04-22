"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { Source, Layer, Marker, Popup, MapRef } from "react-map-gl/mapbox";
import { Navigation, Maximize2, Route, Flag, ShieldAlert } from "lucide-react";
import { GeolocationAgent } from "@/data/geolocation-agents";
import type { PatrolRoute } from "@/data/geolocation-patrols";
import { cn } from "@/lib/utils";

interface AgentMapProps {
  agents: GeolocationAgent[];
  selectedAgent: GeolocationAgent | null;
  onAgentClick: (agent: GeolocationAgent) => void;
  initialCenter?: { longitude: number; latitude: number; zoom?: number };
  patrolRoutes?: PatrolRoute[];
  showPatrolRoutes?: boolean;
  onTogglePatrolRoutes?: () => void;
  className?: string;
  // SOS overlay
  sosAgentIds?: Set<string>;
  // History mode overlay
  historyMode?: boolean;
  historyTrail?: GeoJSON.FeatureCollection | null;
  historyMarkerPosition?: [number, number] | null; // [lng, lat]
  historyStartEnd?: {
    start: [number, number];
    end: [number, number];
  } | null;
}

const STATUS_DOT: Record<GeolocationAgent["status"], string> = {
  "En poste": "bg-green-500 border-green-600",
  "En déplacement": "bg-blue-500 border-blue-600",
  "Hors ligne": "bg-gray-500 border-gray-600",
};

const LEGEND: { label: GeolocationAgent["status"]; dot: string }[] = [
  { label: "En poste", dot: "bg-green-500" },
  { label: "En déplacement", dot: "bg-blue-500" },
  { label: "Hors ligne", dot: "bg-gray-500" },
];

export function AgentMap({
  agents,
  selectedAgent,
  onAgentClick,
  initialCenter,
  patrolRoutes,
  showPatrolRoutes,
  onTogglePatrolRoutes,
  className,
  sosAgentIds,
  historyMode,
  historyTrail,
  historyMarkerPosition,
  historyStartEnd,
}: AgentMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [hoveredAgent, setHoveredAgent] = useState<GeolocationAgent | null>(
    null,
  );
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  // M2: memoize to stabilise handleGlobalView's dependency
  const visibleAgents = useMemo(
    () => agents.filter((a) => a.latitude !== 0 || a.longitude !== 0),
    [agents],
  );

  useEffect(() => {
    if (!selectedAgent || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [selectedAgent.longitude, selectedAgent.latitude],
      zoom: 15,
      duration: 1200,
    });
  }, [selectedAgent]);

  // Auto-fly to SOS agent when a new SOS appears
  const prevSOSIdsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!sosAgentIds || sosAgentIds.size === 0 || !mapRef.current) {
      prevSOSIdsRef.current = sosAgentIds ?? new Set();
      return;
    }
    const newIds = [...sosAgentIds].filter(
      (id) => !prevSOSIdsRef.current.has(id),
    );
    prevSOSIdsRef.current = sosAgentIds;
    if (newIds.length === 0) return;
    const sosAgent = agents.find((a) => a.id === newIds[0]);
    if (!sosAgent) return;
    mapRef.current.flyTo({
      center: [sosAgent.longitude, sosAgent.latitude],
      zoom: 16,
      duration: 1200,
    });
  }, [sosAgentIds, agents]);

  // Fit bounds to history trail when it changes
  useEffect(() => {
    if (!historyMode || !historyTrail || !mapRef.current) return;
    const coords = historyTrail.features.flatMap((f) =>
      f.geometry.type === "LineString"
        ? (f.geometry.coordinates as [number, number][])
        : [],
    );
    if (coords.length === 0) return;
    const lngs = coords.map((c) => c[0]);
    const lats = coords.map((c) => c[1]);
    mapRef.current.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: 80, maxZoom: 16, duration: 1200 },
    );
  }, [historyMode, historyTrail]);

  const handleGlobalView = useCallback(() => {
    if (!mapRef.current || visibleAgents.length === 0) return;
    if (visibleAgents.length === 1) {
      mapRef.current.flyTo({
        center: [visibleAgents[0].longitude, visibleAgents[0].latitude],
        zoom: 13,
        duration: 1000,
      });
      return;
    }
    const lngs = visibleAgents.map((a) => a.longitude);
    const lats = visibleAgents.map((a) => a.latitude);
    mapRef.current.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      { padding: 60, maxZoom: 14, duration: 1000 },
    );
  }, [visibleAgents]);

  const handleMarkerClick = useCallback(
    (agent: GeolocationAgent, e: React.MouseEvent) => {
      e.stopPropagation();
      onAgentClick(agent);
    },
    [onAgentClick],
  );

  // ── Patrol routes GeoJSON (dashed lines + checkpoint markers) ────
  const patrolRoutesGeoJson = useMemo(() => {
    if (!patrolRoutes || !showPatrolRoutes) return null;
    const features = patrolRoutes.map((route) => ({
      type: "Feature" as const,
      properties: { name: route.name },
      geometry: {
        type: "LineString" as const,
        coordinates: route.checkpoints.map((cp) => cp.coords),
      },
    }));
    return { type: "FeatureCollection" as const, features };
  }, [patrolRoutes, showPatrolRoutes]);

  const patrolCheckpoints = useMemo(() => {
    if (!patrolRoutes || !showPatrolRoutes) return [];
    return patrolRoutes.flatMap((route) =>
      route.checkpoints.map((cp) => ({ ...cp, routeName: route.name })),
    );
  }, [patrolRoutes, showPatrolRoutes]);

  return (
    // L3: describe map region for screen readers
    <div
      className={cn("relative overflow-hidden", className)}
      aria-label="Carte de localisation des agents"
      role="region"
    >
      <Map
        ref={mapRef}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={
          initialCenter ?? { longitude: 2.3488, latitude: 48.8534, zoom: 11 }
        }
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      >
        {/* Patrol route overlays (dashed lines + checkpoint markers) */}
        {patrolRoutesGeoJson && (
          <Source id="patrol-routes" type="geojson" data={patrolRoutesGeoJson}>
            <Layer
              id="patrol-routes-line"
              type="line"
              paint={{
                "line-color": "#a855f7",
                "line-width": 2,
                "line-dasharray": [6, 4],
                "line-opacity": 0.6,
              }}
            />
          </Source>
        )}
        {patrolCheckpoints.map((cp) => (
          <Marker
            key={`patrol-cp-${cp.id}`}
            longitude={cp.coords[0]}
            latitude={cp.coords[1]}
            anchor="center"
          >
            <div
              className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-500/80 border border-purple-400 text-[8px] font-bold text-white shadow-sm"
              title={`${cp.routeName} — ${cp.name}`}
            >
              {cp.order}
            </div>
          </Marker>
        ))}

        {/* History trail overlay (polyline + markers) */}
        {historyMode && historyTrail && (
          <Source id="history-trail" type="geojson" data={historyTrail}>
            <Layer
              id="history-trail-solid"
              type="line"
              filter={["==", ["get", "dashed"], 0]}
              paint={{
                "line-color": ["get", "color"],
                "line-width": 3,
                "line-opacity": 0.85,
              }}
            />
            <Layer
              id="history-trail-dashed"
              type="line"
              filter={["==", ["get", "dashed"], 1]}
              paint={{
                "line-color": ["get", "color"],
                "line-width": 2,
                "line-opacity": 0.5,
                "line-dasharray": [6, 4],
              }}
            />
          </Source>
        )}
        {historyMode && historyStartEnd && (
          <>
            <Marker
              longitude={historyStartEnd.start[0]}
              latitude={historyStartEnd.start[1]}
              anchor="bottom"
            >
              <div className="flex flex-col items-center">
                <Flag className="h-5 w-5 text-emerald-400 drop-shadow-lg" />
                <span className="text-[10px] font-bold text-emerald-400 mt-0.5">
                  Début
                </span>
              </div>
            </Marker>
            <Marker
              longitude={historyStartEnd.end[0]}
              latitude={historyStartEnd.end[1]}
              anchor="bottom"
            >
              <div className="flex flex-col items-center">
                <Flag className="h-5 w-5 text-red-400 drop-shadow-lg" />
                <span className="text-[10px] font-bold text-red-400 mt-0.5">
                  Fin
                </span>
              </div>
            </Marker>
          </>
        )}
        {historyMode && historyMarkerPosition && (
          <Marker
            longitude={historyMarkerPosition[0]}
            latitude={historyMarkerPosition[1]}
            anchor="center"
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute h-6 w-6 rounded-full bg-cyan-400/30 animate-ping" />
              <span className="absolute h-4 w-4 rounded-full bg-cyan-400/20 animate-pulse" />
              <span className="relative h-3 w-3 rounded-full bg-cyan-400 border-2 border-cyan-200 shadow-lg" />
            </div>
          </Marker>
        )}

        {/* Regular agent markers (non-SOS first) */}
        {visibleAgents
          .filter((a) => !sosAgentIds?.has(a.id))
          .map((agent) => {
            const isOffline = agent.status === "Hors ligne";
            const isMoving = agent.status === "En déplacement";
            const isSelected = selectedAgent?.id === agent.id;

            return (
              <Marker
                key={agent.id}
                longitude={agent.longitude}
                latitude={agent.latitude}
                anchor="center"
              >
                <div className="relative flex flex-col items-center">
                  {isMoving && (
                    <Navigation
                      className="absolute -top-6 h-3 w-3 text-blue-300 drop-shadow"
                      style={{ transform: `rotate(${agent.direction}deg)` }}
                    />
                  )}

                  <div className="relative flex items-center justify-center">
                    {isMoving && (
                      <span className="absolute h-5 w-5 rounded-full bg-blue-500/40 animate-ping" />
                    )}
                    {isSelected && (
                      <span className="absolute h-7 w-7 rounded-full bg-cyan-400/20 animate-pulse" />
                    )}
                    <button
                      onClick={(e) => handleMarkerClick(agent, e)}
                      onMouseEnter={() => setHoveredAgent(agent)}
                      onMouseLeave={() => setHoveredAgent(null)}
                      className={cn(
                        "relative h-4 w-4 rounded-full border-2 cursor-pointer transition-transform hover:scale-125 shadow-lg",
                        STATUS_DOT[agent.status],
                        isOffline && "opacity-40",
                        isSelected &&
                          "ring-2 ring-cyan-400 ring-offset-1 ring-offset-black/50 scale-110",
                      )}
                      aria-label={`Agent ${agent.name} — ${agent.status}`}
                    />
                  </div>
                </div>
              </Marker>
            );
          })}

        {/* SOS agent markers (rendered last for z-ordering) */}
        {visibleAgents
          .filter((a) => sosAgentIds?.has(a.id))
          .map((agent) => {
            const isSelected = selectedAgent?.id === agent.id;
            return (
              <Marker
                key={`sos-${agent.id}`}
                longitude={agent.longitude}
                latitude={agent.latitude}
                anchor="center"
              >
                <div className="relative flex flex-col items-center">
                  <ShieldAlert className="absolute -top-7 h-4 w-4 text-red-400 drop-shadow-lg motion-safe:animate-pulse" />
                  <div className="relative flex items-center justify-center">
                    <span className="absolute h-8 w-8 rounded-full bg-red-500/20 motion-safe:animate-ping" />
                    <span className="absolute h-6 w-6 rounded-full bg-red-500/30 motion-safe:animate-pulse" />
                    {isSelected && (
                      <span className="absolute h-9 w-9 rounded-full bg-red-400/15 animate-pulse" />
                    )}
                    <button
                      onClick={(e) => handleMarkerClick(agent, e)}
                      onMouseEnter={() => setHoveredAgent(agent)}
                      onMouseLeave={() => setHoveredAgent(null)}
                      className={cn(
                        "relative h-4 w-4 rounded-full border-2 cursor-pointer transition-transform hover:scale-125 shadow-lg",
                        "bg-red-500 border-red-600",
                        isSelected &&
                          "ring-2 ring-red-400 ring-offset-1 ring-offset-black/50 scale-110",
                      )}
                      aria-label={`Agent ${agent.name} — SOS actif`}
                    />
                  </div>
                </div>
              </Marker>
            );
          })}

        {/* H1: use inline styles inside Popup — CSS variables don't cascade into Mapbox's detached DOM layer */}
        {hoveredAgent && (
          <Popup
            longitude={hoveredAgent.longitude}
            latitude={hoveredAgent.latitude}
            anchor="bottom"
            closeButton={false}
            closeOnClick={false}
            offset={14}
          >
            <div style={{ fontSize: 12, lineHeight: 1.5 }}>
              <p style={{ fontWeight: 600, color: "#f1f5f9", margin: 0 }}>
                {hoveredAgent.name}
              </p>
              <p style={{ color: "#94a3b8", margin: 0 }}>{hoveredAgent.site}</p>
              {sosAgentIds?.has(hoveredAgent.id) && (
                <p
                  style={{
                    color: "#f87171",
                    margin: "2px 0 0",
                    fontWeight: 600,
                  }}
                >
                  SOS Actif
                </p>
              )}
              {hoveredAgent.status === "Hors ligne" && (
                <p style={{ color: "#fbbf24", margin: "2px 0 0" }}>
                  Hors ligne depuis{" "}
                  {Math.round(
                    (now - new Date(hoveredAgent.lastUpdate).getTime()) / 60000,
                  )}{" "}
                  min
                </p>
              )}
            </div>
          </Popup>
        )}
      </Map>

      {/* Bottom-left controls */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
        {historyMode ? (
          <div className="flex items-center gap-3 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 px-3 py-1.5 shadow-sm">
            {[
              { label: "En poste", color: "bg-green-500" },
              { label: "En déplacement", color: "bg-blue-500" },
              { label: "Hors ligne", color: "bg-gray-500", dashed: true },
            ].map(({ label, color, dashed }) => (
              <div key={label} className="flex items-center gap-1.5">
                {dashed ? (
                  <span className="h-0 w-4 border-t-[2px] border-dashed border-gray-400" />
                ) : (
                  <span className={cn("h-[3px] w-4 rounded-full", color)} />
                )}
                <span className="text-[10px] text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 px-3 py-1.5 shadow-sm">
              {LEGEND.map(({ label, dot }) => (
                <div
                  key={label}
                  className={cn(
                    "flex items-center gap-1.5",
                    label === "Hors ligne" && "opacity-40",
                  )}
                >
                  <span className={cn("h-2 w-2 rounded-full", dot)} />
                  <span className="text-[10px] text-muted-foreground">
                    {label}
                  </span>
                </div>
              ))}
              {sosAgentIds && sosAgentIds.size > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500 motion-safe:animate-pulse" />
                  <span className="text-[10px] text-red-400 font-medium">
                    SOS
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={handleGlobalView}
              className="flex items-center gap-1.5 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 px-2.5 py-1.5 text-[10px] font-medium shadow-sm hover:bg-background/95 transition-colors"
              title="Afficher tous les agents"
              aria-label="Vue globale — afficher tous les agents"
            >
              <Maximize2 className="h-3 w-3" />
              Vue globale
            </button>
            {onTogglePatrolRoutes && (
              <button
                onClick={onTogglePatrolRoutes}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg backdrop-blur-md border px-2.5 py-1.5 text-[10px] font-medium shadow-sm transition-colors",
                  showPatrolRoutes
                    ? "bg-purple-500/15 border-purple-500/40 text-purple-400"
                    : "bg-background/80 border-border/50 hover:bg-background/95",
                )}
                title={
                  showPatrolRoutes
                    ? "Masquer les rondes"
                    : "Afficher les rondes"
                }
                aria-label={
                  showPatrolRoutes
                    ? "Masquer les rondes"
                    : "Afficher les rondes"
                }
                aria-pressed={showPatrolRoutes}
              >
                <Route className="h-3 w-3" />
                Rondes
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
