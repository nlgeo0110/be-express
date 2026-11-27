export const EMAIL_JOBS = {
  RESET_PASSWORD_OTP: 'RESET_PASSWORD_OTP',
  RESET_PASSWORD_SUCCESS: 'RESET_PASSWORD_SUCCESS',
} as const;

export type EmailJobPayloads = {
  [EMAIL_JOBS.RESET_PASSWORD_OTP]: { to: string; otp: string };
  // ISO string: job data được serialize thành JSON
  [EMAIL_JOBS.RESET_PASSWORD_SUCCESS]: { to: string; changedAt: string };
};
export type EmailJobName = keyof EmailJobPayloads;
export type EmailJobData = EmailJobPayloads[EmailJobName];
