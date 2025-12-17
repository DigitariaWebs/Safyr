"use client";

import * as React from "react";
import { ProfileModal } from "@/components/layout/ProfileModal";
import { useSendEmail } from "@/contexts/SendEmailContext";
import { SendEmailModal } from "@/components/modals/SendEmailModal";
import { mockEmailTemplates } from "@/data/email-templates";
import { HRNavigationBar } from "@/components/layout/HRNavigationBar";

export default function HRLayout({ children }: { children: React.ReactNode }) {
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);
  const { isOpen, selectedEmployees, closeEmailModal, handleSendSuccess } =
    useSendEmail();

  const handleSendEmail = (emailData: { subject: string; body: string }) => {
    console.log("Sending email to:", selectedEmployees);
    console.log("Email data:", emailData);
    handleSendSuccess();
  };

  return (
    <>
      <div className="flex h-screen flex-col">
        <HRNavigationBar onProfileClick={() => setProfileModalOpen(true)} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
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
