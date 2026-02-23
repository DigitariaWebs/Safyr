"use client";

import * as React from "react";
import { ProfileModal } from "@/components/layout/ProfileModal";
import { ModuleTopBar } from "@/components/ui/module-top-bar";
import { Building2 } from "lucide-react";
import { BankingNavigationBar } from "@/components/layout/BankingNavigationBar";

export default function BankingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);

  return (
    <>
      <div className="flex h-screen flex-col">
        <ModuleTopBar
          moduleTitle="Banque"
          moduleIcon={Building2}
          onProfileClick={() => setProfileModalOpen(true)}
          userInitials="JD"
          userAvatar="/avatars/admin.jpg"
          showConteurs={true}
        />
        <BankingNavigationBar showNav={true} />
        <main className="flex-1 overflow-auto relative p-6">{children}</main>
      </div>

      <ProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />
    </>
  );
}
