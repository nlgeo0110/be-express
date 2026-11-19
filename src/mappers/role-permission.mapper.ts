import rolePermissionRepository from '@/repositories/role-permission.repository';

type MaxtrixRows = Awaited<
  ReturnType<typeof rolePermissionRepository.findMatrix>
>;

type PermissionItem = { id: number; value: string; action: string };

export const toPermissionMatrix = ([roles, permissions]: MaxtrixRows) => {
  const groups = new Map<string, PermissionItem[]>();

  for (const { id, value } of permissions) {
    const i = value.indexOf(':');
    const resource = i === -1 ? '' : value.slice(0, i);
    const action = i === -1 ? '' : value.slice(i + 1);
    const list = groups.get(resource) ?? [];
    list.push({ id, value, action });
    groups.set(resource, list);
  }

  return {
    roles: roles.map(({ rolePermissions, ...role }) => ({
      ...role,
      permissionIds: rolePermissions.map((rp) => rp.permissionId),
    })),
    permissionGroups: [...groups].map(([resource, permissions]) => ({
      resource,
      permissions,
    })),
  };
};
