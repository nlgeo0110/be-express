import { Queue } from 'bullmq';
import { redisClient } from '@/database/redis.database';
import { DEFAULT_JOB_OPTIONS, QUEUE_NAMES } from '@/queues/queue.config';
import {
  EMAIL_JOBS,
  EmailJobData,
  EmailJobName,
  EmailJobPayloads,
} from './email.types';

const emailQueue = new Queue<EmailJobData, void, EmailJobName>(
  QUEUE_NAMES.EMAIL,
  {
    connection: redisClient,
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  }
);

export const emailProducer = {
  // OTP có hạn dùng ngắn: retry ít và nhanh, xoá ngay khi gửi xong để OTP không nằm lại trong Redis
  sendResetPasswordOtp: (data: EmailJobPayloads['RESET_PASSWORD_OTP']) =>
    emailQueue.add(EMAIL_JOBS.RESET_PASSWORD_OTP, data, {
      attempts: 2,
      backoff: { type: 'fixed', delay: 3000 },
      removeOnComplete: true,
      removeOnFail: { age: 3600 },
    }),

  sendResetPasswordSuccess: (
    data: EmailJobPayloads['RESET_PASSWORD_SUCCESS']
  ) => emailQueue.add(EMAIL_JOBS.RESET_PASSWORD_SUCCESS, data),
};

export const closeEmailProducer = () => emailQueue.close();
