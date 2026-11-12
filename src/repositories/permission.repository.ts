import { prisma } from '@/database/postgres.database';

export default {
  findMany() {
    return prisma.rolePermission.findMany();
  },
};
