// Entry used exclusively by `@better-auth/cli generate` to derive Prisma models.
// Runtime auth lives in auth.config.ts + auth.module.ts.
// Prisma client is a structural stub to avoid requiring `prisma generate` before the first run.

import type { PrismaClient } from "../../generated/prisma/client";
import { createAuth } from "./auth.config";
import type { Env } from "../config/env";
import type { EmailService } from "../email/email.service";

const stubEnv: Env = {
  NODE_ENV: "development",
  PORT: 4000,
  LOG_LEVEL: "info",
  DATABASE_URL: "postgresql://stub:stub@localhost:5432/stub",
  BETTER_AUTH_SECRET: "stub-stub-stub-stub-stub-stub-stub",
  BETTER_AUTH_URL: "http://localhost:4000",
  ALLOWED_ORIGINS: ["http://localhost:3000"],
  SMTP_PORT: 587,
  SMTP_FROM: "stub",
};

const stubEmail = { sendMagicLink: async () => {} } as unknown as EmailService;
const stubPrisma = {} as unknown as PrismaClient;

export const auth = createAuth({
  env: stubEnv,
  prisma: stubPrisma,
  email: stubEmail,
});
