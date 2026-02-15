"use client";

import * as React from "react";
import { ProfileModal } from "@/components/layout/ProfileModal";
import { ModuleTopBar } from "@/components/ui/module-top-bar";
import { FileText } from "lucide-react";
import { OCRNavigationBar } from "@/components/layout/OCRNavigationBar";

export default function OCRLayout({ children }: { children: React.ReactNode }) {
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ocrNavCollapsed");
      return saved === "true";
    }
    return false;
  });

  React.useEffect(() => {
    localStorage.setItem("ocrNavCollapsed", String(isCollapsed));
  }, [isCollapsed]);

  return (
    <>
      <div className="flex h-screen flex-col">
        <ModuleTopBar
          moduleTitle="OCR"
          moduleIcon={FileText}
          onProfileClick={() => setProfileModalOpen(true)}
          userInitials="JD"
          userAvatar="/avatars/admin.jpg"
          showConteurs={true}
        />
        <OCRNavigationBar isCollapsed={isCollapsed} showNav={true} />
        <main className="flex-1 overflow-auto relative p-6">{children}</main>
      </div>

      <ProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />
    </>
  );
}
