import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import { UnauthorizedError } from "@/shared/errors/app-error";
import { AUTH } from "./auth.tokens";
import type { Auth } from "./auth.config";

declare module "fastify" {
  interface FastifyRequest {
    authSession?: Awaited<ReturnType<Auth["api"]["getSession"]>>;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AUTH) private readonly auth: Auth) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const headers = new Headers();
    for (const [key, value] of Object.entries(request.headers)) {
      if (!value) continue;
      if (Array.isArray(value)) {
        value.forEach((v) => headers.append(key, v));
      } else {
        headers.set(key, String(value));
      }
    }

    const session = await this.auth.api.getSession({ headers });
    if (!session) throw new UnauthorizedError();

    request.authSession = session;
    return true;
  }
}
