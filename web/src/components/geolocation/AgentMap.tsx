"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, Popup, MapRef } from "react-map-gl/mapbox";
import { Navigation, Maximize2 } from "lucide-react";
import { GeolocationAgent } from "@/data/geolocation-agents";
import { cn } from "@/lib/utils";

interface AgentMapProps {
  agents: GeolocationAgent[];
  selectedAgent: GeolocationAgent | null;
  onAgentClick: (agent: GeolocationAgent) => void;
  initialCenter?: { longitude: number; latitude: number; zoom?: number };
  className?: string;
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
  className,
}: AgentMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [hoveredAgent, setHoveredAgent] = useState<GeolocationAgent | null>(null);

  // M2: memoize to stabilise handleGlobalView's dependency
  const visibleAgents = useMemo(
    () => agents.filter((a) => a.latitude !== 0 || a.longitude !== 0),
    [agents]
  );

  useEffect(() => {
    if (!selectedAgent || !mapRef.current) return;
    mapRef.current.flyTo({
      center: [selectedAgent.longitude, selectedAgent.latitude],
      zoom: 15,
      duration: 1200,
    });
  }, [selectedAgent?.id]);

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
      { padding: 60, maxZoom: 14, duration: 1000 }
    );
  }, [visibleAgents]);

  const handleMarkerClick = useCallback(
    (agent: GeolocationAgent, e: React.MouseEvent) => {
      e.stopPropagation();
      onAgentClick(agent);
    },
    [onAgentClick]
  );

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
        initialViewState={initialCenter ?? { longitude: 2.3488, latitude: 48.8534, zoom: 11 }}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      >
        {visibleAgents.map((agent) => {
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
                      isSelected && "ring-2 ring-cyan-400 ring-offset-1 ring-offset-black/50 scale-110"
                    )}
                    aria-label={`Agent ${agent.name} — ${agent.status}`}
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
              <p style={{ color: "#94a3b8", margin: 0 }}>
                {hoveredAgent.site}
              </p>
              {hoveredAgent.status === "Hors ligne" && (
                <p style={{ color: "#fbbf24", margin: "2px 0 0" }}>
                  Hors ligne depuis{" "}
                  {Math.round(
                    (Date.now() - new Date(hoveredAgent.lastUpdate).getTime()) / 60000
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
        <div className="flex items-center gap-3 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 px-3 py-1.5 shadow-sm">
          {LEGEND.map(({ label, dot }) => (
            <div
              key={label}
              className={cn(
                "flex items-center gap-1.5",
                label === "Hors ligne" && "opacity-40"
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", dot)} />
              <span className="text-[10px] text-muted-foreground">{label}</span>
            </div>
          ))}
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
      </div>
    </div>
  );
}
