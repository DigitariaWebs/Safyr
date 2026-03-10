# Safyr

A comprehensive management platform for private security companies. The project provides web and mobile tools for managing HR, payroll, billing, planning, operations, and field agent activities.

---

## Project Overview

- **Project Type**: Web management console and mobile field agent application
- **Overall Objective**: To provide private security companies with a unified platform covering the full operational lifecycle — from HR and payroll to shift planning, geolocation, incident logging, and billing
- **Language**: All user-facing content is in **French**
- **Regulatory Context**: Built for the French private security industry — CNAPS, URSSAF, Légifrance, DSN, SSIAP, and collective agreements

**Target Audience**:
- Security company administrators
- HR and payroll managers
- Security guards and field agents
- Field supervisors
- Billing and accounting teams

---

## Web Application (safyr-web)

**GitHub**: [https://github.com/DigitariaWebs/safyr](https://github.com/DigitariaWebs/safyr)

### Purpose

A comprehensive web-based management console for security company administrators to manage all aspects of their operations — HR, payroll, billing, accounting, planning, geolocation, logistics, and compliance.

### Features

- **HR Management**: Employee profiles, contracts with amendments, certifications, leave management, discipline, interviews, recruitment, training, offboarding, occupational medicine, legal registers, social reports, and workflow automation
- **Payroll System**: Complete payroll engine with legal/conventional configuration, variable inputs, calculation with gross-to-net breakdown, automatic controls, French payslip PDF generation, DSN declarations, and collective agreement sync via Légifrance API
- **Billing & Invoicing**: Client management, invoices, quotes, credit notes, purchase orders, VAT configuration, service catalog, and KPI dashboards
- **Accounting**: Chart of accounts and accounting entries management
- **Banking**: Bank account and transaction management
- **Planning & Scheduling**: Shift planning with agent/site/post management, schedule templates, and auto-scheduling
- **Geolocation**: Real-time agent position tracking on a live map
- **Digital Logbook**: Event logging, alerts, security incidents, validation workflows, statistics, agent and client portals, and export capabilities
- **Stock Management**: Equipment and inventory tracking
- **OCR**: Document scanning and data extraction
- **Dashboard**: KPI cards, revenue tracking, operational metrics, recent activity feed, and quick actions
- **Landing Page**: Public-facing marketing site with hero, services, testimonials, FAQ, and contact sections

### Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js with App Router | 16 |
| React | React | 19 |
| Styling | Tailwind CSS v4 with shadcn/ui | v4 |
| State Management | Zustand, Redux Toolkit, React Context | v5 / v2 |
| Data Tables | TanStack React Table | v8 |
| Drag & Drop | dnd-kit | v6 |
| Charting | Recharts | v3 |
| Animation | Framer Motion | v12 |
| PDF Generation | jsPDF with jspdf-autotable | v4 |
| QR Code | qrcode | v1 |
| Validation | Zod | v4 |
| Command Palette | cmdk | v1 |
| Icons | Lucide React | — |
| Fonts | Aldrich, Space Grotesk | — |
| Package Manager | bun | — |

---

## Mobile Application (safyr-mobile)

**GitHub**: [https://github.com/DigitariaWebs/safyr](https://github.com/DigitariaWebs/safyr)

### Purpose

A field-agent mobile application for security guards and supervisors to manage their daily operations — shift tracking, geolocation, incident logging, SOS alerts, patrol rounds, schedule viewing, time-off requests, payroll access, and document management.

### Features

- **Service Toggle**: In-service/out-of-service status with current post display and quick actions dashboard
- **Main Courante**: Digital activity logbook for logging events with priority levels, status tracking, and multimedia attachments
- **Patrol Rounds**: Patrol round tracking and management
- **Geolocation**: Live GPS map view with work zone geofencing and out-of-zone alerts
- **SOS Alert**: Emergency alert trigger that sends notifications to the control post
- **Schedule**: View assigned shifts with site details and break information
- **Time Off**: Submit and track time-off requests with approval status
- **Payroll**: View payslips and payroll documents
- **Documents**: Document hub for payroll, schedule, and other files
- **Notifications**: Notification center with multiple source categories
- **Profile**: Agent profile management with emergency contacts

### Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Expo SDK with React Native | 54 / 0.81.5 |
| Routing | expo-router | v6 |
| Styling | NativeWind with Tailwind CSS | v4 / v3 |
| Maps | Mapbox via @rnmapbox/maps | v10 |
| Location | expo-location | v19 |
| Storage | AsyncStorage, expo-secure-store | — |
| Animation | react-native-reanimated, Motion | v4 / v12 |
| Media | expo-av, expo-image, expo-image-picker | — |
| Haptics | expo-haptics | — |
| Icons | @expo/vector-icons, Lucide React | — |
| Fonts | Montserrat | — |
| Package Manager | bun | — |
