import type { AgentHoursSummary } from "./contract-utils";

type Size = "sm" | "md";

export function AgentHoursCell({
  summary,
  size = "md",
}: {
  summary: AgentHoursSummary;
  size?: Size;
}) {
  const cls = size === "sm" ? "text-[10px] leading-none" : "text-[11px]";
  return (
    <div className={`space-y-0.5 ${cls}`}>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Contrat</span>
        <span className="font-semibold">{summary.contract.toFixed(2)}h</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Affectées</span>
        <span
          className={`font-semibold ${summary.isOver ? "text-destructive" : "text-primary"}`}
        >
          {summary.planned.toFixed(2)}h
        </span>
      </div>
      {summary.isOver ? (
        <div className="flex items-center justify-between">
          <span className="text-destructive font-medium">Dépassement</span>
          <span className="font-bold text-destructive">
            +{Math.abs(summary.diff).toFixed(2)}h
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Restantes</span>
          <span className="font-medium">{summary.diff.toFixed(2)}h</span>
        </div>
      )}
    </div>
  );
}
