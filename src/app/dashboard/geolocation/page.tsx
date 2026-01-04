"use client";

import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import { MapPin, Navigation, Battery, Signal } from "lucide-react";
import { mockGeolocationAgents } from "@/data/geolocation-agents";

export default function GeolocationDashboard() {
  const activeAgents = mockGeolocationAgents.filter(
    (a) => a.status !== "Hors ligne",
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

      <InfoCardContainer>
        <InfoCard
          icon={MapPin}
          title="Agents Actifs"
          value={activeAgents}
          subtext={`Sur ${totalAgents} agents`}
          color="green"
        />

        <InfoCard
          icon={Navigation}
          title="En Déplacement"
          value={
            mockGeolocationAgents.filter((a) => a.status === "En déplacement")
              .length
          }
          subtext="Agents mobiles"
          color="blue"
        />

        <InfoCard
          icon={Battery}
          title="Batterie Moy."
          value={`${avgBattery.toFixed(0)}%`}
          subtext="Autonomie moyenne"
          color="orange"
        />

        <InfoCard
          icon={Signal}
          title="Couverture"
          value={`${((activeAgents / totalAgents) * 100).toFixed(0)}%`}
          subtext="Agents connectés"
          color="gray"
        />
      </InfoCardContainer>
    </div>
  );
}
