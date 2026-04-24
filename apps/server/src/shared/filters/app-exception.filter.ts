import {
  Catch,
  HttpException,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
} from "@nestjs/common";
import type { FastifyReply } from "fastify";
import { ZodError } from "zod";
import { AppError } from "@/shared/errors/app-error";

interface ErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const reply = host.switchToHttp().getResponse<FastifyReply>();

    let status = 500;
    let body: ErrorBody = {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Erreur interne du serveur" },
    };

    if (exception instanceof AppError) {
      status = exception.status;
      body = {
        success: false,
        error: {
          code: exception.code,
          message: exception.message,
          details: exception.details,
        },
      };
    } else if (exception instanceof ZodError) {
      status = 422;
      body = {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Données invalides",
          details: exception.issues,
        },
      };
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      const fallbackCode = exception.name
        .replace(/Exception$/, "")
        .toUpperCase();

      let code = fallbackCode;
      let message = exception.message;
      let details: unknown;

      if (typeof response === "string") {
        message = response;
      } else if (response !== null && typeof response === "object") {
        const r = response as {
          code?: unknown;
          message?: unknown;
          details?: unknown;
        };
        if (typeof r.code === "string") code = r.code;
        if (typeof r.message === "string") message = r.message;
        details = r.details;
      }

      body = {
        success: false,
        error: { code, message, details },
      };
    } else if (exception instanceof Error) {
      this.logger.error(exception.stack ?? exception.message);
    } else {
      this.logger.error(String(exception));
    }

    void reply.status(status).send(body);
  }
}
