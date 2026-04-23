import {
  Inject,
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import { ENV } from "@/config/env.module";
import type { Env } from "@/config/env";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(@Inject(ENV) env: Env) {
    super({
      adapter: new PrismaPg({ connectionString: env.DATABASE_URL }),
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log("Prisma connected");
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  async cleanDb(): Promise<void> {
    if (process.env.NODE_ENV !== "test") {
      throw new Error("cleanDb only allowed in test environment");
    }

    const tablenames = await this.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename != '_prisma_migrations'`;

    const tables = tablenames
      .map(({ tablename }) => `"${tablename}"`)
      .join(", ");

    try {
      await this.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    } catch (error) {
      this.logger.error("Error cleaning database", error);
      throw error;
    }
  }

  async seedDb(): Promise<void> {
    if (process.env.NODE_ENV !== "test") {
      throw new Error("seedDb only allowed in test environment");
    }

    const testEmail = "test@example.com";
    const testOrgSlug = "test-org";

    const user = await this.user.create({
      data: {
        id: "test-user-id",
        email: testEmail,
        name: "Test User",
        username: "testuser",
        displayUsername: "testuser",
        emailVerified: true,
      },
    });

    const org = await this.organization.create({
      data: {
        id: "test-org-id",
        name: "Test Org",
        slug: testOrgSlug,
        createdAt: new Date(),
      },
    });

    await this.member.create({
      data: {
        id: "test-member-id",
        organizationId: org.id,
        userId: user.id,
        role: "owner",
        createdAt: new Date(),
      },
    });
  }
}
