"use client";

import * as React from "react";
import { ProfileModal } from "@/components/layout/ProfileModal";
import { ModuleTopBar } from "@/components/ui/module-top-bar";
import { Calculator } from "lucide-react";
import { AccountingNavigationBar } from "@/components/layout/AccountingNavigationBar";

export default function AccountingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);

  return (
    <>
      <div className="flex h-screen flex-col">
        <ModuleTopBar
          moduleTitle="Comptabilité"
          moduleIcon={Calculator}
          onProfileClick={() => setProfileModalOpen(true)}
          userAvatar="/avatars/admin.jpg"
          showConteurs={true}
        />
        <AccountingNavigationBar showNav={true} />
        <main className="flex-1 overflow-auto relative p-6">{children}</main>
      </div>

      <ProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />
    </>
  );
}
