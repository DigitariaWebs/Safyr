"use client";

import { Calendar, MapPin, Route as RouteIcon } from "lucide-react";

interface AgentHistoryControlsProps {
  date: string;
  onDateChange: (date: string) => void;
  selectedAgentName?: string;
  onOpenAgentList?: () => void;
  stats?: {
    distanceKm: number;
    durationMinutes: number;
    positionCount: number;
  };
}

export function AgentHistoryControls({
  date,
  onDateChange,
  selectedAgentName,
  onOpenAgentList,
  stats,
}: AgentHistoryControlsProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="h-8 text-xs rounded-md border border-input bg-background pl-7 pr-2.5 focus:outline-none focus:ring-1 focus:ring-ring"
            aria-label="Date de l'historique"
          />
        </div>

        <div className="h-4 w-px bg-border" aria-hidden="true" />

        {selectedAgentName ? (
          <span className="text-xs text-muted-foreground truncate max-w-48">
            {selectedAgentName}
          </span>
        ) : (
          <button
            onClick={onOpenAgentList}
            className="text-[10px] text-cyan-400/80 hover:text-cyan-300 transition-colors italic"
          >
            Sélectionnez un agent dans la liste
          </button>
        )}
      </div>

      {stats && (
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <RouteIcon className="h-3 w-3" />
            Distance totale : {stats.distanceKm.toFixed(1)} km
          </span>
          <span>·</span>
          <span>
            Durée : {Math.floor(stats.durationMinutes / 60)}h{" "}
            {String(stats.durationMinutes % 60).padStart(2, "0")}min
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {stats.positionCount} positions
          </span>
        </div>
      )}
    </div>
  );
}
