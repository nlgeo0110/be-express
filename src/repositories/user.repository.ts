import { prisma } from '@/database/postgres.database';

export default {
  findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
      omit: { password: true },
    });
  },

  findByUsernameWithPassword(username: string) {
    return prisma.user.findUnique({ where: { username } });
  },

  findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
  },

  findByIdWithPassword(id: number) {
    return prisma.user.findUnique({ where: { id } });
  },

  create(data: { username: string; password: string }) {
    return prisma.user.create({ data, omit: { password: true } });
  },
};
