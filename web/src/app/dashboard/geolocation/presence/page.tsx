"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef, FilterDef } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PresenceDetailPanel } from "@/components/geolocation/PresenceDetailPanel";
import { mockGeolocationAgents } from "@/data/geolocation-agents";
import { mockGeolocationZones } from "@/data/geolocation-zones";
import {
  getMockShiftAssignments,
  computePresenceRecords,
  PRESENCE_STATUS_CONFIG,
  PRESENCE_STATUSES,
} from "@/data/geolocation-presence";
import type { PresenceRecord } from "@/data/geolocation-presence";
import { cn, getInitials } from "@/lib/utils";

// ── Helpers ──────────────────────────────────────────────────────────

function formatFrenchDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// ── Columns ──────────────────────────────────────────────────────────

const columns: ColumnDef<PresenceRecord>[] = [
  {
    key: "agentName",
    label: "Agent",
    render: (record) => {
      const config = PRESENCE_STATUS_CONFIG[record.status];
      return (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
              config.avatarClass,
            )}
          >
            {getInitials(record.agentName)}
          </div>
          <span className="font-medium text-sm">{record.agentName}</span>
        </div>
      );
    },
  },
  {
    key: "siteName",
    label: "Site Assigné",
    render: (record) => (
      <span className="text-sm text-muted-foreground">{record.siteName}</span>
    ),
  },
  {
    key: "shiftStart",
    label: "Vacation",
    render: (record) => (
      <span className="text-sm tabular-nums">
        {record.shiftStart} – {record.shiftEnd}
      </span>
    ),
    sortable: true,
    sortValue: (record) => record.shiftStart,
  },
  {
    key: "status",
    label: "Statut",
    render: (record) => {
      const config = PRESENCE_STATUS_CONFIG[record.status];
      return (
        <Badge
          variant={config.badgeVariant}
          className={cn("gap-1", config.badgeClassName)}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClass)} />
          {config.label}
        </Badge>
      );
    },
    sortable: true,
    sortValue: (record) => {
      const order = { present: 0, late: 1, "off-zone": 2, absent: 3 };
      return order[record.status];
    },
  },
  {
    key: "lastSeenAt",
    label: "Dernière position",
    render: (record) =>
      record.lastSeenAt ? (
        <span className="text-sm tabular-nums">
          {new Date(record.lastSeenAt).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ) : (
        <span className="text-sm text-muted-foreground italic">
          Aucun signal
        </span>
      ),
    sortable: true,
    sortValue: (record) => record.lastSeenAt ?? "",
  },
  {
    key: "anomalies",
    label: "Anomalies",
    render: (record) =>
      record.anomalies.length > 0 ? (
        <Badge variant="error" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          {record.anomalies.length}
        </Badge>
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      ),
    sortable: true,
    sortValue: (record) => record.anomalies.length,
  },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Tous" },
  ...PRESENCE_STATUSES.map((s) => ({
    value: s,
    label: PRESENCE_STATUS_CONFIG[s].label,
  })),
];

// ── Page ─────────────────────────────────────────────────────────────

export default function PresenceControlPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

  const todayShifts = useMemo(
    () => getMockShiftAssignments(dateStr),
    [dateStr],
  );

  const records = useMemo(
    () =>
      computePresenceRecords(
        todayShifts,
        mockGeolocationAgents,
        mockGeolocationZones,
      ),
    [todayShifts],
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      total: records.length,
      present: 0,
      late: 0,
      absent: 0,
      "off-zone": 0,
    };
    for (const r of records) {
      counts[r.status]++;
    }
    return counts;
  }, [records]);

  // Unique sites for filter
  const siteOptions = useMemo(() => {
    const sites = Array.from(new Set(todayShifts.map((s) => s.siteName)));
    return [
      { value: "all", label: "Tous les sites" },
      ...sites.map((s) => ({ value: s, label: s })),
    ];
  }, [todayShifts]);

  const filters: FilterDef[] = [
    { key: "siteName", label: "Site", options: siteOptions },
    { key: "status", label: "Statut", options: STATUS_OPTIONS },
  ];

  const findZone = (zoneId: string) =>
    mockGeolocationZones.find((z) => z.id === zoneId);

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-full">
      {/* Header + Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pointage</h1>
          <p className="text-muted-foreground">
            Vérification des présences par rapport au planning
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={() => setSelectedDate(addDays(selectedDate, -1))}
            aria-label="Jour précédent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span
            className="text-sm font-medium min-w-[200px] text-center capitalize"
            aria-live="polite"
          >
            {formatFrenchDate(selectedDate)}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            aria-label="Jour suivant"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          {!isToday && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date())}
            >
              Aujourd&apos;hui
            </Button>
          )}
        </div>
      </div>

      {/* Summary InfoCards */}
      <div aria-live="polite">
        <InfoCardContainer>
          <InfoCard
            icon={CalendarCheck}
            title="Planifiés"
            value={statusCounts.total}
            subtext="Vacations du jour"
            color="blue"
          />
          <InfoCard
            icon={CheckCircle}
            title="Présents"
            value={statusCounts.present}
            subtext="Agents confirmés"
            color="green"
          />
          <InfoCard
            icon={Clock}
            title="En retard"
            value={statusCounts.late}
            subtext="Arrivée tardive"
            color="orange"
          />
          <InfoCard
            icon={AlertTriangle}
            title="Anomalies"
            value={statusCounts.absent + statusCounts["off-zone"]}
            subtext={`${statusCounts.absent} absent · ${statusCounts["off-zone"]} hors zone`}
            color="red"
          />
        </InfoCardContainer>
      </div>

      {/* Data Table */}
      {records.length > 0 ? (
        <DataTable
          data={records}
          columns={columns}
          filters={filters}
          searchKeys={["agentName", "siteName"]}
          searchPlaceholder="Rechercher un agent ou un site..."
          itemsPerPage={10}
          getRowId={(record) => record.id}
          expandableContent={(record) => (
            <PresenceDetailPanel
              record={record}
              zone={findZone(record.zoneId)}
            />
          )}
          rowClassName={(record) =>
            cn(
              "border-l-2",
              record.status === "present" && "border-l-emerald-500/50",
              record.status === "late" && "border-l-yellow-500/50",
              record.status === "absent" && "border-l-red-500/50",
              record.status === "off-zone" && "border-l-orange-500/50",
            )
          }
          actions={(record) => (
            <Button variant="ghost" size="sm" asChild>
              <Link
                href={`/dashboard/geolocation/live?agent=${record.agentId}`}
              >
                <MapPin className="h-3.5 w-3.5 mr-1" />
                Localiser
              </Link>
            </Button>
          )}
        />
      ) : (
        <div className="rounded-xl border border-border/40 bg-card p-12 text-center">
          <CalendarCheck className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">
            Aucune vacation planifiée pour cette date
          </p>
          {!isToday && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setSelectedDate(new Date())}
            >
              Retour à aujourd&apos;hui
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
