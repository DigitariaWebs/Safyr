"use client";

import * as React from "react";
import {
  User,
  Settings,
  Globe,
  Bell,
  Shield,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { getUserDisplayData } from "@/lib/user-display";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { data } = authClient.useSession();
  const user = data?.user;
  const { displayName, displayEmail, displayRole, initials, avatarSrc } =
    getUserDisplayData(user, {
      fallbackName: "Utilisateur",
      fallbackEmail: "—",
      fallbackRole: "Membre",
      fallbackInitials: "U",
    });

  const menuItems = [
    {
      icon: User,
      label: "Profil",
      description: "Gérer vos informations personnelles",
      href: "/profile",
    },
    {
      icon: Settings,
      label: "Préférences",
      description: "Personnalisez votre expérience",
      href: "/preferences",
    },
    {
      icon: Globe,
      label: "Langue",
      description: "Changer les paramètres de langue",
      href: "/langue",
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Configurer les préférences de notification",
      href: "/notifications",
    },
    {
      icon: Shield,
      label: "Sécurité",
      description: "Gérer les paramètres de sécurité",
      href: "/securite",
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80 p-0">
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={avatarSrc}
                alt={displayName}
                className="outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10"
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-left text-lg font-semibold text-balance">
                {displayName}
              </SheetTitle>
              <p className="text-sm text-muted-foreground text-pretty">
                {displayEmail}
              </p>
              <p className="mt-1 text-xs text-muted-foreground text-pretty">
                {displayRole}
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="px-6 pb-6">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <React.Fragment key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => onOpenChange(false)}
                  className="block w-full"
                >
                  <Button
                    variant="ghost"
                    className="group h-auto min-h-16 w-full justify-start gap-3 overflow-hidden pl-4 pr-3.5 py-4 hover:bg-accent transition-[background-color,transform] duration-150 ease-out active:scale-[0.96]"
                  >
                    <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1 text-left">
                      <div className="truncate text-sm font-medium">
                        {item.label}
                      </div>
                      <div className="text-pretty text-xs text-muted-foreground [overflow-wrap:anywhere]">
                        {item.description}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                  </Button>
                </Link>
                {index < menuItems.length - 1 && <Separator className="my-1" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
