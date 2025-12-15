"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Employee } from "@/lib/types";

interface SendEmailContextType {
  isOpen: boolean;
  selectedEmployees: Employee[];
  openEmailModal: (employees: Employee[], onSuccess?: () => void) => void;
  closeEmailModal: () => void;
  handleSendSuccess: () => void;
}

const SendEmailContext = createContext<SendEmailContextType | undefined>(
  undefined,
);

export function SendEmailProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [onSuccessCallback, setOnSuccessCallback] = useState<
    (() => void) | undefined
  >();

  const openEmailModal = (employees: Employee[], onSuccess?: () => void) => {
    setSelectedEmployees(employees);
    setOnSuccessCallback(() => onSuccess);
    setIsOpen(true);
  };

  const closeEmailModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setSelectedEmployees([]);
      setOnSuccessCallback(undefined);
    }, 300);
  };

  const handleSendSuccess = () => {
    if (onSuccessCallback) {
      onSuccessCallback();
    }
    closeEmailModal();
  };

  return (
    <SendEmailContext.Provider
      value={{
        isOpen,
        selectedEmployees,
        openEmailModal,
        closeEmailModal,
        handleSendSuccess,
      }}
    >
      {children}
    </SendEmailContext.Provider>
  );
}

export function useSendEmail() {
  const context = useContext(SendEmailContext);
  if (context === undefined) {
    throw new Error("useSendEmail must be used within a SendEmailProvider");
  }
  return context;
}
