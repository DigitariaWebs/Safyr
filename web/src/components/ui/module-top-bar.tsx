"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X } from "lucide-react";

export interface ModuleTopBarProps {
  moduleTitle: string;
  moduleIcon: React.ElementType;
  onProfileClick: () => void;
  userInitials?: string;
  userAvatar?: string;
  showConteurs?: boolean;
  collapsible?: boolean;
  isCollapsed?: boolean;
  onCollapseToggle?: () => void;
}

export function ModuleTopBar({
  moduleTitle,
  moduleIcon: ModuleIcon,
  onProfileClick,
  userInitials = "JD",
  userAvatar,
  showConteurs = true,
  collapsible = true,
  isCollapsed = false,
  onCollapseToggle,
}: ModuleTopBarProps) {
  return (
    <header className="sticky top-0 z-10 border-b bg-card">
      <div className="flex h-14 items-center justify-between px-6">
        {/* Left: Module Title and Collapse Button */}
        <div className="flex items-center gap-3">
          {collapsible && onCollapseToggle && (
            <button
              onClick={onCollapseToggle}
              className="flex items-center justify-center h-8 w-8 rounded-lg hover:bg-accent transition-colors"
              aria-label={
                isCollapsed ? "Expand navigation" : "Collapse navigation"
              }
            >
              {isCollapsed ? (
                <Menu className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </button>
          )}
          <div className="flex items-center gap-2">
            <ModuleIcon className="h-5 w-5 text-primary" />
            <h1 className="font-serif text-lg font-light">{moduleTitle}</h1>
          </div>
        </div>

        {/* Right: User Actions */}
        <div className="flex items-center gap-3">
          {showConteurs && (
            <button className="px-4 py-1.5 text-sm font-light text-muted-foreground hover:text-foreground border border-border/50 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all">
              Conteurs
            </button>
          )}
          <button
            onClick={onProfileClick}
            className="flex items-center gap-2 hover:ring-2 hover:ring-primary/30 rounded-full p-0.5 transition-all"
          >
            <Avatar className="h-8 w-8 ring-2 ring-border/50">
              <AvatarImage src={userAvatar} alt="User" />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </header>
  );
}
