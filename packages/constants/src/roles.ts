export const SAFYR_ROLES = {
  DIRIGEANT_RH: "dirigeant_rh",
  CHEF_EXPLOITATION: "chef_exploitation",
  COMPTABLE: "comptable",
  CHEF_DE_SITE: "chef_de_site",
  AGENT: "agent",
} as const;

export type SafyrRole = (typeof SAFYR_ROLES)[keyof typeof SAFYR_ROLES];
