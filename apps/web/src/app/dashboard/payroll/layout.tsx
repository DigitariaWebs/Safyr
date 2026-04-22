"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ProfileModal } from "@/components/layout/ProfileModal";
import { ModuleTopBar } from "@/components/ui/module-top-bar";
import { DollarSign } from "lucide-react";
import { PayrollNavigationBar } from "@/components/layout/PayrollNavigationBar";

export default function PayrollLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);

  // Hide navigation when viewing specific employee calculation
  const isEmployeeCalculation = React.useMemo(() => {
    const calculationRegex =
      /^\/dashboard\/payroll\/calculation\/[^/]+\/\d+\/\d+$/;
    return calculationRegex.test(pathname);
  }, [pathname]);

  return (
    <>
      <div className="flex h-screen flex-col">
        <ModuleTopBar
          moduleTitle="Paie"
          moduleIcon={DollarSign}
          onProfileClick={() => setProfileModalOpen(true)}
          userAvatar="/avatars/admin.jpg"
          showConteurs={true}
        />
        <PayrollNavigationBar showNav={!isEmployeeCalculation} />
        <main className="flex-1 overflow-auto relative p-6">{children}</main>
      </div>

      <ProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />
    </>
  );
}
