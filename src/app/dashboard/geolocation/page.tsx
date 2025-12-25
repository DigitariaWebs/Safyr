"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, Battery, Signal } from "lucide-react";
import { mockGeolocationAgents } from "@/data/geolocation-agents";

export default function GeolocationDashboard() {
  const activeAgents = mockGeolocationAgents.filter(
    (a) => a.status !== "Hors ligne"
  ).length;
  const totalAgents = mockGeolocationAgents.length;
  const avgBattery =
    mockGeolocationAgents.reduce((acc, a) => acc + a.battery, 0) /
    mockGeolocationAgents.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord Géolocalisation</h1>
        <p className="text-muted-foreground">
          Suivi temps réel des agents sur le terrain
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agents Actifs</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAgents}</div>
            <p className="text-xs text-muted-foreground">
              Sur {totalAgents} agents
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En Déplacement
            </CardTitle>
            <Navigation className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                mockGeolocationAgents.filter(
                  (a) => a.status === "En déplacement"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">Agents mobiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Batterie Moy.</CardTitle>
            <Battery className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgBattery.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              Autonomie moyenne
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Couverture
            </CardTitle>
            <Signal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((activeAgents / totalAgents) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">Agents connectés</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

