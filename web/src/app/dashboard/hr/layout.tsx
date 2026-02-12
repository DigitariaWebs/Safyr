"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ProfileModal } from "@/components/layout/ProfileModal";
import { useSendEmail } from "@/contexts/SendEmailContext";
import { SendEmailModal } from "@/components/modals/SendEmailModal";
import { mockEmailTemplates } from "@/data/email-templates";
import { HRNavigationBar } from "@/components/layout/HRNavigationBar";
import { ModuleTopBar } from "@/components/ui/module-top-bar";
import { Users } from "lucide-react";

export default function HRLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("moduleNavCollapsed");
      return saved === "true";
    }
    return false;
  });
  const { isOpen, selectedEmployees, closeEmailModal, handleSendSuccess } =
    useSendEmail();

  const isEmployeeDetails =
    pathname.startsWith("/dashboard/hr/employees/") &&
    !pathname.endsWith("duerp") &&
    !pathname.endsWith("akto-opco") &&
    !pathname.endsWith("employees") &&
    !pathname.endsWith("archives");

  React.useEffect(() => {
    localStorage.setItem("moduleNavCollapsed", String(isCollapsed));
  }, [isCollapsed]);

  const handleSendEmail = (emailData: { subject: string; body: string }) => {
    console.log("Sending email to:", selectedEmployees);
    console.log("Email data:", emailData);
    handleSendSuccess();
  };

  return (
    <>
      <div className="flex h-screen flex-col">
        <ModuleTopBar
          moduleTitle="Ressources Humaines"
          moduleIcon={Users}
          onProfileClick={() => setProfileModalOpen(true)}
          userInitials="JD"
          userAvatar="/avatars/admin.jpg"
          showConteurs={true}
          collapsible={true}
          isCollapsed={isCollapsed}
          onCollapseToggle={
            !isEmployeeDetails ? () => setIsCollapsed(!isCollapsed) : undefined
          }
        />
        {!isEmployeeDetails && (
          <HRNavigationBar
            isCollapsed={isCollapsed}
            showNav={!isEmployeeDetails}
          />
        )}
        <main
          className={`flex-1 overflow-auto relative ${isEmployeeDetails ? "p-0" : "p-6"}`}
        >
          {children}
        </main>
      </div>

      <ProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />

      <SendEmailModal
        open={isOpen}
        onOpenChange={closeEmailModal}
        selectedEmployees={selectedEmployees}
        templates={mockEmailTemplates}
        onSend={handleSendEmail}
      />
    </>
  );
}
