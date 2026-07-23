import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';

export interface SendMailInput {
  to: string;
  subject: string;
  html: string;
}

/**
 * Thin email provider abstraction over Nodemailer.
 *
 * When SMTP_HOST is empty (local development), messages are logged instead of sent
 * so password-reset and enquiry flows can still be tested.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('smtp.host');
    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port: this.configService.get<number>('smtp.port') ?? 587,
        secure: false,
        auth: {
          user: this.configService.get<string>('smtp.user'),
          pass: this.configService.get<string>('smtp.password'),
        },
      });
    }
  }

  /**
   * Sends an HTML email, or logs it when SMTP is not configured.
   */
  async sendMail(input: SendMailInput): Promise<void> {
    const fromName = this.configService.get<string>('smtp.fromName') ?? 'YogiSpeaks';
    const fromEmail =
      this.configService.get<string>('smtp.fromEmail') ?? 'noreply@yogispeaks.local';
    const from = `"${fromName}" <${fromEmail}>`;

    if (!this.transporter) {
      this.logger.log(
        `[dev-mail] To: ${input.to} | Subject: ${input.subject}\n${input.html}`,
      );
      return;
    }

    await this.transporter.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });
  }
}
