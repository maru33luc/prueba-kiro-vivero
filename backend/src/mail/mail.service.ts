import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const appUrl = this.configService.get<string>('APP_URL', 'http://localhost:4200');
    const resetLink = `${appUrl}/auth/reset-password?token=${token}`;

    // In production, replace this with a real email provider (e.g. nodemailer, SendGrid)
    this.logger.log(`[MailService] Password reset email to ${email}: ${resetLink}`);
  }
}
