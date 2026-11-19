import { Redis } from 'ioredis';
import { env } from '@/config/env';

const redisClient = new Redis(env.REDIS_URL);

const bullConnection = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export { redisClient, bullConnection };
