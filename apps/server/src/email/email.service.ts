import { Inject, Injectable, Logger } from "@nestjs/common";
import { render } from "@react-email/render";
import nodemailer, { type Transporter } from "nodemailer";
import { ENV } from "../config/env.module";
import type { Env } from "../config/env";
import { MagicLinkEmail } from "./templates/magic-link";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transport: Transporter | null;

  constructor(@Inject(ENV) private readonly env: Env) {
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
      this.transport = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      });
    } else {
      this.transport = null;
      this.logger.warn(
        "SMTP not configured — magic-link emails will be console-logged only",
      );
    }
  }

  async sendMagicLink(
    to: string,
    params: { url: string; expiresInMinutes?: number },
  ): Promise<void> {
    const expiresInMinutes = params.expiresInMinutes ?? 10;
    this.logger.log(`Magic link for ${to} → ${params.url}`);

    if (!this.transport) return;

    const html = await render(
      MagicLinkEmail({ url: params.url, expiresInMinutes }),
    );
    await this.transport.sendMail({
      from: this.env.SMTP_FROM,
      to,
      subject: "Votre lien de connexion Safyr",
      html,
    });
  }
}
