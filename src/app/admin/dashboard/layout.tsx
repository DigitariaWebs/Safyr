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
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border/30 bg-background/80 backdrop-blur-xl">
            <div className="flex items-center gap-3 px-4">
              <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
              <Separator orientation="vertical" className="h-4 bg-border/50" />
            </div>
            <div className="ml-auto flex items-center gap-3 px-4">
              <button className="px-4 py-1.5 text-sm font-light text-muted-foreground hover:text-foreground border border-border/50 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all">
                Conteurs
              </button>
              <button
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center gap-2 hover:ring-2 hover:ring-primary/30 rounded-full p-0.5 transition-all"
              >
                <Avatar className="h-8 w-8 ring-2 ring-border/50">
                  <AvatarImage src="/avatars/admin.jpg" alt="Admin" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
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
