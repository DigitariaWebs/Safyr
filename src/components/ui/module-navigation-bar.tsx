"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  disabled?: boolean;
  children?: {
    label: string;
    href: string;
    disabled?: boolean;
  }[];
}

export interface ModuleNavigationBarProps {
  moduleTitle: string;
  moduleIcon: React.ElementType;
  dashboardHref: string;
  navItems: NavItem[];
  onProfileClick: () => void;
  userInitials?: string;
  userAvatar?: string;
  showConteurs?: boolean;
  collapsible?: boolean;
}

export function ModuleNavigationBar({
  moduleTitle,
  moduleIcon: ModuleIcon,
  dashboardHref,
  navItems,
  onProfileClick,
  userInitials = "JD",
  userAvatar,
  showConteurs = true,
  collapsible = true,
}: ModuleNavigationBarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem("moduleNavCollapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("moduleNavCollapsed", String(isCollapsed));
  }, [isCollapsed]);

  const isActiveItem = (item: NavItem) => {
    if (item.href && pathname === item.href) return true;
    if (item.children) {
      return item.children.some((child) => pathname === child.href);
    }
    return false;
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-card">
      <div className="flex h-14 items-center justify-between px-6">
        {/* Left: Module Title and Collapse Button */}
        <div className="flex items-center gap-3">
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
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

      {/* Navigation Items */}
      <div className="border-t bg-muted/30">
        <nav className="flex items-center gap-1 px-6 py-2 overflow-x-auto">
          {/* Dashboard Link */}
          <Link
            href={dashboardHref}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all whitespace-nowrap font-medium",
              pathname === dashboardHref
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground hover:bg-accent hover:text-foreground",
            )}
            title={isCollapsed ? "Tableau de bord" : undefined}
          >
            <ModuleIcon className="h-4 w-4" />
            {!isCollapsed && <span>Tableau de bord</span>}
          </Link>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveItem(item);

            if (item.disabled) {
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg text-muted-foreground opacity-50 cursor-not-allowed whitespace-nowrap"
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4" />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
              );
            }

            if (item.children) {
              const enabledChildren = item.children.filter(
                (child) => !child.disabled,
              );
              const hasEnabledChildren = enabledChildren.length > 0;

              if (!hasEnabledChildren) {
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg text-muted-foreground opacity-50 cursor-not-allowed whitespace-nowrap"
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                );
              }

              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all whitespace-nowrap font-medium",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground hover:bg-accent hover:text-foreground",
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4" />
                    {!isCollapsed && (
                      <>
                        <span>{item.label}</span>
                        <ChevronDown className="h-3 w-3" />
                      </>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {item.children.map((child, index) => {
                      if (child.disabled) {
                        return (
                          <React.Fragment key={child.href}>
                            <DropdownMenuItem disabled>
                              <span className="text-muted-foreground">
                                {child.label}
                              </span>
                            </DropdownMenuItem>
                            {index < item.children!.length - 1 && (
                              <DropdownMenuSeparator />
                            )}
                          </React.Fragment>
                        );
                      }

                      return (
                        <React.Fragment key={child.href}>
                          <DropdownMenuItem asChild>
                            <Link
                              href={child.href}
                              className={cn(
                                "w-full cursor-pointer",
                                pathname === child.href &&
                                  "bg-accent text-accent-foreground",
                              )}
                            >
                              {child.label}
                            </Link>
                          </DropdownMenuItem>
                          {index < item.children!.length - 1 && (
                            <DropdownMenuSeparator />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href!}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all whitespace-nowrap font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-accent hover:text-foreground",
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
