import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { EnvModule } from "./config/env.module";
import { EmailModule } from "./email/email.module";
import { HealthController } from "./health/health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { StorageModule } from "./storage/storage.module";
import { OrganizationModule } from "./organization/organization.module";

@Module({
  imports: [
    EnvModule,
    PrismaModule,
    EmailModule,
    AuthModule,
    StorageModule,
    OrganizationModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
