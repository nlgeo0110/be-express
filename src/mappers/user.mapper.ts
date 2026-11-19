import { Prisma, RoleName } from '@/generated/prisma/client';
import { authUserInclude } from '@/repositories/user.repository';

type WithRoles = {
  userRoles: {
    role: {
      name: RoleName;
      rolePermissions: { permission: { value: string } }[];
    };
  }[];
};

export type UserWithRolePermissions = Prisma.UserGetPayload<{
  omit: { password: true };
  include: typeof authUserInclude;
}>;

export type AuthUser<T extends WithRoles = UserWithRolePermissions> = Omit<
  T,
  'userRoles'
> & { roles: RoleName[]; permissions: string[] };

export const toAuthUser = <T extends WithRoles>({
  userRoles,
  ...user
}: T): AuthUser<T> => ({
  ...user,
  roles: [...new Set(userRoles.map(({ role }) => role.name))],
  permissions: [
    ...new Set(
      userRoles.flatMap(({ role }) =>
        role.rolePermissions.map(({ permission }) => permission.value)
      )
    ),
  ],
});

export type UserResponse = Pick<
  AuthUser,
  'id' | 'email' | 'permissions' | 'createdAt' | 'updatedAt'
>;

export const toUserResponse = ({
  id,
  email,
  permissions,
  createdAt,
  updatedAt,
}: UserResponse): UserResponse => ({
  id,
  email,
  permissions,
  createdAt,
  updatedAt,
});

export type AdminUserResponse = Pick<
  AuthUser,
  'id' | 'email' | 'name' | 'roles' | 'createdAt' | 'updatedAt'
>;

export const toAdminUserResponse = ({
  id,
  email,
  name,
  roles,
  createdAt,
  updatedAt,
}: AdminUserResponse): AdminUserResponse => ({
  id,
  email,
  name,
  roles,
  createdAt,
  updatedAt,
});
