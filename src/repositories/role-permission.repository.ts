import { prisma } from '@/database/postgres.database';

export default {
  findMatrix() {
    return Promise.all([
      prisma.role.findMany({
        orderBy: { id: 'asc' },
        select: {
          id: true,
          name: true,
          rolePermissions: {
            select: { permissionId: true },
            orderBy: { permissionId: 'asc' },
          },
        },
      }),
      prisma.permission.findMany({
        orderBy: { id: 'asc' },
        select: { id: true, value: true },
      }),
    ]);
  },

  setPermissions(roles) {
    return prisma.$transaction([
      prisma.rolePermission.deleteMany({
        where: { roleId: { in: roles.map((r) => r.roleId) } },
      }),
      prisma.rolePermission.createMany({
        data: roles.flatMap(({ roleId, permissionIds }) =>
          [...new Set(permissionIds)].map((permissionId) => ({
            roleId,
            permissionId,
          }))
        ),
      }),
    ]);
  },
};
