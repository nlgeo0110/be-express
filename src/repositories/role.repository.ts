import { prisma } from '@/database/postgres.database';
import { RoleName } from '@/generated/prisma/enums';

export default {
  findMany() {
    return prisma.role.findMany({});
  },

  findByNames(names: RoleName[]) {
    return prisma.role.findMany({ where: { name: { in: names } } });
  },

  create(data) {
    return prisma.role.create({
      data,
    });
  },

  assignRole(data) {
    return prisma.userRole.createMany({
      data,
    });
  },
};
