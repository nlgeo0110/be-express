import { prisma } from '@/database/postgres.database';
import { Prisma } from '@/generated/prisma/client';

export const authUserInclude = {
  userRoles: {
    select: {
      role: {
        select: {
          name: true,
          rolePermissions: {
            select: { permission: { select: { value: true } } },
          },
        },
      },
    },
  },
} satisfies Prisma.UserInclude;

export default {
  findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
      omit: { password: true },
      include: authUserInclude,
    });
  },

  findByUsernameWithPassword(username: string) {
    return prisma.user.findUnique({
      where: { username },
      include: authUserInclude,
    });
  },

  findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      omit: { password: true },
      include: authUserInclude,
    });
  },

  findByIdWithPassword(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: authUserInclude,
    });
  },

  findMany() {
    return prisma.user.findMany({
      orderBy: { updatedAt: 'desc' },
      omit: { password: true },
      include: authUserInclude,
    });
  },

  create({
    roleIds,
    ...data
  }: {
    username: string;
    password: string;
    name?: string;
    roleIds?: number[];
  }) {
    return prisma.user.create({
      data: {
        ...data,
        ...(roleIds && {
          userRoles: {
            create: roleIds.map((roleId) => ({ roleId })),
          },
        }),
      },
      omit: { password: true },
      include: authUserInclude,
    });
  },

  update(id: number, { name, roleIds }: { name?: string; roleIds?: number[] }) {
    return prisma.$transaction(async (tx) => {
      if (roleIds) {
        await tx.userRole.deleteMany({ where: { userId: id } });
        await tx.userRole.createMany({
          data: roleIds.map((roleId) => ({ userId: id, roleId })),
        });
      }

      return tx.user.update({
        where: { id },
        data: { name },
        omit: { password: true },
        include: authUserInclude,
      });
    });
  },

  delete(id: number) {
    return prisma.$transaction([
      prisma.userRole.deleteMany({ where: { userId: id } }),
      prisma.user.delete({
        where: { id },
        omit: { password: true },
      }),
    ]);
  },
};
