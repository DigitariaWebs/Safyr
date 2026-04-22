"use client";

import { Play, Pause, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentHistoryTimelineProps {
  progress: number; // 0–1
  onProgressChange: (progress: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  startTime: string | null; // ISO
  endTime: string | null; // ISO
  currentTime: string | null; // ISO (interpolated)
}

function formatTime(iso: string | null): string {
  if (!iso) return "--:--";
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AgentHistoryTimeline({
  progress,
  onProgressChange,
  isPlaying,
  onTogglePlay,
  startTime,
  endTime,
  currentTime,
}: AgentHistoryTimelineProps) {
  const currentTimeText = formatTime(currentTime);

  return (
    <div className="flex items-center gap-3 rounded-lg bg-background/80 backdrop-blur-md border border-border/50 px-3 py-2 shadow-sm min-w-80">
      <button
        onClick={onTogglePlay}
        className={cn(
          "h-10 w-10 flex items-center justify-center rounded-full border transition-colors shrink-0",
          isPlaying
            ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-400"
            : "border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground",
        )}
        aria-label={isPlaying ? "Pause" : "Lecture"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 ml-0.5" />
        )}
      </button>

      <div className="flex-1 flex flex-col gap-1">
        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(progress * 1000)}
          onChange={(e) => onProgressChange(Number(e.target.value) / 1000)}
          className="timeline-slider w-full h-2 cursor-pointer appearance-none rounded-full bg-muted [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-cyan-200 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-cyan-200 [&::-moz-range-thumb]:shadow-md [&::-webkit-slider-runnable-track]:rounded-full [&::-moz-range-track]:rounded-full"
          aria-label="Progression temporelle"
          aria-valuetext={currentTimeText}
        />
        <div className="flex items-center justify-between text-[10px] tabular-nums text-muted-foreground">
          <span>{formatTime(startTime)}</span>
          <span className="flex items-center gap-1 font-medium text-foreground">
            <Clock className="h-2.5 w-2.5" />
            {currentTimeText}
          </span>
          <span>{formatTime(endTime)}</span>
        </div>
      </div>
    </div>
  );
}
