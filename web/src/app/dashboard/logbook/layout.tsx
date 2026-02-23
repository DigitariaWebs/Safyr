"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ProfileModal } from "@/components/layout/ProfileModal";
import { ModuleTopBar } from "@/components/ui/module-top-bar";
import { BookOpen } from "lucide-react";
import { LogbookNavigationBar } from "@/components/layout/LogbookNavigationBar";

export default function LogbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);

  const isEventDetails =
    pathname.startsWith("/dashboard/logbook/events/") &&
    !pathname.endsWith("/dashboard/logbook/events");

  return (
    <>
      <div className="flex h-screen flex-col">
        <ModuleTopBar
          moduleTitle="Main Courante Digitale"
          moduleIcon={BookOpen}
          onProfileClick={() => setProfileModalOpen(true)}
          userInitials="JD"
          userAvatar="/avatars/admin.jpg"
          showConteurs={true}
        />
        {!isEventDetails && <LogbookNavigationBar showNav={!isEventDetails} />}
        <main
          className={`flex-1 overflow-auto relative ${isEventDetails ? "p-0" : "p-6"}`}
        >
          {children}
        </main>
      </div>

      <ProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />
    </>
  );
}
