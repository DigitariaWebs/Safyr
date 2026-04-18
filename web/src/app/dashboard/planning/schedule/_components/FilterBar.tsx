"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Building2, MapPin, Users, ChevronDown, X } from "lucide-react";

import type { ComponentType } from "react";
import type { Client, Site } from "@/lib/types";
import type { PlanningAgent } from "@/data/planning-agents";
import { getSiteColorClasses } from "@/lib/site-colors";

type LucideIcon = ComponentType<{ className?: string }>;

const BUTTON_CLS =
  "h-10 gap-2 flex-1 justify-between data-[state=open]:bg-muted min-w-0";

const pillCls = (active: boolean, disabled?: boolean) =>
  `inline-flex items-center gap-1.5 h-8 px-3 rounded-full border text-xs font-medium transition data-[state=open]:ring-2 data-[state=open]:ring-primary/30 ${
    disabled
      ? "bg-muted/30 border-border/40 text-muted-foreground/50 cursor-not-allowed"
      : active
        ? "bg-primary/10 border-primary/30 text-primary hover:bg-primary/15"
        : "bg-muted/50 border-border/50 text-muted-foreground hover:bg-muted"
  }`;

type TriggerProps = {
  variant: "button" | "pill";
  icon: LucideIcon;
  label: string;
  count: number;
  disabled?: boolean;
  title?: string;
};

const FilterTrigger = ({
  variant,
  icon: Icon,
  label,
  count,
  disabled,
  title,
}: TriggerProps) => {
  if (variant === "pill") {
    return (
      <button
        type="button"
        disabled={disabled}
        className={pillCls(count > 0, disabled)}
        title={title}
      >
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate max-w-[10rem]">{label}</span>
        {count > 0 && (
          <Badge variant="secondary" className="h-4 px-1.5 text-[10px] ml-0.5">
            {count}
          </Badge>
        )}
      </button>
    );
  }
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      className={BUTTON_CLS}
      title={title}
    >
      <span className="flex items-center gap-2 min-w-0">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{label}</span>
      </span>
      <span className="flex items-center gap-1.5 shrink-0">
        {count > 0 && (
          <Badge variant="secondary" className="h-5 px-1.5 text-xs">
            {count}
          </Badge>
        )}
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </span>
    </Button>
  );
};

type FilterProps = {
  clients: Client[];
  sites: Site[];
  agents: PlanningAgent[];
  selectedClientIds: string[];
  selectedSiteIds: string[];
  selectedAgentIds: string[];
  onChangeClients: (ids: string[]) => void;
  onChangeSites: (ids: string[]) => void;
  onChangeAgents: (ids: string[]) => void;
  orientation?: "row" | "col";
  variant?: "button" | "pill";
};

export function FilterBar({
  clients,
  sites,
  agents,
  selectedClientIds,
  selectedSiteIds,
  selectedAgentIds,
  onChangeClients,
  onChangeSites,
  onChangeAgents,
  orientation = "row",
  variant = "button",
}: FilterProps) {
  const toggle = (
    current: string[],
    setter: (ids: string[]) => void,
    id: string,
  ) => {
    if (current.includes(id)) {
      setter(current.filter((x) => x !== id));
    } else {
      setter([...current, id]);
    }
  };

  // Sites narrowed to the selected clients (or empty when no client picked)
  const sitesForSelectedClients = useMemo(() => {
    if (selectedClientIds.length === 0) return [];
    return sites.filter((s) => selectedClientIds.includes(s.clientId));
  }, [selectedClientIds, sites]);

  const clientsGate = selectedClientIds.length === 0;

  const clientLabel = useMemo(() => {
    if (selectedClientIds.length === 0) return "Tous les clients";
    if (selectedClientIds.length === 1) {
      const c = clients.find((x) => x.id === selectedClientIds[0]);
      return c?.name ?? "1 client";
    }
    return `${selectedClientIds.length} clients`;
  }, [selectedClientIds, clients]);

  const siteLabel = useMemo(() => {
    if (clientsGate) return "Sélectionner un client";
    if (selectedSiteIds.length === 0) return "Tous les sites";
    if (selectedSiteIds.length === 1) {
      const s = sites.find((x) => x.id === selectedSiteIds[0]);
      return s?.name ?? "1 site";
    }
    return `${selectedSiteIds.length} sites`;
  }, [clientsGate, selectedSiteIds, sites]);

  const agentLabel = useMemo(() => {
    if (selectedAgentIds.length === 0) return "Tous les agents";
    if (selectedAgentIds.length === 1) {
      const a = agents.find((x) => x.id === selectedAgentIds[0]);
      return a?.name ?? "1 agent";
    }
    return `${selectedAgentIds.length} agents`;
  }, [selectedAgentIds, agents]);

  const hasAnyFilter =
    selectedClientIds.length > 0 ||
    selectedSiteIds.length > 0 ||
    selectedAgentIds.length > 0;

  const containerCls =
    orientation === "col"
      ? "flex flex-col gap-2 w-full"
      : variant === "pill"
        ? "flex items-center gap-2 flex-1 min-w-0 flex-wrap"
        : "flex items-center gap-3 flex-1 min-w-0";

  return (
    <div className={containerCls}>
      {/* Clients */}
      <Popover>
        <PopoverTrigger asChild>
          <FilterTrigger
            variant={variant}
            icon={Building2}
            label={clientLabel}
            count={selectedClientIds.length}
          />
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="max-h-64 overflow-y-auto py-1">
            {clients.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted cursor-pointer text-sm"
              >
                <Checkbox
                  checked={selectedClientIds.includes(c.id)}
                  onCheckedChange={() =>
                    toggle(selectedClientIds, onChangeClients, c.id)
                  }
                />
                <span className="flex-1 truncate">{c.name}</span>
              </label>
            ))}
            {clients.length === 0 && (
              <div className="px-2 py-4 text-center text-xs text-muted-foreground">
                Aucun client.
              </div>
            )}
          </div>
          {selectedClientIds.length > 0 && (
            <div className="border-t p-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => onChangeClients([])}
              >
                Effacer
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Sites — disabled until a client is selected */}
      <Popover>
        <PopoverTrigger asChild>
          <FilterTrigger
            variant={variant}
            icon={MapPin}
            label={siteLabel}
            count={selectedSiteIds.length}
            disabled={clientsGate}
            title={clientsGate ? "Sélectionner d'abord un client" : undefined}
          />
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <div className="max-h-72 overflow-y-auto py-1">
            {sitesForSelectedClients.map((s) => {
              const colors = getSiteColorClasses(s.color);
              return (
                <label
                  key={s.id}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted cursor-pointer text-sm"
                >
                  <Checkbox
                    checked={selectedSiteIds.includes(s.id)}
                    onCheckedChange={() =>
                      toggle(selectedSiteIds, onChangeSites, s.id)
                    }
                  />
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${colors.dot}`}
                  />
                  <span className="flex-1 truncate">{s.name}</span>
                  <span className="text-xs text-muted-foreground truncate">
                    {s.clientName}
                  </span>
                </label>
              );
            })}
            {sitesForSelectedClients.length === 0 && (
              <div className="px-2 py-4 text-center text-xs text-muted-foreground">
                Aucun site pour ce client.
              </div>
            )}
          </div>
          {selectedSiteIds.length > 0 && (
            <div className="border-t p-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => onChangeSites([])}
              >
                Effacer
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Agents */}
      <Popover>
        <PopoverTrigger asChild>
          <FilterTrigger
            variant={variant}
            icon={Users}
            label={agentLabel}
            count={selectedAgentIds.length}
          />
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="max-h-72 overflow-y-auto py-1">
            {agents.map((a) => (
              <label
                key={a.id}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted cursor-pointer text-sm"
              >
                <Checkbox
                  checked={selectedAgentIds.includes(a.id)}
                  onCheckedChange={() =>
                    toggle(selectedAgentIds, onChangeAgents, a.id)
                  }
                />
                <span className="flex-1 truncate">{a.name}</span>
                <span className="text-xs text-muted-foreground">
                  {a.contractType}
                </span>
              </label>
            ))}
            {agents.length === 0 && (
              <div className="px-2 py-4 text-center text-xs text-muted-foreground">
                Aucun agent.
              </div>
            )}
          </div>
          {selectedAgentIds.length > 0 && (
            <div className="border-t p-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => onChangeAgents([])}
              >
                Effacer
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {hasAnyFilter && (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground"
          onClick={() => {
            onChangeClients([]);
            onChangeSites([]);
            onChangeAgents([]);
          }}
        >
          <X className="h-3.5 w-3.5" />
          Tout effacer
        </Button>
      )}
    </div>
  );
}
