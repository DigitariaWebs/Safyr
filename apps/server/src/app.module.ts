import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { EnvModule } from "./config/env.module";
import { EmailModule } from "./email/email.module";
import { HealthController } from "./health/health.controller";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
  imports: [EnvModule, PrismaModule, EmailModule, AuthModule],
  controllers: [HealthController],
})
export class AppModule {}
