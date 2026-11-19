export type EmailTemplates = {
  RESET_PASSWORD_OTP: { otp: string; expiresInMinutes: number };
  RESET_PASSWORD_SUCCESS: { changedAt: string };
};

export type EmailTemplateName = keyof EmailTemplates;

export type RenderedEmail = {
  subject: string;
  html: string;
};
