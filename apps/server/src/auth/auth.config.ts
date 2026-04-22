import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  admin,
  bearer,
  emailOTP,
  magicLink,
  organization,
  twoFactor,
  username,
} from "better-auth/plugins";
import { expo } from "@better-auth/expo";
import type { PrismaClient } from "../../generated/prisma/client";
import type { Env } from "@/config/env";
import type { EmailService } from "@/email/email.service";
import { ac, safyrRoles } from "./auth.access-control";

interface AuthDeps {
  env: Env;
  prisma: PrismaClient;
  email: EmailService;
}

export function createAuth({ env, prisma, email }: AuthDeps) {
  const plugins = [
    organization({
      ac,
      roles: safyrRoles,
      schema: {
        organization: {
          additionalFields: {
            siret: { type: "string", required: false, input: true },
            ape: { type: "string", required: false, input: true },
            address: { type: "string", required: false, input: true },
          },
        },
      },
    }),
    magicLink({
      sendMagicLink: async ({ email: to, url }) => {
        await email.sendMagicLink(to, { url });
      },
    }),
    emailOTP({
      async sendVerificationOTP({ email: to, otp, type }) {
        await email.sendOtp(to, otp, { type });
      },
    }),
    bearer(),
    admin(),
    username(),
    twoFactor(),
    expo(),
  ];

  return betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: env.ALLOWED_ORIGINS,
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    emailAndPassword: { enabled: false },
    plugins,
    advanced: {
      useSecureCookies: true,
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
