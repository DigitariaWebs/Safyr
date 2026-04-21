"use client";

import { BarChart3, PieChart as PieChartIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartData } from "@/lib/geolocation-report-charts";

interface ReportChartsProps {
  data: ChartData;
  histogramTitle?: string;
  pieTitle?: string;
}

const TOOLTIP_STYLE = {
  backgroundColor: "hsl(var(--background))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
};

export function ReportCharts({
  data,
  histogramTitle = "Évolution",
  pieTitle = "Répartition",
}: ReportChartsProps) {
  const hasBar = data.bar.length > 0 && data.barSeries.length > 0;
  const hasPie = data.pie.length > 0;

  if (!hasBar && !hasPie) return null;

  const pieTotal = data.pie.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Histogramme */}
      <Card className="lg:col-span-3 glass-card border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-light flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-cyan-400" />
            {histogramTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasBar ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={data.bar}
                margin={{ top: 8, right: 12, left: -12, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  cursor={{ opacity: 0.1 }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                  iconType="circle"
                />
                {data.barSeries.map((s) => (
                  <Bar
                    key={s.key}
                    dataKey={s.key}
                    name={s.label}
                    fill={s.color}
                    stackId={data.barStacked ? "stack" : undefined}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </CardContent>
      </Card>

      {/* Secteur */}
      <Card className="lg:col-span-2 glass-card border-border/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-light flex items-center gap-2">
            <PieChartIcon className="h-4 w-4 text-cyan-400" />
            {pieTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasPie ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data.pie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {data.pie.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value, name) => {
                    const num = Number(value);
                    const pct = pieTotal > 0 ? (num / pieTotal) * 100 : 0;
                    return [`${num} (${pct.toFixed(1)}%)`, name];
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex items-center justify-center h-[260px] text-xs text-muted-foreground">
      Aucune donnée pour cette période
    </div>
  );
}
