"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Info,
  Crosshair,
  Search,
  ExternalLink,
  Clock,
  Gauge,
  Compass,
  BatteryLow,
  MapPin,
} from "lucide-react";
import {
  mockGeolocationAgents,
  GeolocationAgent,
} from "@/data/geolocation-agents";
import { AgentMap } from "@/components/geolocation/AgentMap";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: GeolocationAgent["status"][] = [
  "En poste",
  "En déplacement",
  "Hors ligne",
];

const STATUS_CONFIG: Record<
  GeolocationAgent["status"],
  { dot: string; ring: string; badge: string }
> = {
  "En poste": {
    dot: "bg-green-500",
    ring: "ring-green-500/30",
    badge: "border-green-500/30 text-green-400 bg-green-500/10",
  },
  "En déplacement": {
    dot: "bg-blue-500",
    ring: "ring-blue-500/30",
    badge: "border-blue-500/30 text-blue-400 bg-blue-500/10",
  },
  "Hors ligne": {
    dot: "bg-gray-500",
    ring: "ring-gray-500/20",
    badge: "border-gray-500/30 text-gray-400 bg-gray-500/10",
  },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getBatteryClasses(value: number): { fill: string; text: string } {
  if (value < 20) return { fill: "bg-red-500", text: "text-red-400" };
  if (value < 50) return { fill: "bg-amber-400", text: "text-amber-400" };
  return { fill: "bg-emerald-500", text: "text-emerald-400" };
}

function getCardinal(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"] as const;
  return dirs[Math.round(deg / 45) % 8];
}

function AgentAvatar({
  name,
  status,
  offline,
  size = "sm",
}: {
  name: string;
  status: GeolocationAgent["status"];
  offline: boolean;
  size?: "sm" | "lg";
}) {
  const sizeClass =
    size === "lg" ? "h-11 w-11 text-sm" : "h-8 w-8 text-[11px]";
  return (
    <div
      className={cn(
        "rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground shrink-0 ring-2 transition-opacity",
        sizeClass,
        STATUS_CONFIG[status].ring,
        offline && "opacity-40"
      )}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}

function BatteryBar({ value }: { value: number }) {
  const { fill } = getBatteryClasses(value);
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-10 h-1 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full", fill)}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[10px] tabular-nums text-muted-foreground">
        {value}%
      </span>
    </div>
  );
}

// Stateless — parent owns the single clock tick, passed as prop
function LastSeen({ iso, now }: { iso: string; now: number }) {
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60000);
  return (
    <span
      aria-label={
        minutes === 0 ? "connecté maintenant" : `vu il y a ${minutes} minutes`
      }
      className={cn(
        "text-[10px] tabular-nums font-medium",
        minutes === 0
          ? "text-emerald-500"
          : minutes < 10
            ? "text-muted-foreground"
            : "text-amber-400"
      )}
    >
      {minutes === 0 ? "live" : `${minutes}m`}
    </span>
  );
}

function AgentDetailContent({
  agent,
  onClose,
}: {
  agent: GeolocationAgent;
  onClose: () => void;
}) {
  const isOffline = agent.status === "Hors ligne";
  const isMoving = agent.status === "En déplacement";
  const { dot, badge } = STATUS_CONFIG[agent.status];
  const { fill: batteryFill, text: batteryColor } = getBatteryClasses(
    agent.battery
  );
  const minutesAgo = Math.floor(
    (Date.now() - new Date(agent.lastUpdate).getTime()) / 60000
  );

  return (
    <div className="space-y-4">
      {/* Agent identity */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
        <AgentAvatar
          name={agent.name}
          status={agent.status}
          offline={isOffline}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold leading-tight">{agent.name}</p>
          <p className="text-sm text-muted-foreground truncate">{agent.site}</p>
          {agent.zone && (
            <p className="text-xs text-muted-foreground/70">{agent.zone}</p>
          )}
          <Link
            href={`/dashboard/hr/employees/${agent.id}`}
            className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors mt-1"
            onClick={onClose}
          >
            <ExternalLink className="h-3 w-3" />
            Voir le profil
          </Link>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium shrink-0",
            badge
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              dot,
              isMoving && "animate-pulse"
            )}
          />
          {agent.status}
        </span>
      </div>

      {/* Position + time */}
      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-2">
          Position
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
            <p className="text-[10px] text-muted-foreground mb-1.5">
              Coordonnées GPS
            </p>
            <p className="text-sm font-mono tabular-nums leading-tight">
              {agent.latitude.toFixed(5)}
            </p>
            <p className="text-sm font-mono tabular-nums leading-tight">
              {agent.longitude.toFixed(5)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
            <p className="text-[10px] text-muted-foreground mb-1.5 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Dernière position
            </p>
            <p className="text-sm font-medium">
              {new Date(agent.lastUpdate).toLocaleTimeString("fr-FR")}
            </p>
            {isOffline ? (
              <p className="text-xs text-amber-400 mt-0.5">
                il y a {minutesAgo} min
              </p>
            ) : (
              <p className="text-xs text-emerald-500 mt-0.5">En direct</p>
            )}
          </div>
        </div>
      </div>

      {/* Movement — only for actively moving agents */}
      {isMoving && (
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-2">
            Déplacement
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
              <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1">
                <Gauge className="h-3 w-3" /> Vitesse
              </p>
              <p className="text-xl font-bold tabular-nums">
                {agent.speed}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  km/h
                </span>
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
              <p className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1">
                <Compass className="h-3 w-3" /> Direction
              </p>
              <p className="text-xl font-bold">
                {getCardinal(agent.direction)}
                <span className="text-sm font-normal text-muted-foreground ml-1.5">
                  {agent.direction}°
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Battery */}
      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-2">
          Appareil
        </p>
        <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Batterie</span>
            <span className={cn("text-sm font-bold tabular-nums", batteryColor)}>
              {agent.battery}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", batteryFill)}
              style={{ width: `${agent.battery}%` }}
            />
          </div>
          {agent.battery < 20 && (
            <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5">
              <BatteryLow className="h-3.5 w-3.5" />
              Batterie faible — recharge recommandée
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LiveTrackingPage() {
  const agents = mockGeolocationAgents;
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] =
    useState<GeolocationAgent | null>(null);
  const [siteFilter, setSiteFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [now, setNow] = useState(() => Date.now());

  // Single clock tick shared by all LastSeen instances
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const sites = useMemo(
    () => Array.from(new Set(agents.map((a) => a.site))),
    [agents]
  );

  const statusCounts = useMemo(
    () =>
      agents.reduce(
        (acc, a) => ({ ...acc, [a.status]: (acc[a.status] || 0) + 1 }),
        {} as Record<string, number>
      ),
    [agents]
  );

  const filteredAgents = useMemo(
    () =>
      agents.filter((a) => {
        const siteMatch = siteFilter === "all" || a.site === siteFilter;
        const statusMatch =
          statusFilter === "all" || a.status === statusFilter;
        return siteMatch && statusMatch;
      }),
    [agents, siteFilter, statusFilter]
  );

  const listAgents = useMemo(
    () =>
      filteredAgents.filter(
        (a) =>
          search === "" ||
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.site.toLowerCase().includes(search.toLowerCase())
      ),
    [filteredAgents, search]
  );

  const handleAgentZoom = (agent: GeolocationAgent) =>
    setSelectedAgent(agent);

  const handleAgentDetails = (agent: GeolocationAgent) => {
    setSelectedAgent(agent);
    setIsViewModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div>
          <div className="flex items-center gap-3 mb-0.5">
            <h1 className="text-2xl font-bold tracking-tight">
              Suivi en Temps Réel
            </h1>
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-red-500/10 text-red-400 border border-red-500/20"
              aria-label="Flux en direct"
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"
                aria-hidden="true"
              />
              Live
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {filteredAgents.length} agent
            {filteredAgents.length > 1 ? "s" : ""} · {sites.length} site
            {sites.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div
        className="flex items-center gap-2 flex-wrap"
        role="toolbar"
        aria-label="Filtres"
      >
        <label htmlFor="site-filter" className="sr-only">
          Filtrer par site
        </label>
        <select
          id="site-filter"
          value={siteFilter}
          onChange={(e) => setSiteFilter(e.target.value)}
          className="h-8 text-xs rounded-md border border-input bg-background px-2.5 focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">Tous les sites</option>
          {sites.map((site) => (
            <option key={site} value={site}>
              {site}
            </option>
          ))}
        </select>

        <div className="h-4 w-px bg-border" aria-hidden="true" />

        <div
          className="flex gap-1"
          role="group"
          aria-label="Filtrer par statut"
        >
          <button
            onClick={() => setStatusFilter("all")}
            aria-pressed={statusFilter === "all"}
            className={cn(
              "h-8 px-3 text-xs rounded-md border transition-colors",
              statusFilter === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-input text-muted-foreground hover:bg-accent"
            )}
          >
            Tous{" "}
            <span className="ml-1 opacity-60 tabular-nums" aria-hidden="true">
              {agents.length}
            </span>
          </button>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              aria-pressed={statusFilter === status}
              className={cn(
                "h-8 px-3 text-xs rounded-md border transition-colors flex items-center gap-1.5",
                statusFilter === status
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input text-muted-foreground hover:bg-accent"
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  STATUS_CONFIG[status].dot
                )}
                aria-hidden="true"
              />
              {status}
              <span className="opacity-60 tabular-nums" aria-hidden="true">
                {statusCounts[status] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Responsive grid — stacked on mobile, 60/40 on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 flex-1 min-h-0">
        <AgentMap
          agents={filteredAgents}
          selectedAgent={selectedAgent}
          onAgentClick={handleAgentZoom}
          className="col-span-1 lg:col-span-3 min-h-[40vh] lg:min-h-0"
        />

        {/* Agent list panel */}
        <div
          className="col-span-1 lg:col-span-2 flex flex-col gap-2 min-h-0 overflow-hidden"
          role="region"
          aria-label="Liste des agents"
        >
          <div className="relative shrink-0">
            <Search
              className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un agent…"
              aria-label="Rechercher un agent"
              className="pl-8 h-8 text-xs"
            />
          </div>

          <ul className="flex-1 overflow-y-auto space-y-1 pb-1 list-none">
            {listAgents.length === 0 ? (
              <li className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <MapPin className="h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  Aucun agent trouvé
                </p>
              </li>
            ) : (
              listAgents.map((agent) => {
                const isSelected = selectedAgent?.id === agent.id;
                const isOffline = agent.status === "Hors ligne";
                const { dot } = STATUS_CONFIG[agent.status];

                return (
                  <li key={agent.id} className="relative">
                    <div
                      className={cn(
                        "group relative flex items-center gap-0 rounded-lg border transition-all duration-150 overflow-hidden",
                        isSelected
                          ? "border-cyan-500/40 bg-cyan-500/5"
                          : "border-border/60 hover:border-border hover:bg-muted/30"
                      )}
                    >
                      {isSelected && (
                        <span
                          className="absolute left-0 inset-y-0 w-[2px] rounded-r-full bg-cyan-400"
                          aria-hidden="true"
                        />
                      )}

                      <button
                        onClick={() => handleAgentZoom(agent)}
                        className="flex-1 flex items-start gap-2.5 p-2.5 text-left min-w-0"
                        aria-label={`Localiser ${agent.name} sur la carte`}
                        aria-current={isSelected ? "true" : undefined}
                      >
                        <AgentAvatar
                          name={agent.name}
                          status={agent.status}
                          offline={isOffline}
                        />

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-baseline justify-between gap-1">
                            <p
                              className={cn(
                                "text-xs font-semibold leading-none truncate",
                                isOffline && "opacity-50"
                              )}
                            >
                              {agent.name}
                            </p>
                            <LastSeen iso={agent.lastUpdate} now={now} />
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {agent.site}
                          </p>
                          <div className="flex items-center justify-between pt-0.5">
                            <div className="flex items-center gap-1">
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full shrink-0",
                                  dot,
                                  isOffline && "opacity-40"
                                )}
                                aria-hidden="true"
                              />
                              <span className="text-[10px] text-muted-foreground">
                                {agent.status}
                              </span>
                            </div>
                            <BatteryBar value={agent.battery} />
                          </div>
                        </div>
                      </button>

                      <div className="pr-2 shrink-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="h-8 w-8 flex items-center justify-center rounded opacity-40 hover:opacity-100 focus:opacity-100 hover:bg-accent transition-all"
                              aria-label={`Actions pour ${agent.name}`}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-36">
                            <DropdownMenuItem
                              onClick={() => handleAgentDetails(agent)}
                            >
                              <Info className="h-3.5 w-3.5 mr-2 shrink-0" />
                              Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAgentZoom(agent)}
                            >
                              <Crosshair className="h-3.5 w-3.5 mr-2 shrink-0" />
                              Localiser
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>

      {/* Detail modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Localisation agent"
        icon={null}
        size="lg"
        actions={{
          secondary: {
            label: "Fermer",
            onClick: () => setIsViewModalOpen(false),
          },
        }}
      >
        {selectedAgent && (
          <AgentDetailContent
            agent={selectedAgent}
            onClose={() => setIsViewModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}
