"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  User,
  ClipboardList,
  Wallet,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    label: "Tableau de bord",
    items: [
      {
        title: "Vue d'ensemble",
        url: "/admin/dashboard",
        icon: Home,
      },
    ],
  },
  {
    label: "Gestion du Personnel",
    items: [
      {
        title: "Salariés",
        url: "/admin/dashboard/employees",
        icon: Users,
      },
      {
        title: "Contrats",
        url: "/admin/dashboard/contracts",
        icon: ClipboardList,
      },
      {
        title: "Documents",
        url: "/admin/dashboard/documents",
        icon: Shield,
      },
    ],
  },
  {
    label: "Temps & Absences",
    items: [
      {
        title: "Congés",
        url: "/admin/dashboard/leaves",
        icon: User,
      },
      {
        title: "Heures CSE",
        url: "/admin/dashboard/cse-hours",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "Paie & Finance",
    items: [
      {
        title: "Préparation paie",
        url: "/admin/dashboard/payroll",
        icon: Wallet,
      },
      {
        title: "Notes de frais",
        url: "/admin/dashboard/expenses",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "Formations & Habilitations",
    items: [
      {
        title: "SSIAP / SST",
        url: "/admin/dashboard/certifications",
        icon: Shield,
      },
      {
        title: "Plan de formation",
        url: "/admin/dashboard/training-plan",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "Recrutement & Discipline",
    items: [
      {
        title: "Candidatures",
        url: "/admin/dashboard/recruitment",
        icon: Users,
      },
      {
        title: "Sanctions",
        url: "/admin/dashboard/sanctions",
        icon: Shield,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        title: "Registres légaux",
        url: "/admin/dashboard/legal-registers",
        icon: ClipboardList,
      },
      {
        title: "Paramètres",
        url: "/admin/dashboard/settings",
        icon: Settings,
      },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/40">
      <SidebarHeader className="h-16 items-center justify-center border-b border-sidebar-border/40">
        <Link
          href="/admin/dashboard"
          className={cn(
            "flex items-center gap-2 transition-all duration-200",
            isCollapsed ? "justify-center" : "px-2"
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-[0.625rem] bg-primary">
            <span className="font-serif text-sm font-semibold text-primary-foreground">
              S
            </span>
          </div>
          {!isCollapsed && (
            <span className="font-serif text-xl font-light tracking-wide">
              Safyr
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {navigationItems.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[11px] font-normal uppercase tracking-wider text-sidebar-foreground/50">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className={cn(
                          "relative font-light transition-all duration-200",
                          isActive &&
                            "bg-sidebar-accent font-normal text-sidebar-accent-foreground"
                        )}
                      >
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {isActive && !isCollapsed && (
                            <ChevronRight className="ml-auto h-4 w-4 text-sidebar-accent-foreground/70" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/40 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              className="font-light text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
