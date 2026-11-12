import { toPermissionMatrix } from '@/mappers/role-permission.mapper';
import rolePermissionRepository from '@/repositories/role-permission.repository';

export default {
  async getMatrix() {
    return toPermissionMatrix(await rolePermissionRepository.findMatrix());
  },

  async setPermissions(data) {
    await rolePermissionRepository.setPermissions(data);
    return toPermissionMatrix(await rolePermissionRepository.findMatrix());
  },
};
