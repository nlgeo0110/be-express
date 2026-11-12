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
  'id' | 'username' | 'permissions' | 'createdAt' | 'updatedAt'
>;

export const toUserResponse = ({
  id,
  username,
  permissions,
  createdAt,
  updatedAt,
}: UserResponse): UserResponse => ({
  id,
  username,
  permissions,
  createdAt,
  updatedAt,
});

export type AdminUserResponse = Pick<
  AuthUser,
  'id' | 'username' | 'name' | 'roles' | 'createdAt' | 'updatedAt'
>;

export const toAdminUserResponse = ({
  id,
  username,
  name,
  roles,
  createdAt,
  updatedAt,
}: AdminUserResponse): AdminUserResponse => ({
  id,
  username,
  name,
  roles,
  createdAt,
  updatedAt,
});
