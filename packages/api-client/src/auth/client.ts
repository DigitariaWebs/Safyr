import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { magicLinkClient } from "better-auth/client/plugins";
import { organizationClient } from "better-auth/client/plugins";
import { twoFactorClient } from "better-auth/client/plugins";
import { usernameClient } from "better-auth/client/plugins";
import { emailOTPClient } from "better-auth/client/plugins";

export interface CreateSafyrAuthClientOptions {
  baseURL: string;
}

export function createSafyrAuthClient({
  baseURL,
}: CreateSafyrAuthClientOptions) {
  return createAuthClient({
    baseURL,
    plugins: [
      magicLinkClient(),
      organizationClient(),
      adminClient(),
      usernameClient(),
      twoFactorClient(),
      emailOTPClient(),
    ],
  });
}

export type SafyrAuthClient = ReturnType<typeof createSafyrAuthClient>;
