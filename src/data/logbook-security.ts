export interface SecurityConfig {
  id: string;
  key: string;
  value: boolean | string | number;
  category:
    | "encryption"
    | "authentication"
    | "audit"
    | "backup"
    | "rgpd"
    | "api";
  description: string;
  updatedAt: string;
  updatedBy: string;
}

export interface APIConnection {
  id: string;
  name: string;
  type: "rest" | "soap" | "webhook";
  endpoint: string;
  status: "connected" | "disconnected" | "error" | "pending";
  lastSync?: string;
  syncFrequency: "realtime" | "hourly" | "daily" | "weekly";
  authentication: "api_key" | "oauth" | "basic" | "none";
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export const mockSecurityConfigs: SecurityConfig[] = [
  {
    id: "CONFIG-001",
    key: "encryption_enabled",
    value: true,
    category: "encryption",
    description: "Chiffrement AES-256 activé",
    updatedAt: "2024-01-15",
    updatedBy: "Admin",
  },
  {
    id: "CONFIG-002",
    key: "audit_log_enabled",
    value: true,
    category: "audit",
    description: "Journalisation des actions activée",
    updatedAt: "2024-01-15",
    updatedBy: "Admin",
  },
  {
    id: "CONFIG-003",
    key: "auto_backup_enabled",
    value: true,
    category: "backup",
    description: "Sauvegardes automatiques quotidiennes",
    updatedAt: "2024-01-15",
    updatedBy: "Admin",
  },
  {
    id: "CONFIG-004",
    key: "two_factor_auth",
    value: false,
    category: "authentication",
    description: "Authentification à deux facteurs",
    updatedAt: "2024-01-15",
    updatedBy: "Admin",
  },
  {
    id: "CONFIG-005",
    key: "rgpd_compliant",
    value: true,
    category: "rgpd",
    description: "Conformité RGPD",
    updatedAt: "2024-01-15",
    updatedBy: "Admin",
  },
  {
    id: "CONFIG-006",
    key: "data_masking_enabled",
    value: true,
    category: "rgpd",
    description: "Masquage automatique des données sensibles",
    updatedAt: "2024-01-15",
    updatedBy: "Admin",
  },
];

export const mockAPIConnections: APIConnection[] = [
  {
    id: "API-001",
    name: "CRM",
    type: "rest",
    endpoint: "https://api.crm.example.com/v1",
    status: "connected",
    lastSync: "2024-12-24T10:00:00Z",
    syncFrequency: "hourly",
    authentication: "api_key",
    createdAt: "2024-01-15",
    updatedAt: "2024-12-24T10:00:00Z",
  },
  {
    id: "API-002",
    name: "Systèmes d'alarme",
    type: "rest",
    endpoint: "https://api.alarm.example.com/v2",
    status: "connected",
    lastSync: "2024-12-24T09:45:00Z",
    syncFrequency: "realtime",
    authentication: "oauth",
    createdAt: "2024-01-15",
    updatedAt: "2024-12-24T09:45:00Z",
  },
  {
    id: "API-003",
    name: "Vidéosurveillance",
    type: "rest",
    endpoint: "https://api.camera.example.com/v1",
    status: "connected",
    lastSync: "2024-12-24T09:30:00Z",
    syncFrequency: "realtime",
    authentication: "api_key",
    createdAt: "2024-01-15",
    updatedAt: "2024-12-24T09:30:00Z",
  },
  {
    id: "API-004",
    name: "Logiciels comptables",
    type: "soap",
    endpoint: "https://api.accounting.example.com/soap",
    status: "pending",
    syncFrequency: "daily",
    authentication: "basic",
    createdAt: "2024-12-01",
    updatedAt: "2024-12-01",
  },
  {
    id: "API-005",
    name: "Logiciels clients (SI)",
    type: "rest",
    endpoint: "https://api.client-si.example.com/v1",
    status: "connected",
    lastSync: "2024-12-24T08:15:00Z",
    syncFrequency: "hourly",
    authentication: "oauth",
    createdAt: "2024-01-15",
    updatedAt: "2024-12-24T08:15:00Z",
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: "AUDIT-001",
    userId: "user-001",
    userName: "Sophie Dubois",
    action: "create",
    resource: "employee",
    resourceId: "13",
    details: { employeeName: "Nicolas Petit" },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    timestamp: "2024-12-22T10:00:00Z",
  },
  {
    id: "AUDIT-002",
    userId: "user-001",
    userName: "Sophie Dubois",
    action: "update",
    resource: "contract",
    resourceId: "CT-001",
    details: { field: "baseSalary", oldValue: 2400, newValue: 2500 },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    timestamp: "2024-12-20T14:30:00Z",
  },
  {
    id: "AUDIT-003",
    userId: "user-002",
    userName: "Marie Martin",
    action: "validate",
    resource: "event",
    resourceId: "EVT-2024-004",
    details: { status: "resolved" },
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0...",
    timestamp: "2024-12-24T14:30:00Z",
  },
  {
    id: "AUDIT-004",
    userId: "user-001",
    userName: "Sophie Dubois",
    action: "delete",
    resource: "expense",
    resourceId: "EXP-005",
    details: { reason: "Duplicata" },
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0...",
    timestamp: "2024-12-15T09:00:00Z",
  },
];
