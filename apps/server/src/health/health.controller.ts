import { Controller, Get, Inject } from "@nestjs/common";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ENV } from "@/config/env.module";
import type { Env } from "@/config/env";
import { EmailService } from "@/email/email.service";
import { PrismaService } from "@/prisma/prisma.service";

const APP_VERSION = (
  JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), "utf8")) as {
    version: string;
  }
).version;

@Controller("health")
export class HealthController {
  constructor(
    @Inject(ENV) private readonly env: Env,
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}

  @Get()
  async check(): Promise<{
    status: "ok" | "degraded";
    version: string;
    environment: Env["NODE_ENV"];
    timestamp: string;
    services: {
      database: { status: "up" | "down"; error?: string };
      smtp: { status: "up" | "down"; error?: string };
    };
  }> {
    const [dbResult, smtp] = await Promise.all([
      this.prisma.$queryRaw`SELECT 1`
        .then((): { status: "up" } => ({ status: "up" }))
        .catch((error: unknown): { status: "down"; error: string } => ({
          status: "down",
          error:
            error instanceof Error
              ? error.message
              : "Database health check failed",
        })),
      this.email.checkConnection(),
    ]);

    const status =
      dbResult.status === "up" && smtp.status === "up" ? "ok" : "degraded";

    return {
      status,
      version: APP_VERSION,
      environment: this.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      services: {
        database: dbResult,
        smtp,
      },
    };
  }
}
