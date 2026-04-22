import { All, Controller, Inject, Req, Res } from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";
import { AUTH } from "./auth.tokens";
import type { Auth } from "./auth.config";

@Controller("auth")
export class AuthController {
  constructor(@Inject(AUTH) private readonly auth: Auth) {}

  private getFirstHeaderValue(
    value: string | string[] | undefined,
  ): string | undefined {
    if (!value) return undefined;
    const firstValue = Array.isArray(value) ? value[0] : value;
    return firstValue.split(",")[0]?.trim() || undefined;
  }

  private getBaseOrigin(request: FastifyRequest): string {
    const configuredOrigin = process.env.BETTER_AUTH_URL;
    if (configuredOrigin) {
      return new URL(configuredOrigin).origin;
    }

    const forwardedProto =
      this.getFirstHeaderValue(request.headers["x-forwarded-proto"]) ?? "http";
    const forwardedHost = this.getFirstHeaderValue(
      request.headers["x-forwarded-host"],
    );
    const host =
      forwardedHost ??
      this.getFirstHeaderValue(request.headers.host) ??
      "localhost";

    return `${forwardedProto}://${host}`;
  }

  @All("*")
  async handle(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    const url = new URL(request.url, this.getBaseOrigin(request));
    const headers = new Headers();
    for (const [key, value] of Object.entries(request.headers)) {
      if (!value) continue;
      if (Array.isArray(value)) headers.set(key, value.join(","));
      else headers.set(key, String(value));
    }

    const req = new Request(url.toString(), {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method)
        ? undefined
        : JSON.stringify(request.body ?? {}),
    });

    const response = await this.auth.handler(req);

    reply.status(response.status);
    response.headers.forEach((value, key) => {
      reply.header(key, value);
    });
    const text = response.body ? await response.text() : null;
    reply.send(text);
  }
}
