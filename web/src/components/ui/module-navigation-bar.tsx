"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Grid3x3 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  disabled?: boolean;
  children?: {
    label: string;
    href: string;
    disabled?: boolean;
    isNew?: boolean;
  }[];
}

export interface ModuleNavigationBarProps {
  moduleIcon: React.ElementType;
  dashboardHref: string;
  navItems: NavItem[];
  showNav?: boolean;
}

export function ModuleNavigationBar({
  moduleIcon: ModuleIcon,
  dashboardHref,
  navItems,
  showNav = true,
}: ModuleNavigationBarProps) {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<NavItem | null>(null);

  const isActiveItem = (item: NavItem) => {
    if (item.href && pathname === item.href) return true;
    if (item.children) {
      return item.children.some((child) => pathname === child.href);
    }
    return false;
  };

  const getActiveItem = () => {
    return navItems.find((item) => isActiveItem(item));
  };

  const activeItem = getActiveItem();
  const isDashboardActive = pathname === dashboardHref;

  return (
    <div className="border-t bg-muted/30">
      {showNav && (
        <nav className="flex items-center gap-3 px-6 py-2 overflow-x-auto">
          {/* Active Menu Item Name */}
          <div className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary">
            {isDashboardActive ? (
              <>
                <ModuleIcon className="h-4 w-4" />
                <span>Tableau de bord</span>
              </>
            ) : activeItem ? (
              <>
                <activeItem.icon className="h-4 w-4" />
                <span>{activeItem.label}</span>
              </>
            ) : null}
          </div>

          {/* Module Items Modal Trigger */}
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Grid3x3 className="h-4 w-4" />
            <span>Menu</span>
          </Button>

          {/* Modules Modal */}
          <Modal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            type="details"
            title="Menu"
            size="lg"
            closable={true}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Dashboard Item */}
              <Link
                href={dashboardHref}
                onClick={() => setIsModalOpen(false)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border transition-all hover:shadow-md",
                  isDashboardActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card hover:bg-accent",
                )}
              >
                <ModuleIcon className="h-8 w-8" />
                <span className="text-sm font-medium text-center">
                  Tableau de bord
                </span>
              </Link>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveItem(item);

                if (item.disabled) {
                  return (
                    <div
                      key={item.label}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-muted/50 opacity-50 cursor-not-allowed"
                    >
                      <Icon className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        {item.label}
                      </span>
                    </div>
                  );
                }

                if (item.children) {
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        setSelectedItem(item);
                        setIsModalOpen(false);
                      }}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border transition-all hover:shadow-md",
                        isActive
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card hover:bg-accent",
                      )}
                    >
                      <Icon className="h-8 w-8" />
                      <span className="text-sm font-medium text-center">
                        {item.label}
                      </span>
                    </button>
                  );
                }

                if (item.href) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsModalOpen(false)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border transition-all hover:shadow-md",
                        isActive
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card hover:bg-accent",
                      )}
                    >
                      <Icon className="h-8 w-8" />
                      <span className="text-sm font-medium text-center">
                        {item.label}
                      </span>
                    </Link>
                  );
                }

                return null;
              })}
            </div>
          </Modal>

          {/* Sub-items Modal */}
          {selectedItem && (
            <Modal
              open={!!selectedItem}
              onOpenChange={(open) => !open && setSelectedItem(null)}
              type="details"
              title={selectedItem.label}
              description="Sélectionnez une option"
              size="sm"
              closable={true}
            >
              <div className="flex flex-col gap-2">
                {selectedItem.children?.map((child) => {
                  if (child.disabled) {
                    return (
                      <div
                        key={child.href}
                        className="px-4 py-3 rounded-lg border bg-muted/50 opacity-50 cursor-not-allowed"
                      >
                        <span className="text-sm text-muted-foreground">
                          {child.label}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setSelectedItem(null)}
                      className={cn(
                        "px-4 py-3 rounded-lg border transition-all hover:shadow-sm",
                        pathname === child.href
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card hover:bg-accent",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {child.label}
                        </span>
                        {child.isNew && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-500 text-white">
                            Nouveau
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Modal>
          )}

          {/* Active Item's Children (Sub-items) */}
          {activeItem?.children && (
            <>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-1 flex-1 overflow-x-auto">
                {activeItem.children.map((child) => {
                  if (child.disabled) {
                    return (
                      <div
                        key={child.href}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg text-muted-foreground opacity-50 cursor-not-allowed whitespace-nowrap"
                      >
                        <span>{child.label}</span>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all whitespace-nowrap font-medium",
                        pathname === child.href
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      <span>{child.label}</span>
                      {child.isNew && (
                        <span className="px-1.5 py-0.5 text-xs font-semibold rounded-full bg-green-500 text-white">
                          Nouveau
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </nav>
      )}
    </div>
  );
}
