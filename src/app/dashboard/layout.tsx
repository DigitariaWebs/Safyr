"use client";

import { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Calendar,
  FileText,
  Wallet,
  Building2,
  MapPin,
  ClipboardCheck,
  UserCircle,
  Eye,
  Landmark,
  Receipt,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SendEmailProvider } from "@/contexts/SendEmailContext";
import Image from "next/image";

interface Module {
  name: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}

const modules: Module[] = [
  {
    name: "RH",
    href: "/dashboard/hr",
    icon: Users,
  },
  {
    name: "Planning",
    href: "/dashboard/planning",
    icon: Calendar,
    disabled: true,
  },
  {
    name: "Main Courante",
    href: "/dashboard/logbook",
    icon: FileText,
    disabled: true,
  },
  {
    name: "Géolocalisation",
    href: "/dashboard/geolocation",
    icon: MapPin,
    disabled: true,
  },
  {
    name: "Paie",
    href: "/dashboard/payroll",
    icon: Wallet,
    disabled: true,
  },
  {
    name: "Comptabilité",
    href: "/dashboard/accounting",
    icon: Landmark,
    disabled: true,
  },
  {
    name: "Banque",
    href: "/dashboard/banking",
    icon: Building2,
    disabled: true,
  },
  {
    name: "Facturation",
    href: "/dashboard/billing",
    icon: Receipt,
    disabled: true,
  },
  {
    name: "Stock",
    href: "/dashboard/stock",
    icon: Package,
    disabled: true,
  },
  {
    name: "OCR",
    href: "/dashboard/ocr",
    icon: ClipboardCheck,
    disabled: true,
  },
  {
    name: "Portail Agent",
    href: "/dashboard/agent-portal",
    icon: UserCircle,
    disabled: true,
  },
  {
    name: "Portail Client",
    href: "/dashboard/client-portal",
    icon: Eye,
    disabled: true,
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboardSidebarExpanded");
      return saved === "true";
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "dashboardSidebarExpanded",
        String(isSidebarExpanded),
      );
    }
  }, [isSidebarExpanded]);

  return (
    <SendEmailProvider>
      <div className="flex h-screen bg-background">
        {/* Fixed Module Selector Sidebar */}
        <aside
          className={cn(
            "border-r bg-card shrink-0 transition-all duration-300 relative",
            isSidebarExpanded ? "w-64" : "w-20",
          )}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center justify-center border-b relative">
              {isSidebarExpanded ? (
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Image
                    src="/favicon.png"
                    alt="Safyr"
                    width={32}
                    height={32}
                    className="transition-transform hover:scale-110"
                  />
                  <span className="font-serif text-xl font-light">Safyr</span>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Image
                    src="/favicon.png"
                    alt="Safyr"
                    width={32}
                    height={32}
                    className="transition-transform hover:scale-110"
                  />
                </Link>
              )}
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="absolute -right-3 top-20 z-20 flex h-6 w-6 items-center justify-center rounded-full border bg-card shadow-md hover:bg-accent transition-colors"
              aria-label={
                isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"
              }
            >
              {isSidebarExpanded ? (
                <ChevronLeft className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>

            {/* Module List */}
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-2 px-2">
                {modules.map((module) => {
                  const Icon = module.icon;
                  const isActive = pathname.startsWith(module.href);

                  return (
                    <li key={module.name}>
                      {module.disabled ? (
                        <div
                          className={cn(
                            "flex items-center rounded-xl text-muted-foreground opacity-30 cursor-not-allowed transition-all",
                            isSidebarExpanded
                              ? "gap-3 px-4 py-3"
                              : "h-12 w-12 mx-auto justify-center",
                          )}
                          title={!isSidebarExpanded ? module.name : undefined}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          {isSidebarExpanded && (
                            <span className="text-sm font-light">
                              {module.name}
                            </span>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={module.href}
                          className={cn(
                            "flex items-center rounded-xl transition-all relative group",
                            isSidebarExpanded
                              ? "gap-3 px-4 py-3"
                              : "h-12 w-12 mx-auto justify-center",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                          )}
                          title={!isSidebarExpanded ? module.name : undefined}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          {isSidebarExpanded && (
                            <span className="text-sm font-medium">
                              {module.name}
                            </span>
                          )}
                          {isActive && !isSidebarExpanded && (
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                          )}
                          {!isSidebarExpanded && (
                            <span className="absolute left-full ml-4 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border">
                              {module.name}
                            </span>
                          )}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="border-t p-2">
              {isSidebarExpanded ? (
                <div className="px-4 py-3">
                  <p className="text-xs font-light text-muted-foreground">
                    Module actif
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {modules.find((m) => pathname.startsWith(m.href))?.name ||
                      "Dashboard"}
                  </p>
                </div>
              ) : (
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-muted/50">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {modules
                      .find((m) => pathname.startsWith(m.href))
                      ?.name?.slice(0, 2) || "SF"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area - This will contain the module-specific sidebar + content */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </SendEmailProvider>
  );
}
