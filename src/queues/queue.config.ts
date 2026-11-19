import type { DefaultJobOptions } from 'bullmq';

export const QUEUE_NAMES = {
  EMAIL: 'email',
} as const;

export const DEFAULT_JOB_OPTIONS: DefaultJobOptions = {
  attempts: 3,
  backoff: { type: 'exponential', delay: 5000 },
  removeOnComplete: { count: 1000 },
  removeOnFail: { age: 7 * 24 * 3600 },
};
