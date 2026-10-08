import { prisma } from '@/database/postgres.database';

export default {
  findByIds(ids: number[]) {
    return prisma.attributeValue.findMany({
      where: { id: { in: ids } },
      select: { id: true, attributeId: true },
    });
  },
};
