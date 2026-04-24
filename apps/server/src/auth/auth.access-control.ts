import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  ownerAc,
} from "better-auth/plugins/organization/access";

const statement = {
  ...defaultStatements,
  employee: ["create", "read", "update", "delete"],
  payroll: ["read", "generate", "approve"],
  planning: ["read", "write", "publish"],
  billing: ["read", "write"],
  accounting: ["read", "write"],
  geolocation: ["read"],
  logbook: ["read", "write"],
} as const;

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
  ...ownerAc.statements,
  employee: ["create", "read", "update", "delete"],
  payroll: ["read", "generate", "approve"],
  planning: ["read", "write", "publish"],
  billing: ["read", "write"],
  accounting: ["read", "write"],
  geolocation: ["read"],
  logbook: ["read", "write"],
});

export const agent = ac.newRole({
  employee: ["read"],
  planning: ["read"],
  logbook: ["read", "write"],
  geolocation: ["read"],
});

export const safyrRoles = {
  owner,
  agent,
};
