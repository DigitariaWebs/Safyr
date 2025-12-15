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

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const menuItems = [
    {
      icon: User,
      label: "Profil",
      description: "Gérer vos informations personnelles",
      href: "/profil",
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
              <AvatarImage src="/avatars/admin.jpg" alt="John Doe" />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-left text-lg font-semibold">
                John Doe
              </SheetTitle>
              <p className="text-sm text-muted-foreground">
                john.doe@safyr.com
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Administrateur
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="px-6 pb-6">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <React.Fragment key={item.label}>
                <Link href={item.href} onClick={() => onOpenChange(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-auto p-4 hover:bg-accent min-h-16"
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs text-muted-foreground wrap-break-words">
                        {item.description}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
