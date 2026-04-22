"use client";

import { CheckCircle2, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSOSStore } from "@/lib/stores/sosStore";
import { SOS_STATUS_CONFIG } from "@/data/geolocation-sos";

export function SOSHistoryTable() {
  const sosHistory = useSOSStore((s) => s.sosHistory);
  const rows = sosHistory.slice(0, 5);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-red-400" />
          <h3 className="text-lg font-semibold">Historique SOS</h3>
          <Badge variant="muted">{sosHistory.length}</Badge>
        </div>

        {rows.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Aucune alerte SOS enregistrée</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Déclenchée le</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Raison clôture</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((event) => {
                const date = new Date(event.triggeredAt);
                const config = SOS_STATUS_CONFIG[event.status];

                return (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">
                      {event.agentName}
                    </TableCell>
                    <TableCell>{event.site}</TableCell>
                    <TableCell>
                      {date.toLocaleDateString("fr-FR")}{" "}
                      {date.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge className={config.className}>{config.label}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {event.dismissReason ?? "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
