import { All, Controller, Inject, Req, Res } from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";
import { AUTH } from "./auth.tokens";
import type { Auth } from "./auth.config";

@Controller("auth")
export class AuthController {
  constructor(@Inject(AUTH) private readonly auth: Auth) {}

  @All("*")
  async handle(
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ): Promise<void> {
    const url = new URL(
      request.url,
      `http://${request.headers.host ?? "localhost"}`,
    );
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
