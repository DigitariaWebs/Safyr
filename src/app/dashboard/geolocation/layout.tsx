"use client";

import * as React from "react";
import { ProfileModal } from "@/components/layout/ProfileModal";
import { ModuleTopBar } from "@/components/ui/module-top-bar";
import { MapPin } from "lucide-react";
import { GeolocationNavigationBar } from "@/components/layout/GeolocationNavigationBar";

export default function GeolocationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("geolocationNavCollapsed");
      return saved === "true";
    }
    return false;
  });

  React.useEffect(() => {
    localStorage.setItem("geolocationNavCollapsed", String(isCollapsed));
  }, [isCollapsed]);

  return (
    <>
      <div className="flex h-screen flex-col">
        <ModuleTopBar
          moduleTitle="Géolocalisation"
          moduleIcon={MapPin}
          onProfileClick={() => setProfileModalOpen(true)}
          userInitials="JD"
          userAvatar="/avatars/admin.jpg"
          showConteurs={true}
          collapsible={true}
          isCollapsed={isCollapsed}
          onCollapseToggle={() => setIsCollapsed(!isCollapsed)}
        />
        <GeolocationNavigationBar isCollapsed={isCollapsed} showNav={true} />
        <main className="flex-1 overflow-auto relative p-6">{children}</main>
      </div>

      <ProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />
    </>
  );
}

