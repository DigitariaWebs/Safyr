"use client";

import * as React from "react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileModal } from "@/components/layout/ProfileModal";
import { SendEmailProvider, useSendEmail } from "@/contexts/SendEmailContext";
import { SendEmailModal } from "@/components/modals/SendEmailModal";
import { mockEmailTemplates } from "@/data/email-templates";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);
  const { isOpen, selectedEmployees, closeEmailModal, handleSendSuccess } =
    useSendEmail();

  const handleSendEmail = (emailData: { subject: string; body: string }) => {
    console.log("Sending email to:", selectedEmployees);
    console.log("Email data:", emailData);
    // Here you would integrate with your email service
    handleSendSuccess();
  };

  return (
    <>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="overflow-x-hidden">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <span className="text-sm font-light text-muted-foreground">
                Admin Panel
              </span>
            </div>
            <div className="ml-auto flex items-center gap-4 px-4">
              <button
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center gap-2 hover:bg-accent rounded-full p-1 transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/admin.jpg" alt="Admin" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    JD
                  </AvatarFallback>
                </Avatar>
              </button>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-x-hidden max-w-full">
            {children}
          </main>
        </SidebarInset>
        <ProfileModal
          open={profileModalOpen}
          onOpenChange={setProfileModalOpen}
        />
      </SidebarProvider>

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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SendEmailProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SendEmailProvider>
  );
}
