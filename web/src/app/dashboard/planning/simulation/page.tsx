"use client";

import { ScheduleView } from "../schedule/page";

export default function SimulationPage() {
  return (
    <div
      data-simulation-shell
      className="-m-6 p-6 min-h-screen bg-[repeating-linear-gradient(135deg,rgba(244,63,94,0.04)_0px,rgba(244,63,94,0.04)_12px,transparent_12px,transparent_24px)] bg-rose-500/5 ring-2 ring-inset ring-rose-500/30"
    >
      <ScheduleView forceSimulation />
    </div>
  );
}
