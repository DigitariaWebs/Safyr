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

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar } from "@/components/ui/avatar";
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
      label: "Profile",
      description: "Manage your personal information",
      onClick: () => console.log("Profile clicked"),
    },
    {
      icon: Settings,
      label: "Preferences",
      description: "Customize your experience",
      onClick: () => console.log("Preferences clicked"),
    },
    {
      icon: Globe,
      label: "Language",
      description: "Change language settings",
      onClick: () => console.log("Language clicked"),
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Configure notification preferences",
      onClick: () => console.log("Notifications clicked"),
    },
    {
      icon: Shield,
      label: "Security",
      description: "Manage security settings",
      onClick: () => console.log("Security clicked"),
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80 p-0">
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-center gap-4">
            <Avatar size="lg" fallback="JD" />
            <div className="flex-1">
              <SheetTitle className="text-left text-lg font-semibold">
                John Doe
              </SheetTitle>
              <p className="text-sm text-muted-foreground">
                john.doe@safyr.com
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Administrator
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="px-6 pb-6">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <React.Fragment key={item.label}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent"
                  onClick={item.onClick}
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Button>
                {index < menuItems.length - 1 && <Separator className="my-1" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
