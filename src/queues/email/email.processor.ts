import { Job, UnrecoverableError } from 'bullmq';
import { env } from '@/config/env';
import { emailService, PermanentEmailError } from '@/modules/email';
import { EmailJobData, EmailJobName, EmailJobPayloads } from './email.types';

type EmailHandlers = {
  [K in EmailJobName]: (data: EmailJobPayloads[K]) => Promise<void>;
};

// Thêm job mới vào EmailJobPayloads mà quên handler ở đây → TypeScript báo lỗi
const handlers: EmailHandlers = {
  RESET_PASSWORD_OTP: ({ to, otp }) =>
    emailService.send('RESET_PASSWORD_OTP', to, {
      otp,
      expiresInMinutes: Math.round(env.OTP_TTL / 60),
    }),
  RESET_PASSWORD_SUCCESS: ({ to, changedAt }) =>
    emailService.send('RESET_PASSWORD_SUCCESS', to, { changedAt }),
};

const isEmailJobName = (name: string): name is EmailJobName =>
  Object.hasOwn(handlers, name);

export const emailProcessor = async (
  job: Job<EmailJobData, void, string>
): Promise<void> => {
  if (!isEmailJobName(job.name)) {
    // Không retry: job sai tên thì chạy lại bao nhiêu lần cũng không thành công
    throw new UnrecoverableError(`Unknown email job: ${job.name}`);
  }

  const handler = handlers[job.name] as (data: EmailJobData) => Promise<void>;

  try {
    await handler(job.data);
  } catch (err) {
    // SMTP từ chối vĩnh viễn (địa chỉ sai, mailbox không tồn tại) → không retry
    if (err instanceof PermanentEmailError) {
      throw new UnrecoverableError(err.message);
    }
    throw err;
  }
};
