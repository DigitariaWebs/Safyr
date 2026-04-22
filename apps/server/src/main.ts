import "reflect-metadata";

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { loadEnv } from "./config/env";
import { AppExceptionFilter } from "./shared/filters/app-exception.filter";
import { EnvelopeInterceptor } from "./shared/interceptors/envelope.interceptor";

async function bootstrap(): Promise<void> {
  const env = loadEnv();

  const adapter = new FastifyAdapter({ logger: { level: env.LOG_LEVEL } });
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    {
      bufferLogs: true,
    },
  );

  app.setGlobalPrefix("api");
  app.useGlobalInterceptors(new EnvelopeInterceptor());
  app.useGlobalFilters(new AppExceptionFilter());

  const { default: fastifyCors } = await import("@fastify/cors");
  // Nest bundles its own fastify instance; plugin types drift across the boundary.
  await app.register(fastifyCors as never, {
    origin: env.ALLOWED_ORIGINS,
    credentials: true,
  });

  const { default: fastifyRateLimit } = await import("@fastify/rate-limit");
  await app.register(fastifyRateLimit as never, {
    max: 100,
    timeWindow: "1 minute",
  });

  await app.listen({ port: env.PORT, host: "0.0.0.0" });
  Logger.log(
    `Safyr server listening on http://localhost:${env.PORT}`,
    "Bootstrap",
  );
}

void bootstrap();
