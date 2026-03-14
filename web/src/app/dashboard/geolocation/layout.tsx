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
        />
        <GeolocationNavigationBar showNav={true} />
        <main className="flex-1 overflow-hidden relative">{children}</main>
      </div>

      <ProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />
    </>
  );
}
