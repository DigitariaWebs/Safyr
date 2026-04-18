"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  label: string;
  description?: string;
  optional?: boolean;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function Stepper({
  steps,
  currentStep,
  className,
  orientation = "horizontal",
}: StepperProps) {
  return (
    <div
      className={cn(
        "w-full",
        orientation === "vertical" ? "space-y-4" : "",
        className,
      )}
    >
      <div
        className={cn(
          "flex",
          orientation === "vertical"
            ? "flex-col space-y-4"
            : "items-center justify-between",
        )}
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <React.Fragment key={index}>
              <div
                className={cn(
                  "flex items-center gap-3",
                  orientation === "vertical" ? "w-full" : "",
                )}
              >
                {/* Step Circle */}
                <div className="relative flex items-center justify-center">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200",
                      isCompleted &&
                        "border-primary bg-primary text-primary-foreground",
                      isCurrent &&
                        "border-primary bg-background text-primary scale-110",
                      isUpcoming &&
                        "border-muted-foreground/30 bg-muted text-muted-foreground",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                </div>

                {/* Step Content */}
                <div
                  className={cn(
                    "flex flex-col",
                    orientation === "vertical" ? "flex-1" : "",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors",
                        isCompleted && "text-primary",
                        isCurrent && "text-foreground",
                        isUpcoming && "text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </span>
                    {step.optional && (
                      <span className="text-xs text-muted-foreground">
                        (Optionnel)
                      </span>
                    )}
                  </div>
                  {step.description && (
                    <span
                      className={cn(
                        "text-xs transition-colors",
                        isCompleted && "text-primary/70",
                        isCurrent && "text-muted-foreground",
                        isUpcoming && "text-muted-foreground/60",
                      )}
                    >
                      {step.description}
                    </span>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "transition-colors duration-200",
                    orientation === "vertical"
                      ? "ml-5 h-8 w-0.5"
                      : "mx-2 h-0.5 flex-1",
                    index < currentStep
                      ? "bg-primary"
                      : "bg-muted-foreground/30",
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
