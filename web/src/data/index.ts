// HR Mock Data
export * from "./hr-contracts";
export * from "./hr-training";
export * from "./hr-recruitment";
export * from "./hr-discipline";
export * from "./hr-interviews";
export * from "./hr-legal-registers";
export * from "./hr-payroll-expenses";
export {
  mockEquipment as mockHREquipment,
  mockEquipmentAssignments,
  type Equipment as HREquipment,
  type EquipmentAssignment,
} from "./hr-equipment";
export * from "./hr-absences";
export * from "./hr-workflows";
export * from "./hr-communication";
export * from "./hr-payroll-variables";
export * from "./hr-marketing";
export * from "./hr-tenders";
export * from "./hr-occupational-medicine";
export * from "./hr-offboarding";
export * from "./employees";
export * from "./time-management";
// Note: email-templates exports are also in hr-communication, so we skip it here
// export * from "./email-templates";

// Logbook Mock Data
export * from "./logbook-events";
export * from "./logbook-events-extended";
export * from "./logbook-alerts";
export * from "./logbook-security";

// Other Mock Data
export * from "./billing-clients";
export * from "./billing-invoices";
export * from "./billing-vat-configs";
export * from "./accounting-plans";
export * from "./banking-accounts";
export * from "./planning-agents";
export * from "./geolocation-agents";
export {
  mockEquipment as mockStockEquipment,
  type Equipment as StockEquipment,
} from "./stock-equipment";
export * from "./ocr-documents";
export * from "./payroll-conventions";
