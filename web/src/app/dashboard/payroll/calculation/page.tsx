"use client";

import { useRouter } from "next/navigation";
import { MonthlyCalendarView } from "@/components/payroll/MonthlyCalendarView";

export default function PayrollCalculationPage() {
  const router = useRouter();

  const handleEmployeeClick = (
    employeeId: string,
    month: number,
    year: number,
  ) => {
    router.push(
      `/dashboard/payroll/calculation/${employeeId}/${month}/${year}`,
    );
  };

  return (
    <div className="container mx-auto p-6">
      <MonthlyCalendarView year={2024} onEmployeeClick={handleEmployeeClick} />
    </div>
  );
}
