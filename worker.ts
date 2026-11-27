import { bullConnection } from '@/database/redis.database';
import { closeTransport, verifyTransport } from '@/modules/email';
import { createEmailWorker } from '@/queues/email/email.worker';
import type { Worker } from 'bullmq';

let workers: Worker[] = [];
let shuttingDown = false;

const shutdown = async (signal: string) => {
  if (shuttingDown) return;
  shuttingDown = true;
  console.info(`${signal} received, closing workers...`);

  try {
    // close() chờ các job đang chạy xong rồi mới dừng, tránh job bị stalled và gửi email trùng
    await Promise.all(workers.map((w) => w.close()));
    closeTransport();
    await bullConnection.quit();
    process.exit(0);
  } catch (err) {
    console.error('Error during worker shutdown:', err);
    process.exit(1);
  }
};

const bootstrap = async () => {
  // Sai cấu hình SMTP thì dừng ngay, không để job fail hàng loạt rồi mới phát hiện
  await verifyTransport();
  console.info('SMTP connection verified');

  workers = [createEmailWorker()];
  console.info(`Worker started: ${workers.map((w) => w.name).join(', ')}`);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

bootstrap().catch(async (err) => {
  console.error('Worker failed to start:', err);
  await bullConnection.quit().catch(() => {});
  process.exit(1);
});
