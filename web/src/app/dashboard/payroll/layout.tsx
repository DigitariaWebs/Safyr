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
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("payrollNavCollapsed");
      return saved === "true";
    }
    return false;
  });

  // Hide navigation when viewing specific employee calculation
  const isEmployeeCalculation = React.useMemo(() => {
    const calculationRegex =
      /^\/dashboard\/payroll\/calculation\/[^/]+\/\d+\/\d+$/;
    return calculationRegex.test(pathname);
  }, [pathname]);

  React.useEffect(() => {
    localStorage.setItem("payrollNavCollapsed", String(isCollapsed));
  }, [isCollapsed]);

  return (
    <>
      <div className="flex h-screen flex-col">
        <ModuleTopBar
          moduleTitle="Paie"
          moduleIcon={DollarSign}
          onProfileClick={() => setProfileModalOpen(true)}
          userInitials="JD"
          userAvatar="/avatars/admin.jpg"
          showConteurs={true}
          collapsible={true}
          isCollapsed={isCollapsed}
          onCollapseToggle={() => setIsCollapsed(!isCollapsed)}
        />
        <PayrollNavigationBar
          isCollapsed={isCollapsed}
          showNav={!isEmployeeCalculation}
        />
        <main className="flex-1 overflow-auto relative p-6">{children}</main>
      </div>

      <ProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />
    </>
  );
}
