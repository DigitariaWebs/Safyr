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
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("logbookNavCollapsed");
      return saved === "true";
    }
    return false;
  });

  const isEventDetails =
    pathname.startsWith("/dashboard/logbook/events/") &&
    !pathname.endsWith("/dashboard/logbook/events");

  React.useEffect(() => {
    localStorage.setItem("logbookNavCollapsed", String(isCollapsed));
  }, [isCollapsed]);

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
          collapsible={true}
          isCollapsed={isCollapsed}
          onCollapseToggle={
            !isEventDetails ? () => setIsCollapsed(!isCollapsed) : undefined
          }
        />
        {!isEventDetails && (
          <LogbookNavigationBar
            isCollapsed={isCollapsed}
            showNav={!isEventDetails}
          />
        )}
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
