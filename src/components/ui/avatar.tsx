"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
}

function Avatar({
  className,
  src,
  alt,
  fallback,
  size = "md",
  ...props
}: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-primary text-primary-foreground",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {src ? (
        <Image src={src} alt={alt || "Avatar"} fill className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-medium">
          {fallback || "?"}
        </div>
      )}
    </div>
  );
}

export { Avatar };
