import { Worker } from 'bullmq';
import { bullConnection } from '@/database/redis.database';
import { QUEUE_NAMES } from '@/queues/queue.config';
import { emailProcessor } from './email.processor';
import { EmailJobData } from './email.types';

// Factory: chỉ tạo Worker khi entry worker.ts gọi, import file này không tự chạy worker
export const createEmailWorker = () => {
  const worker = new Worker<EmailJobData, void, string>(
    QUEUE_NAMES.EMAIL,
    emailProcessor,
    {
      connection: bullConnection,
      concurrency: 5,
    }
  );

  worker.on('completed', (job) => {
    console.info(`[email] job ${job.id} (${job.name}) completed`);
  });

  worker.on('failed', (job, err) => {
    const attempts = job ? `${job.attemptsMade}/${job.opts.attempts ?? 1}` : '';
    console.error(
      `[email] job ${job?.id} (${job?.name}) failed ${attempts}:`,
      err.message
    );
  });

  worker.on('error', (err) => {
    console.error('[email] worker error:', err);
  });

  return worker;
};
