import { emailConfig } from './email.config';
import { isPermanentSmtpError, PermanentEmailError } from './email.errors';
import { transporter } from './email.transport';
import type { EmailTemplateName, EmailTemplates } from './email.types';
import { renderEmail } from './templates';

// t***@gmail.com — không log nguyên địa chỉ email
const maskEmail = (email: string) => {
  const [name, domain] = email.split('@');
  if (!domain) return '***';
  return `${name.slice(0, 1)}***@${domain}`;
};

export const emailService = {
  async send<K extends EmailTemplateName>(
    template: K,
    to: string,
    data: EmailTemplates[K]
  ): Promise<void> {
    const { subject, html } = await renderEmail(template, data);

    try {
      const info = await transporter.sendMail({
        from: emailConfig.from,
        to,
        subject,
        html,
      });
      console.info(
        `[email] sent template=${template} to=${maskEmail(to)} messageId=${info.messageId}`
      );
    } catch (err) {
      if (isPermanentSmtpError(err)) {
        throw new PermanentEmailError(
          `Email ${template} to ${maskEmail(to)} rejected permanently`,
          { cause: err }
        );
      }
      throw err;
    }
  },
};
