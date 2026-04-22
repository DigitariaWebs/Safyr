import { Inject, Injectable, Logger } from "@nestjs/common";
import { render } from "@react-email/render";
import nodemailer, { type Transporter } from "nodemailer";
import { ENV } from "@/config/env.module";
import type { Env } from "@/config/env";
import { MagicLinkEmail } from "@/email/templates/magic-link";
import { OtpEmail } from "@/email/templates/otp";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transport: Transporter;

  constructor(@Inject(ENV) private readonly env: Env) {
    this.transport = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
  }

  async sendMagicLink(
    to: string,
    params: { url: string; expiresInMinutes?: number },
  ): Promise<void> {
    const expiresInMinutes = params.expiresInMinutes ?? 10;
    this.logger.log(`Magic link for ${to} → ${params.url}`);

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

  async sendOtp(
    to: string,
    otp: string,
    params?: {
      type?:
        | "sign-in"
        | "email-verification"
        | "forget-password"
        | "change-email";
      expiresInMinutes?: number;
    },
  ): Promise<void> {
    const expiresInMinutes = params?.expiresInMinutes ?? 5;
    const html = await render(
      OtpEmail({ otp, type: params?.type ?? "sign-in", expiresInMinutes }),
    );

    await this.transport.sendMail({
      from: this.env.SMTP_FROM,
      to,
      subject: "Votre code de connexion Safyr",
      html,
    });
  }
}
