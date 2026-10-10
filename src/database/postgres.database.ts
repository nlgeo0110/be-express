import { PrismaPg } from '@prisma/adapter-pg';
import { env, isProd } from '@/config/env';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({
  adapter,
  log: isProd ? ['warn', 'error'] : ['query', 'warn', 'error'],
});

export { prisma };
