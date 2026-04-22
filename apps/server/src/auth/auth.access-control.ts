import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
  memberAc,
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

export const dirigeantRH = ac.newRole({
  ...adminAc.statements,
  employee: ["create", "read", "update", "delete"],
  payroll: ["read", "generate", "approve"],
  planning: ["read", "write", "publish"],
  billing: ["read", "write"],
  geolocation: ["read"],
  logbook: ["read", "write"],
});

export const chefExploitation = ac.newRole({
  ...memberAc.statements,
  employee: ["read", "update"],
  planning: ["read", "write", "publish"],
  geolocation: ["read"],
  logbook: ["read", "write"],
});

export const comptable = ac.newRole({
  ...memberAc.statements,
  payroll: ["read", "generate", "approve"],
  billing: ["read", "write"],
  accounting: ["read", "write"],
});

export const chefDeSite = ac.newRole({
  ...memberAc.statements,
  employee: ["read"],
  planning: ["read", "write"],
  geolocation: ["read"],
  logbook: ["read", "write"],
});

export const agent = ac.newRole({
  ...memberAc.statements,
  planning: ["read"],
  logbook: ["read", "write"],
});

export const safyrRoles = {
  owner,
  dirigeant_rh: dirigeantRH,
  chef_exploitation: chefExploitation,
  comptable,
  chef_de_site: chefDeSite,
  agent,
};
