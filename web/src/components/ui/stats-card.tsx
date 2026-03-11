import * as React from "react";

import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  variant?: "default" | "success" | "warning" | "error";
  subtext?: string;
  className?: string;
}

const variantStyles = {
  default: {
    text: "text-foreground",
    accent: "text-primary",
    trendUp: "text-emerald-400",
    trendDown: "text-red-400",
  },
  success: {
    text: "text-emerald-400",
    accent: "text-emerald-400",
    trendUp: "text-emerald-400",
    trendDown: "text-red-400",
  },
  warning: {
    text: "text-amber-400",
    accent: "text-amber-400",
    trendUp: "text-amber-400",
    trendDown: "text-red-400",
  },
  error: {
    text: "text-red-400",
    accent: "text-red-400",
    trendUp: "text-emerald-400",
    trendDown: "text-red-400",
  },
};

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ title, value, trend, variant = "default", subtext, className }, ref) => {
    const styles = variantStyles[variant];

    return (
      <Card ref={ref} className={cn("border-border/40", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-light text-muted-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className={cn("text-3xl font-light tracking-tight", styles.text)}>
              {value}
            </div>
            {trend && (
              <div className="flex items-center gap-1 text-sm">
                {trend.direction === "up" ? (
                  <TrendingUp className={cn("h-4 w-4", styles.trendUp)} />
                ) : trend.direction === "down" ? (
                  <TrendingDown className={cn("h-4 w-4", styles.trendDown)} />
                ) : (
                  <Minus className="h-4 w-4 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    trend.direction === "up"
                      ? styles.trendUp
                      : trend.direction === "down"
                        ? styles.trendDown
                        : "text-muted-foreground",
                  )}
                >
                  {trend.value > 0 ? "+" : ""}
                  {trend.value}%
                </span>
              </div>
            )}
            {subtext && (
              <p className="text-xs text-muted-foreground">{subtext}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  },
);

StatsCard.displayName = "StatsCard";

export { StatsCard };
